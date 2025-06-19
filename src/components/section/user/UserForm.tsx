'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import style from '@/styles/UserProfileForm.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import MaterialIcon from '@/components/system/MaterialIcon';

interface UserProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;

  // Billing Address
  billingAddress: {
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    country: string;
    company?: string;
  };

  // Shipping Address
  shippingAddress: {
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    country: string;
    company?: string;
  };

  // Payment Information
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'sepa';
  creditCard?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };

  // Account Settings
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;

  // Preferences
  newsletter: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  marketingEmails: boolean;
}

const UserProfileForm: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { transformFieldError } = useError();
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

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
      phone: '',
      dateOfBirth: '',
      billingAddress: {
        street: '',
        houseNumber: '',
        zipCode: '',
        city: '',
        country: 'CH',
        company: '',
      },
      shippingAddress: {
        street: '',
        houseNumber: '',
        zipCode: '',
        city: '',
        country: 'CH',
        company: '',
      },
      paymentMethod: 'credit_card',
      creditCard: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
      },
      newsletter: false,
      smsNotifications: true,
      orderNotifications: true,
      marketingEmails: false,
    },
  });

  const watchedPaymentMethod = watch('paymentMethod');
  const watchedNewPassword = watch('newPassword');
  const watchedBillingAddress = watch('billingAddress');

  // Copy billing address to shipping address
  useEffect(() => {
    if (useShippingAsBilling) {
      setValue('shippingAddress', watchedBillingAddress);
    }
  }, [useShippingAsBilling, watchedBillingAddress, setValue]);

  const onSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    console.log('User Profile submitted:', data);
    // Handle form submission - save to backend
    try {
      // API call here
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || 'invalidEmail';
  };

  const validatePhoneNumber = (phone: string) => {
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

  const validateCreditCard = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return (
      (cleaned.length >= 13 && cleaned.length <= 19) || 'Invalid card number'
    );
  };

  const validateExpiryDate = (date: string) => {
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
              inputProps={register('phone', {
                validate: validatePhoneNumber,
              })}
              {...transformFieldError(errors.phone)}
            />
          </FormRow>

          {/*<FormRow>*/}
          {/*  <Input*/}
          {/*    type="date"*/}
          {/*    label="Date of Birth"*/}
          {/*    tooltip={{*/}
          {/*      text: 'Optional - for birthday discounts and age verification',*/}
          {/*    }}*/}
          {/*    fullWidth*/}
          {/*    inputProps={register('dateOfBirth')}*/}
          {/*    {...transformFieldError(errors.dateOfBirth)}*/}
          {/*  />*/}
          {/*</FormRow>*/}
        </section>

        {/* Billing Address Section */}
        <section className={style.section}>
          <h2 className={style.sectionTitle}>Billing Address</h2>

          <FormRow>
            <Input
              label="Company (Optional)"
              fullWidth
              placeholder="Company name..."
              startIcon="business"
              inputProps={register('billingAddress.company')}
              {...transformFieldError(errors.billingAddress?.company)}
            />
          </FormRow>

          <FormRow direction="row">
            <Input
              label="Street"
              required
              fullWidth
              placeholder="Street name..."
              startIcon="home"
              inputProps={register('billingAddress.street', {
                required: 'required',
              })}
              {...transformFieldError(errors.billingAddress?.street)}
            />

            <Input
              label="House Number"
              required
              fullWidth
              placeholder="123a"
              inputProps={register('billingAddress.houseNumber', {
                required: 'required',
              })}
              {...transformFieldError(errors.billingAddress?.houseNumber)}
            />
          </FormRow>

          <FormRow direction="row">
            <Input
              label="ZIP Code"
              required
              fullWidth
              placeholder="6003"
              inputProps={register('billingAddress.zipCode', {
                required: 'required',
                pattern: { value: /^\d{4,6}$/, message: 'Invalid ZIP code' },
              })}
              {...transformFieldError(errors.billingAddress?.zipCode)}
            />

            <Input
              label="City"
              required
              fullWidth
              placeholder="Lucerne"
              startIcon="location_city"
              inputProps={register('billingAddress.city', {
                required: 'required',
              })}
              {...transformFieldError(errors.billingAddress?.city)}
            />
          </FormRow>

          <FormRow>
            <Controller
              name="billingAddress.country"
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
          </FormRow>
        </section>

        {/* Shipping Address Section */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Shipping Address</h2>
            <label className={style.checkbox}>
              <input
                type="checkbox"
                checked={useShippingAsBilling}
                onChange={(e) => setUseShippingAsBilling(e.target.checked)}
              />
              Same as billing address
            </label>
          </div>

          {!useShippingAsBilling && (
            <>
              <FormRow>
                <Input
                  label="Company (Optional)"
                  fullWidth
                  placeholder="Company name..."
                  startIcon="business"
                  inputProps={register('shippingAddress.company')}
                  {...transformFieldError(errors.shippingAddress?.company)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  label="Street"
                  required
                  fullWidth
                  placeholder="Street name..."
                  startIcon="home"
                  inputProps={register('shippingAddress.street', {
                    required: !useShippingAsBilling ? 'required' : false,
                  })}
                  {...transformFieldError(errors.shippingAddress?.street)}
                />

                <Input
                  label="House Number"
                  required
                  fullWidth
                  placeholder="123a"
                  inputProps={register('shippingAddress.houseNumber', {
                    required: !useShippingAsBilling ? 'required' : false,
                  })}
                  {...transformFieldError(errors.shippingAddress?.houseNumber)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  label="ZIP Code"
                  required
                  fullWidth
                  placeholder="6003"
                  inputProps={register('shippingAddress.zipCode', {
                    required: !useShippingAsBilling ? 'required' : false,
                    pattern: {
                      value: /^\d{4,6}$/,
                      message: 'Invalid ZIP code',
                    },
                  })}
                  {...transformFieldError(errors.shippingAddress?.zipCode)}
                />

                <Input
                  label="City"
                  required
                  fullWidth
                  placeholder="Lucerne"
                  startIcon="location_city"
                  inputProps={register('shippingAddress.city', {
                    required: !useShippingAsBilling ? 'required' : false,
                  })}
                  {...transformFieldError(errors.shippingAddress?.city)}
                />
              </FormRow>

              <FormRow>
                <Controller
                  name="shippingAddress.country"
                  control={control}
                  rules={{
                    required: !useShippingAsBilling ? 'required' : false,
                  }}
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
              </FormRow>
            </>
          )}
        </section>

        {/* Payment Method Section */}
        <section className={style.section}>
          <h2 className={style.sectionTitle}>Payment Method</h2>

          <FormRow>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <div className={style.paymentMethods}>
                  {[
                    {
                      value: 'credit_card',
                      label: 'Credit Card',
                      icon: 'credit_card',
                    },
                    {
                      value: 'paypal',
                      label: 'PayPal',
                      icon: 'account_balance_wallet',
                    },
                    {
                      value: 'bank_transfer',
                      label: 'Bank Transfer',
                      icon: 'account_balance',
                    },
                    {
                      value: 'sepa',
                      label: 'SEPA Direct Debit',
                      icon: 'receipt',
                    },
                  ].map((method) => (
                    <label key={method.value} className={style.paymentMethod}>
                      <input
                        type="radio"
                        {...field}
                        value={method.value}
                        checked={field.value === method.value}
                      />
                      <span className={style.paymentMethodContent}>
                        <MaterialIcon icon={method.icon} />
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
          </FormRow>

          {watchedPaymentMethod === 'credit_card' && (
            <>
              <FormRow>
                <Input
                  label="Cardholder Name"
                  required
                  fullWidth
                  placeholder="Name on card..."
                  startIcon="person"
                  inputProps={register('creditCard.cardholderName', {
                    required: 'required',
                  })}
                  {...transformFieldError(errors.creditCard?.cardholderName)}
                />
              </FormRow>

              <FormRow>
                <Input
                  label="Card Number"
                  required
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  startIcon="credit_card"
                  inputProps={register('creditCard.cardNumber', {
                    required: 'required',
                    validate: validateCreditCard,
                  })}
                  {...transformFieldError(errors.creditCard?.cardNumber)}
                />
              </FormRow>

              <FormRow direction="row">
                <Input
                  label="Expiry Date"
                  required
                  fullWidth
                  placeholder="MM/YY"
                  startIcon="event"
                  inputProps={register('creditCard.expiryDate', {
                    required: 'required',
                    validate: validateExpiryDate,
                  })}
                  {...transformFieldError(errors.creditCard?.expiryDate)}
                />

                <Input
                  label="CVV"
                  required
                  fullWidth
                  placeholder="123"
                  startIcon="security"
                  inputProps={register('creditCard.cvv', {
                    required: 'required',
                    pattern: { value: /^\d{3,4}$/, message: 'Invalid CVV' },
                  })}
                  {...transformFieldError(errors.creditCard?.cvv)}
                />
              </FormRow>
            </>
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

        {/* Notification Preferences */}
        <section className={style.section}>
          <h2 className={style.sectionTitle}>Notification Preferences</h2>

          <div className={style.checkboxGroup}>
            {[
              {
                name: 'orderNotifications',
                label: 'Order Status Updates',
                description: 'Receive updates about your orders',
              },
              {
                name: 'newsletter',
                label: 'Newsletter',
                description: 'Weekly newsletter with new products and offers',
              },
              {
                name: 'smsNotifications',
                label: 'SMS Notifications',
                description: 'Delivery updates via SMS',
              },
              {
                name: 'marketingEmails',
                label: 'Marketing Emails',
                description: 'Special offers and promotions',
              },
            ].map((pref) => (
              <label key={pref.name} className={style.checkboxOption}>
                <input
                  type="checkbox"
                  {...register(pref.name as keyof UserProfileFormData)}
                />
                <div className={style.checkboxContent}>
                  <span className={style.checkboxLabel}>{pref.label}</span>
                  <span className={style.checkboxDescription}>
                    {pref.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
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
