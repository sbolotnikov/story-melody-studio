import React, { Suspense } from 'react';
import QuestionnaireClient from './QuestionnaireClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center py-24 px-4 bg-background"><div className="text-muted-fg font-semibold uppercase tracking-widest text-sm">Loading...</div></div>}>
      <QuestionnaireClient />
    </Suspense>
  );
}
