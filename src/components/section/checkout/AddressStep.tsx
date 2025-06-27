import React, { FC, useEffect, useState } from 'react';
import Button, { ButtonContainer } from '@/components/system/Button';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import UserInformationForm, {
  UserProfileFormData,
} from '@/components/section/user/UserInformationForm';
import { updateCartUser } from '@/requests/cart.request';
import { useAuth } from '@/hooks/AuthHook';
import { Logger } from '@/utils/Logger.class';
import { IAddress, UserInformation } from '@/types/auth';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useRouter } from 'next/navigation';

const AddressStep: React.FC = () => {
  const { sessionData, userInformation } = useAuth();
  const { showFeedback } = useFeedback();
  const router = useRouter();

  const [userData, setUserData] = useState<UserInformation>();
  const [activeTab, setActiveTab] = useState<'login' | 'gast'>('gast');

  useEffect(() => {
    if (userInformation) setUserData(userInformation);
  }, [userInformation]);

  const handleWriteAdresseInCart = async (data?: UserProfileFormData) => {
    try {
      const userInfo: IAddress = {
        street: data?.street || userData?.addresses?.[0]?.street || '',
        houseNumber:
          data?.houseNumber || userData?.addresses?.[0]?.houseNumber || '',
        city: data?.city || userData?.addresses?.[0]?.city || '',
        state: data?.state || userData?.addresses?.[0]?.state || '',
        zipCode: data?.zipCode || userData?.addresses?.[0]?.zipCode || '',
        country: 'ch',
        isDefault: true,
      };

      const guestInfo: UserInformation = {
        email: data?.email || userData?.email,
        firstName: data?.firstName || userData?.firstName,
        lastName: data?.lastName || userData?.lastName,
        phoneNumber: data?.phoneNumber || userData?.phoneNumber,
      };

      const cart = await updateCartUser(
        sessionData?.sessionId as string,
        userInfo,
        guestInfo,
      );
      console.log(cart);
      showFeedback('cart user updated', 'success');
      router.replace('/checkout/paymentInfo');
    } catch (e) {
      Logger.error(e);
    }
  };

  return (
    <Container justifyContent={'center'} padding={false} flow={'column'}>
      <ButtonContainer spread>
        <Button onClick={() => setActiveTab('login')}>Login</Button>
        <Button onClick={() => setActiveTab('gast')}>Gast</Button>
      </ButtonContainer>
      {activeTab === 'login' ? (
        <Login onCheckout={handleWriteAdresseInCart} />
      ) : (
        <UserInformationForm onCheckout={handleWriteAdresseInCart} />
      )}
    </Container>
  );
};

export default AddressStep;
