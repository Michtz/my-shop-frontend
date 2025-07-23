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

interface RegisterFormData {
  email: string;
  password: string;
  passwordSec: string;
  lastName: string;
  firstName: string;
}

interface RegisterPageProps {
  onRegisterSuccess?: (user: any) => void;
  redirectTo?: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const { isLoading, register: _register } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      passwordSec: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      if (data.password === data.passwordSec) {
        await _register(
          data.email,
          data.password,
          data.firstName,
          data.lastName,
        );
        showFeedback('feedback.login-success', 'success');
      }
    } catch (err) {
      showFeedback('feedback.login-error', 'error');
      Logger.error('Registration failed:', err);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return t('validation.emailRequired');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || t('validation.validEmailRequired');
  };

  const validatePassword = (password: string | undefined) => {
    if (!password) return t('validation.passwordRequired');
    return password.length >= 6 || t('validation.passwordMinLength');
  };

  return (
    <>
      <div className={style.loginContainer}>
        <span className={style.logo} onClick={() => router.replace('/')}>
          <Image src={logo} alt={'logo'} height={60} />
        </span>
        <div className={style.loginHeader}>
          <h1 className={style.loginTitle}>{t('register.welcome')}</h1>
          <p className={style.loginSubtitle}>{t('register.createAccount')}</p>
        </div>
        <Hr />
        <FormContainer
          className={style.loginForm}
          onSubmitAction={handleSubmit(onSubmit)}
        >
          <FormRow>
            <Input
              type="text"
              label={t('register.firstName')}
              required
              fullWidth
              placeholder={t('register.firstNamePlaceholder')}
              clearable
              inputProps={register('firstName', {
                required: t('validation.firstNameRequired'),
              })}
              {...transformFieldError(errors.firstName)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="text"
              label={t('register.lastName')}
              required
              fullWidth
              placeholder={t('register.lastNamePlaceholder')}
              clearable
              inputProps={register('lastName', {
                required: t('validation.lastNameRequired'),
              })}
              {...transformFieldError(errors.lastName)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="email"
              label={t('register.emailAddress')}
              required
              fullWidth
              placeholder={t('auth.emailPlaceholder')}
              clearable
              inputProps={register('email', {
                required: t('validation.emailRequired'),
                validate: validateEmail,
              })}
              {...transformFieldError(errors.email)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="password"
              label={t('register.password')}
              required
              fullWidth
              placeholder={t('register.passwordPlaceholder')}
              showPasswordToggle
              inputProps={register('password', {
                required: t('validation.passwordRequired'),
                validate: validatePassword,
              })}
              {...transformFieldError(errors.password)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="password"
              label={t('register.passwordAgain')}
              required
              fullWidth
              placeholder={t('register.passwordPlaceholder')}
              showPasswordToggle
              inputProps={register('passwordSec', {
                required: t('validation.passwordRequired'),
                validate: validatePassword,
              })}
              {...transformFieldError(errors.passwordSec)}
            />
          </FormRow>

          <FormRow direction="row">
            <Link href="/register" disabled className={style.forgotPassword}>
              {t('register.forgotPassword')}
            </Link>
          </FormRow>

          <FormRow>
            <Button type="submit" flex disabled={isLoading}>
              {t('register.createAccountButton')}
            </Button>
          </FormRow>
        </FormContainer>

        <div className={style.signupPrompt}>
          <span>{t('register.alreadyHaveAccount')} </span>
          <Link href="/login" className={style.signupLink}>
            {t('register.signIn')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
