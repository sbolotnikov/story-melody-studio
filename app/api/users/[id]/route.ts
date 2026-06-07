import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find by MongoDB ObjectId
    if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      const user = await prisma.user.findUnique({ 
        where: { id },
        include: {
          _count: {
            select: { orders: true }
          }
        }
      });

      if (user) {
        return Response.json(user);
      }
    }

    return Response.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
