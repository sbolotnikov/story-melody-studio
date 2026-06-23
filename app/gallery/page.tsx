import React, { Suspense } from 'react';
import GalleryClient from './GalleryClient';
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
    path: '/gallery',
    title: `${translate(locale, 'nav.gallery', 'Gallery')} - StoryMelody`,
    description: translate(
      locale,
      'gallery.desc',
      'Explore our portfolio of unique personalized creations.',
    ),
    image: '/images/gallery.jpg',
  });
}

export default function Page() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-fg uppercase tracking-widest text-xs font-medium">Loading...</div>}>
      <GalleryClient />
    </Suspense>
  );
}
