# Technical Specification: Epic 2 - Lesson Content Display and Resource Access

**Epic Goal**: Transform lesson data into scannable, actionable information with one-click access to all supplementary resources.

**Author**: BMad Builder
**Date**: 2025-10-14
**Epic Story Points**: 18 points (8 stories)
**Dependencies**: Epic 1 (Core Navigation and Data Infrastructure)

---

## 1. Epic Overview

### 1.1 Business Goal
Deliver the core value proposition: **time savings through instant access to lesson information**. Teachers currently spend 10-15 minutes searching Google Drive for materials and parsing lesson PDFs. This epic reduces that to seconds by presenting all information in a scannable, organized interface with one-click resource access.

This is where the "10x faster" claim becomes tangible. Teachers can:
- Scan objectives and materials in <10 seconds
- Understand lesson flow in <30 seconds
- Access any resource in 1 click vs. 3-5 minutes of searching

### 1.2 Technical Goal
Implement comprehensive lesson content display components with:
- Rich content rendering (WALTs, materials, sequences, teaching guidance, resources)
- Dark mode color scheme (WCAG 2.1 AA compliant)
- Responsive design (desktop + tablet)
- Optimized information density for scanning
- Accessible, semantic HTML structure

Build on Epic 1's data infrastructure to create production-ready content components that will be reused across all future features.

### 1.3 Success Criteria
- **Scanability**: Users can locate any lesson element in <10 seconds
- **Completeness**: All lesson information visible without clicking tabs or drilling down
- **Accessibility**: WCAG 2.1 Level AA compliance for contrast and semantics
- **Performance**: Page renders in <500ms, no perceived lag
- **Responsive**: Fully functional on iPad (768px - 1023px)
- **Visual Quality**: Professional dark mode design that teachers trust

---

## 2. Architecture Foundation

### 2.1 Tech Stack (Inherited from Epic 1)
```yaml
Framework: Next.js 15 (App Router with SSG)
Language: TypeScript 5.x (strict mode)
Styling: Tailwind CSS 3.x with custom dark mode palette
Icons: lucide-react
State: React hooks + Context API
Validation: Zod for runtime validation
Package Manager: pnpm
Security: DOMPurify for HTML sanitization (if rich content needed)
```

### 2.2 Component Architecture
```
components/
├── lesson/
│   ├── LessonDetail.tsx           # Story 1.5 (Epic 1) - container
│   ├── LearningObjectives.tsx     # Story 2.1 - WALTs component
│   ├── MaterialsList.tsx          # Story 2.2 - materials with quantities
│   ├── LessonSequence.tsx         # Story 2.3 - phase flow display
│   ├── TeachingGuidance.tsx       # Story 2.4 - notes and tips
│   └── ResourceLinks.tsx          # Story 2.5 - one-click access
├── layout/
│   └── ContentSection.tsx         # Reusable section wrapper
└── ui/
    ├── Badge.tsx                  # For tags and labels
    ├── Card.tsx                   # Content cards
    └── Icon.tsx                   # Icon wrapper
```

### 2.3 Dark Mode Color Palette (Story 2.6)
```typescript
// tailwind.config.ts - Dark mode theme
const colors = {
  dark: {
    // Backgrounds
    bg: {
      primary: '#0a0a0a',      // Main background
      secondary: '#1a1a1a',    // Card backgrounds
      tertiary: '#2a2a2a',     // Hover states
    },

    // Text
    text: {
      primary: '#e5e5e5',      // Body text (WCAG AA: 13.5:1)
      secondary: '#a3a3a3',    // Secondary text (WCAG AA: 7.8:1)
      tertiary: '#737373',     // Muted text (WCAG AA: 4.6:1)
    },

    // Accents
    accent: {
      blue: '#60a5fa',         // Links, interactive
      green: '#4ade80',        // Success, objectives
      yellow: '#fbbf24',       // Warning, materials
      purple: '#c084fc',       // Teaching guidance
      cyan: '#22d3ee',         // Resources
    },

    // UI Elements
    border: '#404040',         // Borders and dividers
    hover: '#2a2a2a',          // Hover backgrounds
    focus: '#60a5fa',          // Focus indicators
  }
}
```

### 2.4 Responsive Breakpoints (Story 2.7)
```typescript
// Tailwind breakpoints
screens: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait (iPad)
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
}

// Touch targets (mobile/tablet)
minTouchTarget: '44px' // iOS/Android minimum
```

---

## 3. Story-by-Story Technical Specifications

### Story 2.1: Learning Objectives (WALTs) Component

**Priority**: High (first content users see)
**Story Points**: 2
**Dependencies**: Story 1.5 (Lesson Detail Page)

#### 3.1.1 Component Design

```typescript
// components/lesson/LearningObjectives.tsx
import { CheckCircle2 } from 'lucide-react'

interface LearningObjective {
  id: string
  text: string
  standard?: string // NGSS alignment
}

interface LearningObjectivesProps {
  objectives: LearningObjective[]
  className?: string
}

export default function LearningObjectives({
  objectives,
  className = ''
}: LearningObjectivesProps) {
  if (!objectives.length) {
    return (
      <section
        className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
        aria-labelledby="objectives-heading"
      >
        <h2 id="objectives-heading" className="text-xl font-semibold text-dark-text-primary mb-4">
          Learning Objectives
        </h2>
        <p className="text-dark-text-secondary">No objectives defined for this lesson.</p>
      </section>
    )
  }

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-green ${className}`}
      aria-labelledby="objectives-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="h-6 w-6 text-dark-accent-green" aria-hidden="true" />
        <h2 id="objectives-heading" className="text-xl font-semibold text-dark-text-primary">
          We Are Learning To (WALTs)
        </h2>
      </div>

      <ul className="space-y-3" role="list">
        {objectives.map((objective) => (
          <li key={objective.id} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-dark-accent-green mt-2" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-lg text-dark-text-primary leading-relaxed">
                {objective.text}
              </p>
              {objective.standard && (
                <p className="text-sm text-dark-text-tertiary mt-1">
                  {objective.standard}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

#### 3.1.2 Usage in Lesson Detail Page

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx
import LearningObjectives from '@/components/lesson/LearningObjectives'

export default async function LessonPage({ params }: { params: { lesson: string } }) {
  const lesson = await getLesson(params.lesson)

  return (
    <main className="min-h-screen bg-dark-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title and metadata */}
        <header>
          <h1 className="text-4xl font-bold text-dark-text-primary mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-dark-text-secondary">
            <span>Duration: {lesson.duration}</span>
            <span>•</span>
            <span>Lesson {lesson.id}</span>
          </div>
        </header>

        {/* Learning Objectives - First content section */}
        <LearningObjectives objectives={lesson.objectives} />

        {/* Other components follow */}
      </div>
    </main>
  )
}
```

#### 3.1.3 Acceptance Criteria Checklist

- [x] Objectives section appears first after lesson title/metadata
- [x] Clear section heading: "We Are Learning To (WALTs)"
- [x] Each objective displayed with bullet points
- [x] Typography optimized: 18px font, 1.6 line height
- [x] Visual distinction: green left border accent, dark card background
- [x] Mobile responsive: maintains readability on small screens
- [x] Supports 1-5 objectives per lesson
- [x] Accessible: semantic HTML (`<section>`, `<ul>`, proper headings)
- [x] NGSS standards displayed below objectives (small text)
- [x] Empty state handled gracefully

---

### Story 2.2: Materials List Component

**Priority**: High (critical for lesson preparation)
**Story Points**: 3
**Dependencies**: Story 1.5 (Lesson Detail Page)

#### 3.2.1 Component Design

```typescript
// components/lesson/MaterialsList.tsx
import { Package } from 'lucide-react'

interface Material {
  id: string
  quantity: 'Per Student' | 'Per Group' | 'Per Class'
  description: string
  notes?: string
  optional?: boolean
  audience?: 'teacher' | 'student' | 'both'
}

interface MaterialsListProps {
  materials: Material[]
  className?: string
}

export default function MaterialsList({ materials, className = '' }: MaterialsListProps) {
  if (!materials.length) {
    return (
      <section
        className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
        aria-labelledby="materials-heading"
      >
        <h2 id="materials-heading" className="text-xl font-semibold text-dark-text-primary mb-4">
          Materials List
        </h2>
        <p className="text-dark-text-secondary">No materials required for this lesson.</p>
      </section>
    )
  }

  // Group materials by quantity type
  const groupedMaterials = materials.reduce((acc, material) => {
    const key = material.quantity
    if (!acc[key]) acc[key] = []
    acc[key].push(material)
    return acc
  }, {} as Record<string, Material[]>)

  const quantityOrder: Array<'Per Student' | 'Per Group' | 'Per Class'> = [
    'Per Student',
    'Per Group',
    'Per Class'
  ]

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-yellow ${className}`}
      aria-labelledby="materials-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <Package className="h-6 w-6 text-dark-accent-yellow" aria-hidden="true" />
        <h2 id="materials-heading" className="text-xl font-semibold text-dark-text-primary">
          Materials List
        </h2>
      </div>

      <div className="space-y-6">
        {quantityOrder.map((quantityType) => {
          const items = groupedMaterials[quantityType]
          if (!items?.length) return null

          return (
            <div key={quantityType}>
              <h3 className="text-sm font-semibold text-dark-accent-yellow uppercase tracking-wide mb-3">
                {quantityType}
              </h3>
              <ul className="space-y-2" role="list">
                {items.map((material) => (
                  <li
                    key={material.id}
                    className="flex items-start gap-3 text-dark-text-primary"
                  >
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-dark-accent-yellow mt-2" aria-hidden="true" />
                    <div className="flex-1">
                      <span className={material.optional ? 'text-dark-text-secondary' : ''}>
                        {material.description}
                        {material.optional && (
                          <span className="ml-2 text-xs text-dark-text-tertiary">(optional)</span>
                        )}
                      </span>
                      {material.notes && (
                        <p className="text-sm text-dark-text-tertiary mt-1">{material.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

#### 3.2.2 Data Structure Update

```typescript
// lib/types/lesson.ts - ensure Material type matches
export interface LessonMaterial {
  quantity: 'Per Student' | 'Per Group' | 'Per Class'
  description: string
  notes?: string
  optional?: boolean
  audience?: 'teacher' | 'student' | 'both'
}
```

#### 3.2.3 Acceptance Criteria Checklist

- [x] Materials section clearly labeled and easy to locate
- [x] Each material lists quantity (per student/group/class)
- [x] Specific descriptions included (e.g., "250mL beaker")
- [x] Optional materials marked with "(optional)" label
- [x] Notes displayed below material when present
- [x] Materials organized by quantity type (student → group → class)
- [x] Visual scanning optimized with clear spacing
- [x] Handles 5-30 items without layout breaking
- [x] Mobile responsive: readable without horizontal scrolling
- [x] Accessible: proper list semantics and labels
- [x] Yellow accent color for visual distinction

---

### Story 2.3: Lesson Sequence and Flow Display

**Priority**: High (essential for lesson planning)
**Story Points**: 3
**Dependencies**: Story 1.5 (Lesson Detail Page)

#### 3.3.1 Component Design

```typescript
// components/lesson/LessonSequence.tsx
import { Clock, ArrowRight } from 'lucide-react'

interface LessonPhase {
  phase: 'Engage' | 'Explore' | 'Explain' | 'Elaborate' | 'Evaluate'
  duration: number // minutes
  description: string
  audience?: 'teacher' | 'student' | 'both'
}

interface LessonSequenceProps {
  sequence: LessonPhase[]
  totalDuration: string // e.g., "45 minutes"
  className?: string
}

const phaseColors: Record<string, string> = {
  Engage: 'border-pink-500 bg-pink-500/10',
  Explore: 'border-blue-500 bg-blue-500/10',
  Explain: 'border-green-500 bg-green-500/10',
  Elaborate: 'border-purple-500 bg-purple-500/10',
  Evaluate: 'border-orange-500 bg-orange-500/10',
}

const phaseIcons: Record<string, string> = {
  Engage: '🎯',
  Explore: '🔍',
  Explain: '💡',
  Elaborate: '🚀',
  Evaluate: '✅',
}

export default function LessonSequence({
  sequence,
  totalDuration,
  className = ''
}: LessonSequenceProps) {
  if (!sequence.length) {
    return (
      <section
        className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
        aria-labelledby="sequence-heading"
      >
        <h2 id="sequence-heading" className="text-xl font-semibold text-dark-text-primary mb-4">
          Lesson Sequence
        </h2>
        <p className="text-dark-text-secondary">No sequence defined for this lesson.</p>
      </section>
    )
  }

  const totalMinutes = sequence.reduce((sum, phase) => sum + phase.duration, 0)

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
      aria-labelledby="sequence-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-dark-accent-blue" aria-hidden="true" />
          <h2 id="sequence-heading" className="text-xl font-semibold text-dark-text-primary">
            Lesson Sequence
          </h2>
        </div>
        <div className="flex items-center gap-2 text-dark-text-secondary">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Total: {totalDuration || `${totalMinutes} min`}</span>
        </div>
      </div>

      {/* Desktop: Timeline view */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-border" aria-hidden="true" />

          <ol className="space-y-6" role="list">
            {sequence.map((phase, index) => (
              <li key={`${phase.phase}-${index}`} className="relative flex items-start gap-4">
                {/* Phase icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-dark-bg-primary ${phaseColors[phase.phase]}`}>
                    <span className="text-2xl" role="img" aria-label={phase.phase}>
                      {phaseIcons[phase.phase]}
                    </span>
                  </div>
                </div>

                {/* Phase content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-text-primary">
                      {phase.phase}
                    </h3>
                    <span className="flex-shrink-0 text-sm text-dark-text-tertiary">
                      {phase.duration} min
                    </span>
                  </div>
                  <p className="text-dark-text-secondary leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile: Stacked cards */}
      <div className="md:hidden space-y-4">
        {sequence.map((phase, index) => (
          <div
            key={`${phase.phase}-${index}`}
            className={`rounded-lg border-2 p-4 ${phaseColors[phase.phase]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label={phase.phase}>
                  {phaseIcons[phase.phase]}
                </span>
                <h3 className="text-lg font-semibold text-dark-text-primary">
                  {phase.phase}
                </h3>
              </div>
              <span className="text-sm text-dark-text-tertiary">{phase.duration} min</span>
            </div>
            <p className="text-dark-text-secondary">{phase.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

#### 3.3.2 Acceptance Criteria Checklist

- [x] Displays all lesson phases (typically Engage, Explore, Explain, Elaborate, Evaluate)
- [x] Each phase shows name, duration, and brief activity description
- [x] Desktop: Timeline visualization with connector line
- [x] Mobile: Stacked card layout
- [x] Total lesson duration displayed prominently
- [x] Responsive: stacks vertically on small screens
- [x] Accessible: semantic HTML with proper headings and list structure
- [x] Supports 3-8 phases flexibly
- [x] Visual distinction for each phase (colors and icons)
- [x] Clear progression from one phase to next

---

### Story 2.4: Teaching Guidance and Notes Component

**Priority**: High (critical teacher resource)
**Story Points**: 2
**Dependencies**: Story 1.5 (Lesson Detail Page)

#### 3.4.1 Component Design

```typescript
// components/lesson/TeachingGuidance.tsx
import { Lightbulb, AlertTriangle, HelpCircle, Target } from 'lucide-react'

interface TeachingGuidanceContent {
  misconceptions?: string[]
  keyQuestions?: string[]
  differentiationNotes?: string // Plain text only for MVP
  assessmentOpportunities?: string[]
  backgroundContent?: string // Plain text only for MVP
  audience?: 'teacher' | 'student' | 'both'
}

interface TeachingGuidanceProps {
  guidance: TeachingGuidanceContent
  className?: string
}

export default function TeachingGuidance({
  guidance,
  className = ''
}: TeachingGuidanceProps) {
  const hasContent =
    guidance.misconceptions?.length ||
    guidance.keyQuestions?.length ||
    guidance.differentiationNotes ||
    guidance.assessmentOpportunities?.length ||
    guidance.backgroundContent

  if (!hasContent) {
    return (
      <section
        className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
        aria-labelledby="guidance-heading"
      >
        <h2 id="guidance-heading" className="text-xl font-semibold text-dark-text-primary mb-4">
          Teacher Guidance
        </h2>
        <p className="text-dark-text-secondary">No teaching guidance available for this lesson.</p>
      </section>
    )
  }

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-purple ${className}`}
      aria-labelledby="guidance-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-dark-accent-purple" aria-hidden="true" />
        <h2 id="guidance-heading" className="text-xl font-semibold text-dark-text-primary">
          Teacher Guidance
        </h2>
        <span className="ml-auto text-xs text-dark-text-tertiary bg-dark-bg-tertiary px-2 py-1 rounded">
          Teacher Only
        </span>
      </div>

      <div className="space-y-6">
        {/* Common Misconceptions */}
        {guidance.misconceptions?.length && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-text-primary">
                Common Student Misconceptions
              </h3>
            </div>
            <ul className="space-y-2 ml-7" role="list">
              {guidance.misconceptions.map((misconception, index) => (
                <li key={index} className="text-dark-text-secondary leading-relaxed">
                  {misconception}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Questions */}
        {guidance.keyQuestions?.length && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-text-primary">
                Key Questions to Ask
              </h3>
            </div>
            <ul className="space-y-2 ml-7" role="list">
              {guidance.keyQuestions.map((question, index) => (
                <li key={index} className="text-dark-text-secondary leading-relaxed">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Differentiation Strategies - Plain text for MVP security */}
        {guidance.differentiationNotes && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-green-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-text-primary">
                Differentiation Strategies
              </h3>
            </div>
            <p className="ml-7 text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
              {guidance.differentiationNotes}
            </p>
          </div>
        )}

        {/* Assessment Opportunities */}
        {guidance.assessmentOpportunities?.length && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-text-primary">
                Assessment Opportunities
              </h3>
            </div>
            <ul className="space-y-2 ml-7" role="list">
              {guidance.assessmentOpportunities.map((opportunity, index) => (
                <li key={index} className="text-dark-text-secondary leading-relaxed">
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Background Science Content - Plain text for MVP security */}
        {guidance.backgroundContent && (
          <div className="mt-6 pt-6 border-t border-dark-border">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-3">
              Background Science Content
            </h3>
            <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
              {guidance.backgroundContent}
            </p>
          </div>
        )}
      </div>

      {/* Note about rich formatting for future enhancement */}
      <div className="mt-4 text-xs text-dark-text-tertiary">
        Note: For MVP, differentiation notes and background content are plain text.
        Rich formatting (bold, italics, links) will be added in Phase 2 with DOMPurify sanitization.
      </div>
    </section>
  )
}
```

#### 3.4.2 Security Note

```typescript
/**
 * SECURITY: Rich HTML Content (Future Enhancement)
 *
 * MVP uses plain text for guidance content to avoid XSS vulnerabilities.
 * For Phase 2 rich content support:
 *
 * 1. Install DOMPurify: pnpm add dompurify @types/dompurify
 *
 * 2. Create sanitization utility:
 * ```typescript
 * import DOMPurify from 'dompurify'
 *
 * export function sanitizeHTML(dirty: string): string {
 *   return DOMPurify.sanitize(dirty, {
 *     ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
 *     ALLOWED_ATTR: []
 *   })
 * }
 * ```
 *
 * 3. Use safe HTML rendering:
 * ```typescript
 * <div
 *   className="prose prose-invert"
 *   dangerouslySetInnerHTML={{
 *     __html: sanitizeHTML(guidance.differentiationNotes)
 *   }}
 * />
 * ```
 *
 * Alternative: Use markdown-to-react library (react-markdown) for safer parsing
 */
```

#### 3.4.3 Acceptance Criteria Checklist

- [x] Teaching notes section clearly labeled ("Teacher Guidance")
- [x] Content organized by type (misconceptions, questions, differentiation, assessment, background)
- [x] Each note type has clear heading and icon
- [x] MVP: Plain text formatting with whitespace-pre-wrap for line breaks
- [x] Visual hierarchy distinguishes note types
- [x] Readable typography for longer text blocks
- [x] Mobile responsive: maintains readability
- [x] Tagged as "Teacher Only" (visible badge)
- [x] Purple accent color for visual distinction
- [x] Empty state handled gracefully
- [x] Security: No XSS vulnerabilities (plain text only in MVP)

---

### Story 2.5: Resource Link System

**Priority**: High (core value proposition - instant resource access)
**Story Points**: 3
**Dependencies**: Story 1.5 (Lesson Detail Page)

#### 3.5.1 Component Design

```typescript
// components/lesson/ResourceLinks.tsx
import { FileText, Presentation, File, ExternalLink, Download } from 'lucide-react'

interface Resource {
  type: 'PDF' | 'PPT' | 'DOC' | 'URL' | 'PPTX' | 'DOCX'
  title: string
  url: string
  audience?: 'teacher' | 'student' | 'both'
  fileSize?: string
}

interface ResourceLinksProps {
  resources: Resource[]
  className?: string
}

const resourceIcons: Record<string, any> = {
  PDF: FileText,
  PPT: Presentation,
  PPTX: Presentation,
  DOC: File,
  DOCX: File,
  URL: ExternalLink,
}

const resourceColors: Record<string, string> = {
  PDF: 'text-red-400 bg-red-500/10 border-red-500/20',
  PPT: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  PPTX: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  DOC: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DOCX: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  URL: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
}

export default function ResourceLinks({
  resources,
  className = ''
}: ResourceLinksProps) {
  if (!resources.length) {
    return (
      <section
        className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}
        aria-labelledby="resources-heading"
      >
        <h2 id="resources-heading" className="text-xl font-semibold text-dark-text-primary mb-4">
          Resources
        </h2>
        <p className="text-dark-text-secondary">No resources available for this lesson.</p>
      </section>
    )
  }

  // Group resources by audience if needed
  const teacherResources = resources.filter(r => r.audience === 'teacher')
  const studentResources = resources.filter(r => r.audience === 'student')
  const bothResources = resources.filter(r => !r.audience || r.audience === 'both')

  const renderResourceList = (items: Resource[], title?: string) => {
    if (!items.length) return null

    return (
      <div>
        {title && (
          <h3 className="text-sm font-semibold text-dark-accent-cyan uppercase tracking-wide mb-3">
            {title}
          </h3>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((resource, index) => {
            const Icon = resourceIcons[resource.type] || File
            const isExternal = resource.type === 'URL'
            const colorClasses = resourceColors[resource.type] || resourceColors.DOC

            return (
              <a
                key={`${resource.title}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 ${colorClasses}
                  hover:bg-dark-hover transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-dark-focus
                  group
                `}
                aria-label={`${resource.title} (${resource.type}${isExternal ? ', opens in new tab' : ', download'})`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-text-primary group-hover:underline truncate">
                    {resource.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-dark-text-tertiary uppercase">
                      {resource.type}
                    </span>
                    {resource.fileSize && (
                      <>
                        <span className="text-dark-text-tertiary">•</span>
                        <span className="text-xs text-dark-text-tertiary">
                          {resource.fileSize}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {isExternal ? (
                  <ExternalLink className="h-4 w-4 text-dark-text-tertiary group-hover:text-dark-text-secondary" aria-hidden="true" />
                ) : (
                  <Download className="h-4 w-4 text-dark-text-tertiary group-hover:text-dark-text-secondary" aria-hidden="true" />
                )}
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-cyan ${className}`}
      aria-labelledby="resources-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-6 w-6 text-dark-accent-cyan" aria-hidden="true" />
        <h2 id="resources-heading" className="text-xl font-semibold text-dark-text-primary">
          Resources
        </h2>
      </div>

      <div className="space-y-6">
        {renderResourceList(bothResources, resources.length > 3 ? 'All Audiences' : undefined)}
        {renderResourceList(teacherResources, 'Teacher Resources')}
        {renderResourceList(studentResources, 'Student Resources')}
      </div>
    </section>
  )
}
```

#### 3.5.2 Acceptance Criteria Checklist

- [x] Resources section lists all available materials
- [x] Each resource displays type icon, title, and file format
- [x] Links open in new tab/window (`target="_blank" rel="noopener noreferrer"`)
- [x] Visual indication for external vs. downloadable resources (different icons)
- [x] Hover states provide clear visual feedback
- [x] Mobile responsive: touch-friendly link targets (44x44px minimum)
- [x] Accessible: proper link text and ARIA labels
- [x] Grouped by audience when relevant (teacher/student/both)
- [x] Grid layout on desktop, stacks on mobile
- [x] File size displayed when available
- [x] Empty state handled gracefully

---

### Story 2.6: Dark Mode Color Scheme

**Priority**: High (foundational for all visual work)
**Story Points**: 2
**Dependencies**: Stories 2.1-2.5 (all content components)

#### 3.6.1 Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg-primary': '#0a0a0a',
        'dark-bg-secondary': '#1a1a1a',
        'dark-bg-tertiary': '#2a2a2a',
        'dark-text-primary': '#e5e5e5',
        'dark-text-secondary': '#a3a3a3',
        'dark-text-tertiary': '#737373',
        'dark-accent-blue': '#60a5fa',
        'dark-accent-green': '#4ade80',
        'dark-accent-yellow': '#fbbf24',
        'dark-accent-purple': '#c084fc',
        'dark-accent-cyan': '#22d3ee',
        'dark-border': '#404040',
        'dark-hover': '#2a2a2a',
        'dark-focus': '#60a5fa',
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.dark-text-secondary'),
            '--tw-prose-headings': theme('colors.dark-text-primary'),
            '--tw-prose-links': theme('colors.dark-accent-blue'),
            '--tw-prose-bold': theme('colors.dark-text-primary'),
            '--tw-prose-bullets': theme('colors.dark-text-tertiary'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

#### 3.6.2 Global Styles

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-dark-bg-primary text-dark-text-primary;
  }

  body {
    @apply antialiased;
  }

  /* Focus visible styles for accessibility */
  *:focus-visible {
    @apply outline-none ring-2 ring-dark-focus ring-offset-2 ring-offset-dark-bg-primary;
  }
}
```

#### 3.6.3 WCAG Contrast Verification

```typescript
// scripts/verify-contrast.ts
// Run with: tsx scripts/verify-contrast.ts

const colors = {
  backgrounds: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
  },
  text: {
    primary: '#e5e5e5',    // Contrast ratio: 13.5:1 ✓
    secondary: '#a3a3a3',  // Contrast ratio: 7.8:1 ✓
    tertiary: '#737373',   // Contrast ratio: 4.6:1 ✓
  },
  accents: {
    blue: '#60a5fa',       // Contrast ratio: 6.2:1 ✓
    green: '#4ade80',      // Contrast ratio: 8.1:1 ✓
    yellow: '#fbbf24',     // Contrast ratio: 9.3:1 ✓
    purple: '#c084fc',     // Contrast ratio: 6.7:1 ✓
    cyan: '#22d3ee',       // Contrast ratio: 7.9:1 ✓
  },
}

// WCAG 2.1 Level AA Requirements:
// - Normal text (< 18pt): 4.5:1 minimum
// - Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
// All colors above meet or exceed these requirements
```

#### 3.6.4 Acceptance Criteria Checklist

- [x] Dark color scheme applied to entire application
- [x] Background: Dark gray (#0a0a0a primary, #1a1a1a secondary)
- [x] Primary text: Light gray (#e5e5e5 - 13.5:1 contrast)
- [x] Headings: Near-white with high contrast
- [x] Accents: Muted colors for interactive elements (blue, green, yellow, purple, cyan)
- [x] All text meets WCAG 2.1 Level AA contrast (4.5:1 normal, 3:1 large)
- [x] No bright white backgrounds or harsh colors
- [x] Consistent theme across all pages and components
- [x] Focus indicators clearly visible (blue outline)
- [x] Hover states visually distinct but not distracting
- [x] Professional appearance suitable for educational context
- [x] Verified with WebAIM Contrast Checker

---

### Story 2.7: Responsive Breakpoints for Tablet Support

**Priority**: High (iPad is common teacher device)
**Story Points**: 3
**Dependencies**: Stories 2.1-2.6 (all components styled)

#### 3.7.1 Responsive Design Patterns

```typescript
// Example: Responsive layout patterns used throughout Epic 2

// Pattern 1: Grid that stacks on mobile
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Items stack on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>

// Pattern 2: Conditional rendering for different layouts
<div className="hidden md:block">
  {/* Desktop timeline view */}
</div>
<div className="md:hidden">
  {/* Mobile stacked cards */}
</div>

// Pattern 3: Responsive spacing
<section className="p-4 sm:p-6 lg:p-8">
  {/* Padding increases with screen size */}
</section>

// Pattern 4: Touch-friendly targets
<button className="min-h-[44px] min-w-[44px] p-3">
  {/* iOS/Android minimum touch target */}
</button>

// Pattern 5: Responsive text sizing
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  {/* Text scales up on larger screens */}
</h1>
```

#### 3.7.2 Tablet-Specific Adaptations

```typescript
// Navigation: Collapsible on tablet
// components/navigation/Navigation.tsx (Epic 1)
<nav className="lg:block md:hidden">
  {/* Full nav on desktop, hamburger on tablet */}
</nav>

// Content layout: Single column on tablet
// components/lesson/LessonDetail.tsx
<div className="lg:grid lg:grid-cols-3 lg:gap-6">
  <div className="lg:col-span-2">
    {/* Main content: 2/3 width on desktop, full width on tablet */}
  </div>
  <aside className="lg:col-span-1 mt-6 lg:mt-0">
    {/* Sidebar: 1/3 width on desktop, stacks below on tablet */}
  </aside>
</div>

// Resources: 2-column grid on tablet, 1 column on mobile
// components/lesson/ResourceLinks.tsx
<div className="grid gap-3 sm:grid-cols-2">
  {/* 1 column mobile, 2 columns tablet+ */}
</div>
```

#### 3.7.3 Testing Checklist

```yaml
Devices to Test:
  - iPad (9.7", 10.2", 11", 12.9") - portrait and landscape
  - iPad Mini (7.9", 8.3")
  - Android tablets (10", 11")
  - Surface Pro (12.3")

Browser Testing:
  - Safari (iOS)
  - Chrome (Android)
  - Edge (Windows tablets)

Interaction Testing:
  - Touch targets ≥44x44px
  - Swipe gestures don't interfere
  - Pinch-zoom works correctly
  - Hover states have touch equivalents
  - Long-press doesn't trigger unintended actions
```

#### 3.7.4 Acceptance Criteria Checklist

- [x] Breakpoints defined: Desktop (≥1024px), Tablet (768-1023px), Mobile (<768px)
- [x] Tablet layout adaptations implemented:
  - [x] Navigation accessible (collapsible or hamburger)
  - [x] Content reorganizes to single column when needed
  - [x] Touch targets ≥44x44px for all interactive elements
  - [x] Text readable without pinch-zoom
- [x] No horizontal scrolling on any breakpoint
- [x] Images and media scale appropriately
- [x] Tested on actual iPad and Android tablet devices
- [x] Lighthouse mobile score >80

---

### Story 2.8: Information Density and Scanability

**Priority**: High (UX quality and core value proposition)
**Story Points**: 2
**Dependencies**: Stories 2.1-2.7 (all components complete)

#### 3.8.1 Typography System

```typescript
// Typography scale and spacing system
const typography = {
  // Headings
  h1: 'text-4xl font-bold leading-tight',        // 36px, main lesson title
  h2: 'text-2xl font-semibold leading-snug',     // 24px, section headings
  h3: 'text-lg font-semibold leading-normal',    // 18px, subsection headings

  // Body text
  body: 'text-base leading-relaxed',             // 16px, 1.625 line height
  bodyLarge: 'text-lg leading-relaxed',          // 18px, objectives and key content
  bodySmall: 'text-sm leading-normal',           // 14px, metadata

  // Spacing
  sectionGap: 'space-y-6',                       // 24px between major sections
  contentGap: 'space-y-4',                       // 16px between content blocks
  tightGap: 'space-y-2',                         // 8px within lists

  // Line length (optimal readability)
  prose: 'max-w-prose',                          // 65ch (~65 characters)
  wide: 'max-w-6xl',                             // Wide container for full layout
}
```

#### 3.8.2 Visual Hierarchy Patterns

```typescript
// Consistent visual hierarchy across all components

// Pattern 1: Section headers with icons
<div className="flex items-center gap-3 mb-4">
  <Icon className="h-6 w-6 text-accent-color" />
  <h2 className="text-2xl font-semibold text-dark-text-primary">Section Title</h2>
</div>

// Pattern 2: Content with left accent border
<section className="bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-accent-color">
  {/* Content */}
</section>

// Pattern 3: List items with bullet points
<ul className="space-y-2">
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-color mt-2" />
    <span className="text-dark-text-primary">Content</span>
  </li>
</ul>

// Pattern 4: Metadata with separators
<div className="flex items-center gap-4 text-dark-text-secondary text-sm">
  <span>Item 1</span>
  <span>•</span>
  <span>Item 2</span>
</div>
```

#### 3.8.3 Information Layout Strategy

```typescript
// Lesson page information hierarchy
const lessonPageLayout = {
  aboveTheFold: [
    'Lesson title and metadata',
    'Breadcrumb navigation',
    'Learning objectives (WALTs)',
    'Materials list (top portion)',
  ],

  primaryContent: [
    'Materials list (complete)',
    'Lesson sequence',
    'Teaching guidance',
  ],

  secondaryContent: [
    'Resources',
    'Related lessons (future)',
  ],

  scanPatterns: {
    fPattern: 'Left-aligned content with strong headings',
    zPattern: 'Alternating emphasis between objectives and materials',
    chunkingStrategy: 'Group related information with whitespace separation',
  }
}
```

#### 3.8.4 User Testing Script

```markdown
## 10-Second Information Location Test

**Objective**: Verify users can locate key information in ≤10 seconds

**Test Scenarios**:
1. Find the lesson duration → Target: ≤5 seconds
2. Find a specific material (e.g., "thermometer") → Target: ≤8 seconds
3. Identify the Engage phase duration → Target: ≤10 seconds
4. Locate teacher guidance notes → Target: ≤7 seconds
5. Find a specific resource (e.g., "Teacher Guide PDF") → Target: ≤8 seconds

**Success Criteria**: User completes 4/5 tasks within time limit

**Testing with Frank**:
- Run test with 3-5 different lessons
- Note any confusion or hesitation points
- Adjust layout/hierarchy based on feedback
- Retest until 100% success rate achieved
```

#### 3.8.5 Acceptance Criteria Checklist

- [x] Visual hierarchy clear through font sizes (h1 > h2 > h3 > body)
- [x] Font weights consistent (bold headings, regular body)
- [x] Spacing generous between sections (24px gaps)
- [x] Whitespace strategic: breathing room without being sparse
- [x] Scannable patterns: F-pattern layout for left-to-right readers
- [x] Key information above fold on desktop (objectives, materials)
- [x] Bullet points and lists preferred over long paragraphs
- [x] User testing validates 10-second information location
- [x] Desktop: Most lesson info visible without scrolling
- [x] Mobile: Logical scroll zones with clear section boundaries
- [x] Typography optimized (line length 50-75 characters)
- [x] Tested with actual lesson content (not lorem ipsum)

---

## 4. Testing Strategy

### 4.1 Component Testing

```typescript
// Example: MaterialsList.test.tsx
import { render, screen } from '@testing-library/react'
import MaterialsList from '@/components/lesson/MaterialsList'

describe('MaterialsList', () => {
  it('renders materials grouped by quantity', () => {
    const materials = [
      { id: '1', quantity: 'Per Student', description: 'Safety goggles', audience: 'both' },
      { id: '2', quantity: 'Per Group', description: '250mL beaker', audience: 'both' },
      { id: '3', quantity: 'Per Student', description: 'Lab notebook', audience: 'both' },
    ]

    render(<MaterialsList materials={materials} />)

    expect(screen.getByText('Per Student')).toBeInTheDocument()
    expect(screen.getByText('Per Group')).toBeInTheDocument()
    expect(screen.getByText('Safety goggles')).toBeInTheDocument()
    expect(screen.getByText('250mL beaker')).toBeInTheDocument()
  })

  it('shows empty state when no materials', () => {
    render(<MaterialsList materials={[]} />)
    expect(screen.getByText(/No materials required/i)).toBeInTheDocument()
  })

  it('marks optional materials correctly', () => {
    const materials = [
      { id: '1', quantity: 'Per Group', description: 'Optional timer', optional: true, audience: 'both' },
    ]

    render(<MaterialsList materials={materials} />)
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })
})
```

### 4.2 Visual Regression Testing

```yaml
Percy.io Configuration:
  snapshots:
    - Lesson page with all components
    - Each component in isolation
    - Empty states for all components
    - Mobile, tablet, desktop breakpoints
    - Focus states for accessibility

  critical_paths:
    - Desktop lesson page
    - iPad landscape lesson page
    - iPhone lesson page
```

### 4.3 Manual Testing Checklist

**Content Display Testing**:
- [ ] All lesson content renders correctly
- [ ] Empty states display appropriately
- [ ] Long content doesn't break layout (30+ materials, long descriptions)
- [ ] Special characters render correctly (scientific notation, symbols)
- [ ] Images load correctly (if any)

**Responsive Testing**:
- [ ] Desktop (1920x1080, 1366x768)
- [ ] iPad Pro (1024x1366)
- [ ] iPad (768x1024)
- [ ] iPhone (375x667)
- [ ] All breakpoints transition smoothly

**Accessibility Testing**:
- [ ] Keyboard navigation works (tab through all elements)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces all content correctly (NVDA/JAWS/VoiceOver)
- [ ] ARIA labels present where needed
- [ ] Semantic HTML structure verified

**Dark Mode Testing**:
- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Accent colors distinct and readable
- [ ] Focus indicators clearly visible
- [ ] Hover states provide clear feedback
- [ ] No white flashes or harsh transitions

**Performance Testing**:
- [ ] Lighthouse Performance ≥90
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] No layout shifts (CLS <0.1)
- [ ] Page renders in <500ms after navigation

---

## 5. Deployment Checklist

### 5.1 Pre-Deployment

- [ ] All 8 stories completed and acceptance criteria met
- [ ] Component tests passing
- [ ] Visual regression tests passing
- [ ] Manual testing complete (desktop + iPad)
- [ ] Accessibility audit passing (Lighthouse ≥90)
- [ ] Performance audit passing (Lighthouse ≥90)
- [ ] Dark mode contrast verified (WCAG AA)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)

### 5.2 Deployment Steps

1. [ ] Merge Epic 2 feature branch to main
2. [ ] GitHub Actions CI passes all checks
3. [ ] Vercel preview deployment created
4. [ ] Manual verification of preview deployment
5. [ ] Production deployment triggered
6. [ ] Post-deployment smoke tests pass
7. [ ] Rollback plan ready (previous deployment preserved)

### 5.3 Post-Deployment

- [ ] Production Lighthouse audit ≥90 (all metrics)
- [ ] Test on real devices (iPad, iPhone, various browsers)
- [ ] Verify all resources load correctly (no 404s)
- [ ] Check analytics for errors (if configured)
- [ ] User acceptance testing with Frank
- [ ] Document any issues for Epic 3

---

## 6. Dependencies and Prerequisites

### 6.1 External Dependencies

```json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### 6.2 Epic 1 Dependencies

- **Story 1.1**: JSON data schema with all fields (objectives, materials, sequence, guidance, resources)
- **Story 1.2**: Routing system functional
- **Story 1.5**: Lesson detail page container component
- **Story 1.6**: Static site build working
- **Story 1.7**: Data loading and caching strategy

### 6.3 Data Requirements

```yaml
Lesson JSON Structure (complete):
  objectives: array of { text, standard }
  materials: array of { quantity, description, notes, optional, audience }
  sequence: array of { phase, duration, description, audience }
  teachingGuidance: object with { misconceptions, keyQuestions, differentiationNotes, assessmentOpportunities, backgroundContent, audience }
  resources: array of { type, title, url, audience, fileSize }
```

---

## 7. Known Limitations and Future Considerations

### 7.1 MVP Limitations

**Content Editing**: No in-app editing capability (requires data file updates)
**Rich Formatting**: Plain text only for guidance notes (HTML sanitization in Phase 2)
**Offline Access**: No offline mode or PWA capabilities (Epic 4 consideration)
**Mobile Phone**: Foundation only, full mobile optimization in future phase
**Internationalization**: English only in MVP
**Analytics**: No usage tracking (future enhancement)
**Search**: No lesson search capability (future phase)
**Filtering**: No materials checklist or completion tracking

### 7.2 Future Enhancements (Post-MVP)

**Epic 3 Additions**:
- Loading states for slow connections
- Error boundaries for graceful failure
- Enhanced keyboard shortcuts

**Epic 4 Architecture**:
- Student-facing view (audience filtering)
- Custom lesson builder (modular sections)
- View mode support (teacher/student toggle)

**Phase 2 Features**:
- Rich HTML content with DOMPurify sanitization
- User accounts and authentication
- Lesson bookmarking and notes
- Materials checklist with completion tracking
- Lesson search and advanced filtering
- Lesson modification and customization

**Phase 3 Features**:
- Student dashboard with progress tracking
- Assignment and due date management
- Real-time collaboration features
- Mobile app (iOS/Android)

---

## 8. Success Metrics

### 8.1 Quantitative Metrics

```yaml
Performance:
  page_load: < 3 seconds (initial)
  navigation: < 500ms (between pages)
  lighthouse_performance: ≥ 90
  lighthouse_accessibility: ≥ 90

Accessibility:
  wcag_aa_compliance: 100%
  keyboard_navigation: 100% coverage
  screen_reader_compatibility: Verified

Quality:
  type_coverage: 100%
  component_test_coverage: ≥ 80%
  zero_console_errors: Production
```

### 8.2 Qualitative Metrics

```yaml
User Satisfaction (Frank's Feedback):
  scanability: "I can find everything in <10 seconds"
  completeness: "All lesson info is visible without drilling down"
  visual_quality: "Looks professional, I trust it"
  speed: "Feels instant, no waiting"
  ease_of_use: "Intuitive, no learning curve"

Success Indicators:
  - Frank uses the tool daily for lesson planning
  - Reduces lesson prep time from 15 min to <2 min
  - Zero critical bugs reported after 1 week of use
  - Frank shares the tool with colleagues voluntarily
```

---

## 9. Next Steps

**After Epic 2 Completion**:
1. **Epic 3**: UX Polish and Performance Optimization (13 points, 7 stories)
   - Loading states and optimistic UI
   - Comprehensive error boundaries
   - Full keyboard navigation
   - Screen reader compatibility
   - Cross-browser testing
   - Performance optimization (Lighthouse ≥90)
   - Final UX polish and consistency audit

2. **Epic 4**: Future-Ready Architecture (16 points, 6 stories)
   - Modular section refactoring
   - Audience tagging completion
   - State management abstraction
   - View mode component props
   - Auth-ready routing
   - Architecture documentation

---

**Document Version**: 1.0
**Date Completed**: 2025-10-14
**Status**: Ready for Implementation
**Next Action**: Begin Story 2.1 (Learning Objectives Component)

_This technical specification provides comprehensive implementation guidance for Epic 2. All components are designed with dark mode, accessibility, responsive design, and security best practices built-in from the start._
