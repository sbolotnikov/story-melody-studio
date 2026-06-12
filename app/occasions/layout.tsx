import { Metadata } from 'next';
export const metadata: Metadata = {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
    openGraph: { 
      title: "Page: Occasions | Story Melody Studio", 
      url: `${process.env.NEXTAUTH_URL}/occasions`,
      images: [ `${process.env.NEXTAUTH_URL}/occasions/opengraph-image` ]
    },
    description: "Discover our special occasions and how we can help you create personalized songs, videos, and portraits for unforgettable life moments.",
    title: "Page: Occasions | StoryMelody Studio" 

};

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}