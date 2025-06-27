import React from 'react';
import style from '@/styles/CartSummaryContainer.module.scss';
import Button from '@/components/system/Button';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  vatRate?: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  total,
  vatRate = 8.1,
}) => {
  const router = useRouter();
  // Calculate net total and VAT
  const netTotal = total / (1 + vatRate / 100);
  const vatAmount = total - netTotal;

  const handleStartCheckout = () => {
    console.log('start checkout ');

    router.push(`/checkout/address`);
  };

  return (
    <div className={style.summaryContainerContainer}>
      <div className={style.summaryContainer}>
        <h2 className={style.title}>ZUSAMMENFASSUNG</h2>

        <div className={style.summaryRow}>
          <span>Zwischensumme</span>
          <span>{subtotal.toFixed(2)} CHF*</span>
        </div>

        <div className={style.summaryRow}>
          <span>Versandkosten</span>
          <span>{shipping.toFixed(2)} CHF*</span>
        </div>

        <hr className={style.divider} />

        <div className={style.summaryRow}>
          <span>Gesamtsumme</span>
          <span>{total.toFixed(2)} CHF*</span>
        </div>

        <div className={style.totalRow}>
          <span>Gesamtsumme gerundet</span>
          <span className={style.totalAmount}>{total.toFixed(2)} CHF*</span>
        </div>

        <div className={style.vatBreakdown}>
          <div className={style.summaryRow}>
            <span>Gesamtnettosumme</span>
            <span>{netTotal.toFixed(2)} CHF</span>
          </div>

          <div className={style.summaryRow}>
            <span>zzgl. {vatRate}% MwSt.</span>
            <span>{vatAmount.toFixed(2)} CHF</span>
          </div>
        </div>

        <p className={style.disclaimer}>
          *Preise inkl. MwSt. zzgl. Versandkosten
        </p>
      </div>
      <Button onClick={handleStartCheckout} className={style.checkoutButton}>
        Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
