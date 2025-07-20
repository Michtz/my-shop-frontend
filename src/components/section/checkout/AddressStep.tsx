import React, { useEffect, useState } from 'react';
import { ButtonGroup } from '@/components/system/Button';
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
    console.log(userInformation);
  }, [userInformation]);

  const handleWriteAdresseInCart = async (data?: UserProfileFormData) => {
    try {
      console.log(userInformation, sessionData);
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
      console.log(userInfo);
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

  const options = [
    {
      label: 'Ich bin bereits Kunde',
      onClick: () => setActiveTab('login'),
      active: activeTab === 'login',
    },
    {
      label: 'Ich bin neu kunde',
      onClick: () => setActiveTab('gast'),
      active: activeTab === 'gast',
    },
  ];

  return (
    <Container justifyContent={'center'} padding={false} flow={'column'}>
      <ButtonGroup options={options} />
      {activeTab === 'login' ? (
        sessionData?.isAuthenticated ? (
          <UserInformationForm onCheckout={handleWriteAdresseInCart} />
        ) : (
          <Login checkout />
        )
      ) : (
        <UserInformationForm onCheckout={handleWriteAdresseInCart} />
      )}
    </Container>
  );
};

export default AddressStep;
