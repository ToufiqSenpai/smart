# AGENTS.md

## Project Overview

Smart is an NPM Workspaces monorepo containing two applications:

- **`apps/web`** — React 19 SPA built with Vite 8, TanStack Router (file-based routing), TanStack Query, TanStack Form, Axios, usehooks-ts, and Tailwind CSS v4.
- **`apps/backend`** — Express 4 REST API written in TypeScript, using Prisma ORM with PostgreSQL.

The frontend runs on port **3000** and makes API requests to the backend on port **5000**.

## Repository Structure

```text
smart/
├── apps/
│   ├── web/            # React + Vite frontend (@smart/web)
│   │   ├── src/
│   │   │   ├── routes/ # TanStack Router file-based routes
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── router.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── backend/        # Express + TypeScript API (@smart/backend)
│       ├── src/
│       │   ├── modules/    # Feature modules (controller/service/repository/route)
│       │   ├── db/         # Prisma client singleton
│       │   ├── index.ts    # Express app entrypoint
│       │   └── route.ts    # Root route aggregation
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── package.json         # Root workspace configuration
├── tsconfig.base.json   # Shared TypeScript compiler options
└── eslint.config.js     # Shared ESLint configuration
```

## Setup Commands

```bash
# Install all dependencies (from repo root)
npm install

# Set up backend environment
# Copy or create apps/backend/.env with:
#   PORT=5000
#   NODE_ENV=development
#   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Generate Prisma client (from repo root)
npx prisma generate --schema apps/backend/prisma/schema.prisma

# Run database migrations (from repo root)
npx prisma migrate dev --schema apps/backend/prisma/schema.prisma
```

## Development Workflow

All commands are run from the **repository root**.

```bash
# Start both frontend and backend concurrently (recommended)
npm run dev

# Start only the frontend (Vite dev server on port 3000)
npm run dev:web

# Start only the backend (tsx watch with hot-reload on port 5000)
npm run dev:backend
```

- The web app uses `vite dev --port 3000` with hot module replacement.
- The backend uses `tsx watch src/index.ts` for automatic restarts on file changes.
- `concurrently` is used to run both processes in parallel when using `npm run dev`.

## Build and Production

```bash
# Build everything (backend first, then frontend)
npm run build

# Build individual apps
npm run build:web       # Runs: vite build
npm run build:backend   # Runs: tsc

# Start backend in production mode
npm run start:backend   # Runs: node dist/index.js
```

## Testing

### Frontend (`apps/web`)

```bash
# Run all tests
npm run test -w apps/web     # Runs: vitest run

# Or from apps/web directory
cd apps/web && npm test
```

- Uses **Vitest** as the test runner with **jsdom** environment.
- Uses **@testing-library/react** and **@testing-library/dom** for component testing.

### Backend (`apps/backend`)

No test framework is currently configured for the backend.

## Linting and Formatting

### Linting

```bash
# Lint from root (all workspaces)
npx eslint .

# Lint frontend only
npm run lint -w apps/web
```

- **Root ESLint config** (`eslint.config.js`): Applies `@eslint/js` recommended + `typescript-eslint` recommended rules to all `*.{js,ts,tsx}` files. React hooks and React Refresh rules are scoped to `apps/web/**`.
- **Web ESLint config** (`apps/web/eslint.config.js`): Extends `@tanstack/eslint-config` and `@tanstack/eslint-plugin-query` with some rules relaxed (no import cycle/order enforcement).
- **Backend ESLint config** (`apps/backend/eslint.config.js`): Re-exports the root config directly.

Key lint rules:

- `no-unused-vars`: warn
- `@typescript-eslint/no-explicit-any`: warn

### Formatting (Frontend Only)

```bash
# Format code
npm run format -w apps/web   # Runs: prettier --write . && eslint --fix

# Check formatting
npm run check -w apps/web    # Runs: prettier --check .
```

Prettier config (`apps/web/prettier.config.js`):

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- Trailing commas everywhere (`trailingComma: "all"`)

## Code Style and Conventions

### TypeScript

- **Strict mode** is enabled globally via `tsconfig.base.json`.
- The web app additionally enforces `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- Backend targets **ES2022** with **NodeNext** module resolution.
- Web targets **ES2022** with **bundler** module resolution and **react-jsx** transform.

### Path Aliases (Frontend)

The web app uses `#/*` and `@/*` as path aliases mapping to `./src/*`:

```typescript
import { SomeComponent } from "#/components/SomeComponent";
// or
import { SomeComponent } from "@/components/SomeComponent";
```

This is configured in both `tsconfig.json` (paths) and `package.json` (imports).

### Backend Module Pattern

Backend feature code is organized into domain modules under `src/modules/`. Each module follows a four-file pattern:

```text
src/modules/<feature>/
├── controller.ts   # HTTP request handlers
├── service.ts      # Business logic
├── repository.ts   # Database/data access (Prisma)
└── route.ts        # Express Router with endpoint definitions
```

Current modules: `announcement`, `auth`, `businesses`, `dashboard`, `dues`, `finance`, `issues`, `profile`, `residents`.

When adding a new feature, create a new directory under `src/modules/` and follow this pattern.

### Frontend Routing

The web app uses **TanStack Router** with **file-based routing**:

- Route files live in `src/routes/`.
- The route tree is auto-generated to `src/routeTree.gen.ts` — **do not edit this file manually**.
- To generate routes manually: `npm run generate-routes -w apps/web` (runs `tsr generate`).
- The Vite plugin (`@tanstack/router-plugin/vite`) auto-generates routes during dev and build.
- Auto code-splitting is enabled (`autoCodeSplitting: true`).

### Frontend State Management

- **Server state**: Use TanStack Query for all data fetching and caching.
- **Form state**: Use TanStack Form for form management.
- **HTTP Client**: Use Axios. The Axios instance is configured with a base URL at `src/utils/http.ts`.
- **Icons**: Use `lucide-react` for icons.

## Database

- **ORM**: Prisma with PostgreSQL.
- **Schema**: `apps/backend/prisma/schema.prisma`.
- **Generated client output**: `apps/backend/src/generated/prisma/`.
- **Config**: `apps/backend/prisma.config.ts` — reads `DATABASE_URL` from `.env`.
- After changing the schema, run `npx prisma migrate dev --schema apps/backend/prisma/schema.prisma` to create a migration and regenerate the client.

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable       | Description               | Default       |
| -------------- | ------------------------- | ------------- |
| `PORT`         | Server port               | `5000`        |
| `NODE_ENV`     | Environment mode          | `development` |
| `DATABASE_URL` | PostgreSQL connection URI | _(required)_  |

## Port Mappings

| Service         | URL                            |
| --------------- | ------------------------------ |
| Frontend (Vite) | http://localhost:3000          |
| Backend API     | http://localhost:5000          |
| Sample endpoint | http://localhost:5000/api/info |

## Common Gotchas

- **DO NOT build, lint, run dev servers** unless explicitly instructed by the user.
- **Do not edit `src/routeTree.gen.ts`** in the web app — it is auto-generated by TanStack Router.
- **Always run commands from the repository root** using `-w` workspace flag (e.g., `npm run dev -w apps/web`) unless you explicitly `cd` into a workspace.
- **Prisma client must be regenerated** after any schema change — the generated output lives in `src/generated/prisma/`, not the default location.
- The backend ESLint config inherits from the root config entirely — add backend-specific rules to the root `eslint.config.js` under the appropriate file glob.
