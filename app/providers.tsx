'use client';

import './i18n';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import type { Session } from 'next-auth';

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
};

export const Providers = ({ children, session }: Props) => {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
};
