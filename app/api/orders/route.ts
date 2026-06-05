import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");

    let userId = userIdParam;

    // If userId looks like a firebaseId (not a 24-char hex), resolve it
    if (userIdParam && !(userIdParam.length === 24 && /^[0-9a-fA-F]+$/.test(userIdParam))) {
      const user = await prisma.user.findUnique({
        where: { firebaseId: userIdParam },
        select: { id: true }
      });
      if (user) {
        userId = user.id;
      } else {
        // If user not found, return empty list or handle accordingly
        return Response.json([]);
      }
    }

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
    let { id, userId, ...data } = body;
    
    // Resolve userId if it's a firebaseId
    if (userId && !(userId.length === 24 && /^[0-9a-fA-F]+$/.test(userId))) {
      const user = await prisma.user.findUnique({
        where: { firebaseId: userId },
        select: { id: true }
      });
      if (user) {
        userId = user.id;
      } else {
        // Option 1: Create user on the fly if needed, or Option 2: Error
        // For now, let's keep userId as is or set to null if not found
        // but since Order.userId is db.ObjectId, it MUST be valid or null.
        userId = null;
      }
    }

    let order;
    if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      order = await prisma.order.upsert({
        where: { id },
        update: { ...data, userId },
        create: { ...data, userId }
      });
    } else {
      // If id was provided but not valid ObjectId, we ignore it for creation
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
