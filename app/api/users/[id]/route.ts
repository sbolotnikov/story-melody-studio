import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Try finding by MongoDB ObjectId first, then by firebaseId
    let user = null;
    
    // Check if it's a valid 24-char hex string (ObjectId)
    if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      user = await prisma.user.findUnique({ where: { id } });
    }
    
    if (!user) {
      user = await prisma.user.findUnique({ where: { firebaseId: id } });
    }

    if (user) {
      return Response.json(user);
    } else {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
