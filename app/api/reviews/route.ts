import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';


export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return new Response(JSON.stringify(reviews), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, userName, rating, comment, isConfirmed } = body;
    let review;
    if (orderId) {
      review = await prisma.review.upsert({
        where: { orderId },
        update: { userName, rating, comment, isConfirmed: isConfirmed ?? true },
        create: { orderId, userName, rating, comment, isConfirmed: isConfirmed ?? true }
      });
    } else {
      review = await prisma.review.create({
        data: { userName, rating, comment, isConfirmed: false }
      });
    }
    return new Response(JSON.stringify(review), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to save review:", error);
    return new Response(JSON.stringify({ error: "Failed to create/update review" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
