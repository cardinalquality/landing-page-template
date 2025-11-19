# Setup Environments Command

Creates environment configuration for dev, staging, and production.

## What it creates

### .env.example (committed to git)
```env
# Database
DATABASE_URL="postgresql://..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# SendGrid
SENDGRID_API_KEY="SG..."

# OpenAI (for chatbot)
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### .env.local (NOT committed - for local dev)
- Copy .env.example
- Fill in your actual dev credentials

### .env.staging (Vercel environment variables)
- Use Vercel dashboard or CLI: `vercel env add`
- Staging database URL
- Test Stripe keys (pk_test_, sk_test_)

### .env.production (Vercel environment variables)
- Production database URL
- Live Stripe keys (pk_live_, sk_live_)

## Vercel Setup
```bash
# Link to Vercel project
vercel link

# Add staging variables
vercel env add DATABASE_URL staging
vercel env add STRIPE_SECRET_KEY staging

# Add production variables
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
```

## Usage in code
```typescript
// lib/env.ts
export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}
```
```

---
