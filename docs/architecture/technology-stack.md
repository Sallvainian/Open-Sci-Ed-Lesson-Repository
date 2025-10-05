# Technology Stack

## Complete Stack Table

| Layer                   | Technology              | Version | Rationale                                                             |
| ----------------------- | ----------------------- | ------- | --------------------------------------------------------------------- |
| **Frontend Framework**  | Next.js                 | 14.x    | React framework with SSR/SSG, optimized for performance, excellent DX |
| **UI Language**         | TypeScript              | 5.x     | Type safety for data models, better IDE support, fewer runtime errors |
| **UI Library**          | React                   | 18.x    | Industry standard, large ecosystem, component-based architecture      |
| **Component Library**   | Chakra UI               | 2.x     | Accessible by default, WCAG 2.1 AA compliant, professional styling    |
| **State Management**    | TanStack Query          | 5.x     | Server state management, caching, automatic refetching                |
| **Client State**        | Zustand                 | 4.x     | Lightweight local state (navigation mode, UI preferences)             |
| **Routing**             | Next.js App Router      | 14.x    | Built-in file-based routing, server components, layouts               |
| **Styling**             | Chakra UI + CSS Modules | -       | Component library + custom styles where needed                        |
| **Forms**               | React Hook Form         | 7.x     | Performance-focused form handling, validation                         |
| **Validation**          | Zod                     | 3.x     | Runtime validation, TypeScript type inference                         |
| **Icons**               | Lucide React            | 0.x     | Modern icon set, tree-shakeable                                       |
| **File Viewing**        | react-pdf + Custom      | -       | PDF rendering, PPTX/DOCX viewers                                      |
| **Backend Framework**   | Next.js API Routes      | 14.x    | Serverless functions, colocated with frontend                         |
| **Backend Language**    | TypeScript              | 5.x     | Shared types with frontend, type-safe APIs                            |
| **Database**            | PostgreSQL              | 17.x    | Relational data model, JSONB for flexibility, mature ecosystem        |
| **Database ORM**        | Prisma                  | 5.x     | Type-safe queries, schema migrations, excellent DX                    |
| **Database Provider**   | Supabase                | -       | Managed PostgreSQL, auto-scaling, generous free tier                  |
| **File Storage**        | Supabase Storage        | -       | S3-compatible, integrated auth, <$20/month target                     |
| **Authentication**      | Supabase Auth           | -       | (Future) Built-in auth, social providers support                      |
| **API Style**           | REST                    | -       | Simple, well-understood, sufficient for MVP                           |
| **Deployment Platform** | Vercel                  | -       | Zero-config Next.js deployment, edge functions, CDN                   |
| **Version Control**     | Git + GitHub            | -       | Standard version control, CI/CD integration                           |
| **Package Manager**     | pnpm                    | 8.x     | Fast, efficient, workspace support                                    |
| **Build Tool**          | Next.js Built-in        | -       | Webpack/Turbopack optimized builds                                    |
| **Testing - Unit**      | Vitest                  | 1.x     | Fast, ESM-native, compatible with React Testing Library               |
| **Testing - Component** | React Testing Library   | 14.x    | User-centric testing, accessibility-focused                           |
| **Testing - E2E**       | Playwright              | 1.x     | Cross-browser testing, reliable, fast                                 |
| **Linting**             | ESLint                  | 8.x     | Code quality, Next.js config, accessibility plugins                   |
| **Formatting**          | Prettier                | 3.x     | Consistent code style, automatic formatting                           |
| **Type Checking**       | TypeScript Compiler     | 5.x     | Static type validation                                                |
| **CI/CD**               | Vercel + GitHub Actions | -       | Automated testing, preview deployments                                |
| **Monitoring**          | Vercel Analytics        | -       | Performance monitoring, Web Vitals tracking                           |
| **Error Tracking**      | Console + Future Sentry | -       | Start with logging, upgrade as needed                                 |

## Technology Decision Rationale

**Frontend Stack (Next.js + React + TypeScript + Chakra UI)**:

- Next.js provides SSR/SSG for fast initial loads and SEO
- TypeScript prevents runtime errors with lesson data models
- Chakra UI delivers WCAG 2.1 AA accessibility out of the box
- TanStack Query handles server state caching for fast navigation

**Backend Stack (Next.js API Routes + Prisma + PostgreSQL)**:

- API Routes eliminate need for separate backend server (cost savings)
- Prisma provides type-safe database access matching frontend types
- PostgreSQL handles hierarchical content structure efficiently
- Supabase provides managed database + file storage in one platform

**Deployment (Vercel + Supabase)**:

- Vercel's hobby tier supports single-user workload within <$20/month budget
- Supabase free tier includes 500MB database + 1GB file storage
- Both platforms offer automatic scaling if user base grows
- Combined infrastructure management time: ~1 hour/month

---
