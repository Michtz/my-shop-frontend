import React, { FC, useState } from 'react';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useCheckout } from '@/providers/CheckoutContextProvider';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import UserInformationForm from '@/components/section/user/UserInformationForm';

const AddressStep: React.FC = () => {
  const {
    checkoutData,
    updateCustomerType,
    updateCreateAccount,
    updateAddress,
    updateLoginData,
    nextStep,
  } = useCheckout();
  const [activeTab, setActiveTab] = useState<'login' | 'gast'>('login');

  const SelectType: FC = () => {
    return (
      <ButtonContainer spread>
        <Button onClick={() => setActiveTab('login')}>Login</Button>
        <Button onClick={() => setActiveTab('gast')}>Gast</Button>
      </ButtonContainer>
    );
  };

  return (
    <Container justifyContent={'center'} padding={false} flow={'column'}>
      <SelectType />
      {activeTab === 'login' ? (
        <Login withTitle />
      ) : (
        <UserInformationForm checkout />
      )}
    </Container>
  );
};

export default AddressStep;
