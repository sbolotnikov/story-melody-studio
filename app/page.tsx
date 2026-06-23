import HomeClient from './HomeClient';
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
    path: '/',
    title: 'StoryMelody Studio',
    description: translate(
      locale,
      'seo.home_desc',
      'Personalized songs, cinematic music videos, and custom portraits.',
    ),
    image: '/images/storymelody_hero_1780519099425.png',
  });
}

export default function Page() {
  return <HomeClient />;
}
