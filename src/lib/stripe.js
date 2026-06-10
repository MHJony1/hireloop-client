import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = {
  seeker_pro: 'price_1TgQZQ5RiS8x6XDP29prGThA',
  seeker_premium: 'price_1TgREO5RiS8x6XDPgE2z7toh',
  recruiter_growth: 'price_1TgRF15RiS8x6XDPjMq8qVtK',
  recruiter_enterprise: 'price_1TgRFd5RiS8x6XDPD3LJLm4l',
};
