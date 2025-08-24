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

  const progressAddress = localStorage.getItem('checkoutAddress');
  const progressPayment = localStorage.getItem('checkoutPayment');

  const options = [
    {
      label: t(t('userProfile.orderInformation')),
      onClick: handleGoToAddress,
      active: !!progressAddress || activeTab === 'address',
    },
    {
      label: t('checkout.paymentInformation'),
      onClick: handleGoToPayment,
      active: !!progressPayment || activeTab === 'paymentInfo',
    },
    {
      label: t('checkout.reviewOrder'),
      onClick: handleGoToReview,
      active: !!progressPayment || activeTab === 'review',
    },
  ];

  const ProgressButtons = () => (
    <ul className={styles.progressContainer}>
      {options.map((obj) => {
        return (
          <li
            key={obj.label}
            onClick={() => (obj.active ? obj.onClick() : null)}
            className={styles.listItem}
            data-done={obj.active}
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
      <div style={{ marginTop: '4rem' }}></div>
      {/*{showTitle && <h1>{t('checkout.title')}</h1>}*/}
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
