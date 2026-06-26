# Learn with Velmorth v2 — API Contracts

This document specifies the Next.js Route Handlers (REST API endpoints) and server-side logic details for the platform.

---

## AI Endpoints

### 1. AI Tutor Gateway (`POST /api/ai`)
Interacts with the Google Gemini API (Sakura assistant personality). Enforces rate limits and quotas based on user subscription levels.
- **Request Headers:**
  - `Authorization: Bearer <Supabase JWT>`
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "How do I conjugate Taberu?" }
    ],
    "context": {
      "jlptLevel": "N5",
      "lessonId": "verb_conjugation_1"
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "response": "To conjugate the verb 食べる (taberu - to eat) into polite form...",
    "usage": { "promptTokens": 102, "completionTokens": 240 }
  }
  ```

---

## Payment Endpoints (Razorpay)

### 2. Create Order (`POST /api/create-order`)
Generates a unique order ID from Razorpay to initiate client-side checkout.
- **Request Body:**
  ```json
  {
    "planId": "pro",
    "billingCycle": "monthly"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "orderId": "order_OkD123xyz",
    "amount": 49900,
    "currency": "INR"
  }
  ```

### 3. Verify Payment (`POST /api/verify-payment`)
Validates Razorpay transaction validity server-side using HMAC SHA256 signatures before provisioning premium entitlements.
- **Request Body:**
  ```json
  {
    "razorpay_order_id": "order_OkD123xyz",
    "razorpay_payment_id": "pay_OkP456abc",
    "razorpay_signature": "abcdef0123456789..."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "status": "active",
    "planId": "pro"
  }
  ```

---

## Lesson & Progress Endpoints

### 4. Score Lesson (`POST /api/score-lesson`)
Validates lesson answers, calculates final scores, processes XP values, and checks for streak completions.
- **Request Body:**
  ```json
  {
    "lessonId": "vocab_n5_animals",
    "answers": [
      { "questionId": "q_dog", "submitted": "いぬ", "correct": true }
    ],
    "durationSeconds": 180
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "xpEarned": 20,
    "gemsEarned": 5,
    "streakDays": 5,
    "completed": true
  }
  ```

### 5. Fetch Due SRS Reviews (`GET /api/vocab/due`)
Retrieves the Spaced Repetition queue for the authenticated user.
- **Response (200 OK):**
  ```json
  {
    "dueCount": 12,
    "items": [
      { "wordId": "vocab_001", "word": "車", "reading": "くるま", "meaning": "car", "intervalDays": 2 }
    ]
  }
  ```
