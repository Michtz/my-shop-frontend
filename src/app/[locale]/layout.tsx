import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

const LocaleLayout = ({ children, params: { locale } }: LocaleLayoutProps) => {
  return <>{children}</>;
};

export default LocaleLayout;
