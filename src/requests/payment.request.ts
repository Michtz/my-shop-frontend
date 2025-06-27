import { axiosInstance } from './base.request';
import { paymentApiUrl } from '@/config/api.config';

export const createPaymentIntent = async (sessionId: string) => {
  const response = await axiosInstance.post(
    `${paymentApiUrl}/create-intent/${sessionId}`,
  );
  return response.data;
};

export const confirmPayment = async (
  sessionId: string,
  paymentIntentId: string,
  paymentMethodId?: string,
) => {
  const response = await axiosInstance.post(
    `${paymentApiUrl}/confirm/${sessionId}`,
    {
      paymentIntentId,
      paymentMethodId,
    },
  );
  return response.data;
};
