import { getServerSession } from "next-auth";
import { ApiError, Client } from "square/legacy";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type InvoiceItem = {
  price?: number | string;
  quantity?: number | string;
  discount?: number | string;
};

type PaymentRequest = {
  sourceId?: string;
  orderId?: string;
};

function getAmountInCents(productsJson: string, invoiceDiscount: number) {
  const items = JSON.parse(productsJson) as InvoiceItem[];

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Invoice has no line items");
  }

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price ?? 0);
    const quantity = Number(item.quantity ?? 1);

    if (!Number.isFinite(price) || !Number.isFinite(quantity) || price < 0 || quantity <= 0) {
      throw new Error("Invoice contains an invalid line item");
    }

    return total + price * quantity;
  }, 0);

  const itemDiscounts = items.reduce((total, item) => {
    const discount = Number(item.discount ?? 0);
    if (!Number.isFinite(discount) || discount < 0) {
      throw new Error("Invoice contains an invalid discount");
    }
    return total + discount;
  }, 0);

  if (!Number.isFinite(invoiceDiscount) || invoiceDiscount < 0) {
    throw new Error("Invoice contains an invalid discount");
  }

  const total = subtotal - itemDiscounts - invoiceDiscount;
  const cents = Math.round(total * 100);

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new Error("Invoice total must be greater than zero");
  }

  return cents;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;

    if (!sessionUser?.id) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const { sourceId, orderId } = (await request.json()) as PaymentRequest;
    if (!sourceId || !orderId) {
      return Response.json({ error: "sourceId and orderId are required" }, { status: 400 });
    }

    if (!/^[0-9a-f]{24}$/i.test(orderId)) {
      return Response.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== sessionUser.id && sessionUser.role?.toLowerCase() !== "admin") {
      return Response.json({ error: "You cannot pay this order" }, { status: 403 });
    }

    if (order.paid) {
      return Response.json({ error: "Order is already paid" }, { status: 409 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { orderId } });
    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("SQUARE_ACCESS_TOKEN is not configured");
      return Response.json({ error: "Payment service is not configured" }, { status: 503 });
    }

    const amount = getAmountInCents(invoice.productsJson, invoice.discount);
    const { paymentsApi } = new Client({
      bearerAuthCredentials: { accessToken },
    });

    const { result } = await paymentsApi.createPayment({
      idempotencyKey: `order-${order.id}`,
      sourceId,
      amountMoney: {
        currency: "USD",
        amount: BigInt(amount),
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      referenceId: order.id,
      note: `StoryMelody order ${order.id}`,
    });

    if (!result.payment?.id || result.payment.status !== "COMPLETED") {
      console.error("Square returned an incomplete payment", result.payment?.status);
      return Response.json({ error: "Payment was not completed" }, { status: 502 });
    }

    await prisma.$transaction([
      prisma.invoice.update({
        where: { orderId },
        data: { paidDate: new Date().toLocaleDateString("en-US") },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { paid: true, status: "In production" },
      }),
    ]);

    return Response.json({
      payment: {
        id: result.payment.id,
        status: result.payment.status,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON request or invoice data" }, { status: 400 });
    }

    if (error instanceof ApiError) {
      console.error("Square payment error", error.result);
      return Response.json({ error: "Payment was declined or could not be processed" }, { status: 402 });
    }

    console.error("POST /api/payment error", error);
    return Response.json({ error: "Payment could not be processed" }, { status: 500 });
  }
}
