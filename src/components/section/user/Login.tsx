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

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginPageProps {
  withHeader?: boolean;
  withTitle?: boolean;
  checkout?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({
  withHeader,
  withTitle,
  checkout = false,
}) => {
  const { t } = useTranslation();
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
      email: 'michael@example.com',
      password: 'Password123!',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data.email, data.password);
      if (!checkout) router.replace('/profile');

      showFeedback('feedback.login-success', 'success');
    } catch (err) {
      showFeedback('feedback.login-error', 'error');
      Logger.error('Login failed:', err);
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
        {withHeader && (
          <>
            <span className={style.logo} onClick={() => router.replace('/')}>
              <Image src={logo} alt={'logo'} height={60} />
            </span>
            <div className={style.loginHeader}>
              <h2 className={style.loginTitle}>{t('auth.welcomeBack')}</h2>
              <p className={style.loginSubtitle}>
                {t('auth.signInToContinue')}
              </p>
            </div>
            <Hr />
          </>
        )}

        {withTitle && (
          <div style={{ marginBottom: '2rem' }}>
            <h2>{t('auth.login')}</h2>
          </div>
        )}

        <FormContainer
          className={style.loginForm}
          onSubmitAction={handleSubmit(onSubmit)}
        >
          <FormRow gap={'large'}>
            <Input
              type="email"
              label={t('auth.emailAddress')}
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
              label={t('auth.password')}
              required
              fullWidth
              placeholder={t('auth.passwordPlaceholder')}
              showPasswordToggle
              inputProps={register('password', {
                required: t('validation.passwordRequired'),
                validate: validatePassword,
              })}
              {...transformFieldError(errors.password)}
            />
          </FormRow>

          {/* Todo: add it*/}
          {/*<FormRow direction="row">*/}
          {/*  <Link href="" disabled className={style.forgotPassword}>*/}
          {/*    {t('auth.forgotPassword')}*/}
          {/*  </Link>*/}
          {/*</FormRow>*/}

          <FormRow>
            <Button type="submit" flex disabled={isLoading}>
              {t('auth.loginButton')}
            </Button>
          </FormRow>
        </FormContainer>

        <div className={style.signupPrompt}>
          <span>{t('auth.noAccount')} </span>
          <Link href="/register" className={style.signupLink}>
            {t('auth.createAccount')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
