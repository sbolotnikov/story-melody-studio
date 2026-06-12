
import { Metadata } from 'next';
// Note: avoid using React hooks (like useTranslation) in generateMetadata

export async function generateMetadata({ params }: { params: { id: string } | Promise<{ id: string }> }): Promise<Metadata> {
  // params may be a Promise in some Next.js runtimes — await to unwrap safely
  const resolvedParams = await params as { id?: string };
  const id = resolvedParams?.id;
  const url = `${process.env.NEXTAUTH_URL ?? ''}/occasions/${id}`;
  const imageUrl = `${process.env.NEXTAUTH_URL ?? ''}/occasions/${id}/opengraph-image`;
  return {
    title: 'Page: Occasions | StoryMelody Studio',
    description:
      'Discover our special occasions and how we can help you create personalized songs, videos, and portraits for unforgettable life moments.',
    openGraph: { title: 'Page: Occasions | Story Melody Studio', url, images: [imageUrl] },
  };
}

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}


