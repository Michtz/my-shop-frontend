'use client';

import React from 'react';
import useCart from '@/hooks/useCart';
import style from '@/styles/checkout/Checkout.module.scss';
import {
  CheckoutProvider,
  useCheckout,
} from '@/providers/checkout/CheckoutContextProvider';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import CheckoutStepNavigation from '@/components/section/checkout/CheckoutStepNavigation';
import CartSummary from '@/components/section/cart/CartSummaryContainer';
import { Container } from '@/components/system/Container';

const CheckoutContent: React.FC = () => {
  const { currentStep } = useCheckout();
  const sessionTestId = 'sess_nrls9zo5e9076bl9vuw8zt';
  const { cart, cartItems } = useCart(sessionTestId);

  // Calculate totals for summary
  const subtotal =
    cartItems?.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    ) || 0;
  const shipping = 0; // Will be updated based on selected shipping method
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
    <div className={style.checkoutContainer}>
      <CheckoutStepNavigation />

      <div className={style.checkoutContent}>
        <div className={style.checkoutSteps}>{renderCurrentStep()}</div>

        <div className={style.checkoutSidebar}>
          {/*<CartSummary*/}
          {/*  subtotal={subtotal}*/}
          {/*  shipping={shipping}*/}
          {/*  total={total}*/}
          {/*  vatRate={8.1}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <CheckoutProvider>
      <Container flow="column" alignItems="center">
        <h1>Checkout</h1>
        <CheckoutContent />
      </Container>
    </CheckoutProvider>
  );
};

export default Checkout;
