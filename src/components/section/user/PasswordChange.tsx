'use client';
import React, { FC, useState } from 'react';
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
import { useAuth } from '@/hooks/AuthHook';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordChangeProps {}

const PasswordChangeForm: FC<PasswordChangeProps> = () => {
  const { transformFieldError } = useError();
  const { showFeedback } = useFeedback();
  const router: AppRouterInstance = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeData>();

  const watchedNewPassword = watch('newPassword');

  const validatePasswordMatch = (value: string) => {
    return value === watchedNewPassword || 'Passwords do not match';
  };

  const validatePasswordStrength = (password: string) => {
    if (password.length < 8)
      return 'Password must be at least 8 characters long';

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password))
      return 'Password must contain both uppercase and lowercase letters';

    if (!/(?=.*\d)/.test(password))
      return 'Password must contain at least one number';

    return true;
  };

  const onSubmit = async (data: PasswordChangeData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      router.push('/profile');
      showFeedback('Password changed successfully!', 'success');
    } catch (error) {
      Logger.error('Error changing password:', error);
      showFeedback('An error occurred while changing password', 'error');
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
            label="Current Password"
            type="password"
            required
            fullWidth
            placeholder="Enter current password..."
            inputProps={register('currentPassword', {
              required: 'Current password is required',
              minLength: {
                value: 1,
                message: 'Current password is required',
              },
            })}
            {...transformFieldError(errors.currentPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label="New Password"
            type="password"
            required
            fullWidth
            placeholder="Enter new password..."
            inputProps={register('newPassword', {
              required: 'New password is required',
              validate: validatePasswordStrength,
            })}
            {...transformFieldError(errors.newPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label="Confirm New Password"
            type="password"
            required
            fullWidth
            placeholder="Confirm new password..."
            inputProps={register('confirmNewPassword', {
              required: 'Please confirm your new password',
              validate: validatePasswordMatch,
            })}
            {...transformFieldError(errors.confirmNewPassword)}
          />
        </FormRow>

        <div className={style.passwordInfo}>
          <p className={style.infoText}>Password requirements:</p>
          <ul className={style.requirementsList}>
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        <ButtonContainer>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </section>
  );
};

export default PasswordChangeForm;
