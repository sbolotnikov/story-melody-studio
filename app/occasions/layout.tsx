import { t } from 'i18next';
import { Metadata } from 'next';
export const metadata: Metadata = {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
    openGraph: { 
      title: `Page: ${t('nav.occasions')} | Story Melody Studio`, 
      url: `${process.env.NEXTAUTH_URL}/occasions`,
      images: [ `${process.env.NEXTAUTH_URL}/images/storymelody_logo - Small.png` ]
    },
    description: t('occasions.main_desc'),
    title: `Page: ${t('nav.occasions')} | Story Melody Studio`

};

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}