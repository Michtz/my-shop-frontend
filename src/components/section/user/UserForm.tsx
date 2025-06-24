'use client';
import style from '@/styles/UserProfileForm.module.scss';
import PasswordChange from '@/components/section/user/PasswordChange';
import UserInformationForm from './UserInformationForm';
import { FC } from 'react';

const UserProfileForm: FC = () => {
  return (
    <div className={style.userProfileForm}>
      <UserInformationForm />
      <PasswordChange />
    </div>
  );
};

export default UserProfileForm;
