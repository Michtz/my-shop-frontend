'use client';

import React, { useState } from 'react';
import AddressStep from '@/components/section/checkout/AddressStep';
import PaymentStep from '../section/checkout/PaymentStep';
import ConfirmationStep from '@/components/section/checkout/ConfirmationStep';
import { Container } from '@/components/system/Container';
import ReviewStep from '@/components/section/checkout/ReviewStep';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/system/Button.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import MaterialIcon from '@/components/system/MaterialIcon';

interface View {
  view: 'address' | 'paymentInfo' | 'confirmation' | 'review';
}
type CheckoutSteps =
  | 'address'
  | 'review'
  | 'paymentInformation'
  | 'paymentInfo';

const CheckoutContainer: React.FC<View> = ({ view }) => {
  const { t } = useTranslation();
  const router: AppRouterInstance = useRouter();
  const pathname: string = usePathname();
  const step = pathname.split('/').pop();

  const isValidCheckoutStep = (
    step: string | undefined,
  ): step is CheckoutSteps => {
    return step === 'address' || step === 'paymentInfo' || step === 'review';
  };

  const [activeTab, setActiveTab] = useState<CheckoutSteps | null>(
    isValidCheckoutStep(step) ? step : null,
  );

  console.log(activeTab);
  const handleGoToAddress = () => {
    router.push('/checkout/address');
    setActiveTab('address');
  };
  const handleGoToPayment = () => {
    router.push('/checkout/paymentInfo');
    setActiveTab('paymentInformation');
  };
  const handleGoToReview = () => {
    router.push('/checkout/review');
    setActiveTab('review');
  };

  const options = [
    {
      label: t(t('userProfile.orderInformation')),
      onClick: handleGoToAddress,
      active:
        activeTab === 'address' ||
        activeTab === 'paymentInfo' ||
        activeTab === 'review',
    },
    {
      label: t('checkout.paymentInformation'),
      onClick: handleGoToPayment,
      active: activeTab === 'paymentInfo' || activeTab === 'review',
    },
    {
      label: t('checkout.reviewOrder'),
      onClick: handleGoToReview,
      active: activeTab === 'review',
    },
  ];

  const ProgressButtons = () => (
    <ul className={styles.progressContainer}>
      {options.map((obj) => {
        return (
          <li
            key={obj.label}
            onClick={() => obj.onClick()}
            className={styles.listItem}
          >
            {obj.label}{' '}
            <span className={styles.icon} data-done={obj.active}>
              <MaterialIcon icon={'check'} />
            </span>
          </li>
        );
      })}
    </ul>
  );
  return (
    <Container
      padding={false}
      justifyContent={'center'}
      flow="column"
      alignItems="center"
    >
      <h1>{t('checkout.title')}</h1>
      {activeTab && <ProgressButtons />}
      <CheckoutContent view={view} />
    </Container>
  );
};

const CheckoutContent: React.FC<View> = ({ view }) => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'address':
        return <AddressStep />;
      case 'paymentInfo':
        return <PaymentStep />;
      case 'review':
        return <ReviewStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return <></>;
    }
  };

  return (
    <Container justifyContent={'center'} padding={false}>
      {getCurrentView()}
    </Container>
  );
};

export default CheckoutContainer;
