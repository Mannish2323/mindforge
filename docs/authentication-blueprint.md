# 📄 Learning Velmorth v3

# Document 6 — Complete Authentication, Authorization & User Management Blueprint

---

# 1. Authentication Overview

Learning Velmorth uses a secure authentication system powered by Supabase Authentication.

Authentication Goals

* Simple login
* Secure sessions
* Cross-device synchronization
* Minimal user friction
* Server-side validation
* Zero password management

---

# 2. Supported Authentication

## Primary Login

* Google Sign-In (Required)

## Future Ready

* Apple Sign-In
* Microsoft Sign-In
* GitHub Sign-In (Admin Only)

Email/password authentication is disabled for normal users.

---

# 3. User Lifecycle

```text
Open App
      ↓
Session Check
      ↓
Google Sign-In
      ↓
Google Consent
      ↓
Supabase Authentication
      ↓
JWT Generated
      ↓
Create User Profile
      ↓
Initialize User Data
      ↓
Dashboard
```

---

# 4. New User Onboarding

Automatically create:

* User Profile
* Learning Profile
* Free Subscription
* Notification Preferences
* Default Settings
* Daily Goal
* XP Record
* Sakura AI Context
* Analytics Profile
* Device Record

---

# 5. Returning User Flow

```text
Open App
      ↓
Restore Session
      ↓
Refresh Token
      ↓
Load Profile
      ↓
Load Dashboard
      ↓
Sync Progress
      ↓
Ready
```

---

# 6. Session Management

Every session stores:

* User ID
* Device ID
* Login Time
* Last Active
* Refresh Token
* JWT Expiry
* Platform (Web / Android / PWA)

Sessions refresh automatically before expiration.

---

# 7. Authorization (RBAC)

### Student

* Learn lessons
* Use Sakura AI
* Practice
* Community
* Premium

### Premium Student

Everything in Student plus:

* Premium Courses
* Unlimited AI
* Downloads
* Certificates
* Advanced Analytics

### Moderator

* Review Reports
* Moderate Community
* Hide Content

### Administrator

* Full Dashboard
* Content Management
* User Management
* Analytics
* Payments
* Feature Flags
* System Configuration

---

# 8. Protected Routes

Public

* Splash
* Login
* Privacy Policy
* Terms
* Help

Protected

* Dashboard
* Lessons
* Vocabulary
* Grammar
* Kanji
* Writing
* Speaking
* Listening
* Reading
* Quiz
* Sakura AI
* Community
* Profile
* Premium
* Settings

Unauthorized users are redirected to Google Login.

---

# 9. User Profile Structure

Each user stores:

* Display Name
* Avatar
* Email
* Country
* Preferred Language
* Target JLPT Level
* Daily Goal
* XP
* Current Level
* Premium Status
* Join Date
* Last Login
* Device Count

---

# 10. Account Settings

Users can manage:

* Language
* Theme
* Notification Preferences
* Reminder Time
* AI Voice
* Accessibility
* Privacy
* Connected Devices

Changes sync across all devices instantly.

---

# 11. Multi-Device Support

Supported Devices

* Android
* Web Browser
* PWA
* Future iOS

Progress, settings, and achievements remain synchronized.

---

# 12. Logout Workflow

```text
User Clicks Logout
      ↓
Invalidate Session
      ↓
Clear Local Cache
      ↓
Remove Tokens
      ↓
Return to Login
```

---

# 13. Account Deletion

Workflow

```text
Delete Request
      ↓
Identity Verification
      ↓
Confirmation
      ↓
Delete Personal Data
      ↓
Revoke Sessions
      ↓
Remove Tokens
      ↓
Archive Required Records
      ↓
Account Closed
```

---

# 14. Security Features

* Google OAuth only
* JWT Authentication
* Refresh Tokens
* Secure Cookies (Web)
* Encrypted Storage (Android)
* HTTPS Only
* CSRF Protection
* XSS Protection
* SQL Injection Protection
* Rate Limiting
* Audit Logging

---

# 15. Login Error Handling

Possible Cases

* No Internet
* Google Authentication Cancelled
* Invalid Session
* Token Expired
* Server Error
* Account Disabled

Each case should display a clear message with retry options.

---

# 16. Authentication Checklist

✔ Google Sign-In

✔ Session Restore

✔ Refresh Tokens

✔ Secure Logout

✔ Multi-device Support

✔ Protected Routes

✔ Role-based Access Control

✔ Profile Synchronization

✔ Account Deletion

✔ Security Logging

✔ Production Ready

---

# Final Authentication Principles

* Google Login only
* No password management
* Secure by default
* Cross-device synchronization
* Role-based authorization
* Fast session restoration
* Privacy-first architecture
* Fully integrated with Supabase
* Production-ready for Web, Android, and PWA
