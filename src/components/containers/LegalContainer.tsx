'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import Register from '@/components/section/user/Register';
import style from '@/styles/UserProfileForm.module.scss';
import UserInformationForm from '@/components/section/user/UserInformationForm';
import PasswordChange from '@/components/section/user/PasswordChange';
import ContactContainer from '@/components/section/legalPlacholders/ContactContainer';
import CustomerServiceContainer from '@/components/section/legalPlacholders/CustomerServiceContainer';
import FAQContainer from '@/components/section/legalPlacholders/FAQContainer';
import ImprintContainer from '@/components/section/legalPlacholders/ImprintContainer';
import PrivacyContainer from '@/components/section/legalPlacholders/PrivacyContainer';
import ReturnsContainer from '@/components/section/legalPlacholders/ReturnsContainer';
import ShippingContainer from '@/components/section/legalPlacholders/ShippingContainer';
import TermsContainer from '@/components/section/legalPlacholders/TermsContainer';
interface LegalInformationContainerProps {
  view: 'imprint' | 'privacy' | 'returns' | 'shipping' | 'terms';
}

const LegalContainer: FC<LegalInformationContainerProps> = ({ view }) => (
  <Container padding={false} flow={'column'}>
    <LegalContent view={view} />
  </Container>
);

const LegalContent: React.FC<LegalInformationContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'imprint':
        return <ImprintContainer />;
      case 'privacy':
        return <PrivacyContainer />;
      case 'returns':
        return <ReturnsContainer />;
      case 'shipping':
        return <ShippingContainer />;
      case 'terms':
        return <TermsContainer />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default LegalContainer;
