# Frontend Codebase Reference (React 19 + TypeScript + Vite)

Deep, factual reference for AI agents and developers. **Last verified: 2026-09-11.**
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
| Tables & Data       | TanStack React Table  | Headless datatables with sorting, pagination, & filtering  |

## 2. Architecture (How Things Connect)

```text
Application Mounting
  → src/main.tsx (Root DOM mounting)
      → Redux Provider (src/store/index.ts)
          → RouterProvider (src/route.tsx)
              → Layout Wrappers (src/layouts/ - Sidebar, Navbar, Breadcrumbs)
                  → Role-Guarded Feature Pages / Views (src/features/{role}/{feature}/)
                      → UI Components (src/components/ui/ + custom/)
                      → Custom Hooks (feature hooks or src/hooks/)
                      → Feature API Modules (src/features/{role}/{feature}/*.api.ts)
                          → Central Axios API Client (src/api/axios.ts)
                              → Backend REST API (Laravel Sanctum protected)
```

Route guards (`ProtectedRoute`, `DashboardRedirector`) live at the auth role root (`src/features/auth/`) and are consumed by `src/route.tsx`.

## 3. Project Structure

```text
frontend/src/
├── api/
│   ├── axios.ts                         # Configured Axios client with Bearer auth interceptors
│   └── select-options.ts                # Centralized async paginated options API
├── assets/                              # Static assets, logos, illustration SVGs
├── components/
│   ├── custom/                          # Reusable global elements (PageHeader, Topbar, AppSidebar, DataTable, StatCard, GenericDummyPage, AsyncSearchableSelect, etc.)
│   └── ui/                              # Shadcn UI primitives (Button, Dialog, Modal, SearchableSelect, etc.)
├── config/
│   └── menus.ts                         # Sidebar menus per role (STUDENT_MENUS, ADMIN_MENUS, HRD_MENUS)
├── features/                            # Role-based feature modules (kebab-case per feature domain)
│   ├── auth/
│   │   ├── protected-route.tsx        # Role-aware route guard
│   │   ├── dashboard-redirector.tsx   # Redirects "/" to role dashboard
│   │   ├── route.tsx                  # Auth sub-routes
│   │   ├── login/                     # login-page.tsx, login-form.tsx, login.schema.ts, login.form.ts, login.api.ts
│   │   ├── forgot-password/           # forgot-password-modal.tsx, forgot-password-form.tsx, forgot-password.schema.ts, forgot-password.form.ts, forgot-password.api.ts
│   │   └── reset-password/            # reset-password-page.tsx, reset-password-form.tsx, reset-password.schema.ts, reset-password.form.ts, reset-password.api.ts
│   ├── student/                       # Student portal feature module
│   │   ├── route.tsx                  # Student sub-routes
│   │   ├── dashboard/                 # dashboard-page.tsx
│   │   ├── lowongan-kerja/            # lowongan-kerja-page.tsx
│   │   ├── lamaran/                   # lamaran-page.tsx
│   │   ├── e-portfolio/               # portofolio-page.tsx, personal-academic-form.tsx, portfolio.api.ts, portfolio.schema.ts, portfolio.form.ts, modals
│   │   └── tracer-study/              # tracer-page.tsx
│   ├── admin/                         # Administrator portal module
│   │   ├── route.tsx                  # Admin sub-routes
│   │   ├── dashboard/                 # dashboard-page.tsx
│   │   ├── users/                     # users-page.tsx, users-form.tsx, users-table.tsx, users.api.ts, users.schema.ts, users.form.ts
│   │   ├── dudi/                      # dudi-page.tsx, dudi-form.tsx, dudi-table.tsx, dudi.api.ts, dudi.schema.ts, dudi.form.ts
│   │   ├── siswa/                     # siswa-page.tsx, siswa-form.tsx, siswa-table.tsx, siswa.api.ts, siswa.schema.ts, siswa.form.ts
│   │   ├── alumni/                    # alumni-page.tsx, alumni-form.tsx, alumni-detail-modal.tsx, alumni-table.tsx, alumni.api.ts, alumni.schema.ts, alumni.form.ts
│   │   ├── lowongan-kerja/            # lowongan-kerja-page.tsx and lowongan-kerja subcomponents
│   │   ├── seleksi/                   # seleksi-page.tsx
│   │   ├── validasi-absensi/          # validasi-absensi-page.tsx
│   │   ├── penempatan/                # penempatan-page.tsx
│   │   ├── tracer-study/              # tracer-page.tsx, tracer-stats-cards.tsx, tracer-detail-modal.tsx, tracer-form-modal.tsx, tracer-table.tsx, tracer.api.ts, tracer.schema.ts
│   │   └── laporan/                   # laporan-page.tsx
│   └── hrd/                           # [Planned] Corporate HRD portal module
├── hooks/                             # Global reusable React hooks
├── layouts/                           # Master layout wrappers (auth.layout.tsx, main.layout.tsx)
├── lib/                               # Utility functions (cn) & Echo
├── slices/                            # Redux authSlice
├── store/                             # Redux store index
├── main.tsx                           # React entry point
├── route.tsx                          # Top-level routing configuration
└── index.css                          # Global styles, Tailwind v4 imports, CSS variables
│   │   ├── protected-route.tsx          # Role-aware route guard (siswa, alumni, admin, superadmin, hrd)
│   │   ├── dashboard-redirector.tsx     # Redirects "/" to respective role dashboard
│   │   ├── route.tsx                    # Auth sub-routes
│   │   ├── login/                       # login-page.tsx, login-form.tsx, login.schema.ts, login.form.ts, login.api.ts
│   │   ├── forgot-password/             # forgot-password-modal.tsx, forgot-password-form.tsx, forgot-password.schema.ts, forgot-password.form.ts, forgot-password.api.ts
│   │   └── reset-password/              # reset-password-page.tsx, reset-password-form.tsx, reset-password.schema.ts, reset-password.form.ts, reset-password.api.ts
│   ├── student/                         # Student & Alumni portal feature module
│   │   ├── route.tsx                    # Student sub-routes
│   │   ├── dashboard/                   # dashboard-page.tsx
│   │   ├── lowongan-kerja/              # lowongan-kerja-page.tsx
│   │   ├── lamaran/                     # lamaran-page.tsx
│   │   ├── e-portfolio/                 # portofolio-page.tsx, personal-academic-form.tsx, portfolio.api.ts, portfolio.schema.ts, portfolio.form.ts, modals
│   │   └── tracer-study/                # tracer-page.tsx
│   ├── admin/                           # Administrator portal module (admin, superadmin)
│   │   ├── route.tsx                    # Admin sub-routes
│   │   ├── dashboard/                   # dashboard-page.tsx
│   │   ├── departemen/                  # departemen-page.tsx, departemen-form.tsx, departemen-table.tsx, departemen.api.ts, departemen.schema.ts, departemen.form.ts
│   │   ├── jurusan/                     # jurusan-page.tsx, jurusan-form.tsx, jurusan-table.tsx, jurusan.api.ts, jurusan.schema.ts, jurusan.form.ts
│   │   ├── users/                       # users-page.tsx, users-form.tsx, users-table.tsx, users.api.ts, users.schema.ts, users.form.ts (superadmin only)
│   │   ├── dudi/                        # dudi-page.tsx, dudi-form.tsx, dudi-table.tsx, dudi.api.ts, dudi.schema.ts, dudi.form.ts
│   │   ├── siswa/                       # siswa-page.tsx, siswa-form.tsx, siswa-table.tsx, siswa.api.ts, siswa.schema.ts, siswa.form.ts
│   │   ├── alumni/                      # alumni-page.tsx, alumni-form.tsx, alumni-detail-modal.tsx, alumni-table.tsx, alumni.api.ts, alumni.schema.ts, alumni.form.ts
│   │   ├── lowongan-kerja/              # lowongan-kerja-page.tsx and lowongan-kerja subcomponents
│   │   ├── seleksi/                     # seleksi-page.tsx
│   │   ├── validasi-absensi/            # validasi-absensi-page.tsx
│   │   ├── tracer-study/                # tracer-page.tsx
│   │   └── laporan/                     # laporan-page.tsx
│   └── hrd/                             # Corporate HRD portal module
│       ├── route.tsx                    # HRD sub-routes
│       ├── lowongan/                    # pages/lowongan-page.tsx, components, hooks, api
│       ├── review/                      # pages/review-page.tsx, components, hooks, api
│       ├── jadwal/                      # pages/jadwal-page.tsx, components, hooks, api
│       ├── hasil/                       # pages/hasil-page.tsx, components, hooks, api
│       └── penempatan/                  # pages/penempatan-page.tsx, components, hooks, api, types
├── hooks/                               # Global reusable React hooks
├── layouts/                             # Master layout wrappers (auth.layout.tsx, main.layout.tsx)
├── lib/                                 # Utility functions (cn) & Echo
├── slices/                              # Redux authSlice
├── store/                               # Redux store index
├── main.tsx                             # React entry point
├── route.tsx                            # Top-level routing configuration
└── index.css                            # Global styles, Tailwind v4 imports, CSS variables
```

## 4. Feature Module Pattern

Features follow a **Role -> Feature Domain (kebab-case) -> Flat Files** organization:

1. **Role Level (`src/features/{role}`):** Groups modules by user persona (`auth`, `student`, `admin`, `hrd`).
2. **Feature Level (`src/features/{role}/{kebab-feature}`):** Dedicated folder per business capability (e.g. `student/e-portfolio`, `admin/departemen`, `admin/jurusan`, `admin/users`, `admin/dudi`, `admin/siswa`, `admin/alumni`, `hrd/penempatan`).
3. **Files inside Feature Domain:**
   - `kebab-feature.api.ts`, Axios request functions for the feature endpoints. Uses central `api` from `src/api/axios.ts`, never raw `fetch()` or new Axios instance.
   - `kebab-feature.schema.ts`, Zod validation schemas & inferred TypeScript types.
   - `kebab-feature.form.ts`, `use{Feature}Form()` hook(s) that wrap `useForm` + `zodResolver` + `defaultValues`, plus pure payload/defaults builders (`toCreateUserPayload`, `toPortfolioProfileDefaults`). Form logic stays out of the DOM.
   - `kebab-feature-form.tsx`, Presentational form component. Reads RHF state via `useFormContext()` and only renders inputs; receives an `onSubmit(data)` prop for the host handler.
   - `kebab-feature-table.tsx`, Column definitions (`buildUserColumns`, `buildStudentColumns`, etc.), badges, and actions for DataTable.
   - `kebab-feature-page.tsx`, Main page/container component. Hosts the form instance from `{feature}.form.ts`, owns submit handlers (api/dispatch/navigate), and wraps presentational forms in `<FormProvider>`.

Routing stays at role level: `src/features/{role}/route.tsx` imports each `*-page.tsx` from its feature domain and exports an array (`studentRoute`, `adminRoute`, `hrdRoute`, `authRoute`) consumed by `src/route.tsx`.

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
  - `isAuthenticated`: Boolean state flag.
  - `token`: Sanctum Bearer token is stored in `localStorage` (key `access_token`), read/written by `src/api/axios.ts` interceptors.

## 6. API Client & Networking Layer

- Single Axios instance exported from `src/api/axios.ts`.
- Base URL configured from environment variable `VITE_API_URL` (fallback `http://localhost:8000/api`).
- Request Interceptor: Injects `Authorization: Bearer ${token}` retrieved from `localStorage.getItem("access_token")`.
- Response Interceptor:
  - Passes successful responses through.
  - Handles `401 Unauthorized` by clearing `access_token` and redirecting to `/login`.
  - Backend envelope is `{ success: boolean, message: string, data: {}, errors? }`. Access payload via `response.data.data`.
- Feature API modules (`*.api.ts`) wrap endpoints and return the unwrapped payload, so pages never build URL strings inline.

## 7. Reusable Component Conventions

- **Page Header (`src/components/custom/page-header.tsx`):** Universal top banner with role theming (`admin`, `student`, `alumni`, `hrd`, `auto`).
- **Modal Boilerplate (`src/components/custom/modal.tsx`):** Dual-mode dialog wrapper over Radix UI primitives (`src/components/ui/dialog.tsx`).
- **DataTable (`src/components/custom/data-table.tsx`):** Generic table with loading skeleton, empty state, pagination, and typed columns.
- **GenericDummyPage (`src/components/custom/generic-dummy-page.tsx`):** Placeholder page with `variant: "student" | "admin"` for scaffolds.
- **SearchableSelect (`src/components/custom/searchable-select.tsx`):** Accessible popover combobox with instant real-time search filter (`searchable?: boolean` default false) and full-width trigger.

## 8. Async Selects (Server-Side Search + Pagination)

All form dropdowns with potentially large datasets use `AsyncSearchableSelect` (`src/components/custom/async-searchable-select.tsx`) instead of loading full option lists on page open. Nothing is fetched until the select popover opens; typing searches server-side (debounced 500 ms); scrolling appends 20 rows/page.

```text
AsyncSearchableSelect (props: fetchPage, perPage=20, debounceMs=500, fallbackLabel, onOptionSelect, emptyOptionLabel?)
  → usePaginatedOptions (src/hooks/use-paginated-options.ts: items, loading, loadingMore, hasMore, search, onSearchChange, onLoadMore, onOpen, resetSearch)
      → selectOptionsApi (src/api/select-options.ts: getCompanies, getStudents, getMajors, getDepartments, getStandardTypes, getHrdStudentsAlumni)
          → Backend index endpoints with ?for_select=1&search=&page=&per_page=20
  → SearchableSelect (serverDriven mode: no client filter/slice, external loadingMore, selectedFallbackLabel, onOpen, onClose, onSearchChange, onLoadMore, hasMore)
```

Request efficiency rules:
- Search input debounces 500 ms. Opening the popover never searches, closing calls `onClose` to trigger `resetSearch()` (clears query, aborts in-flight requests, resets page).
- Every new fetch aborts the previous one via `AbortController` (signal threaded through `FetchSelectPage` into axios). Stale responses are ignored by request id; identical queries are skipped.
- Successful pages are cached in-memory per URL+params with 60 s TTL (`selectPageCache`, `clearSelectOptionsCache()` to invalidate manually). Reopening within a minute costs zero requests.

Rules:
- `fetchPage` receives `{ search, page, per_page }` and resolves `{ items: { value, label, extra? }[], hasMore, total }` from the Laravel paginator envelope (`response.data.data` = items, `response.data.meta` = page meta).
- `value` is always the backend-encrypted id string. Never compare ids across payloads because encryption uses a random IV. All matching happens inside one loaded item array.
- Edit forms show the current value via `fallbackLabel` taken from already loaded entity relations (e.g. `user.company.name`), or via the last picked item label tracked locally. No `fetchById` round-trip is needed.
- Extra server-computed fields ride in `item.extra` (e.g. eligible-student autofill fields, `resolvedMajorId`/`resolvedMajorName` for class to major auto-resolution, `code`). Read them in `onOptionSelect`, never from a second list.
- `emptyOptionLabel` prepends a static `{ value: "", label }` row for clearable selects (status, company). `onOptionSelect` only fires for server items.
- Feature-specific composition lives in the feature `{feature}.api.ts` (e.g. alumni `getClassMajorSelectPage` merges class + major pages with `class_`/`major_` value prefixes; alumni `suggestCompanies` feeds the manual company-name datalist; siswa/alumni `getFilterOptions` loads small master lists with `per_page=100` for table filter dropdowns).
- Small static enums (roles, years) stay as inline `SearchableSelect` options. Years are generated locally via alumni `buildGraduationYears()`.
