/**
 * Managed Stripe Payment Link configuration.
 *
 * We intentionally use Stripe-hosted checkout (Payment Link) so the app does
 * not depend on direct secret-key checkout-session creation.
 */

const DEFAULT_STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/4gMfZifuR12f5zH3qLawo01';
const STRIPE_PAYMENT_LINK = (import.meta.env.VITE_STRIPE_PAYMENT_LINK || DEFAULT_STRIPE_PAYMENT_LINK).trim();

export function getProPaymentLink() {
  return STRIPE_PAYMENT_LINK;
}

export function hasManagedPaymentLink() {
  return Boolean(STRIPE_PAYMENT_LINK);
}
