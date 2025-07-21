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

const ReviewForm = () => {
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
        showFeedback('Order placed successfully!', 'success');
        router.push(`/checkout/${confirmResult.order.orderNumber}`);
      } else {
        showFeedback('Order creation failed', 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showFeedback('Payment processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ButtonContainer>
      <Button onClick={() => router.back()} variant="secondary">
        Back to Payment
      </Button>
      <Button onClick={handleFinalPayment} disabled={isProcessing}>
        {isProcessing ? 'Processing Payment...' : 'Place Order & Pay'}
      </Button>
    </ButtonContainer>
  );
};

const ReviewStep: React.FC = () => {
  const { sessionData } = useAuth();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (sessionData?.sessionId) {
      createPaymentIntent(sessionData.sessionId).then((result) => {
        console.log(result);
        if (result && result.clientSecret) {
          setClientSecret(result.clientSecret);
        }
      });
    }
  }, [sessionData?.sessionId]);

  if (!clientSecret) return <div>Loading order review...</div>;

  return (
    <Container flow={'column'}>
      <h2>Review Your Order</h2>
      <CartList review />

      <div style={{ marginBottom: '1rem' }}>
        <h4>Payment Method</h4>
        <p>💳 Credit Card (ending in ••••)</p>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'flat' as const },
        }}
      >
        <ReviewForm />
      </Elements>
    </Container>
  );
};

export default ReviewStep;
