# Project: wemake

## Stack
- React Router v7 (SSR, file-based routing via `app/routes.ts`)
- TypeScript
- Tailwind CSS + shadcn/ui (components in `app/common/components/ui/`)
- Supabase (client at `app/supa-client.ts`, types at `database.types.ts`)

## Project Structure
- `app/features/<feature>/` — one folder per domain (jobs, products, community, ideas, teams, users)
  - `pages/`      — route components with `loader` / `action` / `meta` exports
  - `components/` — UI components specific to the feature
  - `queries.ts`  — all Supabase queries for the feature
  - `schema.ts`   — drizzle table definitions

## Conventions
- Supabase queries go in `queries.ts`, never inline in loaders
- Loaders are `async`, map raw DB rows to typed interfaces before returning
- Client-side state (filters, UI toggles) stays in the component; data fetching is server-side only
- Use `import client from "~/supa-client"` for all DB access
- shadcn/ui components for all UI primitives — do not write custom base components

## Commands
- `npm run dev`   — start dev server (localhost:5173)
- `npm run build` — production build
