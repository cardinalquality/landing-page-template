# Universal E-Commerce Platform

A modern, multi-tenant e-commerce platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Test-Driven Development (TDD)** from day one.

## 📋 Project Overview

This platform supports multiple brands (Reluma, Eonlife) from a single codebase with:
- **Multi-tenant architecture** - One codebase, multiple brands
- **Atomic design system** - Organized components (atoms → molecules → organisms → templates)
- **Test-Driven Development** - Tests written before implementation
- **Type safety** - TypeScript strict mode enabled
- **80%+ test coverage** - Vitest + Testing Library + Playwright

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe credentials

# Generate Prisma client
npm run db:generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🧪 Testing Commands

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Coverage Requirements**: 80% minimum across all metrics (lines, functions, branches, statements)

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e -- --headed
```

### Pre-commit Testing

Git hooks automatically run tests before commits:
- ESLint checks
- Unit tests

To bypass (not recommended):
```bash
git commit --no-verify
```

## 🏗️ Project Structure

```
├── .claude/                    # Claude Code agent configurations
│   ├── agents/                 # Specialized agents (test, component, etc.)
│   └── commands/               # Slash commands for workflows
├── prisma/
│   └── schema.prisma          # Multi-tenant database schema
├── src/
│   ├── core/
│   │   ├── components/
│   │   │   ├── atoms/         # Button, Input, Badge, etc.
│   │   │   ├── molecules/     # ProductCard, SearchBar, etc.
│   │   │   ├── organisms/     # Header, Footer, ProductGrid, etc.
│   │   │   └── templates/     # Page layouts
│   │   ├── lib/
│   │   │   ├── cn.ts          # Tailwind class merger
│   │   │   ├── prisma.ts      # Prisma client
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   └── test-utils.tsx # Testing Library utilities
│   │   └── hooks/
│   │       └── useTenant.ts   # Multi-tenant hook
│   ├── tenants/
│   │   ├── schema.ts          # Tenant TypeScript types
│   │   └── config.ts          # Tenant configurations (Reluma, Eonlife)
│   └── app/
│       ├── layout.tsx         # Root layout
│       ├── page.tsx           # Home page
│       └── [tenant]/          # Tenant-specific routes
└── tests/
    ├── e2e/                   # Playwright E2E tests
    └── setup.ts               # Test configuration
```

## 🎨 Component Development (TDD)

Follow the **Test-Driven Development** cycle:

### 1. Write Test First (RED)
```tsx
// src/core/components/atoms/Button/Button.test.tsx
import { render, screen } from '@/core/lib/test-utils'
import { Button } from './Button'

it('renders with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### 2. Implement Component (GREEN)
```tsx
// src/core/components/atoms/Button/Button.tsx
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>
}
```

### 3. Refactor for Quality
- Add TypeScript types
- Improve accessibility
- Optimize styles
- Update tests as needed

## 🗄️ Database & Multi-Tenancy

### Prisma Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (dev only)
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (DB GUI)
npm run db:studio
```

### Multi-Tenant Query Pattern

```typescript
import { prisma } from '@/core/lib/prisma'

// Always filter by tenantId
const products = await prisma.product.findMany({
  where: {
    tenantId: tenant.id,
    active: true
  }
})
```

## 🎯 Tenant Configuration

Edit `src/tenants/config.ts` to add or modify tenant settings:

```typescript
export const TENANTS = {
  reluma: {
    id: 'reluma-001',
    slug: 'reluma',
    name: 'Reluma',
    theme: {
      primaryColor: '#2563eb',
      // ...
    },
    features: {
      ecommerce: true,
      blog: true,
      // ...
    }
  }
}
```

## 🔐 Environment Variables

Required variables (see `.env.example`):

```env
# Supabase
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Multi-Tenant
NEXT_PUBLIC_DEFAULT_TENANT="reluma"
NEXT_PUBLIC_ALLOWED_TENANTS="reluma,eonlife"
```

## 📊 Code Quality

### ESLint & Prettier

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### TypeScript

Strict mode enabled in `tsconfig.json`:
- All type errors must be resolved
- No implicit `any` types
- Unused variables/parameters flagged

## 🚢 Deployment

### Build for Production

```bash
# Build app
npm run build

# Start production server
npm run start
```

### Recommended Platforms

- **Vercel** (Next.js optimized)
- **Netlify**
- **Railway**
- **Fly.io**

## 📚 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.6 (Strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 6 |
| Testing (Unit) | Vitest + Testing Library |
| Testing (E2E) | Playwright |
| Payments | Stripe |
| Validation | Zod |
| Code Quality | ESLint + Prettier |
| Git Hooks | Husky |

## 🎓 Testing Philosophy

### Test Pyramid

```
      /\
     /E2E\       ← Few (6 tests) - Full user journeys
    /------\
   /Integration\ ← Some - Component interactions
  /-----------\
 /Unit Tests   \ ← Many (14+ tests) - Individual functions
```

### What to Test

✅ **DO TEST:**
- User interactions (clicks, typing, etc.)
- Component rendering
- Accessibility (ARIA, keyboard navigation)
- Data transformations
- API responses

❌ **DON'T TEST:**
- Implementation details
- Third-party libraries
- CSS-in-JS computed values
- Framework internals

## 🛠️ Development Workflow

### Creating a New Component

1. Use the Claude Code agent:
   ```
   /create-component ButtonAtom
   ```

2. Or manually follow TDD:
   ```bash
   # 1. Create test file
   touch src/core/components/atoms/Input/Input.test.tsx

   # 2. Write failing tests
   # 3. Implement component
   # 4. Verify tests pass
   npm run test
   ```

### Adding a New Tenant

1. Update `src/tenants/config.ts`
2. Add tenant-specific theme
3. Configure feature flags
4. Update environment variables
5. Test multi-tenant isolation

## 📝 Current Status

✅ **Completed (Phase 1):**
- Next.js 16 project initialized
- TypeScript strict mode configured
- Vitest + Testing Library setup
- Playwright E2E tests configured
- Prisma + Supabase integration
- Multi-tenant architecture
- Sample Button component (14/14 tests passing)
- Git hooks for pre-commit testing

🔜 **Next Steps (Phase 2):**
- Build out component library (Input, Image, Badge, etc.)
- Create product catalog pages
- Implement Stripe checkout flow
- Add authentication with Supabase Auth
- Set up CI/CD pipeline
- Deploy to production

## 🤝 Contributing

This is a private project. For questions or issues:
1. Check `.claude/` agent configurations
2. Run tests: `npm run test`
3. Review test coverage: `npm run test:coverage`

## 📄 License

Private - All Rights Reserved

---

**Built with TDD, tested with confidence.** 🚀
