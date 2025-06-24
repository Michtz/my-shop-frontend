'use client';

import React, { FC } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { Container } from '@/components/system/Container';
import { useForm } from 'react-hook-form';
import { useFeedback } from '@/hooks/FeedbackHook';
import useProducts from '@/hooks/useProducts';
import { useAuth } from '@/hooks/AuthHook';
import { Logger } from '@/utils/Logger.class';
import UserProfileForm from '@/components/section/user/UserForm';
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

  return (
    <Container padding={false} flow={'column'}>
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
  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default ProfileContainer;
