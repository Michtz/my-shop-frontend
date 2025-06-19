'use client';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface TransformedFieldError {
  error: boolean;
  helperText?: string;
}

interface ErrorHook {
  transformFieldError: (error?: FieldError) => TransformedFieldError;
}

const errorMessageKeys: { [key: string]: string } = {
  notAEmail: 'error.not-a-email',
  required: 'error.required',
};

const ErrorContext = createContext<ErrorHook | undefined>(undefined);

export const ErrorProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  const transformFieldError = (error?: FieldError): TransformedFieldError => {
    if (!error) return { error: false };
    const errorKey: string | undefined = error.type || error.message;
    if (errorKey && errorKey in errorMessageKeys)
      return {
        error: true,
        helperText: t(errorMessageKeys[errorKey]),
      };

    return {
      error: true,
      helperText: t('error.error'),
    };
  };

  return (
    <ErrorContext.Provider value={{ transformFieldError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorHook => {
  const context: ErrorHook | undefined = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
