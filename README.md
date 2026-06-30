# AuditFast

AI-powered CRO audit app for landing pages.

## Stack
- Vite + React + Tailwind
- Express static server on port `3000`

## Payments (Managed Stripe Payment Link)
AuditFast Pro checkout uses a **Stripe-hosted Payment Link** (no server-side Stripe secret required).

### Env var
Use this in local/dev/prod frontend env:

```bash
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/cNi4gBeH2aYA7Usasq28804
```

A default fallback is also wired in `src/services/stripeConfig.js` so checkout works even if the env var is missing.

## Development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
node server.js
```

Server binds to `0.0.0.0:3000` and serves the built SPA.

## Notes
- Pro CTA redirects directly to the managed Stripe link.
- Direct `/api/create-checkout-session` flow has been removed in favor of hosted checkout.
