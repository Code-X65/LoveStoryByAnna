# Authentication Testing Checklist

## Pre-Testing Setup

- [ ] Supabase project is configured
- [ ] Environment variables are set in `.env`
- [ ] Email provider is configured in Supabase
- [ ] OAuth providers are configured (Google, Facebook)
- [ ] Dev server is running (`npm run dev`)
- [ ] Database tables are created
- [ ] RLS policies are set up

---

## 1. Sign Up Testing

### Email/Password Sign Up
- [ ] Navigate to `/signup`
- [ ] Fill in all required fields:
  - [ ] Full Name
  - [ ] Email Address
  - [ ] Password (min 6 chars)
  - [ ] Accept Terms & Conditions
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Verify redirect to login page
- [ ] Check email inbox for verification email
- [ ] Verify user created in Supabase Auth dashboard
- [ ] Verify user profile created in database

### Google OAuth Sign Up
- [ ] Click "Continue with Google" button
- [ ] Complete Google OAuth flow
- [ ] Verify redirect back to app
- [ ] Verify user logged in
- [ ] Verify profile created

### Facebook OAuth Sign Up
- [ ] Click "Continue with Facebook" button
- [ ] Complete Facebook OAuth flow
- [ ] Verify redirect back to app
- [ ] Verify user logged in
- [ ] Verify profile created

### Validation Testing
- [ ] Try submitting without name → Error shown
- [ ] Try submitting without email → Error shown
- [ ] Try submitting without password → Error shown
- [ ] Try password less than 6 chars → Error shown
- [ ] Try without accepting terms → Error shown
- [ ] Try with existing email → Error shown
- [ ] Try with invalid email format → Error shown

---

## 2. Login Testing

### Email/Password Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Click "Login" button
- [ ] Verify redirect to profile page
- [ ] Verify user data loads correctly
- [ ] Verify navbar shows user avatar
- [ ] Test "Remember me" checkbox

### Google OAuth Login
- [ ] Click "Continue with Google"
- [ ] Complete OAuth flow
- [ ] Verify successful login
- [ ] Verify profile loads

### Facebook OAuth Login
- [ ] Click "Continue with Facebook"
- [ ] Complete OAuth flow
- [ ] Verify successful login
- [ ] Verify profile loads

### Error Handling
- [ ] Try invalid email → Error message shown
- [ ] Try invalid password → Error message shown
- [ ] Try non-existent account → Error message shown
- [ ] Verify error messages are user-friendly

### Success Messages
- [ ] After password reset → Success message shown
- [ ] After signup → Success message shown
- [ ] Messages clear after navigation

---

## 3. Email Verification Testing

### Verification Banner
- [ ] Login with unverified account
- [ ] Verify banner appears at top of page
- [ ] Verify banner shows correct message
- [ ] Banner appears on all pages while logged in

### Resend Verification Email
- [ ] Click "resend email" link in banner
- [ ] Verify "Sending..." state shows
- [ ] Verify success message appears
- [ ] Check email inbox for new verification email
- [ ] Verify error handling if resend fails

### Email Verification
- [ ] Click verification link in email
- [ ] Verify redirect to app
- [ ] Verify banner disappears
- [ ] Verify account is marked as verified in Supabase

### Banner Dismissal
- [ ] Click dismiss (X) button on banner
- [ ] Verify banner disappears
- [ ] Refresh page
- [ ] Verify banner stays dismissed (localStorage)
- [ ] Clear localStorage and refresh
- [ ] Verify banner reappears for unverified users

---

## 4. Forgot Password Testing

### Request Password Reset
- [ ] Navigate to `/forgot-password`
- [ ] Enter email address
- [ ] Click "Send Reset Link"
- [ ] Verify success message appears
- [ ] Check email inbox for reset email
- [ ] Verify email contains reset link

### Error Handling
- [ ] Try empty email → Error shown
- [ ] Try invalid email format → Error shown
- [ ] Try non-existent email → Appropriate message shown
- [ ] Try rate limiting (multiple requests) → Error shown

### Navigation
- [ ] Click "Back to Login" link
- [ ] Verify redirect to login page

---

## 5. Reset Password Testing (NEW)

### Valid Reset Flow
- [ ] Click reset link from email
- [ ] Verify redirect to `/reset-password`
- [ ] Verify token validation occurs
- [ ] Verify reset form appears
- [ ] Enter new password
- [ ] Enter confirmation password (matching)
- [ ] Click "Reset Password"
- [ ] Verify success message appears
- [ ] Verify redirect to login page
- [ ] Login with new password
- [ ] Verify login successful

### Validation Testing
- [ ] Try empty password → Error shown
- [ ] Try password less than 6 chars → Error shown
- [ ] Try mismatched passwords → Error shown
- [ ] Verify password visibility toggle works

### Invalid Token Testing
- [ ] Use expired reset link → Error shown
- [ ] Use already-used reset link → Error shown
- [ ] Manually navigate to `/reset-password` without token → Error shown
- [ ] Verify "Request New Reset Link" button works

---

## 6. Logout Testing

### Navbar Logout
- [ ] Click user avatar in navbar
- [ ] Click "Log Out" button
- [ ] Verify confirmation dialog appears
- [ ] Confirm logout
- [ ] Verify redirect to homepage
- [ ] Verify navbar shows login/signup buttons
- [ ] Verify user data cleared

### Profile Dashboard Logout
- [ ] Navigate to `/profile`
- [ ] Click "Logout" in sidebar
- [ ] Verify confirmation dialog
- [ ] Confirm logout
- [ ] Verify redirect to homepage
- [ ] Verify session cleared

### Cancel Logout
- [ ] Start logout process
- [ ] Click "Cancel" in confirmation
- [ ] Verify user stays logged in
- [ ] Verify no redirect occurs

---

## 7. Protected Routes Testing

### Unauthenticated Access
- [ ] Logout completely
- [ ] Try to access `/profile` → Redirect to login
- [ ] Try to access `/checkout` → Redirect to login
- [ ] Try to access `/wishlist` → Redirect to login
- [ ] Try to access `/order` → Redirect to login

### Redirect After Login
- [ ] Logout
- [ ] Try to access `/profile`
- [ ] Login when redirected
- [ ] Verify redirect back to `/profile`
- [ ] Repeat for other protected routes

### Authenticated Access
- [ ] Login
- [ ] Access `/profile` → Success
- [ ] Access `/checkout` → Success
- [ ] Access `/wishlist` → Success
- [ ] Access `/order` → Success

---

## 8. Profile Management Testing

### View Profile
- [ ] Navigate to `/profile/account`
- [ ] Verify user information displays correctly
- [ ] Verify email shows correctly
- [ ] Verify name shows correctly

### Update Profile
- [ ] Edit profile information
- [ ] Save changes
- [ ] Verify success message
- [ ] Refresh page
- [ ] Verify changes persisted

### Navigation
- [ ] Click "My Account" → Correct page loads
- [ ] Click "My Orders" → Correct page loads
- [ ] Click "Address Book" → Correct page loads
- [ ] Click "Wishlist" → Correct page loads
- [ ] Click "Settings" → Correct page loads
- [ ] Verify active route highlighting works

---

## 9. Settings Page Testing

### Password Change (Email Users)
- [ ] Login with email/password account
- [ ] Navigate to `/profile/settings`
- [ ] Verify password change form appears
- [ ] Enter current password (optional)
- [ ] Enter new password
- [ ] Enter confirmation password
- [ ] Click "Update Password"
- [ ] Verify success message
- [ ] Logout and login with new password
- [ ] Verify login successful

### OAuth Users
- [ ] Login with Google/Facebook
- [ ] Navigate to `/profile/settings`
- [ ] Verify password change form NOT shown
- [ ] Verify message about OAuth provider shown

### Notification Preferences
- [ ] Toggle notification checkboxes
- [ ] Verify state changes
- [ ] Save preferences (if implemented)

### Privacy Settings
- [ ] Toggle privacy checkboxes
- [ ] Verify state changes
- [ ] Save preferences (if implemented)

### Account Deletion
- [ ] Click "Delete Account" button
- [ ] Verify confirmation dialog
- [ ] Cancel deletion
- [ ] Verify account not deleted
- [ ] (Optional) Complete deletion and verify

---

## 10. Navbar Integration Testing

### User Avatar
- [ ] Login
- [ ] Verify avatar shows user initials
- [ ] Verify initials are correct:
  - [ ] For firstName + lastName
  - [ ] For displayName
  - [ ] For email (fallback)
- [ ] Verify avatar color/styling

### User Dropdown
- [ ] Click avatar
- [ ] Verify dropdown opens
- [ ] Verify user email shown
- [ ] Verify "Signed In" status shown
- [ ] Click outside dropdown
- [ ] Verify dropdown closes

### Dropdown Links
- [ ] Click "Profile" → Navigate to profile
- [ ] Click "Orders" → Navigate to orders
- [ ] Click "Wishlist" → Navigate to wishlist
- [ ] Verify dropdown closes after click

### Guest State
- [ ] Logout
- [ ] Verify avatar shows default icon
- [ ] Click avatar
- [ ] Verify "Login" and "Sign Up" buttons shown
- [ ] Click "Login" → Navigate to login
- [ ] Click "Sign Up" → Navigate to signup

---

## 11. Session Management Testing

### Session Persistence
- [ ] Login
- [ ] Refresh page
- [ ] Verify user stays logged in
- [ ] Verify profile data loads
- [ ] Close browser tab
- [ ] Reopen app
- [ ] Verify session persists

### Session Timeout
- [ ] Login
- [ ] Wait for token to expire (or manually expire)
- [ ] Try to access protected route
- [ ] Verify redirect to login
- [ ] Login again
- [ ] Verify redirect back to intended page

### Multiple Tabs
- [ ] Login in tab 1
- [ ] Open tab 2
- [ ] Verify logged in state in tab 2
- [ ] Logout in tab 1
- [ ] Check tab 2
- [ ] Verify logout reflected in tab 2

---

## 12. Error Handling Testing

### Network Errors
- [ ] Disconnect internet
- [ ] Try to login
- [ ] Verify appropriate error message
- [ ] Reconnect internet
- [ ] Retry login
- [ ] Verify success

### Server Errors
- [ ] Simulate server error (if possible)
- [ ] Verify user-friendly error message
- [ ] Verify no app crash
- [ ] Verify user can retry

### Validation Errors
- [ ] Test all form validations
- [ ] Verify error messages are clear
- [ ] Verify errors clear on input change
- [ ] Verify multiple errors can show

---

## 13. UI/UX Testing

### Loading States
- [ ] Verify loading spinner during auth operations
- [ ] Verify button disabled states
- [ ] Verify "Loading..." text shows
- [ ] Verify no UI flicker

### Animations
- [ ] Verify smooth page transitions
- [ ] Verify dropdown animations
- [ ] Verify banner slide animations
- [ ] Verify form animations

### Responsive Design
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test on desktop viewport
- [ ] Verify all features work on all sizes
- [ ] Verify mobile menu works

### Accessibility
- [ ] Tab through all forms
- [ ] Verify keyboard navigation works
- [ ] Verify screen reader labels
- [ ] Verify color contrast
- [ ] Verify focus indicators

---

## 14. Edge Cases Testing

### Rapid Actions
- [ ] Rapidly click login button
- [ ] Verify only one request sent
- [ ] Rapidly toggle dropdowns
- [ ] Verify no UI issues

### Special Characters
- [ ] Use special characters in name
- [ ] Use special characters in password
- [ ] Verify proper handling

### Long Inputs
- [ ] Enter very long name
- [ ] Enter very long email
- [ ] Verify proper display/truncation

### Browser Back/Forward
- [ ] Navigate through auth flows
- [ ] Use browser back button
- [ ] Verify proper state handling
- [ ] Use browser forward button
- [ ] Verify no issues

---

## 15. Integration Testing

### Cart Integration
- [ ] Add items to cart while logged out
- [ ] Login
- [ ] Verify cart persists

### Checkout Integration
- [ ] Add items to cart
- [ ] Proceed to checkout
- [ ] Verify login required
- [ ] Login
- [ ] Verify redirect to checkout

### Wishlist Integration
- [ ] Login
- [ ] Add items to wishlist
- [ ] Logout
- [ ] Login again
- [ ] Verify wishlist persists

---

## Post-Testing Verification

### Database Check
- [ ] Verify user records in Supabase Auth
- [ ] Verify user profiles in database
- [ ] Verify no orphaned records
- [ ] Verify data integrity

### Security Check
- [ ] Verify passwords are hashed
- [ ] Verify tokens are secure
- [ ] Verify no sensitive data in localStorage
- [ ] Verify HTTPS in production

### Performance Check
- [ ] Check auth operation speed
- [ ] Check page load times
- [ ] Check bundle size
- [ ] Check for memory leaks

---

## Bug Reporting Template

When you find a bug, document it with:

```
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: 

**Actual Behavior**: 

**Screenshots**: [If applicable]

**Browser/Device**: 

**Additional Context**: 
```

---

## Testing Summary

After completing all tests, fill out:

- **Total Tests**: ___
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___
- **Critical Issues**: ___
- **Minor Issues**: ___

**Overall Status**: ☐ Pass ☐ Fail ☐ Needs Work

**Notes**:
_______________________________________
_______________________________________
_______________________________________

**Tested By**: _______________________
**Date**: _______________________
**Version**: _______________________

---

## Quick Test (Smoke Test)

For quick verification, test these critical paths:

1. ☐ Sign up with email
2. ☐ Verify email
3. ☐ Login with email
4. ☐ Access protected route
5. ☐ Change password
6. ☐ Logout
7. ☐ Forgot password
8. ☐ Reset password
9. ☐ Login with new password
10. ☐ OAuth login (Google or Facebook)

If all pass → ✅ System is working
If any fail → ⚠️ Investigate immediately
