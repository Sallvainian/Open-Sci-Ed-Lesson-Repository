# Unified Project Structure

```
open-science-ed-lesson-repository/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Run tests on PRs
│       └── deploy.yml                # Deploy to Vercel
├── .next/                            # Next.js build output (gitignored)
├── .vscode/
│   └── settings.json                 # VS Code workspace settings
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # HomePage
│   ├── globals.css                   # Global styles
│   ├── api/                          # API routes (backend)
│   │   ├── disciplines/
│   │   ├── units/
│   │   ├── lessons/
│   │   ├── resources/
│   │   ├── search/
│   │   └── calendar/
│   ├── calendar/
│   │   └── page.tsx
│   ├── library/
│   │   └── page.tsx
│   ├── lessons/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   └── search/
│       └── page.tsx
├── components/                       # React components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Spinner.tsx
│   │   └── CollapsibleSection.tsx
│   ├── dashboard/
│   │   └── UpcomingLessonsWidget.tsx
│   ├── forms/
│   │   ├── LessonForm.tsx
│   │   └── ResourceUploadForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   ├── lessons/
│   │   ├── LessonCard.tsx
│   │   └── StatusBadge.tsx
│   ├── navigation/
│   │   └── NavigationModeSwitcher.tsx
│   ├── resources/
│   │   ├── FileViewerEmbed.tsx
│   │   └── ResourceList.tsx
│   └── search/
│       └── SearchBar.tsx
├── lib/                              # Backend utilities
│   ├── api/
│   │   └── errorHandler.ts
│   ├── db/
│   │   └── client.ts                 # Prisma client
│   ├── storage/
│   │   ├── client.ts                 # Supabase client
│   │   └── uploadHandler.ts
│   ├── search/
│   │   └── searchService.ts
│   └── validation/
│       └── schemas.ts                # Zod schemas
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Seed data script
├── public/                           # Static assets
│   ├── favicon.ico
│   └── images/
├── stores/                           # Zustand stores
│   └── navigationStore.ts
├── styles/                           # Additional styles
│   └── theme.ts                      # Chakra UI theme customization
├── types/                            # TypeScript type definitions
│   ├── index.ts
│   └── api.ts
├── .env.local                        # Environment variables (gitignored)
├── .env.example                      # Example env vars template
├── .eslintrc.json                    # ESLint config
├── .prettierrc                       # Prettier config
├── next.config.js                    # Next.js config
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml                    # Lockfile
├── tsconfig.json                     # TypeScript config
└── README.md                         # Project documentation
```

## Key Files Explained

**`package.json`**:

```json
{
  "name": "open-science-ed-lesson-repository",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@prisma/client": "^5.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "nanoid": "^5.0.0",
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.0",
    "react-pdf": "^7.5.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "@testing-library/react": "^14.0.0",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "14.0.0",
    "prettier": "^3.0.0",
    "prisma": "^5.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.2.0",
    "vitest": "^1.0.0"
  }
}
```

**`.env.example`**:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lesson_repository"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---
