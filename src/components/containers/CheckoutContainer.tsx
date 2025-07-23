'use client';

import React from 'react';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from '../section/checkout/PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import { Container } from '@/components/system/Container';
import ReviewStep from '@/components/section/checkout/ReviewStep';
import { useTranslation } from 'react-i18next';

interface View {
  view: 'address' | 'paymentInfo' | 'confirmation' | 'review';
}

const CheckoutContainer: React.FC<View> = ({ view }) => {
  const { t } = useTranslation();

  return (
    <Container
      padding={false}
      justifyContent={'center'}
      flow="column"
      alignItems="center"
      maxWidth={'550'}
    >
      <h1>{t('checkout.title')}</h1>
      <CheckoutContent view={view} />
    </Container>
  );
};

const CheckoutContent: React.FC<View> = ({ view }) => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'address':
        return <AddressStep />;
      case 'paymentInfo':
        return <PaymentStep />;
      case 'review':
        return <ReviewStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return <></>;
    }
  };

  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default CheckoutContainer;
