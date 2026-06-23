import React, { Suspense } from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";
import './index.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LanguageClient from './LanguageClient';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://story-melody-studio.vercel.app',
  ),
  title: {
    default: 'StoryMelody Studio',
    template: '%s | StoryMelody Studio',
  },
};

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const acceptLang = (await headers()).get('accept-language') || '';
  const locale = acceptLang ? acceptLang.split(',')[0].split('-')[0] : 'en';

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
         <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers session={session}>
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-gold selection:text-white">
            <Suspense fallback={null}>
              <LanguageClient fallbackLocale={locale} />
            </Suspense>
            <Header />
            <main className="grow flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
