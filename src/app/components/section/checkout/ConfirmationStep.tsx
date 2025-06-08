import React, { useState } from 'react';
import Button from '@/app/components/system/Button';
import style from '@/styles/checkout/CheckoutStep.module.scss';
import { useCheckout } from '@/providers/checkout/CheckoutContextProvider';
import { useRouter } from 'next/navigation';

const ConfirmationStep: React.FC = () => {
  const router = useRouter();
  const { checkoutData, prevStep, resetCheckout } = useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      console.log('Placing order with data:', checkoutData);

      // Placeholder API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setOrderCompleted(true);
      // Could redirect to order confirmation page here
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  if (orderCompleted) {
    return (
      <div className={style.successContainer}>
        <div className={style.successIcon}>✓</div>
        <h2>Bestellung erfolgreich!</h2>
        <p>
          Vielen Dank für Ihre Bestellung. Sie erhalten in Kürze eine
          Bestätigungs-E-Mail.
        </p>
        <Button onClick={handleHome} variant="primary">
          Neue Bestellung
        </Button>
      </div>
    );
  }
  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      kreditkarte: 'Kreditkarte',
      paypal: 'PayPal',
      rechnung: 'Rechnung',
    };
    return methods[method] || method;
  };

  const getShippingMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      'a-post': 'A-Post (8.50 CHF)',
      'b-post': 'B-Post (6.50 CHF)',
    };
    return methods[method] || method;
  };

  return (
    <div className={style.stepContainer}>
      <div className={style.formSection}>
        <h2>Bestellung bestätigen</h2>

        {/* Address Summary */}
        <div className={style.summarySection}>
          <h3>Lieferadresse</h3>
          <div className={style.summaryContent}>
            <p>
              {checkoutData.address.salutation} {checkoutData.address.firstName}{' '}
              {checkoutData.address.lastName}
            </p>
            <p>
              {checkoutData.address.street} {checkoutData.address.houseNumber}
            </p>
            <p>
              {checkoutData.address.zipCode} {checkoutData.address.city}
            </p>
            {checkoutData.address.phone && (
              <p>Tel: {checkoutData.address.phone}</p>
            )}
          </div>
          <button className={style.editButton} onClick={() => prevStep()}>
            Bearbeiten
          </button>
        </div>

        {/* Payment Summary */}
        <div className={style.summarySection}>
          <h3>Zahlung & Versand</h3>
          <div className={style.summaryContent}>
            <p>
              <strong>Zahlungsart:</strong>{' '}
              {getPaymentMethodLabel(checkoutData.payment.paymentMethod)}
            </p>
            <p>
              <strong>Versandart:</strong>{' '}
              {getShippingMethodLabel(checkoutData.payment.shippingMethod)}
            </p>
          </div>
          <button className={style.editButton} onClick={() => prevStep()}>
            Bearbeiten
          </button>
        </div>

        {/* Account Info */}
        {checkoutData.createAccount && (
          <div className={style.summarySection}>
            <h3>Konto</h3>
            <div className={style.summaryContent}>
              <p>Ein Konto wird für {checkoutData.address.email} erstellt.</p>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className={style.termsSection}>
          <label className={style.checkboxLabel}>
            <input type="checkbox" required />
            <span>
              Ich habe die <a href="#">AGB</a> und{' '}
              <a href="#">Datenschutzbestimmungen</a> gelesen und akzeptiere
              diese.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className={style.buttonGroup}>
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Zurück
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handlePlaceOrder}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Bestellung wird verarbeitet...'
              : 'Bestellung abschließen'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
