import React, { FC, useEffect } from 'react';
import { FormContainer } from '@/components/system/Container';
import style from '@/styles/UserProfileForm.module.scss';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Button, {
  ButtonContainer,
  ButtonGroup,
} from '@/components/system/Button';
import { useError } from '@/hooks/ErrorHook';
import { useAuth } from '@/hooks/AuthHook';
import { useForm } from 'react-hook-form';
import { UserInformation } from '@/types/auth';
import { updateUserInfo } from '@/requests/user.request';
import { Logger } from '@/utils/Logger.class';
import { useFeedback } from '@/hooks/FeedbackHook';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export interface UserProfileFormData {
  type: string;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

const getFormDefaultValues = (userInfo: any): UserProfileFormData => {
  return {
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName || '',
    email: userInfo?.email || '',
    phoneNumber: userInfo?.phoneNumber || '',
    type: 'home',
    street: userInfo?.addresses?.[0]?.street || '',
    houseNumber: userInfo?.addresses?.[0]?.houseNumber || '',
    city: userInfo?.addresses?.[0]?.city || '',
    state: userInfo?.addresses?.[0]?.state || '',
    zipCode: userInfo?.addresses?.[0]?.zipCode || '',
    country: userInfo?.addresses?.[0]?.country || 'CH',
    isDefault: true,
  };
};

interface UserInformationFormProps {
  onCheckout?: (data: UserProfileFormData) => Promise<void>;
}

const UserInformationForm: FC<UserInformationFormProps> = ({ onCheckout }) => {
  const { t } = useTranslation();
  const { transformFieldError } = useError();
  const { userInformation, isLoading } = useAuth();
  const { showFeedback } = useFeedback();
  const { logout } = useAuth();
  const router: AppRouterInstance = useRouter();
  const pathname = usePathname();
  const hasProfile = pathname.includes('/profile');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserProfileFormData>({
    defaultValues: getFormDefaultValues(userInformation),
  });

  useEffect(() => {
    if (userInformation) reset(getFormDefaultValues(userInformation));
    if (!userInformation && !isLoading && hasProfile) router.replace('/login');
  }, [userInformation, reset, isLoading]);

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const updatedUserData: UserInformation = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        addresses: [
          {
            type: 'home',
            street: data.street,
            houseNumber: data.houseNumber,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: 'ch',
            isDefault: true,
          },
        ],
      };
      await updateUserInfo(updatedUserData);
      showFeedback(t('feedback.profileUpdatedSuccess'), 'success');
    } catch (error) {
      Logger.error('Error updating profile:', error);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return true; // Allow empty when not required
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || t('validation.invalidEmail');
  };

  const validatePhoneNumber = (phone: string | undefined) => {
    if (!phone) return true; // Allow empty when not required
    const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
    return phoneRegex.test(phone) || t('validation.invalidPhoneNumber');
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      router.replace('/login');
      showFeedback(t('feedback.logoutSuccess'), 'success');
    } catch (e) {
      showFeedback(t('feedback.logoutError'), 'error');
      Logger.error('error while logout', e);
    }
  };
  const handlePWChange = async (): Promise<void> => {
    router.replace('/changePassword');
  };

  const options = [
    {
      label: t('userProfile.logout'),
      onClick: handleLogout,
      active: false,
    },
    {
      label: t('userProfile.changePassword'),
      onClick: handlePWChange,
      active: false,
    },
  ];

  return (
    <section className={style.userProfileForm}>
      <FormContainer
        className={style.formContainer}
        onSubmitAction={handleSubmit(onCheckout || onSubmit)}
      >
        {!onCheckout && <ButtonGroup options={options} />}
        <section className={style.section}>
          {onCheckout ? (
            <h2>{t('userProfile.orderInformation')}</h2>
          ) : (
            <h2>{t('userProfile.userInformation')}</h2>
          )}
          <FormRow>
            <Input
              label={t('userProfile.firstName')}
              required
              fullWidth
              placeholder={t('placeholders.enterFirstName')}
              inputProps={register('firstName', {
                required: t('validation.required'),
                minLength: { value: 2, message: t('validation.minLength') },
              })}
              {...transformFieldError(errors.firstName)}
            />
          </FormRow>

          <FormRow>
            <Input
              label={t('userProfile.lastName')}
              required
              fullWidth
              placeholder={t('placeholders.enterLastName')}
              inputProps={register('lastName', {
                required: t('validation.required'),
                minLength: { value: 2, message: t('validation.minLength') },
              })}
              {...transformFieldError(errors.lastName)}
            />
          </FormRow>
          <FormRow>
            <Input
              type="email"
              label={t('userProfile.emailAddress')}
              required
              fullWidth
              placeholder={t('placeholders.enterEmailAddress')}
              clearable
              inputProps={register('email', {
                required: t('validation.required'),
                validate: validateEmail,
              })}
              {...transformFieldError(errors.email)}
            />
          </FormRow>
          <FormRow>
            <Input
              type="tel"
              label={t('userProfile.phoneNumber')}
              fullWidth
              placeholder={t('placeholders.enterPhoneNumber')}
              clearable
              inputProps={register('phoneNumber', {
                validate: validatePhoneNumber,
              })}
              {...transformFieldError(errors.phoneNumber)}
            />
          </FormRow>
          <h3>{t('userProfile.addressInformation')}</h3>
          <FormRow>
            <Input
              label={t('userProfile.streetAddress')}
              required
              fullWidth
              placeholder={t('placeholders.enterStreetAddress')}
              inputProps={register('street', {
                required: t('validation.required'),
                minLength: {
                  value: 5,
                  message: t('validation.streetAddressTooShort'),
                },
              })}
              {...transformFieldError(errors.street)}
            />
          </FormRow>
          <FormRow>
            <Input
              label={t('userProfile.houseNumber')}
              required
              fullWidth
              placeholder={t('placeholders.enterHouseNumber')}
              inputProps={register('houseNumber', {
                required: t('validation.required'),
              })}
              {...transformFieldError(errors.street)}
            />
          </FormRow>
          <FormRow direction="row">
            <Input
              label={t('userProfile.city')}
              required
              fullWidth
              placeholder={t('placeholders.enterCity')}
              inputProps={register('city', {
                required: t('validation.required'),
                minLength: { value: 2, message: t('validation.minLength') },
              })}
              {...transformFieldError(errors.city)}
            />

            <Input
              label={t('userProfile.stateProvince')}
              fullWidth
              placeholder={t('placeholders.enterState')}
              inputProps={register('state')}
              {...transformFieldError(errors.state)}
            />
          </FormRow>
          <FormRow direction="row">
            <Input
              label={t('userProfile.zipPostalCode')}
              type={'number'}
              required
              fullWidth
              placeholder={t('placeholders.enterZipCode')}
              inputProps={register('zipCode', {
                required: t('validation.required'),
                minLength: 4,
                maxLength: 4,
              })}
              {...transformFieldError(errors.zipCode)}
            />
          </FormRow>
          <ButtonContainer>
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={!!onCheckout ? () => router.back() : () => reset()}
                disabled={isSubmitting || !isDirty}
              >
                {t('userProfile.cancel')}
              </Button>
              <Button
                type={'submit'}
                disabled={isSubmitting || onCheckout ? false : !isDirty}
              >
                {!!onCheckout
                  ? t('userProfile.continue')
                  : t('userProfile.save')}
              </Button>
            </>
          </ButtonContainer>
        </section>
      </FormContainer>
    </section>
  );
};

export default UserInformationForm;
