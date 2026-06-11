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
    const { id, email, role, phone, name, image } = body;
    
    // normalize empty strings to undefined so Prisma won't overwrite unintentionally
    const safePhone = phone === undefined || phone === null || phone === '' ? undefined : phone;
    const safeName = name === undefined || name === null || name === '' ? undefined : name;
    const safeRole = role === undefined || role === null || role === '' ? undefined : role;
    const safeImage = image === undefined || image === null || image === '' ? undefined : image;
    
    let user;
    if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      const existing = await prisma.user.findUnique({ where: { id } });
      if (existing) {
        user = await prisma.user.update({
          where: { id },
          data: {
            email,
            role: safeRole,
            phone: safePhone,
            name: safeName,
            image: safeImage,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            role: role || "user",
            phone: phone || "",
            name: name || "",
            image: image || undefined,
          },
        });
      }
    } else {
      // No valid id: upsert by unique email
      user = await prisma.user.upsert({
        where: { email },
        update: {
          role: safeRole,
          phone: safePhone,
          name: safeName,
          image: safeImage,
        },
        create: {
          email,
          role: role || "user",
          phone: phone || "",
          name: name || "",
          image: image || undefined,
        },
      });
    }
    
    return Response.json(user);
  } catch (error) {
    console.error("POST /api/users error:", error);
    return Response.json({ error: "Failed to create/update user" }, { status: 500 });
  }
}
