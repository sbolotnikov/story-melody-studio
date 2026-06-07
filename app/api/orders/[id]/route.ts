import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!(id.length === 24 && /^[0-9a-fA-F]+$/.test(id))) {
      return Response.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    
    if (order) {
      return Response.json(order);
    } else {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!(id.length === 24 && /^[0-9a-fA-F]+$/.test(id))) {
      return Response.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    
    // Ensure we don't try to update the ID or related fields incorrectly
    const { id: _, userId, ...updateData } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: updateData
    });
    return Response.json(order);
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!(id.length === 24 && /^[0-9a-fA-F]+$/.test(id))) {
      return Response.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id }
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
