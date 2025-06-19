'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import style from '@/styles/LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { useRouter } from 'next/navigation';
import MaterialIcon from '@/components/system/MaterialIcon';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Link from '@/components/system/Link';
import Button, { ButtonContainer } from '@/components/system/Button';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { Hr } from '@/components/system/Hr';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onLoginSuccess?: (user: any) => void;
  redirectTo?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const { t } = useTranslation(['common']);
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const {
    user,
    sessionData,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    clearError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  console.log(sessionData);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data.email, data.password);
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
    <div className={style.loginPage}>
      <div className={style.loginContainer}>
        <div className={style.loginHeader}>
          <div className={style.logoContainer}>
            <MaterialIcon icon="lock" />
          </div>
          <h1 className={style.loginTitle}>Welcome Back</h1>
          <p className={style.loginSubtitle}>
            Sign in to your account to continue
          </p>
        </div>

        <Hr />

        <FormContainer
          className={style.loginForm}
          onSubmitAction={handleSubmit(onSubmit)}
        >
          <FormRow>
            <Input
              type="email"
              label="Email Address"
              required
              fullWidth
              placeholder="Enter your email..."
              startIcon="email"
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
              placeholder="Enter your password..."
              startIcon="lock"
              showPasswordToggle
              inputProps={register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
              {...transformFieldError(errors.password)}
            />
          </FormRow>

          <FormRow direction="row">
            <Link
              href="/auth/forgot-password"
              disabled
              className={style.forgotPassword}
            >
              Forgot password? coming soon
            </Link>
          </FormRow>

          <FormRow>
            <Button
              type="submit"
              className={style.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <MaterialIcon icon="login" iconSize="small" />
                  Sign In
                </>
              )}
            </Button>
          </FormRow>
        </FormContainer>

        {/* Sign Up Link */}
        <div className={style.signupPrompt}>
          <span>Don't have an account? </span>
          <Link href="/register" className={style.signupLink}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
