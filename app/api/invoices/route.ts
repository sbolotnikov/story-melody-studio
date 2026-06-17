import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Reuse Prisma client between hot reloads in development to avoid exhausting connections
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type EmailPayload = {
  toEmail?: string;
  emailSubject?: string;
  emailBody?: string;
  pdfAttachedName?: string;
  pdfBase64?: string;
};

type InvoicePayload = {
  orderId?: string;
  discount?: number;
  productsJson?: string | Record<string, unknown>[];
  paidDate?: string;
};

async function parseJsonSafe<T = unknown>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch {
    return {} as T;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const orderId = url.searchParams.get('orderId');

  try {
    if (id) {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      return NextResponse.json(invoice);
    }

    if (orderId) {
      const invoice = await prisma.invoice.findUnique({ where: { orderId } });
      if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      return NextResponse.json(invoice);
    }

    const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  // Support a POST to /api/invoices/send-email for the previous simulated email endpoint
  if (url.pathname.endsWith('/send-email')) {
    const body = await parseJsonSafe<EmailPayload>(request);
    const { toEmail, emailSubject, emailBody, pdfAttachedName, pdfBase64 } = body as EmailPayload;

    console.log('========================================');
    console.log(`SIMULATING EMAIL SEND TO: ${toEmail}`);
    console.log(`SUBJECT: ${emailSubject}`);
    if (pdfAttachedName) {
      console.log(`ATTACHMENT (PDF FORMAT): ${pdfAttachedName}`);
      if (pdfBase64) console.log(`PDF ATTACHMENT (truncated): ${String(pdfBase64).substring(0, 80)}...`);
    }
    console.log('BODY:');
    console.log(emailBody);
    console.log('========================================');

    return NextResponse.json({ success: true, message: `Email sent successfully to ${toEmail}!` });
  }

  try {
    const body = await parseJsonSafe<InvoicePayload>(request);
    const { orderId, discount = 0, productsJson = '', paidDate } = body;

    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

    const invoice = await prisma.invoice.upsert({
      where: { orderId },
      update: {
        discount: Number(discount) || 0,
        productsJson: typeof productsJson === 'string' ? productsJson : JSON.stringify(productsJson),
        paidDate,
      },
      create: {
        orderId,
        discount: Number(discount) || 0,
        productsJson: typeof productsJson === 'string' ? productsJson : JSON.stringify(productsJson),
        paidDate,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('POST /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to save invoice' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await parseJsonSafe<Record<string, unknown>>(request);
    const { id, orderId, ...data } = body as Record<string, unknown>;

    if (!id && !orderId) return NextResponse.json({ error: 'id or orderId required' }, { status: 400 });

    const where = id ? { id: id as string } : { orderId: orderId as string };

    if (data.discount !== undefined) data.discount = Number(data.discount) || 0;
    if (data.productsJson && typeof data.productsJson !== 'string') data.productsJson = JSON.stringify(data.productsJson);

    const updated = await prisma.invoice.update({ where, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const orderId = url.searchParams.get('orderId');

  if (!id && !orderId) return NextResponse.json({ error: 'id or orderId required' }, { status: 400 });

  try {
    if (id) {
      await prisma.invoice.delete({ where: { id } });
    } else {
      await prisma.invoice.delete({ where: { orderId: orderId as string } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
