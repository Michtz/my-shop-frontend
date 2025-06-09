'use client';

import style from '@/styles/system/CartListItem.module.scss';
import React, { useState } from 'react';
import Accordion, {
  AccordionDetailsContainer,
  AccordionHeaderButtonsContainer,
  AccordionHeaderContainer,
  AccordionHeaderContent,
  AccordionHeaderExpandableIcon,
  AccordionItemContainer,
} from '@/app/components/system/Accordion';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import { replaceCartItems } from '@/requests/cart.request';
import NumberStepper from '@/app/components/system/NumberStepper';

interface CartListItemProp {
  item: any;
  items: any[];
  sessionTestId: string;
  mutate: () => void;
}

const CartListItem: React.FC<CartListItemProp> = ({
  item,
  items,
  sessionTestId,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async (productId: string) => {
    setIsLoading(true);
    const updatedItems = items.map((cartItem: any) =>
      cartItem.productId === productId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    );

    try {
      await replaceCartItems(sessionTestId, updatedItems);
      mutate();
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsLoading(true);
    const updatedItems = items.map((cartItem: any) =>
      cartItem.productId === productId && cartItem.quantity > 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem,
    );

    try {
      await replaceCartItems(sessionTestId, updatedItems);
      mutate();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    setIsLoading(true);
    const updatedItems = items.filter(
      (cartItem: any) => cartItem.productId !== productId,
    );

    try {
      await replaceCartItems(sessionTestId, updatedItems);
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
      await replaceCartItems(sessionTestId, updatedItems);
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
              <img
                src={item.product.imageUrl || '/placeholder-image.jpg'}
                alt={item.product.name}
              />
              {/*<div style={{ backgroundColor: 'green', height: '80px' }} />*/}
            </div>

            <div className={style.productDetails}>
              <div className={style.brand}>{item.product.brand || 'BRAND'}</div>
              <h3 className={style.productName}>{item.product.name}</h3>
              <div className={style.unitPrice}>
                CHF {item.price.toFixed(2)}.-
              </div>
            </div>
          </div>
          <AccordionHeaderButtonsContainer flexDirection={'row'}>
            <div className={style.productControls}>
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
              <div className={style.totalPrice}>
                CHF {itemTotal.toFixed(2)}.-
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
