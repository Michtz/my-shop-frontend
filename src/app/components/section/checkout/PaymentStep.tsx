import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/app/components/system/Button';
import style from '@/styles/checkout/CheckoutStep.module.scss';
import {
  PaymentData,
  useCheckout,
} from '@/providers/checkout/CheckoutContextProvider';

const PaymentStep: React.FC = () => {
  const { checkoutData, updatePayment, nextStep, prevStep } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentData>({
    defaultValues: checkoutData.payment,
  });

  const selectedPayment = watch('paymentMethod');
  const selectedShipping = watch('shippingMethod');

  const handlePaymentSubmit = async (data: PaymentData) => {
    console.log('Payment data:', data);
    updatePayment(data);
    nextStep();
  };

  const paymentMethods = [
    {
      id: 'kreditkarte',
      label: 'Kreditkarte',
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'paypal',
      label: 'PayPal',
      description: 'Schnell und sicher mit PayPal bezahlen',
    },
    {
      id: 'rechnung',
      label: 'Rechnung',
      description: 'Bezahlung nach Erhalt der Ware',
    },
  ];

  const shippingMethods = [
    {
      id: 'a-post',
      label: 'A-Post',
      description: 'Zustellung am nächsten Werktag',
      price: '8.50 CHF',
    },
    {
      id: 'b-post',
      label: 'B-Post',
      description: 'Zustellung innerhalb von 2-3 Werktagen',
      price: '6.50 CHF',
    },
  ];

  return (
    <div className={style.stepContainer}>
      <div className={style.formSection}>
        <form
          onSubmit={handleSubmit(handlePaymentSubmit)}
          className={style.form}
        >
          {/* Payment Method Section */}
          <div className={style.sectionHeader}>
            <h3>Zahlungsart</h3>
            <p className={style.subtitle}>
              Nach Login/ Registrierung verfügbar
            </p>
          </div>

          <div className={style.optionGroup}>
            {paymentMethods.map((method) => (
              <label key={method.id} className={style.optionItem}>
                <input
                  type="radio"
                  value={method.id}
                  {...register('paymentMethod', {
                    required: 'Bitte wählen Sie eine Zahlungsart',
                  })}
                  className={style.radioInput}
                />
                <div className={style.optionContent}>
                  <div className={style.optionHeader}>
                    <span className={style.optionLabel}>{method.label}</span>
                  </div>
                  <p className={style.optionDescription}>
                    {method.description}
                  </p>
                </div>
              </label>
            ))}
            {errors.paymentMethod && (
              <span className={style.errorText}>
                {errors.paymentMethod.message}
              </span>
            )}
          </div>

          {/* Shipping Method Section */}
          <div className={style.sectionHeader}>
            <h3>Versandart</h3>
            <p className={style.subtitle}>
              Nach Login/ Registrierung verfügbar
            </p>
          </div>

          <div className={style.optionGroup}>
            {shippingMethods.map((method) => (
              <label key={method.id} className={style.optionItem}>
                <input
                  type="radio"
                  value={method.id}
                  {...register('shippingMethod', {
                    required: 'Bitte wählen Sie eine Versandart',
                  })}
                  className={style.radioInput}
                />
                <div className={style.optionContent}>
                  <div className={style.optionHeader}>
                    <span className={style.optionLabel}>{method.label}</span>
                    <span className={style.optionPrice}>{method.price}</span>
                  </div>
                  <p className={style.optionDescription}>
                    {method.description}
                  </p>
                </div>
              </label>
            ))}
            {errors.shippingMethod && (
              <span className={style.errorText}>
                {errors.shippingMethod.message}
              </span>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className={style.buttonGroup}>
            <Button type="button" variant="secondary" onClick={prevStep}>
              Zurück
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedPayment || !selectedShipping}
            >
              Weiter zur Bestellung
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentStep;
