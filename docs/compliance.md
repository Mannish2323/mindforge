# Mindforge — Android Permissions, Security & Legal Compliance (Production)

---

# Android Permissions

## Required Permissions

```text
Internet
✓ API Communication
✓ AI Chat
✓ Authentication

Network State
✓ Check Internet
✓ Offline Detection

Notifications
✓ Daily Reminder
✓ Streak Reminder
✓ Sakura AI Reminder
✓ Lesson Reminder

Vibration
✓ Notification Feedback
✓ Button Haptics

Wake Lock
✓ Prevent Sleep During Lessons

Foreground Service
✓ Background Lesson Sync
```

---

## Optional Permissions (Ask Only When Needed)

```text
Microphone
✓ Speaking Practice
✓ AI Conversation
✓ Pronunciation Check

Storage (Photos/Videos)
✓ Upload Avatar
✓ Export Certificate
✓ Download Lessons

Camera
✓ Profile Photo
✓ Future OCR Features

Media Access
✓ Import Images
✓ Learning Attachments
```

> Never request optional permissions during first launch. Ask only when the user starts the related feature.

---

# Permission Flow

```text
User Opens Feature
        │
        ▼
Permission Needed?
        │
        ├── NO → Continue
        │
        └── YES
              │
              ▼
Explain Why Permission Is Needed
              │
              ▼
System Permission Dialog
              │
       ┌──────┴──────┐
       │             │
   Granted        Denied
       │             │
       ▼             ▼
 Continue      Explain + Retry
```

---

# Privacy Policy

The application must include:

* Information collected
* Why information is collected
* How data is stored
* AI usage disclosure
* Payment data policy
* Analytics policy
* Cookies (Web)
* User rights
* Data deletion process
* Contact details
* Last updated date

---

# Terms & Conditions

Include:

* User responsibilities
* Acceptable use policy
* AI disclaimer
* Subscription terms
* Payment terms
* Refund policy
* Content ownership
* Intellectual property
* Community rules
* Account suspension policy
* Limitation of liability
* Governing law
* Contact information

---

# Refund Policy

Include:

* Eligible refunds
* Non-refundable purchases
* Processing time
* Contact method
* Razorpay refund workflow

---

# Cookie Policy (Web)

Include:

* Essential cookies
* Analytics cookies
* Functional cookies
* Cookie preferences
* Consent management

---

# Data Deletion Policy

Users must be able to:

* Delete account
* Delete AI conversations
* Delete progress
* Delete uploaded media
* Export their data before deletion

Account deletion should remove or anonymize personal data according to your retention policy.

---

# Security Requirements

## Authentication

```text
✓ Supabase Auth
✓ Secure Sessions
✓ Email Verification
✓ Password Reset
```

## API

```text
✓ HTTPS Only
✓ Server-side Secrets
✓ Input Validation
✓ Rate Limiting
```

## Database

```text
✓ Row Level Security (RLS)
✓ Least-Privilege Access
✓ Audit Logs
```

## Payments

```text
✓ Razorpay Signature Verification
✓ Server-side Validation
✓ Subscription Sync
```

---

# AI Usage Policy

Users must know:

* Sakura AI uses external AI services.
* Conversations may be processed to generate responses.
* API keys are never exposed to users.
* Usage limits depend on the selected plan.

---

# Accessibility

Support:

* Screen Readers
* Dynamic Font Sizes
* High Contrast
* Keyboard Navigation (Web)
* Accessible Labels
* Focus Indicators

---

# App Store Readiness

Before release verify:

```text
✓ Privacy Policy page
✓ Terms & Conditions page
✓ Refund Policy page
✓ Contact Us page
✓ About page
✓ Help Center
✓ FAQ
✓ Data Deletion page
✓ Permissions explained
✓ Secure authentication
✓ Payment verification
✓ No exposed API keys
✓ Responsive layouts
✓ No crashes
✓ Production build passes
```

---

# Legal Pages Required

* Privacy Policy
* Terms & Conditions
* Refund Policy
* Cookie Policy
* Data Deletion Policy
* Community Guidelines
* AI Usage Policy
* Contact Us
* About Mindforge
* Help Center
* FAQ

---

# Final Compliance Checklist

```text
Android Permissions
✔ Required
✔ Optional (On-Demand)

Legal
✔ Privacy Policy
✔ Terms & Conditions
✔ Refund Policy
✔ Cookie Policy
✔ Data Deletion

Security
✔ RLS
✔ Secure Auth
✔ API Validation
✔ HTTPS
✔ Payment Verification

Store Readiness
✔ Google Play Ready
✔ PWA Ready
✔ Production Ready
```
