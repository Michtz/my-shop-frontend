import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/system/Button';
import style from '@/styles/checkout/CheckoutStep.module.scss';
import {
  AddressData,
  useCheckout,
} from '@/providers/checkout/CheckoutContextProvider';

interface LoginFormData {
  email: string;
  password: string;
}

const AddressStep: React.FC = () => {
  const {
    checkoutData,
    updateCustomerType,
    updateCreateAccount,
    updateAddress,
    updateLoginData,
    nextStep,
  } = useCheckout();
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  // Address form for new customer/guest
  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
    watch,
  } = useForm<AddressData>({
    defaultValues: checkoutData.address,
  });

  const createAccount = watch('email') && checkoutData.createAccount;

  const handleLogin = async (data: LoginFormData) => {
    // Placeholder API call
    console.log('Login attempt:', data);
    updateLoginData(data.email, data.password);
    updateCustomerType('existing');
    // Simulate successful login
    nextStep();
  };

  const handleAddressForm = async (data: AddressData) => {
    console.log('Address data:', data);
    updateAddress(data);
    updateCustomerType(activeTab);
    nextStep();
  };

  const validateSwissZip = (value: string) => {
    const zipRegex = /^\d{4}$/;
    return zipRegex.test(value) || 'PLZ muss 4-stellig sein';
  };

  const validatePassword = (value: string | undefined) => {
    if (!createAccount) return true;
    if (!value) return true;
    return (
      value.length >= 8 || 'Das Passwort muss mindestens 8 Zeichen lang sein'
    );
  };

  return (
    <div className={style.stepContainer}>
      <div className={style.formSection}>
        <div className={style.tabContainer}>
          <button
            className={`${style.tab} ${activeTab === 'existing' ? style.active : ''}`}
            onClick={() => setActiveTab('existing')}
          >
            Ich bin bereits Kunde
          </button>
          <button
            className={`${style.tab} ${activeTab === 'new' ? style.active : ''}`}
            onClick={() => setActiveTab('new')}
          >
            Ich bin Neukunde
          </button>
        </div>

        {activeTab === 'existing' ? (
          <form
            onSubmit={handleLoginSubmit(handleLogin)}
            className={style.form}
          >
            <h3>Einloggen mit E-Mail-Adresse und Passwort</h3>

            <div className={style.formGroup}>
              <label>Ihre E-Mail-Adresse</label>
              <input
                type="email"
                placeholder="E-Mail-Adresse eingeben ..."
                {...registerLogin('email', {
                  required: 'E-Mail ist erforderlich',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Ungültige E-Mail-Adresse',
                  },
                })}
                className={loginErrors.email ? style.error : ''}
              />
              {loginErrors.email && (
                <span className={style.errorText}>
                  {loginErrors.email.message}
                </span>
              )}
            </div>

            <div className={style.formGroup}>
              <label>Ihr Passwort</label>
              <input
                type="password"
                placeholder="Passwort eingeben ..."
                {...registerLogin('password', {
                  required: 'Passwort ist erforderlich',
                })}
                className={loginErrors.password ? style.error : ''}
              />
              {loginErrors.password && (
                <span className={style.errorText}>
                  {loginErrors.password.message}
                </span>
              )}
            </div>

            <a href="#" className={style.forgotPassword}>
              Ich habe mein Passwort vergessen.
            </a>

            <Button
              type="submit"
              variant="primary"
              className={style.submitButton}
            >
              Anmelden
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleAddressSubmit(handleAddressForm)}
            className={style.form}
          >
            <div className={style.formRow}>
              <select
                className={style.select}
                {...registerAddress('salutation')}
              >
                <option value="">Anrede auswählen ...*</option>
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
                <option value="Divers">Divers</option>
              </select>
            </div>

            <div className={style.formRow}>
              <div className={style.formGroup}>
                <input
                  placeholder="Vornamen eingeben ..."
                  {...registerAddress('firstName', {
                    required: 'Vorname ist erforderlich',
                  })}
                  className={addressErrors.firstName ? style.error : ''}
                />
                {addressErrors.firstName && (
                  <span className={style.errorText}>
                    {addressErrors.firstName.message}
                  </span>
                )}
              </div>

              <div className={style.formGroup}>
                <input
                  placeholder="Nachnamen eingeben ..."
                  {...registerAddress('lastName', {
                    required: 'Nachname ist erforderlich',
                  })}
                  className={addressErrors.lastName ? style.error : ''}
                />
                {addressErrors.lastName && (
                  <span className={style.errorText}>
                    {addressErrors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <h4>Geburtsdatum</h4>
            <div className={style.formRow}>
              <select
                className={style.select}
                {...registerAddress('birthDate.day')}
              >
                <option value="">Tag</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                className={style.select}
                {...registerAddress('birthDate.month')}
              >
                <option value="">Monat</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                className={style.select}
                {...registerAddress('birthDate.year')}
              >
                <option value="">Jahr</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={style.checkboxGroup}>
              <input
                type="checkbox"
                id="createAccount"
                onChange={(e) => updateCreateAccount(e.target.checked)}
              />
              <label htmlFor="createAccount">Konto erstellen (optional)</label>
            </div>

            {checkoutData.createAccount && (
              <div className={style.accountFields}>
                <div className={style.formGroup}>
                  <input
                    type="email"
                    placeholder="Neue E-Mail-Adresse ..."
                    {...registerAddress('email', {
                      required: createAccount
                        ? 'E-Mail ist erforderlich'
                        : false,
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Ungültige E-Mail-Adresse',
                      },
                    })}
                    className={addressErrors.email ? style.error : ''}
                  />
                  {addressErrors.email && (
                    <span className={style.errorText}>
                      {addressErrors.email.message}
                    </span>
                  )}
                </div>

                <div className={style.formGroup}>
                  <input
                    type="password"
                    placeholder="Passwort eingeben ..."
                    {...registerAddress('password', {
                      validate: validatePassword,
                    })}
                    className={addressErrors.password ? style.error : ''}
                  />
                  {addressErrors.password && (
                    <span className={style.errorText}>
                      {addressErrors.password.message}
                    </span>
                  )}
                  <small>
                    Das Passwort muss mindestens 8 Zeichen lang sein.
                  </small>
                </div>
              </div>
            )}

            <h4>Schweizer Post Adressprüfung</h4>
            <p>
              Die Prüfung wird ausgeführt, sobald alle Felder ausgefüllt sind.
            </p>

            <div className={style.formGroup}>
              <input
                placeholder="Strasse und Hausnummer eingeben ..."
                {...registerAddress('street', {
                  required: 'Strasse ist erforderlich',
                })}
                className={addressErrors.street ? style.error : ''}
              />
              {addressErrors.street && (
                <span className={style.errorText}>
                  {addressErrors.street.message}
                </span>
              )}
            </div>

            <div className={style.formRow}>
              <div className={style.formGroup}>
                <input
                  placeholder="PLZ eingeben ..."
                  {...registerAddress('zipCode', {
                    required: 'PLZ ist erforderlich',
                    validate: validateSwissZip,
                  })}
                  className={addressErrors.zipCode ? style.error : ''}
                />
                {addressErrors.zipCode && (
                  <span className={style.errorText}>
                    {addressErrors.zipCode.message}
                  </span>
                )}
              </div>

              <div className={style.formGroup}>
                <input
                  placeholder="Ort eingeben ..."
                  {...registerAddress('city', {
                    required: 'Ort ist erforderlich',
                  })}
                  className={addressErrors.city ? style.error : ''}
                />
                {addressErrors.city && (
                  <span className={style.errorText}>
                    {addressErrors.city.message}
                  </span>
                )}
              </div>
            </div>

            <div className={style.formGroup}>
              <input
                type="tel"
                placeholder="Telefonnummer (optional)"
                {...registerAddress('phone')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className={style.submitButton}
            >
              Weiter zur Zahlung
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressStep;
