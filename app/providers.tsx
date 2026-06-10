'use client';

import './i18n';
import React, { useEffect } from 'react';
import i18n from 'i18next';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import type { Session } from 'next-auth';

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
  locale?: string | null;
};

export const Providers = ({ children, session, locale }: Props) => {
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale).catch((err) => console.error('i18n changeLanguage failed', err));
    }
  }, [locale]);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
};
