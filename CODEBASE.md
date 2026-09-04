# Frontend Codebase Reference (React 19 + TypeScript + Vite)

Deep, factual reference for AI agents and developers. **Last verified: 2026-09-02.**
If you modify code that alters any architecture, feature modules, state slices, or routes documented here, update this file in the same change.
Operational instructions & boundaries: [`AGENTS.md`](./AGENTS.md).

> **Staleness rule:** If this file is >4 weeks old, verify routes and features against `src/route.tsx` and `src/features/` before trusting it.

## 1. Stack

| Layer               | Technology            | Details                                                    |
| ------------------- | --------------------- | ---------------------------------------------------------- |
| Framework / Bundler | Vite 8 + React 19     | ESM-based frontend development server & builder            |
| Language            | TypeScript 6          | Strict type checking (`tsc -b`)                            |
| CSS & Styling       | Tailwind CSS v4       | Native CSS imports via `@tailwindcss/vite`, Geist font     |
| UI Primitives       | Shadcn UI / Radix UI  | Accessible UI components (`src/components/ui/`)            |
| State Management    | Redux Toolkit         | Central store (`src/store/index.ts`) & feature slices      |
| Routing             | React Router v7       | Declarative routing with layout wrappers (`src/route.tsx`) |
| HTTP Client         | Axios                 | Configured instance with interceptors (`src/api/axios.ts`) |
| Forms & Validation  | React Hook Form + Zod | Schema-based form state and validation resolvers           |
| Tables & Data       | TanStack React Table  | Headless datatables with sorting and filtering             |

## 2. Architecture (How Things Connect)

```text
Application Mounting
  → src/main.tsx (Root DOM mounting)
      → Redux Provider (src/store/index.ts)
          → RouterProvider (src/route.tsx)
              → Layout Wrappers (src/layouts/ - Sidebar, Navbar, Breadcrumbs)
                  → Feature Pages / Views (src/features/{role}/{feature}/)
                      → UI Components (src/components/ui/ + feature components)
                      → Custom Hooks (src/hooks/ or local feature hooks)
                      → Central Axios API Client (src/api/axios.ts)
                          → Backend REST API (Laravel Sanctum protected)
```

## 3. Project Structure

```text
frontend/src/
├── api/
│   └── axios.ts                       # Configured Axios client with Bearer auth interceptors
├── assets/                            # Static assets, logos, illustration SVGs
├── components/
│   ├── custom/                        # Reusable global elements (PageHeader, Topbar, AppSidebar, DataTable, StatCard, DocumentListCard, DocumentPreviewModal)
│   └── ui/                            # Shadcn UI primitives & modal boilerplate (Button, Dialog, Modal, etc.)
├── config/
│   └── menus.ts                       # Sidebar menus per role (STUDENT_MENUS, ADMIN_MENUS, HRD_MENUS)
├── features/                          # role-based feature modules (kebab-case per feature domain)
│   ├── auth/
│   │   └── login/                     # Login feature domain (target pattern)
│   │       ├── login.api.ts
│   │       ├── login.schema.ts
│   │       ├── login-form.tsx
│   │       └── login-page.tsx
│   ├── student/                       # Student portal feature module
│   │   ├── e-portfolio/               # Fitur real E-Portofolio (akan dipolish rekan FE)
│   │   │   ├── portfolio.api.ts            # API request functions (axios)
│   │   │   ├── portfolio.form.ts           # Form setup (react-hook-form + zod)
│   │   │   ├── portfolio.schema.ts         # Zod validation schemas & types
│   │   │   ├── portfolio-header.tsx
│   │   │   ├── personal-academic-form.tsx
│   │   │   ├── upload-document-modal.tsx
│   │   │   └── portofolio-page.tsx
│   │   ├── lamaran/                   # [Planned] lamaran-page.tsx + lamaran.api.ts
│   │   ├── absensi/                   # [Planned]
│   │   ├── tracer-study/              # [Planned]
│   │   └── route.tsx                  # Student sub-routes (agregator per-feature)
│   ├── admin/                         # Administrator portal module (dashboard, siswa, alumni, dudi, lowongan, seleksi, validasi-absensi, penempatan, tracer, laporan)
│   ├── hrd/                           # [Planned] Corporate HRD portal module
│   └── alumni/                        # [Planned] Alumni portal module
├── hooks/                             # Global reusable React hooks
│   ├── useApp.ts                      # Typed Redux hooks (useAppDispatch / useAppSelector)
│   ├── useNotification.ts             # Realtime notification helper (Echo + polling)
│   └── use-mobile.ts                  # Mobile breakpoint detector
├── layouts/                           # Master layout wrappers (auth.layout.tsx, main.layout.tsx)
├── lib/
│   ├── utils.ts                       # Utility functions including cn() class merger
│   └── echo.ts                        # Laravel Echo (Reverb) instantiation
├── slices/
│   └── authSlice.ts                   # Redux slice for user session, role, and token
├── store/
│   └── index.ts                       # Redux store configuration and RootState/AppDispatch exports
├── App.tsx                            # Root application component
├── main.tsx                           # React entry point
├── route.tsx                          # Top-level routing configuration
└── index.css                          # Global styles, Tailwind v4 imports, CSS variables
```

## 4. Feature Module Pattern

Features follow an **Role -> Feature Domain (kebab-case) -> Flat Files** organization:

1. **Role Level (`src/features/{role}`):** Groups modules by user persona (`auth`, `student`, `admin`, `hrd`, `alumni`).
2. **Feature Level (`src/features/{role}/{kebab-feature}`):** Dedicated folder per business capability (e.g. `student/lowongan-kerja`, `student/e-portfolio`, `student/lamaran`, `admin/penempatan`).
3. **Files inside Feature Domain:**
   - `kebab-feature.api.ts` — Axios request functions for the feature endpoints (e.g. `portfolio.api.ts`). Uses central `api` from `src/api/axios.ts`, never raw `fetch()` or new Axios instance.
   - `kebab-feature.schema.ts` — Zod validation schemas & inferred TypeScript types (e.g. `portfolio.schema.ts`).
   - `kebab-feature.form.ts` — Form setup using react-hook-form + zod resolver (e.g. `portfolio.form.ts`). Encapsulates form configuration and submit logic.
   - `kebab-feature-page.tsx` — Main page/container component (PascalCase for component, kebab-case for file). Example: `lowongan-kerja-page.tsx` exports `LowonganKerjaPage`.
   - `components/` — Optional subfolder only if the feature needs specific presentational components not reusable globally. Otherwise use `src/components/custom/` or `src/components/ui/`. Generic/reusable cards/modals (e.g. `document-list-card.tsx`, `document-preview-modal.tsx`) belong in `src/components/custom/` per leader feedback.
   - `useKebabFeature.ts` — Optional local hook (`camelCase.ts`) encapsulating queries/mutations if needed.

Routing stays at role level: `src/features/{role}/route.tsx` imports each `*-page.tsx` from its feature domain and exports an array (e.g. `studentRoute`) consumed by `src/route.tsx`.

Example for `student`:

```text
features/student/
├── lowongan-kerja/
│   ├── lowongan-kerja.api.ts
│   ├── lowongan-kerja.schema.ts
│   └── lowongan-kerja-page.tsx
├── e-portfolio/
│   ├── portfolio.api.ts                # API functions (axios)
│   ├── portfolio.form.ts               # Form setup (react-hook-form + zod)
│   ├── portfolio.schema.ts             # Zod schemas & types
│   ├── portfolio-header.tsx
│   ├── personal-academic-form.tsx
│   ├── upload-document-modal.tsx
│   └── portofolio-page.tsx
│   # document-list-card.tsx & document-preview-modal.tsx → src/components/custom/
└── route.tsx
```

## 5. State Management & Redux Store

- Store entry point: `src/store/index.ts`.
- Slices located in `src/slices/`.
- Type helper exports:
  ```typescript
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  ```
- Use `authSlice.ts` to manage:
  - `user`: Authenticated user entity with roles.
  - `token`: Sanctum Bearer token (synced with storage).
  - `isAuthenticated`: Boolean state flag.

## 6. API Client & Networking Layer

- Single Axios instance exported from `src/api/axios.ts`.
- Base URL configured from environment variable `VITE_API_URL` (fallback `http://localhost:8000/api`).
- Request Interceptor: Injects `Authorization: Bearer ${token}` retrieved from `localStorage.getItem("access_token")`.
- Response Interceptor:
  - Passes successful responses through.
  - Handles `401 Unauthorized` by clearing `access_token` and redirecting to `/login`.
  - Backend envelope is `{ success: boolean, message: string, data: {}, errors? }` — access payload via `response.data.data`.
  - Catches `422 Unprocessable Content` and surfaces validation error maps where needed.

## 7. Reusable Component Conventions

- **Page Header (`src/components/custom/page-header.tsx`):** Universal top banner with role theming (`admin`, `student`, `alumni`, `hrd`, `auto`). Supports self-closing props (`badge`, `title`, `description`, `titleAs`) and interactive children (`PageHeader.Button`, `PageHeader.NotificationCard`, `PageHeader.StatCard`).
- **Modal Boilerplate (`src/components/ui/modal.tsx`):** Dual-mode dialog wrapper over Radix UI primitives (`src/components/ui/dialog.tsx`). Use `<Modal ... />` for standard form workflows, or compound primitives (`Modal.Root`, `Modal.Content`, `Modal.Header`, `Modal.Body`, `Modal.Footer`) for custom multi-column layouts.
- **DataTable (`src/components/custom/data-table.tsx`):** Generic `<T>` table with loading skeleton, empty state, sorting/filtering via TanStack.

## 8. Password Reset Flow (auth feature)

1. Login page → "Lupa Password" opens `ForgotPasswordModal` → `POST /forgot-password` with email; success panel instructs checking inbox.
2. Backend emails SPA link `/reset-password?token=...&email=...`.
3. `ResetPasswordPage` (`features/auth/pages/reset-password.tsx`) reads query params, validates password + confirmation (zod, min 8), submits `POST /reset-password`, then redirects to `/login` with `state.flashMessage` shown as success banner. Invalid/missing params render an invalid-link state.
