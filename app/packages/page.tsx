import PackagesClient from './PackagesClient';
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
    path: '/packages',
    title: `${translate(locale, 'nav.packages', 'Packages')} - StoryMelody`,
    description: translate(
      locale,
      'seo.packages_desc',
      'Explore our personalized packages and pricing. Crafted for every moment.',
    ),
    image: '/images/product_song_1780519111946.png',
  });
}

export default function Page() {
  return <PackagesClient />;
}
