# 🚀 Quick Setup Checklist

## ✅ Completed Steps

- [x] Created OTP service (`src/services/otpService.js`)
- [x] Created Paystack service (`src/services/paystackService.js`)
- [x] Created Email service (`src/services/emailService.js`)
- [x] Updated order services with OTP support
- [x] Updated CheckoutPage with payment flow
- [x] Installed crypto-js dependency
- [x] Added environment variables to `.env`
- [x] Created comprehensive documentation

## ⏳ Remaining Steps (USER ACTION REQUIRED)

### 1. Get Paystack API Keys ⚠️ REQUIRED

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Sign up or log in
3. Copy your **Public Key** (starts with `pk_test_...`)
4. Copy your **Secret Key** (starts with `sk_test_...`)

### 2. Get Web3Forms Access Key ⚠️ REQUIRED

1. Go to: https://web3forms.com
2. Create a free account
3. Copy your **Access Key**

### 3. Update `.env` File ⚠️ REQUIRED

Open `.env` and replace these values:

```env
# Replace these with your actual keys:
VITE_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_PUBLIC_KEY_HERE
VITE_PAYSTACK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
VITE_WEB3FORMS_ACCESS_KEY=YOUR_ACTUAL_WEB3FORMS_ACCESS_KEY_HERE
```

### 4. Test the System ⚠️ REQUIRED

#### Test Card Payment:
1. Add items to cart
2. Go to checkout
3. Fill shipping details
4. Select "Credit/Debit Card"
5. Use test card: `4084 0840 8408 4081`
6. Expiry: `12/25`, CVV: `408`
7. Complete payment
8. Check email for OTP

#### Test COD:
1. Add items to cart
2. Go to checkout
3. Fill shipping details
4. Select "Cash on Delivery"
5. Place order
6. Check email for confirmation

---

## 📝 Quick Reference

### Paystack Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| 4084 0840 8408 4081 | Visa | Success |
| 5060 6666 6666 6666 4 | Mastercard | Success |
| 5078 5078 5078 5078 03 | Verve | Success |

**Expiry**: Any future date (e.g., `12/25`)  
**CVV**: `408` or any 3 digits

### Email Templates

- **OTP Email**: Sent for Card/Bank payments
- **COD Email**: Sent for Cash on Delivery

### OTP Details

- **Length**: 6 digits
- **Validity**: 48 hours
- **Usage**: Single use only
- **Storage**: SHA-256 hashed

---

## 🎯 Success Criteria

You'll know everything is working when:

✅ Paystack popup opens for card/bank payments  
✅ Payment is verified successfully  
✅ OTP email arrives (check spam folder)  
✅ Order appears in Firebase database  
✅ Success screen shows OTP code  
✅ COD orders work without OTP  

---

## 🐛 Common Issues

### "Invalid API Key"
- Check `.env` file has correct keys
- Restart dev server after updating `.env`

### "Email not sending"
- Verify Web3Forms access key
- Check internet connection
- Look for errors in browser console

### "Payment not verifying"
- Check Paystack secret key
- Verify test card number
- Check browser console for errors

---

## 📞 Need Help?

1. Check `PAYMENT_SYSTEM_README.md` for detailed guide
2. Check `PAYMENT_IMPLEMENTATION_GUIDE.md` for technical details
3. Check browser console for error messages
4. Check Paystack dashboard for transaction logs

---

**Status**: ⏳ **WAITING FOR API KEYS**

Once you add your API keys to `.env`, the system is ready to test!
