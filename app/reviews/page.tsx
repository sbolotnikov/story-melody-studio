import ReviewsClient from './ReviewsClient';
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
    path: '/reviews',
    title: translate(
      locale,
      'reviews.page_title',
      'Customer Reviews & Testimonials - StoryMelody',
    ),
    description: translate(
      locale,
      'reviews.intro_desc',
      'Read reviews from clients who turned their stories into original music and art.',
    ),
    image: '/images/reviews_sm.jpg',
  });
}

export default function Page() {
  return <ReviewsClient />;
}
