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
interface ServiceContainerProps {
  view: 'contact' | 'customerService' | 'faq';
}

const ServiceContainer: FC<ServiceContainerProps> = ({ view }) => (
  <Container padding={false} flow={'column'}>
    <ServiceContent view={view} />
  </Container>
);

const ServiceContent: React.FC<ServiceContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'contact':
        return <ContactContainer />;
      case 'customerService':
        return <CustomerServiceContainer />;
      case 'faq':
        return <FAQContainer />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default ServiceContainer;
