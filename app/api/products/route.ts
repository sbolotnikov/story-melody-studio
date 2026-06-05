import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({ data: body });
    return Response.json(product);
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
