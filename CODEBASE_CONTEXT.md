# Admin codebase guide

## Purpose and map

Sporty Galaxy admin dashboard for products, orders, transactions, customers, employees, roles, and reviews. Vite, React 18, TypeScript, MUI, Tailwind, React Router, and Redux Toolkit/RTK Query (`package.json`).

- `src/main.tsx`: React root, Redux provider, MUI theme, and Axios interceptor setup.
- `src/router/routes.tsx` and `src/router/guard.tsx`: public/protected routes and auth/role checks; `src/pages/`: domain pages.
- `src/api/Api*StoreSlice.tsx`: domain RTK Query endpoints; `src/store/storeQuerySlice.ts`: base API; `src/store/storeQ.ts`: active Redux store.
- `src/common/`: shared dashboard UI; `src/configs/`: environment and HTTP setup; `mui.config.ts`: MUI theme.
- `src/types/`, `src/constants/`, `src/helpers/`, `src/utils/`: domain types and shared logic.

## Feature lookup

- Dashboard and login: `src/pages/Home/` and `src/pages/Auth/`; route definitions and guards are in `src/router/`.
- Catalog management: `src/pages/Product/`, `src/pages/Color/`, and `src/pages/Size/`; related API slices are in `src/api/`. Product creation has variants, media, specifications, and Yup validation (`src/pages/Product/ProductCreate.tsx`).
- Operations: orders, transactions, clients, employees, roles, and reviews have corresponding folders in `src/pages/` and domain slices in `src/api/`. CSV/Excel export helpers are in `src/helpers/`.
- Seasonal storefront settings: `/settings` is guarded for admin and super admin roles. `src/pages/Settings/SeasonalSettings.tsx` edits activation mode, campaign availability, schedule, hero copy, and up to 24 selected products per Christmas, Easter, New Year, or Black Friday campaign. `src/api/ApiSeasonalStoreSlice.ts` calls protected backend endpoints; the backend enforces the same role and validation rules.
- Shared table, pagination, loading, error, modal, and confirmation UI lives in `src/common/`; page navigation shell is in `src/pages/Layout/`.

## Architecture and conventions

- Route changes normally go through `src/router/routes.tsx` and route constants; keep guarded pages under the existing role checks (`src/router/guard.tsx`, `src/constants/roles.ts`).
- API slices inject endpoints into `sportygalaxyAdminApi`; preserve RTK Query cache tags when adding mutations (`src/store/storeQuerySlice.ts`, `src/api/`).
- `src/main.tsx` uses `storeQ`, whose selected state is persisted; `src/store/index.ts` is not the active entry point (`src/store/storeQ.ts`).
- Use the `@/*` alias for `src/` (`vite.config.ts`, `tsconfig.app.json`). Reuse MUI theme and shared dashboard components (`mui.config.ts`, `src/common/`).
- Forms commonly use Formik/Yup; API hooks come from RTK Query slices (`src/pages/Product/ProductCreate.tsx`, `src/api/`). Reusable tables use TanStack Table with server-side pagination and sorting (`src/common/Table/ReuseableTable.tsx`). Notifications and confirmation dialogs are provided at the app root (`src/App.tsx`).

## Styling

MUI is the primary dashboard component system, with green/neutral theme colors and Inter typography (`mui.config.ts`). Tailwind utilities and CSS variables supplement it (`tailwind.config.js`, `src/index.css`). Reuse `src/common/` table and state components before adding another pattern; preserve dense dashboard layouts and responsive table overflow.

## Engineering rules

- Keep route guards and role-based UI consistent, but rely on backend authorization for protected actions; client-side checks are not a security boundary (`src/router/guard.tsx`, `src/constants/roles.ts`).
- Handle API loading, empty, and error states; keep RTK Query cache tags correct after mutations (`src/api/`, `src/store/storeQuerySlice.ts`).
- Validate form inputs and preserve accessible MUI controls, keyboard behavior, and theme consistency (`src/pages/`, `src/common/`, `mui.config.ts`).
- Treat persisted browser state as client-controlled and avoid placing secrets in it (`src/store/storeQ.ts`).

## Development and verification

Use Yarn; `yarn.lock` is the lockfile. Run `yarn install`, `yarn dev`, `yarn build`, `yarn lint`, or `yarn preview` from this repository (`package.json`). No test script or test suite is configured in the repository.

Read `context.md` only when this guide and the task-specific source files do not answer the question; verify older notes against current source.

## Task completion workflow

For each implementation task, inspect the affected code for bugs, edge cases, security, and production behavior. Add or update meaningful unit tests for changed logic, including failure and boundary cases. If the task needs a test runner, configure a minimal one in this repository. Run relevant tests, lint, and build checks, and report any checks that could not run plus remaining risks.

Before finishing each task, update this guide or the relevant Markdown documentation when behavior, architecture, commands, or conventions changed. Otherwise append a brief outcome note to `TASK_NOTES.md` at the repository root (create it when first needed). Do not make a no-op documentation edit or claim the code is bug-free because checks passed.
