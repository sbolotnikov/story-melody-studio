"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const supportedLanguages = new Set(["en", "es", "fr", "ru", "it", "pl", "de"]);

export default function LanguageClient({ fallbackLocale = "en" }: { fallbackLocale?: string }) {
  const { i18n } = useTranslation();
  const searchParams = useSearchParams();
  const queryLocale = searchParams.get("lng")?.toLowerCase();
  const initialized = useRef(false);

  useEffect(() => {
    const requestedLocale =
      queryLocale || (initialized.current ? i18n.resolvedLanguage : fallbackLocale.toLowerCase()) || "en";
    const locale = supportedLanguages.has(requestedLocale) ? requestedLocale : "en";

    if (i18n.resolvedLanguage !== locale) {
      i18n.changeLanguage(locale).catch((error) => {
        console.error("i18n changeLanguage failed", error);
      });
    }
    document.cookie = `storymelody-language=${locale}; path=/; max-age=31536000; samesite=lax`;

    document.documentElement.lang = locale;
    initialized.current = true;
  }, [fallbackLocale, i18n, queryLocale]);

  return null;
}
