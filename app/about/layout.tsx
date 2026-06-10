import { Metadata } from 'next';
export const metadata: Metadata = {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
    openGraph: { title: "Page: About | Story Melody Studio", url: `${process.env.NEXTAUTH_URL}/about` },
    description: "Learn more about Story Melody Studio and our mission to create personalized songs, videos, and portraits for unforgettable life moments."  ,
    title: "Page: About | StoryMelody Studio" 

};

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}