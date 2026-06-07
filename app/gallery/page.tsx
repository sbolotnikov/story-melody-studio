import React, { Suspense } from 'react';
import GalleryClient from './GalleryClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-fg uppercase tracking-widest text-xs font-medium">Loading...</div>}>
      <GalleryClient />
    </Suspense>
  );
}
