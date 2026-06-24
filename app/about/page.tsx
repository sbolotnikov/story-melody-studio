import AboutClient from './AboutClient';
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
    path: '/about',
    title: `${translate(locale, 'nav.about', 'About')} - StoryMelody`,
    description: translate(
      locale,
      'seo.about_desc',
      'Meet the creators turning personal memories into timeless art.',
    ),
    image: '/images/about.jpg',
  });
}

export default function Page() {
  return <AboutClient />;
}
