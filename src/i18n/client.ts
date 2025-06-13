'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { languages } from '@/hooks/useTranslation';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'de',
    supportedLngs: languages,
    defaultNS: 'common',
    ns: ['common'],
    fallbackNS: 'common',
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next;
