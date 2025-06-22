import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AddressData {
  // Guest/Customer fields
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  phone?: string;

  // Optional account creation fields
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: {
    day: string;
    month: string;
    year: string;
  };
  salutation?: 'Herr' | 'Frau' | 'Divers';
}

export interface PaymentData {
  paymentMethod: 'kreditkarte' | 'paypal' | 'rechnung' | '';
  shippingMethod: 'a-post' | 'b-post' | '';
}

export interface CheckoutData {
  customerType: 'existing' | 'new' | 'guest';
  createAccount: boolean;
  address: AddressData;
  payment: PaymentData;

  // Login data for existing customers
  loginEmail?: string;
  loginPassword?: string;
}

interface CheckoutContextType {
  checkoutData: CheckoutData;
  currentStep: number;
  updateAddress: (data: Partial<AddressData>) => void;
  updatePayment: (data: Partial<PaymentData>) => void;
  updateCustomerType: (type: 'existing' | 'new' | 'guest') => void;
  updateCreateAccount: (create: boolean) => void;
  updateLoginData: (email: string, password: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetCheckout: () => void;
}

const defaultCheckoutData: CheckoutData = {
  customerType: 'existing',
  createAccount: false,
  address: {
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zipCode: '',
    city: '',
    phone: '',
  },
  payment: {
    paymentMethod: '',
    shippingMethod: '',
  },
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [checkoutData, setCheckoutData] =
    useState<CheckoutData>(defaultCheckoutData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateAddress = (data: Partial<AddressData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      address: { ...prev.address, ...data },
    }));
  };

  const updatePayment = (data: Partial<PaymentData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...data },
    }));
  };

  const updateCustomerType = (type: 'existing' | 'new' | 'guest') => {
    setCheckoutData((prev) => ({
      ...prev,
      customerType: type,
    }));
  };

  const updateCreateAccount = (create: boolean) => {
    setCheckoutData((prev) => ({
      ...prev,
      createAccount: create,
    }));
  };

  const updateLoginData = (email: string, password: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      loginEmail: email,
      loginPassword: password,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  const resetCheckout = () => {
    setCheckoutData(defaultCheckoutData);
    setCurrentStep(1);
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        currentStep,
        updateAddress,
        updatePayment,
        updateCustomerType,
        updateCreateAccount,
        updateLoginData,
        nextStep,
        prevStep,
        goToStep,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
