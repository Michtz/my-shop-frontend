'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/client';
import { useParams } from 'next/navigation';

interface TranslationProviderProps {
  children: ReactNode;
}

const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';

  useEffect(() => {
    // Sprache aus URL synchronisieren
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationProvider;
