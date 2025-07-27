'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React, { useState } from 'react';
import Image from 'next/image';
import Accordion, {
  AccordionDetailsContainer,
  AccordionHeaderButtonsContainer,
  AccordionHeaderContainer,
  AccordionHeaderContent,
  AccordionHeaderExpandableIcon,
  AccordionItemContainer,
} from '@/components/system/Accordion';
import MaterialIcon from '@/components/system/MaterialIcon';
import { replaceCartItems } from '@/requests/cart.request';
import NumberStepper from '@/components/system/NumberStepper';

interface CartListItemProp {
  item: any;
  items: any[];
  sessionId: string;
  mutate: () => void;
  review?: boolean;
}

const CartListItem: React.FC<CartListItemProp> = ({
  item,
  items,
  sessionId,
  mutate,
  review = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async (productId: string) => {
    setIsLoading(true);
    const updatedItems = items.filter(
      (cartItem: any) => cartItem.productId !== productId,
    );

    try {
      await replaceCartItems(sessionId, updatedItems);
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
      await replaceCartItems(sessionId, updatedItems);
      mutate();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const itemTotal = item.quantity * item.price;

  return (
    <Accordion key={item._id} className={style.cartItemContainer}>
      <AccordionHeaderContainer>
        <AccordionHeaderExpandableIcon>
          <MaterialIcon icon="keyboard_arrow_down" iconSize="big" />
        </AccordionHeaderExpandableIcon>

        <AccordionHeaderContent>
          <div className={style.productInfo}>
            <div className={style.productImage}>
              <Image
                src={item.product.imageUrl || '/placeholder-image.jpg'}
                alt={item.product.name}
                width={60}
                height={60}
              />
              {/*<div style={{ backgroundColor: 'green', height: '80px' }} />*/}
            </div>

            <div className={style.productDetails}>
              <div className={style.brand}>{item.product.brand || 'BRAND'}</div>
              <h3 className={style.productName}>{item.product.name}</h3>
              <div className={style.unitPrice}>
                CHF {item.price?.toFixed(2)}.-
              </div>
            </div>
          </div>
          <AccordionHeaderButtonsContainer flexDirection={'row'}>
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
                  max={99}
                />
              )}
              <div className={style.totalPrice}>
                {review && `${item.quantity} Stück für insgesamt`} CHF{' '}
                {itemTotal.toFixed(2)}.-
              </div>
            </div>
          </AccordionHeaderButtonsContainer>
        </AccordionHeaderContent>
      </AccordionHeaderContainer>

      <AccordionDetailsContainer>
        <AccordionItemContainer>
          <div className={style.productDescription}>
            {item.product.description}
          </div>
        </AccordionItemContainer>
      </AccordionDetailsContainer>
    </Accordion>
  );
};

export default CartListItem;
