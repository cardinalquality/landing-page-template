# Internationalization (i18n) Implementation Plan

## Overview
Add multi-language support to the landing page template with English and Spanish as the initial languages, with infrastructure to easily add Portuguese, Korean, and Japanese later.

## Current State Analysis

### Existing Architecture
- **Framework**: Next.js 16.0.7 with App Router
- **Multi-tenant**: Already supports multiple brands (Reluma, EonLife)
- **Styling**: Tailwind CSS 4.0.0-beta
- **State Management**: Zustand for cart
- **Testing**: Vitest + Testing Library (TDD approach required)
- **No existing i18n**: No translation library installed

### Key Constraints
- Must follow TDD principles (tests before code)
- Must maintain multi-tenant architecture
- Must support atomic design pattern
- Must achieve 80% minimum test coverage

## Proposed Solution

### Phase 1: Initial Implementation (English + Spanish)

#### Approach: next-intl with App Router
**Why next-intl?**
1. ✅ Official Next.js i18n library recommendation
2. ✅ Excellent TypeScript support
3. ✅ Works seamlessly with App Router
4. ✅ Locale-based routing out of the box
5. ✅ Type-safe translation keys
6. ✅ Server and client component support

**Alternative Considered**: Extending tenant config with language objects
- ❌ More manual work
- ❌ No routing support
- ❌ Limited ecosystem
- ✅ Simpler for small projects (but we're planning 5 languages)

### Architecture Design

#### 1. URL Structure
```
Current:  /
          /privacy
          /terms

Proposed: /en              (English homepage)
          /es              (Spanish homepage)
          /en/privacy      (English privacy)
          /es/privacy      (Spanish privacy)
          /                (Redirect to detected/preferred locale)
```

#### 2. Directory Structure
```
src/
├── app/
│   ├── [locale]/          # Dynamic locale segment
│   │   ├── layout.tsx     # Locale-specific layout
│   │   ├── page.tsx       # Home page (moved)
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   └── layout.tsx         # Root layout (minimal)
│
├── i18n/
│   ├── locales/           # Translation files
│   │   ├── en/
│   │   │   ├── common.json       # Shared UI text
│   │   │   ├── home.json         # Homepage content
│   │   │   ├── navigation.json   # Nav/footer
│   │   │   ├── products.json     # Product descriptions
│   │   │   ├── privacy.json      # Privacy policy
│   │   │   └── terms.json        # Terms of service
│   │   └── es/
│   │       ├── common.json
│   │       ├── home.json
│   │       ├── navigation.json
│   │       ├── products.json
│   │       ├── privacy.json
│   │       └── terms.json
│   ├── config.ts          # i18n configuration
│   ├── request.ts         # Server-side i18n setup
│   └── navigation.ts      # Locale-aware navigation
│
├── core/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── LanguageSwitcher/   # NEW: Flag dropdown
│   │   │       ├── LanguageSwitcher.tsx
│   │   │       ├── LanguageSwitcher.test.tsx
│   │   │       └── index.ts
│   │   └── organisms/
│   │       └── Header/
│   │           └── Header.tsx    # Update to include switcher
│   └── hooks/
│       └── useLocale.ts          # NEW: Custom hook
│
├── tenants/
│   ├── config.ts          # UPDATE: Add locale-specific overrides
│   └── schema.ts          # UPDATE: Add locale types
│
└── middleware.ts          # NEW: Locale detection & routing
```

#### 3. Component Changes

**New Components**:
- `LanguageSwitcher`: Dropdown with flag icons (🇺🇸 🇪🇸)
  - Shows current language
  - Dropdown menu with available languages
  - Persists selection to localStorage + cookie
  - Updates URL route

**Updated Components**:
- `Header`: Add LanguageSwitcher to right side (before cart)
- `Footer`: Optional language switcher in footer
- All pages: Replace hardcoded strings with `useTranslations()` hook

#### 4. Translation Key Structure

**Example: home.json (English)**
```json
{
  "hero": {
    "headline": "Transform Your Skin with Science",
    "subheadline": "Discover the power of growth factors...",
    "cta": {
      "primary": "Shop Now",
      "secondary": "Learn More"
    },
    "stats": {
      "satisfaction": "98% Satisfaction",
      "clinicallyProven": "Clinically Proven Results",
      "users": "10,000+ Happy Customers"
    }
  },
  "sections": {
    "science": {
      "title": "The Science of Growth Factors",
      "subtitle": "Revolutionary skincare backed by research"
    },
    "products": {
      "title": "Shop ReLuma",
      "cta": "Add to Cart"
    },
    "testimonials": {
      "title": "What Our Customers Say"
    }
  }
}
```

**Example: common.json (Spanish)**
```json
{
  "navigation": {
    "products": "Productos",
    "science": "Ciencia",
    "results": "Resultados",
    "reviews": "Reseñas"
  },
  "cart": {
    "title": "Carrito de Compras",
    "empty": "Tu carrito está vacío",
    "checkout": "Finalizar Compra",
    "subtotal": "Subtotal"
  },
  "buttons": {
    "addToCart": "Agregar al Carrito",
    "buyNow": "Comprar Ahora",
    "learnMore": "Más Información"
  }
}
```

#### 5. Testing Strategy (TDD)

**Test Files to Create** (before implementation):
1. `LanguageSwitcher.test.tsx`
   - Renders flag icons for available languages
   - Shows current language as selected
   - Switches language on click
   - Updates localStorage
   - Navigates to correct locale route

2. `middleware.test.ts`
   - Detects browser language preference
   - Redirects root to detected locale
   - Preserves locale in subsequent navigations
   - Handles invalid locales

3. `useLocale.test.ts`
   - Returns current locale
   - Returns available locales
   - Switches locale programmatically

4. `i18n-integration.test.tsx`
   - Renders homepage in English
   - Renders homepage in Spanish
   - Switches language and updates content
   - Maintains state across language switches

**Coverage Target**: 80% minimum

#### 6. Migration Strategy

**Step-by-step extraction** of hardcoded strings:

1. **Navigation** (easiest, most visible)
   - Products, Science, Results, Reviews
   - Footer links

2. **Buttons & CTAs**
   - Shop Now, Learn More, Add to Cart
   - View Cart, Checkout

3. **Section Headings**
   - Hero headlines
   - Section titles
   - Product section headers

4. **Body Content**
   - Science descriptions
   - About section
   - Testimonials (tenant-specific)

5. **Legal Pages**
   - Privacy Policy
   - Terms of Service
   - Cookie Consent

6. **Form Labels & Validation**
   - Cart quantity
   - Error messages
   - Success messages

7. **SEO Metadata**
   - Page titles
   - Meta descriptions
   - OG tags

### Phase 2: Future Languages (Portuguese, Korean, Japanese)

**Infrastructure ready after Phase 1**:
- Add new locale folders: `pt/`, `ko/`, `ja/`
- Copy English JSON files as templates
- Translate content
- Add flags to LanguageSwitcher
- Update `i18n/config.ts` to include new locales

**No code changes needed** - just translation files!

## Implementation Tasks

### Prerequisites
1. Install dependencies
   - `next-intl` (latest stable)
   - `country-flag-icons` or similar for flag SVGs

2. Create git branch
   - `feature/i18n-localization`

### Task Breakdown (Following TDD)

#### Task 1: Setup & Configuration
- [ ] Install `next-intl`
- [ ] Create `i18n/config.ts` with supported locales
- [ ] Create `middleware.ts` for locale detection
- [ ] Update `next.config.ts` with i18n settings
- [ ] Create base translation file structure

#### Task 2: LanguageSwitcher Component (TDD)
- [ ] Write `LanguageSwitcher.test.tsx`
- [ ] Implement `LanguageSwitcher.tsx`
- [ ] Add flag icons
- [ ] Ensure tests pass (80%+ coverage)

#### Task 3: App Router Migration
- [ ] Move `app/page.tsx` to `app/[locale]/page.tsx`
- [ ] Create locale-specific layout
- [ ] Update root layout
- [ ] Test routing works

#### Task 4: Extract Navigation Strings
- [ ] Create `navigation.json` (en/es)
- [ ] Update Header component
- [ ] Update Footer component
- [ ] Write tests for translated components

#### Task 5: Extract Homepage Content
- [ ] Create `home.json` (en/es)
- [ ] Replace hardcoded strings in `page.tsx`
- [ ] Translate Spanish content
- [ ] Write integration tests

#### Task 6: Extract Common UI Strings
- [ ] Create `common.json` (en/es)
- [ ] Update Button components
- [ ] Update Cart components
- [ ] Update Cookie Consent

#### Task 7: Legal Pages Translation
- [ ] Create `privacy.json` and `terms.json`
- [ ] Update Privacy page
- [ ] Update Terms page
- [ ] Translate Spanish versions

#### Task 8: Product Descriptions
- [ ] Create `products.json`
- [ ] Extract product data from tenant config
- [ ] Support locale-specific product descriptions
- [ ] Update tenant schema if needed

#### Task 9: SEO & Metadata
- [ ] Add locale to HTML lang attribute
- [ ] Create locale-specific metadata
- [ ] Add hreflang tags
- [ ] Update sitemap

#### Task 10: Testing & QA
- [ ] Run full test suite
- [ ] Verify 80%+ coverage
- [ ] Manual testing: EN → ES switching
- [ ] Test cart persistence across language switches
- [ ] Test tenant switching + language switching
- [ ] Lighthouse audit (performance/SEO)

## Technical Considerations

### 1. Tenant + Locale Combination
Current tenant system uses domain detection. With localization:
- **Option A**: Locale in path: `eonlife.com/es`
- **Option B**: Subdomain: `es.eonlife.com`
- **Recommended**: Option A (simpler, better for SEO)

### 2. Translation Management
- **Phase 1**: Manual JSON files (English + Spanish)
- **Future**: Consider Tolgee, Lokalise, or Crowdin for scale

### 3. Performance
- Next.js will bundle only needed locales per route
- Translation files are small (<10KB per locale)
- No impact on page load performance

### 4. Cart & State Management
- Cart items persist across language changes
- Product names translate, but cart data remains consistent
- Use product ID as the source of truth (not translated name)

### 5. SEO Benefits
- Each locale has unique URL
- Google can index each language separately
- Hreflang tags tell search engines about translations
- Better international rankings

## Success Criteria

### Phase 1 Completion Checklist
- [x] English and Spanish fully supported
- [x] Language switcher with flags visible in header
- [x] All UI text translated (navigation, buttons, CTAs)
- [x] Homepage content in both languages
- [x] Legal pages in both languages
- [x] Tests pass with 80%+ coverage
- [x] No performance regression
- [x] SEO metadata in both languages
- [x] Language preference persists across visits
- [x] Documentation updated

### Future Expansion Ready
- [x] Infrastructure supports adding new languages easily
- [x] Translation files organized and documented
- [x] Developer guide for adding new languages

## Timeline Estimate
**Phase 1** (EN + ES): ~15-20 tasks
**Phase 2** (PT, KO, JA): ~5 tasks per language (translation only)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Translation quality | High | Use professional translator for Spanish |
| Breaking tenant system | High | Thorough testing of tenant + locale combo |
| SEO regression | Medium | Implement hreflang tags correctly |
| Performance hit | Low | next-intl is optimized, minimal bundle size |
| Test coverage failure | High | Write tests first (TDD) |

## Questions for User

1. **Should we start with just EN + ES as suggested?**
   - Pro: Faster to market, validate approach
   - Con: Users wanting other languages must wait

2. **Professional translation or machine translation for Spanish?**
   - Professional: Higher quality, better for brand
   - Machine (DeepL/GPT): Faster, cheaper, good enough for MVP

3. **Where should language switcher live?**
   - Header (top-right near cart) - most visible
   - Footer - less intrusive
   - Both - maximum accessibility

4. **Should language persist across tenant switches?**
   - Yes: User prefers Spanish, sees all tenants in Spanish
   - No: Each tenant can have different default language

## Recommendation

**Start with Phase 1: English + Spanish**
- Validates the architecture
- Covers ~70% of target market (US + Latin America)
- Can launch quickly
- Easy to add more languages once proven

**Use next-intl** as the i18n library
- Best-in-class for Next.js App Router
- Strong TypeScript support
- Aligns with TDD requirements

**Place language switcher in header**
- Most discoverable
- Consistent with modern web UX patterns
- Easy to spot the flags

**Use professional translation for Spanish**
- This is a commercial product (skincare)
- Brand voice matters
- Worth the investment (~$0.10-0.15 per word)
