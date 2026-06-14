# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PuraRazApp is a livestock (cattle) management system for ranches/estancias, built with Next.js 14 (App Router), Prisma + PostgreSQL, TypeScript, Tailwind, and shadcn/ui (Radix). The UI and domain language are in Spanish. It tracks animal inventory by category and records daily operations: entries (`entrada`), exits (`salida`), births (`nacimiento`), deaths (`mortandad`), and weighings (`pesaje`).

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # next lint (eslint: next/core-web-vitals + next/typescript)

npx prisma generate      # Regenerate client (also runs on postinstall)
npx prisma migrate dev   # Create/apply a migration against DATABASE_URL
npx prisma studio        # Inspect the database
```

There is no test suite. Verify changes by running `npm run dev` and exercising the relevant page/route, or `npm run build` to catch type errors.

To seed reference data (categories, mortality causes, breeds), run the functions in [src/lib/seed/](src/lib/seed/).

## Required environment (`.env`)

`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_APP_URL`, and `OPENROUTER_API_KEY` (used by the chat route). `JWT_SECRET` must be set or login and token verification throw.

## Architecture

### Multi-tenancy via `establesimiento`
Every domain record carries a `usuario` and `establesimiento` (ranch/establishment) string, and most models are `@@index([establesimiento])`. Tenant scoping is **not enforced at the DB layer** — it is the route's responsibility. When writing or reading domain data in an API route, always derive `{ usuario, establesimiento }` from the token (see below) and filter/stamp records by `establesimiento`. The schema uses `relationMode = "prisma"` (no DB-level foreign keys), so referential integrity is also application-managed.

### Authentication
- **Login** ([src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)) verifies a bcrypt password, then sets a JWT in the `tokenPuraRaza` cookie. The token payload contains `email`, `usuario`, `establesimiento`, `rol`.
- **Route protection** is done by [middleware.ts](middleware.ts) using `jose` (Edge-compatible) — it guards `/dashboard/*` and `/diaria/*`, redirecting to `/auth/login` when the cookie is missing/invalid, and bounces logged-in users away from `/auth/login`.
- **Inside API routes / server components**, call `getUserFromToken()` ([src/utils/getUserFromToken.ts](src/utils/getUserFromToken.ts)) — it reads the cookie and verifies the JWT with `jsonwebtoken`, returning `{ usuario, establesimiento }` or `null`. Routes return 401 on `null`.

Note two JWT libraries coexist by necessity: `jose` in middleware (Edge runtime) and `jsonwebtoken` in Node API routes/login.

### API route conventions (`src/app/api/<resource>/`)
Each resource follows a consistent pattern: `route.ts` for collection (GET list / POST create) and `[<resource>Id]/route.ts` for item (GET / PUT / DELETE). A typical mutation route:
1. `getUserFromToken()` → 401 if null.
2. Validate the request body with a **zod** schema.
3. Wrap the Prisma write in an audit helper (see below).
4. Return `NextResponse.json(...)`.

### Auditing
All create/update/delete operations should go through the helpers in [src/utils/auditoria.ts](src/utils/auditoria.ts): `auditCreate`, `auditUpdate`, `auditDelete`. They run the mutation and write an `Auditoria` row capturing `tabla`, `accion`, `registroId`, JSON-serialized `oldValues`/`newValues`, and `usuarioId`. Prefer these over calling `prisma.<model>.create/update/delete` directly so the audit trail stays complete.

### Inventory & the `Movimiento` ledger
`Categoria` rows hold a running `cantidad` (head count) per animal category. The daily operations (`Entrada`, `Salida`, `Nacimiento`, `Mortandad`) each:
- create their own record (with line `items` where applicable),
- write one or more `Movimiento` ledger rows (`tipo`: `ENTRADA | SALIDA | NACIMIENTO | MORTANDAD`),
- and `increment`/`decrement` the affected `Categoria.cantidad`.

See [src/app/api/entrada/route.ts](src/app/api/entrada/route.ts) for the canonical example. When adding or changing an operation, keep all three in sync — the record, the `Movimiento` ledger, and the category count — or inventory totals drift.

### Prisma client
Always import the shared singleton: `import prisma from "@/libs/prisma"` ([src/libs/prisma.ts](src/libs/prisma.ts)). Note the path is `@/libs/prisma` (plural `libs`); general utilities live in `@/lib/` (singular). Both exist — don't confuse them.

### Frontend structure
- `src/app/dashboard` — stats overview (data from `/api/dashboard/stats`).
- `src/app/configuracion/<entity>` — CRUD admin for reference entities (categorias, potrero, propietario via estancia, usuarios, motivos, razas, etc.).
- `src/app/diaria/<operation>` — daily operations UI (entrada, salida, nacimiento, mortandad, pesaje, movimientos).
- `src/components/ui` — shadcn/ui components (configured in [components.json](components.json); add new ones with the shadcn CLI). Shared chrome: `Sidebar`, `Navbar`, theming via `next-themes` + `theme-data-provider`.
- Client data fetching against the local API routes (e.g. `useSession` hook hits `/api/profile`).
- Forms use `react-hook-form` + zod resolvers; tables use `@tanstack/react-table`; toasts via `sonner`/`react-toastify`.

### Path alias
`@/*` → `./src/*` (see [tsconfig.json](tsconfig.json)).
