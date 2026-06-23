import OccasionDetailClient from './OccasionDetailClient';
import {
  createLocalizedMetadata,
  getRequestLocale,
  translate,
  type MetadataSearchParams,
} from '@/lib/metadata';

const occasionImages: Record<string, string> = {
  birthdays: '/images/birthday_hero.jpg',
  weddings: '/images/wedding_hero.jpg',
  anniversaries: '/images/anniversary_hero.jpg',
  dance: '/images/dance_hero.jpg',
  retirements: '/images/retirement_hero.jpg',
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: MetadataSearchParams;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = await getRequestLocale(query.lng);
  const title = translate(locale, `occasions.${id}.title`, 'Occasion');
  const description = translate(
    locale,
    `occasions.${id}.desc`,
    'Create a personalized StoryMelody gift for this special occasion.',
  );

  return createLocalizedMetadata({
    locale,
    path: `/occasions/${id}`,
    title: `${title} | StoryMelody Studio`,
    description,
    image: occasionImages[id] || '/images/storymelody_hero.jpg',
  });
}

export default function Page() {
  return <OccasionDetailClient />;
}
