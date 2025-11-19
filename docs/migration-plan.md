# Eonlife Migration Plan
**From Legacy to Multi-Tenant E-Commerce Platform**

---

## Executive Summary

The old Eonlife project (github.com/cardinalquality/Eonlife) is a functional Next.js 16 e-commerce landing page with payment processing, but was built **without tests** and lacks proper architecture. This document outlines what to salvage and how to rebuild it correctly using TDD, atomic design, and multi-tenant architecture.

**Key Stats:**
- **Tech Stack:** Next.js 16, TypeScript (94.7%), Tailwind v4, Prisma, Stripe
- **Components:** 19 React components + 8 section components
- **API Endpoints:** 12 backend routes
- **Database Models:** 6 (Customer, Order, OrderItem, Subscription, PaymentMethod, PaymentEvent)
- **Test Coverage:** 0% ❌
- **Multi-tenant Ready:** No ❌

---

## 1. Feature Inventory

### ✅ Core Features Worth Keeping

#### **E-Commerce Functionality** (High Priority)
- **Shopping Cart System**
  - Add to cart, quantity management
  - Cart context for state management
  - Persistent cart state
- **Payment Processing**
  - Stripe integration (cards, wallets)
  - Payment intent creation
  - Webhook handling for payment events
  - Payment method storage (last4, default selection)
- **Product Catalog**
  - Product registry system
  - Product filtering
  - Product image galleries
  - Product reviews and ratings
  - Related products display
- **Order Management**
  - Order creation and tracking
  - Order items with quantities
  - Order status (pending, processing, completed, cancelled)
- **Subscription System**
  - Recurring billing via Stripe
  - Subscription status tracking
  - Current period management

#### **Customer Management** (High Priority)
- Customer creation/retrieval API
- Email uniqueness
- Address storage
- Stripe customer ID linking
- Payment method management

#### **Landing Page System** (Medium Priority)
- **Template Switching Architecture**
  - Multi-variant template system (option1, option2)
  - Template context provider
  - Easy configuration switching
- **Section Components**
  - Hero section with CTAs
  - Features showcase
  - Testimonials display
  - Before/After comparisons
  - Education content
  - Science-backed information
  - Header/Footer

#### **Security & Compliance** (High Priority)
- CSRF protection
- Rate limiting
- Input sanitization
- Password handling
- GDPR compliance features
  - Cookie consent
  - Data export/deletion
  - Consent tracking

#### **Supporting Features** (Medium Priority)
- Newsletter subscription
- Contact form
- Analytics tracking (Google Analytics integration)
- Web vitals monitoring
- SEO features (structured data, sitemap, robots.txt)
- Responsive image optimization
- Custom typography (Avenir Next LT Pro)

#### **Policy Pages** (Low Priority - but needed)
- Privacy policy
- Refund policy
- Shipping policy
- Terms of service

### ⚠️ Features That Need Rethinking

1. **Template System** → Convert to Multi-Tenant Brand System
   - Current: Template switching for A/B testing
   - New: Brand-based theming (Reluma vs Eonlife)
   - Add: Tenant isolation in database

2. **Static Asset Structure** → CDN-Ready Asset Management
   - Current: Public folder organization by template
   - New: Supabase Storage or Cloudinary integration
   - Add: Dynamic asset loading per tenant

3. **Product Registry** → Database-Driven Product Management
   - Current: Code-based product registry
   - New: Admin UI for product management
   - Add: Product variants, inventory tracking

---

## 2. Component Catalog

### 🔨 Components to Rebuild (TDD Required)

#### **Atoms** (Smallest UI elements)
```
Priority: Phase 1
Testing: Unit tests required

To Rebuild:
- ⚛️ Button (primary, secondary, accent variants)
- ⚛️ Input (text, email, number, password)
- ⚛️ Label
- ⚛️ StarRating (reusable from old project)
- ⚛️ Image (responsive, optimized)
- ⚛️ Icon (social icons, UI icons)
- ⚛️ Badge (cart count, sale badges)
- ⚛️ Spinner/Loader
- ⚛️ Typography (Heading, Paragraph, Link)
```

#### **Molecules** (Simple component groups)
```
Priority: Phase 1-2
Testing: Unit + Integration tests

To Rebuild:
- 🧬 FormField (label + input + error)
- 🧬 ProductCard (image + title + price + rating + CTA)
- 🧬 ReviewCard (rating + text + author)
- 🧬 TestimonialCard
- 🧬 CartItem (product + quantity controls + price)
- 🧬 PaymentMethodSelector
- 🧬 SearchBar
- 🧬 FilterTag
- 🧬 CookieConsentBanner
```

#### **Organisms** (Complex components)
```
Priority: Phase 2
Testing: Integration + E2E tests

To Rebuild:
- 🦠 Header (logo + nav + cart icon + mobile menu)
- 🦠 Footer (links + social + newsletter)
- 🦠 ShoppingCart (cart items + totals + checkout)
- 🦠 CheckoutForm (shipping + payment + review)
- 🦠 ProductGrid (filters + sorting + products)
- 🦠 ProductImageGallery (thumbnails + main image + zoom)
- 🦠 ProductReviews (rating summary + review list + form)
- 🦠 BeforeAfterSlider
- 🦠 ContactForm
- 🦠 NewsletterForm
```

#### **Templates** (Page-level layouts)
```
Priority: Phase 3
Testing: E2E tests

To Rebuild:
- 📄 LandingPageTemplate (hero + sections + footer)
- 📄 ProductPageTemplate (breadcrumbs + gallery + details + reviews)
- 📄 CartPageTemplate
- 📄 CheckoutPageTemplate
- 📄 PolicyPageTemplate
```

### ❌ Components to Avoid Copying

**DO NOT migrate these directly:**
1. **Any component without PropTypes or TypeScript interfaces** → Rebuild with strict types
2. **Components mixing logic with presentation** → Separate concerns
3. **Non-responsive hardcoded layouts** → Use Tailwind responsive utilities
4. **Components without error boundaries** → Add proper error handling
5. **Untested Stripe integration components** → Rebuild with test mocks

---

## 3. Content Audit

### 📦 Assets to Reuse

#### **Copy/Text Content** (Extract and Migrate)
```yaml
Location: templates/option1/index.ts, templates/option2/index.ts

Valuable Content:
  - Product descriptions
  - Feature headlines and benefits
  - Testimonial text (customer names, quotes)
  - FAQ content (if exists)
  - Science/education section content
  - CTA button text
  - Social proof statements
  - Before/after descriptions

Action: Extract to structured content files (JSON/YAML)
Storage: Move to database or CMS for multi-tenant access
```

#### **Images & Media** (Inventory and Optimize)
```yaml
Location: public/assets/option1/, public/assets/option2/

Assets to Salvage:
  - Product photos (hero shots, detail shots)
  - Before/after comparison images
  - Testimonial photos
  - Logo files (SVG preferred)
  - Social media icons
  - Background images/patterns
  - Feature section graphics

Action Required:
  1. Audit image quality (resolution, format)
  2. Optimize for web (WebP conversion, compression)
  3. Upload to Supabase Storage
  4. Create image manifest with metadata
  5. Implement CDN delivery

Warning: Check licensing/ownership before migration
```

#### **Brand Assets**
```yaml
Typography:
  - Avenir Next LT Pro font files → Keep (check license)
  - Font loading strategy → Review and optimize

Colors:
  - Extract color palette from templates
  - Document primary, secondary, accent values
  - Map to multi-tenant theme system

Spacing/Layout:
  - Document grid system
  - Extract spacing scale
  - Note breakpoint values
```

#### **SEO Metadata**
```yaml
Existing Metadata (app/layout.tsx):
  - Site title
  - Meta descriptions
  - OpenGraph tags
  - Twitter card data
  - Favicon

Structured Data (components/StructuredData.tsx):
  - Product schema
  - Organization schema
  - Review aggregation schema

Action: Audit for accuracy, make tenant-dynamic
```

### 🗑️ Content to Discard

- Hardcoded test data in components
- Dummy/placeholder text
- Low-quality images
- Duplicate assets across templates
- Unused template variants

---

## 4. Technical Debt Report

### 🚨 Critical Issues (DO NOT MIGRATE)

#### **1. Zero Test Coverage**
```
Problem: Entire codebase built without tests
Impact: Impossible to refactor safely, high bug risk
Migration Strategy: REBUILD with TDD, don't copy
```

#### **2. No Multi-Tenancy**
```
Problem: Single-brand architecture
Issues:
  - No tenant_id in database models
  - Hardcoded brand assets
  - No tenant isolation
  - Shared Stripe account (needs separate Connect accounts)

Migration Strategy: Design multi-tenant from day 1
```

#### **3. Missing Atomic Design Structure**
```
Problem: Flat component organization
Issues:
  - Components not organized by atoms/molecules/organisms
  - Inconsistent component sizing/complexity
  - Duplicated UI patterns

Migration Strategy: Rebuild with strict atomic hierarchy
```

#### **4. Context Overuse Without Optimization**
```
Problem: cart-context, product-context, template-context
Issues:
  - Potentially causing unnecessary re-renders
  - No memoization visible
  - Mixed concerns

Migration Strategy: Use Zustand or server state (React Query)
```

#### **5. Security Concerns**
```
Unknowns (Requires Code Review):
  - CSRF implementation completeness
  - Rate limiting effectiveness
  - Input sanitization coverage
  - Password hashing algorithm
  - API middleware security

Migration Strategy: Rebuild auth/security with security audit
```

#### **6. Tightly Coupled Payment Logic**
```
Problem: Stripe hardcoded throughout
Issues:
  - Can't swap payment providers
  - Testing requires Stripe test mode
  - No payment abstraction layer

Migration Strategy: Create PaymentService interface
```

### ⚠️ Medium Priority Debt

1. **API Route Organization**
   - 12 routes without clear grouping
   - Missing versioning (/api/v1)
   - No OpenAPI documentation

2. **Type Safety Gaps**
   - Runtime validation unclear
   - Zod or Yup not visible in stack
   - API response types unknown

3. **Performance Unknowns**
   - No lazy loading mentioned
   - Image optimization strategy unclear
   - Bundle size not documented

4. **Error Handling**
   - Error boundary implementation unknown
   - API error responses not standardized
   - No error tracking (Sentry, etc.)

5. **Accessibility**
   - ARIA labels unknown
   - Keyboard navigation unclear
   - Screen reader support unverified

### ✅ Good Patterns to Keep

1. **TypeScript Usage** (94.7% of codebase)
2. **Next.js App Router** (modern routing)
3. **Prisma ORM** (type-safe database)
4. **Tailwind CSS** (utility-first styling)
5. **Modular File Structure** (separated concerns)
6. **Webhook Handling** (payment events)
7. **GDPR Awareness** (cookie consent, data rights)

---

## 5. Migration Phases

### 🎯 Phase 1: Foundation (Weeks 1-3)
**Goal:** Testing infrastructure + Core atomic components

#### **Setup**
- [x] Initialize new project structure
- [ ] Configure Vitest + Testing Library
- [ ] Set up Tailwind v4 with atomic design tokens
- [ ] Configure Supabase client
- [ ] Set up Prisma with multi-tenant schema

#### **Database Migration**
```sql
-- Extend old schema with multi-tenancy
ALTER TABLE Customer ADD COLUMN tenant_id UUID;
ALTER TABLE Product ADD COLUMN tenant_id UUID;
-- Add tenant table
CREATE TABLE Tenant (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE, -- 'reluma' or 'eonlife'
  name TEXT,
  theme JSON,
  stripe_account_id TEXT
);
```

#### **Atomic Components (TDD)**
```
Week 1: Build with tests
- Button (3 variants)
- Input (5 types)
- Label
- Typography components

Week 2: Build with tests
- StarRating
- Image (responsive)
- Icon system
- Badge

Week 3: Build with tests
- FormField molecule
- Basic layout components
```

**Success Criteria:**
- ✅ 80%+ test coverage on all components
- ✅ Storybook with all variants documented
- ✅ TypeScript strict mode passing
- ✅ Accessibility audit passing (axe-core)

---

### 🎯 Phase 2: E-Commerce Core (Weeks 4-7)
**Goal:** Product catalog + Cart + Checkout (TDD)

#### **Content Migration**
```
Week 4:
- Extract product data from old project
- Create product migration script
- Import to Supabase (Reluma + Eonlife tenants)
- Migrate product images to Supabase Storage
```

#### **Product Components (TDD)**
```
Week 5:
- ProductCard molecule (tests first!)
- ProductGrid organism
- ProductFilters organism
- ProductImageGallery organism

Week 6:
- ShoppingCart organism
- CartItem molecule
- Cart context/state (with tests)

Week 7:
- CheckoutForm organism
- Payment integration (with Stripe test mode)
- Webhook handler (with test fixtures)
```

#### **API Endpoints (TDD)**
```
Rebuild with tests:
- /api/products/[id] (GET)
- /api/cart (GET, POST, PATCH, DELETE)
- /api/checkout/session (POST)
- /api/webhooks/stripe (POST)
```

**Success Criteria:**
- ✅ Full e-commerce flow working (browse → cart → checkout)
- ✅ 80%+ test coverage (unit + integration)
- ✅ Stripe test mode transactions succeeding
- ✅ Webhook handling verified with Stripe CLI

---

### 🎯 Phase 3: Landing Pages + Sections (Weeks 8-10)
**Goal:** Rebuild marketing pages with multi-tenant theming

#### **Content Migration**
```
Week 8:
- Extract all copy from templates/option1, option2
- Create content schema (JSON)
- Load into database/CMS per tenant
- Migrate hero images, testimonials, before/after
```

#### **Section Components (TDD)**
```
Week 8:
- Header organism (mobile menu, cart icon)
- Footer organism
- HeroSection

Week 9:
- FeaturesSection
- TestimonialsSection
- BeforeAfterSlider

Week 10:
- EducationSection
- ScienceSection
- ContactForm
```

#### **Theming System**
```
Multi-tenant brand switching:
- Create theme provider (Reluma vs Eonlife)
- Theme JSON in database per tenant
- Dynamic color/font loading
- Test theme switching
```

**Success Criteria:**
- ✅ Landing pages render for both tenants
- ✅ Theme switching works correctly
- ✅ All sections responsive (mobile + desktop)
- ✅ Content loaded from database/CMS

---

### 🎯 Phase 4: Customer Features (Weeks 11-13)
**Goal:** Reviews, subscriptions, customer accounts

#### **Customer System**
```
Week 11:
- Customer authentication (Supabase Auth)
- Customer dashboard
- Order history
- Account management

Week 12:
- Product reviews (TDD)
- Review moderation
- Rating aggregation
- Review display components

Week 13:
- Subscription management
- Recurring billing
- Subscription status UI
- Cancellation flow
```

#### **API Endpoints**
```
Rebuild with tests:
- /api/customers/create-or-get
- /api/reviews (CRUD)
- /api/subscriptions (CRUD)
- /api/orders (GET list)
```

**Success Criteria:**
- ✅ Customer can create account, log in
- ✅ Customer can leave reviews
- ✅ Customer can view order history
- ✅ Subscriptions work end-to-end

---

### 🎯 Phase 5: Security + Compliance (Weeks 14-15)
**Goal:** GDPR, security hardening, production readiness

#### **Security Hardening**
```
Week 14:
- Rebuild CSRF protection (with tests)
- Rebuild rate limiting (with tests)
- Input sanitization audit
- SQL injection prevention audit
- XSS prevention audit
```

#### **GDPR Compliance**
```
Week 15:
- Cookie consent (rebuild with tests)
- Data export API
- Data deletion API
- Privacy policy pages
- GDPR API endpoints
- Consent tracking
```

#### **Additional Features**
```
Week 15:
- Newsletter signup
- Contact form
- Analytics integration (GA4)
- Error tracking (Sentry)
- Performance monitoring
```

**Success Criteria:**
- ✅ Security audit passing (OWASP Top 10)
- ✅ GDPR compliance verified
- ✅ Cookie consent working
- ✅ Error tracking operational

---

### 🎯 Phase 6: Polish + Launch (Weeks 16-17)
**Goal:** SEO, performance, deployment

#### **SEO Migration**
```
Week 16:
- Rebuild sitemap generation
- Rebuild robots.txt
- Structured data (products, reviews)
- Meta tags (dynamic per tenant)
- OpenGraph images
```

#### **Performance Optimization**
```
Week 16:
- Image optimization (WebP, lazy loading)
- Code splitting
- Bundle analysis
- Lighthouse audit (aim for 90+ scores)
```

#### **Deployment**
```
Week 17:
- Vercel deployment (staging)
- Environment variables
- Database migration (production)
- DNS setup (multi-tenant domains)
- SSL certificates
- Launch! 🚀
```

**Success Criteria:**
- ✅ Lighthouse scores: Performance 90+, Accessibility 100, SEO 100
- ✅ 80%+ overall test coverage
- ✅ Zero critical security vulnerabilities
- ✅ Both tenants (Reluma + Eonlife) operational

---

## 6. Value Extraction Strategy

### ✅ Salvage This (High ROI)

1. **Database Schema** → Extend with multi-tenancy
2. **Stripe Integration Logic** → Refactor with tests
3. **Product Content** → Import to new system
4. **Brand Assets** → Optimize and migrate
5. **SEO Metadata** → Make dynamic per tenant
6. **Copy/Testimonials** → Database-driven content

### ⚠️ Refactor This (Medium ROI)

1. **Component Logic** → Extract, test, rebuild
2. **API Endpoint Patterns** → Add tests, security
3. **Payment Webhook Logic** → Add comprehensive tests
4. **Template System Concept** → Convert to tenant theming

### ❌ Abandon This (Low/Negative ROI)

1. **Untested React components** → Cost of retrofitting tests > rebuild
2. **Context state management** → Modern alternatives (Zustand, Server State)
3. **Static asset structure** → CDN approach better
4. **Hardcoded configurations** → Database-driven better
5. **Any "quick fix" code** → Technical debt trap

---

## 7. Risk Mitigation

### 🚨 High Risk Areas

1. **Payment Migration**
   - Risk: Losing transaction history or breaking subscriptions
   - Mitigation: Test mode first, parallel run, customer communication

2. **Customer Data Migration**
   - Risk: Data loss or corruption during transfer
   - Mitigation: Database backups, dry runs, validation scripts

3. **SEO Impact**
   - Risk: Losing search rankings during relaunch
   - Mitigation: 301 redirects, sitemap updates, gradual rollout

4. **Stripe Account Changes**
   - Risk: Multi-tenant requires Stripe Connect setup
   - Mitigation: Test with Stripe sandbox, gradual tenant migration

### ⚠️ Medium Risk Areas

1. Test coverage taking longer than estimated
2. Design inconsistencies between old/new
3. Content migration errors
4. Third-party integration changes (Stripe API updates)

---

## 8. Success Metrics

### Code Quality
- ✅ 80% test coverage minimum
- ✅ Zero TypeScript errors (strict mode)
- ✅ Lighthouse performance 90+
- ✅ Accessibility score 100
- ✅ Zero critical security vulnerabilities

### Business Metrics
- ✅ Multi-tenant working (2+ brands)
- ✅ Payment processing operational
- ✅ Customer signup/login working
- ✅ Product reviews functional
- ✅ Subscription billing active

### Migration Completeness
- ✅ All valuable content migrated
- ✅ All product images optimized and migrated
- ✅ All API endpoints rebuilt with tests
- ✅ All customer data safely transferred
- ✅ SEO metadata preserved

---

## 9. Resources Needed

### Development Tools
- Vitest + Testing Library (testing)
- Storybook (component documentation)
- Chromatic (visual regression testing)
- Stripe CLI (webhook testing)
- Supabase CLI (database management)

### Third-Party Services
- Supabase (database, auth, storage)
- Stripe (payments)
- Vercel (hosting)
- Cloudinary or Supabase Storage (media CDN)
- Sentry (error tracking)

### Documentation
- Atomic design system guide
- Multi-tenant architecture docs
- API endpoint documentation (OpenAPI)
- Testing guidelines
- Deployment runbook

---

## 10. Next Steps

### Immediate Actions (This Week)
1. ✅ Complete this migration plan
2. [ ] Set up new project structure
3. [ ] Configure testing environment
4. [ ] Create multi-tenant database schema
5. [ ] Start Phase 1: Build first atomic components with TDD

### Week 2
1. [ ] Continue atomic component library
2. [ ] Set up Storybook
3. [ ] Create first integration tests
4. [ ] Begin content extraction from old project

### Month 1 Goal
- Complete Phase 1 (atomic components + testing infrastructure)
- Have 20+ tested components ready
- Database schema finalized and deployed

---

## Conclusion

The old Eonlife project has **valuable content and features** but **poor technical foundation**. The migration strategy is:

1. **Extract** → Product data, content, assets, copy
2. **Rebuild** → All code with TDD, atomic design, multi-tenancy
3. **Enhance** → Modern architecture, better performance, scalability

**Do NOT copy code.** Use the old project as a **reference and content source**, but build the new platform **correctly from scratch**.

**Estimated Timeline:** 17 weeks (4+ months)
**Effort Level:** High (full rebuild)
**ROI:** Very High (sustainable, testable, multi-tenant platform)

---

**Last Updated:** 2025-11-19
**Status:** Ready for Phase 1 execution
