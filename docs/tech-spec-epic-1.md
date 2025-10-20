# Technical Specification: Epic 1 - Core Navigation and Data Infrastructure

**Project:** OpenSciEd Lesson Repository
**Date:** 2025-10-14
**Epic:** Epic 1 - Core Navigation and Data Infrastructure
**Story Points:** 21 points
**Dependencies:** None (foundational epic)

---

## 1. Epic Overview

### 1.1 Business Goal
Establish foundational architecture enabling hierarchical navigation through OpenSciEd curriculum with structured data backend. This epic delivers immediate value by enabling basic lesson access and validates the core value proposition.

### 1.2 Technical Goal
Build the complete data infrastructure, routing system, and navigation components that serve as the foundation for all subsequent epics. Implement Next.js 15 App Router with Static Site Generation (SSG) for zero-backend MVP.

### 1.3 Success Criteria
- Users can navigate through 3-level hierarchy (Discipline → Unit → Lesson) in ≤3 clicks
- All pages load in <3 seconds on standard broadband
- Navigation between pages <500ms
- Complete curriculum data structure implemented and validated
- Static site builds successfully and deploys automatically

---

## 2. Architecture Foundation

### 2.1 Technology Stack (from Solution Architecture)
- **Framework:** Next.js 15.x with App Router
- **Language:** TypeScript 5.x (strict mode)
- **Runtime:** React 19.x
- **Package Manager:** pnpm 9.x
- **Hosting:** Vercel (free tier)
- **Data Format:** Static JSON files

### 2.2 Directory Structure for Epic 1

```
opensci-ed-repo/
├── app/                               # Next.js 15 App Router
│   ├── layout.tsx                    # Root layout (Story 1.3 - Navigation)
│   ├── page.tsx                      # Dashboard (Story 1.3)
│   ├── globals.css                   # Global styles (dark mode base)
│   ├── error.tsx                     # Error boundary (Story 1.2)
│   └── browse/
│       └── [discipline]/
│           ├── page.tsx              # Discipline view (Story 1.2)
│           └── [unit]/
│               ├── page.tsx          # Unit view (Story 1.2)
│               └── [lesson]/
│                   └── page.tsx      # Lesson detail (Story 1.5)
│
├── components/
│   ├── navigation/
│   │   ├── HamburgerMenu.tsx        # Story 1.3
│   │   ├── Breadcrumb.tsx           # Story 1.4
│   │   └── MobileNav.tsx            # Story 1.3
│   └── lesson/
│       └── LessonHeader.tsx         # Story 1.5
│
├── lib/
│   ├── types/
│   │   └── lesson.ts                # Story 1.1 - TypeScript interfaces
│   ├── data/
│   │   └── loader.ts                # Story 1.1 - JSON data loading
│   └── utils/
│       └── cn.ts                    # Utility functions
│
├── data/                            # Story 1.1 - Static JSON
│   ├── disciplines.json             # 3 disciplines
│   ├── units.json                   # ~45 units
│   └── lessons/
│       ├── lesson-6.1.1.json        # Individual lesson files
│       └── ...
│
├── next.config.js                   # Story 1.6 - SSG configuration
├── package.json                     # Story 1.6 - Dependencies
└── pnpm-lock.yaml
```

---

## 3. Story-by-Story Technical Specifications

### Story 1.1: Define JSON Data Schema and Structure

**Story Points:** 5 | **Priority:** P0 (Critical Path)

#### 3.1.1 TypeScript Type Definitions

Location: `lib/types/lesson.ts`

```typescript
// lib/types/lesson.ts

/**
 * Discipline represents one of the three main OpenSciEd science areas
 * (Life Science, Earth & Space Science, Physical Science)
 */
export interface Discipline {
  id: string                        // e.g., "life-science"
  name: string                      // e.g., "Life Science"
  slug: string                      // URL-friendly: "life-science"
  description: string               // Brief description for discipline page
  iconName: string                  // Icon identifier for UI
  color: string                     // Tailwind color class: "bg-green-600"
  unitCount: number                 // Total units in this discipline
}

/**
 * Unit represents a collection of related lessons within a discipline
 * (e.g., Unit 6.1: Genetics and Heredity)
 */
export interface Unit {
  id: string                        // e.g., "6.1"
  title: string                     // e.g., "Genetics and Heredity"
  disciplineSlug: string            // Parent discipline: "life-science"
  lessonCount: number               // Number of lessons in this unit
  estimatedDuration: string         // e.g., "3 weeks"
  description: string               // Unit overview
}

/**
 * LessonMaterial represents a single item needed for the lesson
 */
export interface LessonMaterial {
  quantity: string                  // "Per Group" | "Per Student" | "Per Class"
  description: string               // e.g., "250mL beaker"
  notes?: string                    // Optional notes (e.g., "reusable")
  audience?: 'teacher' | 'student' | 'both'  // Default: "both" - FR-12 support
}

/**
 * LessonPhase represents one phase of the 5E instructional model
 * (Engage, Explore, Explain, Elaborate, Evaluate)
 */
export interface LessonPhase {
  phase: 'Engage' | 'Explore' | 'Explain' | 'Elaborate' | 'Evaluate'
  duration: number                  // Duration in minutes
  description: string               // Brief activity description
  audience?: 'teacher' | 'student' | 'both'  // Default: "both" - FR-12 support
}

/**
 * TeachingGuidance represents teacher-specific instructional notes
 */
export interface TeachingGuidance {
  misconceptions: string[]          // Common student misconceptions
  keyQuestions: string[]            // Essential questions to ask
  differentiationNotes?: string     // Optional differentiation strategies
  audience?: 'teacher' | 'student' | 'both'  // Default: "teacher"
}

/**
 * Resource represents a supplementary file or link (PDF, PPT, etc.)
 */
export interface Resource {
  type: 'PDF' | 'PPT' | 'DOC' | 'URL'
  title: string                     // e.g., "Teacher Guide"
  url: string                       // Absolute or relative URL
  audience?: 'teacher' | 'student' | 'both'  // Default: "both" - FR-12 support
}

/**
 * Lesson represents a complete lesson with all instructional content
 */
export interface Lesson {
  id: string                        // e.g., "8.1.2"
  title: string                     // Lesson title
  disciplineId: string              // Parent discipline: "physical-science"
  disciplineSlug: string            // URL slug: "physical-science"
  unitId: string                    // Parent unit: "8.1"
  unitTitle: string                 // Unit name for breadcrumbs
  duration: string                  // e.g., "45 minutes"
  standards: string[]               // NGSS standards: ["MS-PS1-2"]
  objectives: string[]              // Learning objectives (WALTs)
  materials: LessonMaterial[]       // Required materials list
  sequence: LessonPhase[]           // 5E lesson phases
  teachingGuidance: TeachingGuidance
  resources: Resource[]             // Supplementary files
  audience?: 'teacher' | 'student' | 'both'  // Default: "both" - FR-12 support
}
```

#### 3.1.2 JSON Data Files Structure

**Disciplines File:** `data/disciplines.json`

```json
[
  {
    "id": "life-science",
    "name": "Life Science",
    "slug": "life-science",
    "description": "Study of living organisms, ecosystems, and biological processes",
    "iconName": "leaf",
    "color": "bg-green-600",
    "unitCount": 15
  },
  {
    "id": "earth-space",
    "name": "Earth & Space Science",
    "slug": "earth-space",
    "description": "Study of Earth systems, astronomy, and planetary science",
    "iconName": "globe",
    "color": "bg-blue-600",
    "unitCount": 15
  },
  {
    "id": "physical-science",
    "name": "Physical Science",
    "slug": "physical-science",
    "description": "Study of matter, energy, forces, and chemical reactions",
    "iconName": "atom",
    "color": "bg-purple-600",
    "unitCount": 15
  }
]
```

**Units File:** `data/units.json`

```json
[
  {
    "id": "6.1",
    "title": "Genetics and Heredity",
    "disciplineSlug": "life-science",
    "lessonCount": 12,
    "estimatedDuration": "3 weeks",
    "description": "How do organisms inherit traits from their parents?"
  },
  {
    "id": "8.1",
    "title": "Chemical Reactions and Matter",
    "disciplineSlug": "physical-science",
    "lessonCount": 10,
    "estimatedDuration": "2.5 weeks",
    "description": "What happens during chemical reactions?"
  }
]
```

**Individual Lesson File:** `data/lessons/lesson-8.1.2.json` (example)

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
    {
      "phase": "Engage",
      "duration": 10,
      "description": "Hook activity: Observe hand warmer chemical reaction",
      "audience": "both"
    },
    {
      "phase": "Explore",
      "duration": 15,
      "description": "Investigation: Measure temperature changes in reactions",
      "audience": "both"
    },
    {
      "phase": "Explain",
      "duration": 10,
      "description": "Class discussion: Energy transfer in reactions",
      "audience": "both"
    },
    {
      "phase": "Elaborate",
      "duration": 5,
      "description": "Apply learning to real-world examples",
      "audience": "both"
    },
    {
      "phase": "Evaluate",
      "duration": 5,
      "description": "Assessment: Exit ticket on energy transfer",
      "audience": "teacher"
    }
  ],
  "teachingGuidance": {
    "misconceptions": [
      "Students may think energy is used up in reactions",
      "Students may confuse temperature with heat"
    ],
    "keyQuestions": [
      "Where does the energy come from in this reaction?",
      "How do we know energy was transferred?"
    ],
    "differentiationNotes": "Provide molecular model manipulatives for visual learners",
    "audience": "teacher"
  },
  "resources": [
    {
      "type": "PDF",
      "title": "Teacher Guide",
      "url": "/resources/8.1.2-teacher-guide.pdf",
      "audience": "teacher"
    },
    {
      "type": "PPT",
      "title": "Lesson Slides",
      "url": "/resources/8.1.2-slides.pptx",
      "audience": "both"
    }
  ],
  "audience": "both"
}
```

#### 3.1.3 Data Loader Utilities

Location: `lib/data/loader.ts`

```typescript
// lib/data/loader.ts
import type { Discipline, Unit, Lesson } from '@/lib/types/lesson'
import disciplines from '@/data/disciplines.json'
import units from '@/data/units.json'

/**
 * Get all disciplines (cached at build time)
 */
export function getAllDisciplines(): Discipline[] {
  return disciplines as Discipline[]
}

/**
 * Get a single discipline by slug
 */
export function getDisciplineBySlug(slug: string): Discipline | undefined {
  return disciplines.find(d => d.slug === slug) as Discipline | undefined
}

/**
 * Get all units for a specific discipline
 */
export function getUnitsByDiscipline(disciplineSlug: string): Unit[] {
  return (units as Unit[]).filter(u => u.disciplineSlug === disciplineSlug)
}

/**
 * Get a single unit by ID
 */
export function getUnitById(unitId: string): Unit | undefined {
  return (units as Unit[]).find(u => u.id === unitId)
}

/**
 * Get a lesson by ID (dynamic import for code splitting)
 */
export async function getLesson(lessonId: string): Promise<Lesson> {
  try {
    const lesson = await import(`@/data/lessons/lesson-${lessonId}.json`)
    return lesson.default as Lesson
  } catch (error) {
    throw new Error(`Lesson ${lessonId} not found`)
  }
}

/**
 * Get all lesson IDs for a specific unit (for build-time static generation)
 */
export function getLessonIdsByUnit(unitId: string): string[] {
  // This would be generated from file system at build time
  // For now, hardcoded for initial units
  const lessonMap: Record<string, string[]> = {
    '8.1': ['8.1.1', '8.1.2', '8.1.3', '8.1.4', '8.1.5'],
    '6.1': ['6.1.1', '6.1.2', '6.1.3']
  }
  return lessonMap[unitId] || []
}

/**
 * Get all lessons for static param generation (for SSG)
 */
export function getAllLessons(): Array<{
  discipline: string
  unit: string
  lesson: string
}> {
  const allLessons: Array<{ discipline: string; unit: string; lesson: string }> = []

  for (const unit of units as Unit[]) {
    const lessonIds = getLessonIdsByUnit(unit.id)
    for (const lessonId of lessonIds) {
      allLessons.push({
        discipline: unit.disciplineSlug,
        unit: unit.id,
        lesson: lessonId
      })
    }
  }

  return allLessons
}
```

#### 3.1.4 Validation Script

Location: `scripts/validate-data.ts`

```typescript
// scripts/validate-data.ts
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const DisciplineSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  iconName: z.string(),
  color: z.string(),
  unitCount: z.number()
})

const UnitSchema = z.object({
  id: z.string(),
  title: z.string(),
  disciplineSlug: z.string(),
  lessonCount: z.number(),
  estimatedDuration: z.string(),
  description: z.string()
})

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  disciplineId: z.string(),
  disciplineSlug: z.string(),
  unitId: z.string(),
  unitTitle: z.string(),
  duration: z.string(),
  standards: z.array(z.string()),
  objectives: z.array(z.string()),
  materials: z.array(z.object({
    quantity: z.string(),
    description: z.string(),
    notes: z.string().optional(),
    audience: z.enum(['teacher', 'student', 'both']).optional()
  })),
  sequence: z.array(z.object({
    phase: z.enum(['Engage', 'Explore', 'Explain', 'Elaborate', 'Evaluate']),
    duration: z.number(),
    description: z.string(),
    audience: z.enum(['teacher', 'student', 'both']).optional()
  })),
  teachingGuidance: z.object({
    misconceptions: z.array(z.string()),
    keyQuestions: z.array(z.string()),
    differentiationNotes: z.string().optional(),
    audience: z.enum(['teacher', 'student', 'both']).optional()
  }),
  resources: z.array(z.object({
    type: z.enum(['PDF', 'PPT', 'DOC', 'URL']),
    title: z.string(),
    url: z.string(),
    audience: z.enum(['teacher', 'student', 'both']).optional()
  })),
  audience: z.enum(['teacher', 'student', 'both']).optional()
})

function validateDataFiles() {
  console.log('Validating data files...')

  // Validate disciplines
  const disciplines = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/disciplines.json'), 'utf-8')
  )
  z.array(DisciplineSchema).parse(disciplines)
  console.log(`✅ Disciplines validated (${disciplines.length} disciplines)`)

  // Validate units
  const units = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/units.json'), 'utf-8')
  )
  z.array(UnitSchema).parse(units)
  console.log(`✅ Units validated (${units.length} units)`)

  // Validate lessons
  const lessonsDir = path.join(process.cwd(), 'data/lessons')
  const lessonFiles = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'))

  for (const file of lessonFiles) {
    const lesson = JSON.parse(
      fs.readFileSync(path.join(lessonsDir, file), 'utf-8')
    )
    LessonSchema.parse(lesson)
  }
  console.log(`✅ Lessons validated (${lessonFiles.length} lessons)`)

  console.log('\n✅ All data files validated successfully!')
}

validateDataFiles()
```

#### 3.1.5 Acceptance Criteria Checklist
- [ ] TypeScript interfaces defined for Discipline, Unit, Lesson
- [ ] disciplines.json created with 3 disciplines
- [ ] units.json created with 3-5 units across disciplines
- [ ] 3-5 lesson JSON files created following schema
- [ ] Audience tagging added to all relevant types (FR-12 support)
- [ ] Data loader utilities implemented and tested
- [ ] Validation script passes for all data files
- [ ] Schema documented in tech-spec-epic-1.md

---

### Story 1.2: Implement Client-Side Routing and URL Structure

**Story Points:** 3 | **Priority:** P0 (Critical Path) | **Depends On:** Story 1.1

#### 3.2.1 Next.js App Router Structure

```
app/
├── layout.tsx                           # Root layout
├── page.tsx                            # Home/Dashboard (/)
├── error.tsx                           # Global error boundary
├── not-found.tsx                       # 404 page
└── browse/
    └── [discipline]/
        ├── page.tsx                    # /browse/physical-science
        ├── loading.tsx                 # Loading UI
        ├── error.tsx                   # Discipline-level errors
        └── [unit]/
            ├── page.tsx                # /browse/physical-science/8.1
            ├── loading.tsx             # Loading UI
            └── [lesson]/
                ├── page.tsx            # /browse/physical-science/8.1/8.1.2
                └── loading.tsx         # Loading UI
```

#### 3.2.2 Route Implementations

**Root Layout:** `app/layout.tsx`

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenSciEd Lesson Repository',
  description: 'Structured access to OpenSciEd middle school science curriculum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

**Dashboard Page:** `app/page.tsx`

```typescript
// app/page.tsx
import Link from 'next/link'
import { getAllDisciplines } from '@/lib/data/loader'

export default function Home() {
  const disciplines = getAllDisciplines()

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">OpenSciEd Lesson Repository</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Browse by Discipline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.id}
                href={`/browse/${discipline.slug}`}
                className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{discipline.name}</h3>
                <p className="text-gray-400 mb-4">{discipline.description}</p>
                <p className="text-sm text-gray-500">{discipline.unitCount} units</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
```

**Discipline Page:** `app/browse/[discipline]/page.tsx`

```typescript
// app/browse/[discipline]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDisciplineBySlug, getUnitsByDiscipline } from '@/lib/data/loader'

export async function generateStaticParams() {
  return [
    { discipline: 'life-science' },
    { discipline: 'earth-space' },
    { discipline: 'physical-science' },
  ]
}

export default function DisciplinePage({
  params,
}: {
  params: { discipline: string }
}) {
  const discipline = getDisciplineBySlug(params.discipline)
  if (!discipline) notFound()

  const units = getUnitsByDiscipline(discipline.slug)

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">{discipline.name}</h1>
        <p className="text-gray-400 mb-8">{discipline.description}</p>

        <h2 className="text-2xl font-semibold mb-4">Units</h2>
        <div className="space-y-4">
          {units.map((unit) => (
            <Link
              key={unit.id}
              href={`/browse/${params.discipline}/${unit.id}`}
              className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Unit {unit.id}: {unit.title}</h3>
              <p className="text-gray-400 mb-2">{unit.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{unit.lessonCount} lessons</span>
                <span>Duration: {unit.estimatedDuration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
```

**Unit Page:** `app/browse/[discipline]/[unit]/page.tsx`

```typescript
// app/browse/[discipline]/[unit]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUnitById, getLessonIdsByUnit } from '@/lib/data/loader'

export default function UnitPage({
  params,
}: {
  params: { discipline: string; unit: string }
}) {
  const unit = getUnitById(params.unit)
  if (!unit) notFound()

  const lessonIds = getLessonIdsByUnit(params.unit)

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href={`/browse/${params.discipline}`}
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Discipline
        </Link>

        <h1 className="text-4xl font-bold mb-4">Unit {unit.id}: {unit.title}</h1>
        <p className="text-gray-400 mb-8">{unit.description}</p>

        <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessonIds.map((lessonId) => (
            <Link
              key={lessonId}
              href={`/browse/${params.discipline}/${params.unit}/${lessonId}`}
              className="block p-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold">Lesson {lessonId}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
```

**Lesson Page (Initial):** `app/browse/[discipline]/[unit]/[lesson]/page.tsx`

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLesson, getAllLessons } from '@/lib/data/loader'

export async function generateStaticParams() {
  return getAllLessons()
}

export default async function LessonPage({
  params,
}: {
  params: { discipline: string; unit: string; lesson: string }
}) {
  const lesson = await getLesson(params.lesson)
  if (!lesson) notFound()

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href={`/browse/${params.discipline}/${params.unit}`}
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Unit
        </Link>

        <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
        <p className="text-gray-400 mb-2">Lesson {lesson.id}</p>
        <p className="text-gray-500">Duration: {lesson.duration}</p>

        {/* Full lesson content will be implemented in Story 1.5 */}
        <div className="mt-8 p-4 bg-gray-800 rounded">
          <p className="text-gray-400">Lesson content coming in Story 1.5...</p>
        </div>
      </div>
    </main>
  )
}
```

#### 3.2.3 Error Handling

**404 Page:** `app/not-found.tsx`

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The lesson or page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
```

**Global Error Boundary:** `app/error.tsx`

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">
          An error occurred while loading the page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

#### 3.2.4 Acceptance Criteria Checklist
- [ ] URL structure `/browse/[discipline]/[unit]/[lesson]` implemented
- [ ] generateStaticParams() generates all routes at build time
- [ ] Browser back/forward buttons work correctly
- [ ] Invalid URLs show 404 page with helpful message
- [ ] Error boundaries catch routing errors gracefully
- [ ] All pages render with dark mode styles
- [ ] Navigation breadcrumbs visible on all pages

---

### Story 1.3: Create Three-Level Navigation Component

**Story Points:** 5 | **Priority:** P0 (Critical Path) | **Depends On:** Story 1.2

#### 3.3.1 Navigation Component Structure

Location: `components/navigation/`

**Main Navigation:** `components/navigation/Navigation.tsx`

```typescript
// components/navigation/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAllDisciplines } from '@/lib/data/loader'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const disciplines = getAllDisciplines()

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home Link */}
          <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
            OpenSciEd
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.id}
                href={`/browse/${discipline.slug}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith(`/browse/${discipline.slug}`)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {discipline.name}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.id}
                href={`/browse/${discipline.slug}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname.startsWith(`/browse/${discipline.slug}`)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {discipline.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
```

#### 3.3.2 Update Root Layout

```typescript
// app/layout.tsx (updated)
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/navigation/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenSciEd Lesson Repository',
  description: 'Structured access to OpenSciEd middle school science curriculum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
```

#### 3.3.3 Acceptance Criteria Checklist
- [ ] Navigation component displays on all pages
- [ ] Discipline selector shows all three disciplines
- [ ] Current discipline highlighted in navigation
- [ ] Mobile hamburger menu works on small screens
- [ ] Navigation keyboard accessible (Tab, Enter, Esc)
- [ ] Touch targets ≥44x44px on mobile
- [ ] ARIA labels present for accessibility

---

### Story 1.4: Implement Breadcrumb Trail Component

**Story Points:** 2 | **Priority:** P1 | **Depends On:** Story 1.3

#### 3.4.1 Breadcrumb Component

Location: `components/navigation/Breadcrumb.tsx`

```typescript
// components/navigation/Breadcrumb.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbSegment {
  label: string
  href: string
}

export default function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumb on home page
  if (pathname === '/') return null

  const segments: BreadcrumbSegment[] = []

  // Parse pathname to build breadcrumb trail
  const parts = pathname.split('/').filter(Boolean)

  if (parts[0] === 'browse') {
    if (parts[1]) {
      // Discipline
      const disciplineName = parts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      segments.push({
        label: disciplineName,
        href: `/browse/${parts[1]}`
      })
    }

    if (parts[2]) {
      // Unit
      segments.push({
        label: `Unit ${parts[2]}`,
        href: `/browse/${parts[1]}/${parts[2]}`
      })
    }

    if (parts[3]) {
      // Lesson
      segments.push({
        label: `Lesson ${parts[3]}`,
        href: `/browse/${parts[1]}/${parts[2]}/${parts[3]}`
      })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <ol className="flex items-center space-x-2 text-sm max-w-7xl mx-auto">
        <li>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <li key={segment.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-600" />
              {isLast ? (
                <span className="text-white font-medium" aria-current="page">
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {segment.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

#### 3.4.2 Update Root Layout to Include Breadcrumb

```typescript
// app/layout.tsx (updated to include breadcrumb)
import Breadcrumb from '@/components/navigation/Breadcrumb'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <Breadcrumb />
        {children}
      </body>
    </html>
  )
}
```

#### 3.4.3 Acceptance Criteria Checklist
- [ ] Breadcrumb displays on all pages except home
- [ ] Format: Home > Discipline > Unit > Lesson
- [ ] Each segment clickable except current page
- [ ] Current page visually distinct (not clickable)
- [ ] Breadcrumb updates immediately on navigation
- [ ] Semantic HTML with aria-label="Breadcrumb"
- [ ] Mobile-responsive: truncates gracefully

---

### Story 1.5: Create Lesson Detail Page Component

**Story Points:** 5 | **Priority:** P0 (Critical Path) | **Depends On:** Story 1.1, 1.2

*Note: Full implementation details will be in tech-spec-epic-2.md*

Basic structure for Epic 1:

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx (expanded)
import { getLesson } from '@/lib/data/loader'

export default async function LessonPage({ params }: { params: { lesson: string } }) {
  const lesson = await getLesson(params.lesson)

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
          <div className="text-gray-400 space-x-4">
            <span>Lesson {lesson.id}</span>
            <span>•</span>
            <span>{lesson.duration}</span>
          </div>
        </header>

        {/* Lesson sections will be fully implemented in Epic 2 */}
        <div className="space-y-6">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
            <ul className="list-disc list-inside space-y-2">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="text-gray-300">{obj}</li>
              ))}
            </ul>
          </section>

          {/* Additional sections in Epic 2 */}
        </div>
      </div>
    </main>
  )
}
```

#### 3.5.1 Acceptance Criteria Checklist
- [ ] Lesson title and metadata displayed prominently
- [ ] Learning objectives section visible
- [ ] Basic dark mode styling applied
- [ ] Page loads in <500ms after navigation
- [ ] Responsive layout (single column MVP)

---

### Story 1.6: Implement Static Site Build and Deployment

**Story Points:** 3 | **Priority:** P0 | **Depends On:** Stories 1.1-1.5

#### 3.6.1 Next.js Configuration

**next.config.js:**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for SSG
  images: {
    unoptimized: true // Required for static export
  },
  // Strict mode for better error detection
  reactStrictMode: true,
  // Faster builds in development
  swcMinify: true,
}

module.exports = nextConfig
```

#### 3.6.2 Package.json Scripts

```json
{
  "name": "opensci-ed-repo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "validate-data": "tsx scripts/validate-data.ts",
    "prebuild": "pnpm validate-data"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "zod": "^3.22.4",
    "tsx": "^4.7.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

#### 3.6.3 Vercel Deployment

**vercel.json:**

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "out"
}
```

**GitHub Actions CI/CD:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Validate data files
        run: pnpm validate-data

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
```

#### 3.6.4 Acceptance Criteria Checklist
- [ ] `next build` completes successfully
- [ ] Build generates static HTML for all routes
- [ ] Build time <5 minutes
- [ ] Vercel deployment configured
- [ ] HTTPS enabled automatically
- [ ] Deploy triggers on push to main
- [ ] Build errors prevent deployment
- [ ] GitHub Actions CI passes

---

### Story 1.7: Data Loading and Caching Strategy

**Story Points:** 3 | **Priority:** P1 | **Depends On:** Story 1.6

#### 3.7.1 Performance Optimizations

**Prefetching Links:**

```typescript
// All Link components use prefetch by default in Next.js 15
<Link href="/browse/physical-science" prefetch={true}>
  Physical Science
</Link>
```

**React Memoization:**

```typescript
// components/navigation/Navigation.tsx (optimized)
import { memo } from 'react'

const Navigation = memo(function Navigation() {
  // Component implementation
})

export default Navigation
```

**Loading States:**

```typescript
// app/browse/[discipline]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">
        Loading discipline...
      </div>
    </div>
  )
}
```

#### 3.7.2 Performance Targets
- Initial page load: <3s
- Navigation between pages: <500ms
- Lighthouse performance score: >90
- No unnecessary data refetching
- Browser caching enabled

#### 3.7.3 Acceptance Criteria Checklist
- [ ] Initial load <3s on standard broadband
- [ ] Navigation <500ms between pages
- [ ] JSON data efficiently cached
- [ ] Loading states for >300ms operations
- [ ] Lighthouse performance >90
- [ ] No unnecessary re-renders

---

## 4. Testing Strategy

### 4.1 Manual Testing Checklist

**Navigation Flow Testing:**
- [ ] Home → Discipline → Unit → Lesson (3 clicks)
- [ ] Browser back button returns to previous page
- [ ] Browser forward button navigates forward
- [ ] Bookmark lesson URL and return works
- [ ] Direct URL entry works for all routes
- [ ] Invalid URLs show 404 page

**Data Integrity Testing:**
- [ ] All 3 disciplines load correctly
- [ ] All units display under correct discipline
- [ ] All lessons load with complete data
- [ ] Validation script passes for all data files
- [ ] No broken internal links

**Performance Testing:**
- [ ] Run Lighthouse audit (target: >90 performance)
- [ ] Test on 3G network simulation
- [ ] Verify load times in DevTools Network tab
- [ ] Check bundle sizes (JS <200KB gzipped)

### 4.2 Browser Compatibility

Test on:
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

### 4.3 Responsive Testing

Test breakpoints:
- [ ] Desktop: ≥1024px
- [ ] Tablet: 768px - 1023px
- [ ] Mobile: <768px (basic functionality)

---

## 5. Deployment Checklist

### 5.1 Pre-Deployment
- [ ] All 7 stories completed and accepted
- [ ] Data validation passes
- [ ] Type checking passes
- [ ] Lint checks pass
- [ ] Build succeeds locally
- [ ] Manual testing completed
- [ ] Performance targets met

### 5.2 Deployment Steps
1. [ ] Merge feature branch to main
2. [ ] GitHub Actions CI passes
3. [ ] Vercel deployment triggers automatically
4. [ ] Verify production build
5. [ ] Test production URL
6. [ ] Verify HTTPS working
7. [ ] Check Vercel Analytics (if configured)

### 5.3 Post-Deployment
- [ ] Smoke test all routes in production
- [ ] Verify performance metrics
- [ ] Check error tracking (console logs)
- [ ] Document any issues found
- [ ] Notify stakeholder (Frank)

---

## 6. Dependencies and Prerequisites

### 6.1 External Dependencies
- Node.js 20.x LTS
- pnpm 9.x
- Git
- Vercel account (free tier)
- GitHub repository

### 6.2 Required Knowledge
- Next.js 15 App Router
- TypeScript
- React 19
- Tailwind CSS
- Git/GitHub workflow

### 6.3 Design Assets Needed
- Discipline icons (3 icons: life, earth-space, physical)
- Logo/branding (optional for MVP)
- Favicon

---

## 7. Known Limitations and Future Considerations

### 7.1 MVP Limitations
- No user authentication (Phase 2)
- No search functionality (Phase 2)
- No lesson tracking (Phase 2)
- Desktop/tablet only (mobile polish in Phase 3)
- Static data only (no CMS for MVP)

### 7.2 Technical Debt Considerations
- Hardcoded lesson IDs in `getLessonIdsByUnit()` (should scan filesystem)
- No automated E2E tests (add in Epic 3)
- No error tracking service (add in Phase 2)
- Limited loading states (enhance in Epic 3)

### 7.3 Phase 2 Preparation
- Data schema includes `audience` field (FR-12 readiness)
- Route structure supports future authentication
- Component props designed for view modes
- State management abstraction planned (Epic 4)

---

## 8. Success Metrics

### 8.1 Technical Metrics
- Build time: <5 minutes ✅
- Page load: <3 seconds ✅
- Navigation: <500ms ✅
- Lighthouse: >90 performance ✅
- Zero console errors in production ✅

### 8.2 User Experience Metrics
- Navigation to any lesson: ≤3 clicks ✅
- Breadcrumb clarity: User always knows location ✅
- URL bookmarkability: All lessons directly accessible ✅

---

**Epic 1 Status:** Ready for Implementation
**Estimated Duration:** 2-3 weeks
**Next Epic:** Epic 2 - Lesson Content Display and Resource Access
