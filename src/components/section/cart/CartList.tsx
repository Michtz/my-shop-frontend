'use client';

import { Container } from '@/components/system/Container';
import useCart from '@/hooks/useCart';
import CartListItem from '@/components/section/cart/CartListItem';
import CartSummary from '@/components/section/cart/CartSummaryContainer';
import style from '@/styles/CartList.module.scss';
import React from 'react';
import { Hr } from '@/components/system/Hr';
import Skeleton from '@/components/system/Skeleton';
import CartItemSkeleton from '@/components/section/cart/CartListItemSkleton';
import { useAuth } from '@/hooks/AuthHook';

const CartList = () => {
  const { cart, cartItems, mutate, isLoading } = useCart();
  const { sessionData } = useAuth();
  console.log(cartItems);
  // Calculate totals
  const subtotal =
    cartItems?.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    ) || 0;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const skeleton = (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <React.Fragment key={index}>
          <CartItemSkeleton />
          <Hr />
        </React.Fragment>
      ))}

      {/* Summary Skeleton */}
      <div className={style.summContainerSkeleton}>
        <Skeleton width="100%" height="200px" borderRadius="8px" />
      </div>
    </>
  );

  const list = (
    <>
      {cartItems?.map((item: any) => (
        <React.Fragment key={item.productId}>
          <CartListItem
            item={item}
            items={cartItems}
            sessionId={sessionData?.sessionId}
            mutate={mutate}
          />
          <Hr />
        </React.Fragment>
      ))}
      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        vatRate={8.1}
      />
    </>
  );

  return (
    <Container flow={'column'} alignItems={'center'}>
      <h2>Warenkorb</h2>
      {isLoading ? skeleton : list}
    </Container>
  );
};

export default CartList;
