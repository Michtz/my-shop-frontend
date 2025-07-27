'use client';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import style from '@/styles/UserProfileForm.module.scss';
import { useError } from '@/hooks/ErrorHook';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useFeedback } from '@/hooks/FeedbackHook';
import { Logger } from '@/utils/Logger.class';
import { changePassword } from '@/requests/user.request';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useTranslation } from 'react-i18next';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordChangeForm: FC = () => {
  const { t } = useTranslation();
  const { transformFieldError } = useError();
  const { showFeedback } = useFeedback();
  const router: AppRouterInstance = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeData>();

  const watchedNewPassword = watch('newPassword');

  const validatePasswordMatch = (value: string) => {
    return (
      value === watchedNewPassword || t('passwordChange.passwordsDoNotMatch')
    );
  };

  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return t('passwordChange.passwordTooShort');

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password))
      return t('passwordChange.passwordMissingCase');

    if (!/(?=.*\d)/.test(password))
      return t('passwordChange.passwordMissingNumber');

    return true;
  };

  const onSubmit = async (data: PasswordChangeData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      router.push('/profile');
      showFeedback(t('passwordChange.passwordChangedSuccess'), 'success');
    } catch (error) {
      Logger.error('Error changing password:', error);
      showFeedback(t('passwordChange.passwordChangeError'), 'error');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <section className={style.section}>
      <FormContainer
        className={style.passwordFormContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Input
            label={t('passwordChange.currentPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.currentPasswordPlaceholder')}
            inputProps={register('currentPassword', {
              required: t('passwordChange.currentPasswordRequired'),
              minLength: {
                value: 1,
                message: t('passwordChange.currentPasswordRequired'),
              },
            })}
            {...transformFieldError(errors.currentPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label={t('passwordChange.newPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.newPasswordPlaceholder')}
            inputProps={register('newPassword', {
              required: t('passwordChange.newPasswordRequired'),
              validate: validatePasswordStrength,
            })}
            {...transformFieldError(errors.newPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label={t('passwordChange.confirmNewPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.confirmPasswordPlaceholder')}
            inputProps={register('confirmNewPassword', {
              required: t('passwordChange.confirmPasswordRequired'),
              validate: validatePasswordMatch,
            })}
            {...transformFieldError(errors.confirmNewPassword)}
          />
        </FormRow>

        <div className={style.passwordInfo}>
          <p className={style.infoText}>
            {t('passwordChange.passwordRequirements')}
          </p>
          <ul className={style.requirementsList}>
            <li>{t('passwordChange.requirement1')}</li>
            <li>{t('passwordChange.requirement2')}</li>
            <li>{t('passwordChange.requirement3')}</li>
          </ul>
        </div>

        <ButtonContainer>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {t('passwordChange.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('passwordChange.changing')
              : t('passwordChange.changePasswordButton')}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </section>
  );
};

export default PasswordChangeForm;
