'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React, { useState } from 'react';
import Image from 'next/image';
import { deleteCartItem, updateCartItem } from '@/requests/cart.request';
import NumberStepper from '@/components/system/NumberStepper';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useTranslation } from 'react-i18next';

interface CartListItemProp {
  item: any;
  sessionId: string;
  mutate: () => void;
  review?: boolean;
  isMax?: boolean;
}

const CartListItem: React.FC<CartListItemProp> = ({
  item,
  sessionId,
  mutate,
  review = false,
  isMax = false,
}) => {
  const router: AppRouterInstance = useRouter();
  const { t } = useTranslation([]);
  const { sessionData, userSessionData, isSessionReady } = useAuth();
  const { translate } = useContentTranslate();
  const { showFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async (productId: string) => {
    setIsLoading(true);

    try {
      await deleteCartItem(sessionId, productId);
      mutate();
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number,
  ) => {
    setIsLoading(true);
    try {
      if (!isSessionReady || !sessionData?.sessionId) {
        showFeedback(t('feedback.session-not-ready'), 'error');
        return;
      }

      await updateCartItem(
        sessionData.sessionId,
        productId,
        newQuantity,
        userSessionData?.user?.id || '',
      );

      mutate();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const itemTotal = item.quantity * item.price;

  return (
    <div key={item._id} className={style.cartItemContainer}>
      <div
        className={style.productInfo}
        onClick={() => router.push(`/product/${item.productId}`)}
      >
        <div className={style.productImage}>
          {item && (
            <Image
              src={item.product.imageUrl || '/placeholder-image.jpg'}
              alt={translate(item.product.name)}
              width={60}
              height={60}
            />
          )}
        </div>
        <div className={style.productDetails}>
          <div className={style.brand}>{item.product.brand || 'BRAND'}</div>
          <h3 className={style.productName}>{translate(item.product.name)}</h3>
          <div className={style.unitPrice}>CHF {item.price?.toFixed(2)}.-</div>
        </div>
      </div>

      <div className={style.productControls}>
        {!review && (
          <NumberStepper
            quantity={item.quantity}
            onQuantityChange={(newQuantity) =>
              handleQuantityChange(item.productId, newQuantity)
            }
            onDelete={() => handleDeleteItem(item.productId)}
            disabled={isLoading}
            min={1}
            max={999}
            isMax={isMax}
          />
        )}
        <div className={style.totalPrice}>
          {review && `${item.quantity} Stück für insgesamt`} CHF{' '}
          {itemTotal.toFixed(2)}.-
        </div>
      </div>
    </div>
  );
};

export default CartListItem;
