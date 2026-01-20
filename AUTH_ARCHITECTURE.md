# Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     LoveStory by Anna                            │
│                   E-Commerce Application                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Layer                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Sign Up    │  │    Login     │  │   Logout     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Forgot    │  │    Reset     │  │   Verify     │         │
│  │   Password   │  │   Password   │  │    Email     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Auth Context Provider                         │
│                                                                  │
│  • currentUser      • userProfile      • loading                │
│  • login()          • signup()         • logout()               │
│  • loginWithGoogle() • loginWithFacebook()                      │
│  • refreshProfile()                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Auth Service                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • signUpWithEmail()      • signInWithEmail()            │  │
│  │  • signInWithGoogle()     • signInWithFacebook()         │  │
│  │  • signOut()              • getCurrentUser()             │  │
│  │  • resetPasswordForEmail() • updatePassword()            │  │
│  │  • verifyEmail()          • resendVerificationEmail()    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase Backend                           │
│                                                                  │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   Auth Users    │              │  User Profiles  │          │
│  │   (Supabase)    │◄────────────►│   (Database)    │          │
│  └─────────────────┘              └─────────────────┘          │
│                                                                  │
│  • Email/Password Auth    • OAuth Providers                     │
│  • Session Management     • Email Verification                  │
│  • Token Refresh          • Password Reset                      │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flows

### 1. Sign Up Flow

```
User                    Frontend                  Supabase
  │                        │                         │
  ├─ Fill Form ──────────►│                         │
  │                        │                         │
  │                        ├─ Validate Input         │
  │                        │                         │
  │                        ├─ signUpWithEmail() ────►│
  │                        │                         │
  │                        │                         ├─ Create Auth User
  │                        │                         │
  │                        │                         ├─ Send Verification Email
  │                        │                         │
  │                        │◄─ User Created ─────────┤
  │                        │                         │
  │                        ├─ Create User Profile ──►│
  │                        │                         │
  │                        │◄─ Profile Created ──────┤
  │                        │                         │
  │◄─ Success Message ────┤                         │
  │                        │                         │
  ├─ Redirect to Login ───┤                         │
  │                        │                         │
```

### 2. Login Flow

```
User                    Frontend                  Supabase
  │                        │                         │
  ├─ Enter Credentials ──►│                         │
  │                        │                         │
  │                        ├─ signInWithEmail() ────►│
  │                        │                         │
  │                        │                         ├─ Validate Credentials
  │                        │                         │
  │                        │                         ├─ Create Session
  │                        │                         │
  │                        │◄─ Session Token ────────┤
  │                        │                         │
  │                        ├─ Fetch User Profile ───►│
  │                        │                         │
  │                        │◄─ Profile Data ─────────┤
  │                        │                         │
  │◄─ Redirect to Profile ┤                         │
  │                        │                         │
```

### 3. Forgot Password Flow

```
User                    Frontend                  Supabase
  │                        │                         │
  ├─ Enter Email ────────►│                         │
  │                        │                         │
  │                        ├─ resetPasswordForEmail()►│
  │                        │                         │
  │                        │                         ├─ Generate Reset Token
  │                        │                         │
  │                        │                         ├─ Send Reset Email
  │                        │                         │
  │                        │◄─ Email Sent ───────────┤
  │                        │                         │
  │◄─ Success Message ────┤                         │
  │                        │                         │
  ├─ Check Email ─────────┤                         │
  │                        │                         │
```

### 4. Reset Password Flow (NEW)

```
User                    Frontend                  Supabase
  │                        │                         │
  ├─ Click Email Link ───►│                         │
  │                        │                         │
  │                        ├─ Validate Token ───────►│
  │                        │                         │
  │                        │◄─ Token Valid ──────────┤
  │                        │                         │
  │◄─ Show Reset Form ────┤                         │
  │                        │                         │
  ├─ Enter New Password ─►│                         │
  │                        │                         │
  │                        ├─ updatePassword() ─────►│
  │                        │                         │
  │                        │                         ├─ Update Password
  │                        │                         │
  │                        │◄─ Password Updated ─────┤
  │                        │                         │
  │◄─ Redirect to Login ──┤                         │
  │                        │                         │
```

### 5. Email Verification Flow (NEW)

```
User                    Frontend                  Supabase
  │                        │                         │
  ├─ Login ──────────────►│                         │
  │                        │                         │
  │                        ├─ Check Verification ───►│
  │                        │                         │
  │                        │◄─ Not Verified ─────────┤
  │                        │                         │
  │◄─ Show Banner ────────┤                         │
  │                        │                         │
  ├─ Click Resend ───────►│                         │
  │                        │                         │
  │                        ├─ resendVerificationEmail()►│
  │                        │                         │
  │                        │                         ├─ Send Email
  │                        │                         │
  │                        │◄─ Email Sent ───────────┤
  │                        │                         │
  │◄─ Success Message ────┤                         │
  │                        │                         │
  ├─ Click Email Link ───►│                         │
  │                        │                         │
  │                        │                         ├─ Verify Email
  │                        │                         │
  │◄─ Hide Banner ────────┤                         │
  │                        │                         │
```

## Component Hierarchy

```
App.jsx
├── Navbar.jsx
│   ├── User Avatar Dropdown
│   │   ├── Profile Link
│   │   ├── Orders Link
│   │   ├── Wishlist Link
│   │   └── Logout Button
│   └── Login/Signup Buttons (guests)
│
├── EmailVerificationBanner.jsx (NEW)
│   ├── Verification Status Check
│   ├── Resend Email Button
│   └── Dismiss Button
│
├── Routes
│   ├── Public Routes
│   │   ├── /login → LoginPage.jsx
│   │   ├── /signup → SignUpPage.jsx
│   │   ├── /forgot-password → ForgotPasswordPage.jsx
│   │   └── /reset-password → ResetPasswordPage.jsx (NEW)
│   │
│   └── Protected Routes
│       ├── /profile/* → UserProfileDashboard.jsx
│       │   ├── /account → MyAccount.jsx
│       │   ├── /orders → MyOrders.jsx
│       │   ├── /addresses → AddressBook.jsx
│       │   ├── /wishlist → Wishlist.jsx
│       │   └── /settings → SettingsPage.jsx
│       │       └── Password Change Form
│       │
│       ├── /checkout → CheckoutPage.jsx
│       └── /order → MyOrders.jsx
│
└── Footer.jsx
```

## State Management

```
AuthContext
├── State
│   ├── currentUser (Supabase auth user)
│   ├── userProfile (Database profile)
│   └── loading (Boolean)
│
├── Actions
│   ├── login(email, password)
│   ├── signup(email, password, name)
│   ├── loginWithGoogle()
│   ├── loginWithFacebook()
│   ├── logout()
│   └── refreshProfile()
│
└── Effects
    ├── Initialize Auth on Mount
    ├── Listen to Auth State Changes
    ├── Sync User Profile
    └── Handle Session Timeout
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  • Input Validation                     │
│  • Client-side Checks                   │
│  • Error Handling                       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Transport Layer                 │
│  • HTTPS Encryption                     │
│  • Secure Headers                       │
│  • CORS Protection                      │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Authentication Layer            │
│  • JWT Tokens                           │
│  • Session Management                   │
│  • Token Refresh                        │
│  • Email Verification                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  • Row Level Security (RLS)             │
│  • Encrypted Storage                    │
│  • Audit Logs                           │
└─────────────────────────────────────────┘
```

## Data Flow

```
User Action
    │
    ▼
UI Component
    │
    ▼
Auth Context
    │
    ▼
Auth Service
    │
    ▼
Supabase Client
    │
    ▼
Supabase Backend
    │
    ├─► Auth Database
    │
    └─► User Profiles Database
```

## Error Handling Flow

```
Error Occurs
    │
    ▼
Caught by Service Layer
    │
    ▼
Mapped to User-Friendly Message
    │
    ▼
Returned to Component
    │
    ▼
Displayed to User
    │
    ▼
User Takes Action
```

## Session Lifecycle

```
Login
  │
  ▼
Session Created
  │
  ├─► Store in localStorage
  │
  ├─► Set Auto-Refresh Timer
  │
  └─► Load User Profile
      │
      ▼
  User Active
      │
      ├─► Token Auto-Refresh (periodic)
      │
      ├─► Profile Sync (on auth change)
      │
      └─► Session Validation (on route change)
          │
          ▼
  Logout / Timeout
      │
      ▼
  Clear Session
      │
      ├─► Remove from localStorage
      │
      ├─► Clear User State
      │
      └─► Redirect to Login
```

---

This architecture ensures:
- ✅ Secure authentication
- ✅ Seamless user experience
- ✅ Proper error handling
- ✅ Session persistence
- ✅ Profile synchronization
- ✅ Protected routes
- ✅ Email verification
- ✅ Password management
