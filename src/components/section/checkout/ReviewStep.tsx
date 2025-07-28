'use client';

import React, { useState } from 'react';
import { Container } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import { confirmPayment } from '@/requests/payment.request';
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
    if (!sessionData?.sessionId) {
      console.error('❌ No session ID available for payment');
      showFeedback('Session not available', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentMethodId = localStorage.getItem('paymentMethodId');
      console.log('💳 Starting payment confirmation with:', {
        sessionId: sessionData.sessionId,
        paymentMethodId: paymentMethodId || 'None'
      });

      if (!paymentMethodId) {
        console.error('❌ No payment method ID found');
        showFeedback('Payment method not found. Please go back to payment step.', 'error');
        setIsProcessing(false);
        return;
      }

      // Get the payment intent ID from local storage (set during payment step)
      const paymentIntentId = localStorage.getItem('paymentIntentId') || 'will_be_retrieved';
      
      const confirmResult = await confirmPayment(
        sessionData.sessionId,
        paymentIntentId,
        paymentMethodId,
      );

      console.log('💳 Payment confirmation result:', confirmResult);

      localStorage.removeItem('paymentMethodId');
      localStorage.removeItem('paymentIntentId');
      
      if (confirmResult && confirmResult.success) {
        console.log('✅ Payment successful, redirecting to order confirmation');
        console.log('📋 Full confirm result structure:', JSON.stringify(confirmResult, null, 2));
        
        // Handle different response structures - check all possible locations
        const orderNumber = confirmResult.order?.orderNumber || 
                           confirmResult.data?.orderNumber || 
                           confirmResult.data?.order?.orderNumber ||
                           confirmResult.orderNumber;
        
        console.log('🔍 Looking for order number in:', {
          'confirmResult.order?.orderNumber': confirmResult.order?.orderNumber,
          'confirmResult.data?.orderNumber': confirmResult.data?.orderNumber,
          'confirmResult.data?.order?.orderNumber': confirmResult.data?.order?.orderNumber,
          'confirmResult.orderNumber': confirmResult.orderNumber,
          'final orderNumber': orderNumber
        });
        
        if (orderNumber) {
          console.log('✅ Found order number, redirecting to:', `/checkout/${orderNumber}`);
          showFeedback(t('checkout.orderPlacedSuccess'), 'success');
          router.push(`/checkout/${orderNumber}`);
        } else {
          console.error('❌ No order number found anywhere in response');
          console.error('Full response structure:', confirmResult);
          showFeedback('Order created but order number missing. Check console for details.', 'error');
        }
      } else {
        console.error('❌ Payment confirmation failed:', confirmResult);
        showFeedback(t('checkout.orderCreationFailed'), 'error');
      }
    } catch (error) {
      console.error('💳 Payment error:', error);
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

      <div
        style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        <h3>{t('checkout.orderSummary')}</h3>
        <CartList review />
      </div>

      <div
        style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        <h4>{t('checkout.paymentMethod')}</h4>
        <p>💳 {t('checkout.creditCardSelected')}</p>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>Payment Method ID: {localStorage.getItem('paymentMethodId') || 'Not found'}</div>
          <div>Payment Intent ID: {localStorage.getItem('paymentIntentId') || 'Not found'}</div>
        </div>
      </div>

      <div
        style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        <h4>Debug Info</h4>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>Session ID: {sessionData?.sessionId || 'Not available'}</div>
          <div>
            User: {sessionData?.isAuthenticated ? 'Authenticated' : 'Guest'}
          </div>
        </div>
      </div>

      <ReviewForm />
    </Container>
  );
};

export default ReviewStep;
