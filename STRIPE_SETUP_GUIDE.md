# ROOK - Stripe Setup Guide for Production

## Overview
Your subscription system is set up for **recurring payments**. Here's what you need to do in the Stripe Dashboard to complete the setup.

---

## Step 1: Access Stripe Dashboard
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Log in to your Stripe account
3. Make sure you're in **Live Mode** (not Test Mode) for production

---

## Step 2: Verify Products Are Created
The backend automatically creates Products and Prices when it starts. Check if they exist:

1. Go to **Products** in the left sidebar
2. You should see these products:
   - **ROOK Hero** - $3.99/month, $39.99/year
   - **ROOK Quest Master** - $3.99/month, $39.99/year  
   - **ROOK Legendary** - $5.99/month, $59.99/year

If they don't exist, the backend will create them automatically on next startup.

---

## Step 3: Set Up Webhooks (CRITICAL)
Webhooks allow Stripe to notify your app about payment events.

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **"Add endpoint"**
3. Enter your endpoint URL:
   ```
   https://rookiequestkeeper.com/api/webhook/stripe
   ```
4. Select these events to listen for:
   - `checkout.session.completed` - When a user completes checkout
   - `invoice.paid` - When a recurring payment succeeds
   - `invoice.payment_failed` - When a payment fails
   - `customer.subscription.deleted` - When a subscription is cancelled
   - `customer.subscription.updated` - When a subscription changes

5. Click **"Add endpoint"**

### Get Your Webhook Signing Secret
After creating the endpoint:
1. Click on the endpoint you just created
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)
4. Add it to your backend `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

---

## Step 4: Verify Your API Keys
Make sure your backend has the correct Stripe API key:

1. Go to **Developers** → **API keys**
2. Copy your **Secret key** (starts with `sk_live_...` for production)
3. Verify it's in your backend `.env`:
   ```
   STRIPE_API_KEY=sk_live_your_secret_key
   ```

**⚠️ NEVER share your secret key publicly!**

---

## Step 5: Test the Flow (In Test Mode First)
Before going live:

1. Switch to **Test Mode** in Stripe Dashboard
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and CVC
4. Verify:
   - ✅ Checkout session creates
   - ✅ Payment completes
   - ✅ User tier updates
   - ✅ Recurring billing works

---

## Step 6: Customer Portal (Optional but Recommended)
Let users manage their own subscriptions:

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable the portal
3. Configure what users can do:
   - ✅ Update payment method
   - ✅ Cancel subscription
   - ✅ View invoices
4. Add portal link to your app (I can help with this)

---

## How the Payment Flow Works

### New Subscription:
1. User clicks "Subscribe" → Goes to Stripe Checkout
2. User enters payment info → Stripe charges them
3. Stripe sends `checkout.session.completed` webhook
4. Your app updates user tier to paid

### Recurring Payment (Monthly/Yearly):
1. Stripe automatically charges on renewal date
2. Stripe sends `invoice.paid` webhook
3. Your app keeps user tier active

### Failed Payment:
1. Stripe attempts charge, fails
2. Stripe sends `invoice.payment_failed` webhook
3. Your app marks subscription as `past_due`
4. Stripe retries payment (configurable in Dashboard)

### Cancellation:
1. User requests cancellation
2. Your app calls Stripe to cancel at period end
3. User keeps access until paid period ends
4. Stripe sends `customer.subscription.deleted` webhook
5. Your app reverts user to Free tier

---

## Promo Codes (Already Working!)
Your promo code system works **independently** of Stripe:
- Promo codes give free access by setting database flags
- No Stripe charges involved for promo users
- If user had a Stripe subscription, it's **paused** during promo
- When promo expires, original subscription **resumes**

---

## Checklist Before Going Live

- [ ] Products created in Stripe Dashboard
- [ ] Webhook endpoint added with correct URL
- [ ] Webhook signing secret in `.env`
- [ ] Live API key in `.env` 
- [ ] Tested in Test Mode first
- [ ] Customer portal configured (optional)

---

## Need Help?
If you have any issues:
1. Check Stripe Dashboard → Developers → Logs for errors
2. Check your backend logs for webhook errors
3. Verify API keys are correct and not expired
