'use client';

import { Container } from '@/app/components/system/Container';
import useCart from '@/hooks/useCart';
import CartListItem from '@/app/components/section/cart/CartListItem';
import CartSummary from '@/app/components/section/cart/CartSummaryContainer';
import style from '@/styles/CartList.module.scss';
import React from 'react';
import { Hr } from '@/app/components/system/Hr';
import Skeleton from '@/app/components/system/Skeleton';
import CartItemSkeleton from '@/app/components/section/cart/CartListItemSkleton';

const CartList = () => {
  const sessionTestId: string = 'sess_nrls9zo5e9076bl9vuw8zt';
  const { cart, items, mutate, isLoading } = useCart(sessionTestId);

  // Calculate totals
  const subtotal =
    items?.reduce(
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
      {items?.map((item: any) => (
        <React.Fragment key={item.productId}>
          <CartListItem
            item={item}
            items={items}
            sessionTestId={sessionTestId}
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
