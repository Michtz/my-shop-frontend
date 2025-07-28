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
      console.log('💳 Initializing payment with session:', sessionData.sessionId);
      createPaymentIntent(sessionData.sessionId)
        .then((result) => {
          console.log('💳 Payment intent response:', result);
          
          // Handle nested response structure
          const data = result?.data || result;
          const clientSecret = data?.clientSecret || data?.client_secret;
          
          if (clientSecret && clientSecret.startsWith('pi_') && clientSecret.includes('_secret_')) {
            console.log('✅ Payment intent created successfully');
            console.log('💳 Client secret:', clientSecret);
            console.log('💳 Client secret prefix:', clientSecret.substring(0, 20) + '...');
            setClientSecret(clientSecret);
          } else {
            console.log('❌ No client secret in response:', result);
            showFeedback(t('checkout.paymentInitFailed'), 'error');
          }
        })
        .catch((error) => {
          console.error('💳 Payment intent creation failed:', error);
          showFeedback(t('checkout.paymentInitFailed'), 'error');
        });
    } else {
      console.log('❌ No session ID available for payment initialization');
    }
  }, [sessionData?.sessionId, t, showFeedback]);

  const handlePaymentMethodReady = () => {
    showFeedback(t('checkout.paymentMethodValidated'), 'success');
    router.push('/checkout/review');
  };

  if (!clientSecret) {
    return (
      <Container flow={'column'}>
        <h2>{t('checkout.paymentInformation')}</h2>
        <div>{t('checkout.loadingPayment')}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          {sessionData?.sessionId ? 
            `Session ID: ${sessionData.sessionId}` : 
            'Warte auf Session...'
          }
        </div>
      </Container>
    );
  }

  return (
    <Container flow={'column'}>
      <h2>{t('checkout.paymentInformation')}</h2>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '12px' }}>
        <div>🔑 Stripe Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING'}</div>
        <div>💳 Client Secret: {clientSecret ? 'RECEIVED' : 'MISSING'}</div>
        <div>🏢 API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'UNDEFINED'}</div>
        <div>🌍 Environment: {process.env.NODE_ENV}</div>
      </div>
      <Elements
        key={clientSecret} // Force re-render when clientSecret changes
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
