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
import { createPaymentIntent } from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
const PaymentForm = ({
  onPaymentMethodReady,
}: {
  onPaymentMethodReady: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Submit Payment Method to Payment Intent
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Submit error:', submitError);
        setIsProcessing(false);
        return;
      }

      // Confirm Payment Intent WITHOUT completing payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: 'if_required',
      });

      if (!error && paymentIntent) {
        // Store Payment Method ID for ReviewStep
        const paymentMethodId = paymentIntent.payment_method as string;
        if (paymentMethodId) {
          localStorage.setItem('paymentMethodId', paymentMethodId);
        }

        // Payment Method is now attached, proceed to review
        onPaymentMethodReady();
      } else {
        console.error('Confirm error:', error);
      }
    } catch (error) {
      console.error('Payment setup error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Container flow="column">
      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {isProcessing ? 'Setting up payment...' : 'Continue to Review'}
        </Button>
      </form>
    </Container>
  );
};

const PaymentStep: React.FC = () => {
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (sessionData?.sessionId) {
      createPaymentIntent(sessionData.sessionId).then((result) => {
        console.log(result);
        if (result && result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          showFeedback('Payment initialization failed', 'error');
        }
      });
    }
  }, [sessionData?.sessionId]);

  const handlePaymentMethodReady = () => {
    showFeedback('Payment method validated', 'success');
    router.push('/checkout/review');
  };

  if (!clientSecret) return <div>Loading payment...</div>;

  return (
    <Container>
      <h2>Payment Information</h2>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' as const },
        }}
      >
        <PaymentForm onPaymentMethodReady={handlePaymentMethodReady} />
      </Elements>
    </Container>
  );
};

export default PaymentStep;
