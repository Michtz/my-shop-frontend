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
) => {
  const response = await axiosInstance.post(
    `/api/payment/confirm/${sessionId}`,
    {
      paymentIntentId,
    },
  );
  return response.data;
};
