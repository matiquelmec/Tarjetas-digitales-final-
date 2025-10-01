import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null;

export const getStripeJs = async () => {
  const stripeJs = await import('@stripe/stripe-js');
  return stripeJs.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

export const PRICE_IDS = {
  FREE: '',
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID || '',
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
};

export const PLAN_LIMITS = {
  FREE: {
    maxCards: 1,
    features: ['Basic templates', 'Watermark', 'Basic analytics'],
  },
  PROFESSIONAL: {
    maxCards: 5,
    features: ['All templates', 'No watermark', 'Advanced analytics', 'Custom domain'],
  },
  BUSINESS: {
    maxCards: 25,
    features: ['Team collaboration', 'API access', 'White-label', 'CRM integrations'],
  },
  ENTERPRISE: {
    maxCards: -1, // Unlimited
    features: ['Everything', 'Custom development', 'SLA', 'Priority support'],
  },
};