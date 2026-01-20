# Complete Checkout & Payment Implementation Guide

## Overview
This document outlines the complete implementation of the checkout and payment flow with Paystack integration, OTP generation, and Web3Forms email delivery.

## Architecture

### Payment Flow Decision Tree

```
User Selects Payment Method
│
├─→ Card Payment
│   ├─→ Initialize Paystack Transaction
│   ├─→ User Completes Payment on Paystack
│   ├─→ Verify Payment (Server-side)
│   ├─→ Generate OTP
│   ├─→ Store Hashed OTP in Database
│   ├─→ Send OTP Email via Web3Forms
│   ├─→ Create Order with status='placed', payment_status='paid'
│   └─→ Show Success Screen with OTP Info
│
├─→ Bank Transfer
│   ├─→ Initialize Paystack Transaction (Bank Transfer Channel)
│   ├─→ User Completes Transfer on Paystack
│   ├─→ Verify Payment (Server-side)
│   ├─→ Generate OTP
│   ├─→ Store Hashed OTP in Database
│   ├─→ Send OTP Email via Web3Forms
│   ├─→ Create Order with status='placed', payment_status='paid'
│   └─→ Show Success Screen with OTP Info
│
└─→ Cash on Delivery (COD)
    ├─→ Skip Paystack
    ├─→ Do NOT Generate OTP
    ├─→ Create Order with status='placed', payment_status='pending'
    ├─→ Send COD Confirmation Email via Web3Forms
    └─→ Show Success Screen (No OTP)
```

## Database Schema

### Order Document Structure

```javascript
{
  id: "order_id",
  userId: "user_id",
  order_number: "LS1736203456789",
  shipping_address: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+234...",
    address: "123 Main St",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001"
  },
  items: [], // Stored in subcollection
  total: 50000,
  subtotal: 45000,
  shipping_cost: 2500,
  tax: 2500,
  payment_method: "card" | "bank" | "cod",
  payment_status: "pending" | "paid" | "failed",
  payment_reference: "paystack_reference",
  status: "placed" | "processing" | "shipped" | "delivered" | "completed",
  
  // OTP Fields (only for card/bank payments)
  requires_otp: true | false,
  otp_hash: "hashed_otp_sha256",
  otp_expiry: Timestamp (48 hours from creation),
  otp_status: "unused" | "used",
  otp_verified_at: Timestamp (when OTP was verified),
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  paid_at: Timestamp
}
```

## Implementation Steps

### Step 1: Environment Setup

1. **Get Paystack API Keys**
   - Go to https://dashboard.paystack.com/#/settings/developer
   - Copy Public Key (pk_test_...)
   - Copy Secret Key (sk_test_...)
   - Add to `.env`:
     ```
     VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
     VITE_PAYSTACK_SECRET_KEY=sk_test_...
     ```

2. **Get Web3Forms Access Key**
   - Go to https://web3forms.com
   - Create free account
   - Get Access Key
   - Add to `.env`:
     ```
     VITE_WEB3FORMS_ACCESS_KEY=your_access_key
     ```

3. **Install Dependencies**
   ```bash
   npm install crypto-js
   ```

### Step 2: Service Files Created

1. **`src/services/otpService.js`**
   - `generateOTP()` - Generate 6-digit OTP
   - `hashOTP()` - Hash OTP using SHA-256
   - `verifyOTP()` - Verify OTP against hash
   - `isOTPExpired()` - Check if OTP expired
   - `getOTPExpiryTime()` - Get 48-hour expiry time

2. **`src/services/paystackService.js`**
   - `initializePaystackTransaction()` - Initialize payment
   - `verifyPaystackTransaction()` - Verify payment server-side
   - `generatePaystackReference()` - Generate unique reference
   - `getPaystackPublicKey()` - Get public key

3. **`src/services/emailService.js`**
   - `sendOTPEmail()` - Send OTP email with beautiful HTML template
   - `sendCODConfirmationEmail()` - Send COD confirmation email

### Step 3: Updated Order Services

**`src/firebase/orderServices.js`** now includes:
- `createOrder()` - Enhanced with OTP support
- `verifyOrderOTP()` - Verify OTP for order completion
- `updateOrderPaymentStatus()` - Update payment status after verification
- `updateOrderStatus()` - Update order status
- `getOrderById()` - Get single order with items

### Step 4: CheckoutPage Updates

The CheckoutPage needs to be updated to:

1. **Payment Method Selection**
   - Card (Paystack)
   - Bank Transfer (Paystack)
   - Cash on Delivery (No Paystack)

2. **Paystack Integration (Card & Bank)**
   ```javascript
   // Initialize transaction
   const initResult = await initializePaystackTransaction({
     email: formData.email,
     amount: total,
     reference: generatePaystackReference(orderNumber),
     metadata: { orderNumber, userId }
   });
   
   // Open Paystack popup/redirect
   // User completes payment
   
   // On success callback:
   const verifyResult = await verifyPaystackTransaction(reference);
   if (verifyResult.success) {
     // Create order with OTP
     // Send OTP email
   }
   ```

3. **COD Flow**
   ```javascript
   // Create order without OTP
   const result = await createOrder(userId, {
     ...orderData,
     generateOTPCode: false,
     paymentStatus: 'pending'
   });
   
   // Send COD confirmation email
   await sendCODConfirmationEmail({
     toEmail: formData.email,
     customerName: `${formData.firstName} ${formData.lastName}`,
     orderNumber,
     orderTotal: total,
     shippingAddress: formData
   });
   ```

4. **Success Screen**
   - For Card/Bank: Show OTP sent message
   - For COD: Show order confirmation message

## Security Considerations

### OTP Security
- ✅ OTP is hashed using SHA-256 before storage
- ✅ Plain OTP is never stored in database
- ✅ OTP expires after 48 hours
- ✅ OTP can only be used once
- ✅ OTP verification updates order status to 'completed'

### Payment Security
- ✅ Payment verification happens server-side only
- ✅ Never trust client-side payment confirmation
- ✅ Always verify with Paystack API before creating order
- ✅ Store payment reference for audit trail

### Email Security
- ✅ Use Web3Forms (no SMTP credentials exposed)
- ✅ Professional HTML templates
- ✅ Clear instructions for users
- ✅ No sensitive data in email (only OTP for pickup)

## Testing Checklist

### Card Payment Flow
- [ ] User selects card payment
- [ ] Paystack popup opens
- [ ] User enters test card: 4084084084084081
- [ ] Payment succeeds
- [ ] OTP is generated and stored
- [ ] OTP email is sent
- [ ] Order is created with status='placed', payment_status='paid'
- [ ] Success screen shows OTP info

### Bank Transfer Flow
- [ ] User selects bank transfer
- [ ] Paystack shows bank details
- [ ] User completes transfer
- [ ] Payment is verified
- [ ] OTP is generated and stored
- [ ] OTP email is sent
- [ ] Order is created
- [ ] Success screen shows OTP info

### COD Flow
- [ ] User selects COD
- [ ] No Paystack integration
- [ ] No OTP generated
- [ ] COD confirmation email sent
- [ ] Order created with status='placed', payment_status='pending'
- [ ] Success screen shows COD info

### OTP Verification (Admin/Delivery)
- [ ] Delivery personnel enters OTP
- [ ] System verifies OTP hash
- [ ] Check expiry time
- [ ] Check if already used
- [ ] Update order status to 'completed'
- [ ] Mark OTP as 'used'

## Email Templates

### OTP Email Features
- ✅ Beautiful responsive HTML design
- ✅ Clear OTP display (large, monospace font)
- ✅ Expiry information (48 hours)
- ✅ Security instructions
- ✅ Order details
- ✅ Next steps
- ✅ Mobile-friendly

### COD Email Features
- ✅ Order confirmation
- ✅ Payment amount to prepare
- ✅ Delivery address
- ✅ COD instructions
- ✅ Next steps
- ✅ Mobile-friendly

## API Endpoints Used

### Paystack
- `POST https://api.paystack.co/transaction/initialize`
- `GET https://api.paystack.co/transaction/verify/:reference`

### Web3Forms
- `POST https://api.web3forms.com/submit`

## Error Handling

### Payment Errors
- Network failure → Show retry button
- Payment declined → Show error message
- Verification failed → Don't create order, show error

### Email Errors
- Email send failed → Still create order, log error, show warning
- Invalid email → Validate before submission

### OTP Errors
- Expired OTP → Show error, offer to contact support
- Invalid OTP → Show error, allow retry (max 3 attempts)
- Already used → Show error, order already completed

## Next Steps for User

1. **Setup API Keys**
   - Add Paystack keys to `.env`
   - Add Web3Forms key to `.env`

2. **Update CheckoutPage.jsx**
   - Import new services
   - Implement payment flow logic
   - Add success screens
   - Handle errors

3. **Test Payment Flow**
   - Use Paystack test cards
   - Verify OTP generation
   - Check email delivery
   - Test COD flow

4. **Deploy**
   - Update environment variables in production
   - Use production Paystack keys
   - Test with real payments (small amounts)

## Support Resources

- Paystack Docs: https://paystack.com/docs
- Web3Forms Docs: https://docs.web3forms.com
- Paystack Test Cards: https://paystack.com/docs/payments/test-payments

---

**Status**: ✅ Services Created, Ready for Integration
**Next**: Update CheckoutPage.jsx with new payment flow
