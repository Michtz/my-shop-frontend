'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import style from '@/styles/UserProfileForm.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';

interface UserProfileFormData {
  // Personal Information (matches IUser)
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;

  // Addresses (matches IAddress[])
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }[];

  // Payment Information (for adding new cards)
  newPaymentInfo?: {
    cardNumber: string; // Only for form input - backend will store lastFourDigits
    cardType: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    isDefault?: boolean;
  };

  // Account Settings
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const UserProfileForm: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { transformFieldError } = useError();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'customer',
      addresses: [
        {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'CH',
          isDefault: true,
        },
      ],
      newPaymentInfo: {
        cardNumber: '',
        cardType: 'credit',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: true,
      },
    },
  });

  const watchedNewPassword = watch('newPassword');

  // Remove the copy billing address logic since we're using a single addresses array now

  const onSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    console.log('User Profile submitted:', data);

    // Transform the form data to match backend expectations
    const backendData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
      addresses: data.addresses,
      // If adding new payment info, transform card data
      ...(data.newPaymentInfo?.cardNumber && {
        newPaymentInfo: {
          cardType: data.newPaymentInfo.cardType,
          lastFourDigits: data.newPaymentInfo.cardNumber.slice(-4),
          expiryDate: data.newPaymentInfo.expiryDate,
          isDefault: data.newPaymentInfo.isDefault,
        },
      }),
    };

    try {
      // API call here - send backendData
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return true; // Allow empty when not required
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || 'invalidEmail';
  };

  const validatePhoneNumber = (phone: string | undefined) => {
    if (!phone) return true; // Allow empty when not required
    const phoneRegex = /^[+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone) || 'Invalid phone number';
  };

  const validatePasswordMatch = (value: string | undefined) => {
    if (!value) return true; // Allow empty when not required
    return (
      !watchedNewPassword ||
      value === watchedNewPassword ||
      'Passwords do not match'
    );
  };

  const validateCreditCard = (cardNumber: string | undefined) => {
    if (!cardNumber) return true; // Allow empty when not required
    const cleaned = cardNumber.replace(/\s/g, '');
    return (
      (cleaned.length >= 13 && cleaned.length <= 19) || 'Invalid card number'
    );
  };

  const validateExpiryDate = (date: string | undefined) => {
    if (!date) return true; // Allow empty when not required
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(date)) return 'Format: MM/YY';

    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();

    return expiry > now || 'Card expired';
  };

  return (
    <div className={style.userProfileForm}>
      <FormContainer
        className={style.formContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        {/* Personal Information Section */}
        <section className={style.section}>
          <h2 className={style.sectionTitle}>Personal Information</h2>

          <FormRow direction="row">
            <Input
              label="First Name"
              tooltip={{ text: 'Your legal first name' }}
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
              tooltip={{ text: 'Your legal last name' }}
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

          <FormRow direction="row">
            <Input
              type="email"
              label="Email Address"
              tooltip={{
                text: 'Your primary email for orders and notifications',
              }}
              required
              fullWidth
              placeholder="Enter email address..."
              startIcon="email"
              clearable
              inputProps={register('email', {
                required: 'required',
                validate: validateEmail,
              })}
              {...transformFieldError(errors.email)}
            />

            <Input
              type="tel"
              label="Phone Number"
              tooltip={{ text: 'For delivery updates and order confirmation' }}
              fullWidth
              placeholder="+41 XX XXX XX XX"
              startIcon="phone"
              inputProps={register('phoneNumber', {
                validate: validatePhoneNumber,
              })}
              {...transformFieldError(errors.phoneNumber)}
            />
          </FormRow>

          <FormRow>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className={style.selectContainer}>
                  <label className={style.selectLabel}>Account Type</label>
                  <select {...field} className={style.countrySelect}>
                    <option value="customer">Customer</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              )}
            />
          </FormRow>
        </section>

        {/* Addresses Section */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Addresses</h2>
            <button
              type="button"
              className={style.toggleButton}
              onClick={() => {
                const currentAddresses = watch('addresses');
                setValue('addresses', [
                  ...currentAddresses,
                  {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'CH',
                    isDefault: false,
                  },
                ]);
              }}
            >
              Add Address
            </button>
          </div>

          {watch('addresses').map((_, index) => (
            <div key={index} className={style.addressCard}>
              <div className={style.addressHeader}>
                <h3 className={style.addressTitle}>
                  Address {index + 1}
                  {watch(`addresses.${index}.isDefault`) && (
                    <span className={style.defaultBadge}>Default</span>
                  )}
                </h3>
                {watch('addresses').length > 1 && (
                  <button
                    type="button"
                    className={style.deleteButton}
                    onClick={() => {
                      const currentAddresses = watch('addresses');
                      setValue(
                        'addresses',
                        currentAddresses.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormRow direction="row">
                <Input
                  label="Street"
                  required
                  fullWidth
                  placeholder="Street name and number..."
                  startIcon="home"
                  inputProps={register(`addresses.${index}.street`, {
                    required: 'required',
                  })}
                  {...transformFieldError(errors.addresses?.[index]?.street)}
                />

                <Input
                  label="State/Province"
                  required
                  fullWidth
                  placeholder="State or Province..."
                  inputProps={register(`addresses.${index}.state`, {
                    required: 'required',
                  })}
                  {...transformFieldError(errors.addresses?.[index]?.state)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  label="ZIP Code"
                  required
                  fullWidth
                  placeholder="6003"
                  inputProps={register(`addresses.${index}.zipCode`, {
                    required: 'required',
                    pattern: {
                      value: /^\d{4,6}$/,
                      message: 'Invalid ZIP code',
                    },
                  })}
                  {...transformFieldError(errors.addresses?.[index]?.zipCode)}
                />

                <Input
                  label="City"
                  required
                  fullWidth
                  placeholder="Lucerne"
                  startIcon="location_city"
                  inputProps={register(`addresses.${index}.city`, {
                    required: 'required',
                  })}
                  {...transformFieldError(errors.addresses?.[index]?.city)}
                />
              </FormRow>

              <FormRow direction="row">
                <Controller
                  name={`addresses.${index}.country`}
                  control={control}
                  rules={{ required: 'required' }}
                  render={({ field }) => (
                    <div className={style.selectContainer}>
                      <label className={style.selectLabel}>Country *</label>
                      <select {...field} className={style.countrySelect}>
                        <option value="CH">Switzerland</option>
                        <option value="DE">Germany</option>
                        <option value="AT">Austria</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                      </select>
                    </div>
                  )}
                />

                <label className={style.checkbox}>
                  <input
                    type="checkbox"
                    {...register(`addresses.${index}.isDefault`)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Set all others to false
                        const addresses = watch('addresses');
                        addresses.forEach((_, i) => {
                          setValue(`addresses.${i}.isDefault`, i === index);
                        });
                      }
                    }}
                  />
                  Set as default address
                </label>
              </FormRow>
            </div>
          ))}
        </section>

        {/* Payment Method Section */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Payment Methods</h2>
            <button
              type="button"
              className={style.toggleButton}
              onClick={() => setShowAddPaymentForm(!showAddPaymentForm)}
            >
              {showAddPaymentForm ? 'Cancel' : 'Add Payment Method'}
            </button>
          </div>

          {/* Display existing payment methods */}
          <div className={style.paymentMethodsList}>
            <p className={style.infoText}>
              Your existing payment methods will be loaded from the backend
              here.
            </p>
          </div>

          {/* Add new payment method form */}
          {showAddPaymentForm && (
            <div className={style.paymentForm}>
              <h3 className={style.subSectionTitle}>Add New Payment Method</h3>

              <FormRow>
                <Controller
                  name="newPaymentInfo.cardType"
                  control={control}
                  render={({ field }) => (
                    <div className={style.selectContainer}>
                      <label className={style.selectLabel}>Card Type *</label>
                      <select {...field} className={style.countrySelect}>
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="prepaid">Prepaid Card</option>
                      </select>
                    </div>
                  )}
                />
              </FormRow>

              <FormRow>
                <Input
                  label="Cardholder Name"
                  required
                  fullWidth
                  placeholder="Name on card..."
                  startIcon="person"
                  inputProps={register('newPaymentInfo.cardholderName', {
                    required: 'required',
                  })}
                  {...transformFieldError(
                    errors.newPaymentInfo?.cardholderName,
                  )}
                />
              </FormRow>

              <FormRow>
                <Input
                  label="Card Number"
                  required
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  startIcon="credit_card"
                  inputProps={register('newPaymentInfo.cardNumber', {
                    required: 'required',
                    validate: validateCreditCard,
                  })}
                  {...transformFieldError(errors.newPaymentInfo?.cardNumber)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  label="Expiry Date"
                  required
                  fullWidth
                  placeholder="MM/YY"
                  startIcon="event"
                  inputProps={register('newPaymentInfo.expiryDate', {
                    required: 'required',
                    validate: validateExpiryDate,
                  })}
                  {...transformFieldError(errors.newPaymentInfo?.expiryDate)}
                />

                <Input
                  label="CVV"
                  required
                  fullWidth
                  placeholder="123"
                  startIcon="security"
                  inputProps={register('newPaymentInfo.cvv', {
                    required: 'required',
                    pattern: { value: /^\d{3,4}$/, message: 'Invalid CVV' },
                  })}
                  {...transformFieldError(errors.newPaymentInfo?.cvv)}
                />
              </FormRow>

              <FormRow>
                <label className={style.checkbox}>
                  <input
                    type="checkbox"
                    {...register('newPaymentInfo.isDefault')}
                  />
                  Set as default payment method
                </label>
              </FormRow>
            </div>
          )}
        </section>

        {/* Password Change Section */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Change Password</h2>
            <button
              type="button"
              className={style.toggleButton}
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordFields && (
            <>
              <FormRow>
                <Input
                  type="password"
                  label="Current Password"
                  required
                  fullWidth
                  placeholder="Enter current password..."
                  startIcon="lock"
                  showPasswordToggle
                  inputProps={register('currentPassword', {
                    required: 'required',
                  })}
                  {...transformFieldError(errors.currentPassword)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  type="password"
                  label="New Password"
                  required
                  fullWidth
                  placeholder="Enter new password..."
                  startIcon="lock"
                  showPasswordToggle
                  inputProps={register('newPassword', {
                    required: 'required',
                    minLength: { value: 8, message: 'minLength' },
                  })}
                  {...transformFieldError(errors.newPassword)}
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  required
                  fullWidth
                  placeholder="Confirm new password..."
                  startIcon="lock"
                  showPasswordToggle
                  inputProps={register('confirmNewPassword', {
                    required: 'required',
                    validate: validatePasswordMatch,
                  })}
                  {...transformFieldError(errors.confirmNewPassword)}
                />
              </FormRow>
            </>
          )}
        </section>

        {/* Submit Buttons */}
        <FormRow direction="row" gap="small">
          <button type="button" className={style.cancelButton}>
            Cancel Changes
          </button>
          <button type="submit" className={style.submitButton}>
            Save Profile
          </button>
        </FormRow>
      </FormContainer>
    </div>
  );
};

export default UserProfileForm;
