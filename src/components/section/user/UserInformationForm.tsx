import React, { FC, useEffect } from 'react';
import { FormContainer } from '@/components/system/Container';
import style from '@/styles/UserProfileForm.module.scss';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useError } from '@/hooks/ErrorHook';
import { useAuth } from '@/hooks/AuthHook';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { UpdateUserRequest } from '@/types/auth';
import { updateUserInfo } from '@/requests/user.request';
import { Logger } from '@/utils/Logger.class';
import { useFeedback } from '@/hooks/FeedbackHook';

interface UserProfileFormData {
  type: string;
  street: string;
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
    city: userInfo?.addresses?.[0]?.city || '',
    state: userInfo?.addresses?.[0]?.state || '',
    zipCode: userInfo?.addresses?.[0]?.zipCode || '',
    country: userInfo?.addresses?.[0]?.country || 'CH',
    isDefault: true,
  };
};

const UserInformationForm: FC = () => {
  const { transformFieldError } = useError();
  const { userInformation } = useAuth();
  const { showFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    defaultValues: getFormDefaultValues(userInformation),
  });

  useEffect(() => {
    if (userInformation) reset(getFormDefaultValues(userInformation));
  }, [userInformation]);

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const updatedUserData: UpdateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        addresses: [
          {
            type: 'home',
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: 'ch',
            isDefault: true,
          },
        ],
      };
      await updateUserInfo(updatedUserData);
      showFeedback('Profile updated successfully!', 'success');
    } catch (error) {
      Logger.error('Error updating profile:', error);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return true; // Allow empty when not required
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || 'invalidEmail';
  };

  const validatePhoneNumber = (phone: string | undefined) => {
    if (!phone) return true; // Allow empty when not required
    const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
    return phoneRegex.test(phone) || 'Invalid phone number';
  };

  return (
    <FormContainer
      className={style.formContainer}
      onSubmitAction={handleSubmit(onSubmit)}
    >
      <section className={style.section}>
        <h2>Nutzer Informationen</h2>
        <FormRow direction="row">
          <Input
            label="First Name"
            required
            fullWidth
            placeholder="Enter first name..."
            inputProps={register('firstName', {
              required: 'required',
              minLength: { value: 2, message: 'minLength' },
            })}
            {...transformFieldError(errors.firstName)}
          />

          <Input
            label="Last Name"
            required
            fullWidth
            placeholder="Enter last name..."
            inputProps={register('lastName', {
              required: 'required',
              minLength: { value: 2, message: 'minLength' },
            })}
            {...transformFieldError(errors.lastName)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="email"
            label="Email Address"
            required
            fullWidth
            placeholder="Enter email address..."
            clearable
            inputProps={register('email', {
              required: 'required',
              validate: validateEmail,
            })}
            {...transformFieldError(errors.email)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="tel"
            label="Phone Number"
            fullWidth
            placeholder="Enter phone number..."
            clearable
            inputProps={register('phoneNumber', {
              validate: validatePhoneNumber,
            })}
            {...transformFieldError(errors.phoneNumber)}
          />
        </FormRow>

        <h3>Address Information</h3>

        <FormRow>
          <Input
            label="Street Address"
            required
            fullWidth
            placeholder="Enter street address..."
            inputProps={register('street', {
              required: 'required',
              minLength: { value: 5, message: 'Street address too short' },
            })}
            {...transformFieldError(errors.street)}
          />
        </FormRow>

        <FormRow direction="row">
          <Input
            label="City"
            required
            fullWidth
            placeholder="Enter city..."
            inputProps={register('city', {
              required: 'required',
              minLength: { value: 2, message: 'minLength' },
            })}
            {...transformFieldError(errors.city)}
          />

          <Input
            label="State/Province"
            fullWidth
            placeholder="Enter state..."
            inputProps={register('state')}
            {...transformFieldError(errors.state)}
          />
        </FormRow>

        <FormRow direction="row">
          <Input
            label="ZIP/Postal Code"
            type={'number'}
            required
            fullWidth
            placeholder="Enter ZIP code..."
            inputProps={register('zipCode', {
              required: 'required',
              minLength: 4,
              maxLength: 4,
            })}
            {...transformFieldError(errors.zipCode)}
          />
        </FormRow>
        <ButtonContainer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type={'submit'}>save</Button>
        </ButtonContainer>
      </section>
    </FormContainer>
  );
};

export default UserInformationForm;
