'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import style from '@/styles/LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { useRouter } from 'next/navigation';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';
import { Hr } from '@/components/system/Hr';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import Image from 'next/image';
import logo from '@/assets/myShopLogo.png';
import { UserProfileFormData } from '@/components/section/user/UserInformationForm';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  withHeader?: boolean;
  withTitle?: boolean;
  onCheckout?: (data?: any) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({
  withHeader,
  withTitle,
  onCheckout,
}) => {
  const { t } = useTranslation(['common']);
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const { isLoading, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'testadmin@example.com',
      password: 'Password123!!',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data.email, data.password);
      router.replace('/profile');
      showFeedback('feedback.login-success', 'success');
    } catch (err) {
      showFeedback('feedback.login-error', 'error');
      Logger.error('Login failed:', err);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || 'Please enter a valid email address';
  };

  const validatePassword = (password: string | undefined) => {
    if (!password) return 'Password is required';
    return password.length >= 6 || 'Password must be at least 6 characters';
  };

  return (
    <>
      <div className={style.loginContainer}>
        {withHeader && (
          <>
            <span className={style.logo} onClick={() => router.replace('/')}>
              <Image src={logo} alt={'logo'} height={60} />
            </span>
            <div className={style.loginHeader}>
              <h2 className={style.loginTitle}>Welcome Back</h2>
              <p className={style.loginSubtitle}>
                Sign in to your account to continue
              </p>
            </div>
            <Hr />
          </>
        )}

        {withTitle && (
          <div style={{ marginBottom: '2rem' }}>
            <h2>Login</h2>
          </div>
        )}

        <FormContainer
          className={style.loginForm}
          onSubmitAction={handleSubmit(onCheckout || onSubmit)}
        >
          <FormRow gap={'large'}>
            <Input
              type="email"
              label="Email Address"
              required
              fullWidth
              placeholder="test.test@test.com"
              clearable
              inputProps={register('email', {
                required: 'Email is required',
                validate: validateEmail,
              })}
              {...transformFieldError(errors.email)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="password"
              label="Password"
              required
              fullWidth
              placeholder="**********"
              showPasswordToggle
              inputProps={register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
              {...transformFieldError(errors.password)}
            />
          </FormRow>

          <FormRow direction="row">
            <Link href="" disabled className={style.forgotPassword}>
              Forgot password? coming soon
            </Link>
          </FormRow>

          <FormRow>
            <Button type="submit" flex disabled={isLoading}>
              einlogen
            </Button>
          </FormRow>
        </FormContainer>

        <div className={style.signupPrompt}>
          <span>Don't have an account? </span>
          <Link href="/register" className={style.signupLink}>
            Create one here
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
