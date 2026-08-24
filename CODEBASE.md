# Frontend Codebase Reference (React 19 + TypeScript + Vite)

Deep, factual reference for AI agents and developers. **Last verified: 2026-08-22.**
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
│   ├── custom/                        # Reusable global layout elements (PageHeader, Topbar, AppSidebar)
│   └── ui/                            # Shadcn UI primitives & modal boilerplate (Button, Dialog, Modal, etc.)
├── config/                            # Runtime configurations and constants
├── features/                          # role-based feature modules
│   ├── auth/                          # Authentication feature module
│   │   ├── components/                # Auth-specific UI elements (LoginForm, OTPInput)
│   │   ├── pages/                     # Login & Register views
│   │   └── route.tsx                  # Auth sub-routing definitions
│   ├── student/                       # Student portal feature module
│   │   ├── components/                # Student-specific widgets & panels
│   │   ├── pages/                     # dashboard, absensi, lamaran, lowongan, portofolio, tracer
│   │   └── route.tsx                  # Student sub-routes
│   ├── admin/                         # [Planned] Administrator portal module
│   ├── hrd/                           # [Planned] Corporate HRD portal module
│   └── alumni/                        # [Planned] Alumni portal module
├── hooks/                             # Global reusable React hooks (useAuth, useDebounce, etc.)
├── layouts/                           # Master layout wrappers (AuthLayout, DashboardLayout, etc.)
├── lib/
│   └── utils.ts                       # Utility functions including cn() class merger
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

Features follow an **role -> Feature Folder -> Flat Files** organization:

1. **role Level (`src/features/{role}`):** Groups modules by user persona (`auth`, `student`, `admin`, `hrd`, `alumni`).
2. **Feature Level (`src/features/{role}/{feature}`):** Dedicated folder per sub-capability.
3. **Files inside Feature:**
   - `{Feature}API.ts` — Axios request functions for the feature endpoints.
   - `{Feature}Hook.ts` — React custom hooks encapsulating local state, queries, and mutations.
   - `{Feature}View.tsx` — Main presentational/container React component.
   - `{Feature}Types.ts` — TypeScript interfaces for request payloads, response entities, and props.

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
- Base URL configured from environment variable `VITE_API_BASE_URL` (fallback `http://localhost:8000/api`).
- Request Interceptor: Injects `Authorization: Bearer <token>` retrieved from state/storage.
- Response Interceptor:
  - Unwraps response envelopes matching `{ success: true, message, data, errors }`.
  - Handles `401 Unauthorized` by triggering auth state reset and redirecting to `/login`.
  - Catches `422 Unprocessable Content` and surfaces validation error maps.

## 7. Reusable Component Conventions

- **Page Header (`src/components/custom/page-header.tsx`):** Universal top banner with role theming (`admin`, `student`, `alumni`, `hrd`, `auto`). Supports self-closing props (`badge`, `title`, `description`, `titleAs`) and interactive children (`PageHeader.Button`, `PageHeader.NotificationCard`, `PageHeader.StatCard`).
- **Modal Boilerplate (`src/components/ui/modal.tsx`):** Dual-mode dialog wrapper over Radix UI primitives (`src/components/ui/dialog.tsx`). Use `<Modal ... />` for standard form workflows, or compound primitives (`Modal.Root`, `Modal.Content`, `Modal.Header`, `Modal.Body`, `Modal.Footer`) for custom multi-column layouts.
