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
    const { id, email, role, phone, name } = body;
    
    let user;
    if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      const existing = await prisma.user.findUnique({ where: { id } });
      if (existing) {
        user = await prisma.user.update({
          where: { id },
          data: {
            email,
            role: role || undefined,
            phone: phone || undefined,
            name: name || undefined,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            role: role || "user",
            phone: phone || "",
            name: name || "",
          },
        });
      }
    } else {
      // No valid id: upsert by unique email
      user = await prisma.user.upsert({
        where: { email },
        update: {
          role: role || undefined,
          phone: phone || undefined,
          name: name || undefined,
        },
        create: {
          email,
          role: role || "user",
          phone: phone || "",
          name: name || "",
        },
      });
    }
    
    return Response.json(user);
  } catch (error) {
    console.error("POST /api/users error:", error);
    return Response.json({ error: "Failed to create/update user" }, { status: 500 });
  }
}
