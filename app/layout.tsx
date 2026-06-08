import React from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";
import './index.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LanguageClient from './LanguageClient';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StoryMelody Studio | Personalized Songs, Videos & Portraits</title>
        <meta name="description" content="Turn your story into a song, film, and art. Personalized creative gifts for birthdays, weddings, anniversaries, and unforgettable life moments." />
        <meta property="og:title" content="StoryMelody Studio" />
        <meta property="og:description" content="Turn your story into a song, film, and art." />
      </head>
      <body>
        <Providers session={session}>
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
