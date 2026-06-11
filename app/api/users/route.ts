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
    const { id, email, role, phone, name, image, currentPassword, newPassword } = body;

    // If request contains a newPassword field, treat this as a password update request
    if (newPassword) {
      // require email to identify the user (AuthContext sends session email)
      if (!email) {
        return Response.json({ error: 'Email required for password update' }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

      // If user has existing password, require currentPassword
      if (user.password) {
        if (!currentPassword) return Response.json({ error: 'Current password required' }, { status: 400 });
        const bcrypt = (await import('bcryptjs')).default;
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return Response.json({ error: 'Current password incorrect' }, { status: 403 });
      }

      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return Response.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      const bcrypt = (await import('bcryptjs')).default;
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { email }, data: { password: hashed } });
      return Response.json({ message: 'Password updated' });
    }

    // Otherwise handle profile create/update as before
    const safeImage = image === undefined || image === null || image === '' ? undefined : image;
    const safePhone = phone === undefined || phone === null || phone === '' ? undefined : phone;
    const safeName = name === undefined || name === null || name === '' ? undefined : name;
    const safeRole = role === undefined || role === null || role === '' ? undefined : role;

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
