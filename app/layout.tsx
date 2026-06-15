import React from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";
import './index.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LanguageClient from './LanguageClient';
import { headers } from 'next/headers';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const acceptLang = (await headers()).get('accept-language') || '';
  const locale = acceptLang ? acceptLang.split(',')[0].split('-')[0] : 'en';

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StoryMelody Studio | Personalized Songs, Videos & Portraits</title>
        <meta name="description" content="Turn your story into a song, film, and art. Personalized creative gifts for birthdays, weddings, anniversaries, and unforgettable life moments." />
        <meta property="og:title" content="StoryMelody Studio" />
        <meta property="og:description" content="Turn your story into a song, film, and art." />
        <meta property="og:image" content={`${process.env.NEXTAUTH_URL}/images/storymelody_logo-Small.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StoryMelody Studio" />
        <meta name="twitter:description" content="Turn your story into a song, film, and art." />
        <meta name="twitter:image" content={`${process.env.NEXTAUTH_URL}/images/storymelody_logo-Small.jpg`} />
        <link rel="icon" href="/favicon.ico" />
         <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers session={session} locale={locale}>
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-gold selection:text-white">
            <LanguageClient />
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
