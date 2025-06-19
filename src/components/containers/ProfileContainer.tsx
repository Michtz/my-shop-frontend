'use client';

import React, { FC, FormEvent, JSX, useEffect, useState } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import { addToCart, replaceCartItems } from '@/requests/cart.request';
import { useParams, useRouter } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import style from '@/styles/OverviewProduct.module.scss';
import { mutate } from 'swr';
import Image from 'next/image';
import NumberStepper from '@/components/system/NumberStepper';
import { Container, FormContainer } from '@/components/system/Container';
import { Controller, useForm } from 'react-hook-form';
import { useFeedback } from '@/hooks/FeedbackHook';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import useProducts from '@/hooks/useProducts';
import { Hr } from '@/components/system/Hr';
import { useAuth } from '@/hooks/AuthHook';
import { Logger } from '@/utils/Logger.class';
import UserProfileForm from '@/components/section/user/UserForm';
import AuthManager from '@/components/AuthManager';
import Login from '@/components/section/user/Login';
import Register from '@/components/section/user/Register';

interface FormFields {
  quantity: number;
}
const getDefaultValues = (product = {} as any): any => {
  return {
    quantity: 1,
  };
};

interface ProfileContainerProps {
  view: string;
}

const ProfileContainer: FC<ProfileContainerProps> = ({ view }) => {
  const { product } = useProduct();
  const router = useRouter();
  const { products } = useProducts();
  const { sessionData } = useAuth();
  const { cart, cartItems } = useCart();
  const { showFeedback } = useFeedback();

  const { register, reset, control, handleSubmit } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: getDefaultValues(product),
  });

  // if (!product) return null;
  // useEffect(() => {
  //   console.log(cart, items);
  // }, [cart]);

  const submit = async (data: any) => {
    try {
      console.log(data);

      showFeedback('feedback.add-to-cart-success', 'success');
    } catch (error) {
      showFeedback('feedback.data-saved-error', 'error');
      Logger.error('Failed to update cart:', error);
      await mutate('cart', cart);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <Container flow={'column'}>
      <ProfileContent view={view} />
    </Container>
  );
};

interface ProfileContentProps {
  view: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      // case 'logout':
      //   return <Logout />;
      case 'profile':
        return <UserProfileForm />;
      default:
        return <></>;
    }
  };
  return <Container children={getCurrentView()} />;
};

export default ProfileContainer;
