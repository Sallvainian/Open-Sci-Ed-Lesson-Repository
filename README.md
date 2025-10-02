# Open Science Ed Lesson Repository

A web-based lesson planning and resource management tool for organizing OpenSciEd science curriculum materials.

## Overview

This application helps science teachers organize OpenSciEd curriculum materials into a structured, easily navigable repository. It provides:

- **Hierarchical Organization**: Discipline → Unit → Lesson structure
- **Dual Navigation**: Browse by conceptual units or chronological pacing
- **Consistent Lesson Templates**: Standards, objectives, teaching approaches, and resources
- **Resource Hosting**: In-app file storage for quick access to lesson materials
- **Fast Search**: Locate complete lesson materials in under 30 seconds

## Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher
- **PostgreSQL**: 15.x (for production) or Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_KEY`: Your Supabase service key (keep secret!)

### 3. Initialize Database

```bash
pnpm db:push
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript compiler checks
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm db:push` - Push database schema changes
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio database GUI

## Architecture

This is a full-stack Next.js 14 application built with:

- **Frontend**: React 18, TypeScript 5, Chakra UI 2
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL 15 with Prisma 5 ORM
- **Hosting**: Vercel (frontend) + Supabase (database)

For detailed architecture documentation, see [`docs/architecture/`](docs/architecture/).

## Project Structure

```
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── lib/              # Backend utilities and business logic
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── stores/           # Zustand state management
├── styles/           # Global styles and themes
├── types/            # TypeScript type definitions
└── docs/             # Project documentation
```

## Development Workflow

1. Create a feature branch from `main`
2. Make changes following the coding standards in [`docs/architecture/coding-standards.md`](docs/architecture/coding-standards.md)
3. Run tests and linting before committing
4. Create a pull request for review

Pre-commit hooks automatically run linting and formatting checks.

## License

Private - Educational Use Only

## Contact

For questions or support, contact the project maintainer.
