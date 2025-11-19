# Environment Setup Guide
**Dev → Staging → Production Strategy**

---

## 🚨 Current Status: DEV-ONLY (Needs Fixing!)

You correctly identified that the current setup is **development-only**. Here's what's wrong and how to fix it:

### ❌ Current Problem

```bash
# package.json currently has:
"db:push": "prisma db push"  # ⚠️ DEV ONLY! Doesn't track changes!
```

**What `prisma db push` does:**
- Pushes schema directly to database
- **No migration history** (dangerous in production!)
- Can't rollback changes
- Not safe for staging/production

---

## ✅ Production-Ready Setup

### Strategy Overview

```
Development → Staging → Production
    ↓            ↓          ↓
  db:push    migrations  migrations
  (fast)     (tracked)   (tracked)
```

**Three Environments:**

1. **Development (Local)**
   - Your laptop
   - Uses `prisma db push` (fast iteration)
   - Database: Supabase dev project OR local PostgreSQL
   - Can break things freely

2. **Staging**
   - Pre-production testing environment
   - Uses `prisma migrate deploy` (versioned migrations)
   - Database: Separate Supabase project
   - Mimics production exactly

3. **Production**
   - Live customer-facing site
   - Uses `prisma migrate deploy` (versioned migrations)
   - Database: Production Supabase project
   - **NEVER** use `db:push` here!

---

## 🛠️ Setup Instructions

### Step 1: Create Supabase Projects (One for Each Environment)

You'll need **3 Supabase projects**:

1. **Go to** [supabase.com](https://supabase.com)

2. **Create 3 projects:**
   - `my-app-dev` (for local development)
   - `my-app-staging` (for testing before production)
   - `my-app-prod` (for live site)

3. **For each project, get these values:**
   - Settings → Database → Connection String (URI format)
   - Settings → API → Project URL
   - Settings → API → anon/public key
   - Settings → API → service_role key

---

### Step 2: Create Environment Files

**Development: `.env.local`** (Your current file)

```bash
# LOCAL DEVELOPMENT ENVIRONMENT
# This file is gitignored - never commit it!

# Supabase - DEV Project
DATABASE_URL="postgresql://postgres:[DEV-PASSWORD]@db.[DEV-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[DEV-PASSWORD]@db.[DEV-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[DEV-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[DEV-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[DEV-SERVICE-KEY]"

# Stripe - TEST Mode Keys
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."

# Stripe - Separate Test Accounts per Tenant
RELUMA_STRIPE_ACCOUNT_ID="acct_test_reluma"
EONLIFE_STRIPE_ACCOUNT_ID="acct_test_eonlife"

# App Config
NEXT_PUBLIC_DEFAULT_TENANT="reluma"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Staging: `.env.staging`** (Create this)

```bash
# STAGING ENVIRONMENT
# Used for pre-production testing
# Committed to repo (uses placeholders for CI/CD)

# Supabase - STAGING Project
DATABASE_URL="${STAGING_DATABASE_URL}"
DIRECT_URL="${STAGING_DIRECT_URL}"
NEXT_PUBLIC_SUPABASE_URL="${STAGING_SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${STAGING_SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${STAGING_SUPABASE_SERVICE_KEY}"

# Stripe - TEST Mode (same as dev)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="${STAGING_STRIPE_PUBLIC_KEY}"
STRIPE_SECRET_KEY="${STAGING_STRIPE_SECRET_KEY}"
STRIPE_WEBHOOK_SECRET="${STAGING_STRIPE_WEBHOOK_SECRET}"

# Stripe - Test Accounts
RELUMA_STRIPE_ACCOUNT_ID="${STAGING_RELUMA_STRIPE_ACCOUNT}"
EONLIFE_STRIPE_ACCOUNT_ID="${STAGING_EONLIFE_STRIPE_ACCOUNT}"

# App Config
NEXT_PUBLIC_DEFAULT_TENANT="reluma"
NEXT_PUBLIC_APP_URL="https://staging.yourapp.com"
NODE_ENV="production"
```

**Production: `.env.production`** (Create this)

```bash
# PRODUCTION ENVIRONMENT
# Live customer-facing environment
# Committed to repo (uses placeholders for CI/CD)

# Supabase - PRODUCTION Project
DATABASE_URL="${PROD_DATABASE_URL}"
DIRECT_URL="${PROD_DIRECT_URL}"
NEXT_PUBLIC_SUPABASE_URL="${PROD_SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${PROD_SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${PROD_SUPABASE_SERVICE_KEY}"

# Stripe - LIVE Mode Keys
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="${PROD_STRIPE_PUBLIC_KEY}"
STRIPE_SECRET_KEY="${PROD_STRIPE_SECRET_KEY}"
STRIPE_WEBHOOK_SECRET="${PROD_STRIPE_WEBHOOK_SECRET}"

# Stripe - LIVE Accounts (separate per tenant!)
RELUMA_STRIPE_ACCOUNT_ID="${PROD_RELUMA_STRIPE_ACCOUNT}"
EONLIFE_STRIPE_ACCOUNT_ID="${PROD_EONLIFE_STRIPE_ACCOUNT}"

# App Config
NEXT_PUBLIC_DEFAULT_TENANT="reluma"
NEXT_PUBLIC_APP_URL="https://yourapp.com"
NODE_ENV="production"
```

---

### Step 3: Update .gitignore

```bash
# Add to .gitignore:
.env.local          # ✅ Already there
.env*.local         # ✅ Any .env.something.local
.env.development.local
.env.test.local
.env.production.local

# These CAN be committed (use placeholders):
# .env.staging      # Committed (for CI/CD)
# .env.production   # Committed (for CI/CD)
```

---

### Step 4: Initialize Migrations (Critical!)

**Why migrations?**
- Track every database change
- Can rollback if something breaks
- Team members sync schemas automatically
- Staging/production use exact same migration history

**Initialize now:**

```bash
# 1. Create your first migration
npm run db:migrate -- --name init

# This creates:
# prisma/migrations/
#   └── 20250119_init/
#       └── migration.sql

# 2. This migration is now the "source of truth"
```

**Update package.json scripts:**

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",              // Dev only!
    "db:migrate": "prisma migrate dev",       // Dev: Create migrations
    "db:migrate:deploy": "prisma migrate deploy", // Staging/Prod: Apply migrations
    "db:migrate:status": "prisma migrate status", // Check migration state
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset"        // Dev: Wipe DB and re-run migrations
  }
}
```

---

### Step 5: Workflow for Each Environment

#### Development (Your Laptop)

```bash
# Day-to-day development:

# Option A: Fast iteration (no migration tracking)
npm run db:push
npm run db:seed

# Option B: Create proper migration (when ready for staging)
npm run db:migrate -- --name add_product_reviews
npm run db:seed
```

**When to use which:**
- `db:push` - Quick schema tweaks, experimenting
- `db:migrate` - When you're happy with changes, ready to commit

#### Staging Deployment

```bash
# In CI/CD pipeline (GitHub Actions, Vercel, etc.):

# 1. Load staging environment variables
export $(cat .env.staging | xargs)

# 2. Apply all migrations
npm run db:migrate:deploy

# 3. Optionally seed with test data
npm run db:seed

# 4. Deploy Next.js app
npm run build
npm run start
```

#### Production Deployment

```bash
# In CI/CD pipeline:

# 1. Load production environment variables
export $(cat .env.production | xargs)

# 2. Apply migrations (CAREFUL!)
npm run db:migrate:deploy

# 3. Deploy Next.js app
npm run build
npm run start
```

**⚠️ Production Migration Checklist:**
- [ ] Test migration in staging first
- [ ] Backup production database
- [ ] Run during low-traffic window
- [ ] Monitor for errors
- [ ] Have rollback plan ready

---

## 🔐 Security Best Practices

### ✅ DO:

1. **Use different databases for each environment**
   - Dev database can have fake data
   - Prod database has real customer data (GDPR!)

2. **Use different Stripe accounts**
   - Dev/Staging: Test mode
   - Production: Live mode
   - Separate accounts per tenant (Reluma, Eonlife)

3. **Rotate secrets regularly**
   - Change API keys every 90 days
   - Use strong, unique passwords

4. **Never commit real secrets**
   - `.env.local` is gitignored
   - `.env.staging` uses placeholders (`${VAR_NAME}`)
   - Real values stored in CI/CD secrets (Vercel env vars, GitHub Secrets)

### ❌ DON'T:

1. **Never use `db:push` in production** → Data loss risk!
2. **Never commit `.env.local`** → Secrets exposed!
3. **Never share production credentials** → Use least-privilege access
4. **Never test in production** → That's what staging is for!

---

## 📊 Migration Strategy Examples

### Example 1: Adding a New Field

**Development:**
```bash
# 1. Update schema
# prisma/schema.prisma
model Product {
  id          String @id
  tenantId    String
  name        String
  price       Decimal
  rating      Float?  // 👈 NEW FIELD
}

# 2. Create migration
npm run db:migrate -- --name add_product_rating

# 3. Prisma generates SQL:
# ALTER TABLE "Product" ADD COLUMN "rating" DOUBLE PRECISION;
```

**Staging:**
```bash
# Pull latest code (includes migration)
git pull origin main

# Apply migration
npm run db:migrate:deploy
# ✅ Rating column added to staging DB
```

**Production:**
```bash
# Deploy to production
npm run db:migrate:deploy
# ✅ Rating column added to prod DB
```

### Example 2: Renaming a Field (Tricky!)

**⚠️ Danger:** Renaming fields can cause downtime if not done carefully!

**Safe approach:**

```bash
# Step 1: Add new field (non-breaking)
model Product {
  description  String?  // Old field
  productDescription String?  // New field
}
npm run db:migrate -- --name add_product_description
# Deploy ✅ Both fields exist

# Step 2: Copy data (write migration manually)
# prisma/migrations/.../migration.sql
UPDATE "Product" SET "productDescription" = "description";

# Deploy ✅ Data copied

# Step 3: Update code to use new field
# Deploy ✅ Code uses productDescription

# Step 4: Remove old field
model Product {
  productDescription String?  // Only new field
}
npm run db:migrate -- --name remove_old_description
# Deploy ✅ Old field removed
```

**Key:** Multi-step migrations prevent breaking production!

---

## 🚀 CI/CD Integration

### Example: Vercel Deployment

**vercel.json:**
```json
{
  "buildCommand": "prisma migrate deploy && prisma generate && next build",
  "env": {
    "DATABASE_URL": "@prod-database-url",
    "STRIPE_SECRET_KEY": "@prod-stripe-secret"
  }
}
```

**Environment Variables in Vercel:**
1. Go to Project → Settings → Environment Variables
2. Add for Production:
   - `PROD_DATABASE_URL` = (Supabase prod connection string)
   - `PROD_STRIPE_SECRET_KEY` = sk_live_...
3. Add for Preview (Staging):
   - `STAGING_DATABASE_URL` = (Supabase staging connection string)
   - `STAGING_STRIPE_SECRET_KEY` = sk_test_...

---

## 🔄 Day-to-Day Workflow

### As a Developer:

```bash
# Monday morning:
git pull origin main              # Get latest code
npm run db:migrate:deploy        # Apply any new migrations
npm run dev                      # Start developing

# Adding a feature:
# 1. Edit schema.prisma
# 2. npm run db:migrate -- --name my_feature
# 3. Write code
# 4. Write tests
# 5. git commit -m "Add feature"
# 6. git push

# CI/CD automatically:
# - Runs tests
# - Applies migrations to staging
# - Deploys to staging
# - (After approval) Deploys to production
```

---

## ✅ Verification Checklist

Before deploying to production, verify:

### Development
- [ ] `.env.local` created with dev Supabase credentials
- [ ] `npm run db:migrate` creates migration files
- [ ] `npm run db:studio` shows your data
- [ ] Tests pass locally

### Staging
- [ ] Separate Supabase staging project created
- [ ] `.env.staging` created (committed with placeholders)
- [ ] Environment variables set in CI/CD
- [ ] `npm run db:migrate:deploy` runs in CI/CD
- [ ] Staging site accessible
- [ ] Can create test orders

### Production
- [ ] Separate Supabase production project created
- [ ] `.env.production` created (committed with placeholders)
- [ ] Production environment variables set
- [ ] Database backup strategy configured
- [ ] Monitoring/alerting set up
- [ ] Migrations tested in staging first
- [ ] Stripe live mode keys configured

---

## 🎯 Current Status: Quick Fixes Needed

### Immediate Actions:

1. **Create first migration** (do this now):
   ```bash
   npm run db:migrate -- --name init
   # Creates prisma/migrations/ folder
   ```

2. **Update .gitignore**:
   ```bash
   echo "*.env.local" >> .gitignore
   ```

3. **Document your Supabase credentials** (in password manager):
   - Dev project URL, password, API keys
   - (Later: Staging and prod)

---

## 📚 Resources

- [Prisma Migrations Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Multi-Environment Setup](https://supabase.com/docs/guides/cli/managing-environments)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## Summary

**Your Question:** Is the schema ready for all three environments?

**Answer:**
- ✅ **Schema itself:** YES (well-designed)
- ⚠️ **Migration setup:** NO (currently dev-only)
- ✅ **After fixes:** YES (production-ready)

**What needs fixing:**
1. Initialize Prisma migrations (`npm run db:migrate -- --name init`)
2. Create `.env.staging` and `.env.production` files
3. Set up separate Supabase projects
4. Update deployment scripts to use `migrate deploy`

**Time to fix:** 30 minutes for initial setup, then it "just works"

---

**Created:** 2025-11-19
**Status:** Action required before production deployment
