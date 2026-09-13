# Frontend Agent Instructions (React 19 + TypeScript + Vite)

## Project Context

User Interface (SPA) for SI Rekrutmen BKI SKARIGA.
React 19, TypeScript 6, Vite 8, Tailwind CSS v4, Redux Toolkit, React Router v7, Shadcn UI / Radix.

## Documentation Map

- `CODEBASE.md`, deep technical reference: architecture, feature modules, state, styling, routes, API clients. Read at session start.
- `../AGENTS.md`, root orchestrator & shared API contract.
- `src/route.tsx`, routing tree and role-based route protection.

## Commands Cheatsheet

```bash
npm install                                # Install Node dependencies
npm run dev                                # Start Vite development server
npm run build                              # Typecheck (tsc -b) and bundle for production
npm run lint                               # Run ESLint validation
npm run preview                            # Preview production build locally
```

## Critical Rules (READ FIRST)

1. NEVER use `any` in TypeScript. Define explicit `interface` or `type` definitions for all component props, API payloads, and state objects.
2. ALWAYS organize feature code under `src/features/{role}/{feature}/`, one kebab-case folder per business capability (e.g. `src/features/student/e-portfolio/`, `src/features/admin/users/`, `src/features/admin/dudi/`, `src/features/hrd/penempatan/`). Role-level `route.tsx` aggregates feature pages. Cross-cutting route guards live at the auth role root (`src/features/auth/protected-route.tsx`, `dashboard-redirector.tsx`).
3. File naming conventions (kebab-case, matching the feature folder):
   - Page containers: `{feature}-page.tsx` exporting a PascalCase component (`users-page.tsx` -> `UsersManagementPage`).
   - Form components: `{feature}-form.tsx`.
   - Table column definitions: `{feature}-table.tsx`.
   - Form setup hooks & payload builders: `{feature}.form.ts` exporting `use{Feature}Form()` (wraps `useForm` + `zodResolver` + `defaultValues`) and pure payload builders (`toXxxPayload`).
   - Zod schemas & inferred types: `{feature}.schema.ts`.
   - Axios request modules: `{feature}.api.ts` (always built on the central `api` client).
   - Local feature hooks: `use{Feature}.ts`; global hooks, utilities, and slices: `camelCase.ts` (e.g. `use-mobile.ts`, `axios.ts`, `authSlice.ts`).
4. NEVER make raw `fetch()` calls or create new Axios instances. Always use the central configured client at `src/api/axios.ts`.
5. Global authentication and session state MUST be stored in Redux (`src/store/index.ts` and `src/slices/authSlice.ts`).
6. Component UI styling MUST use Tailwind CSS utility classes, Shadcn UI primitives located in `src/components/ui/`, and custom layout components in `src/components/custom/` (e.g., `PageHeader`).
7. NEVER edit or commit `.env` files.
8. NEVER edit files inside `node_modules/` or `dist/`.
9. NEVER use `git add .` or `git add -A`. Explicitly stage ONLY files strictly relevant to the task (`git add <path/to/file>`). Exclude collateral edits, lockfiles (`package-lock.json`), and unrelated files from commits.

## Non-Default Conventions (Things You'd Get Wrong)

- Tailwind CSS v4 setup: Styling is imported directly in `src/index.css`. Do not add old Tailwind v3 plugins or deprecated config syntax.
- Class merging: When accepting custom `className` in UI components, always wrap with the `cn()` helper (`src/lib/utils.ts`) combining `clsx` and `tailwind-merge`.
- API response unwrapping: The backend returns `{ success: true, message: "...", data: { ... } }`. Always access payload through `response.data.data` or configure the response interceptor in `src/api/axios.ts`.
- Feature API modules: Each feature owns a `{feature}.api.ts` that wraps endpoint calls in typed functions and returns the unwrapped payload. Feature pages/components must not call `api.get/post` inline; import the feature's `.api.ts` instead.
- RHF and Zod form conventions: Never use `.default()` or `z.coerce` in Zod schemas. Form fields must remain strings to reflect HTML input state. Always define explicit non-undefined `defaultValues` in `useForm()`. For optional fields, allow empty string via `.optional().or(z.literal(""))` or `.refine()`, and handle number/boolean conversions only in payload builders (`toXxxPayload`).
- Select components: Use `SearchableSelect` from `@/components/custom/searchable-select`. The `searchable` prop defaults to `false`. When a search bar is required for long lists, specify `searchable={true}` or `searchable`.
- Routing protection: Role-based navigation is managed in `src/route.tsx`. Roles `admin` and `superadmin` access the `/admin` portal routes. Add new routes under their respective role layout or protected route wrapper.

## Git Workflow

- Working branch: `development`.
- NEVER commit unless explicitly requested by the user.
- Commit format: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Staging discipline: Stage files explicitly by path. Exclude lockfiles, environment artifacts, and unrelated changes.
- Always verify that `npm run build` succeeds with zero TypeScript or lint errors before marking work complete.

## Definition of Done

A frontend task is done when:

1. Feature components follow the role-based folder structure.
2. All TypeScript types are strictly declared (zero `any` types, zero linter warnings).
3. `npm run build` (`tsc -b && vite build`) completes with exit code 0.
4. Component states (loading, empty, error, success) are handled gracefully.
5. `CODEBASE.md` is updated if new features, routes, or global state slices are added.
