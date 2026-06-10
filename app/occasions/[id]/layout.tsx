'use client';
import { Metadata } from 'next';
// Note: avoid using React hooks (like useTranslation) in generateMetadata

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params?.id;
  const url = `${process.env.NEXTAUTH_URL ?? ''}/occasions/${id}`;
  return {
    title: 'Page: Occasions | StoryMelody Studio',
    description:
      'Discover our special occasions and how we can help you create personalized songs, videos, and portraits for unforgettable life moments.',
    openGraph: { title: 'Page: Occasions | Story Melody Studio', url },
  };
}

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}


