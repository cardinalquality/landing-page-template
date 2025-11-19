# Learning Tasks
**Your Hands-On Guide to Understanding the Codebase**

These tasks will help you understand how everything works BEFORE we build too much. Each task includes:
- 🎯 **Goal** - What you'll learn
- 📚 **Context** - Why this matters
- ✅ **Steps** - What to do
- 🧪 **Verification** - How to know it worked
- 💡 **Learning Points** - Key takeaways

---

## 🚀 Getting Started (Do These First!)

### Task 0: Environment Setup
**Time:** 10 minutes
**Goal:** Get your local environment running

#### Steps:
1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create a free account
   - Create a new project
   - Go to Settings → Database → Connection String
   - Copy the connection string
   - Paste into `.env.local` as `DATABASE_URL`

3. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

6. **Visit:** http://localhost:3000

#### ✅ Verification:
- [ ] Page loads without errors
- [ ] You see "Universal E-Commerce Platform"
- [ ] Two buttons appear (styled correctly)

#### 💡 Learning Points:
- Next.js dev server runs on port 3000 by default
- Prisma needs to generate client before use
- Environment variables are never committed (security!)

---

## 📂 Task 1: Explore the File Structure
**Time:** 15 minutes
**Goal:** Understand where everything lives

#### Steps:
1. Open your code editor and navigate through:

```
src/
├── core/                    👈 Reusable, brand-agnostic code
│   ├── components/
│   │   ├── atoms/          👈 Smallest UI pieces (Button, Input)
│   │   │   └── Button/
│   │   │       ├── Button.tsx       👈 The component
│   │   │       ├── Button.test.tsx  👈 Tests (TDD!)
│   │   │       └── index.ts         👈 Export
│   │   ├── molecules/      👈 Groups of atoms (ProductCard)
│   │   ├── organisms/      👈 Complex components (Header, Footer)
│   │   └── templates/      👈 Page layouts
│   ├── hooks/              👈 React hooks
│   │   └── useTenant.ts   👈 Gets current brand (Reluma/Eonlife)
│   └── lib/                👈 Utility functions
│       ├── cn.ts          👈 Combines CSS classes
│       ├── prisma.ts      👈 Database client
│       └── test-utils.tsx 👈 Testing helpers
├── tenants/                👈 Brand-specific configs
│   ├── config.ts          👈 Reluma + Eonlife settings
│   └── schema.ts          👈 TypeScript types
└── app/                    👈 Next.js pages
    ├── layout.tsx          👈 Root layout (wraps all pages)
    └── page.tsx            👈 Homepage
```

2. **Open these files and read them:**
   - `src/tenants/config.ts` - See how Reluma and Eonlife are configured
   - `src/core/hooks/useTenant.ts` - See how we detect which brand
   - `src/core/components/atoms/Button/Button.tsx` - See a component
   - `src/core/components/atoms/Button/Button.test.tsx` - See TDD tests

#### ✅ Verification:
Answer these questions:
- [ ] What's the primary color for Reluma? (Hint: check `config.ts`)
- [ ] What's the primary color for Eonlife?
- [ ] How many Button variants exist? (Hint: check `Button.tsx`)
- [ ] How many tests does Button have? (Hint: count `it()` blocks)

#### 💡 Learning Points:
- **Atomic design** = Small pieces → Bigger pieces → Pages
- **Multi-tenant** = One codebase, multiple brands
- **TDD** = Tests written BEFORE implementation

---

## 🧪 Task 2: Run Tests and Understand Coverage
**Time:** 10 minutes
**Goal:** Learn the testing workflow

#### Steps:
1. **Run all tests:**
   ```bash
   npm run test -- --run
   ```

2. **Generate coverage report:**
   ```bash
   npm run test:coverage
   ```

3. **Open the coverage report:**
   ```bash
   open coverage/index.html
   ```
   (Or manually navigate to `coverage/index.html` in your browser)

4. **Explore the coverage UI:**
   - Click on `src/core/components/atoms/Button/Button.tsx`
   - Green lines = tested
   - Red lines = not tested
   - See which code paths are covered!

#### ✅ Verification:
Answer these:
- [ ] How many tests passed for Button?
- [ ] What's the coverage percentage for Button.tsx?
- [ ] Are all Button variants tested?

#### 💡 Learning Points:
- **Green tests = working code** (gives you confidence!)
- **Coverage = % of code tested**
- **80% minimum** is enforced (quality bar)
- **TDD workflow:**
  1. Write test (fails) ← RED
  2. Write code (test passes) ← GREEN
  3. Refactor (tests still pass) ← REFACTOR

---

## 🎨 Task 3: Modify the Button Component
**Time:** 20 minutes
**Goal:** Make a small change and see tests catch issues

#### Part A: Safe Change (Tests Pass)

1. **Add a new size variant:**

Open `src/core/components/atoms/Button/Button.tsx`:

```typescript
// Find this line:
type ButtonSize = 'sm' | 'md' | 'lg'

// Change to:
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
```

```typescript
// Find the size styles section:
{
  'h-8 px-3 text-sm': size === 'sm',
  'h-10 px-4 text-base': size === 'md',
  'h-12 px-6 text-lg': size === 'lg',
}

// Add this line:
{
  'h-8 px-3 text-sm': size === 'sm',
  'h-10 px-4 text-base': size === 'md',
  'h-12 px-6 text-lg': size === 'lg',
  'h-16 px-8 text-xl': size === 'xl',  // 👈 NEW!
}
```

2. **Test it:**
```bash
npm run test -- --run
```

3. **Use it on the homepage:**

Open `src/app/page.tsx`:

```tsx
// Change one button:
<Button variant="primary" size="xl">  {/* 👈 Changed to xl */}
  Get Started
</Button>
```

4. **See it in browser:**
```bash
npm run dev
```
Visit http://localhost:3000 - button should be bigger!

#### Part B: Breaking Change (Tests Fail)

Now let's INTENTIONALLY break something:

1. **Remove a required prop:**

In `src/core/components/atoms/Button/Button.tsx`:

```typescript
// Find this line:
disabled={disabled}

// Comment it out:
// disabled={disabled}  // 👈 COMMENTED OUT
```

2. **Run tests:**
```bash
npm run test -- --run
```

**BOOM!** Tests should FAIL! 💥

The test will catch that disabled functionality is broken:
```
❌ does not call onClick when disabled
```

3. **Fix it:**
Uncomment the line:
```typescript
disabled={disabled}  // ✅ Fixed
```

4. **Tests pass again:**
```bash
npm run test -- --run
```

#### ✅ Verification:
- [ ] You successfully added 'xl' size
- [ ] Tests passed after adding xl
- [ ] Tests failed when you broke disabled
- [ ] Tests passed after you fixed it

#### 💡 Learning Points:
- **Tests protect you from breaking things!**
- **TDD workflow prevents bugs**
- **TypeScript + Tests = double safety**

---

## 🏢 Task 4: Understand Multi-Tenancy
**Time:** 15 minutes
**Goal:** See how brand switching works

#### Steps:

1. **Open tenant configs:**

`src/tenants/config.ts` - Read the whole file

Notice:
```typescript
reluma: {
  theme: {
    primaryColor: '#2563eb',  // Blue
    logo: '/logos/reluma-logo.svg',
  },
  seo: {
    title: 'Reluma - Premium E-Commerce Platform',
  }
}

eonlife: {
  theme: {
    primaryColor: '#059669',  // Green
    logo: '/logos/eonlife-logo.svg',
  },
  seo: {
    title: 'Eonlife - Health & Wellness Products',
  }
}
```

2. **Add a test page to see tenant detection:**

Create `src/app/test-tenant/page.tsx`:

```typescript
'use client'

import { useTenant } from '@/core/hooks/useTenant'
import { Button } from '@/core/components/atoms'

export default function TestTenantPage() {
  const tenant = useTenant()

  return (
    <div className="p-24">
      <h1 className="text-3xl font-bold mb-4">Tenant Detection Test</h1>

      <div className="space-y-4">
        <div>
          <strong>Current Tenant:</strong> {tenant.name}
        </div>
        <div>
          <strong>Slug:</strong> {tenant.slug}
        </div>
        <div>
          <strong>Primary Color:</strong>
          <span
            className="inline-block w-12 h-12 ml-4 border"
            style={{ backgroundColor: tenant.theme.primaryColor }}
          />
          {tenant.theme.primaryColor}
        </div>
        <div>
          <strong>SEO Title:</strong> {tenant.seo.title}
        </div>

        <div className="mt-8">
          <Button variant="primary">Primary Button (should use tenant color)</Button>
        </div>
      </div>
    </div>
  )
}
```

3. **Visit the page:**
```
http://localhost:3000/test-tenant
```

4. **Try different tenant slugs:**
```
http://localhost:3000/reluma/test-tenant  (should show Reluma)
http://localhost:3000/eonlife/test-tenant (should show Eonlife)
```

**Note:** These routes won't work yet! That's OK - we'll fix in Task 7.

For now, you'll see the default tenant (Reluma) every time.

#### ✅ Verification:
- [ ] You understand tenant config structure
- [ ] You see how useTenant() works
- [ ] You notice the Button doesn't change color (we'll fix this!)

#### 💡 Learning Points:
- **Multi-tenant = configuration-driven**
- **Each brand has its own theme/SEO/features**
- **useTenant() hook provides access everywhere**
- **Components SHOULD use tenant theme** (Button doesn't yet - that's a bug!)

---

## 💾 Task 5: Explore the Database
**Time:** 15 minutes
**Goal:** Understand the database schema

#### Steps:

1. **Open Prisma Studio** (visual database browser):
```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555

2. **Explore the tables:**
- Click on "Tenant"
- Click on "Product"
- Click on "Order"

**Notice:** They're all empty! We'll fix this in Task 6.

3. **Read the schema file:**

Open `prisma/schema.prisma` and study it:

```prisma
model Tenant {
  id     String @id @default(cuid())
  slug   String @unique      // 👈 'reluma' or 'eonlife'
  name   String              // 👈 'Reluma' or 'Eonlife'
  domain String @unique      // 👈 'reluma.com'
  theme  Json                // 👈 Color scheme, logo paths

  products Product[]          // 👈 Relationship: Tenant has many Products
  orders   Order[]
}

model Product {
  id       String @id @default(cuid())
  tenantId String              // 👈 CRITICAL: Which brand owns this product
  tenant   Tenant @relation(...) // 👈 Relationship definition

  name  String
  slug  String                 // 👈 URL-friendly name
  price Decimal @db.Decimal(10, 2) // 👈 Not Float! (prevents rounding errors)

  @@unique([tenantId, slug])  // 👈 Same slug OK across tenants!
  @@index([tenantId, active]) // 👈 Fast queries
}
```

#### ✅ Verification:
Answer these:
- [ ] What's the relationship between Tenant and Product?
- [ ] Can two tenants have products with the same slug?
- [ ] Why use Decimal instead of Float for prices?
- [ ] What does @@index([tenantId, active]) do?

<details>
<summary>Answers (click to reveal)</summary>

- One Tenant has many Products (one-to-many)
- YES! `@@unique([tenantId, slug])` allows same slug per tenant
- Decimal prevents rounding errors ($0.30 × 3 = $0.90, not $0.899999)
- Index makes queries like "get all active products for tenant X" super fast
</details>

#### 💡 Learning Points:
- **Prisma = Type-safe database access**
- **Multi-tenant isolation = tenantId on every model**
- **Indexes = performance optimization**
- **Unique constraints = prevent duplicate data**

---

## 🌱 Task 6: Create Seed Data
**Time:** 25 minutes
**Goal:** Populate database with test data

#### Steps:

1. **Create seed script:**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Reluma tenant
  const reluma = await prisma.tenant.upsert({
    where: { slug: 'reluma' },
    update: {},
    create: {
      slug: 'reluma',
      name: 'Reluma',
      domain: 'reluma.com',
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#475569',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        logo: '/logos/reluma-logo.svg',
        favicon: '/favicons/reluma-favicon.ico',
      },
      features: {
        ecommerce: true,
        blog: true,
        multiLanguage: false,
        stripe: true,
        analytics: true,
      },
    },
  })

  console.log('✅ Created tenant:', reluma.name)

  // Create Eonlife tenant
  const eonlife = await prisma.tenant.upsert({
    where: { slug: 'eonlife' },
    update: {},
    create: {
      slug: 'eonlife',
      name: 'Eonlife',
      domain: 'eonlife.com',
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#64748b',
        accentColor: '#ec4899',
        backgroundColor: '#fafaf9',
        textColor: '#0f172a',
        logo: '/logos/eonlife-logo.svg',
        favicon: '/favicons/eonlife-favicon.ico',
      },
      features: {
        ecommerce: true,
        blog: true,
        multiLanguage: true,
        stripe: true,
        analytics: true,
      },
    },
  })

  console.log('✅ Created tenant:', eonlife.name)

  // Create products for Reluma
  await prisma.product.create({
    data: {
      tenantId: reluma.id,
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 299.99,
      compareAtPrice: 399.99,
      imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Headphones',
      inventory: 50,
      active: true,
      featured: true,
    },
  })

  await prisma.product.create({
    data: {
      tenantId: reluma.id,
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      description: 'Feature-packed smartwatch with health tracking.',
      price: 449.99,
      imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Watch',
      inventory: 30,
      active: true,
      featured: false,
    },
  })

  console.log('✅ Created Reluma products')

  // Create products for Eonlife
  await prisma.product.create({
    data: {
      tenantId: eonlife.id,
      name: 'Longevity Essentials Bundle',
      slug: 'longevity-essentials-bundle',
      description: 'Complete supplement pack for healthy aging and vitality.',
      price: 89.99,
      compareAtPrice: 120.00,
      imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Bundle',
      inventory: 100,
      active: true,
      featured: true,
    },
  })

  await prisma.product.create({
    data: {
      tenantId: eonlife.id,
      name: 'NAD+ Booster',
      slug: 'nad-booster',
      description: 'Advanced cellular energy support supplement.',
      price: 59.99,
      imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=NAD+',
      inventory: 75,
      active: true,
      featured: true,
    },
  })

  await prisma.product.create({
    data: {
      tenantId: eonlife.id,
      name: 'Resveratrol Plus',
      slug: 'resveratrol-plus',
      description: 'Powerful antioxidant for cellular health.',
      price: 45.99,
      imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Resveratrol',
      inventory: 60,
      active: true,
      featured: false,
    },
  })

  console.log('✅ Created Eonlife products')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

2. **Add seed script to package.json:**

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.2"  // Add this if not present
  }
}
```

3. **Install tsx:**
```bash
npm install -D tsx
```

4. **Run the seed:**
```bash
npm run db:seed
```

5. **Check Prisma Studio:**
```bash
npm run db:studio
```

You should now see:
- 2 tenants (Reluma, Eonlife)
- 2 products for Reluma
- 3 products for Eonlife

#### ✅ Verification:
- [ ] Seed script runs without errors
- [ ] Prisma Studio shows 2 tenants
- [ ] Prisma Studio shows 5 total products
- [ ] Products are correctly assigned to tenants

#### 💡 Learning Points:
- **Seeding = populating test data**
- **upsert = create if not exists, update if exists** (idempotent!)
- **Relationships = tenantId links products to tenants**

---

## 🛣️ Task 7: Create Multi-Tenant Routing
**Time:** 30 minutes
**Goal:** Make /reluma and /eonlife routes work

#### Steps:

1. **Create dynamic route structure:**

```bash
mkdir -p src/app/\[tenant\]
```

2. **Create tenant homepage:**

Create `src/app/[tenant]/page.tsx`:

```typescript
'use client'

import { useTenant } from '@/core/hooks/useTenant'
import { Button } from '@/core/components/atoms'
import { getTenantConfig } from '@/tenants/config'
import { notFound } from 'next/navigation'

interface TenantPageProps {
  params: Promise<{ tenant: string }>
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant: tenantSlug } = await params
  const tenant = getTenantConfig(tenantSlug)

  if (!tenant) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <div
          className="inline-block w-24 h-24 rounded-full"
          style={{ backgroundColor: tenant.theme.primaryColor }}
        />

        <h1 className="text-4xl font-bold">{tenant.name}</h1>

        <p className="text-lg text-gray-600">{tenant.seo.description}</p>

        <div className="flex gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            style={{ backgroundColor: tenant.theme.primaryColor }}
          >
            Shop Now
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>✅ Tenant: {tenant.slug}</p>
          <p>✅ Domain: {tenant.domain}</p>
          <p>✅ Primary Color: {tenant.theme.primaryColor}</p>
        </div>
      </div>
    </main>
  )
}
```

3. **Create metadata for each tenant:**

Create `src/app/[tenant]/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { getTenantConfig } from '@/tenants/config'
import { notFound } from 'next/navigation'

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant: tenantSlug } = await params
  const tenant = getTenantConfig(tenantSlug)

  if (!tenant) {
    return {}
  }

  return {
    title: tenant.seo.title,
    description: tenant.seo.description,
  }
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenant: tenantSlug } = await params
  const tenant = getTenantConfig(tenantSlug)

  if (!tenant) {
    notFound()
  }

  return <>{children}</>
}
```

4. **Test the routes:**

Visit:
- http://localhost:3000/reluma (Blue theme!)
- http://localhost:3000/eonlife (Green theme!)
- http://localhost:3000/invalid (Should 404)

#### ✅ Verification:
- [ ] /reluma shows blue circle and Reluma name
- [ ] /eonlife shows green circle and Eonlife name
- [ ] Primary buttons have correct colors
- [ ] Browser tab title changes per tenant

#### 💡 Learning Points:
- **[tenant] = dynamic route segment**
- **params.tenant = the URL slug**
- **Server Components can be async** (Next.js 16 feature!)
- **generateMetadata = dynamic SEO**

---

## 🎨 Task 8: Make Button Use Tenant Colors
**Time:** 20 minutes
**Goal:** Fix the hardcoded button colors

#### Steps:

1. **Modify Button component:**

Open `src/core/components/atoms/Button/Button.tsx`:

```typescript
'use client'  // 👈 ADD THIS!

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/core/lib/cn'
import { useTenant } from '@/core/hooks/useTenant'  // 👈 ADD THIS!

// ... rest of types stay the same ...

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, style, ...props }, ref) => {
    const tenant = useTenant()  // 👈 ADD THIS!

    // Create tenant-aware color
    const dynamicStyle = variant === 'primary' ? {
      backgroundColor: tenant.theme.primaryColor,
      color: '#ffffff',
      ...style
    } : style

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={dynamicStyle}  // 👈 ADD THIS!
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

          // Updated variant styles
          {
            'hover:opacity-90 focus-visible:ring-blue-600': variant === 'primary',  // 👈 CHANGED
            'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-600':
              variant === 'secondary',
            'border-2 border-gray-300 bg-transparent hover:border-gray-400 focus-visible:ring-gray-400':
              variant === 'outline',
          },

          // Size styles (unchanged)
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },

          {
            'pointer-events-none opacity-50 cursor-not-allowed': disabled,
          },

          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

2. **Test it:**

Visit:
- http://localhost:3000/reluma → Blue button!
- http://localhost:3000/eonlife → Green button!

#### ✅ Verification:
- [ ] Reluma button is blue (#2563eb)
- [ ] Eonlife button is green (#059669)
- [ ] Buttons still work (click, keyboard, etc.)

#### 💡 Learning Points:
- **'use client' = Client Component** (can use hooks)
- **Server Components can't use hooks**
- **Inline styles override Tailwind classes**
- **Each tenant gets its own color automatically!**

---

## 📊 Task 9: Fetch and Display Products
**Time:** 30 minutes
**Goal:** Query database and show products

#### Steps:

1. **Create products page:**

Create `src/app/[tenant]/products/page.tsx`:

```typescript
import { prisma } from '@/core/lib/prisma'
import { getTenantConfig } from '@/tenants/config'
import { notFound } from 'next/navigation'
import { Button } from '@/core/components/atoms'

interface ProductsPageProps {
  params: Promise<{ tenant: string }>
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { tenant: tenantSlug } = await params
  const tenantConfig = getTenantConfig(tenantSlug)

  if (!tenantConfig) {
    notFound()
  }

  // Get tenant from database
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      products: {
        where: { active: true },
        orderBy: { featured: 'desc' },
      },
    },
  })

  if (!tenant) {
    return <div>Tenant not found in database. Run: npm run db:seed</div>
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{tenant.name} Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tenant.products.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 shadow-sm">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}

            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>

            <p className="text-gray-600 text-sm mb-4">
              {product.description || 'No description available'}
            </p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold">${product.price.toString()}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.compareAtPrice.toString()}
                </span>
              )}
            </div>

            {product.featured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-4">
                Featured
              </span>
            )}

            <Button
              variant="primary"
              className="w-full"
              style={{ backgroundColor: tenantConfig.theme.primaryColor }}
            >
              Add to Cart
            </Button>

            <p className="text-sm text-gray-500 mt-2">
              {product.inventory} in stock
            </p>
          </div>
        ))}
      </div>

      {tenant.products.length === 0 && (
        <p className="text-gray-500">No products found. Run: npm run db:seed</p>
      )}
    </main>
  )
}
```

2. **Visit the pages:**
- http://localhost:3000/reluma/products (2 products!)
- http://localhost:3000/eonlife/products (3 products!)

#### ✅ Verification:
- [ ] Reluma shows 2 products (headphones, watch)
- [ ] Eonlife shows 3 products (supplements)
- [ ] Products show images (placeholders)
- [ ] Prices display correctly
- [ ] Sale prices show strikethrough
- [ ] "Featured" badge appears on featured products
- [ ] Add to Cart buttons use tenant colors

#### 💡 Learning Points:
- **Server Components can query database directly!**
- **Prisma include = eager loading relationships**
- **where = filtering data**
- **orderBy = sorting (featured first)**
- **Decimal.toString() = convert to string**

---

## 🧪 Task 10: Write Your First Test
**Time:** 25 minutes
**Goal:** Practice TDD by writing a test first

#### Challenge:
Create an **Input** component with tests!

#### Steps:

1. **Create test file FIRST (TDD!):**

Create `src/core/components/atoms/Input/Input.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/core/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello')

    expect(input).toHaveValue('Hello')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('supports different types', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('displays error state', () => {
    render(<Input error placeholder="Input" />)
    const input = screen.getByPlaceholderText('Input')
    expect(input).toHaveClass('border-red-500')
  })
})
```

2. **Run tests (they should FAIL):**
```bash
npm run test -- Input --run
```

You'll see: "Cannot find module './Input'"

This is **RED** in TDD! ✅

3. **Now implement the component:**

Create `src/core/components/atoms/Input/Input.tsx`:

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/core/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-2 rounded-md border',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-colors duration-200',
          {
            'border-gray-300 focus:ring-blue-600': !error,
            'border-red-500 focus:ring-red-600': error,
          },
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
```

4. **Create index file:**

Create `src/core/components/atoms/Input/index.ts`:

```typescript
export { Input } from './Input'
export type { InputProps } from './Input'
```

5. **Run tests again (they should PASS):**
```bash
npm run test -- Input --run
```

This is **GREEN** in TDD! ✅

6. **Use it in a page:**

Create `src/app/[tenant]/contact/page.tsx`:

```typescript
'use client'

import { Input } from '@/core/components/atoms/Input'
import { Button } from '@/core/components/atoms'
import { useTenant } from '@/core/hooks/useTenant'
import { useState } from 'react'

export default function ContactPage() {
  const tenant = useTenant()
  const [email, setEmail] = useState('')

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-8">Contact {tenant.name}</h1>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input type="text" placeholder="Your name" />

        <Button
          variant="primary"
          className="w-full"
          style={{ backgroundColor: tenant.theme.primaryColor }}
        >
          Send Message
        </Button>
      </div>
    </main>
  )
}
```

7. **Test it:**
- http://localhost:3000/reluma/contact
- http://localhost:3000/eonlife/contact

#### ✅ Verification:
- [ ] Tests failed initially (RED)
- [ ] Tests pass after implementation (GREEN)
- [ ] All 5 tests pass
- [ ] Input works in contact page
- [ ] Can type in inputs
- [ ] Inputs are styled correctly

#### 💡 Learning Points:
- **TDD workflow: Write test → Watch it fail → Implement → Watch it pass**
- **Tests document expected behavior**
- **forwardRef = can access DOM element**
- **Extending HTML attributes = gets all native props**

---

## 🎓 Graduation Task: Build a Component From Scratch
**Time:** 45-60 minutes
**Goal:** Apply everything you learned

### Challenge:
Build a **ProductCard** molecule component that:
1. Shows product image
2. Shows product name
3. Shows price (with sale price strikethrough)
4. Shows "Featured" badge if applicable
5. Has "Add to Cart" button with tenant color
6. Is fully tested (TDD!)

### Requirements:

#### 1. Tests First (RED)
Create `src/core/components/molecules/ProductCard/ProductCard.test.tsx` with tests for:
- Renders product name
- Renders price
- Shows sale price with strikethrough when present
- Shows featured badge when featured=true
- Hides badge when featured=false
- Renders image with correct alt text
- Calls onAddToCart when button clicked

#### 2. Implementation (GREEN)
Create `src/core/components/molecules/ProductCard/ProductCard.tsx`

Hints:
```typescript
interface ProductCardProps {
  name: string
  price: number
  compareAtPrice?: number
  imageUrl?: string
  featured?: boolean
  onAddToCart?: () => void
}
```

#### 3. Use It
Update `/[tenant]/products/page.tsx` to use your ProductCard component instead of the inline div.

#### ✅ Self-Check:
- [ ] All tests written BEFORE implementation
- [ ] All tests pass
- [ ] Coverage is 80%+
- [ ] Component is reusable
- [ ] Uses tenant theming
- [ ] Products page uses ProductCard

---

## 🎉 Congratulations!

You've completed the learning tasks! You now understand:

✅ **Project structure** (atomic design, multi-tenant)
✅ **Testing workflow** (TDD, Vitest, coverage)
✅ **Multi-tenancy** (tenant detection, theming)
✅ **Database** (Prisma, seeding, relationships)
✅ **Routing** (Next.js dynamic routes)
✅ **Component development** (atoms, molecules, organisms)
✅ **Type safety** (TypeScript strict mode)

---

## Next Steps

Now that you understand the foundation, you're ready to:

1. ✅ Review the full **Component Library Spec** (`docs/component-library-spec.md`)
2. ✅ Review the **Migration Plan** (`docs/migration-plan.md`)
3. ✅ Start building the remaining atoms (Label, Badge, Typography)
4. ✅ Build molecules (SearchBar, FormField, etc.)
5. ✅ Build organisms (Header, Footer, ProductGrid)
6. ✅ Create full landing page templates

**Ask questions!** The better you understand the foundation, the easier everything else will be.

---

**Learning Tasks Created by:** Claude (Senior Software Engineer)
**Difficulty:** Beginner → Intermediate
**Estimated Total Time:** 4-5 hours
