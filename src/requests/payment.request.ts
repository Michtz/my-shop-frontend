import { axiosInstance } from './base.request';

export const createPaymentIntent = async (sessionId: string) => {
  const response = await axiosInstance.post(
    `/api/payment/create-intent/${sessionId}`,
  );
  return response.data;
};

export const confirmPayment = async (
  sessionId: string,
  paymentIntentId: string,
  paymentMethodId?: string, // <- Optional hinzufügen
) => {
  const response = await axiosInstance.post(
    `/api/payment/confirm/${sessionId}`,
    {
      paymentIntentId,
      paymentMethodId,
    },
  );
  return response.data;
};
