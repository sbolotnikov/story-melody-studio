import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true
          }
        }
      }
    });
    return Response.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, ...data } = body;

    let order;
    if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      order = await prisma.order.upsert({
        where: { id },
        update: { ...data, userId },
        create: { ...data, userId }
      });
    } else {
      order = await prisma.order.create({ 
        data: { ...data, userId } 
      });
    }
    return Response.json(order);
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ error: "Failed to create/update order" }, { status: 500 });
  }
}
