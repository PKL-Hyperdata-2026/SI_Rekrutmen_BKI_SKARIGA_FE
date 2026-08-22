# Frontend Agent Instructions (React 19 + TypeScript + Vite)

## Project Context

User Interface (SPA) for SI Rekrutmen BKI SKARIGA.
React 19, TypeScript 6, Vite 8, Tailwind CSS v4, Redux Toolkit, React Router v7, Shadcn UI / Radix.

## Documentation Map

- `CODEBASE.md` — deep technical reference: architecture, feature modules, state, styling, routes, API clients. **Read at session start.**
- `../AGENTS.md` — root orchestrator & shared API contract.
- `src/route.tsx` — routing tree and role-based route protection.

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
2. ALWAYS organize features under `src/features/{role}/{feature}/` (e.g. `src/features/auth/`, `src/features/student/`, `src/features/admin/`).
3. File naming conventions:
   - React components & views: `PascalCase.tsx` (e.g., `ButtonPrimary.tsx`, `JobCard.tsx`).
   - Hooks, utilities, API clients, and slices: `camelCase.ts` (e.g., `useAuth.ts`, `axios.ts`, `authSlice.ts`).
4. NEVER make raw `fetch()` calls or create new Axios instances. Always use the central configured client at `src/api/axios.ts`.
5. Global authentication and session state MUST be stored in Redux (`src/store/index.ts` and `src/slices/authSlice.ts`).
6. Component UI styling MUST use Tailwind CSS utility classes and Shadcn UI primitives located in `src/components/ui/`.
7. NEVER edit or commit `.env` files.
8. NEVER edit files inside `node_modules/` or `dist/`.
9. NEVER use `git add .` or `git add -A`. Explicitly stage ONLY files strictly relevant to the task (`git add <path/to/file>`). Exclude collateral edits, lockfiles (`package-lock.json`), and unrelated files from commits.

## Non-Default Conventions (Things You'd Get Wrong)

- Tailwind CSS v4 setup: Styling is imported directly in `src/index.css`. Do not add old Tailwind v3 plugins or deprecated config syntax.
- Class merging: When accepting custom `className` in UI components, always wrap with the `cn()` helper (`src/lib/utils.ts`) combining `clsx` and `tailwind-merge`.
- API response unwrapping: The backend returns `{ success: true, message: "...", data: { ... } }`. Always access payload through `response.data.data` or configure the response interceptor in `src/api/axios.ts`.
- Routing protection: Role-based navigation is managed in `src/route.tsx`. Add new routes under their respective role layout or protected route wrapper.

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
