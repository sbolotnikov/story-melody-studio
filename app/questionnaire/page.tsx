import React, { Suspense } from 'react';
import QuestionnaireClient from './QuestionnaireClient';
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
    path: '/questionnaire',
    title: `${translate(locale, 'q.page_title', 'Questionnaire')} - StoryMelody`,
    description: translate(
      locale,
      'q.share_desc',
      'Share your story with us to begin a personalized song, video, or portrait.',
    ),
    image: '/images/storymelody_hero.jpg',
  });
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center py-24 px-4 bg-background"><div className="text-muted-fg font-semibold uppercase tracking-widest text-sm">Loading...</div></div>}>
      <QuestionnaireClient />
    </Suspense>
  );
}
