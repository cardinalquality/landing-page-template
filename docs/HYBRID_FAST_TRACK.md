# Hybrid Fast Track
**Move Fast + Learn Along the Way**

Perfect for: Programmers with C++/OOP background, minimal JS/TS experience, want results ASAP!

---

## 🎯 Your Profile

- ✅ **Background:** C++ (OOP concepts solid)
- ⚠️ **JavaScript/TypeScript:** Limited experience
- 📚 **TDD:** Know what it is, never done it
- 🚀 **Goal:** Move fast AND learn

**Great news:** Your C++ background means you already understand:
- Strong typing (TypeScript will feel familiar!)
- Interfaces/contracts
- Memory management (JS handles this for you - easier!)
- OOP principles

**What's different in JavaScript/TypeScript:**
- No pointers! Everything is references
- Async/await instead of threads
- Dynamic typing (but TypeScript adds types back!)
- Functional programming patterns

---

## ⚡ 2-Hour Quick Start (Get Something Working!)

### Hour 1: Setup + See Results

#### Part 1: Environment (15 min)

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Edit .env.local:
nano .env.local  # or use VS Code

# Add your Supabase credentials:
# Go to: https://supabase.com
# Create account → New project → Copy these:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
DIRECT_URL="(same as DATABASE_URL)"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# 3. Generate Prisma client
npm run db:generate

# 4. Initialize migrations (production-ready!)
npm run db:migrate -- --name init

# 5. Push to database
npm run db:push
```

**Learning Note:**
- `DATABASE_URL` = connection string (like C++ ODBC connection)
- `npm run` = runs scripts from package.json
- Prisma = ORM (like Hibernate for Java, or Entity Framework for C#)

#### Part 2: Seed Database (15 min)

Create `prisma/seed.ts` (I'll give you complete code):

<details>
<summary>Click to see full seed.ts code (copy-paste ready!)</summary>

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

  // Create products for Reluma
  await prisma.product.createMany({
    data: [
      {
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
      {
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
    ],
  })

  // Create products for Eonlife
  await prisma.product.createMany({
    data: [
      {
        tenantId: eonlife.id,
        name: 'Longevity Essentials Bundle',
        slug: 'longevity-essentials-bundle',
        description: 'Complete supplement pack for healthy aging.',
        price: 89.99,
        compareAtPrice: 120.00,
        imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Bundle',
        inventory: 100,
        active: true,
        featured: true,
      },
      {
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
      {
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
    ],
  })

  console.log('✅ Created:', reluma.name, '- 2 products')
  console.log('✅ Created:', eonlife.name, '- 3 products')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

</details>

```bash
# Add to package.json scripts:
"db:seed": "tsx prisma/seed.ts"

# Install tsx (TypeScript executor):
npm install -D tsx

# Run seed:
npm run db:seed
```

**C++ Translation:**
```cpp
// In C++ you might do:
Product* product = new Product("Headphones", 299.99);
db->insert(product);

// In TypeScript:
const product = await prisma.product.create({
  data: { name: "Headphones", price: 299.99 }
})
// No manual memory management! 🎉
```

#### Part 3: Start Dev Server (5 min)

```bash
npm run dev
```

Visit: http://localhost:3000

**You should see:** The homepage with buttons!

**Learning Note:**
- Next.js = React framework (like Angular or Vue)
- Hot reload = Changes appear instantly (no recompile!)
- Port 3000 = default dev server port

#### Part 4: Create Tenant Routes (25 min)

**Quick concept:** Dynamic routes in Next.js

```
app/
  └── [tenant]/         ← Brackets = dynamic segment
      └── page.tsx      ← Matches /reluma, /eonlife, etc.
```

Like in C++:
```cpp
// Similar to:
void handleRoute(string tenant) {
  if (tenant == "reluma") { /* ... */ }
  else if (tenant == "eonlife") { /* ... */ }
}
```

**Create the file:**

```bash
mkdir -p src/app/\[tenant\]
```

Create `src/app/[tenant]/page.tsx`:

```typescript
import { getTenantConfig } from '@/tenants/config'
import { notFound } from 'next/navigation'
import { Button } from '@/core/components/atoms'

interface TenantPageProps {
  params: Promise<{ tenant: string }>
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant: tenantSlug } = await params
  const tenant = getTenantConfig(tenantSlug)

  if (!tenant) {
    notFound()  // Returns 404
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        {/* Tenant color circle */}
        <div
          className="inline-block w-24 h-24 rounded-full mx-auto"
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
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>✅ Tenant: {tenant.slug}</p>
          <p>✅ Color: {tenant.theme.primaryColor}</p>
        </div>
      </div>
    </main>
  )
}
```

**C++ Translation:**
```cpp
// Similar to:
class TenantPage {
public:
  void render(const string& tenantSlug) {
    TenantConfig* tenant = getTenantConfig(tenantSlug);
    if (!tenant) {
      throw NotFoundException();
    }
    cout << tenant->name << endl;
  }
};
```

**Test it:**
- http://localhost:3000/reluma → Blue!
- http://localhost:3000/eonlife → Green!

---

### Hour 2: Build Your First Feature (Products Page)

#### Create Products Page (30 min)

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

  // Query database (Server Component!)
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
    return <div>Run: npm run db:seed</div>
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
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold">
                ${product.price.toString()}
              </span>
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
    </main>
  )
}
```

**Visit:**
- http://localhost:3000/reluma/products
- http://localhost:3000/eonlife/products

**C++ Translation:**
```cpp
// Similar to SQL query in C++:
vector<Product> products = db->query()
  ->where("tenantId", tenant.id)
  ->where("active", true)
  ->orderBy("featured", DESC)
  ->get();

// But TypeScript/Prisma is type-safe!
// IntelliSense knows all fields automatically
```

**Learning Note:**
- `async/await` = like promises/futures in C++
- `map()` = like std::transform()
- JSX = HTML-like syntax in JavaScript (gets compiled)

#### Run Tests (10 min)

```bash
# Run existing tests
npm run test -- --run

# See coverage
npm run test:coverage
open coverage/index.html
```

**You'll see:** 14/14 Button tests passing!

**Learning Note:**
- Vitest = test runner (like Google Test or Catch2 in C++)
- Tests run in milliseconds
- Coverage shows % of code tested

#### Understand TDD Workflow (20 min)

Let's build an **Input** component with TDD!

**Step 1: Write test FIRST** (This is TDD!)

Create `src/core/components/atoms/Input/Input.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/core/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'  // Doesn't exist yet!

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
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })
})
```

**C++ Translation:**
```cpp
// Similar to Google Test:
TEST(InputTest, RendersWithPlaceholder) {
  Input input("Enter email");
  EXPECT_EQ(input.getPlaceholder(), "Enter email");
}
```

**Step 2: Run test (it FAILS - RED phase)**

```bash
npm run test -- Input

# Error: Cannot find module './Input'
# This is GOOD! TDD says: Write test, watch it fail
```

**Step 3: Implement component (GREEN phase)**

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
          'focus:outline-none focus:ring-2',
          {
            'border-gray-300 focus:ring-blue-600': !error,
            'border-red-500 focus:ring-red-600': error,
          },
          'disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
```

Create `src/core/components/atoms/Input/index.ts`:

```typescript
export { Input } from './Input'
export type { InputProps } from './Input'
```

**C++ Translation:**
```cpp
// forwardRef is like:
class Input {
private:
  HTMLInputElement& element;  // Reference to DOM element
public:
  Input(HTMLInputElement& el) : element(el) {}
};

// TypeScript does this automatically!
```

**Step 4: Run test (it PASSES - GREEN phase)**

```bash
npm run test -- Input

# ✓ renders with placeholder
# ✓ accepts user input
# ✓ can be disabled
```

**🎉 You just did TDD!**

**TDD Cycle (like in C++):**
1. **RED:** Write failing test
2. **GREEN:** Write minimal code to pass
3. **REFACTOR:** Improve code (tests still pass)

---

## 🚀 After 2 Hours, You Have:

✅ **Working app**
- Dev environment set up
- Database seeded with products
- Two tenant brands (Reluma, Eonlife)
- Products displaying correctly

✅ **Understanding of:**
- Next.js routing (dynamic routes)
- TypeScript basics (types, interfaces)
- Prisma database queries
- TDD workflow (RED → GREEN → REFACTOR)
- React components (atoms)

---

## 📚 JavaScript/TypeScript Quick Reference (For C++ Developers)

### Type System

```typescript
// C++
int age = 25;
string name = "John";
vector<int> numbers = {1, 2, 3};

// TypeScript
let age: number = 25
const name: string = "John"
const numbers: number[] = [1, 2, 3]

// Or inferred:
let age = 25  // TypeScript knows it's a number
```

### Functions

```typescript
// C++
int add(int a, int b) {
  return a + b;
}

// TypeScript
function add(a: number, b: number): number {
  return a + b
}

// Arrow function (lambda):
const add = (a: number, b: number): number => a + b
```

### Classes

```typescript
// C++
class Product {
private:
  string name;
  double price;
public:
  Product(string n, double p) : name(n), price(p) {}
  string getName() { return name; }
};

// TypeScript
class Product {
  private name: string
  private price: number

  constructor(name: string, price: number) {
    this.name = name
    this.price = price
  }

  getName(): string {
    return this.name
  }
}

// But usually use interfaces:
interface Product {
  name: string
  price: number
}

const product: Product = { name: "Headphones", price: 299.99 }
```

### Interfaces

```typescript
// C++
class IPaymentProcessor {
public:
  virtual void processPayment(double amount) = 0;
};

// TypeScript
interface PaymentProcessor {
  processPayment(amount: number): void
}

class StripeProcessor implements PaymentProcessor {
  processPayment(amount: number): void {
    // Implementation
  }
}
```

### Async/Await

```typescript
// C++ (std::future)
future<int> fetchData() {
  return async([] { return 42; });
}
int result = fetchData().get();

// TypeScript
async function fetchData(): Promise<number> {
  return 42
}
const result = await fetchData()

// Database query:
const products = await prisma.product.findMany()
// No blocking! JavaScript is single-threaded but non-blocking
```

### Null Safety

```typescript
// C++
string* name = nullptr;
if (name != nullptr) {
  cout << *name;
}

// TypeScript
let name: string | null = null
if (name !== null) {
  console.log(name)
}

// Optional chaining (awesome!):
const length = name?.length  // Returns undefined if name is null
```

### Arrays/Collections

```typescript
// C++
vector<int> numbers = {1, 2, 3};
for (int n : numbers) {
  cout << n;
}

// TypeScript
const numbers = [1, 2, 3]
numbers.forEach(n => console.log(n))

// Map (like transform):
const doubled = numbers.map(n => n * 2)  // [2, 4, 6]

// Filter:
const evens = numbers.filter(n => n % 2 === 0)  // [2]

// Reduce:
const sum = numbers.reduce((acc, n) => acc + n, 0)  // 6
```

---

## 🎯 Next Steps (Choose Your Path)

### Path A: Build More Features (Fast Track)

**Week 1:**
1. ✅ Build remaining atoms:
   - Label
   - Badge
   - Typography (Heading, Paragraph)
   - Image (with responsive loading)

2. ✅ Build molecules:
   - ProductCard (extract from products page)
   - SearchBar
   - FormField (Label + Input)

3. ✅ Build organisms:
   - Header (logo, nav, cart icon)
   - Footer (links, newsletter)
   - ProductGrid (products with filters)

**Week 2:**
1. ✅ Add shopping cart
2. ✅ Add checkout flow
3. ✅ Integrate Stripe payments

### Path B: Learn Fundamentals First

**Recommended resources:**
1. **JavaScript:**
   - [JavaScript.info](https://javascript.info) (free, excellent)
   - Focus on: arrays, objects, functions, async/await

2. **TypeScript:**
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
   - Focus on: basic types, interfaces, generics

3. **React:**
   - [React Beta Docs](https://react.dev)
   - Focus on: components, props, hooks (useState, useEffect)

4. **Next.js:**
   - [Next.js Learn](https://nextjs.org/learn)
   - Focus on: routing, server components, data fetching

**Time: 2-3 weeks of evening study**

### Path C: Hybrid (My Recommendation)

**Daily schedule:**
- Morning (30 min): Read fundamentals
- Afternoon (1-2 hours): Build features
- Evening (30 min): Review what you built

**This way:**
- You make visible progress (motivation!)
- You learn by doing (best for programmers)
- You fill knowledge gaps as you encounter them

---

## 🐛 Common "Gotchas" for C++ Developers

### 1. No Manual Memory Management

```typescript
// In C++, you worry about:
Product* p = new Product();
delete p;  // Must remember!

// In JavaScript/TypeScript:
const p = new Product()
// Garbage collected automatically! 🎉
```

### 2. Everything is Async

```typescript
// This WON'T work:
const products = prisma.product.findMany()
console.log(products)  // ❌ Promise object, not data!

// Must await:
const products = await prisma.product.findMany()
console.log(products)  // ✅ Actual products
```

### 3. Equality is Weird

```typescript
// C++
if (a == b) { /* values equal */ }

// JavaScript
if (a == b)  { /* loose equality - avoid! */ }
if (a === b) { /* strict equality - always use this! */ }

// Example:
1 == "1"   // true (coerces types)
1 === "1"  // false (different types)
```

### 4. Objects are References

```typescript
// C++
struct Point { int x, y; };
Point a = {1, 2};
Point b = a;  // Copy
b.x = 5;
// a.x is still 1

// JavaScript
const a = { x: 1, y: 2 }
const b = a  // Reference!
b.x = 5
// a.x is now 5!

// To copy:
const b = { ...a }  // Spread operator
```

### 5. Array Indexing Doesn't Throw

```typescript
// C++
vector<int> v = {1, 2, 3};
cout << v[10];  // Out of bounds error!

// JavaScript
const v = [1, 2, 3]
console.log(v[10])  // undefined (no error!)

// TypeScript strict mode helps:
const value = v[10]  // Type: number | undefined
```

---

## ✅ Your Current Progress

After following this guide, you have:

- [x] **Environment:** Dev setup complete
- [x] **Database:** Seeded with 2 tenants, 5 products
- [x] **Routing:** Dynamic tenant routes working
- [x] **Components:** Button (tested!), Input (you built with TDD!)
- [x] **Features:** Products page displaying data
- [x] **Skills:** Understand TDD workflow

**You're ready to build!** 🚀

---

## 🆘 When You Get Stuck

### Error Messages

**"Cannot find module '@/...'"**
```bash
# Fix: Check tsconfig.json paths
# Make sure: "baseUrl": ".", "paths": { "@/*": ["./src/*"] }
```

**"Type 'X' is not assignable to type 'Y'"**
```bash
# Fix: Check TypeScript types
# Add type annotations: const x: TypeName = ...
```

**"Hydration failed"**
```bash
# Fix: Server/client mismatch
# Use 'use client' directive if using browser-only APIs
```

### Where to Get Help

1. **TypeScript errors:** Hover in VS Code, read tooltip
2. **Next.js issues:** Check [Next.js docs](https://nextjs.org/docs)
3. **React questions:** [React docs](https://react.dev)
4. **Prisma queries:** [Prisma docs](https://www.prisma.io/docs)

---

## 🎓 Summary

**You learned:**
- ✅ TypeScript basics (types, interfaces, async/await)
- ✅ Next.js routing (dynamic routes, server components)
- ✅ Prisma database queries (ORM, type-safe)
- ✅ TDD workflow (RED → GREEN → REFACTOR)
- ✅ React components (functional components, JSX)

**Time invested:** 2 hours
**Knowledge gained:** Foundation to build entire platform

**Next:** Pick a path (A/B/C above) and keep building!

---

**Created for:** Programmers with C++ background
**Difficulty:** Beginner-friendly with advanced concepts
**Estimated completion:** 2 hours for fast track, ongoing learning
