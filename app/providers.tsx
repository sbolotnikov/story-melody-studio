'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
