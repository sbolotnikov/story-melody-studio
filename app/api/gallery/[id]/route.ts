import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    if (!(id.length === 24 && /^[0-9a-fA-F]+$/.test(id))) {
      return Response.json({ error: "Invalid gallery item ID" }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return Response.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
