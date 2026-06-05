import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
    return Response.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firebaseId, email, role, phone, name } = body;
    
    // In MongoDB, we use firebaseId as the unique identifier from the frontend
    // if it's provided, otherwise we use email.
    const user = await prisma.user.upsert({
      where: firebaseId ? { firebaseId } : { email },
      update: { 
        email, 
        role: role || undefined, 
        phone: phone || undefined, 
        name: name || undefined 
      },
      create: { 
        firebaseId, 
        email, 
        role: role || "user", 
        phone: phone || "", 
        name: name || "" 
      }
    });
    
    return Response.json(user);
  } catch (error) {
    console.error("POST /api/users error:", error);
    return Response.json({ error: "Failed to create/update user" }, { status: 500 });
  }
}
