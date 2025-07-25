'use client';

import React, { FC } from 'react';
import { Container } from '@/components/system/Container';
import Login from '@/components/section/user/Login';
import Register from '@/components/section/user/Register';
import style from '@/styles/UserProfileForm.module.scss';
import UserInformationForm from '@/components/section/user/UserInformationForm';
import PasswordChange from '@/components/section/user/PasswordChange';

interface ProfileContainerProps {
  view: 'login' | 'register' | 'profile' | 'changePw';
}

const ProfileContainer: FC<ProfileContainerProps> = ({ view }) => (
  <Container padding={false} flow={'column'}>
    <ProfileContent view={view} />
  </Container>
);

const ProfileContent: React.FC<ProfileContainerProps> = ({
  view,
}): React.ReactElement => {
  const getCurrentView = (): React.ReactElement => {
    switch (view) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'changePw':
        return <PasswordChange />;
      case 'profile':
        return <UserInformationForm />;
      default:
        return <></>;
    }
  };
  return <Container justifyContent={'center'} children={getCurrentView()} />;
};

export default ProfileContainer;
