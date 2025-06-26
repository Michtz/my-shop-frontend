'use client';

import React, { FC } from 'react';
import CartList from '@/components/section/cart/CartList';
import useCart from '@/hooks/useCart';
import { Container } from '@/components/system/Container';
import EmptyCart from '@/components/section/cart/EmptyCart';

const CartContainer: FC = () => {
  const { error } = useCart();

  return (
    <Container padding={false} flow={'column'}>
      {error ? <EmptyCart /> : <CartList />}
    </Container>
  );
};
export default CartContainer;
