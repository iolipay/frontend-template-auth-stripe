# Next.js Authentication & Subscription Template

A modern authentication and subscription template built with Next.js 14, featuring email verification, password reset, user management, Stripe integration, and a real-time chat interface.

## Features

### Authentication

- 🔐 Login and registration
- ✉️ Email verification
- 🔑 Password reset/change
- 🍪 HTTP-only cookie auth
- 🛡️ Protected routes
- 🔄 Refresh token support for seamless session management

### Subscription & Billing

- 💳 **Stripe Integration** - Complete payment processing
- 📊 **Three-Tier Plans** - Free, Pro ($19/mo), Premium ($49/mo)
- 🔒 **Route Protection** - Plan-based access control
- 🎫 **Billing Portal** - Stripe-hosted subscription management
- 📈 **Upgrade Flow** - Seamless plan upgrades
- ❌ **Cancellation** - Direct subscription cancellation
- 🔄 **Real-time Sync** - Automatic plan updates via webhooks

### User Features

- 👤 User dashboard with subscription status
- 📊 Profile management
- 📧 Verification status
- 🔄 Resend verification
- 💼 Subscription management

### Chat Features

- 💬 Real-time chat with an AI assistant
- 🗨️ Streaming responses
- 📜 Chat history management
- 🆕 Create and delete chats

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- JWT Authentication
- **Stripe** - Payment processing
- **React Context** - Subscription state management
- FastAPI for backend

## Project Structure

```
src/
├── app/
│   ├── auth/                 # Auth pages
│   │   ├── login
│   │   ├── register
│   │   ├── forgot-password
│   │   └── reset-password
│   ├── dashboard/           # Protected pages
│   │   ├── profile
│   │   ├── change-password
│   │   └── chat             # Chat page
│   ├── subscription/        # Subscription pages
│   │   ├── free/           # Free tier features
│   │   ├── pro/            # Pro tier (protected)
│   │   └── premium/        # Premium tier (protected)
│   ├── success/            # Stripe success page
│   ├── cancel/             # Stripe cancel page
│   └── verify-email/       # Email verification
├── components/
│   ├── ProtectedRoute.tsx  # Route protection component
│   └── Navbar.tsx          # Navigation with plan info
├── contexts/
│   └── SubscriptionContext.tsx  # Subscription state
├── services/
│   ├── auth.service.ts     # Authentication API
│   └── subscription.service.ts  # Subscription API
├── types/
│   └── subscription.ts     # Subscription types
└── middleware.ts          # Auth protection
```

## Subscription Plans

| Feature             | Free | Pro ($19/mo) | Premium ($49/mo) |
| ------------------- | ---- | ------------ | ---------------- |
| Basic Dashboard     | ✅   | ✅           | ✅               |
| Limited Features    | ✅   | ❌           | ❌               |
| Pro Features        | ❌   | ✅           | ✅               |
| Premium Content     | ❌   | ❌           | ✅               |
| Email Support       | ❌   | ✅           | ✅               |
| Priority Support    | ❌   | ❌           | ✅               |
| Custom Integrations | ❌   | ❌           | ✅               |

## Stripe Integration

### Setup

1. **Create Stripe Account**:

   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the dashboard

2. **Configure Products & Prices**:

   ```bash
   # Create products in Stripe Dashboard or via API
   Pro Plan: price_1ABC123def...
   Premium Plan: price_1XYZ789ghi...
   ```

3. **Update Price IDs**:

   ```typescript
   // src/types/subscription.ts
   export const PLAN_CONFIGS = {
     pro: {
       priceId: "price_YOUR_ACTUAL_PRO_PRICE_ID",
       // ...
     },
     premium: {
       priceId: "price_YOUR_ACTUAL_PREMIUM_PRICE_ID",
       // ...
     },
   };
   ```

4. **Environment Variables**:

   ```env
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # Backend (add these to your backend)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Backend Endpoints Required

Your backend needs to implement these Stripe-related endpoints:

```typescript
// Subscription Management
GET  /subscription/me                    # Get user's subscription
POST /subscription/create-checkout-session  # Create Stripe checkout
GET  /subscription/manage-portal         # Get billing portal URL
POST /subscription/cancel                # Cancel subscription

// Webhook (for real-time updates)
POST /webhooks/stripe                    # Stripe webhook handler
```

### API Response Formats

```typescript
// GET /subscription/me
{
  "subscription_plan": "pro",
  "subscription_status": "active",
  "current_period_end": "2025-06-27T20:32:30.000Z",
  "cancel_at_period_end": false
}

// POST /subscription/create-checkout-session
{
  "checkout_url": "https://checkout.stripe.com/pay/cs_...",
  "session_id": "cs_..."
}

// GET /subscription/manage-portal
{
  "url": "https://billing.stripe.com/session/..."
}

// POST /subscription/cancel
{
  "message": "Subscription cancelled successfully"
}
```

### Webhook Implementation

Set up Stripe webhooks to handle real-time subscription updates:

```python
# Example backend webhook handler
@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # Handle subscription events
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Update user subscription in database

    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        # Update subscription status

    return {"status": "success"}
```

### Route Protection

Routes are automatically protected based on subscription plans:

```typescript
// Automatic protection
<ProtectedRoute allowedPlans={["pro", "premium"]}>
  <ProContent />
</ProtectedRoute>;

// Manual checking
const hasProAccess = useHasAccess(["pro", "premium"]);
const currentPlan = usePlan(); // "free" | "pro" | "premium"
```

### Subscription Management UI

Users can manage their subscriptions through:

1. **Stripe Billing Portal** (Recommended):

   - Update payment methods
   - View invoices
   - Change billing details
   - Cancel subscriptions

2. **Direct Cancellation**:
   - One-click cancellation
   - Confirmation dialog
   - Immediate feedback

## Authentication Flow

1. **Registration**:

   - Submit registration form
   - Receive verification email
   - Redirect to login

2. **Email Verification**:

   - Click verification link
   - Validate token
   - Mark email as verified

3. **Login**:

   - Submit credentials
   - Store JWT and refresh token in HTTP-only cookies
   - Load subscription data
   - Access dashboard

4. **Subscription Flow**:

   - Choose plan on dashboard
   - Redirect to Stripe Checkout
   - Complete payment
   - Webhook updates subscription
   - Access new features

5. **Token Refresh**:

   - Automatically refresh access token using refresh token when it expires
   - Maintain user session without requiring frequent logins

6. **Password Reset**:
   - Request reset link
   - Set new password
   - Return to login

## Chat Flow

1. **Start a Chat**:

   - Click "New Chat" to create a conversation.
   - Type a message and hit Enter to send.

2. **Receive Responses**:

   - Messages from the assistant stream in real-time.
   - Chat history is maintained for future reference.

3. **Manage Chats**:
   - View a list of previous chats.
   - Delete chats as needed.

## Quick Start

1. Clone and install:

```bash
git clone [repo-url]
npm install
```

2. Set environment:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

3. Configure Stripe:

   - Update price IDs in `src/types/subscription.ts`
   - Set up webhook endpoints in your backend
   - Configure Stripe keys in backend environment

4. Run development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

```typescript
POST / auth / register;
POST / auth / login;
POST / auth / forgot - password;
POST / auth / reset - password / { token };
GET / auth / verify / { token };
POST / auth / change - password;
GET / users / me;
POST / auth / resend - verification;
POST / auth / refresh;
```

### Subscriptions

```typescript
GET / subscription / me;
POST / subscription / create - checkout - session;
GET / subscription / manage - portal;
POST / subscription / cancel;
POST / subscription / reactivate;
POST / webhooks / stripe;
```

### Chat

```typescript
POST / chat;
GET / chat;
GET / chat / { chat_id };
DELETE / chat / { chat_id };
POST / chat / stream;
```

## Testing

### Stripe Test Mode

Use Stripe's test cards for development:

```
# Successful payment
4242 4242 4242 4242

# Declined payment
4000 0000 0000 0002

# Requires authentication
4000 0025 0000 3155
```

### Test Subscription Flow

1. Register new user
2. Navigate to `/subscription/pro`
3. Click upgrade button
4. Use test card in Stripe Checkout
5. Verify redirect to success page
6. Check subscription status in dashboard

## Security

- HTTP-only cookies
- Protected routes
- Server validation
- CSRF protection
- Rate limiting
- **Stripe webhook signature verification**
- **PCI compliance** (handled by Stripe)

## Production Deployment

1. **Stripe Configuration**:

   - Switch to live API keys
   - Update webhook endpoints
   - Test with real payment methods

2. **Environment Variables**:

   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

3. **SSL Certificate**:
   - Required for Stripe webhooks
   - Enable HTTPS for all payment flows

## Troubleshooting

### Common Issues

1. **Subscription not updating**:

   - Check webhook configuration
   - Verify webhook signature
   - Check backend logs

2. **Payment failures**:

   - Verify Stripe price IDs
   - Check API key configuration
   - Test with Stripe test cards

3. **Route protection not working**:
   - Refresh subscription context
   - Check API response format
   - Verify field name mapping

### Debug Tools

- `/debug` page for subscription state
- Browser console for API responses
- Stripe Dashboard for payment logs
- Webhook logs for real-time events

## License

MIT
