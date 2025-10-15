# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server on port 3000

# Production
npm run build        # Build for production (standalone output)
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Project Overview

This is a **Next.js 15 App Router** application providing a complete authentication and subscription management template with Stripe integration and AI chat functionality. The backend is a FastAPI service.

**Tech Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- JWT authentication (HTTP-only cookies)
- Stripe for payments
- FastAPI backend (external)

## Architecture

### Configuration System

All configuration is centralized in [src/utils/config.ts](src/utils/config.ts):
- API base URL (defaults to `https://seeky.online`)
- Authentication settings (cookie config, token expiration)
- URL redirects for auth flows
- Environment-based security settings

**Important:** Cookie settings adapt based on `NODE_ENV` (secure flag in production).

### Authentication Architecture

**Token Management:**
- Access tokens stored in HTTP-only cookies (`token`)
- Refresh tokens stored separately (`refresh_token`)
- Token expiry tracked (`token_expiry`)
- Automatic token refresh attempt on 401 responses (via [src/utils/api.ts](src/utils/api.ts))

**Auth Flow:**
1. Login stores JWT tokens in cookies via [AuthService](src/services/auth.service.ts)
2. [Middleware](src/middleware.ts) protects routes at Next.js level (checks `token` cookie)
3. [apiFetch](src/utils/api.ts) utility auto-refreshes expired tokens and retries requests
4. On auth failure, user is logged out and redirected to login

**Key Files:**
- [src/services/auth.service.ts](src/services/auth.service.ts) - All auth API calls
- [src/middleware.ts](src/middleware.ts) - Route protection (redirects if no token)
- [src/utils/api.ts](src/utils/api.ts) - API wrapper with auto token refresh

### Subscription Architecture

**Plan-Based Access Control:**
- Three tiers: `free`, `pro`, `premium`
- Plan configuration in [src/types/subscription.ts](src/types/subscription.ts) including Stripe price IDs
- [SubscriptionContext](src/contexts/SubscriptionContext.tsx) manages subscription state globally
- [ProtectedRoute](src/components/ProtectedRoute.tsx) component wraps pages requiring specific plans

**Subscription Flow:**
1. User clicks upgrade → [SubscriptionService.handleUpgrade()](src/services/subscription.service.ts) creates Stripe checkout session
2. Redirects to Stripe Checkout with success/cancel URLs
3. After payment, Stripe webhook (backend) updates subscription status
4. Frontend polls/refreshes subscription via `SubscriptionContext`

**Access Control:**
```typescript
// Component-level protection
<ProtectedRoute allowedPlans={["pro", "premium"]}>
  <ProContent />
</ProtectedRoute>

// Hook-based checking
const hasAccess = useHasAccess(["pro", "premium"]);
const currentPlan = usePlan(); // returns "free" | "pro" | "premium"
```

**Key Files:**
- [src/contexts/SubscriptionContext.tsx](src/contexts/SubscriptionContext.tsx) - Global subscription state
- [src/services/subscription.service.ts](src/services/subscription.service.ts) - Stripe API calls
- [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) - Route protection with upgrade prompts

### API Integration Layer

[src/utils/api.ts](src/utils/api.ts) provides:
- `apiFetch()` - Standard fetch with auto auth headers, token refresh, and 401 handling
- `apiStreamFetch()` - Streaming responses for chat
- Request queuing during token refresh to prevent race conditions

**Usage Pattern:**
```typescript
// Always use apiFetch for API calls instead of raw fetch
const response = await apiFetch('/endpoint', { method: 'POST', ... });
```

### Chat System

Real-time AI chat with streaming responses:
- [ChatService](src/services/chat.service.ts) - CRUD operations for chats
- Streaming implemented via `apiStreamFetch()` to `/chat/stream`
- Chat history persisted per user
- Messages have roles: `user`, `assistant`, `system`

### Route Structure

```
/                       → Redirects to /dashboard if authenticated
/auth/*                 → Public auth pages (login, register, forgot-password, reset-password)
/dashboard/*            → Protected by middleware (requires token)
/subscription/free      → Accessible to all authenticated users
/subscription/pro       → Protected: requires pro or premium plan
/subscription/premium   → Protected: requires premium plan
/success                → Stripe checkout success redirect
/cancel                 → Stripe checkout cancel redirect
/verify-email           → Email verification handler
/debug                  → Debug page for subscription state
```

**Middleware Protection:**
- Protects `/dashboard/*` routes - redirects to `/auth/login` if no token
- Redirects authenticated users from `/` to `/dashboard`
- Prevents authenticated users from accessing `/auth/*` pages

**Component-Level Protection:**
- Subscription pages use `<ProtectedRoute>` to check plan access
- Shows upgrade prompt if user lacks required plan

## Backend API Integration

**Base URL:** Configured via `NEXT_PUBLIC_API_URL` env var (default: `https://seeky.online`)

**Required Backend Endpoints:**

Authentication:
- `POST /auth/register` - Create account
- `POST /auth/login` - Login (form-urlencoded, returns JWT)
- `POST /auth/forgot-password?email=...` - Request password reset
- `POST /auth/reset-password/{token}?new_password=...` - Reset password
- `POST /auth/change-password` - Change password (authenticated)
- `GET /auth/verify/{token}` - Verify email
- `POST /auth/resend-verification?email=...` - Resend verification email
- `GET /users/me` - Get current user info

Subscriptions:
- `GET /subscription/me` - Get user's subscription details
- `POST /subscription/create-checkout-session` - Create Stripe checkout
- `GET /subscription/manage-portal` - Get Stripe billing portal URL
- `POST /subscription/cancel` - Cancel subscription
- `POST /subscription/reactivate` - Reactivate subscription
- `POST /webhooks/stripe` - Stripe webhook handler (backend-only)

Chat:
- `POST /chat/` - Create chat
- `GET /chat/?skip=0&limit=20` - List chats
- `GET /chat/{id}` - Get single chat
- `PUT /chat/{id}` - Update chat
- `DELETE /chat/{id}` - Delete chat
- `POST /chat/stream` - Stream chat responses

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL

# Backend (FastAPI - required)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Stripe Configuration

Before using subscription features:

1. **Update Price IDs** in [src/types/subscription.ts](src/types/subscription.ts):
   ```typescript
   export const PLAN_CONFIGS = {
     pro: { priceId: "price_YOUR_PRO_PRICE_ID", ... },
     premium: { priceId: "price_YOUR_PREMIUM_PRICE_ID", ... }
   };
   ```

2. **Configure Webhook** in Stripe Dashboard pointing to backend `/webhooks/stripe`

3. **Test with Stripe test cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Key Patterns

**Path Aliases:**
- `@/*` maps to `src/*` (configured in tsconfig.json)

**Client Components:**
- All files using hooks, context, or browser APIs must have `"use client"` directive
- Examples: all pages in `/app`, context providers, components with interactivity

**Error Handling:**
- API errors return `{ detail: string | array }` format
- Services extract error messages consistently
- 401 responses trigger automatic logout + redirect

**Subscription State:**
- Always fetch via `SubscriptionContext.refreshSubscription()` after subscription changes
- Context defaults to `free` plan if API fails
- `loading` state prevents flashing incorrect content

## Development Workflow

1. **Starting Development:**
   ```bash
   npm install
   npm run dev
   ```

2. **Adding Protected Routes:**
   - Wrap page content with `<ProtectedRoute allowedPlans={[...]}/>`
   - Or use `useHasAccess()` hook for conditional rendering

3. **Making API Calls:**
   - Import services from `@/services/*`
   - Services use `apiFetch()` under the hood for consistent auth handling

4. **Testing Auth Flow:**
   - Register new user → verify email (check backend logs for token)
   - Login → redirects to dashboard
   - Try accessing `/subscription/pro` with free plan → shows upgrade prompt

5. **Testing Subscriptions:**
   - Use Stripe test mode + test cards
   - Check `/debug` page to see current subscription state
   - Verify webhook events in Stripe Dashboard

## Build Configuration

- Output mode: `standalone` (configured in [next.config.ts](next.config.ts))
- Dockerfile included for containerized deployment
- TypeScript strict mode enabled
- ESLint configured with Next.js preset

---

## Design System

This project follows the **smallbusiness.ge design system** for a minimalist, professional aesthetic. All UI components and styling adhere to these guidelines.

### Design Principles

**Reference:** See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete implementation guide.

**Core Philosophy:**
- Minimalist and professional
- Geometric shapes (no rounded corners on buttons)
- Strong contrast with navy blue and black
- Distinctive box shadows for visual interest
- Bold typography with uppercase and letter spacing
- Fast transitions (0.2s) for snappy feel

### Design Tokens

```css
/* Primary Colors */
--color-primary: #003049;        /* Navy Blue */
--color-accent: #4e35dc;         /* Purple */
--color-black: #000000;
--color-white: #ffffff;

/* Typography */
Font: Montserrat (weights: 400, 500)
Letter Spacing: 2px for headings/buttons
Text Transform: UPPERCASE for headings, labels, buttons

/* Buttons */
Border: 2px solid
Border Radius: 0px (no rounded corners)
Box Shadow: 5px 5px 0px 0px #333333
Hover Shadow: 5px 5px 0px 0px #000000
Padding: 12px 24px

/* Inputs */
Border: 2px solid #cccccc
Border Radius: 1px (minimal)
Focus Border: #003049 (navy blue)
Focus Ring: 4px ring with #003049/10 opacity

/* Spacing */
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

/* Transitions */
Fast: 0.2s ease (default for all interactions)
```

### UI Components Library

All reusable UI components are located in [src/components/ui/](src/components/ui/):

#### Button ([src/components/ui/Button.tsx](src/components/ui/Button.tsx))
```tsx
<Button variant="primary" fullWidth type="submit">
  Submit
</Button>
// Variants: 'primary' | 'secondary'
// Features: Distinctive 5px box-shadow, navy blue background, purple hover
```

#### Input ([src/components/ui/Input.tsx](src/components/ui/Input.tsx))
```tsx
<Input
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
// Features: 2px borders, minimal radius (1px), UPPERCASE labels, navy focus
```

#### Alert ([src/components/ui/Alert.tsx](src/components/ui/Alert.tsx))
```tsx
<Alert type="success" message="Operation completed!" />
// Types: 'success' | 'error' | 'warning' | 'info'
// Features: 2px borders, close button optional
```

#### Card (Not yet implemented - see DESIGN_SYSTEM.md)
```tsx
<Card hoverable>
  <CardContent />
</Card>
// Features: 9px border radius, hover lift effect, subtle shadow
```

#### Badge (Not yet implemented - see DESIGN_SYSTEM.md)
```tsx
<Badge variant="primary">Pro</Badge>
// Variants: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
```

### Styling Guidelines

#### When Creating New Components:

1. **Always use explicit hex colors** (not Tailwind custom colors):
   ```tsx
   // ✅ Correct
   className="bg-[#003049] text-white border-[#003049]"

   // ❌ Avoid (may not compile correctly)
   className="bg-primary text-white border-primary"
   ```

2. **Use consistent border styling:**
   ```tsx
   // Forms and containers
   className="border-2 border-gray-200 rounded-[9px]"

   // Inputs
   className="border-2 border-gray-300 rounded-[1px]"

   // No rounded corners on buttons
   className="rounded-none"
   ```

3. **Apply box shadows to buttons:**
   ```tsx
   className="shadow-[5px_5px_0px_0px_#333333] hover:shadow-[5px_5px_0px_0px_#000000]"
   ```

4. **Make headings and labels uppercase:**
   ```tsx
   <h1 className="text-2xl font-medium uppercase tracking-wide">
     Title
   </h1>

   <label className="text-sm font-medium uppercase tracking-wide">
     Label
   </label>
   ```

5. **Use purple accent for links:**
   ```tsx
   <Link href="/path" className="text-[#4e35dc] hover:underline font-medium">
     Click here
   </Link>
   ```

6. **Apply consistent transitions:**
   ```tsx
   className="transition-all duration-200"
   ```

#### Form Styling Pattern:

```tsx
<form className="bg-white p-8 rounded-[9px] shadow-lg border-2 border-gray-200">
  <h1 className="text-2xl font-medium mb-6 text-center uppercase tracking-wide">
    Form Title
  </h1>

  <div className="space-y-4">
    <Input id="field1" label="Field 1" {...props} />
    <Input id="field2" label="Field 2" {...props} />

    <Button type="submit" fullWidth variant="primary">
      Submit
    </Button>
  </div>
</form>
```

#### Page Layout Pattern:

```tsx
<div className="min-h-screen p-8 bg-white">
  <div className="max-w-md mx-auto">
    <h1 className="text-2xl font-medium uppercase tracking-wide mb-8">
      Page Title
    </h1>

    {/* Content */}
  </div>
</div>
```

### Typography Scale

```tsx
// Headings (always UPPERCASE with tracking-wide)
<h1 className="text-3xl font-medium uppercase tracking-wide">  // 50px equivalent
<h2 className="text-2xl font-medium uppercase tracking-wide">  // 32px equivalent
<h3 className="text-lg font-medium uppercase tracking-wide">   // 18px equivalent

// Body text (normal case)
<p className="text-sm">                                        // 14px
<p className="text-base">                                      // 16px

// Small text
<span className="text-xs">                                     // 12px
```

### Color Usage Rules

**Navy Blue (#003049):**
- Primary buttons
- Navigation background
- Input focus borders
- Primary brand elements

**Purple (#4e35dc):**
- Links (always)
- Button hover states
- Accent highlights
- Interactive element hovers

**Black (#000000):**
- Text content
- Borders
- Shadows

**White (#ffffff):**
- Backgrounds
- Button text on dark backgrounds

**Grays:**
- `#f5f5f5` - Light backgrounds, disabled states
- `#cccccc` - Input borders, subtle dividers
- `#333333` - Button shadows

### Animation & Interaction

**Button Hover:**
```tsx
// Lift effect
hover:-translate-x-0.5 hover:-translate-y-0.5
active:translate-x-0 active:translate-y-0
```

**Card Hover:**
```tsx
hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
```

**Link Hover:**
```tsx
hover:underline transition-colors duration-200
```

### Common Mistakes to Avoid

❌ **Don't** use rounded corners on buttons:
```tsx
// Wrong
className="rounded-md"

// Correct
className="rounded-none"
```

❌ **Don't** forget uppercase on headings/labels:
```tsx
// Wrong
<h1 className="text-2xl">Login</h1>

// Correct
<h1 className="text-2xl font-medium uppercase tracking-wide">Login</h1>
```

❌ **Don't** use thin borders:
```tsx
// Wrong
className="border"

// Correct
className="border-2"
```

❌ **Don't** forget box shadows on buttons:
```tsx
// Wrong
<button className="bg-[#003049] text-white">Click</button>

// Correct
<Button variant="primary">Click</Button>
```

❌ **Don't** use generic link colors:
```tsx
// Wrong
className="text-blue-600"

// Correct
className="text-[#4e35dc]"
```

### Testing Design Compliance

When reviewing UI:
- [ ] Montserrat font used throughout
- [ ] Navy blue (#003049) for primary elements
- [ ] Purple (#4e35dc) for links and accents
- [ ] All buttons have 5px box shadow
- [ ] Buttons have no rounded corners (rounded-none)
- [ ] Inputs have 2px borders and minimal radius (1px)
- [ ] Headings and labels are UPPERCASE with tracking-wide
- [ ] All borders use 2px width
- [ ] Transitions are 0.2s (duration-200)
- [ ] Form containers use rounded-[9px]
- [ ] Consistent spacing using defined scale

### Migration Status

**Completed:**
- ✅ Layout with Montserrat font
- ✅ Global CSS with design tokens
- ✅ Tailwind config with custom values
- ✅ Button component (primary & secondary variants)
- ✅ Input component with validation states
- ✅ Alert component
- ✅ Login page
- ✅ Register page
- ✅ Forgot password page
- ✅ Reset password page
- ✅ Change password page

**Pending:**
- [ ] Navbar component
- [ ] Dashboard page
- [ ] Profile page
- [ ] Subscription pages (free, pro, premium)
- [ ] Card component
- [ ] Badge component
- [ ] Chat page

**Reference DESIGN_SYSTEM.md for:**
- Complete implementation guide
- Phase-by-phase migration plan
- Detailed component specifications
- Responsive design patterns
- Accessibility guidelines
