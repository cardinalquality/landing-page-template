# E-Commerce Component Library Specification

> **Multi-tenant E-commerce Platform Component Library**
> Tech Stack: Next.js 16, TypeScript (strict), Tailwind v4, Vitest, Prisma, Supabase
> Design System: Atomic Design (Atoms → Molecules → Organisms → Templates)
> Testing: TDD Approach (80% minimum coverage)
> Accessibility: WCAG 2.1 AA compliance

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Multi-Tenant Theming](#multi-tenant-theming)
3. [Atoms](#atoms)
4. [Molecules](#molecules)
5. [Organisms](#organisms)
6. [Testing Guidelines](#testing-guidelines)

---

## Architecture Overview

### Design Principles

1. **Atomic Design**: Components build from simple to complex
2. **Multi-tenant**: All components support brand theming via `useTenant()` hook
3. **Accessibility First**: WCAG 2.1 AA compliance mandatory
4. **Type Safety**: TypeScript strict mode, no `any` types
5. **Test-Driven**: Write tests before implementation

### File Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── molecules/
│   └── organisms/
├── hooks/
│   └── useTenant.ts
└── types/
    └── components.ts
```

---

## Multi-Tenant Theming

### useTenant Hook

```typescript
interface TenantConfig {
  id: 'reluma' | 'eonlife';
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      error: string;
      success: string;
      warning: string;
      neutral: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    logo: {
      url: string;
      alt: string;
    };
    brandName: string;
  };
}

const useTenant = () => TenantConfig;
```

### Theming Strategy

- Components consume `useTenant()` for brand-specific styling
- Tailwind classes use CSS variables derived from tenant config
- No hardcoded brand values in components

---

# Atoms

## 1. Button

### Purpose
Primary interactive element for user actions (submit, navigate, trigger events).

### Props Interface

```typescript
interface ButtonProps {
  // Content
  children: React.ReactNode;

  // Variants
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Icon support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Behavior
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  // Styling
  fullWidth?: boolean;
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
}
```

### Variants & States

| Variant | Description | Use Case |
|---------|-------------|----------|
| `primary` | Brand primary color, high emphasis | Main CTA (Add to Cart, Checkout) |
| `secondary` | Brand secondary color, medium emphasis | Secondary actions (Continue Shopping) |
| `outline` | Border only, low emphasis | Filters, optional actions |
| `ghost` | No background, minimal emphasis | Menu items, close buttons |
| `danger` | Error color, destructive actions | Delete, Remove from Cart |

**Sizes:**
- `sm`: 32px height, 12px padding
- `md`: 40px height, 16px padding (default)
- `lg`: 48px height, 20px padding

**States:**
- Default
- Hover (darkens 10%)
- Focus (visible focus ring)
- Active (pressed state)
- Disabled (50% opacity, not interactive)
- Loading (spinner, disabled interaction)

### Accessibility Requirements

```typescript
// Required ARIA attributes
- role="button" (implicit on <button>)
- aria-label (when icon-only)
- aria-disabled="true" (when disabled)
- aria-busy="true" (when loading)

// Keyboard navigation
- Space/Enter: Trigger onClick
- Tab: Focus navigation
- Focus visible indicator (2px outline)

// Screen reader
- Announce loading state
- Descriptive labels for icon buttons
```

### Test Scenarios (TDD)

```typescript
describe('Button', () => {
  // Rendering
  test('renders with children text', () => {});
  test('renders with left icon', () => {});
  test('renders with right icon', () => {});
  test('renders full width when fullWidth prop is true', () => {});

  // Variants
  test('applies primary variant styles', () => {});
  test('applies secondary variant styles', () => {});
  test('applies outline variant styles', () => {});
  test('applies ghost variant styles', () => {});
  test('applies danger variant styles', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles (default)', () => {});
  test('applies large size styles', () => {});

  // States
  test('disables button when disabled prop is true', () => {});
  test('shows loading spinner when loading is true', () => {});
  test('prevents onClick when disabled', () => {});
  test('prevents onClick when loading', () => {});

  // Interactions
  test('calls onClick when clicked', () => {});
  test('calls onClick when Space key is pressed', () => {});
  test('calls onClick when Enter key is pressed', () => {});

  // Accessibility
  test('has accessible name from children', () => {});
  test('uses aria-label when provided', () => {});
  test('sets aria-disabled when disabled', () => {});
  test('sets aria-busy when loading', () => {});
  test('has visible focus indicator', () => {});
  test('has correct type attribute', () => {});

  // Multi-tenant
  test('applies Reluma primary color', () => {});
  test('applies Eonlife primary color', () => {});
  test('uses tenant theme for variants', () => {});
});
```

### Tenant Integration

```typescript
// Implementation pattern
const Button: React.FC<ButtonProps> = ({ variant = 'primary', ... }) => {
  const { theme } = useTenant();

  const variantStyles = {
    primary: `bg-[${theme.colors.primary}] text-white hover:opacity-90`,
    secondary: `bg-[${theme.colors.secondary}] text-white hover:opacity-90`,
    danger: `bg-[${theme.colors.error}] text-white hover:opacity-90`,
    // ...
  };

  return <button className={variantStyles[variant]}>...</button>;
};
```

---

## 2. Input

### Purpose
Text input field for user data entry (search, forms, checkout).

### Props Interface

```typescript
interface InputProps {
  // Value control
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Type
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

  // Variants
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';

  // State
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  success?: boolean;

  // Configuration
  placeholder?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;

  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Styling
  fullWidth?: boolean;
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;

  // Events
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
```

### Variants & States

**Variants:**
- `default`: Standard border, white background
- `filled`: Gray background, no border
- `flushed`: Bottom border only, minimal

**States:**
- Default
- Focus (brand color border, glow)
- Error (red border, error icon)
- Success (green border, checkmark icon)
- Disabled (gray, not interactive)
- ReadOnly (gray, focusable but not editable)

### Accessibility Requirements

```typescript
// Required ARIA attributes
- aria-label or associated <label>
- aria-invalid="true" (when error)
- aria-required="true" (when required)
- aria-describedby (error message ID)

// Keyboard navigation
- Tab: Focus input
- All standard text input behaviors
- Focus visible indicator

// Screen reader
- Label association (for attribute)
- Error announcements
- Placeholder as hint, not label
```

### Test Scenarios (TDD)

```typescript
describe('Input', () => {
  // Rendering
  test('renders input element', () => {});
  test('renders with placeholder', () => {});
  test('renders with left icon', () => {});
  test('renders with right icon', () => {});
  test('renders full width when fullWidth is true', () => {});

  // Value control
  test('renders with default value', () => {});
  test('renders with controlled value', () => {});
  test('calls onChange when value changes', () => {});

  // Types
  test('renders email input type', () => {});
  test('renders password input type', () => {});
  test('renders number input type', () => {});
  test('renders search input type', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies filled variant styles', () => {});
  test('applies flushed variant styles', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // States
  test('disables input when disabled is true', () => {});
  test('makes input readonly when readOnly is true', () => {});
  test('shows error state when error is true', () => {});
  test('shows success state when success is true', () => {});

  // Events
  test('calls onFocus when input is focused', () => {});
  test('calls onBlur when input loses focus', () => {});

  // Accessibility
  test('associates with label via id', () => {});
  test('uses aria-label when provided', () => {});
  test('sets aria-invalid when error is true', () => {});
  test('sets aria-required when required', () => {});
  test('sets aria-describedby for error messages', () => {});
  test('has visible focus indicator', () => {});

  // Multi-tenant
  test('applies Reluma focus color', () => {});
  test('applies Eonlife focus color', () => {});
});
```

### Tenant Integration

```typescript
const Input: React.FC<InputProps> = ({ error, ... }) => {
  const { theme } = useTenant();

  const focusStyles = `focus:border-[${theme.colors.primary}] focus:ring-[${theme.colors.primary}]`;
  const errorStyles = error ? `border-[${theme.colors.error}]` : '';

  return <input className={`${focusStyles} ${errorStyles}`} />;
};
```

---

## 3. Image

### Purpose
Optimized image display with lazy loading, fallback, and responsive sizing.

### Props Interface

```typescript
interface ImageProps {
  // Source
  src: string;
  alt: string; // REQUIRED for accessibility

  // Dimensions
  width?: number;
  height?: number;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';

  // Behavior
  loading?: 'lazy' | 'eager';
  priority?: boolean; // Next.js Image optimization

  // Fallback
  fallbackSrc?: string;
  onError?: () => void;

  // Object fit
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;

  // Styling
  rounded?: boolean;
  className?: string;

  // Accessibility
  ariaLabel?: string;
  role?: 'img' | 'presentation';
}
```

### Variants & States

**Aspect Ratios:**
- `1:1`: Square (product thumbnails)
- `4:3`: Standard (product details)
- `16:9`: Wide (banners)
- `3:2`: Portrait (lifestyle shots)

**Object Fit:**
- `cover`: Fill container, crop if needed (default)
- `contain`: Full image visible, may have letterboxing
- `fill`: Stretch to fill

**States:**
- Loading (skeleton/placeholder)
- Loaded
- Error (fallback image or icon)

### Accessibility Requirements

```typescript
// Required attributes
- alt text (descriptive, not "image")
- Empty alt="" for decorative images
- role="presentation" for decorative images

// Best practices
- Meaningful alt text describing content
- Don't use "image of" or "picture of"
- For product images: product name + key features
```

### Test Scenarios (TDD)

```typescript
describe('Image', () => {
  // Rendering
  test('renders img element with src', () => {});
  test('renders with alt text', () => {});
  test('renders with width and height', () => {});

  // Aspect ratios
  test('applies 1:1 aspect ratio styles', () => {});
  test('applies 4:3 aspect ratio styles', () => {});
  test('applies 16:9 aspect ratio styles', () => {});

  // Loading
  test('uses lazy loading by default', () => {});
  test('uses eager loading when priority is true', () => {});
  test('shows loading placeholder', () => {});

  // Error handling
  test('shows fallback image on error', () => {});
  test('calls onError callback when image fails', () => {});
  test('shows error icon when no fallback provided', () => {});

  // Object fit
  test('applies cover object-fit', () => {});
  test('applies contain object-fit', () => {});
  test('applies custom object-position', () => {});

  // Styling
  test('applies rounded corners when rounded is true', () => {});
  test('applies custom className', () => {});

  // Accessibility
  test('has required alt attribute', () => {});
  test('uses empty alt for decorative images', () => {});
  test('uses role="presentation" for decorative images', () => {});
  test('uses descriptive alt text for product images', () => {});

  // Multi-tenant
  test('uses Reluma fallback image', () => {});
  test('uses Eonlife fallback image', () => {});
});
```

### Tenant Integration

```typescript
const Image: React.FC<ImageProps> = ({ fallbackSrc, ... }) => {
  const { theme } = useTenant();
  const defaultFallback = fallbackSrc || theme.logo.url;

  return <img onError={() => setSrc(defaultFallback)} />;
};
```

---

## 4. Badge

### Purpose
Small status indicators (new, sale, stock status, categories).

### Props Interface

```typescript
interface BadgeProps {
  // Content
  children: React.ReactNode;

  // Variants
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

  // Size
  size?: 'sm' | 'md' | 'lg';

  // Style
  rounded?: boolean; // Pill shape
  outline?: boolean;

  // Icon
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
}
```

### Variants & States

**Variants:**
- `default`: Neutral gray
- `primary`: Brand primary color
- `secondary`: Brand secondary color
- `success`: Green (In Stock)
- `warning`: Orange (Low Stock)
- `error`: Red (Out of Stock)
- `info`: Blue (New)

**Sizes:**
- `sm`: 20px height, 10px text
- `md`: 24px height, 12px text
- `lg`: 28px height, 14px text

### Accessibility Requirements

```typescript
// Best practices
- Use semantic color + text (not color alone)
- aria-label for icon-only badges
- Sufficient contrast ratio (4.5:1 minimum)

// Screen reader
- Announce badge content
- Context provided by surrounding elements
```

### Test Scenarios (TDD)

```typescript
describe('Badge', () => {
  // Rendering
  test('renders with children text', () => {});
  test('renders with left icon', () => {});
  test('renders with right icon', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies primary variant styles', () => {});
  test('applies success variant styles', () => {});
  test('applies warning variant styles', () => {});
  test('applies error variant styles', () => {});
  test('applies info variant styles', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Styles
  test('applies rounded (pill) style', () => {});
  test('applies outline style', () => {});

  // Accessibility
  test('has accessible text content', () => {});
  test('uses aria-label for icon-only badges', () => {});
  test('has sufficient color contrast', () => {});

  // Multi-tenant
  test('applies Reluma primary color for primary variant', () => {});
  test('applies Eonlife primary color for primary variant', () => {});
});
```

### Tenant Integration

```typescript
const Badge: React.FC<BadgeProps> = ({ variant = 'default', ... }) => {
  const { theme } = useTenant();

  const variantStyles = {
    primary: `bg-[${theme.colors.primary}] text-white`,
    secondary: `bg-[${theme.colors.secondary}] text-white`,
    // ...
  };

  return <span className={variantStyles[variant]}>...</span>;
};
```

---

## 5. Price

### Purpose
Display product prices with currency formatting, discounts, and multi-currency support.

### Props Interface

```typescript
interface PriceProps {
  // Amount
  amount: number; // In cents/smallest unit

  // Currency
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  locale?: string; // e.g., 'en-US', 'en-GB'

  // Variants
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'sale' | 'original';

  // Sale/Discount
  originalPrice?: number; // Show strikethrough
  discountPercentage?: number; // Show badge

  // Styling
  showCurrency?: boolean; // Show currency symbol
  className?: string;

  // Accessibility
  ariaLabel?: string;
}
```

### Variants & States

**Variants:**
- `default`: Regular price (brand primary or neutral)
- `sale`: Discounted price (brand accent/error color)
- `original`: Strikethrough price (gray)

**Sizes:**
- `sm`: 14px
- `md`: 18px
- `lg`: 24px
- `xl`: 32px

### Accessibility Requirements

```typescript
// Screen reader
- Announce full price with currency
- Example: "Price: $29.99 USD"
- Sale price: "Sale price: $19.99, was $29.99, save 33%"

// Format
- Use proper currency formatting
- Include currency code for clarity
- aria-label for complete price information
```

### Test Scenarios (TDD)

```typescript
describe('Price', () => {
  // Rendering
  test('renders price with amount', () => {});
  test('formats price in USD', () => {});
  test('formats price in EUR', () => {});
  test('formats price in GBP', () => {});

  // Currency formatting
  test('converts cents to dollars correctly', () => {});
  test('shows currency symbol by default', () => {});
  test('hides currency symbol when showCurrency is false', () => {});
  test('uses correct locale formatting', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies sale variant styles', () => {});
  test('applies original variant styles', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});
  test('applies extra-large size styles', () => {});

  // Sale/Discount
  test('shows original price with strikethrough', () => {});
  test('calculates discount percentage', () => {});
  test('shows discount badge', () => {});
  test('applies sale color to discounted price', () => {});

  // Accessibility
  test('has accessible price announcement', () => {});
  test('announces sale price with original price', () => {});
  test('announces discount percentage', () => {});
  test('uses aria-label for complete price info', () => {});

  // Multi-tenant
  test('uses Reluma accent color for sale prices', () => {});
  test('uses Eonlife accent color for sale prices', () => {});
});
```

### Tenant Integration

```typescript
const Price: React.FC<PriceProps> = ({ variant, ... }) => {
  const { theme } = useTenant();

  const variantStyles = {
    default: `text-[${theme.colors.neutral}]`,
    sale: `text-[${theme.colors.accent}] font-bold`,
    original: 'text-gray-500 line-through',
  };

  return <span className={variantStyles[variant]}>...</span>;
};
```

---

## 6. Rating

### Purpose
Display and collect product ratings (stars, numeric scores).

### Props Interface

```typescript
interface RatingProps {
  // Value
  value: number; // 0-5 (supports decimals)
  maxRating?: number; // Default 5

  // Mode
  readOnly?: boolean; // Display only vs. interactive
  onChange?: (value: number) => void;

  // Display
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean; // Show numeric value
  reviewCount?: number; // Show "(123 reviews)"

  // Icons
  icon?: 'star' | 'heart' | 'thumb';
  emptyIcon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  halfIcon?: React.ReactNode;

  // Colors
  color?: string; // Default: gold
  emptyColor?: string; // Default: gray

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
}
```

### Variants & States

**Modes:**
- `readOnly`: Display rating (product listing)
- `interactive`: Allow rating selection (review form)

**Icon Types:**
- `star`: ★ (default)
- `heart`: ♥
- `thumb`: 👍

**States (Interactive):**
- Hover (preview selection)
- Focus (keyboard navigation)
- Selected

### Accessibility Requirements

```typescript
// Interactive mode
- role="radiogroup" or "slider"
- Each star: role="radio" or focusable button
- aria-label: "Rate this product"
- aria-valuenow, aria-valuemin, aria-valuemax

// Read-only mode
- aria-label: "Rated 4.5 out of 5 stars"
- Include review count in label

// Keyboard navigation
- Arrow keys: Navigate stars
- Enter/Space: Select rating
- Tab: Focus/Unfocus rating group
```

### Test Scenarios (TDD)

```typescript
describe('Rating', () => {
  // Rendering
  test('renders rating with value', () => {});
  test('renders 5 stars by default', () => {});
  test('renders custom max rating', () => {});
  test('shows numeric value when showValue is true', () => {});
  test('shows review count when provided', () => {});

  // Value display
  test('shows full stars for whole numbers', () => {});
  test('shows half stars for decimals', () => {});
  test('shows empty stars for remaining', () => {});
  test('handles 0 rating', () => {});
  test('handles 5 rating', () => {});
  test('handles 3.5 rating', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Interactive mode
  test('allows clicking stars to set rating', () => {});
  test('calls onChange with selected value', () => {});
  test('shows hover preview on star hover', () => {});
  test('allows keyboard navigation with arrow keys', () => {});
  test('allows selection with Enter/Space', () => {});

  // Read-only mode
  test('disables interaction when readOnly is true', () => {});
  test('does not call onChange in readOnly mode', () => {});

  // Icons
  test('uses star icon by default', () => {});
  test('uses custom filled icon when provided', () => {});
  test('uses custom empty icon when provided', () => {});
  test('uses custom half icon when provided', () => {});

  // Accessibility
  test('has accessible label in read-only mode', () => {});
  test('has accessible label in interactive mode', () => {});
  test('sets aria-valuenow to current value', () => {});
  test('includes review count in accessible label', () => {});
  test('has correct ARIA role', () => {});

  // Multi-tenant
  test('uses Reluma accent color for stars', () => {});
  test('uses Eonlife accent color for stars', () => {});
});
```

### Tenant Integration

```typescript
const Rating: React.FC<RatingProps> = ({ color, ... }) => {
  const { theme } = useTenant();
  const starColor = color || theme.colors.accent;

  return <div style={{ color: starColor }}>...</div>;
};
```

---

## 7. Checkbox

### Purpose
Boolean selection for filters, agreements, preferences.

### Props Interface

```typescript
interface CheckboxProps {
  // Value
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  // State
  disabled?: boolean;
  indeterminate?: boolean; // Partial selection (e.g., "select all")

  // Configuration
  name?: string;
  value?: string;
  id?: string;

  // Label
  children?: React.ReactNode; // Label content

  // Size
  size?: 'sm' | 'md' | 'lg';

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  required?: boolean;
}
```

### Variants & States

**States:**
- Unchecked
- Checked (checkmark icon)
- Indeterminate (dash icon)
- Disabled
- Focus (visible focus ring)
- Error (invalid selection)

**Sizes:**
- `sm`: 16px
- `md`: 20px (default)
- `lg`: 24px

### Accessibility Requirements

```typescript
// Required attributes
- role="checkbox" (implicit on input[type="checkbox"])
- aria-checked="true|false|mixed" (mixed for indeterminate)
- aria-label or associated <label>

// Keyboard navigation
- Space: Toggle checkbox
- Tab: Focus navigation
- Focus visible indicator

// Label association
- <label htmlFor={id}> or wrapping label
- Click label to toggle checkbox
```

### Test Scenarios (TDD)

```typescript
describe('Checkbox', () => {
  // Rendering
  test('renders checkbox input', () => {});
  test('renders with label', () => {});
  test('renders unchecked by default', () => {});

  // Value control
  test('renders checked when checked is true', () => {});
  test('renders with defaultChecked', () => {});
  test('calls onChange when toggled', () => {});
  test('passes checked state to onChange', () => {});

  // States
  test('disables checkbox when disabled is true', () => {});
  test('shows indeterminate state', () => {});
  test('prevents onChange when disabled', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Interaction
  test('toggles checked state on click', () => {});
  test('toggles checked state on Space key', () => {});
  test('toggles when label is clicked', () => {});

  // Accessibility
  test('associates with label via id', () => {});
  test('uses aria-label when provided', () => {});
  test('sets aria-checked attribute', () => {});
  test('sets aria-checked to "mixed" when indeterminate', () => {});
  test('has visible focus indicator', () => {});
  test('sets aria-invalid when invalid', () => {});

  // Multi-tenant
  test('uses Reluma primary color when checked', () => {});
  test('uses Eonlife primary color when checked', () => {});
  test('uses tenant theme for focus ring', () => {});
});
```

### Tenant Integration

```typescript
const Checkbox: React.FC<CheckboxProps> = ({ checked, ... }) => {
  const { theme } = useTenant();

  const checkedStyles = checked
    ? `bg-[${theme.colors.primary}] border-[${theme.colors.primary}]`
    : 'bg-white border-gray-300';

  return <input type="checkbox" className={checkedStyles} />;
};
```

---

## 8. Radio

### Purpose
Single selection from multiple options (payment method, shipping).

### Props Interface

```typescript
interface RadioProps {
  // Value
  checked?: boolean;
  value: string; // Required for radio groups
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // State
  disabled?: boolean;

  // Configuration
  name: string; // Required for grouping
  id?: string;

  // Label
  children?: React.ReactNode;

  // Size
  size?: 'sm' | 'md' | 'lg';

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

### RadioGroup Props

```typescript
interface RadioGroupProps {
  // Value control
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  // Configuration
  name: string;

  // Layout
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;

  // Children
  children: React.ReactNode; // Radio components

  // Accessibility
  ariaLabel?: string;
  ariaLabelledBy?: string;
}
```

### Variants & States

**States:**
- Unselected
- Selected (filled circle)
- Disabled
- Focus (visible focus ring)

**Sizes:**
- `sm`: 16px
- `md`: 20px (default)
- `lg`: 24px

### Accessibility Requirements

```typescript
// RadioGroup
- role="radiogroup"
- aria-label or aria-labelledby
- Manages focus within group

// Radio
- role="radio" (implicit on input[type="radio"])
- aria-checked="true|false"
- Label association

// Keyboard navigation
- Arrow keys: Navigate within group (circular)
- Space: Select focused radio
- Tab: Enter/Exit group
```

### Test Scenarios (TDD)

```typescript
describe('Radio', () => {
  // Rendering
  test('renders radio input', () => {});
  test('renders with label', () => {});
  test('renders unselected by default', () => {});

  // Value control
  test('renders selected when checked is true', () => {});
  test('calls onChange when selected', () => {});

  // States
  test('disables radio when disabled is true', () => {});
  test('prevents onChange when disabled', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Interaction
  test('selects radio on click', () => {});
  test('selects radio on Space key', () => {});
  test('toggles when label is clicked', () => {});

  // Accessibility
  test('associates with label via id', () => {});
  test('uses aria-label when provided', () => {});
  test('sets aria-checked attribute', () => {});
  test('has visible focus indicator', () => {});

  // Multi-tenant
  test('uses Reluma primary color when selected', () => {});
  test('uses Eonlife primary color when selected', () => {});
});

describe('RadioGroup', () => {
  // Rendering
  test('renders radio group', () => {});
  test('renders children radios', () => {});

  // Value control
  test('selects radio with defaultValue', () => {});
  test('selects radio with controlled value', () => {});
  test('calls onChange with selected value', () => {});
  test('only allows one selection at a time', () => {});

  // Layout
  test('arranges radios vertically by default', () => {});
  test('arranges radios horizontally when direction is horizontal', () => {});
  test('applies correct spacing', () => {});

  // States
  test('disables all radios when disabled is true', () => {});

  // Keyboard navigation
  test('navigates radios with arrow keys', () => {});
  test('wraps navigation at ends (circular)', () => {});
  test('selects radio on arrow key navigation', () => {});
  test('enters group with Tab', () => {});
  test('exits group with Tab', () => {});

  // Accessibility
  test('has role="radiogroup"', () => {});
  test('has accessible name', () => {});
  test('manages focus within group', () => {});
});
```

### Tenant Integration

```typescript
const Radio: React.FC<RadioProps> = ({ checked, ... }) => {
  const { theme } = useTenant();

  const selectedStyles = checked
    ? `border-[${theme.colors.primary}] after:bg-[${theme.colors.primary}]`
    : 'border-gray-300';

  return <input type="radio" className={selectedStyles} />;
};
```

---

## 9. Link

### Purpose
Navigation and external links with proper semantics and accessibility.

### Props Interface

```typescript
interface LinkProps {
  // Navigation
  href: string;

  // Content
  children: React.ReactNode;

  // Behavior
  external?: boolean; // Open in new tab
  download?: boolean;

  // Variants
  variant?: 'default' | 'primary' | 'muted' | 'unstyled';
  underline?: 'none' | 'hover' | 'always';

  // State
  disabled?: boolean;

  // Events
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}
```

### Variants & States

**Variants:**
- `default`: Underlined, brand color
- `primary`: Bold brand color, no underline
- `muted`: Gray, subtle
- `unstyled`: Inherits from parent

**Underline:**
- `none`: No underline
- `hover`: Underline on hover (default)
- `always`: Always underlined

**States:**
- Default
- Hover
- Focus (visible focus ring)
- Active (pressed)
- Visited (different color)
- Disabled

### Accessibility Requirements

```typescript
// External links
- rel="noopener noreferrer" (security)
- aria-label: "Opens in new tab"
- Visual indicator (icon)

// Current page
- aria-current="page"
- Visual indicator

// Keyboard navigation
- Tab: Focus navigation
- Enter: Follow link
- Focus visible indicator

// Screen reader
- Descriptive link text (not "click here")
- Announce external links
```

### Test Scenarios (TDD)

```typescript
describe('Link', () => {
  // Rendering
  test('renders anchor element', () => {});
  test('renders with href', () => {});
  test('renders children content', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies primary variant styles', () => {});
  test('applies muted variant styles', () => {});
  test('applies unstyled variant styles', () => {});

  // Underline
  test('shows underline on hover by default', () => {});
  test('never shows underline when underline is "none"', () => {});
  test('always shows underline when underline is "always"', () => {});

  // External links
  test('opens in new tab when external is true', () => {});
  test('adds rel="noopener noreferrer" for external links', () => {});
  test('shows external link icon', () => {});

  // States
  test('prevents navigation when disabled', () => {});
  test('applies disabled styles', () => {});

  // Interaction
  test('calls onClick when clicked', () => {});
  test('follows link on Enter key', () => {});

  // Accessibility
  test('has accessible link text', () => {});
  test('uses aria-label when provided', () => {});
  test('sets aria-current for current page', () => {});
  test('has visible focus indicator', () => {});
  test('announces external links to screen readers', () => {});

  // Multi-tenant
  test('uses Reluma primary color for primary variant', () => {});
  test('uses Eonlife primary color for primary variant', () => {});
  test('uses tenant theme for visited state', () => {});
});
```

### Tenant Integration

```typescript
const Link: React.FC<LinkProps> = ({ variant, ... }) => {
  const { theme } = useTenant();

  const variantStyles = {
    default: `text-[${theme.colors.primary}] hover:underline`,
    primary: `text-[${theme.colors.primary}] font-semibold`,
    muted: 'text-gray-600 hover:text-gray-800',
  };

  return <a className={variantStyles[variant]}>...</a>;
};
```

---

## 10. Icon

### Purpose
Scalable vector icons for UI elements (search, cart, menu).

### Props Interface

```typescript
interface IconProps {
  // Icon name
  name: string; // e.g., 'search', 'cart', 'user', 'heart'

  // Size
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number; // Custom size in px

  // Color
  color?: string;

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
  ariaHidden?: boolean; // True if decorative
  role?: 'img' | 'presentation';
}
```

### Icon Library

**Common E-commerce Icons:**
- Navigation: `menu`, `close`, `arrow-left`, `arrow-right`, `chevron-down`
- Shopping: `cart`, `bag`, `heart`, `search`, `filter`
- User: `user`, `login`, `logout`, `account`
- Product: `star`, `star-half`, `star-empty`, `zoom-in`, `zoom-out`
- Actions: `check`, `plus`, `minus`, `trash`, `edit`, `share`
- Status: `info`, `warning`, `error`, `success`

**Sizes:**
- `xs`: 12px
- `sm`: 16px
- `md`: 20px (default)
- `lg`: 24px
- `xl`: 32px

### Accessibility Requirements

```typescript
// Decorative icons (with text)
- aria-hidden="true"
- role="presentation"

// Meaningful icons (standalone)
- aria-label="Descriptive label"
- role="img"

// Icon buttons
- Wrap in button with aria-label
```

### Test Scenarios (TDD)

```typescript
describe('Icon', () => {
  // Rendering
  test('renders SVG icon', () => {});
  test('renders correct icon by name', () => {});
  test('renders all supported icons', () => {});

  // Sizes
  test('applies extra-small size', () => {});
  test('applies small size', () => {});
  test('applies medium size (default)', () => {});
  test('applies large size', () => {});
  test('applies extra-large size', () => {});
  test('applies custom numeric size', () => {});

  // Color
  test('applies custom color', () => {});
  test('inherits color from parent by default', () => {});

  // Accessibility
  test('is hidden from screen readers when decorative', () => {});
  test('has aria-label for meaningful icons', () => {});
  test('has role="img" for meaningful icons', () => {});
  test('has role="presentation" for decorative icons', () => {});

  // Multi-tenant
  test('uses Reluma primary color when color="primary"', () => {});
  test('uses Eonlife primary color when color="primary"', () => {});
});
```

### Tenant Integration

```typescript
const Icon: React.FC<IconProps> = ({ color, ... }) => {
  const { theme } = useTenant();

  const colorMap: Record<string, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    accent: theme.colors.accent,
  };

  const iconColor = colorMap[color] || color || 'currentColor';

  return <svg fill={iconColor}>...</svg>;
};
```

---

# Molecules

## 1. ProductCard

### Purpose
Display product summary in grid/list views (image, name, price, rating, CTA).

### Props Interface

```typescript
interface ProductCardProps {
  // Product data
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number;
    currency: string;
    rating?: number;
    reviewCount?: number;
    badges?: Array<{ text: string; variant: BadgeProps['variant'] }>;
    inStock: boolean;
  };

  // Variant
  variant?: 'default' | 'compact' | 'featured';

  // Features
  showQuickAdd?: boolean; // Quick "Add to Cart" button
  showWishlist?: boolean; // Heart icon
  showCompare?: boolean; // Compare checkbox

  // Events
  onAddToCart?: (productId: string) => void;
  onWishlist?: (productId: string) => void;
  onCompare?: (productId: string, checked: boolean) => void;
  onClick?: (product: ProductCardProps['product']) => void;

  // Loading
  loading?: boolean; // Skeleton state

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `default`: Standard card (256px width)
- `compact`: Smaller card (200px width)
- `featured`: Large hero card (400px width)

**States:**
- Loading (skeleton)
- Default
- Hover (show quick actions)
- Out of stock (grayed out)

### Accessibility Requirements

```typescript
// Structure
- <article> element for semantic HTML
- Accessible product name (h3)
- Link to product detail page

// Interactive elements
- "Add to Cart" button with aria-label
- Wishlist toggle with aria-label
- Image with descriptive alt text

// Keyboard navigation
- Tab through interactive elements
- Enter/Space on focused button
```

### Test Scenarios (TDD)

```typescript
describe('ProductCard', () => {
  // Rendering
  test('renders product card', () => {});
  test('renders product image', () => {});
  test('renders product name', () => {});
  test('renders product price', () => {});
  test('renders badges when provided', () => {});
  test('renders rating when provided', () => {});
  test('renders review count', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies compact variant styles', () => {});
  test('applies featured variant styles', () => {});

  // Sale pricing
  test('shows original price when discounted', () => {});
  test('shows sale badge when discounted', () => {});
  test('calculates discount percentage', () => {});

  // Features
  test('shows quick add button when showQuickAdd is true', () => {});
  test('shows wishlist icon when showWishlist is true', () => {});
  test('shows compare checkbox when showCompare is true', () => {});
  test('hides features when flags are false', () => {});

  // Stock status
  test('shows out of stock badge when inStock is false', () => {});
  test('disables add to cart when out of stock', () => {});
  test('applies out of stock styling', () => {});

  // Interactions
  test('calls onAddToCart when quick add is clicked', () => {});
  test('calls onWishlist when heart icon is clicked', () => {});
  test('calls onCompare when compare checkbox is toggled', () => {});
  test('calls onClick when card is clicked', () => {});
  test('navigates to product page when card is clicked', () => {});

  // Hover state
  test('shows quick actions on hover', () => {});
  test('scales image slightly on hover', () => {});

  // Loading state
  test('shows skeleton when loading is true', () => {});
  test('hides content when loading', () => {});

  // Accessibility
  test('uses article element for semantic HTML', () => {});
  test('has accessible product name heading', () => {});
  test('has descriptive image alt text', () => {});
  test('has accessible button labels', () => {});
  test('can navigate with keyboard', () => {});

  // Multi-tenant
  test('uses Reluma theme colors', () => {});
  test('uses Eonlife theme colors', () => {});
  test('applies tenant-specific badges', () => {});
});
```

### Tenant Integration

```typescript
const ProductCard: React.FC<ProductCardProps> = ({ product, ... }) => {
  const { theme } = useTenant();

  return (
    <article className={`border-2 hover:border-[${theme.colors.primary}]`}>
      <Image src={product.image} alt={product.name} />
      <Badge variant="primary">{product.badges[0].text}</Badge>
      <h3>{product.name}</h3>
      <Price amount={product.price} currency={product.currency} />
      <Button variant="primary" onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </Button>
    </article>
  );
};
```

---

## 2. SearchBar

### Purpose
Product search with autocomplete, suggestions, and keyboard navigation.

### Props Interface

```typescript
interface SearchBarProps {
  // Value control
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;

  // Autocomplete
  suggestions?: Array<{
    id: string;
    text: string;
    type: 'product' | 'category' | 'query';
    image?: string;
  }>;
  showSuggestions?: boolean;
  onSuggestionClick?: (suggestion: SearchBarProps['suggestions'][0]) => void;

  // Configuration
  placeholder?: string;
  minQueryLength?: number; // Minimum chars for suggestions
  maxSuggestions?: number;

  // Variant
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';

  // Features
  showIcon?: boolean;
  showClearButton?: boolean;
  showSearchButton?: boolean;

  // State
  loading?: boolean; // Loading suggestions

  // Styling
  fullWidth?: boolean;
  className?: string;

  // Accessibility
  ariaLabel?: string;
}
```

### Variants & States

**Variants:**
- `default`: White background, border
- `filled`: Gray background, no border
- `outline`: Border only, transparent background

**States:**
- Empty
- Typing (loading suggestions)
- Suggestions visible
- No results
- Focus

### Accessibility Requirements

```typescript
// ARIA attributes
- role="combobox"
- aria-autocomplete="list"
- aria-expanded (when suggestions visible)
- aria-controls (suggestions list ID)
- aria-activedescendant (focused suggestion)

// Suggestions list
- role="listbox"
- Each suggestion: role="option"

// Keyboard navigation
- Down/Up: Navigate suggestions
- Enter: Select suggestion or search
- Escape: Close suggestions
- Tab: Exit search
```

### Test Scenarios (TDD)

```typescript
describe('SearchBar', () => {
  // Rendering
  test('renders search input', () => {});
  test('renders with placeholder', () => {});
  test('renders search icon when showIcon is true', () => {});
  test('renders search button when showSearchButton is true', () => {});

  // Value control
  test('renders with default value', () => {});
  test('renders with controlled value', () => {});
  test('calls onChange when value changes', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies filled variant styles', () => {});
  test('applies outline variant styles', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Suggestions
  test('shows suggestions when available', () => {});
  test('hides suggestions when showSuggestions is false', () => {});
  test('only shows suggestions after min query length', () => {});
  test('limits suggestions to max count', () => {});
  test('groups suggestions by type', () => {});
  test('highlights matching text in suggestions', () => {});

  // Clear button
  test('shows clear button when value is not empty', () => {});
  test('clears input when clear button is clicked', () => {});

  // Search
  test('calls onSearch when Enter is pressed', () => {});
  test('calls onSearch when search button is clicked', () => {});
  test('calls onSuggestionClick when suggestion is selected', () => {});

  // Loading state
  test('shows loading indicator when loading is true', () => {});

  // Keyboard navigation
  test('navigates suggestions with Down arrow', () => {});
  test('navigates suggestions with Up arrow', () => {});
  test('selects suggestion with Enter', () => {});
  test('closes suggestions with Escape', () => {});
  test('wraps navigation at ends', () => {});

  // Accessibility
  test('has role="combobox"', () => {});
  test('sets aria-expanded when suggestions visible', () => {});
  test('sets aria-activedescendant for focused suggestion', () => {});
  test('suggestions list has role="listbox"', () => {});
  test('each suggestion has role="option"', () => {});
  test('has accessible label', () => {});

  // Multi-tenant
  test('uses Reluma primary color for focus state', () => {});
  test('uses Eonlife primary color for focus state', () => {});
});
```

### Tenant Integration

```typescript
const SearchBar: React.FC<SearchBarProps> = ({ ... }) => {
  const { theme } = useTenant();

  return (
    <div className="relative">
      <Input
        type="search"
        leftIcon={<Icon name="search" color={theme.colors.primary} />}
        onChange={handleChange}
      />
      {showSuggestions && (
        <ul role="listbox" className={`border-[${theme.colors.primary}]`}>
          {suggestions.map(s => (
            <li role="option">{s.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

---

## 3. CartItem

### Purpose
Display cart item with image, details, quantity selector, remove button.

### Props Interface

```typescript
interface CartItemProps {
  // Item data
  item: {
    id: string;
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    currency: string;
    quantity: number;
    maxQuantity?: number; // Stock limit
    variant?: {
      size?: string;
      color?: string;
      [key: string]: any;
    };
  };

  // Features
  editable?: boolean; // Can change quantity
  removable?: boolean; // Can remove from cart

  // Events
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  onClick?: (item: CartItemProps['item']) => void;

  // Variant
  variant?: 'default' | 'compact';

  // State
  updating?: boolean; // Updating quantity

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `default`: Full details, large image
- `compact`: Smaller image, minimal details

**States:**
- Default
- Updating (loading spinner on quantity)
- Out of stock
- Low stock warning

### Accessibility Requirements

```typescript
// Structure
- <article> or <li> for semantic HTML
- Accessible product name
- Clear quantity label

// Quantity selector
- aria-label: "Quantity for [product name]"
- Min/max values announced
- Current quantity announced

// Remove button
- aria-label: "Remove [product name] from cart"

// Keyboard navigation
- Tab through all interactive elements
```

### Test Scenarios (TDD)

```typescript
describe('CartItem', () => {
  // Rendering
  test('renders cart item', () => {});
  test('renders product image', () => {});
  test('renders product name', () => {});
  test('renders product price', () => {});
  test('renders quantity', () => {});
  test('renders line total (price × quantity)', () => {});
  test('renders variant details when provided', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies compact variant styles', () => {});

  // Quantity selector
  test('shows quantity selector when editable is true', () => {});
  test('shows static quantity when editable is false', () => {});
  test('increments quantity when plus button is clicked', () => {});
  test('decrements quantity when minus button is clicked', () => {});
  test('calls onQuantityChange with new quantity', () => {});
  test('prevents quantity below 1', () => {});
  test('prevents quantity above maxQuantity', () => {});
  test('disables minus button at minimum', () => {});
  test('disables plus button at maximum', () => {});

  // Remove button
  test('shows remove button when removable is true', () => {});
  test('hides remove button when removable is false', () => {});
  test('calls onRemove when remove button is clicked', () => {});
  test('shows confirmation dialog before removing', () => {});

  // Updating state
  test('shows loading spinner when updating is true', () => {});
  test('disables quantity controls when updating', () => {});

  // Stock warnings
  test('shows low stock warning when quantity near max', () => {});
  test('shows out of stock message when maxQuantity is 0', () => {});

  // Accessibility
  test('uses semantic HTML element', () => {});
  test('has accessible product name', () => {});
  test('quantity selector has accessible label', () => {});
  test('remove button has accessible label', () => {});
  test('announces quantity changes to screen readers', () => {});

  // Multi-tenant
  test('uses Reluma theme colors', () => {});
  test('uses Eonlife theme colors', () => {});
});
```

### Tenant Integration

```typescript
const CartItem: React.FC<CartItemProps> = ({ item, ... }) => {
  const { theme } = useTenant();

  return (
    <article className="border-b">
      <Image src={item.image} alt={item.name} />
      <div>
        <h3>{item.name}</h3>
        <Price amount={item.price} currency={item.currency} />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            <Icon name="minus" />
          </Button>
          <span className={`text-[${theme.colors.primary}]`}>{item.quantity}</span>
          <Button size="sm" variant="outline">
            <Icon name="plus" />
          </Button>
        </div>
      </div>
    </article>
  );
};
```

---

## 4. FormField

### Purpose
Form input wrapper with label, error message, helper text, validation.

### Props Interface

```typescript
interface FormFieldProps {
  // Input props
  children: React.ReactElement; // Input, Textarea, Select, etc.

  // Labels
  label?: string;
  helperText?: string; // Additional guidance
  errorMessage?: string;

  // State
  required?: boolean;
  optional?: boolean; // Show "(optional)" label

  // Validation
  error?: boolean;
  success?: boolean;

  // Layout
  layout?: 'vertical' | 'horizontal';

  // Styling
  className?: string;

  // Accessibility
  id?: string; // Links label to input
  describedById?: string;
}
```

### Variants & States

**Layout:**
- `vertical`: Label on top (default, mobile-friendly)
- `horizontal`: Label on left (desktop forms)

**States:**
- Default
- Focus (highlight field)
- Error (red border, error icon, message)
- Success (green border, checkmark)
- Disabled

### Accessibility Requirements

```typescript
// Label association
- <label htmlFor={inputId}>
- Required inputs marked visually and with aria-required

// Error messages
- aria-describedby links to error message ID
- aria-invalid="true" on input
- Error announced on change

// Helper text
- aria-describedby includes helper text ID
- Visually distinct from error

// Required fields
- Visual indicator (asterisk)
- aria-required="true"
```

### Test Scenarios (TDD)

```typescript
describe('FormField', () => {
  // Rendering
  test('renders form field', () => {});
  test('renders label', () => {});
  test('renders helper text', () => {});
  test('renders error message', () => {});
  test('renders required indicator when required is true', () => {});
  test('renders optional label when optional is true', () => {});
  test('renders child input component', () => {});

  // Layout
  test('applies vertical layout by default', () => {});
  test('applies horizontal layout', () => {});

  // States
  test('shows error state when error is true', () => {});
  test('shows success state when success is true', () => {});
  test('applies error styles to child input', () => {});
  test('applies success styles to child input', () => {});

  // Error messages
  test('shows error message when provided', () => {});
  test('hides error message when error is false', () => {});
  test('hides helper text when error message is shown', () => {});

  // Accessibility
  test('associates label with input via htmlFor', () => {});
  test('links error message with aria-describedby', () => {});
  test('links helper text with aria-describedby', () => {});
  test('sets aria-invalid on input when error', () => {});
  test('sets aria-required on input when required', () => {});
  test('generates unique IDs for inputs', () => {});

  // Multi-tenant
  test('uses Reluma error color', () => {});
  test('uses Eonlife error color', () => {});
  test('uses tenant theme for success state', () => {});
});
```

### Tenant Integration

```typescript
const FormField: React.FC<FormFieldProps> = ({ error, children, ... }) => {
  const { theme } = useTenant();

  const clonedChild = React.cloneElement(children, {
    error,
    id: fieldId,
    'aria-describedby': describedBy,
    'aria-invalid': error,
    'aria-required': required,
  });

  return (
    <div>
      <label htmlFor={fieldId} className={required ? `after:text-[${theme.colors.error}]` : ''}>
        {label} {required && <span aria-label="required">*</span>}
      </label>
      {clonedChild}
      {error && <p className={`text-[${theme.colors.error}]`}>{errorMessage}</p>}
    </div>
  );
};
```

---

## 5. Breadcrumb

### Purpose
Navigation trail showing current page location in site hierarchy.

### Props Interface

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string; // No href = current page
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  // Items
  items: BreadcrumbItem[];

  // Separator
  separator?: React.ReactNode; // Default: "/"

  // Features
  showHome?: boolean; // Add home icon as first item
  maxItems?: number; // Collapse middle items

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string; // Default: "Breadcrumb"
}
```

### Variants & States

**Separator Options:**
- `/` (default)
- `>`
- `→`
- Custom icon

**Collapsed:**
- Show first, last, and ellipsis for middle items

### Accessibility Requirements

```typescript
// Structure
- <nav aria-label="Breadcrumb">
- <ol> for ordered list
- <li> for each item

// Current page
- aria-current="page" on last item
- No link for current page

// Screen reader
- Announce navigation trail
- Clear separator between items
```

### Test Scenarios (TDD)

```typescript
describe('Breadcrumb', () => {
  // Rendering
  test('renders breadcrumb navigation', () => {});
  test('renders all breadcrumb items', () => {});
  test('renders separators between items', () => {});
  test('renders custom separator', () => {});

  // Home link
  test('shows home icon when showHome is true', () => {});
  test('links home icon to root', () => {});
  test('hides home icon when showHome is false', () => {});

  // Items
  test('renders links for non-current items', () => {});
  test('renders plain text for current item', () => {});
  test('renders icons when provided', () => {});

  // Collapse
  test('collapses middle items when exceeds maxItems', () => {});
  test('shows first and last items when collapsed', () => {});
  test('shows ellipsis for collapsed items', () => {});
  test('expands collapsed items on click', () => {});

  // Accessibility
  test('uses nav element with aria-label', () => {});
  test('uses ordered list structure', () => {});
  test('sets aria-current="page" on current item', () => {});
  test('current item is not a link', () => {});
  test('has accessible separator', () => {});

  // Multi-tenant
  test('uses Reluma primary color for links', () => {});
  test('uses Eonlife primary color for links', () => {});
  test('uses tenant logo for home icon', () => {});
});
```

### Tenant Integration

```typescript
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, ... }) => {
  const { theme } = useTenant();

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {showHome && (
          <li>
            <Link href="/">
              <Icon name="home" color={theme.colors.primary} />
            </Link>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link href={item.href} className={`text-[${theme.colors.primary}]`}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
```

---

## 6. Pagination

### Purpose
Navigate between pages of product listings or search results.

### Props Interface

```typescript
interface PaginationProps {
  // Pagination state
  currentPage: number;
  totalPages: number;

  // Events
  onPageChange: (page: number) => void;

  // Configuration
  siblingCount?: number; // Pages shown around current (default: 1)
  showFirstLast?: boolean; // First/Last page buttons
  showPrevNext?: boolean; // Previous/Next buttons (default: true)

  // Variant
  variant?: 'default' | 'compact' | 'simple';
  size?: 'sm' | 'md' | 'lg';

  // Styling
  className?: string;

  // Accessibility
  ariaLabel?: string; // Default: "Pagination"
}
```

### Variants & States

**Variants:**
- `default`: Full pagination with numbers
- `compact`: Dots for overflow pages
- `simple`: Previous/Next only

**States:**
- Current page (highlighted)
- Disabled (at boundaries)
- Hover

### Accessibility Requirements

```typescript
// Structure
- <nav aria-label="Pagination">
- <ul> for page list

// Buttons
- aria-current="page" on current page
- aria-label for icon-only buttons
- Disabled buttons: aria-disabled="true"

// Keyboard navigation
- Tab through page buttons
- Enter/Space to navigate
```

### Test Scenarios (TDD)

```typescript
describe('Pagination', () => {
  // Rendering
  test('renders pagination navigation', () => {});
  test('renders current page', () => {});
  test('renders total pages', () => {});
  test('renders page numbers', () => {});

  // Variants
  test('applies default variant with page numbers', () => {});
  test('applies compact variant with dots', () => {});
  test('applies simple variant with prev/next only', () => {});

  // Sizes
  test('applies small size styles', () => {});
  test('applies medium size styles', () => {});
  test('applies large size styles', () => {});

  // Navigation buttons
  test('shows previous button when showPrevNext is true', () => {});
  test('shows next button when showPrevNext is true', () => {});
  test('shows first page button when showFirstLast is true', () => {});
  test('shows last page button when showFirstLast is true', () => {});

  // Page range
  test('shows sibling pages around current page', () => {});
  test('shows ellipsis for skipped pages', () => {});
  test('adjusts range at boundaries', () => {});

  // Interactions
  test('calls onPageChange when page is clicked', () => {});
  test('calls onPageChange with previous page', () => {});
  test('calls onPageChange with next page', () => {});
  test('calls onPageChange with first page', () => {});
  test('calls onPageChange with last page', () => {});

  // States
  test('highlights current page', () => {});
  test('disables previous button on first page', () => {});
  test('disables next button on last page', () => {});
  test('disables first button on first page', () => {});
  test('disables last button on last page', () => {});

  // Accessibility
  test('uses nav element with aria-label', () => {});
  test('sets aria-current on current page', () => {});
  test('has accessible labels for icon buttons', () => {});
  test('sets aria-disabled on disabled buttons', () => {});
  test('can navigate with keyboard', () => {});

  // Multi-tenant
  test('uses Reluma primary color for current page', () => {});
  test('uses Eonlife primary color for current page', () => {});
});
```

### Tenant Integration

```typescript
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, ... }) => {
  const { theme } = useTenant();

  const pageNumbers = generatePageNumbers(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination">
      <ul className="flex gap-2">
        {pageNumbers.map((page, index) => (
          <li key={index}>
            <Button
              variant={page === currentPage ? 'primary' : 'outline'}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={page === currentPage ? `bg-[${theme.colors.primary}]` : ''}
            >
              {page}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

---

# Organisms

## 1. ProductGrid

### Purpose
Responsive grid layout of product cards with filtering, sorting, loading states.

### Props Interface

```typescript
interface ProductGridProps {
  // Products
  products: Array<ProductCardProps['product']>;

  // Layout
  columns?: {
    mobile?: number; // Default: 1
    tablet?: number; // Default: 2
    desktop?: number; // Default: 3
    wide?: number; // Default: 4
  };
  gap?: 'sm' | 'md' | 'lg';

  // Card features
  productCardVariant?: ProductCardProps['variant'];
  showQuickAdd?: boolean;
  showWishlist?: boolean;

  // Events
  onProductClick?: (product: ProductCardProps['product']) => void;
  onAddToCart?: (productId: string) => void;
  onWishlist?: (productId: string) => void;

  // States
  loading?: boolean;
  loadingCount?: number; // Number of skeleton cards

  // Empty state
  emptyMessage?: string;
  emptyAction?: React.ReactNode; // CTA button

  // Styling
  className?: string;
}
```

### Variants & States

**Responsive Columns:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Wide: 4 columns

**States:**
- Loading (skeleton cards)
- Empty (no products)
- Error (failed to load)

### Accessibility Requirements

```typescript
// Structure
- <section> or <main> element
- Heading for section
- Landmark regions

// Grid
- Logical reading order
- Keyboard navigable

// Empty state
- Informative message
- Clear call to action
```

### Test Scenarios (TDD)

```typescript
describe('ProductGrid', () => {
  // Rendering
  test('renders product grid', () => {});
  test('renders all products', () => {});
  test('renders ProductCard components', () => {});

  // Layout
  test('applies single column on mobile', () => {});
  test('applies two columns on tablet', () => {});
  test('applies three columns on desktop', () => {});
  test('applies four columns on wide screens', () => {});
  test('applies custom column configuration', () => {});

  // Gap
  test('applies small gap spacing', () => {});
  test('applies medium gap spacing', () => {});
  test('applies large gap spacing', () => {});

  // Card features
  test('passes showQuickAdd to ProductCards', () => {});
  test('passes showWishlist to ProductCards', () => {});
  test('passes variant to ProductCards', () => {});

  // Events
  test('calls onProductClick when card is clicked', () => {});
  test('calls onAddToCart from ProductCard', () => {});
  test('calls onWishlist from ProductCard', () => {});

  // Loading state
  test('shows skeleton cards when loading', () => {});
  test('shows correct number of skeleton cards', () => {});
  test('hides actual products when loading', () => {});

  // Empty state
  test('shows empty message when no products', () => {});
  test('shows empty action button when provided', () => {});
  test('hides grid when empty', () => {});

  // Accessibility
  test('uses semantic section element', () => {});
  test('has accessible heading', () => {});
  test('maintains logical reading order', () => {});
  test('is keyboard navigable', () => {});

  // Multi-tenant
  test('passes tenant theme to ProductCards', () => {});
});
```

### Tenant Integration

```typescript
const ProductGrid: React.FC<ProductGridProps> = ({ products, ... }) => {
  const { theme } = useTenant();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <ProductCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
            onClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};
```

---

## 2. Header

### Purpose
Main navigation with logo, menu, search, cart, account.

### Props Interface

```typescript
interface HeaderProps {
  // Navigation
  navigationItems: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>; // Dropdown
  }>;

  // Features
  showSearch?: boolean;
  showCart?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;

  // Cart
  cartItemCount?: number;

  // User
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null; // null = logged out

  // Search
  onSearch?: (query: string) => void;

  // Events
  onCartClick?: () => void;
  onAccountClick?: () => void;
  onWishlistClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;

  // Mobile
  mobileBreakpoint?: 'sm' | 'md' | 'lg'; // When to show mobile menu

  // Variant
  variant?: 'default' | 'sticky' | 'transparent';

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `default`: Opaque background
- `sticky`: Fixed to top on scroll
- `transparent`: Transparent background (hero sections)

**States:**
- Desktop (full menu)
- Mobile (hamburger menu)
- Scrolled (compact or shadow)

### Accessibility Requirements

```typescript
// Navigation
- <nav> element with aria-label
- <ul> for menu items
- Keyboard navigable dropdowns

// Mobile menu
- aria-expanded on hamburger button
- aria-controls links to menu ID
- Focus trapped in open menu

// Cart badge
- aria-label: "Cart, 3 items"
- Live region for updates

// Keyboard navigation
- Tab through all links
- Enter/Space for dropdowns
- Escape to close dropdowns/mobile menu
```

### Test Scenarios (TDD)

```typescript
describe('Header', () => {
  // Rendering
  test('renders header', () => {});
  test('renders logo with brand name', () => {});
  test('renders navigation items', () => {});
  test('renders search when showSearch is true', () => {});
  test('renders cart when showCart is true', () => {});
  test('renders account when showAccount is true', () => {});
  test('renders wishlist when showWishlist is true', () => {});

  // Logo
  test('logo links to home page', () => {});
  test('shows tenant logo', () => {});
  test('shows tenant brand name', () => {});

  // Navigation
  test('renders top-level navigation links', () => {});
  test('renders dropdown menus for items with children', () => {});
  test('opens dropdown on hover', () => {});
  test('opens dropdown on click', () => {});
  test('closes dropdown on outside click', () => {});
  test('closes dropdown on Escape key', () => {});

  // Cart
  test('shows cart item count badge', () => {});
  test('hides badge when cart is empty', () => {});
  test('calls onCartClick when cart icon is clicked', () => {});
  test('updates badge count reactively', () => {});

  // User account
  test('shows login button when user is null', () => {});
  test('shows user menu when user is logged in', () => {});
  test('shows user avatar when provided', () => {});
  test('shows user name in dropdown', () => {});
  test('calls onLoginClick when login is clicked', () => {});
  test('calls onLogoutClick when logout is clicked', () => {});

  // Search
  test('renders search bar', () => {});
  test('calls onSearch when search is submitted', () => {});
  test('shows search on mobile (separate view)', () => {});

  // Mobile menu
  test('shows hamburger button on mobile', () => {});
  test('hides desktop menu on mobile', () => {});
  test('opens mobile menu on hamburger click', () => {});
  test('closes mobile menu on outside click', () => {});
  test('closes mobile menu on Escape key', () => {});
  test('shows all navigation in mobile menu', () => {});

  // Variants
  test('applies default variant styles', () => {});
  test('applies sticky positioning when variant is sticky', () => {});
  test('applies transparent background when variant is transparent', () => {});

  // Scroll behavior
  test('adds shadow on scroll', () => {});
  test('remains sticky on scroll when sticky variant', () => {});

  // Accessibility
  test('uses nav element with aria-label', () => {});
  test('has accessible logo link', () => {});
  test('dropdowns have correct ARIA attributes', () => {});
  test('mobile menu button has aria-expanded', () => {});
  test('cart badge has accessible label', () => {});
  test('is fully keyboard navigable', () => {});

  // Multi-tenant
  test('uses Reluma logo and colors', () => {});
  test('uses Eonlife logo and colors', () => {});
  test('applies tenant theme to navigation', () => {});
});
```

### Tenant Integration

```typescript
const Header: React.FC<HeaderProps> = ({ navigationItems, ... }) => {
  const { theme } = useTenant();

  return (
    <header className={`bg-white border-b border-[${theme.colors.neutral}]`}>
      <div className="container mx-auto">
        <nav aria-label="Main navigation" className="flex items-center justify-between">
          <Link href="/">
            <Image src={theme.logo.url} alt={theme.logo.alt} width={120} />
          </Link>

          <ul className="flex gap-6">
            {navigationItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={`text-[${theme.colors.primary}] hover:underline`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {showCart && (
            <button onClick={onCartClick} aria-label={`Cart, ${cartItemCount} items`}>
              <Icon name="cart" color={theme.colors.primary} />
              {cartItemCount > 0 && (
                <Badge variant="primary" className="absolute -top-2 -right-2">
                  {cartItemCount}
                </Badge>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
```

---

## 3. Footer

### Purpose
Site footer with links, copyright, newsletter, social media.

### Props Interface

```typescript
interface FooterProps {
  // Link sections
  sections: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  }>;

  // Newsletter
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;

  // Social media
  socialLinks?: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'pinterest';
    url: string;
  }>;

  // Legal
  copyrightText?: string;
  legalLinks?: Array<{
    label: string;
    href: string;
  }>;

  // Payment methods
  paymentMethods?: Array<'visa' | 'mastercard' | 'amex' | 'paypal' | 'apple-pay' | 'google-pay'>;

  // Variant
  variant?: 'default' | 'minimal';

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `default`: Full footer with all sections
- `minimal`: Links and copyright only

**Layout:**
- Desktop: Multi-column
- Mobile: Stacked sections

### Accessibility Requirements

```typescript
// Structure
- <footer> element
- Sectioned with headings
- Landmark region

// Newsletter form
- Accessible label and error messages
- Submit button with clear text

// Social links
- Accessible link text or aria-label
- Icon with role="img"

// Keyboard navigation
- Tab through all links
- Skip to main content link
```

### Test Scenarios (TDD)

```typescript
describe('Footer', () => {
  // Rendering
  test('renders footer', () => {});
  test('renders all link sections', () => {});
  test('renders section titles', () => {});
  test('renders all links in each section', () => {});

  // Newsletter
  test('shows newsletter when showNewsletter is true', () => {});
  test('renders newsletter title and description', () => {});
  test('renders email input and submit button', () => {});
  test('calls onNewsletterSubmit with email', () => {});
  test('validates email format', () => {});
  test('shows success message after submission', () => {});

  // Social media
  test('renders social media links', () => {});
  test('shows correct icon for each platform', () => {});
  test('opens social links in new tab', () => {});
  test('adds rel="noopener noreferrer" to social links', () => {});

  // Legal
  test('renders copyright text', () => {});
  test('renders legal links (Privacy, Terms)', () => {});
  test('shows current year in copyright', () => {});

  // Payment methods
  test('renders payment method icons', () => {});
  test('shows all provided payment methods', () => {});

  // Variants
  test('applies default variant with all sections', () => {});
  test('applies minimal variant with limited content', () => {});

  // Layout
  test('uses multi-column layout on desktop', () => {});
  test('stacks sections on mobile', () => {});

  // Accessibility
  test('uses footer element', () => {});
  test('has section headings', () => {});
  test('social links have accessible labels', () => {});
  test('newsletter form is accessible', () => {});
  test('is fully keyboard navigable', () => {});

  // Multi-tenant
  test('uses Reluma brand name in copyright', () => {});
  test('uses Eonlife brand name in copyright', () => {});
  test('applies tenant theme colors', () => {});
  test('shows tenant-specific legal links', () => {});
});
```

### Tenant Integration

```typescript
const Footer: React.FC<FooterProps> = ({ sections, ... }) => {
  const { theme } = useTenant();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-[${theme.colors.neutral}] text-white`}>
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showNewsletter && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h3 className="text-lg font-bold mb-2">{newsletterTitle}</h3>
            <p className="text-sm mb-4">{newsletterDescription}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input type="email" placeholder="Enter your email" required />
              <Button type="submit" variant="primary">Subscribe</Button>
            </form>
          </div>
        )}

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>{copyrightText || `© ${currentYear} ${theme.brandName}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};
```

---

## 4. CheckoutForm

### Purpose
Multi-step checkout with shipping, payment, review, validation.

### Props Interface

```typescript
interface CheckoutFormProps {
  // Steps
  steps?: Array<{
    id: string;
    label: string;
    component: React.ComponentType<any>;
  }>;
  currentStep?: number;

  // Data
  cartItems: Array<CartItemProps['item']>;
  initialData?: {
    shipping?: ShippingFormData;
    payment?: PaymentFormData;
  };

  // Events
  onStepChange?: (step: number) => void;
  onShippingSubmit?: (data: ShippingFormData) => Promise<void>;
  onPaymentSubmit?: (data: PaymentFormData) => Promise<void>;
  onComplete?: (order: Order) => void;

  // Configuration
  allowSkipSteps?: boolean;
  showProgressBar?: boolean;

  // State
  loading?: boolean;
  error?: string;

  // Styling
  className?: string;
}

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: 'standard' | 'express' | 'overnight';
}

interface PaymentFormData {
  paymentMethod: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
  billingAddress?: ShippingFormData;
  savePayment?: boolean;
}
```

### Variants & States

**Steps:**
1. Cart review
2. Shipping information
3. Payment details
4. Order review
5. Confirmation

**States:**
- Active step
- Completed step
- Disabled step (future)
- Loading (processing payment)
- Error (validation or payment failure)

### Accessibility Requirements

```typescript
// Progress indicator
- aria-label: "Checkout progress"
- aria-current="step" on current step
- Visual and text indication of progress

// Forms
- All inputs properly labeled
- Error messages associated with inputs
- Required fields marked

// Navigation
- Next/Previous buttons clearly labeled
- Keyboard navigation between steps
- Focus management on step change

// Review step
- Clear summary of all information
- Edit links to previous steps
```

### Test Scenarios (TDD)

```typescript
describe('CheckoutForm', () => {
  // Rendering
  test('renders checkout form', () => {});
  test('renders all steps', () => {});
  test('renders progress bar when showProgressBar is true', () => {});
  test('renders current step content', () => {});

  // Steps
  test('starts on first step by default', () => {});
  test('highlights current step in progress', () => {});
  test('shows completed steps as done', () => {});
  test('disables future steps when allowSkipSteps is false', () => {});
  test('allows clicking any step when allowSkipSteps is true', () => {});

  // Navigation
  test('moves to next step on "Continue" button', () => {});
  test('moves to previous step on "Back" button', () => {});
  test('calls onStepChange when step changes', () => {});
  test('validates current step before allowing next', () => {});
  test('hides "Back" button on first step', () => {});
  test('shows "Place Order" on final step', () => {});

  // Cart review step
  test('shows all cart items', () => {});
  test('shows order subtotal', () => {});
  test('allows editing cart from review', () => {});

  // Shipping step
  test('renders shipping form fields', () => {});
  test('validates required fields', () => {});
  test('shows shipping method options', () => {});
  test('calculates shipping cost', () => {});
  test('calls onShippingSubmit with form data', () => {});
  test('saves shipping data for review', () => {});

  // Payment step
  test('renders payment method options', () => {});
  test('shows card form for card payment', () => {});
  test('validates card number format', () => {});
  test('validates expiry date', () => {});
  test('validates CVC', () => {});
  test('shows billing address form', () => {});
  test('allows using shipping address for billing', () => {});
  test('calls onPaymentSubmit with payment data', () => {});

  // Order review step
  test('shows shipping information summary', () => {});
  test('shows payment method summary', () => {});
  test('shows cart items summary', () => {});
  test('shows order totals (subtotal, shipping, tax, total)', () => {});
  test('allows editing previous steps', () => {});

  // Order submission
  test('submits order on "Place Order" click', () => {});
  test('shows loading state during submission', () => {});
  test('calls onComplete with order data', () => {});
  test('shows error message on failure', () => {});
  test('allows retrying failed payment', () => {});

  // Confirmation
  test('shows order confirmation on success', () => {});
  test('displays order number', () => {});
  test('shows confirmation email message', () => {});

  // Loading state
  test('disables form when loading', () => {});
  test('shows loading spinner on submit button', () => {});

  // Error handling
  test('shows validation errors inline', () => {});
  test('shows server errors in alert', () => {});
  test('prevents submission with validation errors', () => {});

  // Accessibility
  test('progress indicator is accessible', () => {});
  test('all form fields are properly labeled', () => {});
  test('error messages are associated with inputs', () => {});
  test('manages focus on step change', () => {});
  test('navigation buttons have clear labels', () => {});
  test('is fully keyboard navigable', () => {});

  // Multi-tenant
  test('uses Reluma theme colors', () => {});
  test('uses Eonlife theme colors', () => {});
  test('shows tenant-specific payment methods', () => {});
});
```

### Tenant Integration

```typescript
const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, ... }) => {
  const { theme } = useTenant();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={index === activeStep ? `text-[${theme.colors.primary}]` : 'text-gray-400'}
              aria-current={index === activeStep ? 'step' : undefined}
            >
              <div className={`w-8 h-8 rounded-full ${index === activeStep ? `bg-[${theme.colors.primary}]` : 'bg-gray-300'}`}>
                {index + 1}
              </div>
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Step content */}
      <div>{steps[activeStep].component}</div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {activeStep > 0 && (
          <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          loading={loading}
        >
          {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
```

---

## 5. CartSummary

### Purpose
Order summary with line items, totals, promo codes, checkout CTA.

### Props Interface

```typescript
interface CartSummaryProps {
  // Items
  items: Array<CartItemProps['item']>;

  // Pricing
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;

  // Features
  showPromoCode?: boolean;
  onPromoCodeApply?: (code: string) => Promise<{ valid: boolean; discount: number }>;

  // CTA
  checkoutLabel?: string;
  onCheckout?: () => void;
  checkoutDisabled?: boolean;

  // Variant
  variant?: 'default' | 'compact';

  // State
  loading?: boolean;

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `default`: Full summary with all details
- `compact`: Minimal summary (total only)

**States:**
- Default
- Loading (calculating totals)
- Promo applied (show discount)

### Accessibility Requirements

```typescript
// Structure
- <aside> or <section> element
- Heading for summary
- Clear labeling of all amounts

// Promo code
- Accessible form with label
- Error/success messages
- Live region for updates

// Checkout button
- Clear, action-oriented text
- Disabled state announced
```

### Test Scenarios (TDD)

```typescript
describe('CartSummary', () => {
  // Rendering
  test('renders cart summary', () => {});
  test('renders subtotal', () => {});
  test('renders shipping cost', () => {});
  test('renders tax', () => {});
  test('renders total', () => {});
  test('renders all items with quantities', () => {});

  // Variants
  test('applies default variant with full details', () => {});
  test('applies compact variant with minimal details', () => {});

  // Calculations
  test('calculates subtotal correctly', () => {});
  test('adds shipping to total', () => {});
  test('adds tax to total', () => {});
  test('subtracts discount from total', () => {});
  test('formats all amounts as currency', () => {});

  // Promo code
  test('shows promo code input when showPromoCode is true', () => {});
  test('applies promo code on submit', () => {});
  test('calls onPromoCodeApply with code', () => {});
  test('shows discount when promo is applied', () => {});
  test('shows error for invalid promo code', () => {});
  test('allows removing applied promo', () => {});

  // Checkout button
  test('renders checkout button', () => {});
  test('uses custom checkout label when provided', () => {});
  test('calls onCheckout when clicked', () => {});
  test('disables checkout when checkoutDisabled is true', () => {});
  test('disables checkout when cart is empty', () => {});

  // Loading state
  test('shows loading spinner when loading', () => {});
  test('disables interactions when loading', () => {});

  // Accessibility
  test('uses semantic section element', () => {});
  test('has accessible heading', () => {});
  test('labels all amounts clearly', () => {});
  test('promo form is accessible', () => {});
  test('checkout button has clear label', () => {});
  test('announces discount updates', () => {});

  // Multi-tenant
  test('uses Reluma theme colors', () => {});
  test('uses Eonlife theme colors', () => {});
  test('applies tenant-specific formatting', () => {});
});
```

### Tenant Integration

```typescript
const CartSummary: React.FC<CartSummaryProps> = ({ items, total, ... }) => {
  const { theme } = useTenant();

  return (
    <aside className={`border-2 border-[${theme.colors.neutral}] p-6 rounded-lg`}>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd><Price amount={subtotal} currency={currency} /></dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd><Price amount={shipping} currency={currency} /></dd>
        </div>
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd><Price amount={tax} currency={currency} /></dd>
        </div>
        {discount > 0 && (
          <div className={`flex justify-between text-[${theme.colors.success}]`}>
            <dt>Discount</dt>
            <dd>-<Price amount={discount} currency={currency} /></dd>
          </div>
        )}
        <div className={`flex justify-between text-lg font-bold border-t-2 pt-2 border-[${theme.colors.neutral}]`}>
          <dt>Total</dt>
          <dd><Price amount={total} currency={currency} size="lg" /></dd>
        </div>
      </dl>

      {showPromoCode && (
        <form onSubmit={handlePromoSubmit} className="mt-4">
          <FormField label="Promo Code">
            <Input placeholder="Enter code" />
          </FormField>
          <Button type="submit" variant="outline" fullWidth className="mt-2">
            Apply
          </Button>
        </form>
      )}

      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="mt-6"
      >
        {checkoutLabel || 'Proceed to Checkout'}
      </Button>
    </aside>
  );
};
```

---

## 6. ProductFilter

### Purpose
Faceted filtering for product listings (category, price, size, color, brand, rating).

### Props Interface

```typescript
interface FilterOption {
  label: string;
  value: string;
  count?: number; // Number of products with this option
  disabled?: boolean;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'color';
  options?: FilterOption[]; // For checkbox/radio/color
  min?: number; // For range
  max?: number; // For range
  defaultExpanded?: boolean;
}

interface ProductFilterProps {
  // Filter groups
  filterGroups: FilterGroup[];

  // Active filters
  activeFilters?: Record<string, string | string[] | [number, number]>;
  onFiltersChange?: (filters: Record<string, any>) => void;

  // Features
  showResultCount?: boolean;
  resultCount?: number;
  showClearAll?: boolean;

  // Events
  onClearAll?: () => void;
  onApply?: (filters: Record<string, any>) => void;

  // Variant
  variant?: 'sidebar' | 'dropdown' | 'drawer';

  // Mobile
  mobileAsDrawer?: boolean;

  // Styling
  className?: string;
}
```

### Variants & States

**Variants:**
- `sidebar`: Persistent sidebar (desktop)
- `dropdown`: Dropdown menu (compact)
- `drawer`: Slide-in drawer (mobile)

**Filter Types:**
- `checkbox`: Multi-select (categories, brands)
- `radio`: Single-select (sort order)
- `range`: Price range slider
- `color`: Color swatches

### Accessibility Requirements

```typescript
// Filter groups
- <fieldset> for each group
- <legend> for group labels
- Collapsible sections with aria-expanded

// Checkboxes/Radio
- Proper labels and grouping
- Keyboard navigable

// Range slider
- aria-label for each handle
- aria-valuemin, aria-valuemax, aria-valuenow
- Keyboard control (arrow keys)

// Apply/Clear
- Clear button with accessible label
- Live region announcing filter changes
```

### Test Scenarios (TDD)

```typescript
describe('ProductFilter', () => {
  // Rendering
  test('renders product filter', () => {});
  test('renders all filter groups', () => {});
  test('renders group labels', () => {});
  test('renders filter options', () => {});

  // Variants
  test('applies sidebar variant layout', () => {});
  test('applies dropdown variant layout', () => {});
  test('applies drawer variant layout', () => {});

  // Filter groups
  test('expands groups by default when defaultExpanded is true', () => {});
  test('collapses groups by default when defaultExpanded is false', () => {});
  test('toggles group expansion on click', () => {});

  // Checkbox filters
  test('renders checkbox options', () => {});
  test('allows multiple selections', () => {});
  test('shows product count per option', () => {});
  test('disables options with zero count', () => {});
  test('checks active filter options', () => {});

  // Radio filters
  test('renders radio options', () => {});
  test('allows single selection only', () => {});
  test('selects active filter option', () => {});

  // Range filters
  test('renders range slider', () => {});
  test('sets min and max values', () => {});
  test('updates range on slider change', () => {});
  test('shows current range values', () => {});
  test('formats range as currency for price', () => {});

  // Color filters
  test('renders color swatches', () => {});
  test('shows color name on hover', () => {});
  test('indicates selected colors', () => {});

  // Active filters
  test('applies active filters on mount', () => {});
  test('calls onFiltersChange when filter is toggled', () => {});
  test('passes all active filters to onChange', () => {});

  // Result count
  test('shows result count when showResultCount is true', () => {});
  test('updates result count when filters change', () => {});

  // Clear filters
  test('shows clear all button when showClearAll is true', () => {});
  test('calls onClearAll when clear button is clicked', () => {});
  test('resets all filters when cleared', () => {});
  test('shows clear button per filter group', () => {});

  // Apply button
  test('shows apply button in dropdown/drawer variants', () => {});
  test('calls onApply with current filters', () => {});
  test('closes dropdown/drawer on apply', () => {});

  // Mobile drawer
  test('shows as drawer on mobile when mobileAsDrawer is true', () => {});
  test('opens drawer on filter button click', () => {});
  test('closes drawer on outside click', () => {});
  test('closes drawer on apply', () => {});

  // Accessibility
  test('uses fieldset for filter groups', () => {});
  test('uses legend for group labels', () => {});
  test('sets aria-expanded on collapsible groups', () => {});
  test('checkboxes have proper labels', () => {});
  test('range slider is accessible', () => {});
  test('announces filter changes', () => {});
  test('is fully keyboard navigable', () => {});

  // Multi-tenant
  test('uses Reluma theme colors for active filters', () => {});
  test('uses Eonlife theme colors for active filters', () => {});
});
```

### Tenant Integration

```typescript
const ProductFilter: React.FC<ProductFilterProps> = ({ filterGroups, ... }) => {
  const { theme } = useTenant();

  return (
    <aside className={`border-r border-[${theme.colors.neutral}]`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          {showClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {showResultCount && (
          <p className="text-sm text-gray-600 mb-4">{resultCount} products</p>
        )}

        {filterGroups.map(group => (
          <fieldset key={group.id} className="mb-6 border-b pb-4">
            <legend className="font-semibold mb-2">{group.label}</legend>

            {group.type === 'checkbox' && (
              <div className="space-y-2">
                {group.options.map(option => (
                  <Checkbox
                    key={option.value}
                    checked={activeFilters[group.id]?.includes(option.value)}
                    onChange={(checked) => handleFilterChange(group.id, option.value, checked)}
                  >
                    <span className="flex justify-between w-full">
                      <span>{option.label}</span>
                      <span className="text-gray-500">({option.count})</span>
                    </span>
                  </Checkbox>
                ))}
              </div>
            )}

            {group.type === 'range' && (
              <div>
                {/* Range slider implementation */}
                <div className="flex justify-between text-sm">
                  <Price amount={activeFilters[group.id]?.[0] || group.min} />
                  <Price amount={activeFilters[group.id]?.[1] || group.max} />
                </div>
              </div>
            )}
          </fieldset>
        ))}
      </div>
    </aside>
  );
};
```

---

# Testing Guidelines

## Test-Driven Development (TDD) Workflow

1. **Write the test first** (it should fail)
2. **Implement minimum code** to pass the test
3. **Refactor** while keeping tests green
4. **Repeat** for next feature

## Testing Structure

```typescript
// Example: Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';
import { TenantProvider } from '@/providers/TenantProvider';

// Helper to render with tenant context
const renderWithTenant = (ui: React.ReactElement, tenantId = 'reluma') => {
  return render(
    <TenantProvider initialTenant={tenantId}>
      {ui}
    </TenantProvider>
  );
};

describe('Button', () => {
  describe('Rendering', () => {
    test('renders with children text', () => {
      renderWithTenant(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    test('applies primary variant styles', () => {
      renderWithTenant(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary'); // Check for tenant-aware class
    });
  });

  describe('Interactions', () => {
    test('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithTenant(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('has visible focus indicator', () => {
      renderWithTenant(<Button>Focus me</Button>);
      const button = screen.getByRole('button');

      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:ring-2'); // Focus ring style
    });
  });

  describe('Multi-tenant', () => {
    test('applies Reluma primary color', () => {
      renderWithTenant(<Button variant="primary">Button</Button>, 'reluma');
      const button = screen.getByRole('button');
      // Assert Reluma-specific color
    });

    test('applies Eonlife primary color', () => {
      renderWithTenant(<Button variant="primary">Button</Button>, 'eonlife');
      const button = screen.getByRole('button');
      // Assert Eonlife-specific color
    });
  });
});
```

## Coverage Requirements

- **80% minimum** coverage across all components
- **100% coverage** for critical paths (checkout, payment)
- Test files colocated with components
- Run coverage: `npm run test:coverage`

## Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('has no accessibility violations', async () => {
  const { container } = renderWithTenant(<Button>Accessible</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Visual Regression Testing

- Use Storybook for component documentation
- Chromatic for visual regression tests
- Screenshot tests for critical components

---

# Implementation Checklist

For each component implementation, ensure:

- [ ] TypeScript props interface defined
- [ ] All variants implemented
- [ ] All states handled (hover, focus, disabled, etc.)
- [ ] Multi-tenant theming integrated
- [ ] WCAG 2.1 AA compliance verified
- [ ] Tests written (before implementation if TDD)
- [ ] 80%+ test coverage achieved
- [ ] Accessibility tests passing
- [ ] Storybook stories created
- [ ] Documentation complete
- [ ] Reviewed and approved

---

# Next Steps

1. **Review and approve** this specification
2. **Set up testing infrastructure** (Vitest, Testing Library, axe)
3. **Configure multi-tenant system** (useTenant hook, theme config)
4. **Implement atoms first** (Button, Input, etc.)
5. **Build molecules** (ProductCard, SearchBar, etc.)
6. **Create organisms** (Header, Footer, ProductGrid, etc.)
7. **Develop templates** (Homepage, Product Detail, Cart, Checkout)
8. **Test end-to-end** flows
9. **Launch** 🚀

---

**Document Version**: 1.0
**Last Updated**: 2025-11-19
**Maintained by**: Development Team
