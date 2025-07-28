'use client';

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Container } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import {
  confirmPayment,
  createPaymentIntent,
} from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
import CartList from '@/components/section/cart/CartList';
import { useTranslation } from 'react-i18next';

const ReviewForm = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalPayment = async () => {
    if (!sessionData?.sessionId) return;

    setIsProcessing(true);

    try {
      const paymentMethodId = localStorage.getItem('paymentMethodId');

      const confirmResult = await confirmPayment(
        sessionData.sessionId,
        'will_be_retrieved', // Backend will get the payment intent
        paymentMethodId || undefined,
      );

      localStorage.removeItem('paymentMethodId');
      if (confirmResult) {
        showFeedback(t('checkout.orderPlacedSuccess'), 'success');
        router.push(`/checkout/${confirmResult.order.orderNumber}`);
      } else {
        showFeedback(t('checkout.orderCreationFailed'), 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showFeedback(t('checkout.paymentProcessingFailed'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ButtonContainer>
      <Button onClick={() => router.back()} variant="secondary">
        {t('checkout.backToPayment')}
      </Button>
      <Button onClick={handleFinalPayment} disabled={isProcessing}>
        {isProcessing
          ? t('checkout.processingPayment')
          : t('checkout.placeOrderAndPay')}
      </Button>
    </ButtonContainer>
  );
};

const ReviewStep: React.FC = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();

  console.log('📋 Review step loaded with session:', sessionData?.sessionId);

  return (
    <Container flow={'column'} padding={false}>
      <h2>{t('checkout.reviewOrder')}</h2>
      
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>{t('checkout.orderSummary')}</h3>
        <CartList review />
      </div>

      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4>{t('checkout.paymentMethod')}</h4>
        <p>💳 {t('checkout.creditCardSelected')}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Payment Method ID: {localStorage.getItem('paymentMethodId') || 'Not found'}
        </p>
      </div>

      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4>Debug Info</h4>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>Session ID: {sessionData?.sessionId || 'Not available'}</div>
          <div>User: {sessionData?.isAuthenticated ? 'Authenticated' : 'Guest'}</div>
        </div>
      </div>

      <ReviewForm />
    </Container>
  );
};

export default ReviewStep;
