import { loadStripe } from '@stripe/stripe-js';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('🔑 Stripe key:', stripeKey ? 'SET' : 'NOT SET');
console.log('🔑 Stripe key prefix:', stripeKey ? stripeKey.substring(0, 20) + '...' : 'NO KEY');

export const stripePromise = loadStripe(stripeKey!);
