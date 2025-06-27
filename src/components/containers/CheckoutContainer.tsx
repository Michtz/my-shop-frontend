'use client';

import React from 'react';
import { CheckoutProvider } from '@/providers/CheckoutContextProvider';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from '../section/checkout/PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import { Container } from '@/components/system/Container';
import ReviewStep from '@/components/section/checkout/ReviewStep';

interface View {
  view: 'address' | 'paymentInfo' | 'confirmation' | 'review';
}

const CheckoutContainer: React.FC<View> = ({ view }) => {
  return (
    <CheckoutProvider>
      <Container
        padding={false}
        justifyContent={'center'}
        flow="column"
        alignItems="center"
        maxWidth={'550'}
      >
        <h1>Checkout</h1>
        <CheckoutContent view={view} />
      </Container>
    </CheckoutProvider>
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
        return <AddressStep />;
    }
  };

  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default CheckoutContainer;
