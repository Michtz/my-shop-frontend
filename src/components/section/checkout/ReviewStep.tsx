'use client';

import React, { useState } from 'react';
import { Container, Title } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useAuth } from '@/hooks/AuthHook';
import { confirmPayment } from '@/requests/payment.request';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/hooks/FeedbackHook';
import CartList from '@/components/section/cart/CartList';
import { useTranslation } from 'react-i18next';
import { Logger } from '@/utils/Logger.class';

const ReviewForm = () => {
  const { t } = useTranslation();
  const { sessionData } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalPayment = async () => {
    if (!sessionData?.sessionId) {
      showFeedback('Session not available', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentMethodId = localStorage.getItem('paymentMethodId');
      if (!paymentMethodId) {
        showFeedback(
          'Payment method not found. Please go back to payment step.',
          'error',
        );
        setIsProcessing(false);
        return;
      }

      // Get the payment intent ID from local storage (set during payment step)
      const paymentIntentId =
        localStorage.getItem('paymentIntentId') || 'will_be_retrieved';

      const confirmResult = await confirmPayment(
        sessionData.sessionId,
        paymentIntentId,
        paymentMethodId,
      );
      localStorage.removeItem('checkoutPayment');
      localStorage.removeItem('checkoutAddress');
      localStorage.removeItem('paymentMethodId');
      localStorage.removeItem('paymentIntentId');

      if (confirmResult && confirmResult.success) {
        // Handle different response structures - check all possible locations
        const orderNumber =
          confirmResult.order?.orderNumber ||
          confirmResult.data?.orderNumber ||
          confirmResult.data?.order?.orderNumber ||
          confirmResult.orderNumber;

        if (orderNumber) {
          showFeedback(t('checkout.orderPlacedSuccess'), 'success');
          router.push(`/checkout/${orderNumber}`);
        } else {
          showFeedback(
            'Order created but order number missing. Check console for details.',
            'error',
          );
        }
      } else {
        showFeedback(t('checkout.orderCreationFailed'), 'error');
      }
    } catch (e) {
      showFeedback(t('checkout.paymentProcessingFailed'), 'error');
      Logger.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ButtonContainer styles={{ width: '66%', flexDirection: 'row-reverse' }}>
      <Button
        style={{ width: '66%', marginTop: '4rem' }}
        onClick={handleFinalPayment}
        disabled={isProcessing}
      >
        {isProcessing
          ? t('checkout.processingPayment')
          : t('checkout.placeOrderAndPay')}
      </Button>
    </ButtonContainer>
  );
};

const ReviewStep: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container flow={'column'} padding={false} alignItems={'center'}>
      <Title>{t('checkout.reviewOrder')}</Title>
      <CartList review />
      <ReviewForm />
    </Container>
  );
};

export default ReviewStep;
