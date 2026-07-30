# Multi‑Phase Implementation Plan for Mindforge

## Goal Description
We will build the full backend and supporting frontend scaffolding for the Mindforge platform according to the 12 phases you outlined. The work proceeds incrementally, with a verification report after each phase before moving to the next.

---

## User Review Required
> [!IMPORTANT]
> • Confirm the **naming conventions** for generated files (e.g., `src/lib/supabaseClient.ts` vs `src/supabase/client.ts`).
> • Approve the **folder layout** for feature‑first architecture (see proposed structure below).
> • Confirm the **migration naming scheme** (e.g., `20240628_initial_schema.sql`).
> • Let us know if any **existing environment variables** (e.g., `NEXT_PUBLIC_SUPABASE_URL`) need to stay untouched or if additional ones may be added.
> • Verify that we may create **new directories** under `src/` (features, database, services, stores, etc.) without altering existing code.

---

## Open Questions
- Do you prefer the Supabase client to be exported as a singleton from `src/lib/supabase.ts` or placed under a dedicated `src/supabase/` folder?
- Should the **Zustand** stores be placed in `src/store/` or `src/state/`?
- Do you have a preferred **SQL dialect** for migrations (plain SQL vs Supabase migration format)?
- Are there any **code style presets** beyond the existing ESLint/Prettier that should be enforced (e.g., specific import ordering)?

---

## Proposed Changes

### Phase 1 – Project Foundation
- **Create feature‑first folder structure** under `src/`:
  - `src/features/<feature-name>/` (e.g., `auth`, `lesson`, `vocabulary`)
  - `src/components/shared/` for UI primitives.
  - `src/database/` with subfolders for each domain (identity, learning, progress, etc.).
  - `src/types/` for shared TypeScript types.
  - `src/constants/` for enum/constant definitions.
  - `src/validation/` for Yup/Zod schemas.
- **Placeholder TypeScript models** (`*.model.ts`) in each domain folder.
- **Repository interfaces** (`*.repository.ts`) defining CRUD signatures.
- **Shared types** (`src/types/index.ts`).
- **Constants file** (`src/constants/index.ts`).
- **Validation schemas** (`src/validation/<domain>.schema.ts`).

### Phase 2 – Supabase Foundation
- Add **Supabase client** (`src/lib/supabaseClient.ts`) that reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env`.
- Export **server‑side client** using `createServerSupabaseClient` (Next.js `server` utilities).
- Export **browser client** for client‑side use.
- Create **middleware** (`src/middleware/auth.ts`) for protecting API routes.
- Add **authentication helpers** (`src/lib/auth.ts`).
- Add **RLS helpers**, **storage helpers**, **realtime helpers**, and **edge‑function helpers** under `src/lib/`.

### Phase 3 – Database
- Generate **SQL migration files** in `supabase/migrations/` for each domain (Identity, Learning, …, AI).
- Include **indexes**, **foreign keys**, **constraints**, **views**, **functions**, **triggers**, **RLS policies**.
- Provide a **master migration script** that runs all migrations sequentially.

### Phase 4 – Repository Layer
- For each domain, create a concrete repository class (e.g., `src/database/identity/IdentityRepository.ts`) implementing the previously defined interfaces and using the Supabase client.

### Phase 5 – Services
- Create service wrappers (`src/services/<domain>Service.ts`) that inject the corresponding repository.
- Example: `AuthService` uses `IdentityRepository` and `supabase` helpers.

### Phase 6 – State Management
- Add **Zustand stores** under `src/store/` for the listed domains (auth, profile, dashboard, …, offlineQueue).

### Phase 7 – API Contracts
- Generate **request/response TypeScript interfaces**, validation schemas, and OpenAPI‑like documentation under `src/api/contracts/`.

### Phase 8 – Notifications Engine
- Implement a **notification service** (`src/services/NotificationService.ts`) coordinating DB writes, push dispatch (using Supabase realtime), and UI animation triggers.
- Add **notification types** and **templates**.

### Phase 9 – Offline Sync
- Create an **offline queue** system (`src/offline/Queue.ts`) with conflict‑resolution logic and background sync using Supabase realtime.

### Phase 10 – Security
- Configure **JWT** handling, refresh‑token flow, RLS enforcement, rate‑limiting middleware, audit‑log helpers.

### Phase 11 – Testing Foundation
- Add **Jest** config and sample test files for unit, integration, API, and database layers under `__tests__/`.

### Phase 12 – Code Quality
- Ensure **strict TypeScript** (`tsconfig.json` already strict), run **ESLint** and **Prettier** on all new files.
- Follow **Atomic Design** for UI components, **Dependency Injection** for services, and avoid duplicated logic.

---

## Verification Plan
- After each phase we will run `npm run lint`, `npm run test`, and `npm run build` to ensure no compile or lint errors.
- Database migrations will be applied to a local Supabase Docker instance (or Supabase CLI) and verified with `supabase db lint`.
- Reports will be generated as markdown artifacts (`phaseX_report.md`).

**Please review the plan and approve** so we can begin Phase 1. If any adjustments are needed, let us know.

---

*Artifact metadata*: RequestFeedback = true, Summary = "Multi‑phase implementation plan", UserFacing = true.
