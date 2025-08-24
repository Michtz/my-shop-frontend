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
import Cookies from 'js-cookie';
import { StripeElementLocale } from '@stripe/stripe-js';

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
        // Store Payment Method ID and Payment Intent ID for ReviewStep
        const paymentMethodId = paymentIntent.payment_method as string;
        const paymentIntentId = paymentIntent.id;

        if (paymentMethodId) {
          localStorage.setItem('paymentMethodId', paymentMethodId);
        }
        if (paymentIntentId) {
          localStorage.setItem('paymentIntentId', paymentIntentId);
        }

        console.log('💳 Payment setup complete:', {
          paymentMethodId: paymentMethodId ? 'STORED' : 'MISSING',
          paymentIntentId: paymentIntentId ? 'STORED' : 'MISSING',
        });

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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{ width: '84%', margin: '0', marginTop: '1rem' }}
      >
        {isProcessing
          ? t('checkout.settingUpPayment')
          : t('checkout.continueToReview')}
      </Button>
    </form>
  );
};

const PaymentStep: React.FC = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');

  const [language, setLanguage] = useState<StripeElementLocale>('de');

  useEffect(() => {
    const cookieLanguage = Cookies.get('language') || 'de';
    setLanguage(cookieLanguage as StripeElementLocale);
  }, []);

  useEffect(() => {
    if (sessionData?.sessionId) {
      createPaymentIntent(sessionData.sessionId)
        .then((result) => {
          // Handle nested response structure
          const data = result?.data || result;
          const clientSecret = data?.clientSecret || data?.client_secret;

          if (
            clientSecret &&
            clientSecret.startsWith('pi_') &&
            clientSecret.includes('_secret_')
          ) {
            setClientSecret(clientSecret);
          } else {
            showFeedback(t('checkout.paymentInitFailed'), 'error');
          }
        })
        .catch(() => {
          showFeedback(t('checkout.paymentInitFailed'), 'error');
        });
    } else {
    }
  }, [sessionData?.sessionId, t, showFeedback]);

  const handlePaymentMethodReady = () => {
    showFeedback(t('checkout.paymentMethodValidated'), 'success');
    localStorage.setItem('checkoutPayment', 'done');
    router.push('/checkout/review');
  };

  if (!clientSecret) {
    return (
      <Container flow={'column'}>
        <h2>{t('checkout.paymentInformation')}</h2>
        <div>{t('checkout.loadingPayment')}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          {sessionData?.sessionId
            ? `Session ID: ${sessionData.sessionId}`
            : 'Warte auf Session...'}
        </div>
      </Container>
    );
  }

  return (
    <div style={{ width: 'fit-content' }}>
      <h2>{t('checkout.paymentInformation')}</h2>
      <Elements
        key={clientSecret} // Force re-render when clientSecret changes
        stripe={stripePromise}
        options={{
          clientSecret,
          locale: language,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#c7bda9',
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
                width: '100%',
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
    </div>
  );
};

export default PaymentStep;
