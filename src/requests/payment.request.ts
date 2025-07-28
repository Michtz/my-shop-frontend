import { axiosInstance } from './base.request';
import { paymentApiUrl } from '@/config/api.config';

export const createPaymentIntent = async (sessionId: string) => {
  try {
    console.log('💳 Creating payment intent for session:', sessionId);
    console.log('💳 Payment API URL:', `${paymentApiUrl}/create-intent/${sessionId}`);
    
    const response = await axiosInstance.post(
      `${paymentApiUrl}/create-intent/${sessionId}`,
    );
    
    console.log('💳 Payment intent API response:', response);
    return response.data;
  } catch (error) {
    console.error('💳 Payment intent API error:', error);
    throw error;
  }
};

export const confirmPayment = async (
  sessionId: string,
  paymentIntentId: string,
  paymentMethodId?: string,
) => {
  try {
    console.log('💳 Confirming payment:', {
      sessionId,
      paymentIntentId,
      paymentMethodId: paymentMethodId ? 'PROVIDED' : 'MISSING',
      url: `${paymentApiUrl}/confirm/${sessionId}`
    });

    const response = await axiosInstance.post(
      `${paymentApiUrl}/confirm/${sessionId}`,
      {
        paymentIntentId,
        paymentMethodId,
      },
    );

    console.log('💳 Payment confirmation API response:', response);
    return response.data;
  } catch (error) {
    console.error('💳 Payment confirmation API error:', error);
    throw error;
  }
};
