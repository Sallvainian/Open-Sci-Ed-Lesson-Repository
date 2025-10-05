# Development Workflow

## Local Development Setup

**Prerequisites**:

- Node.js 18.x or higher
- pnpm 8.x
- PostgreSQL 17.x (or Supabase account)

**Initial Setup**:

```bash
# 1. Clone repository
git clone <repo-url>
cd open-science-ed-lesson-repository

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Initialize database
pnpm db:push          # Push Prisma schema to database
pnpm db:seed          # Seed with sample data

# 5. Start development server
pnpm dev              # Runs on http://localhost:3000
```

## Development Commands

```bash
# Development
pnpm dev              # Start Next.js dev server with hot reload

# Build
pnpm build            # Production build
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema changes (development)
pnpm db:migrate       # Create and run migration (production)
pnpm db:seed          # Run seed script
pnpm db:studio        # Open Prisma Studio (database GUI)

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run unit tests with Vitest
pnpm test:e2e         # Run Playwright E2E tests
```

## Git Workflow

**Branch Strategy**:

```
main                  # Production-ready code
└── develop           # Integration branch (optional for single developer)
    └── feature/*     # Feature branches
    └── fix/*         # Bug fix branches
```

**Commit Convention**:

```
feat: Add lesson search functionality
fix: Correct file upload error handling
docs: Update architecture documentation
style: Format code with Prettier
refactor: Simplify search service logic
test: Add tests for lesson API routes
chore: Update dependencies
```

**Example Workflow**:

```bash
# 1. Create feature branch
git checkout -b feature/calendar-view

# 2. Make changes, commit frequently
git add .
git commit -m "feat: Add calendar view page"

# 3. Push to GitHub
git push origin feature/calendar-view

# 4. Open Pull Request
# GitHub Actions will run tests automatically

# 5. Merge after approval
# Vercel will deploy automatically
```

## Code Review Checklist

- [ ] TypeScript types are correct and comprehensive
- [ ] Zod schemas validate all user inputs
- [ ] Error handling is comprehensive
- [ ] Loading states are shown for async operations
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance targets achieved (<3s page load)
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured

---
