'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React, { useState } from 'react';
import Image from 'next/image';
import { updateCartItems } from '@/requests/cart.request';
import NumberStepper from '@/components/system/NumberStepper';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';

interface CartListItemProp {
  item: any;
  items: any[];
  sessionId: string;
  mutate: () => void;
  review?: boolean;
  isMax?: boolean;
}

const CartListItem: React.FC<CartListItemProp> = ({
  item,
  items,
  sessionId,
  mutate,
  review = false,
  isMax = false,
}) => {
  const router: AppRouterInstance = useRouter();
  const { translate } = useContentTranslate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async (productId: string) => {
    setIsLoading(true);
    const updatedItems = items.filter(
      (cartItem: any) => cartItem.productId !== productId,
    );

    try {
      await updateCartItems(sessionId, updatedItems);
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

    const updatedItems = items.map((cartItem: any) =>
      cartItem.productId === productId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem,
    );

    try {
      await updateCartItems(sessionId, updatedItems);
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
          <Image
            src={item.product.imageUrl || '/placeholder-image.jpg'}
            alt={translate(item.product.name)}
            width={60}
            height={60}
          />
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
