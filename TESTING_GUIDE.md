# 🧪 Testing Guide - Paystack Payment System

## ✅ Paystack Keys Configured!

Your Paystack test keys have been added to `.env`:
- ✅ Public Key: `pk_test_193ff585726726ec44aac5aeda26996b1fb5753b`
- ✅ Secret Key: `sk_test_48f7f77b56fff65e458c71c61c1b60d7ed919d3c`

---

## ⚠️ Important: Restart Dev Server

After updating `.env`, you **MUST** restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Test Scenarios

### 1️⃣ Test Card Payment (with OTP)

**Steps:**
1. Add items to cart
2. Go to checkout
3. Fill in shipping details:
   - Name: Test User
   - Email: **your-email@example.com** (use real email to receive OTP!)
   - Phone: +234 123 456 7890
   - Address: 123 Test Street
   - City: Lagos
   - State: Lagos
4. Click "Continue"
5. Select **"Credit/Debit Card"**
6. Click "Continue" to review
7. Accept terms & conditions
8. Click **"Pay ₦..."** button

**Paystack Test Card:**
- **Card Number**: `4084 0840 8408 4081`
- **Expiry Date**: `12/25` (any future date)
- **CVV**: `408`
- **PIN**: `0000` (if asked)
- **OTP**: `123456` (if asked)

**Expected Result:**
- ✅ Paystack popup opens
- ✅ Payment succeeds
- ✅ Payment verified server-side
- ✅ OTP generated (6 digits)
- ✅ OTP email sent to your email
- ✅ Order created in Firebase
- ✅ Success screen shows OTP code
- ✅ Cart cleared

**Check:**
- Browser console for logs
- Email inbox for OTP email
- Firebase database for order

---

### 2️⃣ Test Bank Transfer (with OTP)

**Steps:**
1. Follow steps 1-4 from Card Payment
2. Select **"Bank Transfer"**
3. Click "Continue" to review
4. Accept terms & conditions
5. Click **"Pay ₦..."** button

**Expected Result:**
- ✅ Paystack shows bank transfer details
- ✅ In test mode, transfer is instant
- ✅ Payment verified
- ✅ OTP generated
- ✅ OTP email sent
- ✅ Order created
- ✅ Success screen shows OTP

---

### 3️⃣ Test Cash on Delivery (NO OTP)

**Steps:**
1. Follow steps 1-4 from Card Payment
2. Select **"Cash on Delivery"**
3. Click "Continue" to review
4. Accept terms & conditions
5. Click **"Place Order"** button

**Expected Result:**
- ✅ No Paystack popup
- ✅ Order created immediately
- ✅ NO OTP generated
- ✅ Confirmation email sent (not OTP email)
- ✅ Success screen shows COD message
- ✅ Cart cleared

---

## 🔍 What to Check

### Browser Console
Look for these logs:
```
🔄 Verifying payment...
✅ Payment verified successfully
✅ OTP email sent successfully
✅ Order created successfully
```

### Email Inbox
**For Card/Bank:**
- Subject: "Order Confirmation & OTP - LS..."
- Contains: 6-digit OTP code
- Styled HTML email
- Package collection instructions

**For COD:**
- Subject: "Order Confirmation - LS..."
- Contains: Order details
- Payment instructions
- No OTP code

### Firebase Database
Check `orders` collection:
```javascript
{
  order_number: "LS...",
  payment_method: "card" | "bank" | "cod",
  payment_status: "paid" | "pending",
  payment_reference: "paystack_ref",
  
  // For card/bank only:
  requires_otp: true,
  otp_hash: "sha256_hash...",
  otp_expiry: Timestamp,
  otp_status: "unused"
}
```

---

## ⚠️ Still Need Web3Forms Key

**Current Status:**
- ✅ Paystack configured
- ⚠️ Web3Forms NOT configured

**To enable email delivery:**
1. Go to: https://web3forms.com
2. Create free account
3. Get Access Key
4. Add to `.env`:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_actual_key_here
   ```
5. Restart dev server

**Without Web3Forms:**
- Orders will still be created
- Payments will still work
- BUT emails won't be sent
- You'll see error in console

---

## 🐛 Troubleshooting

### "Invalid API Key"
- ✅ Keys are already added
- ⚠️ Did you restart dev server?
- Check browser console for errors

### "Payment verification failed"
- Check internet connection
- Verify Paystack dashboard shows transaction
- Check browser console for detailed error

### "Email not sending"
- ⚠️ Web3Forms key not configured yet
- Order still created successfully
- Add Web3Forms key to enable emails

### Paystack popup doesn't open
- Check browser console for errors
- Verify public key is correct
- Try different browser
- Disable ad blockers

---

## 📊 Test Checklist

### Card Payment
- [ ] Paystack popup opens
- [ ] Test card accepted
- [ ] Payment verified in console
- [ ] OTP generated (check console)
- [ ] Email sent (if Web3Forms configured)
- [ ] Order in Firebase
- [ ] Success screen shows OTP
- [ ] Cart cleared

### Bank Transfer
- [ ] Paystack shows bank details
- [ ] Transfer completed
- [ ] Payment verified
- [ ] OTP generated
- [ ] Email sent (if Web3Forms configured)
- [ ] Order in Firebase
- [ ] Success screen shows OTP

### Cash on Delivery
- [ ] No Paystack triggered
- [ ] Order created immediately
- [ ] Confirmation email sent (if Web3Forms configured)
- [ ] Success screen shows COD message
- [ ] Cart cleared

---

## 🎯 Success Indicators

You'll know it's working when:

✅ **Console shows:**
```
🔄 Verifying payment...
✅ Payment verified successfully
✅ OTP email sent successfully (if Web3Forms configured)
✅ Order created successfully
```

✅ **Success screen shows:**
- Order number
- OTP code (for card/bank)
- COD message (for COD)
- Email confirmation message

✅ **Firebase shows:**
- New order document
- Order items subcollection
- Correct payment status
- OTP hash (for card/bank)

---

## 🚀 Next Steps

1. **Restart dev server** (important!)
2. **Test card payment** with test card
3. **Check console** for logs
4. **Verify order** in Firebase
5. **Get Web3Forms key** to enable emails
6. **Test all payment methods**

---

## 📞 Need Help?

**Check:**
- Browser console for errors
- Paystack dashboard for transactions
- Firebase database for orders
- `PAYMENT_SYSTEM_README.md` for full guide

**Common Issues:**
- Forgot to restart server → Restart now!
- Web3Forms not configured → Emails won't send
- Test card declined → Use exact card number above

---

**Status**: ✅ **PAYSTACK CONFIGURED - READY TO TEST!**

**Action**: Restart dev server and start testing! 🚀
