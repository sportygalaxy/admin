# Admin Context

Use this file as the working context for AI-assisted changes in `admin/`.

## Scope

This codebase is the Sporty Galaxy admin dashboard. Start here for dashboard, admin auth, products, categories, subcategories/types, colors, sizes, orders, transactions, clients, employees, role management, reviews, imports/exports, tables, admin route guards, and admin-only workflows.

Storefront UI belongs in `frontend/`; API/business-logic changes usually belong in `backend/`.

## Stack

- Vite + React 18 + TypeScript.
- MUI v6 with Emotion and `mui.config.ts`.
- TailwindCSS for utility styling.
- React Router v6 for routing.
- Redux Toolkit + RTK Query for global state and API calls.
- TanStack Table, Formik/Yup, notistack, file-saver, PapaParse, XLSX, UploadThing, and MUI Lab are available.

## Main Entry Points

- `src/main.tsx` wires `storeQ`, Axios interceptors, MUI theme, `CssBaseline`, and the root `App`.
- `src/router/routes.tsx` defines public/protected routes and lazy page imports.
- `src/router/guard.tsx` handles auth/role route guarding.
- `src/pages` contains domain pages such as Product, Order, Transaction, Client, Employee, UserRole, Review, Auth, and Layout.
- `src/common` contains shared dashboard UI such as tables, loaders, confirm dialogs, error boundaries, and multistep forms.
- `src/api/Api*StoreSlice.tsx` files inject RTK Query endpoints.
- `src/store/storeQ.ts` is the live Redux store used by the app.

## API And State

- `src/configs/HttpConfig.tsx` creates `SportyGalaxyAdminHttp` with `DYNAMIC_ENV().AUTH_URL_API`.
- Request interceptors read `authUser.token` from the global slice and send `Authorization: bearer ...`.
- Response interceptors dispatch logout on `401`.
- `src/store/storeQuerySlice.ts` creates `sportygalaxyAdminApi` and defines auth endpoints.
- Domain API slices inject endpoints into `sportygalaxyAdminApi` and use `RtkqTagEnum` for caching.
- `storeQ` persists selected global state to localStorage key `@state`; production storage is AES-encrypted.

## Coding Patterns

- Use `@/*` imports; Vite maps `@` to `src`.
- Add admin pages through `src/pages/<Domain>` and wire them in `src/router/routes.tsx` using `routeEnum`.
- Add API calls through an `Api<Domain>StoreSlice.tsx` file when following existing dashboard patterns.
- Use `providesTags` and `invalidatesTags` consistently so RTK Query cache refreshes after mutations.
- Prefer existing shared components in `src/common` for tables, loading states, errors, confirmations, and forms.
- Keep role-restricted pages wrapped with `AuthGuard` and allowed role constants.

## Styling Notes

- The app uses MUI as the primary dashboard component system with Tailwind utility support.
- Tailwind extends CSS-variable colors and dashboard breakpoints.
- Match the current dense admin-dashboard style. Avoid storefront/marketing page composition here.

## Commands

- Dev server: `yarn dev`
- Build: `yarn build`
- Lint: `yarn lint`
- Preview: `yarn preview`

`yarn.lock` is present, so prefer Yarn for admin commands unless the user asks otherwise.

## Watch Outs

- `src/store/index.ts` is not the store wired into the app; use `src/store/storeQ.ts`.
- `tagTypes` in `storeQuerySlice.ts` starts narrow but is expanded with `enhanceEndpoints({ addTagTypes: Object.values(RtkqTagEnum) })`.
- Keep encrypted persisted state behavior intact when touching auth/global state.
