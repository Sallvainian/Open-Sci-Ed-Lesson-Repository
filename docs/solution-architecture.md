# Solution Architecture Document

**Project:** OpenSciEd Lesson Repository
**Date:** 2025-10-13
**Author:** Frank (Architect: Winston)
**Version:** 1.0

---

## Executive Summary

The OpenSciEd Lesson Repository is a static-first web application that transforms the OpenSciEd middle school science curriculum from PDF documents into a structured, searchable digital platform. This architecture document defines a **Level 3 solution** with comprehensive subsystem design for an MVP focused on individual teacher use, with a clear path to Phase 2 multi-user functionality.

**Architecture Approach:** Monolithic Next.js 15 application using Static Site Generation (SSG) with localStorage for MVP, architected with clean adapter patterns for future Supabase backend integration.

**Key Characteristics:**
- **Zero backend complexity** for MVP (pure static site)
- **Sub-3-second load times** via SSG and Vercel CDN
- **WCAG 2.1 AA accessibility** by default
- **Backend-ready architecture** for Phase 2 expansion
- **Free hosting** on Vercel with generous limits

**Success Metrics:**
- 50% time reduction in lesson planning (20-30 min → 10-15 min)
- <3s initial page load, <500ms navigation
- 90%+ daily tool adoption by target user
- Lighthouse performance score >90

---

## 1. Technology Stack and Decisions

### 1.1 Technology and Library Decision Table

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Framework** | Next.js | 15.x | Latest stable with App Router, optimal SSG support, Vercel integration, React 19 |
| **Language** | TypeScript | 5.x | Type safety, better DX, strict mode for quality, industry standard |
| **Runtime** | React | 19.x | Comes with Next.js 15, latest features, improved performance |
| **Styling** | Tailwind CSS | 3.x | Utility-first, rapid development, dark mode support, small bundle |
| **Component Library** | shadcn/ui | Latest | Accessible by default, copy-paste (no lock-in), TypeScript native |
| **Icons** | Lucide React | Latest | Consistent with shadcn/ui, tree-shakeable, comprehensive set |
| **State Management (MVP)** | React Context API | Built-in | Sufficient for MVP, no external deps, simple for limited state |
| **Storage (MVP)** | localStorage | Browser API | No backend needed, instant persistence, zero cost |
| **Testing (Unit)** | Vitest | Latest | 5-10x faster than Jest, ESM native, Jest-compatible API |
| **Testing (E2E)** | Playwright | Latest | Industry standard, real browser testing, built-in accessibility tools |
| **Package Manager** | pnpm | 9.x | Fastest installs, disk space efficient, monorepo-ready |
| **Hosting** | Vercel | Free tier | Made by Next.js creators, automatic deployments, edge CDN |
| **CI/CD** | GitHub Actions + Vercel | Free | Automated testing on PR, auto-deploy on merge |
| **Analytics** | Vercel Analytics | Free tier | Basic metrics, privacy-friendly, zero config |
| **Linting** | ESLint | 9.x | Code quality, Next.js config, TypeScript rules |
| **Formatting** | Prettier | Latest | Consistent code style, auto-formatting, team standard |

### 1.2 Phase 2 Technology Additions (Not in MVP)

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Database** | Supabase (PostgreSQL) | Latest | Managed PostgreSQL, auth, realtime, generous free tier |
| **Authentication** | Supabase Auth | Built-in | Magic links, OAuth, RLS security, zero config |
| **ORM/Client** | Supabase JavaScript Client | Latest | Type-safe, generated types, real-time subscriptions |
| **Search** | PostgreSQL Full-Text | Built-in | Free, integrated with Supabase, sufficient for lesson search |
| **File Storage** | Supabase Storage | Built-in | User uploads, CDN delivery, integrated with auth |

### 1.3 Why These Choices? (Beginner-Friendly Explanations)

**Why Next.js 15 over plain React?**
- **Built-in routing:** No need for React Router library
- **Static Site Generation (SSG):** Pre-renders pages at build time for instant loads
- **Image optimization:** Automatic image compression and lazy loading
- **SEO-friendly:** Meta tags and search engine optimization built-in
- **Production-ready:** Includes everything needed (no assembly required)

**Why TypeScript over JavaScript?**
- **Catches errors before runtime:** IDE shows errors as you type
- **Better autocomplete:** Your editor suggests available properties and methods
- **Refactoring confidence:** Rename variables safely across entire codebase
- **Documentation built-in:** Type definitions explain what functions expect

**Why Tailwind CSS?**
- **No CSS files to manage:** Styles live next to HTML
- **Dark mode easy:** Single config enables dark theme globally
- **Responsive design simple:** Built-in breakpoint utilities (sm:, md:, lg:)
- **Small production bundle:** Only used classes included (automatic tree-shaking)

**Why shadcn/ui over Material-UI or Chakra?**
- **Not a library:** Copy component code into your project (full control)
- **Accessible by default:** WCAG AA compliance built-in
- **Tailwind-based:** Matches your styling approach
- **No dependency lock-in:** Own the code, modify freely

**Why Vitest over Jest?**
- **Modern and fast:** Built for Vite/Next.js (5-10x faster)
- **Same API as Jest:** Easy transition if needed
- **Native ESM:** Works with modern JavaScript modules
- **Better TypeScript support:** No configuration needed

**Why Playwright over Cypress?**
- **Real browsers:** Tests in actual Chrome, Firefox, Safari
- **Accessibility testing:** Built-in WCAG compliance checking
- **Industry standard:** Used by Microsoft, VS Code, etc.
- **Parallel execution:** Faster test runs

**Why pnpm over npm?**
- **Faster:** 2-3x faster package installations
- **Smaller:** Saves disk space via global package deduplication
- **Same commands:** `pnpm install` = `npm install` (drop-in replacement)

**Why Vercel over Netlify/GitHub Pages?**
- **Best Next.js integration:** Made by same team
- **Generous free tier:** 100GB bandwidth, unlimited deployments
- **Preview deployments:** Every PR gets unique URL for testing
- **Zero config:** Push to GitHub → automatic deployment

---

## 2. Application Architecture

### 2.1 Architecture Pattern

**Pattern:** Monolithic Static Application with Modular Structure

**What this means (beginner-friendly):**
- **Monolithic:** Single Next.js application (not multiple separate services)
- **Static:** All pages pre-rendered at build time (no server needed for MVP)
- **Modular:** Code organized by feature/domain for future expansion

**Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Components (Next.js 15 App Router)         │  │
│  │  • Dashboard   • Navigation   • Lesson Display    │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  localStorage (Client-Side Storage - MVP)         │  │
│  │  • Last viewed lesson   • Recently viewed list    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
            (Loads pre-built static files)
                          ↕
┌─────────────────────────────────────────────────────────┐
│           Vercel CDN (Edge Network)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Static HTML/CSS/JS Files (Pre-rendered)          │  │
│  │  Static JSON Data Files (Lesson content)          │  │
│  │  Static PDFs/PowerPoints (Resources)              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Phase 2 Expansion (Future):**

```
User's Browser → Next.js App → Supabase (PostgreSQL + Auth)
                             ↓
                    Storage Adapter Pattern
                    (localStorage → Supabase)
```

### 2.2 Static Site Generation (SSG) Strategy

**Approach:** Build-time pre-rendering of all pages

**What gets pre-rendered:**
1. **Dashboard page** (`/`) - Static, same for all users
2. **Discipline pages** (`/browse/physical-science`) - One per discipline (3 total)
3. **Unit pages** (`/browse/physical-science/8.1`) - One per unit (~45 total)
4. **Lesson pages** (`/browse/physical-science/8.1/8.1.2`) - One per lesson (~150-200 total)

**Build process:**
```bash
# At build time (pnpm build):
1. Read all JSON files from /data directory
2. Generate static HTML for each discipline/unit/lesson
3. Optimize images and bundle JavaScript
4. Output to /.next/static (ready for CDN)
```

**Why SSG for this project:**
- ✅ Content rarely changes (curriculum is stable)
- ✅ No personalization needed in MVP (same content for all users)
- ✅ Fastest possible load times (<3s requirement)
- ✅ Free hosting (no server costs)
- ✅ SEO benefits (search engines see full HTML)

**When to rebuild:**
- When lesson content changes (manual data update)
- When code/styling changes (deploy triggers rebuild)
- Estimated: 1-2 times per month (low frequency)

### 2.3 Page Routing and Navigation

**Route Structure:**

```
/ (root)
└─ Dashboard page
   • Pick Up Where You Left Off card
   • Recently Viewed lessons
   • Browse by Discipline cards

/browse/[discipline]
└─ Discipline view (e.g., /browse/physical-science)
   • List of units within discipline
   • Unit metadata (lesson count, duration)

/browse/[discipline]/[unit]
└─ Unit view (e.g., /browse/physical-science/8.1)
   • List of lessons within unit
   • Lesson titles and overview

/browse/[discipline]/[unit]/[lesson]
└─ Lesson detail (e.g., /browse/physical-science/8.1/8.1.2)
   • Complete lesson information
   • Learning objectives, materials, sequence, guidance, resources
```

**Dynamic Route Implementation (Next.js 15 App Router):**

```
app/
├── page.tsx                          # Dashboard (/)
├── layout.tsx                        # Root layout (navigation, theme)
└── browse/
    └── [discipline]/
        ├── page.tsx                  # Discipline view
        └── [unit]/
            ├── page.tsx              # Unit view
            └── [lesson]/
                └── page.tsx          # Lesson detail
```

**Route Generation at Build Time:**

Next.js will call `generateStaticParams()` to create all routes:

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx
export async function generateStaticParams() {
  const lessons = await getAllLessons()

  return lessons.map((lesson) => ({
    discipline: lesson.disciplineSlug,
    unit: lesson.unitId,
    lesson: lesson.lessonId
  }))
}
// Generates: 150-200 static HTML pages at build time
```

### 2.4 Data Fetching Approach

**MVP Approach:** Static JSON files loaded at build time

**Data Structure:**

```
data/
├── disciplines.json          # 3 disciplines (Life, Earth&Space, Physical)
├── units.json                # ~45 units across all disciplines
└── lessons/
    ├── lesson-6.1.1.json     # Individual lesson data
    ├── lesson-6.1.2.json
    ├── lesson-8.1.1.json
    └── ...                   # 150-200 lesson files
```

**Example Lesson JSON Schema:**

```json
{
  "id": "8.1.2",
  "title": "Chemical Reactions and Energy Transfer",
  "disciplineId": "physical-science",
  "disciplineSlug": "physical-science",
  "unitId": "8.1",
  "unitTitle": "Chemical Reactions and Matter",
  "duration": "45 minutes",
  "standards": ["MS-PS1-2", "MS-PS3-1"],
  "objectives": [
    "Analyze evidence that chemical reactions involve energy transfer",
    "Construct explanations using molecular models",
    "Develop claims supported by evidence from investigations"
  ],
  "materials": [
    { "quantity": "Per Group", "description": "250mL beaker", "audience": "both" },
    { "quantity": "Per Group", "description": "Thermometer (-10°C to 110°C)", "audience": "both" },
    { "quantity": "Per Student", "description": "Safety goggles", "audience": "both" }
  ],
  "sequence": [
    { "phase": "Engage", "duration": 10, "description": "Hook activity...", "audience": "both" },
    { "phase": "Explore", "duration": 15, "description": "Investigation...", "audience": "both" },
    { "phase": "Explain", "duration": 10, "description": "Class discussion...", "audience": "both" },
    { "phase": "Elaborate", "duration": 5, "description": "Apply learning...", "audience": "both" },
    { "phase": "Evaluate", "duration": 5, "description": "Assessment...", "audience": "teacher" }
  ],
  "teachingGuidance": {
    "misconceptions": ["Students may think energy is used up in reactions"],
    "keyQuestions": ["Where does the energy come from in this reaction?"],
    "differentiationNotes": "Provide molecular model manipulatives...",
    "audience": "teacher"
  },
  "resources": [
    { "type": "PDF", "title": "Teacher Guide", "url": "/resources/8.1.2-teacher-guide.pdf", "audience": "teacher" },
    { "type": "PPT", "title": "Slides", "url": "/resources/8.1.2-slides.pptx", "audience": "both" }
  ],
  "audience": "both"
}
```

**Data Loading Pattern:**

```typescript
// lib/data/loader.ts
import disciplines from '@/data/disciplines.json'
import units from '@/data/units.json'

export async function getLesson(disciplineSlug: string, unitId: string, lessonId: string) {
  const lesson = await import(`@/data/lessons/lesson-${lessonId}.json`)
  return lesson.default
}

export function getAllDisciplines() {
  return disciplines
}

export function getUnitsByDiscipline(disciplineSlug: string) {
  return units.filter(u => u.disciplineSlug === disciplineSlug)
}
```

**Why static JSON:**
- ✅ Simple to edit (no database needed)
- ✅ Version controlled (Git tracks all changes)
- ✅ Fast at runtime (loaded at build time, not request time)
- ✅ Easy migration to database later (same schema structure)

---

## 3. Data Architecture

### 3.1 TypeScript Type Definitions

**Core Types:**

```typescript
// lib/types/lesson.ts
export interface Discipline {
  id: string
  name: string
  slug: string
  description: string
  iconName: string
  color: string // Tailwind color class
  unitCount: number
}

export interface Unit {
  id: string
  title: string
  disciplineSlug: string
  lessonCount: number
  estimatedDuration: string // e.g., "3 weeks"
  description: string
}

export interface LessonMaterial {
  quantity: string // "Per Group", "Per Student", "Per Class"
  description: string
  notes?: string
  audience?: 'teacher' | 'student' | 'both' // Default: "both" - FR-12 student-facing view support
}

export interface LessonPhase {
  phase: 'Engage' | 'Explore' | 'Explain' | 'Elaborate' | 'Evaluate'
  duration: number // minutes
  description: string
  audience?: 'teacher' | 'student' | 'both' // Default: "both" - FR-12 student-facing view support
}

export interface TeachingGuidance {
  misconceptions: string[]
  keyQuestions: string[]
  differentiationNotes?: string
  audience?: 'teacher' | 'student' | 'both' // Default: "teacher" - typically teacher-only content
}

export interface Resource {
  type: 'PDF' | 'PPT' | 'DOC' | 'URL'
  title: string
  url: string
  audience?: 'teacher' | 'student' | 'both' // Default: "both" - FR-12 student-facing view support
}

export interface Lesson {
  id: string
  title: string
  disciplineId: string
  disciplineSlug: string
  unitId: string
  unitTitle: string
  duration: string
  standards: string[]
  objectives: string[]
  materials: LessonMaterial[]
  sequence: LessonPhase[]
  teachingGuidance: TeachingGuidance
  resources: Resource[]
  audience?: 'teacher' | 'student' | 'both' // Default: "both" - FR-12 student-facing view support
}
```

### 3.2 Client-Side Storage (localStorage)

**What gets stored locally:**

```typescript
// lib/storage/types.ts
export interface LocalStorageData {
  lastViewedLesson: {
    lessonId: string
    disciplineSlug: string
    unitId: string
    timestamp: number
  } | null

  recentlyViewed: Array<{
    lessonId: string
    title: string
    disciplineSlug: string
    unitId: string
    timestamp: number
  }> // Max 5 items

  preferences: {
    theme: 'dark' | 'light' // dark is default
  }
}
```

**Storage Utility Functions:**

```typescript
// lib/storage/localStorage.ts
const STORAGE_KEY = 'opensci-ed-app'

export function saveLastViewed(lesson: Lesson): void {
  const data = getStorageData()
  data.lastViewedLesson = {
    lessonId: lesson.id,
    disciplineSlug: lesson.disciplineSlug,
    unitId: lesson.unitId,
    timestamp: Date.now()
  }

  // Also add to recently viewed list
  data.recentlyViewed = [
    {
      lessonId: lesson.id,
      title: lesson.title,
      disciplineSlug: lesson.disciplineSlug,
      unitId: lesson.unitId,
      timestamp: Date.now()
    },
    ...data.recentlyViewed.filter(l => l.lessonId !== lesson.id)
  ].slice(0, 5) // Keep only last 5

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getStorageData(): LocalStorageData {
  if (typeof window === 'undefined') return getDefaultData()

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : getDefaultData()
}
```

### 3.3 Phase 2 Data Migration Strategy

**Adapter Pattern for Future Supabase:**

```typescript
// lib/adapters/storage.interface.ts
export interface StorageAdapter {
  saveLastViewed(lessonId: string): Promise<void>
  getLastViewed(): Promise<string | null>
  getRecentlyViewed(): Promise<RecentLesson[]>
  savePreferences(prefs: UserPreferences): Promise<void>
}

// lib/adapters/localStorage.adapter.ts
export class LocalStorageAdapter implements StorageAdapter {
  async saveLastViewed(lessonId: string) {
    // Implementation using localStorage
  }
  // ... other methods
}

// lib/adapters/supabase.adapter.ts (Phase 2)
export class SupabaseAdapter implements StorageAdapter {
  async saveLastViewed(lessonId: string) {
    // Implementation using Supabase
    await supabase.from('user_activity').insert({
      user_id: getCurrentUserId(),
      lesson_id: lessonId,
      action: 'viewed',
      timestamp: new Date()
    })
  }
  // ... other methods
}
```

**Migration is a one-line change:**

```typescript
// lib/storage/index.ts
// MVP:
export const storage = new LocalStorageAdapter()

// Phase 2 (just swap adapter):
export const storage = new SupabaseAdapter()

// All components use same interface - no changes needed!
```

---

## 4. State Management & UI Architecture

### 4.1 State Management Strategy

**MVP:** React Context API + localStorage

```typescript
// lib/contexts/AppContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AppState {
  lastViewedLesson: LastViewed | null
  recentlyViewed: RecentLesson[]
  theme: 'dark' | 'light'
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => getStorageData())

  return <AppContext.Provider value={{ ...state, saveLastViewed, setTheme }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
```

### 4.2 Component Architecture

**shadcn/ui + Custom Components:**

```
components/
├── ui/                  # shadcn/ui primitives (copy-pasted)
│   ├── button.tsx
│   ├── card.tsx
│   ├── skeleton.tsx
│   └── separator.tsx
│
├── navigation/          # Custom navigation
│   ├── HamburgerMenu.tsx
│   ├── Breadcrumb.tsx
│   └── MobileNav.tsx
│
├── dashboard/           # Custom dashboard
│   ├── PickUpCard.tsx
│   ├── RecentlyViewed.tsx
│   ├── DisciplineCards.tsx
│   └── ComingSoonCard.tsx
│
└── lesson/              # Custom lesson display
    ├── LessonHeader.tsx
    ├── ObjectivesCard.tsx
    ├── MaterialsList.tsx
    ├── LessonSequence.tsx
    ├── TeachingGuidance.tsx
    └── ResourceLinks.tsx
```

### 4.3 Responsive Design

**Breakpoints:** Desktop (≥1024px) primary, Tablet (768-1023px) secondary

```tsx
<div className="
  grid
  grid-cols-1 md:grid-cols-3  /* 1 col mobile, 3 cols tablet+ */
  gap-4 md:gap-6              /* Smaller gap on mobile */
">
```

### 4.4 Accessibility (WCAG 2.1 AA)

**Key Requirements:**
- ✅ Keyboard navigation for all interactions
- ✅ ARIA labels on interactive elements
- ✅ Focus indicators (2px blue ring)
- ✅ Color contrast 4.5:1 (text), 3:1 (interactive)
- ✅ Semantic HTML (nav, main, article, section)

---

## 5. Performance Optimization

### 5.1 Target Metrics

| Metric | Target | Strategy |
|--------|--------|----------|
| Page Load | <3s | SSG + CDN |
| Navigation | <500ms | Client routing + prefetch |
| Lighthouse | >90 | Code splitting + optimization |
| FCP | <1.5s | SSG + image optimization |
| TTI | <3.5s | Lazy loading |

### 5.2 Optimization Techniques

**1. Static Site Generation:**
- All pages pre-rendered at build time
- Served from Vercel edge CDN

**2. Image Optimization:**
```tsx
import Image from 'next/image'
<Image src="/icon.png" width={64} height={64} loading="lazy" />
```

**3. Code Splitting:**
- Automatic per-route splitting
- Dynamic imports for modals

**4. Prefetching:**
```tsx
<Link href="/browse/physical-science" prefetch={true}>
  // Prefetches on hover = instant navigation
</Link>
```

---

## 6. Deployment & DevOps

### 6.1 Hosting Platform: Vercel

**Configuration:**

```javascript
// next.config.js
module.exports = {
  output: 'export', // Static export for SSG
  images: {
    unoptimized: true // Required for static export
  }
}
```

**Vercel Deployment:**
1. Connect GitHub repository
2. Auto-deploy on push to `main`
3. Preview URLs for every PR
4. Production: https://opensci-ed.vercel.app

### 6.2 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

**Workflow:**
1. Developer creates PR
2. GitHub Actions runs tests
3. Vercel creates preview deployment
4. Review → Merge → Auto-deploy to production

### 6.3 Environment Variables

**MVP (Static Site):**
- No sensitive environment variables needed
- All data is public (curriculum content)

**Phase 2:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 7. Testing Strategy

### 7.1 Unit Tests (Vitest)

**Coverage Target:** 70% for business logic

```typescript
// components/lesson/ObjectivesCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ObjectivesCard } from './ObjectivesCard'

describe('ObjectivesCard', () => {
  it('renders all objectives', () => {
    const objectives = ['Objective 1', 'Objective 2']
    render(<ObjectivesCard objectives={objectives} />)
    
    expect(screen.getByText('Objective 1')).toBeInTheDocument()
    expect(screen.getByText('Objective 2')).toBeInTheDocument()
  })
})
```

### 7.2 E2E Tests (Playwright)

**Critical Paths:**

```typescript
// tests/e2e/lesson-navigation.spec.ts
import { test, expect } from '@playwright/test'

test('user can navigate to lesson from dashboard', async ({ page }) => {
  await page.goto('/')
  
  // Click Physical Science
  await page.click('text=Physical Science')
  
  // Click Unit 8.1
  await page.click('text=Unit 8.1')
  
  // Click Lesson 8.1.2
  await page.click('text=Lesson 8.1.2')
  
  // Verify lesson content loads
  await expect(page.locator('h1')).toContainText('Chemical Reactions')
})

test('accessibility: keyboard navigation', async ({ page }) => {
  await page.goto('/')
  
  // Tab through interactive elements
  await page.keyboard.press('Tab') // Hamburger menu
  await page.keyboard.press('Tab') // Pick Up card
  await page.keyboard.press('Enter') // Activate
  
  await expect(page).toHaveURL(/browse/)
})
```

### 7.3 Accessibility Testing

**Automated (Playwright):**

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('should not have WCAG violations', async ({ page }) => {
  await page.goto('/')
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})
```

---

## 8. Architecture Decision Records (ADRs)

### ADR-001: Static Site Generation over Server-Side Rendering

**Decision:** Use SSG for MVP

**Rationale:**
- Content rarely changes (curriculum is stable)
- No personalization needed (same for all users)
- Fastest load times (<3s requirement)
- Free hosting (no server costs)
- Easy to migrate to SSR/ISR later if needed

**Trade-offs:**
- ❌ Requires rebuild to update content (acceptable for stable curriculum)
- ✅ Fastest possible performance
- ✅ Zero infrastructure costs
- ✅ Maximum simplicity

### ADR-002: localStorage over Backend Database (MVP)

**Decision:** Use browser localStorage for user preferences

**Rationale:**
- MVP is single-user only
- Only tracking last-viewed and preferences
- No authentication needed
- Zero backend complexity
- Adapter pattern enables easy migration

**Trade-offs:**
- ❌ Data lost if browser cache cleared
- ❌ Not synced across devices
- ✅ Zero infrastructure
- ✅ Instant persistence
- ✅ Perfect for MVP scope

### ADR-003: Next.js 15 over Vite + React

**Decision:** Use Next.js 15 with App Router

**Rationale:**
- Built-in routing (no React Router needed)
- Native SSG support
- Image optimization out of box
- SEO-friendly by default
- Best Vercel integration

**Trade-offs:**
- ❌ Slightly more opinionated than Vite
- ✅ Production-ready with zero config
- ✅ Better developer experience
- ✅ Comprehensive feature set

### ADR-004: Tailwind CSS + shadcn/ui over Component Library

**Decision:** Tailwind CSS + shadcn/ui

**Rationale:**
- Dark mode simple (single config)
- No library lock-in (copy-paste components)
- Accessible by default (WCAG AA)
- Small bundle size (tree-shakeable)
- Rapid development with utility classes

**Trade-offs:**
- ❌ More verbose HTML (utility classes)
- ✅ Full styling control
- ✅ No dependency management
- ✅ Perfect customization

### ADR-005: Vercel over Netlify or GitHub Pages

**Decision:** Deploy on Vercel free tier

**Rationale:**
- Made by Next.js creators (optimal integration)
- 100GB bandwidth free (sufficient for MVP)
- Preview deployments (test PRs before merge)
- Zero configuration needed
- Best performance (edge network)

**Trade-offs:**
- ❌ Vendor lock-in (mitigated by static export)
- ✅ Superior Next.js performance
- ✅ Best developer experience
- ✅ Free tier generous

---

## 9. Proposed Source Tree

```
opensci-ed-repo/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
│
├── app/                               # Next.js 15 App Router
│   ├── layout.tsx                    # Root layout (navigation, providers)
│   ├── page.tsx                      # Dashboard (/)
│   ├── globals.css                   # Global styles (Tailwind imports)
│   ├── error.tsx                     # Error boundary
│   └── browse/
│       └── [discipline]/
│           ├── page.tsx              # Discipline view
│           └── [unit]/
│               ├── page.tsx          # Unit view
│               └── [lesson]/
│                   └── page.tsx      # Lesson detail
│
├── components/
│   ├── navigation/
│   │   ├── HamburgerMenu.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── PickUpCard.tsx
│   │   ├── RecentlyViewed.tsx
│   │   ├── DisciplineCards.tsx
│   │   └── ComingSoonCard.tsx
│   ├── lesson/
│   │   ├── LessonHeader.tsx
│   │   ├── ObjectivesCard.tsx
│   │   ├── MaterialsList.tsx
│   │   ├── LessonSequence.tsx
│   │   ├── TeachingGuidance.tsx
│   │   └── ResourceLinks.tsx
│   ├── ui/                           # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   └── ... (other shadcn components)
│   └── providers/
│       ├── AppProvider.tsx           # Global state
│       └── ThemeProvider.tsx         # Dark mode
│
├── lib/
│   ├── types/
│   │   └── lesson.ts                 # TypeScript interfaces
│   ├── data/
│   │   └── loader.ts                 # JSON data loading utilities
│   ├── storage/
│   │   ├── localStorage.ts           # localStorage utilities
│   │   └── types.ts                  # Storage type definitions
│   ├── adapters/
│   │   ├── storage.interface.ts      # Storage adapter interface
│   │   ├── localStorage.adapter.ts   # MVP implementation
│   │   └── supabase.adapter.ts       # Phase 2 (future)
│   └── utils/
│       └── cn.ts                     # Utility functions (className merge)
│
├── data/                              # Static JSON data
│   ├── disciplines.json              # 3 disciplines
│   ├── units.json                    # ~45 units
│   └── lessons/
│       ├── lesson-6.1.1.json
│       ├── lesson-6.1.2.json
│       ├── lesson-8.1.1.json
│       └── ... (150-200 lessons)
│
├── public/                            # Static assets
│   ├── images/
│   │   ├── disciplines/              # Discipline icons
│   │   └── icons/                    # UI icons
│   └── resources/                    # PDF/PPT files
│       ├── 6.1.1-teacher-guide.pdf
│       ├── 6.1.1-slides.pptx
│       └── ...
│
├── tests/
│   ├── unit/
│   │   └── components/
│   │       ├── ObjectivesCard.test.tsx
│   │       └── ... (component tests)
│   └── e2e/
│       ├── lesson-navigation.spec.ts
│       ├── accessibility.spec.ts
│       └── ... (E2E tests)
│
├── docs/                              # Project documentation
│   ├── PRD.md
│   ├── ux-specification.md
│   ├── solution-architecture.md       # This document
│   └── tech-spec-epic-*.md           # Epic tech specs
│
├── .env.local                         # Local environment variables
├── .eslintrc.json                     # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies
├── pnpm-lock.yaml                     # pnpm lockfile
├── vitest.config.ts                   # Vitest configuration
├── playwright.config.ts               # Playwright configuration
└── README.md                          # Project README

**Key Directories:**

- **`app/`**: Next.js 15 App Router pages and layouts
- **`components/`**: Reusable React components (custom + shadcn/ui)
- **`lib/`**: Utilities, types, data loading, storage adapters
- **`data/`**: Static JSON lesson content (version controlled)
- **`public/`**: Static assets (images, PDFs, PowerPoints)
- **`tests/`**: Unit tests (Vitest) and E2E tests (Playwright)
- **`docs/`**: Product and technical documentation
```

---

## 10. Implementation Guidance

### 10.1 Development Workflow

**Setup:**
```bash
# Clone repository
git clone https://github.com/yourusername/opensci-ed-repo.git
cd opensci-ed-repo

# Install dependencies
pnpm install

# Run development server
pnpm dev
# Open http://localhost:3000
```

**Development Commands:**
```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build for production (static export)
pnpm start        # Preview production build locally
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript compiler check
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run E2E tests (Playwright)
pnpm format       # Format code with Prettier
```

### 10.2 Git Workflow

**Branching Strategy:**
```
main              # Production branch (auto-deploys to Vercel)
└─ feature/*      # Feature branches (e.g., feature/lesson-display)
└─ fix/*          # Bug fix branches
```

**Commit Workflow:**
```bash
git checkout -b feature/dashboard-layout
# Make changes
git add .
git commit -m "feat: add dashboard layout with discipline cards"
git push origin feature/dashboard-layout
# Create PR on GitHub
```

### 10.3 Adding New shadcn/ui Components

```bash
# Add button component
npx shadcn-ui@latest add button

# Add card component
npx shadcn-ui@latest add card

# Components are copied to components/ui/
# Customize freely - you own the code!
```

### 10.4 Adding New Lesson Data

```json
// data/lessons/lesson-NEW.json
{
  "id": "NEW",
  "title": "Lesson Title",
  "disciplineSlug": "physical-science",
  "unitId": "8.1",
  // ... (follow existing schema)
}
```

Then rebuild: `pnpm build`

---

## 11. Phase 2 Expansion Plan

### 11.1 Multi-User Features (Phase 2)

**Backend Addition:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (magic links, OAuth)
- **Storage:** User-uploaded resources

**Architecture Changes:**
```typescript
// ONE LINE CHANGE:
// lib/storage/index.ts
export const storage = new SupabaseAdapter() // Was: LocalStorageAdapter()

// Everything else stays the same!
```

**New Features:**
- User accounts and profiles
- Classes and rosters
- Custom lesson plans
- Shared resources
- Assignment tracking
- Progress reports

**Database Schema (Phase 2):**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT -- 'teacher', 'admin'
);

CREATE TABLE classes (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users(id),
  name TEXT,
  period TEXT
);

CREATE TABLE lesson_views (
  user_id UUID REFERENCES users(id),
  lesson_id TEXT,
  viewed_at TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE custom_lessons (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users(id),
  title TEXT,
  content JSONB
);
```

### 11.2 Mobile App (Phase 3)

**Approach:** React Native (reuse logic)

```
opensci-ed-repo/ (monorepo)
├── apps/
│   ├── web/        # Next.js (current)
│   └── mobile/     # React Native (Phase 3)
└── packages/
    └── shared/     # Shared types, utilities, business logic
```

**Reuse:**
- TypeScript types (100%)
- Business logic (80%)
- Component logic (60%)
- Styling concepts (themes, colors)

---

## 12. Security Considerations

### 12.1 MVP Security (Static Site)

**Current Posture:**
- ✅ No backend = no attack surface
- ✅ No user data = no privacy concerns
- ✅ All content public (curriculum)
- ✅ HTTPS via Vercel (automatic)
- ✅ No cookies or tracking

**Dependencies:**
```bash
# Regularly update dependencies
pnpm update

# Audit for vulnerabilities
pnpm audit
```

### 12.2 Phase 2 Security (With Backend)

**Authentication:**
- Supabase Auth (industry-standard security)
- Magic links (no passwords to leak)
- Row-Level Security (RLS) policies

**Data Protection:**
```sql
-- Example RLS policy: Users only see their own lessons
CREATE POLICY user_lessons ON custom_lessons
  FOR SELECT USING (auth.uid() = teacher_id);
```

**HTTPS:** Enforced by Vercel (automatic)

**CSP Headers:** Content Security Policy to prevent XSS

---

## 13. Monitoring & Analytics

### 13.1 MVP Monitoring

**Vercel Analytics (Free Tier):**
- Page views
- Load times
- Web Vitals (LCP, FID, CLS)
- Geographic distribution

**Access:** Vercel dashboard → Analytics tab

### 13.2 Error Tracking (Optional)

**Sentry (Free Tier: 5K events/month):**

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0
})
```

---

## 14. Success Criteria & Validation

### 14.1 Technical Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page Load | <3s | Lighthouse, Vercel Analytics |
| Navigation | <500ms | Browser DevTools, user testing |
| Lighthouse Score | >90 | Chrome Lighthouse |
| Test Coverage | >70% | Vitest coverage report |
| Accessibility | WCAG AA | Playwright axe tests |
| Build Time | <2 min | Vercel build logs |

### 14.2 User Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time Savings | 50% reduction | User interviews (20-30 min → 10-15 min) |
| First Use Success | >90% | Time to first lesson view (<60s) |
| Daily Adoption | >90% | Vercel Analytics (return visits) |
| User Satisfaction | >80% | Post-MVP survey |

### 14.3 Validation Checklist

**Before Launch:**
- [ ] All 4 epics implemented
- [ ] Dashboard + lesson detail working
- [ ] 3-click navigation validated
- [ ] Dark mode working
- [ ] Responsive (desktop + tablet)
- [ ] Lighthouse >90
- [ ] WCAG AA compliance verified
- [ ] E2E tests passing
- [ ] User testing with Frank completed
- [ ] All PDF/PPT resources accessible

---

## 15. Risk Assessment & Mitigation

### 15.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Vercel free tier limits | Low | Medium | Monitor bandwidth, upgrade if needed ($20/month) |
| Browser compatibility | Low | Low | Modern browsers only (stated in requirements) |
| localStorage data loss | Medium | Low | MVP acceptable, Phase 2 has backend |
| Build time as content grows | Medium | Low | Incremental Static Regeneration (ISR) in Phase 2 |

### 15.2 Product Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| User doesn't adopt | Low | High | Built with primary user (Frank) input |
| Content extraction too slow | Medium | Medium | Manual extraction acceptable for MVP |
| Mobile need before Phase 3 | Low | Medium | Tablet support bridges gap |

---

## Appendices

### Appendix A: Technology Version Matrix

| Technology | Version | Release Date | Support Until |
|-----------|---------|--------------|---------------|
| Next.js | 15.x | Oct 2025 | ~Oct 2027 |
| React | 19.x | Oct 2025 | ~Oct 2027 |
| TypeScript | 5.x | Current | Ongoing |
| Tailwind CSS | 3.x | Current | Ongoing |
| Node.js | 20.x LTS | Current | Apr 2026 |

### Appendix B: Learning Resources

**Next.js 15:**
- Official Docs: https://nextjs.org/docs
- App Router Guide: https://nextjs.org/docs/app

**Tailwind CSS:**
- Docs: https://tailwindcss.com/docs
- Dark Mode: https://tailwindcss.com/docs/dark-mode

**shadcn/ui:**
- Component Gallery: https://ui.shadcn.com
- Installation: https://ui.shadcn.com/docs/installation/next

**TypeScript:**
- Handbook: https://www.typescriptlang.org/docs/handbook/

**Vitest:**
- Guide: https://vitest.dev/guide/

**Playwright:**
- Docs: https://playwright.dev/docs/intro

### Appendix C: Glossary

- **SSG (Static Site Generation):** Pre-rendering pages at build time
- **SSR (Server-Side Rendering):** Rendering pages on each request
- **ISR (Incremental Static Regeneration):** Updating static pages after build
- **CDN (Content Delivery Network):** Distributed servers for fast content delivery
- **LSP (Language Server Protocol):** Editor integration for TypeScript
- **WCAG (Web Content Accessibility Guidelines):** Accessibility standards
- **RLS (Row-Level Security):** Database-level access control
- **LCP (Largest Contentful Paint):** Performance metric
- **FID (First Input Delay):** Interactivity metric
- **CLS (Cumulative Layout Shift):** Visual stability metric

---

**Document Status:** ✅ Complete

**Generated:** 2025-10-13

**Next Steps:**
1. Run cohesion check against PRD/UX spec
2. Generate epic-specific tech specs
3. Begin Epic 1 implementation

---

_This solution architecture document provides comprehensive technical guidance for implementing the OpenSciEd Lesson Repository MVP. All major architectural decisions are documented with beginner-friendly explanations and clear rationale._

