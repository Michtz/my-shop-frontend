'use client';

import React from 'react';
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
import Button from '@/components/system/Button';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { Hr } from '@/components/system/Hr';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';

interface LoginFormData {
  email: string;
  password: string;
  passwordSec: string;
  lastName: string;
  firstName: string;
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
    register: _register,
  } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      passwordSec: '',
      firstName: '',
      lastName: '',
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
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
      <Hr />
      <FormContainer
        className={style.loginForm}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Input
            type="text"
            label="First name"
            required
            fullWidth
            placeholder="Franz"
            clearable
            inputProps={register('firstName', {
              required: 'first name is required',
            })}
            {...transformFieldError(errors.firstName)}
          />
        </FormRow>{' '}
        <FormRow>
          <Input
            type="text"
            label="last name"
            required
            fullWidth
            placeholder="mustermann"
            clearable
            inputProps={register('lastName', {
              required: 'last name is required',
            })}
            {...transformFieldError(errors.lastName)}
          />
        </FormRow>{' '}
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
        <FormRow>
          <Input
            type="password"
            label="Password again"
            required
            fullWidth
            placeholder="Enter your password..."
            startIcon="lock"
            showPasswordToggle
            inputProps={register('passwordSec', {
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
                Create profile
              </>
            )}
          </Button>
        </FormRow>
      </FormContainer>

      <div className={style.signupPrompt}>
        <span> Already have an account? </span>
        <Link href="/login" className={style.signupLink}>
          sign in
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
