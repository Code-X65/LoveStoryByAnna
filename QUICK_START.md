# Quick Start Guide - LoveStory by Anna

**Last Updated**: December 27, 2024  
**Version**: 1.0

---

## 🚀 Quick Start

### **1. Verify Application is Running**

Your dev server should be running at:
```
http://localhost:5173
```

Check the terminal - you should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Quick Verification Checklist

### **Step 1: Check Homepage** (30 seconds)
- [ ] Open `http://localhost:5173`
- [ ] Navbar loads correctly
- [ ] Logo displays
- [ ] Menu items visible
- [ ] Search icon present
- [ ] Cart icon present
- [ ] User icon present

### **Step 2: Test Authentication** (2 minutes)

#### **Sign Up**:
1. [ ] Click user icon → "Sign Up"
2. [ ] Fill in: Name, Email, Password
3. [ ] Check "Accept Terms"
4. [ ] Click "Sign Up"
5. [ ] Should redirect to login with success message
6. [ ] Check email for verification link

#### **Login**:
1. [ ] Enter email and password
2. [ ] Click "Login"
3. [ ] Should redirect to profile/home
4. [ ] Navbar should show user initials
5. [ ] Email verification banner should appear (if not verified)

#### **Logout**:
1. [ ] Click user avatar
2. [ ] Click "Log Out"
3. [ ] Confirmation dialog appears
4. [ ] Click "OK"
5. [ ] Should redirect to homepage
6. [ ] Navbar shows "Login/Sign Up" again

### **Step 3: Test Search** (1 minute)
1. [ ] Click search icon in navbar
2. [ ] Type a product name
3. [ ] Search results appear
4. [ ] Click a result
5. [ ] Product details page loads

### **Step 4: Test Profile** (1 minute)
1. [ ] Login if not already
2. [ ] Click user avatar → "Profile"
3. [ ] Profile dashboard loads
4. [ ] Sidebar navigation works
5. [ ] Can access: Account, Orders, Addresses, Settings

### **Step 5: Test Orders** (1 minute)
1. [ ] Navigate to "My Orders"
2. [ ] Should show empty state (if no orders)
3. [ ] Or show real orders from database
4. [ ] No mock data visible

### **Step 6: Test Addresses** (2 minutes)
1. [ ] Navigate to "Address Book"
2. [ ] Click "Add New Address"
3. [ ] Fill in address details
4. [ ] Click "Save Address"
5. [ ] Address appears in list
6. [ ] Try editing address
7. [ ] Try deleting address

---

## 🔍 Console Check

Open browser console (F12) and check for:

### **Good Signs** ✅:
```
🔵 AuthProvider initializing...
🔵 AuthProvider rendering, loading: false
✅ Products loaded
✅ User authenticated
```

### **Bad Signs** ❌:
```
❌ Failed to fetch
❌ Import error
❌ 404 Not Found
⚠️ Warning: ...
```

If you see errors, check the relevant documentation file.

---

## 📱 Mobile Testing

1. [ ] Open DevTools (F12)
2. [ ] Click device toolbar icon
3. [ ] Select "iPhone 12 Pro" or similar
4. [ ] Test:
   - [ ] Mobile menu opens
   - [ ] Search works
   - [ ] Login works
   - [ ] Navigation works

---

## 🔧 Common Issues & Quick Fixes

### **Issue 1: "Cannot find module"**
**Fix**: Check import paths are correct
- From `Pages/AccountManagement/`: use `../../supabase/`
- From `Components/common/`: use `../../supabase/`

### **Issue 2: Logout not working**
**Fix**: 
1. Check console for errors
2. Verify confirmation dialog appears
3. Check `LOGOUT_ENHANCEMENT.md` for details

### **Issue 3: Search returns no results**
**Fix**:
1. Ensure products exist in database
2. Check console for errors
3. Verify Supabase connection

### **Issue 4: Email verification banner always shows**
**Fix**:
1. Click verification link in email
2. Or dismiss banner (stores in localStorage)
3. Clear localStorage and refresh to test again

### **Issue 5: Protected routes not working**
**Fix**:
1. Ensure you're logged in
2. Check `ProtectedRoute.jsx` is working
3. Verify AuthContext is providing `currentUser`

---

## 📚 Documentation Quick Reference

| Need Help With | Check This File |
|----------------|-----------------|
| Authentication | `AUTHENTICATION_GUIDE.md` |
| Database Setup | `DATABASE_SCHEMA.md` |
| Testing Auth | `AUTH_TESTING_CHECKLIST.md` |
| Logout Issues | `LOGOUT_ENHANCEMENT.md` |
| Import Errors | `IMPORT_PATH_FIXES.md` |
| Navbar Errors | `NAVBAR_ERROR_REPORT.md` |
| Mock Data | `MOCK_DATA_REMOVAL_SUMMARY.md` |
| Complete Overview | `SESSION_SUMMARY.md` |

---

## 🎯 Feature Status

| Feature | Status | Test It |
|---------|--------|---------|
| Sign Up | ✅ Ready | Go to `/signup` |
| Login | ✅ Ready | Go to `/login` |
| Logout | ✅ Ready | User dropdown |
| Password Reset | ✅ Ready | Go to `/forgot-password` |
| Email Verification | ✅ Ready | Check banner after signup |
| Product Search | ✅ Ready | Click search icon |
| View Orders | ✅ Ready | Go to `/order` |
| Manage Addresses | ✅ Ready | Go to `/profile` → Address Book |
| User Profile | ✅ Ready | Go to `/profile` |
| Protected Routes | ✅ Ready | Try accessing `/profile` while logged out |

---

## 🧪 Quick Test Script

Run through this in **5 minutes**:

1. **Homepage** → Loads ✅
2. **Sign Up** → Creates account ✅
3. **Login** → Authenticates ✅
4. **Search** → Finds products ✅
5. **Profile** → Displays user info ✅
6. **Logout** → Confirms & logs out ✅

If all pass → **Everything works!** 🎉

---

## 🔐 Security Checklist

- [ ] Passwords are hashed (Supabase handles this)
- [ ] Sessions expire properly
- [ ] Protected routes redirect to login
- [ ] User data is isolated (RLS)
- [ ] Email verification works
- [ ] Logout clears all state

---

## 📊 Performance Checklist

- [ ] Pages load quickly
- [ ] No console errors
- [ ] Images load properly
- [ ] Animations are smooth
- [ ] Search is responsive
- [ ] Mobile menu works smoothly

---

## 🎨 UI/UX Checklist

- [ ] Navbar is responsive
- [ ] Buttons have hover effects
- [ ] Forms have validation
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Loading states show
- [ ] Mobile menu works
- [ ] Dropdowns close on click outside

---

## 🚨 Emergency Troubleshooting

### **App Won't Start**
```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npm run dev
```

### **Database Connection Issues**
1. Check `.env` file exists
2. Verify `VITE_SUPABASE_URL` is set
3. Verify `VITE_SUPABASE_ANON_KEY` is set
4. Restart dev server

### **Import Errors**
1. Check file paths
2. Verify files exist
3. Check for typos
4. See `IMPORT_PATH_FIXES.md`

### **Authentication Not Working**
1. Check Supabase dashboard
2. Verify email settings
3. Check console for errors
4. See `AUTHENTICATION_GUIDE.md`

---

## 📞 Getting Help

### **Check Console First**
- Open DevTools (F12)
- Look for red errors
- Check Network tab for failed requests

### **Check Documentation**
- Each feature has detailed docs
- Error reports include solutions
- Testing checklists provided

### **Debug Mode**
All functions now have console logging:
- 🔴 = Starting
- ✅ = Success
- ❌ = Error
- ⚠️ = Warning
- 🧹 = Cleanup

---

## 🎓 Learning Resources

### **Understanding the Code**:
1. `AUTH_ARCHITECTURE.md` - System design
2. `DATABASE_SCHEMA.md` - Database structure
3. `AUTHENTICATION_GUIDE.md` - Auth flows

### **Making Changes**:
1. Follow existing patterns
2. Add console logs for debugging
3. Test thoroughly
4. Update documentation

---

## ✅ Final Verification

Run this complete check:

```
✅ Application starts without errors
✅ Homepage loads correctly
✅ Can sign up new user
✅ Can login with credentials
✅ Can search for products
✅ Can view profile
✅ Can manage addresses
✅ Can view orders
✅ Can logout successfully
✅ Protected routes work
✅ Mobile view works
✅ No console errors
```

If all checked → **You're ready to go!** 🚀

---

## 🎉 You're All Set!

Your LoveStory by Anna application is:
- ✅ Fully functional
- ✅ Database integrated
- ✅ Production ready
- ✅ Well documented

**Happy coding!** 🎊

---

**Quick Start Guide v1.0**  
**Created**: December 27, 2024
