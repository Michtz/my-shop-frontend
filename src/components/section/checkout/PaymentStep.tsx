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
import { useTranslation } from 'react-i18next';

const PaymentForm = ({
  onPaymentMethodReady,
}: {
  onPaymentMethodReady: () => void;
}) => {
  const { t } = useTranslation();
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
          {isProcessing
            ? t('checkout.settingUpPayment')
            : t('checkout.continueToReview')}
        </Button>
      </form>
    </Container>
  );
};

const PaymentStep: React.FC = () => {
  const { t } = useTranslation();
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
          showFeedback(t('checkout.paymentInitFailed'), 'error');
        }
      });
    }
  }, [sessionData?.sessionId, t]);

  const handlePaymentMethodReady = () => {
    showFeedback(t('checkout.paymentMethodValidated'), 'success');
    router.push('/checkout/review');
  };

  if (!clientSecret) return <div>{t('checkout.loadingPayment')}</div>;

  return (
    <Container flow={'column'}>
      <h2>{t('checkout.paymentInformation')}</h2>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#efe5d3',
              colorBackground: '#ffffff',
              colorText: '#333230',
              colorDanger: '#dc2626',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
            rules: {
              '.Input': {
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
              },
              '.Input:focus': {
                border: '1px solid #efe5d3',
                boxShadow: '0 0 0 2px rgba(239, 229, 211, 0.2)',
              },
              '.Label': {
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              },
            },
          },
        }}
      >
        <PaymentForm onPaymentMethodReady={handlePaymentMethodReady} />
      </Elements>
    </Container>
  );
};

export default PaymentStep;
