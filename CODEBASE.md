# Frontend codebase reference (React 19 + TypeScript + Vite)

Factual codebase reference for AI agents and developers. Last verified: 2026-09-24.
If you modify code that alters any architecture, feature modules, state slices, or routes documented here, update this file in the same change.
Operational instructions and boundaries: [`AGENTS.md`](./AGENTS.md).

> If this file is older than 4 weeks, verify routes and features against `src/route.tsx` and `src/features/` before relying on it.

## 1. Stack

| Layer               | Technology            | Details                                                    |
| ------------------- | --------------------- | ---------------------------------------------------------- |
| Runtime & Package   | Bun 1.3+              | Fast JavaScript runtime, package manager (`bun.lock`)      |
| Framework / Bundler | Vite 8 + React 19     | ESM-based frontend development server and builder          |
| Language            | TypeScript 6          | Strict type checking (`tsc -b`)                            |
| CSS & Styling       | Tailwind CSS v4       | Native CSS imports via `@tailwindcss/vite`, Geist font     |
| UI Primitives       | Shadcn UI / Radix UI  | Accessible UI components (`src/components/ui/`)            |
| State Management    | Redux Toolkit         | Central store (`src/store/index.ts`) and auth slice        |
| Routing             | React Router v7       | Declarative routing with layout wrappers (`src/route.tsx`) |
| HTTP Client         | Axios                 | Configured instance with interceptors (`src/api/axios.ts`) |
| Real-time & Sockets | Laravel Echo & Pusher | WebSocket event subscription (`laravel-echo`, `pusher-js`) |
| Forms & Validation  | React Hook Form + Zod | Schema-based form state and validation resolvers           |
| Tables & Data       | TanStack React Table  | Headless datatables with sorting, pagination, and filtering|
| Rich Text Editor    | TipTap                | Modular rich text editor suite (`@tiptap/react`)           |
| Maps & Geo          | Leaflet & React-Leaflet | Coordinate and radius map views                          |
| Visuals & Charts    | Recharts & Lucide     | Data visualization charts and feather icon suite           |

## 2. Architecture (how things connect)

```text
Application Mounting
  → src/main.tsx (Root DOM mounting)
      → Redux Provider (src/store/index.ts)
          → RouterProvider (src/route.tsx)
              → Layout Wrappers (src/layouts/, including Sidebar, Topbar, Breadcrumbs)
                  → Role-Guarded Feature Pages / Views (src/features/{role}/{feature}/)
                      → UI Components (src/components/ui/ + custom/)
                      → Custom Hooks (feature hooks or src/hooks/)
                      → Feature API Modules (src/features/{role}/{feature}/*.api.ts)
                          → Central Axios API Client (src/api/axios.ts)
                              → Backend REST API (Laravel Sanctum protected)
```

Route guards (`ProtectedRoute`, `DashboardRedirector`) live at the auth role root (`src/features/auth/`) and are consumed by `src/route.tsx`.

## 3. Project structure

```text
frontend/src/
├── api/
│   ├── axios.ts                                 # Configured Axios client with Bearer auth interceptors
│   └── select-options.ts                        # Centralized async paginated options API
├── assets/                                      # Static assets, logos, illustration SVGs
├── components/
│   ├── custom/                                  # Global reusable composite components
│   │   ├── table/                               # DataTable composite sub-components
│   │   │   ├── data-table-delete.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   └── pill-table-header.tsx
│   │   ├── text-editor/                         # Rich text editor suite
│   │   │   ├── heading-dropdown.tsx
│   │   │   └── rich-text-toolbar.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── async-searchable-select.tsx
│   │   ├── char-counter.tsx
│   │   ├── data-table.tsx
│   │   ├── date-picker.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── filter-select.tsx
│   │   ├── generic-dummy-page.tsx
│   │   ├── index.ts
│   │   ├── interactive-item-card.tsx
│   │   ├── metric-card.tsx
│   │   ├── modal.tsx
│   │   ├── page-header.tsx
│   │   ├── primitives.tsx
│   │   ├── rich-text-editor.tsx
│   │   ├── searchable-select.tsx
│   │   ├── section-card.tsx
│   │   ├── sidebar-cutout.tsx
│   │   ├── sidebar-icon.tsx
│   │   ├── sidebar-menu-item.tsx
│   │   ├── sonner.tsx
│   │   ├── stat-card.tsx
│   │   └── topbar.tsx
│   └── ui/                                      # Shadcn UI / Radix UI primitives (button, card, dialog, input, etc.)
├── config/
│   └── menus.ts                                 # Sidebar menus per role (STUDENT_MENUS, ADMIN_MENUS, HRD_MENUS)
├── features/                                    # Role-based feature modules
│   ├── auth/
│   │   ├── forgot-password/                     # forgot-password-modal.tsx, form, api, schema
│   │   ├── login/                               # login-page.tsx, login-form.tsx, api, form, schema
│   │   ├── reset-password/                      # reset-password-page.tsx, form, api, schema
│   │   ├── dashboard-redirector.tsx             # Redirects "/" to respective role dashboard
│   │   ├── protected-route.tsx                  # Role-aware route guard
│   │   └── route.tsx                            # Auth sub-routes
│   ├── student/                                 # Student & Alumni portal feature module
│   │   ├── dashboard/                           # dashboard-page.tsx
│   │   ├── e-portfolio/                         # e-portfolio-page.tsx, personal-academic-form.tsx, portfolio.api.ts, portfolio.schema.ts, portfolio.form.ts, modals
│   │   ├── lamaran/                             # lamaran-page.tsx, lamaran-card.tsx, lamaran-detail-stepper.tsx, lamaran.api.ts, lamaran.schema.ts, placement-letter.ts, hooks
│   │   ├── lowongan-kerja/                      # lowongan-kerja-page.tsx, card, filter, form, api, hooks
│   │   ├── tracer-study/                        # tracer-study-page.tsx, tracer-stats-sidebar.tsx, tracer-study.form.ts, tracer-study.api.ts, tracer-study.schema.ts
│   │   └── route.tsx                            # Student sub-routes
│   ├── admin/                                   # Administrator portal module (admin, superadmin)
│   │   ├── alumni/                              # alumni-page.tsx, alumni-table.tsx, alumni-form.tsx, alumni-detail-modal.tsx, api, schema, form
│   │   ├── dashboard/                           # dashboard-page.tsx
│   │   ├── departemen/                          # departemen-page.tsx, departemen-table.tsx, departemen-form.tsx, api, schema, form
│   │   ├── dudi/                                # dudi-page.tsx, dudi-table.tsx, dudi-form.tsx, api, schema, form
│   │   ├── jurusan/                             # jurusan-page.tsx, jurusan-table.tsx, jurusan-form.tsx, api, schema, form
│   │   ├── laporan/                             # laporan-page.tsx, components/, laporan.api.ts, laporan.types.ts
│   │   ├── lowongan-kerja/                      # lowongan-kerja-page.tsx, detail, form, table, filter, api, schema, hooks
│   │   ├── seleksi/                             # seleksi-page.tsx, seleksi.api.ts, types.ts, components/, hooks/
│   │   ├── siswa/                               # siswa-page.tsx, siswa-table.tsx, siswa-form.tsx, siswa-detail-modal.tsx, siswa-portfolio-modal.tsx, api, schema, form
│   │   ├── tracer-study/                        # tracer-study-page.tsx, tracer-study-table.tsx, stats-cards, form-modal, detail-modal, api, schema, form
│   │   ├── users/                               # users-page.tsx, users-table.tsx, users-form.tsx, api, schema, form (superadmin)
│   │   ├── validasi-presensi/                   # pages/validasi-presensi-page.tsx, components/, hooks/, types/
│   │   └── route.tsx                            # Admin sub-routes
│   └── hrd/                                     # Corporate HRD portal module
│       ├── dashboard/                           # dashboard-page.tsx, metric-cards, status-lowongan, berkas, pelamar
│       ├── lowongan/                            # lowongan-page.tsx, form, list, card, status-badge, api, schema, form, hooks (Production)
│       ├── penempatan/                          # penempatan-page.tsx, form, table, metric-cards, update-form, api, schema, form, hooks (Production)
│       ├── hasil/                               # hasil-page.tsx, hasil-table.tsx, hasil-metric-cards.tsx, hasil-modal.tsx, api, schema, form (Production)
│       ├── jadwal/                              # jadwal-page.tsx, jadwal-table.tsx, jadwal-form-modal.tsx, jadwal-peserta-modal.tsx, api, schema, form, status (Production)
│       ├── review/                              # review-page.tsx, review.schema.ts, review.api.ts, review.status.ts, review.form.ts, use-review-page.ts, components (Production)
│       └── route.tsx                            # HRD sub-routes
├── hooks/                                       # Global reusable React hooks
│   ├── use-app.ts
│   ├── use-data-table-delete.ts
│   ├── use-debounce.ts
│   ├── use-heading-dropdown.ts
│   ├── use-mobile.ts
│   ├── use-notification.ts
│   ├── use-paginated-options.ts
│   ├── use-rich-text-editor.ts
│   └── use-rich-text-toolbar.ts
├── layouts/                                     # Master layout wrappers (auth.layout.tsx, main.layout.tsx)
├── lib/                                         # Utility functions (utils.ts, echo.ts)
├── slices/                                      # Redux slices (authSlice.ts)
├── store/                                       # Redux store index (index.ts)
├── lucide-react.d.ts                            # Ambient module declarations
├── main.tsx                                     # React entry point
├── route.tsx                                    # Top-level routing configuration
└── index.css                                    # Global styles, Tailwind v4 imports, CSS variables
```

## 4. Feature module pattern

Features follow a Role / Feature Domain (kebab-case) / Files organization:

1. **Role level (`src/features/{role}`)**. Groups modules by user persona (`auth`, `student`, `admin`, `hrd`).
2. **Feature level (`src/features/{role}/{kebab-feature}`)**. Dedicated folder per business capability.
3. **Standard flat files convention**:
   - `kebab-feature.api.ts`: Axios request functions for endpoints. Uses central `api` from `src/api/axios.ts`.
   - `kebab-feature.schema.ts`: Zod validation schemas and inferred TypeScript types.
   - `kebab-feature.form.ts`: Hooks wrapping `useForm` with `zodResolver` and default values, plus payload builders.
   - `kebab-feature-form.tsx`: Presentational form component reading React Hook Form context.
   - `kebab-feature-table.tsx`: Column definitions, badges, and actions for DataTable.
   - `kebab-feature-card.tsx`: Presentational card for grid views.
   - `kebab-feature-page.tsx`: Main container component hosting form or table instances and submit handlers.
4. **Architectural complexity exceptions**:
   - Certain high-density features (`admin/validasi-presensi`, `admin/seleksi`, `admin/laporan`) encapsulate internal components and hooks inside subfolders (`components/`, `hooks/`, `pages/`, `types/`) to isolate domain logic.
   - HRD modules (`review`, `jadwal`, `hasil`, `lowongan`, `penempatan`) are fully implemented and production-ready.

Routing stays at role level: `src/features/{role}/route.tsx` imports each page and exports an array (`studentRoute`, `adminRoute`, `hrdRoute`, `authRoute`) consumed by `src/route.tsx`.

## 5. State management and Redux store

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
  - Sanctum Bearer token is stored in `localStorage` (key `access_token`), handled directly by `src/api/axios.ts` interceptors.

## 6. API client and networking layer

- Single Axios instance exported from `src/api/axios.ts`.
- Base URL configured from environment variable `VITE_API_URL` (fallback `http://localhost:8000/api`).
- Request Interceptor: Injects `Authorization: Bearer ${token}` from `localStorage.getItem("access_token")`.
- Response Interceptor:
  - Passes successful responses through.
  - Handles `401 Unauthorized` by clearing `access_token` and redirecting to `/login`.
  - Backend envelope format is `{ success: boolean, message: string, data: {} }`. Access payload via `response.data.data`.
- Feature API modules (`*.api.ts`) wrap endpoints and return unwrapped payload data.

## 7. Reusable component conventions

- **Page Header (`src/components/custom/page-header.tsx`)**. Universal top banner with role theming (`admin`, `student`, `alumni`, `hrd`, `auto`).
- **Modal boilerplate (`src/components/custom/modal.tsx`)**. Dual-mode dialog wrapper over Radix UI primitives.
- **DataTable (`src/components/custom/data-table.tsx`)**. Generic table with loading skeleton, empty state, pagination, and typed columns.
- **AsyncSearchableSelect (`src/components/custom/async-searchable-select.tsx`)**. Server-side debounced searchable select with pagination.
- **Rich text editor suite (`src/components/custom/text-editor/`)**. TipTap based rich text editor with toolbar and heading dropdown.
- **Metric and stat cards (`metric-card.tsx`, `stat-card.tsx`)**. Analytical overview and KPI metric visual cards.
- **Date pickers (`date-picker.tsx`, `date-range-picker.tsx`)**. Standard and range date picker components.

## 8. Async selects (server-side search and pagination)

All form dropdowns with potentially large datasets use `AsyncSearchableSelect` (`src/components/custom/async-searchable-select.tsx`) instead of loading full option lists on page open. Nothing is fetched until the select popover opens; typing searches server-side (debounced 500 ms); scrolling appends 20 rows per page.

```text
AsyncSearchableSelect (props: fetchPage, perPage=20, debounceMs=500, fallbackLabel, onOptionSelect, emptyOptionLabel?)
  → usePaginatedOptions (src/hooks/use-paginated-options.ts: items, loading, loadingMore, hasMore, search, onSearchChange, onLoadMore, onOpen, resetSearch)
      → selectOptionsApi (src/api/select-options.ts: getCompanies, getStudents, getMajors, getDepartments, getStandardTypes, getHrdStudentsAlumni)
          → Backend index endpoints with ?for_select=1&search=&page=&per_page=20
  → SearchableSelect (serverDriven mode: no client filter/slice, external loadingMore, selectedFallbackLabel, onOpen, onClose, onSearchChange, onLoadMore, hasMore)
```

Request efficiency rules:
- Search input debounces 500 ms. Opening the popover never searches, closing calls `onClose` to trigger `resetSearch()`.
- Every new fetch aborts previous requests via `AbortController`.
- Successful pages are cached in memory per URL and params with 60 s TTL (`selectPageCache`, `clearSelectOptionsCache()`).
