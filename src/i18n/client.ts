'use client';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import deCommon from './locales/de/common.json';
import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';

const languages: string[] = ['de', 'en', 'fr'];
const resources = {
  de: {
    common: deCommon,
  },
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
};

i18next.use(initReactI18next).init({
  debug: false,
  fallbackLng: 'de',
  supportedLngs: languages,
  defaultNS: 'common',
  ns: ['common'],
  fallbackNS: 'common',
  resources,
  react: {
    useSuspense: false,
  },
  lng: 'de',
});

export default i18next;
