'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import ContactContainer from '@/components/section/legalPlacholders/ContactContainer';
import CustomerServiceContainer from '@/components/section/legalPlacholders/CustomerServiceContainer';
import FAQContainer from '@/components/section/legalPlacholders/FAQContainer';
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
  return <Container justifyContent={'center'}>{getCurrentView()}</Container>;
};

export default ServiceContainer;
