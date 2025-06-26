'use client';

import React from 'react';
import useCart from '@/hooks/useCart';
import style from '@/styles/checkout/Checkout.module.scss';
import {
  CheckoutProvider,
  useCheckout,
} from '@/providers/CheckoutContextProvider';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from '../section/checkout/PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import CheckoutStepNavigation from '@/components/section/checkout/CheckoutStepNavigation';
import CartSummary from '@/components/section/cart/CartSummaryContainer';
import { Container } from '@/components/system/Container';

const CheckoutContent: React.FC = () => {
  const { currentStep } = useCheckout();
  const { cart, cartItems } = useCart();

  const subtotal =
    cartItems?.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    ) || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AddressStep />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <ConfirmationStep />;
      default:
        return <AddressStep />;
    }
  };

  return (
    <Container
      padding={false}
      justifyContent={'center'}
      flow="column"
      alignItems="center"
      maxWidth={'550'}
    >
      <h1>Checkout</h1>
      <CheckoutStepNavigation />
      {renderCurrentStep()}
    </Container>
  );
};

const CheckoutContainer: React.FC = () => {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
};

export default CheckoutContainer;
