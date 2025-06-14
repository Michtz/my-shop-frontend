import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
}

const LocaleLayout = ({ children }: LocaleLayoutProps) => {
  return <>{children}</>;
};

export default LocaleLayout;
