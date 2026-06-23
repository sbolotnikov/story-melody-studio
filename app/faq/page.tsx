import FAQClient from './FAQClient';
import {
  createLocalizedMetadata,
  getRequestLocale,
  translate,
  type MetadataSearchParams,
} from '@/lib/metadata';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: MetadataSearchParams;
}) {
  const locale = await getRequestLocale((await searchParams).lng);
  return createLocalizedMetadata({
    locale,
    path: '/faq',
    title: `${translate(locale, 'faq.title', 'FAQ & How it Works')} - StoryMelody`,
    description: translate(
      locale,
      'nav.faq_desc',
      'Everything you need to know about custom songs, videos, and personalized gifts.',
    ),
    image: '/images/faq_hero_banner.jpg',
  });
}

export default function Page() {
  return <FAQClient />;
}
