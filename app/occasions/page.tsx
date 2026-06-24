import OccasionsClient from './OccasionsClient';
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
    path: '/occasions',
    title: `${translate(locale, 'nav.occasions', 'Occasions')} - StoryMelody`,
    description: translate(
      locale,
      'occasions.main_desc',
      'Discover personalized music and art for every celebration.',
    ),
    image: '/images/occasions_sm.jpg',
  });
}

export default function Page() {
  return <OccasionsClient />;
}
