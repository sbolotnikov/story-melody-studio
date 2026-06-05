import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    const items = await prisma.galleryItem.findMany({
      where: type ? { type: String(type) } : undefined,
      orderBy: { createdAt: "desc" }
    });
    return Response.json(items);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return Response.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.galleryItem.create({ data: body });
    return Response.json(item);
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return Response.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
