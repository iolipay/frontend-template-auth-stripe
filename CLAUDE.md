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
