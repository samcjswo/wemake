# wemake

A full-stack community platform for discovering and sharing products, jobs, teams, and ideas — built with React Router v7 and Supabase.

Inspired by the NomadCoder online course. Rather than clone coding directly, I referenced the course's structure and page designs, then implemented the project independently with Claude Code.

## Features

- **Products** — browse, search, and submit products; leaderboards by day/week/month/year; category browsing; promote your product
- **Jobs** — post and browse job listings with salary and location filters
- **Teams** — find co-founders and collaborators; post team openings with roles and equity details
- **Community** — create and discuss posts by topic
- **Ideas** — browse startup ideas
- **Authentication** — email/password sign up & sign in, Google OAuth, cookie-based sessions, protected routes

## Tech Stack

- [React Router v7](https://reactrouter.com/) — SSR, file-based routing
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) — database, auth, storage

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under **Settings → API**.

### 3. Start the development server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## Project Structure

```
app/
├── common/
│   ├── components/     # Shared UI components (navigation, page hero, etc.)
│   ├── pages/          # Home page
│   └── queries.ts      # Shared Supabase queries
├── features/
│   ├── community/      # Community posts
│   ├── ideas/          # Startup ideas
│   ├── jobs/           # Job listings
│   ├── products/       # Products, leaderboards, categories
│   ├── teams/          # Team listings
│   └── users/          # Auth pages (sign in, join, logout)
├── lib/
│   └── auth.server.ts  # requireAuth() utility
├── root.tsx
├── routes.ts
└── supa-client.ts      # Supabase client + makeServerClient()
```

## Building for Production

```bash
npm run build
```
