'use client';

import React, { useState, useEffect } from 'react';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Container } from '@/components/system/Container';
import Button from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import {
  confirmPayment,
  createPaymentIntent,
} from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
import useCart from '@/hooks/useCart';
import CartList from '@/components/section/cart/CartList';
import { Logger } from '@/utils/Logger.class';
const ReviewForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalPayment = async () => {
    if (!sessionData?.sessionId) return;

    setIsProcessing(true);

    try {
      // Use Backend confirmPayment directly (Payment Method already attached)
      const confirmResult = await confirmPayment(
        sessionData.sessionId,
        'will_be_retrieved', // Backend will get the payment intent
      );
      console.log(confirmResult);
      if (confirmResult) {
        showFeedback('Order placed successfully!', 'success');
        router.push(`/checkout/${confirmResult.orderNumber.orderNumber}`);
      } else {
        showFeedback('Order creation failed', 'error');
      }
    } catch (error) {
      Logger.error('Payment error:', error);
      showFeedback('Payment processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container flow="column">
      <Button
        onClick={handleFinalPayment}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.1rem',
          backgroundColor: '#28a745',
        }}
      >
        {isProcessing ? 'Processing Payment...' : 'Place Order & Pay'}
      </Button>

      <Button
        onClick={() => router.back()}
        variant="secondary"
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        Back to Payment
      </Button>
    </Container>
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
      <CartList />

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
