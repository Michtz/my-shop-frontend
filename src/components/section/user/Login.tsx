'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import style from '@/styles/LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { useRouter } from 'next/navigation';
import { FormContainer, FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useSocketContext } from '@/providers/SocketProvider';
import { GoogleLogin } from '@react-oauth/google';
import GoogleGIcon from '@/components/icons/GoogleGIcon';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginPageProps {
  goTo?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ goTo }) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const { isLoading, login, loginWithGoogle } = useAuth();
  const { joinUserRoom } = useSocketContext();

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    console.log('🔍 Starting to look for Google button...');

    // Check ob Google Button geladen ist
    const checkInterval = setInterval(() => {
      console.log('⏰ Checking for Google button...');
      console.log('Ref current:', googleButtonRef.current);

      // Versuche verschiedene Selektoren
      const btn1 = googleButtonRef.current?.querySelector('button');
      const btn2 = googleButtonRef.current?.querySelector('[role="button"]');
      const btn3 = googleButtonRef.current?.querySelector('div[role="button"]');
      const btn4 = googleButtonRef.current?.querySelector(
        '.nsm7Bb-HzV7m-LgbsSe',
      );

      console.log('Found selectors:', {
        button: btn1,
        '[role="button"]': btn2,
        'div[role="button"]': btn3,
        '.nsm7Bb-HzV7m-LgbsSe': btn4,
        'all divs': googleButtonRef.current?.querySelectorAll('div'),
        innerHTML: googleButtonRef.current?.innerHTML?.substring(0, 200),
      });

      const googleBtn = btn1 || btn2 || btn3 || btn4;

      if (googleBtn) {
        console.log('✅ Google button found!', googleBtn);
        setIsGoogleLoaded(true);
        clearInterval(checkInterval);
      } else {
        console.log('❌ Google button not found yet');
      }
    }, 500); // Check alle 500ms

    // Stop checking nach 10 Sekunden
    const timeout = setTimeout(() => {
      console.error('⚠️ Google button could not be loaded after 10 seconds');
      clearInterval(checkInterval);
    }, 10000);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleCustomGoogleClick = () => {
    console.log('🖱️ Custom button clicked');
    console.log('Is Google loaded?', isGoogleLoaded);
    console.log('Ref current:', googleButtonRef.current);

    if (!isGoogleLoaded) {
      console.warn('⚠️ Google button not loaded yet!');
      showFeedback('Google Login lädt noch...', 'info');
      return;
    }

    // Versuche alle möglichen Selektoren
    const selectors = [
      'button',
      '[role="button"]',
      'div[role="button"]',
      '.nsm7Bb-HzV7m-LgbsSe',
      '[data-type="icon"]',
      'iframe',
    ];

    let googleBtn = null;
    for (const selector of selectors) {
      googleBtn = googleButtonRef.current?.querySelector(selector);
      if (googleBtn) {
        console.log(`✅ Found button with selector: ${selector}`, googleBtn);
        break;
      }
    }

    if (googleBtn) {
      console.log('🎯 Clicking Google button...');
      (googleBtn as HTMLElement).click();
      console.log('✅ Google button clicked!');
    } else {
      console.error('❌ Google button not found!');
      console.log('Current ref HTML:', googleButtonRef.current?.innerHTML);
      showFeedback('Google Login konnte nicht gestartet werden', 'error');
    }
  };

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
      const response: any = await login(data.email, data.password);
      if (typeof response === 'string') showFeedback(response, 'error');
      if (!response.success || goTo === null) return;
      router.replace(goTo || '/profile');
      joinUserRoom(response?.data.user.id);
      showFeedback(t('feedback.login-success'), 'success');
    } catch (err) {
      showFeedback(t('feedback.login-error'), 'error');
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
        <>
          <Button
            onClick={handleCustomGoogleClick}
            disabled={!isGoogleLoaded}
            variant={isGoogleLoaded ? 'primary' : 'secondary'}
          >
            <GoogleGIcon width={20} height={20} />
            {isGoogleLoaded ? 'Mit Google anmelden' : 'Google lädt...'}
          </Button>

          {/* Debug: Mache es temporär sichtbar */}
          <div
            ref={googleButtonRef}
            style={{
              opacity: '0.3', // Leicht sichtbar zum Debuggen
              border: '2px solid red', // Roter Rahmen zum Debuggen
              marginTop: '10px',
            }}
          >
            <GoogleLogin
              onSuccess={async (response) => {
                console.log('🎉 Google login success!', response);
                if (response.credential) {
                  const result = await loginWithGoogle(response.credential);
                  if (result?.success) router.replace(goTo || '/profile');
                }
              }}
              onError={() => {
                console.error('❌ Google login error');
                showFeedback(t('feedback.login-error'), 'error');
              }}
            />
          </div>
        </>

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
