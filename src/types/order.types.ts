export interface OrderRequest extends Request {
  params: {
    orderNumber?: string;
    sessionId?: string;
    userId?: string;
  };
  body: {
    status?: 'paid' | 'completed';
    cartSnapshot?: any;
    paymentIntentId?: string;
    paymentMethodId?: string;
  };
}
