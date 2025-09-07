'use client';

import { Container, Title } from '@/components/system/Container';
import useCart from '@/hooks/CartHook';
import CartListItem from '@/components/section/cart/CartListItem';
import CartSummary from '@/components/section/cart/CartSummaryContainer';
import style from '@/styles/CartList.module.scss';
import React, { FC } from 'react';
import { Hr } from '@/components/system/Hr';
import Skeleton from '@/components/system/Skeleton';
import CartItemSkeleton from '@/components/section/cart/CartListItemSkleton';

import { useTranslation } from 'react-i18next';
import useProducts from '@/hooks/ProductsHook';

interface Props {
  review?: boolean;
}

const CartList: FC<Props> = ({ review }) => {
  const { t } = useTranslation();
  const { mutate, isLoading, reviewedCartItems } = useCart();
  const { products } = useProducts();
  console.log(reviewedCartItems);
  const isMax = (quantity: number, id: string): boolean => {
    const matchingProduct = products?.find((product) => product?._id === id);
    if (!matchingProduct) return false;
    return quantity >= matchingProduct.stockQuantity;
  };

  const subtotal: number =
    reviewedCartItems?.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    ) || 0;
  const shipping: number = 11;
  const total: number = subtotal + shipping;

  const skeleton = (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <React.Fragment key={index}>
          <CartItemSkeleton />
          <Hr />
        </React.Fragment>
      ))}

      <div className={style.summContainerSkeleton}>
        <Skeleton width="100%" height="200px" borderRadius="8px" />
        {/* only a backup now the overly handles the laoding view*/}
      </div>
    </>
  );
  const list = (
    <>
      {reviewedCartItems?.map((item: any) => {
        console.log(item.lowStock);
        return (
          <React.Fragment key={item.productId}>
            <CartListItem
              item={item}
              mutate={mutate}
              review={review}
              isMax={isMax(item.quantity, item.productId)}
              stockLow={Date.now() - item.stockLowAt < 5 * 60 * 1000}
            />
            <Hr />
          </React.Fragment>
        );
      })}
      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        checkoutButton={!review}
      />
    </>
  );

  return (
    <Container
      flow={'column'}
      padding={false}
      alignItems={'center'}
      maxWidth={'1150'}
    >
      {!review && <Title>{t('cart.title')}</Title>}
      {isLoading ? skeleton : list}
    </Container>
  );
};

export default CartList;
