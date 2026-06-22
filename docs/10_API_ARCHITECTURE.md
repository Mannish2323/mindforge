# LEARN WITH VELMORTH — API ARCHITECTURE
## Section 10: API Design & Architecture

---

## 10.1 API DESIGN PRINCIPLES

Learn With Velmorth utilizes RESTful APIs for client-to-backend communication:
- **Authentication**: All sensitive requests are secured via Firebase and Supabase JWT tokens.
- **REST Endpoints**: Simple JSON request and response payloads.
- **Unified Gateway**: Coordinates route security, rate limiting, and analytics.

---

## 10.2 API ROUTE INDEX

### Next.js Serverless APIs (`apps/web/app/api`)

#### 1. Vocabulary learned words Sync
- **`POST /api/vocab/learned`**
  - **Description**: Registers words marked as studied or eligible for review.
  - **Auth**: Required (Supabase session token).
  - **Payload**:
    ```json
    { "wordId": "string", "quizEligible": "boolean" }
    ```

#### 2. Usage limits check
- **`GET /api/limits/check`**
  - **Description**: Verifies if the current user has exceeded their daily heart capacity or AI requests limits.
  - **Auth**: Required (Supabase session token).
  - **Response 200**:
    ```json
    {
      "aiRequestsUsed": 3,
      "aiRequestsLimit": 5,
      "lessonsStarted": 2,
      "lessonsLimit": 5,
      "heartsRemaining": 22
    }
    ```

#### 3. Razorpay Orders billing
- **`POST /api/billing/create-order`**
  - **Description**: Creates a new payment order using the Razorpay SDK.
  - **Payload**:
    ```json
    { "planId": "string (e.g. 'plus', 'pro')" }
    ```
  - **Response 200**:
    ```json
    { "orderId": "order_OkD818...", "amount": 999, "currency": "INR" }
    ```

- **`POST /api/billing/verify`**
  - **Description**: Validates signature callback hashes returned by Razorpay Web checkout.
  - **Payload**:
    ```json
    {
      "razorpay_order_id": "string",
      "razorpay_payment_id": "string",
      "razorpay_signature": "string"
    }
    ```
  - **Response 200**:
    ```json
    { "verified": true, "message": "Plan activated successfully" }
    ```

- **`POST /api/billing/cancel`**
  - **Description**: Cancels subscription renewal rules in client entitlements.
  - **Auth**: Required.

---

## 10.3 FUTURE NODE.JS + EXPRESS API GATEWAY (ON RENDER)

Future architecture will route all mobile (Flutter) and web traffic through a unified **Node.js & Express** REST gateway.

### Gateway Responsibilities
- **Authentication Validation**: Verifies Firebase identity headers.
- **API Security**: Implements CORS allowlists and helmet headers.
- **Rate Limiting**: Employs redis rate-limiters (e.g., max 100 requests per 15 minutes for guest users).
- **AI Requests Routing**: Validates token usage metrics before calling Gemini/OpenAI/Perplexity.
- **Analytics Collection**: Dispatches user activity logs asynchronously to the analytics store.
