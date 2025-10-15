# Design System Migration Guide

This document outlines the design system from [smallbusiness.ge](https://smallbusiness.ge) and provides implementation instructions for migrating the current application to match this design.

---

## Table of Contents
1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Button Styles](#button-styles)
5. [Form Elements](#form-elements)
6. [Layout & Spacing](#layout--spacing)
7. [Component Patterns](#component-patterns)
8. [Implementation Guide](#implementation-guide)

---

## Design Tokens

### Core Values
```css
/* Colors */
--color-primary: #003049;        /* Navy Blue */
--color-black: #000000;
--color-white: #ffffff;
--color-accent: #4e35dc;         /* Purple */
--color-gray-light: #f5f5f5;
--color-gray-medium: #cccccc;
--color-shadow: rgba(0, 0, 0, 0.9);

/* Typography */
--font-family-primary: 'Montserrat', Arial, sans-serif;
--font-weight-regular: 400;
--font-weight-medium: 500;
--letter-spacing: 2px;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;

/* Border Radius */
--radius-none: 0px;
--radius-xs: 1px;
--radius-sm: 9px;
--radius-md: 11px;
--radius-lg: 20px;

/* Shadows */
--shadow-button: 5px 5px 0px 0px #333333;
--shadow-card: 5px 5px rgba(0, 0, 0, 0.9);

/* Transitions */
--transition-fast: 0.2s ease;
--transition-medium: 0.3s ease;

/* Borders */
--border-width: 2px;
```

---

## Typography

### Font Stack
**Primary Font:** `Montserrat`
**Fallback:** `Arial, sans-serif`

### Font Sizes
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 50px;
```

### Font Weights
- **Regular:** 400 (body text, paragraphs)
- **Medium:** 500 (headings, buttons, labels)

### Typography Hierarchy
```css
/* Headings */
h1 {
  font-size: 50px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
}

h2 {
  font-size: 32px;
  font-weight: 500;
  text-transform: uppercase;
}

h3 {
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
}

/* Body */
p, body {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}
```

### Implementation in Tailwind
Add to `tailwind.config.ts`:
```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wide: '2px',
      },
    },
  },
};
```

Install Montserrat font:
```tsx
// In app/layout.tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-montserrat',
});

// Apply to body
<body className={montserrat.className}>
```

---

## Color Palette

### Primary Colors
```css
Navy Blue (Primary):    #003049
Black:                  #000000
White:                  #ffffff
Purple (Accent):        #4e35dc
```

### Usage Guidelines
- **Navy Blue (#003049):** Primary brand color, headers, navigation, primary buttons
- **Black (#000000):** Text, borders, shadows
- **White (#ffffff):** Backgrounds, button text on dark backgrounds
- **Purple (#4e35dc):** Accent color for highlights, links, hover states

### Tailwind Configuration
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#003049',
        accent: '#4e35dc',
      },
    },
  },
};
```

---

## Button Styles

### Distinctive Button Design
The smallbusiness.ge buttons have a **unique box-shadow style** that creates a 3D offset effect.

### Primary Button
```css
.btn-primary {
  background-color: #003049;
  color: #ffffff;
  border: 2px solid #003049;
  border-radius: 0px;                    /* No rounded corners */
  box-shadow: 5px 5px 0px 0px #333333;   /* Distinctive shadow */
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #4e35dc;
  border-color: #4e35dc;
  box-shadow: 5px 5px 0px 0px #000000;
  transform: translate(-2px, -2px);      /* Subtle lift effect */
}

.btn-primary:active {
  transform: translate(0px, 0px);
  box-shadow: 3px 3px 0px 0px #333333;
}
```

### Secondary Button
```css
.btn-secondary {
  background-color: #ffffff;
  color: #003049;
  border: 2px solid #003049;
  border-radius: 0px;
  box-shadow: 5px 5px 0px 0px #003049;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #003049;
  color: #ffffff;
  box-shadow: 5px 5px 0px 0px #000000;
}
```

### React Component Example
```tsx
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  fullWidth
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 border-2 font-medium text-sm uppercase tracking-wide transition-all duration-200';
  const shadowClasses = 'shadow-[5px_5px_0px_0px_#333333] hover:shadow-[5px_5px_0px_0px_#000000] active:shadow-[3px_3px_0px_0px_#333333]';

  const variantClasses = variant === 'primary'
    ? 'bg-[#003049] text-white border-[#003049] hover:bg-[#4e35dc] hover:border-[#4e35dc]'
    : 'bg-white text-[#003049] border-[#003049] hover:bg-[#003049] hover:text-white';

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${shadowClasses} ${variantClasses} ${widthClass} ${disabledClasses}`}
    >
      {children}
    </button>
  );
}
```

---

## Form Elements

### Input Fields
```css
.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 400;
  border: 2px solid #cccccc;
  border-radius: 1px;                    /* Minimal radius */
  background-color: #ffffff;
  color: #000000;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #003049;
  box-shadow: 0 0 0 3px rgba(0, 48, 73, 0.1);
}

.form-input::placeholder {
  color: #999999;
  font-weight: 400;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Labels
```css
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### Error States
```css
.form-input.error {
  border-color: #dc3545;
}

.form-error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 400;
}
```

### Success States
```css
.form-input.success {
  border-color: #28a745;
}

.form-success-message {
  color: #28a745;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 400;
}
```

### React Input Component
```tsx
// Input.tsx
interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  success,
  required,
  disabled,
  placeholder,
}: InputProps) {
  const inputClasses = `
    w-full px-4 py-3 text-sm border-2 rounded-[1px] transition-all duration-200
    ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
    focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
  `;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium uppercase tracking-wide text-black"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClasses}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-xs mt-1">{success}</p>
      )}
    </div>
  );
}
```

---

## Layout & Spacing

### Container System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 980px) {
  .container {
    padding: 0 16px;
  }
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 980px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Spacing Scale
```css
/* Margin/Padding utilities */
.spacing-xs { margin/padding: 4px; }
.spacing-sm { margin/padding: 8px; }
.spacing-md { margin/padding: 16px; }
.spacing-lg { margin/padding: 24px; }
.spacing-xl { margin/padding: 32px; }
.spacing-2xl { margin/padding: 48px; }
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 960px) { /* lg - matches smallbusiness.ge */ }
@media (min-width: 980px) { /* xl - matches smallbusiness.ge */ }
```

---

## Component Patterns

### Card Component
```css
.card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

```tsx
// Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  const hoverClasses = hoverable
    ? 'hover:shadow-lg hover:-translate-y-0.5'
    : '';

  return (
    <div className={`
      bg-white border border-gray-200 rounded-[9px] p-6
      shadow-sm transition-all duration-200
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
}
```

### Alert/Notification Component
```tsx
// Alert.tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`
      border-2 rounded-[1px] p-4 mb-4 flex items-center justify-between
      ${colors[type]}
    `}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
```

### Badge Component
```tsx
// Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const colors = {
    primary: 'bg-[#003049] text-white',
    secondary: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`
      inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
      ${colors[variant]}
    `}>
      {children}
    </span>
  );
}
```

### Navigation
```css
.navbar {
  background: #003049;
  padding: 16px 0;
  border-bottom: 2px solid #000000;
}

.navbar-link {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.navbar-link:hover {
  color: #4e35dc;
  background: rgba(255, 255, 255, 0.1);
}
```

---

## Implementation Guide

### Phase 1: Setup Foundation

#### 1.1 Install Montserrat Font
```tsx
// app/layout.tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-montserrat',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}
```

#### 1.2 Update Tailwind Config
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003049',
        accent: '#4e35dc',
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wide: '2px',
      },
      boxShadow: {
        'button': '5px 5px 0px 0px #333333',
        'button-hover': '5px 5px 0px 0px #000000',
        'button-active': '3px 3px 0px 0px #333333',
      },
      borderRadius: {
        'xs': '1px',
        'sm': '9px',
        'md': '11px',
        'lg': '20px',
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 1.3 Create Reusable Components
Create the following components:
- `src/components/ui/Button.tsx` (using examples above)
- `src/components/ui/Input.tsx` (using examples above)
- `src/components/ui/Card.tsx` (using examples above)
- `src/components/ui/Alert.tsx` (using examples above)
- `src/components/ui/Badge.tsx` (using examples above)

---

### Phase 2: Update Authentication Pages

#### 2.1 Login Page
**File:** `src/app/auth/login/page.tsx`

**Changes to make:**
1. Replace the Next.js logo with your own logo/brand
2. Update form container styling:
   ```tsx
   <form className="bg-white p-8 rounded-[9px] border-2 border-gray-200">
   ```
3. Update heading to use uppercase:
   ```tsx
   <h1 className="text-2xl font-medium mb-6 text-center uppercase tracking-wide">
     Login
   </h1>
   ```
4. Replace input fields with new `Input` component
5. Replace button with new `Button` component:
   ```tsx
   <Button type="submit" disabled={loading} fullWidth variant="primary">
     {loading ? "Signing in..." : "Sign In"}
   </Button>
   ```
6. Update alert boxes to use `Alert` component
7. Update links to use accent color:
   ```tsx
   <Link href="/auth/forgot-password" className="text-[#4e35dc] hover:underline">
     Forgot your password?
   </Link>
   ```

#### 2.2 Register Page
**File:** `src/app/auth/register/page.tsx`

**Changes to make:**
1. Same styling updates as Login page
2. Update heading: `"Create Account"` → uppercase
3. Replace inputs with new `Input` component
4. Replace button with new `Button` component
5. Update all color references to match new design system

#### 2.3 Forgot Password Page
**File:** `src/app/auth/forgot-password/page.tsx`

**Changes to make:**
1. Same styling pattern as Login page
2. Update heading: `"Reset Your Password"` → uppercase
3. Replace input and button components
4. Update success/error alerts

#### 2.4 Reset Password Page
**File:** `src/app/auth/reset-password/[token]/page.tsx`

**Changes to make:**
1. Follow same pattern as other auth pages
2. Update form styling
3. Replace components

---

### Phase 3: Update Dashboard

#### 3.1 Navbar Component
**File:** `src/components/Navbar.tsx`

**Changes to make:**
1. Update background color:
   ```tsx
   <nav className="bg-[#003049] border-b-2 border-black py-4">
   ```
2. Update link styles:
   ```tsx
   <Link
     href="/dashboard"
     className="text-white font-medium text-sm uppercase tracking-wide hover:text-[#4e35dc] transition-colors"
   >
     Dashboard
   </Link>
   ```
3. Update badge component to use new `Badge` component
4. Update dropdown menu styling with proper borders and colors
5. Make all text uppercase where appropriate

#### 3.2 Dashboard Page
**File:** `src/app/dashboard/page.tsx`

**Changes to make:**
1. Replace all cards with new `Card` component
2. Update welcome section heading to uppercase
3. Replace plan badges with new `Badge` component
4. Update all buttons to use new `Button` component
5. Update notification/alert boxes to use new `Alert` component
6. Update grid cards with hover effects:
   ```tsx
   <Card hoverable className="group">
     <div className="flex items-center mb-3">
       {/* Icon and content */}
     </div>
   </Card>
   ```
7. Update gradient section with new colors:
   ```tsx
   <div className="bg-gradient-to-r from-[#003049] to-[#4e35dc] rounded-[9px] p-6 text-white">
   ```

---

### Phase 4: Update Subscription Pages

#### 4.1 All Subscription Pages
**Files:**
- `src/app/subscription/free/page.tsx`
- `src/app/subscription/pro/page.tsx`
- `src/app/subscription/premium/page.tsx`

**Changes to make:**
1. Update page headings to uppercase
2. Use new `Card` components for pricing cards
3. Use new `Button` components for upgrade buttons
4. Update feature lists styling
5. Add proper hover effects to cards

---

### Phase 5: Global Styling Updates

#### 5.1 Create Global CSS Variables
**File:** `src/app/globals.css`

Add at the top:
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap');

:root {
  /* Colors */
  --color-primary: #003049;
  --color-accent: #4e35dc;
  --color-black: #000000;
  --color-white: #ffffff;

  /* Shadows */
  --shadow-button: 5px 5px 0px 0px #333333;
  --shadow-button-hover: 5px 5px 0px 0px #000000;

  /* Transitions */
  --transition-fast: 0.2s ease;
}

* {
  font-family: 'Montserrat', Arial, sans-serif;
}
```

#### 5.2 Update Dark Mode
The smallbusiness.ge design doesn't use dark mode. Consider either:
1. Removing dark mode entirely
2. Creating a custom dark mode that matches the brand (navy blue background, etc.)

---

### Phase 6: Testing & Refinement

#### 6.1 Visual Comparison Checklist
- [ ] Fonts match (Montserrat, proper weights)
- [ ] Colors match (navy blue #003049, purple #4e35dc)
- [ ] Button shadows work correctly (5px offset)
- [ ] Hover states match (color transitions, lift effects)
- [ ] Spacing feels consistent
- [ ] Borders use 2px width
- [ ] Border radius minimal (0-9px range)
- [ ] All text uppercase where appropriate
- [ ] Letter spacing on headings/buttons

#### 6.2 Responsive Testing
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (768px - 980px)
- [ ] Test on desktop (> 980px)
- [ ] Verify grid layouts collapse properly
- [ ] Check button sizes on mobile

#### 6.3 Accessibility
- [ ] Color contrast ratios meet WCAG standards
- [ ] Focus states visible on inputs and buttons
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader labels present

---

## Quick Reference

### Current Design vs Target Design

#### Buttons
| Current | Target |
|---------|--------|
| Rounded corners (rounded-md) | No rounded corners (rounded-none) |
| Simple shadow | Box shadow: 5px 5px 0px 0px #333333 |
| Blue background | Navy #003049 background |
| No uppercase | UPPERCASE text |
| No letter spacing | Letter spacing: 2px |

#### Inputs
| Current | Target |
|---------|--------|
| Rounded-md | Minimal radius (1px) |
| 1px border | 2px border |
| Gray border | Gray border (#cccccc) |
| Standard focus | Navy blue focus ring |

#### Typography
| Current | Target |
|---------|--------|
| Default Next.js font | Montserrat |
| Mixed case headings | UPPERCASE headings |
| No letter spacing | 2px letter spacing on headings |

#### Colors
| Current | Target |
|---------|--------|
| Generic blue | Navy #003049 |
| No accent color | Purple #4e35dc accent |
| Various grays | Consistent gray scale |

---

## Implementation Order

**Recommended implementation sequence:**

1. **Day 1:** Setup (font, Tailwind config, create base components)
2. **Day 2:** Auth pages (login, register, forgot password)
3. **Day 3:** Navbar and dashboard layout
4. **Day 4:** Dashboard content and cards
5. **Day 5:** Subscription pages
6. **Day 6:** Testing and refinement

---

## Notes

- The smallbusiness.ge design is **minimalist and professional**
- Emphasis on **geometric shapes** (no rounded corners on buttons)
- **Strong contrast** with navy blue and black
- **Distinctive box shadows** create visual interest
- **Typography is bold** with uppercase and letter spacing
- **Transitions are fast** (0.2s) for snappy feel

---

## Support

For questions or issues during implementation:
1. Reference this document
2. Compare with https://smallbusiness.ge
3. Check component examples in this guide
4. Test thoroughly on multiple screen sizes

---

**Last Updated:** 2025-10-15
**Based on:** https://smallbusiness.ge design system
