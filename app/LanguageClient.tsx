'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageClient() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lng = params.get('lng');
    if (lng) {
      i18n.changeLanguage(lng);
    }
  }, [i18n]);

  return null;
}
