# Technical Specification: Epic 4 - Future-Ready Architecture and Foundation Features

**Epic Goal**: Establish architectural patterns and data structures enabling Phase 2 and Phase 3 expansions without major refactoring.

**Business Value**: Reduces future development cost and risk. Enables rapid expansion to multi-user and student access when validated.

**Story Count**: 6 stories
**Story Points**: 16 points
**Dependencies**: Epic 1 (requires data structure foundation)

---

## 1. Epic Overview

### 1.1 Business Goals

**Primary Objective**: Build architectural foundation enabling future features without refactoring core systems.

**Key Outcomes**:
- Modular data schema supporting custom lesson builder (Phase 2)
- Audience tagging enabling student-facing views (Phase 3)
- State management architecture supporting authentication (Phase 2)
- Component design supporting view mode filtering (Phase 3)
- Protected route patterns enabling multi-user access (Phase 2)
- Documentation enabling confident future development

**Success Criteria**:
- ✅ All lesson data migrated to modular section schema
- ✅ Every content element tagged with appropriate audience
- ✅ State management abstraction implemented with localStorage persistence
- ✅ All components accept viewMode prop (even if unused in MVP)
- ✅ Authentication-ready routing structure documented
- ✅ ADRs created for all architectural decisions

### 1.2 Technical Goals

**Architecture Objectives**:
- Design for extensibility without premature optimization
- Maintain MVP simplicity while enabling future complexity
- Document architectural decisions with rationale and consequences
- Validate patterns through implementation, not speculation

**Quality Standards**:
- All migrations include rollback capability
- All abstractions maintain type safety
- All documentation includes code examples
- All patterns tested in MVP context

---

## 2. Architecture Foundation

### 2.1 Tech Stack (from solution-architecture.md)

| Category | Technology | Version | Usage in Epic 4 |
|----------|-----------|---------|-----------------|
| Framework | Next.js | 15.x | App Router, routing patterns |
| Language | TypeScript | 5.x | Strict typing for schemas, state |
| State Management | Zustand (recommended) | 5.x | Abstraction layer implementation |
| Schema Validation | Zod | 3.x | Data schema validation |
| Testing | Vitest | 2.x | State management, schema tests |

**State Management Decision (Story 4.3)**:
- **Recommended**: Zustand for simplicity and performance
- **Alternative 1**: React Context + useReducer (sufficient for MVP)
- **Alternative 2**: Redux Toolkit (overkill for current scope)
- **Alternative 3**: Jotai (atoms approach, good for granular state)

### 2.2 Data Schema Evolution

**Current (Epic 1) Schema**:
```typescript
interface Lesson {
  id: string
  title: string
  discipline: 'life-science' | 'earth-space-science' | 'physical-science'
  unit: string
  lessonNumber: string
  objectives: string[]
  materials: Material[]
  sequence: LessonPhase[]
  teachingGuidance?: TeachingGuidance
  resources?: Resource[]
}
```

**Epic 4 Enhanced Schema (Modular Sections)**:
```typescript
interface ModularLesson {
  id: string
  title: string
  discipline: 'life-science' | 'earth-space-science' | 'physical-science'
  unit: string
  lessonNumber: string
  sections: LessonSection[]  // NEW: All content as sections
  metadata: LessonMetadata
}

interface LessonSection {
  id: string                    // Unique section ID
  type: SectionType            // objectives | materials | phase | notes | resources
  order: number                // Display sequence
  audience: AudienceTag        // NEW: teacher | student | both
  optional: boolean            // Can be hidden in custom lessons
  content: SectionContent      // Type-specific content
}

type SectionType =
  | 'objectives'
  | 'materials'
  | 'phase'
  | 'teaching-notes'
  | 'assessment-guidance'
  | 'resources'
  | 'custom'

type AudienceTag = 'teacher' | 'student' | 'both'

// Content unions for type safety
type SectionContent =
  | ObjectivesContent
  | MaterialsContent
  | PhaseContent
  | NotesContent
  | ResourcesContent
```

---

## 3. Story-by-Story Implementation Specifications

### Story 4.1: Refactor Lesson Data Schema for Modular Sections (5 points)

**Goal**: Restructure lesson data to support custom lesson builder without schema changes.

#### 3.1.1 Complete Type Definitions

```typescript
// types/lesson.ts

/**
 * Modular Lesson Schema
 *
 * Design: Each lesson composed of independent, reorderable sections
 * Future Use: Custom lesson builder can cherry-pick and reorder sections
 */

export interface ModularLesson {
  id: string
  title: string
  discipline: Discipline
  unit: string
  lessonNumber: string
  sections: LessonSection[]
  metadata: LessonMetadata
  version: string  // Schema version for migration tracking
}

export interface LessonSection {
  id: string                    // Format: `${lessonId}-${type}-${index}`
  type: SectionType
  order: number                // Display order (allows reordering)
  audience: AudienceTag        // Visibility control
  optional: boolean            // Can be hidden in custom lessons
  content: SectionContent
  metadata?: SectionMetadata   // Optional metadata per section
}

export type SectionType =
  | 'objectives'              // Learning objectives (WALTs)
  | 'materials'               // Materials and supplies list
  | 'phase'                   // Lesson phase (engage, explore, etc.)
  | 'teaching-notes'          // Teacher-only guidance
  | 'assessment-guidance'     // Assessment strategies
  | 'resources'               // External links and resources
  | 'custom'                  // User-created sections (future)

export type AudienceTag =
  | 'teacher'                 // Teacher-only content
  | 'student'                 // Student-visible content
  | 'both'                    // Visible to both (default)

// Discriminated union for type-safe content
export type SectionContent =
  | { type: 'objectives'; data: ObjectivesContent }
  | { type: 'materials'; data: MaterialsContent }
  | { type: 'phase'; data: PhaseContent }
  | { type: 'teaching-notes'; data: NotesContent }
  | { type: 'assessment-guidance'; data: AssessmentContent }
  | { type: 'resources'; data: ResourcesContent }
  | { type: 'custom'; data: CustomContent }

export interface ObjectivesContent {
  objectives: {
    id: string
    text: string
    standard?: string  // NGSS alignment
  }[]
}

export interface MaterialsContent {
  materials: Material[]
  notes?: string  // Setup notes, safety concerns
}

export interface PhaseContent {
  phase: PhaseName
  duration: number  // minutes
  activities: Activity[]
  transitions?: string  // Notes for moving between phases
}

export interface NotesContent {
  topic: string  // What this note is about
  content: string
  importance: 'critical' | 'important' | 'helpful'
  tags?: string[]  // differentiation, pacing, misconceptions, etc.
}

export interface AssessmentContent {
  assessmentType: 'formative' | 'summative' | 'diagnostic'
  strategy: string
  successCriteria: string[]
  commonMisconceptions?: string[]
}

export interface ResourcesContent {
  resources: Resource[]
  category?: 'preparation' | 'extension' | 'remediation' | 'enrichment'
}

export interface CustomContent {
  title: string
  body: string
  format: 'text' | 'markdown' | 'html'  // Future: rich content
}

export interface SectionMetadata {
  createdAt?: string
  modifiedAt?: string
  source?: 'original' | 'custom'  // Track custom additions
  tags?: string[]
}

export interface LessonMetadata {
  schemaVersion: string  // e.g., "2.0.0"
  lastMigrated?: string
  customized: boolean    // Has user made custom modifications
  originalId?: string    // Reference to source lesson if customized
}
```

#### 3.1.2 Schema Migration Script

```typescript
// scripts/migrate-to-modular-schema.ts

import { readFile, writeFile } from 'fs/promises'
import { glob } from 'glob'
import type { Lesson } from '@/types/lesson-v1'  // Old schema
import type { ModularLesson, LessonSection } from '@/types/lesson'  // New schema

/**
 * Migration Script: Legacy → Modular Schema
 *
 * Usage:
 *   pnpm tsx scripts/migrate-to-modular-schema.ts
 *
 * Validates:
 * - All sections have unique IDs
 * - Order is sequential starting from 0
 * - Audience tags are valid
 * - Content type matches section type
 */

interface MigrationResult {
  success: boolean
  lessonId: string
  sectionsCreated: number
  warnings: string[]
  errors: string[]
}

async function migrateLessonToModular(
  oldLesson: Lesson
): Promise<{ lesson: ModularLesson; result: MigrationResult }> {
  const warnings: string[] = []
  const errors: string[] = []
  const sections: LessonSection[] = []
  let order = 0

  // 1. Migrate objectives
  if (oldLesson.objectives && oldLesson.objectives.length > 0) {
    sections.push({
      id: `${oldLesson.id}-objectives-0`,
      type: 'objectives',
      order: order++,
      audience: 'both',  // Objectives typically visible to all
      optional: false,
      content: {
        type: 'objectives',
        data: {
          objectives: oldLesson.objectives.map((text, index) => ({
            id: `${oldLesson.id}-obj-${index}`,
            text,
            standard: undefined  // Extract from text if present
          }))
        }
      }
    })
  }

  // 2. Migrate materials
  if (oldLesson.materials && oldLesson.materials.length > 0) {
    sections.push({
      id: `${oldLesson.id}-materials-0`,
      type: 'materials',
      order: order++,
      audience: 'both',  // Materials typically visible to all
      optional: false,
      content: {
        type: 'materials',
        data: {
          materials: oldLesson.materials,
          notes: undefined
        }
      }
    })
  }

  // 3. Migrate lesson sequence phases
  if (oldLesson.sequence && oldLesson.sequence.length > 0) {
    oldLesson.sequence.forEach((phase, index) => {
      sections.push({
        id: `${oldLesson.id}-phase-${index}`,
        type: 'phase',
        order: order++,
        audience: 'both',  // Phases typically visible to all
        optional: false,
        content: {
          type: 'phase',
          data: {
            phase: phase.phase,
            duration: phase.duration,
            activities: phase.activities,
            transitions: undefined
          }
        }
      })
    })
  }

  // 4. Migrate teaching guidance as teacher-only notes
  if (oldLesson.teachingGuidance) {
    const guidance = oldLesson.teachingGuidance

    if (guidance.classroomManagement) {
      sections.push({
        id: `${oldLesson.id}-notes-classroom`,
        type: 'teaching-notes',
        order: order++,
        audience: 'teacher',  // Teacher-only
        optional: true,
        content: {
          type: 'teaching-notes',
          data: {
            topic: 'Classroom Management',
            content: guidance.classroomManagement,
            importance: 'important',
            tags: ['management', 'pacing']
          }
        }
      })
    }

    if (guidance.differentiation) {
      sections.push({
        id: `${oldLesson.id}-notes-differentiation`,
        type: 'teaching-notes',
        order: order++,
        audience: 'teacher',
        optional: true,
        content: {
          type: 'teaching-notes',
          data: {
            topic: 'Differentiation Strategies',
            content: guidance.differentiation,
            importance: 'important',
            tags: ['differentiation', 'accessibility']
          }
        }
      })
    }

    if (guidance.misconceptions) {
      sections.push({
        id: `${oldLesson.id}-notes-misconceptions`,
        type: 'teaching-notes',
        order: order++,
        audience: 'teacher',
        optional: false,  // Critical information
        content: {
          type: 'teaching-notes',
          data: {
            topic: 'Common Student Misconceptions',
            content: guidance.misconceptions,
            importance: 'critical',
            tags: ['misconceptions', 'assessment']
          }
        }
      })
    }

    if (guidance.backgroundScience) {
      sections.push({
        id: `${oldLesson.id}-notes-background`,
        type: 'teaching-notes',
        order: order++,
        audience: 'teacher',
        optional: true,
        content: {
          type: 'teaching-notes',
          data: {
            topic: 'Background Science for Teachers',
            content: guidance.backgroundScience,
            importance: 'helpful',
            tags: ['background', 'content-knowledge']
          }
        }
      })
    }
  }

  // 5. Migrate resources
  if (oldLesson.resources && oldLesson.resources.length > 0) {
    sections.push({
      id: `${oldLesson.id}-resources-0`,
      type: 'resources',
      order: order++,
      audience: 'both',  // Resources typically visible to all
      optional: true,
      content: {
        type: 'resources',
        data: {
          resources: oldLesson.resources,
          category: 'preparation'
        }
      }
    })
  }

  // 6. Create migrated lesson
  const migratedLesson: ModularLesson = {
    id: oldLesson.id,
    title: oldLesson.title,
    discipline: oldLesson.discipline,
    unit: oldLesson.unit,
    lessonNumber: oldLesson.lessonNumber,
    sections,
    metadata: {
      schemaVersion: '2.0.0',
      lastMigrated: new Date().toISOString(),
      customized: false,
      originalId: oldLesson.id
    },
    version: '2.0.0'
  }

  // 7. Validation
  const uniqueIds = new Set(sections.map(s => s.id))
  if (uniqueIds.size !== sections.length) {
    errors.push('Duplicate section IDs detected')
  }

  const expectedOrder = Array.from({ length: sections.length }, (_, i) => i)
  const actualOrder = sections.map(s => s.order).sort((a, b) => a - b)
  if (JSON.stringify(expectedOrder) !== JSON.stringify(actualOrder)) {
    warnings.push('Section order is not sequential')
  }

  const result: MigrationResult = {
    success: errors.length === 0,
    lessonId: oldLesson.id,
    sectionsCreated: sections.length,
    warnings,
    errors
  }

  return { lesson: migratedLesson, result }
}

async function migrateAllLessons() {
  console.log('🔄 Starting migration to modular schema...\n')

  const lessonFiles = await glob('data/lessons/**/*.json')
  const results: MigrationResult[] = []

  for (const file of lessonFiles) {
    try {
      const content = await readFile(file, 'utf-8')
      const oldLesson: Lesson = JSON.parse(content)

      const { lesson, result } = await migrateLessonToModular(oldLesson)

      if (result.success) {
        // Write migrated lesson
        const outputFile = file.replace('.json', '.v2.json')
        await writeFile(outputFile, JSON.stringify(lesson, null, 2))
        console.log(`✅ ${lesson.id}: ${result.sectionsCreated} sections`)
      } else {
        console.error(`❌ ${oldLesson.id}: Migration failed`)
        result.errors.forEach(err => console.error(`   - ${err}`))
      }

      if (result.warnings.length > 0) {
        result.warnings.forEach(warn => console.warn(`⚠️  ${warn}`))
      }

      results.push(result)
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error)
    }
  }

  // Summary
  console.log('\n📊 Migration Summary:')
  console.log(`Total lessons: ${results.length}`)
  console.log(`Successful: ${results.filter(r => r.success).length}`)
  console.log(`Failed: ${results.filter(r => !r.success).length}`)
  console.log(`Warnings: ${results.reduce((sum, r) => sum + r.warnings.length, 0)}`)
}

migrateAllLessons().catch(console.error)
```

#### 3.1.3 Section Rendering Components

```typescript
// components/lesson/SectionRenderer.tsx

import { LessonSection } from '@/types/lesson'
import LearningObjectives from './LearningObjectives'
import MaterialsList from './MaterialsList'
import LessonPhase from './LessonPhase'
import TeachingNotes from './TeachingNotes'
import AssessmentGuidance from './AssessmentGuidance'
import ResourceLinks from './ResourceLinks'

interface SectionRendererProps {
  section: LessonSection
  viewMode: 'teacher' | 'student'  // Future: filter by audience
  className?: string
}

/**
 * Universal Section Renderer
 *
 * Renders any lesson section based on its type
 * Respects audience tags when viewMode is 'student'
 */
export default function SectionRenderer({
  section,
  viewMode,
  className = ''
}: SectionRendererProps) {
  // Filter by audience
  if (viewMode === 'student' && section.audience === 'teacher') {
    return null  // Hide teacher-only content in student view
  }

  // Render based on section type
  switch (section.content.type) {
    case 'objectives':
      return (
        <LearningObjectives
          objectives={section.content.data.objectives}
          className={className}
        />
      )

    case 'materials':
      return (
        <MaterialsList
          materials={section.content.data.materials}
          notes={section.content.data.notes}
          className={className}
        />
      )

    case 'phase':
      return (
        <LessonPhase
          phase={section.content.data}
          className={className}
        />
      )

    case 'teaching-notes':
      return (
        <TeachingNotes
          topic={section.content.data.topic}
          content={section.content.data.content}
          importance={section.content.data.importance}
          tags={section.content.data.tags}
          className={className}
        />
      )

    case 'assessment-guidance':
      return (
        <AssessmentGuidance
          assessment={section.content.data}
          className={className}
        />
      )

    case 'resources':
      return (
        <ResourceLinks
          resources={section.content.data.resources}
          category={section.content.data.category}
          className={className}
        />
      )

    default:
      // Unknown section type
      console.warn('Unknown section type:', section.content)
      return null
  }
}
```

#### 3.1.4 Testing Strategy

```typescript
// __tests__/lesson-migration.test.ts

import { describe, it, expect } from 'vitest'
import { migrateLessonToModular } from '@/scripts/migrate-to-modular-schema'
import type { Lesson } from '@/types/lesson-v1'

describe('Lesson Schema Migration', () => {
  it('migrates objectives to modular format', async () => {
    const oldLesson: Lesson = {
      id: 'test-8.1.1',
      title: 'Test Lesson',
      discipline: 'life-science',
      unit: '8.1',
      lessonNumber: '8.1.1',
      objectives: [
        'Identify patterns in inherited traits',
        'Explain how traits are passed from parents to offspring'
      ],
      materials: [],
      sequence: []
    }

    const { lesson, result } = await migrateLessonToModular(oldLesson)

    expect(result.success).toBe(true)
    expect(lesson.sections).toHaveLength(1)
    expect(lesson.sections[0].type).toBe('objectives')
    expect(lesson.sections[0].audience).toBe('both')
    expect(lesson.sections[0].content.data.objectives).toHaveLength(2)
  })

  it('assigns teacher audience to teaching notes', async () => {
    const oldLesson: Lesson = {
      id: 'test-8.1.1',
      title: 'Test Lesson',
      discipline: 'life-science',
      unit: '8.1',
      lessonNumber: '8.1.1',
      objectives: [],
      materials: [],
      sequence: [],
      teachingGuidance: {
        classroomManagement: 'Manage group work carefully',
        differentiation: 'Provide scaffolding for struggling students',
        misconceptions: 'Students may confuse acquired vs inherited traits',
        backgroundScience: 'DNA contains genetic information'
      }
    }

    const { lesson } = await migrateLessonToModular(oldLesson)

    const teachingNotes = lesson.sections.filter(s => s.type === 'teaching-notes')
    expect(teachingNotes.length).toBeGreaterThan(0)
    teachingNotes.forEach(note => {
      expect(note.audience).toBe('teacher')
    })
  })

  it('maintains sequential order', async () => {
    const oldLesson: Lesson = {
      id: 'test-8.1.1',
      title: 'Test Lesson',
      discipline: 'life-science',
      unit: '8.1',
      lessonNumber: '8.1.1',
      objectives: ['Objective 1'],
      materials: [{ name: 'Material 1', quantity: '1 per student', category: 'consumable' }],
      sequence: [
        {
          phase: 'engage',
          duration: 10,
          objective: 'Hook students',
          activities: [{ description: 'Show video', duration: 10, type: 'whole-class' }]
        }
      ]
    }

    const { lesson } = await migrateLessonToModular(oldLesson)

    const orders = lesson.sections.map(s => s.order)
    const expectedOrders = Array.from({ length: orders.length }, (_, i) => i)
    expect(orders).toEqual(expectedOrders)
  })

  it('generates unique section IDs', async () => {
    const oldLesson: Lesson = {
      id: 'test-8.1.1',
      title: 'Test Lesson',
      discipline: 'life-science',
      unit: '8.1',
      lessonNumber: '8.1.1',
      objectives: ['Obj 1', 'Obj 2'],
      materials: [{ name: 'Mat 1', quantity: '1', category: 'consumable' }],
      sequence: []
    }

    const { lesson } = await migrateLessonToModular(oldLesson)

    const ids = lesson.sections.map(s => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})
```

**Acceptance Criteria**:
- ✅ Lesson JSON restructured with discrete sections
- ✅ Each section has unique ID, type, order, audience, optional flag
- ✅ Sections can be rendered independently
- ✅ Section order can be changed without breaking functionality
- ✅ Sections can be filtered by audience tag
- ✅ Schema migration script created and tested
- ✅ Backward compatibility maintained (old files preserved as .v1.json)

---

### Story 4.2: Add Audience Tagging to Lesson Content (3 points)

**Goal**: Tag lesson content by intended audience to enable student-facing views in Phase 3.

**NOTE**: Critical audience tagging issue was already fixed in solution-architecture.md during cohesion check (CRITICAL-1). This story focuses on implementation guidance and data migration.

#### 3.2.1 Audience Tagging Guidelines

```typescript
// docs/data-guidelines/audience-tagging.md

# Audience Tagging Guidelines for OpenSciEd Lessons

## Overview
Every lesson section must include an `audience` field indicating visibility:
- `teacher`: Visible only to teachers (guidance, answers, strategies)
- `student`: Visible to students (assignments, objectives, activities)
- `both`: Visible to both (default for most content)

## Tagging Rules by Content Type

### Always "both" (Student-Visible)
- **Learning Objectives (WALTs)**: Students need to know what they're learning
- **Materials Lists**: Students prepare materials for activities
- **Lesson Activities**: Students follow instructions
- **Resources (most)**: Reference materials for learning
- **Assessment Rubrics**: Students know success criteria

### Always "teacher" (Teacher-Only)
- **Teaching Strategies**: Classroom management guidance
- **Differentiation Notes**: Scaffolding and support strategies
- **Common Misconceptions**: What to watch for during teaching
- **Assessment Answer Keys**: Correct answers and scoring guidance
- **Pacing Guidance**: Time management and flow suggestions
- **Background Science**: Content knowledge for teacher preparation

### Context-Dependent (Evaluate Case-by-Case)
- **Assessment Questions**:
  - `both` if students receive questions
  - `teacher` if formative assessment for teacher observation only
- **Resources**:
  - `both` if students access directly (videos, readings)
  - `teacher` if preparation materials (lab setup guides)
- **Discussion Prompts**:
  - `both` if students see prompts beforehand
  - `teacher` if spontaneous teacher-guided discussion

## Migration Default Logic

When migrating from legacy schema:
1. **Default to "both"**: Safest option, prevents hiding content accidentally
2. **Apply "teacher" for explicit guidance**: Any section with keywords:
   - "guidance", "management", "strategy", "differentiation"
   - "misconception", "watch for", "common errors"
   - "answer", "solution", "correct response"
3. **Keep "both" for activities**: Unless explicitly labeled "teacher notes"

## Examples

### Example 1: Objectives Section
```typescript
{
  type: 'objectives',
  audience: 'both',  // ✅ Students need to see objectives
  content: { ... }
}
```

### Example 2: Teaching Notes
```typescript
{
  type: 'teaching-notes',
  audience: 'teacher',  // ✅ Teacher-only guidance
  content: {
    topic: 'Differentiation Strategies',
    content: 'For struggling students, provide graphic organizer...'
  }
}
```

### Example 3: Assessment with Answer Key
```typescript
// Assessment questions - student-visible
{
  type: 'assessment',
  audience: 'both',
  content: {
    questions: [...]
  }
}

// Answer key - teacher-only
{
  type: 'teaching-notes',
  audience: 'teacher',
  content: {
    topic: 'Assessment Answer Key',
    content: 'Question 1: Correct answer is B because...'
  }
}
```

## Future Enhancements (Phase 3)

When implementing student view:
- Admin override: Allow teacher to toggle visibility of any section
- Student customization: Let students hide optional sections
- Assignment mode: Teacher can assign specific sections to students
- Feedback collection: Track which sections students access most
```

#### 3.2.2 Audience Validation

```typescript
// lib/validation/audience-schema.ts

import { z } from 'zod'

/**
 * Zod schema for audience tagging validation
 *
 * Ensures all sections have valid audience tags
 */

export const AudienceTagSchema = z.enum(['teacher', 'student', 'both'])

export const LessonSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'objectives',
    'materials',
    'phase',
    'teaching-notes',
    'assessment-guidance',
    'resources',
    'custom'
  ]),
  order: z.number().int().nonnegative(),
  audience: AudienceTagSchema,  // REQUIRED field
  optional: z.boolean(),
  content: z.any(),  // Validated separately by type
  metadata: z.object({
    createdAt: z.string().datetime().optional(),
    modifiedAt: z.string().datetime().optional(),
    source: z.enum(['original', 'custom']).optional(),
    tags: z.array(z.string()).optional()
  }).optional()
})

export const ModularLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  discipline: z.enum(['life-science', 'earth-space-science', 'physical-science']),
  unit: z.string(),
  lessonNumber: z.string(),
  sections: z.array(LessonSectionSchema),
  metadata: z.object({
    schemaVersion: z.string(),
    lastMigrated: z.string().datetime().optional(),
    customized: z.boolean(),
    originalId: z.string().optional()
  }),
  version: z.string()
})

/**
 * Validate lesson data against schema
 *
 * Usage:
 *   const result = validateLesson(lessonData)
 *   if (!result.success) {
 *     console.error(result.error.errors)
 *   }
 */
export function validateLesson(data: unknown) {
  return ModularLessonSchema.safeParse(data)
}

/**
 * Validate audience tags are appropriate for section types
 *
 * Business logic validation beyond schema structure
 */
export function validateAudienceLogic(section: z.infer<typeof LessonSectionSchema>): {
  valid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Teaching notes should always be teacher-only
  if (section.type === 'teaching-notes' && section.audience !== 'teacher') {
    warnings.push(
      `Teaching notes section "${section.id}" should have audience="teacher" but has "${section.audience}"`
    )
  }

  // Objectives should typically be "both"
  if (section.type === 'objectives' && section.audience === 'teacher') {
    warnings.push(
      `Objectives section "${section.id}" has audience="teacher" but students typically need to see objectives`
    )
  }

  // Assessment guidance should be teacher-only
  if (section.type === 'assessment-guidance' && section.audience !== 'teacher') {
    warnings.push(
      `Assessment guidance section "${section.id}" should have audience="teacher" but has "${section.audience}"`
    )
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}
```

#### 3.2.3 Testing Strategy

```typescript
// __tests__/audience-tagging.test.ts

import { describe, it, expect } from 'vitest'
import { validateLesson, validateAudienceLogic, LessonSectionSchema } from '@/lib/validation/audience-schema'

describe('Audience Tagging Validation', () => {
  it('requires audience field on all sections', () => {
    const invalidSection = {
      id: 'test-section',
      type: 'objectives',
      order: 0,
      // audience: missing!
      optional: false,
      content: { type: 'objectives', data: { objectives: [] } }
    }

    const result = LessonSectionSchema.safeParse(invalidSection)
    expect(result.success).toBe(false)
  })

  it('accepts valid audience tags', () => {
    const validAudiences = ['teacher', 'student', 'both']

    validAudiences.forEach(audience => {
      const section = {
        id: 'test-section',
        type: 'objectives',
        order: 0,
        audience,
        optional: false,
        content: { type: 'objectives', data: { objectives: [] } }
      }

      const result = LessonSectionSchema.safeParse(section)
      expect(result.success).toBe(true)
    })
  })

  it('rejects invalid audience tags', () => {
    const section = {
      id: 'test-section',
      type: 'objectives',
      order: 0,
      audience: 'everyone',  // Invalid!
      optional: false,
      content: { type: 'objectives', data: { objectives: [] } }
    }

    const result = LessonSectionSchema.safeParse(section)
    expect(result.success).toBe(false)
  })

  it('warns when teaching notes have non-teacher audience', () => {
    const section = {
      id: 'test-notes',
      type: 'teaching-notes',
      order: 0,
      audience: 'both',  // Should be 'teacher'!
      optional: false,
      content: { type: 'teaching-notes', data: { topic: 'Test', content: 'Content', importance: 'helpful' } }
    }

    const result = validateAudienceLogic(section as any)
    expect(result.valid).toBe(false)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('should have audience="teacher"')
  })

  it('warns when objectives are teacher-only', () => {
    const section = {
      id: 'test-objectives',
      type: 'objectives',
      order: 0,
      audience: 'teacher',  // Typically should be 'both'
      optional: false,
      content: { type: 'objectives', data: { objectives: [] } }
    }

    const result = validateAudienceLogic(section as any)
    expect(result.valid).toBe(false)
    expect(result.warnings[0]).toContain('students typically need to see objectives')
  })
})
```

**Acceptance Criteria**:
- ✅ Each section includes `audience` field with valid value
- ✅ Audience tags applied to all content types per guidelines
- ✅ Frontend components respect audience tags
- ✅ Data extraction guidelines updated with audience tagging rules
- ✅ Existing lesson data migrated with appropriate tags
- ✅ Schema validation enforces audience field presence

---

### Story 4.3: Implement State Management Abstraction Layer (3 points)

**Goal**: Clean state management architecture supporting future user preferences, tracking, and authentication.

#### 3.3.1 State Management Choice: Zustand

**Decision**: Use Zustand for state management abstraction layer.

**Rationale**:
- Simple API, minimal boilerplate
- Excellent TypeScript support
- No Context Provider wrapper needed
- Built-in devtools integration
- Good performance (subscription-based updates)
- Easy to migrate to Redux later if needed

**Alternative Considered**: React Context + useReducer
- Pros: No dependencies, built-in React
- Cons: More boilerplate, Provider wrapper complexity, harder to split state

```bash
# Installation
pnpm add zustand@5.x
```

#### 3.3.2 State Store Implementation

```typescript
// lib/store/use-app-store.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

/**
 * Application State Store
 *
 * Manages:
 * - UI state (navigation, modals)
 * - User preferences (last viewed lesson, theme)
 * - Future: Authentication state
 * - Future: User-specific lesson notes and tracking
 */

interface NavigationState {
  currentDiscipline: string | null
  currentUnit: string | null
  currentLesson: string | null
  breadcrumbs: Breadcrumb[]
}

interface UserPreferences {
  lastViewedLesson: string | null
  lastViewedAt: string | null
  viewMode: 'teacher' | 'student'  // Future: student view
  compactMode: boolean  // Dense vs spacious layout
  showOptionalSections: boolean  // Toggle optional content
}

interface UIState {
  sidebarOpen: boolean
  searchModalOpen: boolean
  feedbackModalOpen: boolean
}

// Future: Authentication state (Phase 2)
interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  userName: string | null
  userEmail: string | null
}

interface AppState {
  // Navigation
  navigation: NavigationState
  setCurrentLesson: (discipline: string, unit: string, lesson: string) => void
  clearNavigation: () => void

  // User Preferences
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  recordLessonView: (lessonId: string) => void

  // UI State
  ui: UIState
  toggleSidebar: () => void
  toggleSearchModal: () => void
  toggleFeedbackModal: () => void

  // Future: Auth (Phase 2)
  auth: AuthState
  login: (userId: string, userName: string, userEmail: string) => void
  logout: () => void

  // Reset
  resetStore: () => void
}

const initialState = {
  navigation: {
    currentDiscipline: null,
    currentUnit: null,
    currentLesson: null,
    breadcrumbs: []
  },
  preferences: {
    lastViewedLesson: null,
    lastViewedAt: null,
    viewMode: 'teacher' as const,
    compactMode: false,
    showOptionalSections: true
  },
  ui: {
    sidebarOpen: true,
    searchModalOpen: false,
    feedbackModalOpen: false
  },
  auth: {
    isAuthenticated: false,
    userId: null,
    userName: null,
    userEmail: null
  }
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Navigation actions
        setCurrentLesson: (discipline, unit, lesson) => {
          set(state => ({
            navigation: {
              currentDiscipline: discipline,
              currentUnit: unit,
              currentLesson: lesson,
              breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: discipline, path: `/browse/${discipline}` },
                { label: unit, path: `/browse/${discipline}/${unit}` },
                { label: lesson, path: `/browse/${discipline}/${unit}/${lesson}` }
              ]
            }
          }))
        },

        clearNavigation: () => {
          set({ navigation: initialState.navigation })
        },

        // User Preferences actions
        updatePreferences: (updates) => {
          set(state => ({
            preferences: { ...state.preferences, ...updates }
          }))
        },

        recordLessonView: (lessonId) => {
          set({
            preferences: {
              ...get().preferences,
              lastViewedLesson: lessonId,
              lastViewedAt: new Date().toISOString()
            }
          })
        },

        // UI actions
        toggleSidebar: () => {
          set(state => ({
            ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
          }))
        },

        toggleSearchModal: () => {
          set(state => ({
            ui: { ...state.ui, searchModalOpen: !state.ui.searchModalOpen }
          }))
        },

        toggleFeedbackModal: () => {
          set(state => ({
            ui: { ...state.ui, feedbackModalOpen: !state.ui.feedbackModalOpen }
          }))
        },

        // Auth actions (Phase 2)
        login: (userId, userName, userEmail) => {
          set({
            auth: {
              isAuthenticated: true,
              userId,
              userName,
              userEmail
            }
          })
        },

        logout: () => {
          set({ auth: initialState.auth })
        },

        // Reset
        resetStore: () => {
          set(initialState)
        }
      }),
      {
        name: 'opensci-ed-storage',  // localStorage key
        storage: createJSONStorage(() => localStorage),

        // Only persist preferences and auth, not UI state or navigation
        partialize: (state) => ({
          preferences: state.preferences,
          auth: state.auth
        }),

        // Schema version for migration support
        version: 1,

        // Migration function for future schema changes
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Example migration from v0 to v1
            // Add new fields with defaults
            return {
              ...persistedState,
              preferences: {
                ...persistedState.preferences,
                compactMode: false,  // New field in v1
                showOptionalSections: true  // New field in v1
              }
            }
          }
          return persistedState
        }
      }
    ),
    {
      name: 'OpenSciEd App Store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

// Selectors for components (memoized automatically by Zustand)
export const selectCurrentLesson = (state: AppState) => state.navigation.currentLesson
export const selectLastViewedLesson = (state: AppState) => state.preferences.lastViewedLesson
export const selectViewMode = (state: AppState) => state.preferences.viewMode
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated
```

#### 3.3.3 Usage in Components

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx

'use client'

import { useEffect } from 'react'
import { useAppStore, selectCurrentLesson, selectViewMode } from '@/lib/store/use-app-store'
import { notFound } from 'next/navigation'
import { getLessonData } from '@/lib/data'
import LessonDetail from '@/components/lesson/LessonDetail'

interface LessonPageProps {
  params: {
    discipline: string
    unit: string
    lesson: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const { discipline, unit, lesson: lessonId } = params

  // Get state management actions and selectors
  const setCurrentLesson = useAppStore(state => state.setCurrentLesson)
  const recordLessonView = useAppStore(state => state.recordLessonView)
  const viewMode = useAppStore(selectViewMode)

  // Update navigation state when page loads
  useEffect(() => {
    setCurrentLesson(discipline, unit, lessonId)
    recordLessonView(lessonId)
  }, [discipline, unit, lessonId, setCurrentLesson, recordLessonView])

  // Fetch lesson data (static in MVP)
  const lesson = getLessonData(lessonId)
  if (!lesson) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <LessonDetail
        lesson={lesson}
        viewMode={viewMode}  // Pass down for section filtering
      />
    </div>
  )
}
```

```typescript
// components/layout/Sidebar.tsx

'use client'

import { useAppStore } from '@/lib/store/use-app-store'
import { Menu, X } from 'lucide-react'

export default function Sidebar() {
  const sidebarOpen = useAppStore(state => state.ui.sidebarOpen)
  const toggleSidebar = useAppStore(state => state.toggleSidebar)
  const lastViewedLesson = useAppStore(state => state.preferences.lastViewedLesson)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-bg-secondary rounded"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-dark-bg-secondary border-r border-dark-border
          transform transition-transform duration-200 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-dark-text-primary mb-4">
            OpenSciEd Lessons
          </h2>

          {lastViewedLesson && (
            <div className="mb-6 p-3 bg-dark-bg-tertiary rounded">
              <p className="text-sm text-dark-text-tertiary mb-1">Last Viewed</p>
              <a
                href={`/browse/lesson/${lastViewedLesson}`}
                className="text-dark-accent-blue hover:underline"
              >
                {lastViewedLesson}
              </a>
            </div>
          )}

          {/* Navigation tree */}
          {/* ... */}
        </div>
      </aside>
    </>
  )
}
```

#### 3.3.4 Testing Strategy

```typescript
// __tests__/state-management.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/lib/store/use-app-store'

describe('State Management', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.getState().resetStore()
  })

  it('updates current lesson navigation', () => {
    const { setCurrentLesson, navigation } = useAppStore.getState()

    setCurrentLesson('life-science', '8.1', '8.1.1')

    const state = useAppStore.getState()
    expect(state.navigation.currentDiscipline).toBe('life-science')
    expect(state.navigation.currentUnit).toBe('8.1')
    expect(state.navigation.currentLesson).toBe('8.1.1')
    expect(state.navigation.breadcrumbs).toHaveLength(4)
  })

  it('records lesson view with timestamp', () => {
    const { recordLessonView } = useAppStore.getState()
    const beforeTime = new Date().toISOString()

    recordLessonView('8.1.1')

    const state = useAppStore.getState()
    expect(state.preferences.lastViewedLesson).toBe('8.1.1')
    expect(state.preferences.lastViewedAt).toBeDefined()
    expect(new Date(state.preferences.lastViewedAt!).getTime()).toBeGreaterThanOrEqual(
      new Date(beforeTime).getTime()
    )
  })

  it('toggles UI state', () => {
    const { toggleSidebar } = useAppStore.getState()
    const initialState = useAppStore.getState().ui.sidebarOpen

    toggleSidebar()
    expect(useAppStore.getState().ui.sidebarOpen).toBe(!initialState)

    toggleSidebar()
    expect(useAppStore.getState().ui.sidebarOpen).toBe(initialState)
  })

  it('updates user preferences partially', () => {
    const { updatePreferences } = useAppStore.getState()

    updatePreferences({ compactMode: true })
    expect(useAppStore.getState().preferences.compactMode).toBe(true)
    expect(useAppStore.getState().preferences.viewMode).toBe('teacher')  // Unchanged

    updatePreferences({ viewMode: 'student' })
    expect(useAppStore.getState().preferences.viewMode).toBe('student')
    expect(useAppStore.getState().preferences.compactMode).toBe(true)  // Still true
  })

  it('handles authentication flow', () => {
    const { login, logout } = useAppStore.getState()

    // Login
    login('user-123', 'Frank Smith', 'frank@example.com')
    let state = useAppStore.getState()
    expect(state.auth.isAuthenticated).toBe(true)
    expect(state.auth.userId).toBe('user-123')
    expect(state.auth.userName).toBe('Frank Smith')

    // Logout
    logout()
    state = useAppStore.getState()
    expect(state.auth.isAuthenticated).toBe(false)
    expect(state.auth.userId).toBeNull()
  })
})
```

**Acceptance Criteria**:
- ✅ State management library selected and configured (Zustand)
- ✅ Abstraction layer created for UI state, user preferences, future auth
- ✅ LocalStorage wrapper implemented with versioning and migration support
- ✅ State hooks/selectors created for components
- ✅ No direct localStorage access in components
- ✅ Documentation for adding new state slices

---

### Story 4.4: Create Component Props for View Mode Support (2 points)

**Goal**: Update components to accept viewMode parameter enabling future student view without rewriting components.

#### 3.4.1 View Mode Type Definition

```typescript
// types/view-mode.ts

/**
 * View Mode System
 *
 * Determines content visibility based on audience tags
 * - teacher: Shows all content (default MVP behavior)
 * - student: Hides teacher-only content (Phase 3 feature)
 */

export type ViewMode = 'teacher' | 'student'

/**
 * Filter sections based on view mode and audience tags
 */
export function shouldShowSection(
  audience: 'teacher' | 'student' | 'both',
  viewMode: ViewMode
): boolean {
  if (viewMode === 'teacher') {
    return true  // Teachers see everything
  }

  if (viewMode === 'student') {
    return audience !== 'teacher'  // Students don't see teacher-only content
  }

  return true  // Default: show
}

/**
 * React Context for view mode (avoids prop drilling)
 */
import { createContext, useContext } from 'react'

export const ViewModeContext = createContext<ViewMode>('teacher')

export function useViewMode(): ViewMode {
  return useContext(ViewModeContext)
}
```

#### 3.4.2 Component Updates with ViewMode Props

```typescript
// components/lesson/LessonDetail.tsx (Updated)

import { ViewMode } from '@/types/view-mode'
import { ModularLesson } from '@/types/lesson'
import SectionRenderer from './SectionRenderer'

interface LessonDetailProps {
  lesson: ModularLesson
  viewMode: ViewMode  // NEW: View mode parameter
  className?: string
}

/**
 * Main Lesson Display Component
 *
 * Renders all lesson sections, filtering by viewMode
 * MVP: Always receives viewMode="teacher"
 * Phase 3: Can receive viewMode="student" for student view
 */
export default function LessonDetail({
  lesson,
  viewMode,
  className = ''
}: LessonDetailProps) {
  // Filter sections based on view mode
  const visibleSections = lesson.sections.filter(section => {
    if (viewMode === 'teacher') {
      return true  // Teachers see all sections
    }
    if (viewMode === 'student') {
      return section.audience !== 'teacher'  // Hide teacher-only sections
    }
    return true
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Lesson header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-dark-text-primary mb-2">
          {lesson.title}
        </h1>
        <div className="flex gap-3 text-sm text-dark-text-tertiary">
          <span>{lesson.discipline}</span>
          <span>•</span>
          <span>Unit {lesson.unit}</span>
          <span>•</span>
          <span>Lesson {lesson.lessonNumber}</span>
        </div>
      </header>

      {/* Render visible sections in order */}
      {visibleSections
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <SectionRenderer
            key={section.id}
            section={section}
            viewMode={viewMode}
          />
        ))}

      {/* Show message if no sections visible (shouldn't happen) */}
      {visibleSections.length === 0 && (
        <div className="text-center py-12 text-dark-text-tertiary">
          No content available for this view mode.
        </div>
      )}
    </div>
  )
}
```

```typescript
// components/lesson/SectionRenderer.tsx (Updated from Story 4.1)

import { ViewMode, shouldShowSection } from '@/types/view-mode'
import { LessonSection } from '@/types/lesson'
// ... component imports

interface SectionRendererProps {
  section: LessonSection
  viewMode: ViewMode  // NEW: Required viewMode prop
  className?: string
}

/**
 * Universal Section Renderer
 *
 * Renders any lesson section based on type
 * Respects audience tags and view mode for visibility
 */
export default function SectionRenderer({
  section,
  viewMode,
  className = ''
}: SectionRendererProps) {
  // Check if section should be visible
  if (!shouldShowSection(section.audience, viewMode)) {
    return null
  }

  // Optional sections can be hidden by user preference (future)
  // For now, always show optional sections

  // Render based on section type
  switch (section.content.type) {
    case 'objectives':
      return (
        <LearningObjectives
          objectives={section.content.data.objectives}
          viewMode={viewMode}  // Pass down for nested filtering
          className={className}
        />
      )

    // ... other cases
  }
}
```

```typescript
// components/lesson/TeachingNotes.tsx (New Component)

import { ViewMode } from '@/types/view-mode'
import { Lightbulb, AlertTriangle, Target } from 'lucide-react'

interface TeachingNotesProps {
  topic: string
  content: string
  importance: 'critical' | 'important' | 'helpful'
  tags?: string[]
  viewMode: ViewMode  // NEW: ViewMode prop
  className?: string
}

/**
 * Teaching Notes Component
 *
 * Teacher-only guidance and strategies
 * Should NEVER be visible in student view (enforced by parent filtering)
 */
export default function TeachingNotes({
  topic,
  content,
  importance,
  tags,
  viewMode,
  className = ''
}: TeachingNotesProps) {
  // Double-check: These should never render in student view
  if (viewMode === 'student') {
    console.warn('TeachingNotes should not render in student view')
    return null
  }

  // Icon based on importance
  const Icon = importance === 'critical'
    ? AlertTriangle
    : importance === 'important'
    ? Target
    : Lightbulb

  const borderColor = importance === 'critical'
    ? 'border-red-500'
    : importance === 'important'
    ? 'border-orange-400'
    : 'border-blue-400'

  return (
    <section
      className={`bg-dark-bg-secondary rounded-lg p-6 border-l-4 ${borderColor} ${className}`}
      aria-labelledby={`notes-${topic.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon
          className={`h-5 w-5 ${
            importance === 'critical'
              ? 'text-red-400'
              : importance === 'important'
              ? 'text-orange-400'
              : 'text-blue-400'
          }`}
          aria-hidden="true"
        />
        <h3
          id={`notes-${topic.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-lg font-semibold text-dark-text-primary"
        >
          {topic}
        </h3>
        {importance === 'critical' && (
          <span className="ml-auto text-xs font-semibold px-2 py-1 bg-red-500/20 text-red-400 rounded">
            CRITICAL
          </span>
        )}
      </div>

      <div className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-dark-bg-tertiary text-dark-text-tertiary rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
```

#### 3.4.3 View Mode Context Provider

```typescript
// app/layout.tsx (Updated)

import { ViewModeContext } from '@/types/view-mode'
import { useAppStore, selectViewMode } from '@/lib/store/use-app-store'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Get view mode from state (defaults to 'teacher' in MVP)
  const viewMode = useAppStore(selectViewMode)

  return (
    <html lang="en">
      <body>
        {/* Provide view mode to all components */}
        <ViewModeContext.Provider value={viewMode}>
          <Navigation />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </ViewModeContext.Provider>
      </body>
    </html>
  )
}
```

#### 3.4.4 Testing Strategy

```typescript
// __tests__/view-mode.test.tsx

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { shouldShowSection } from '@/types/view-mode'
import LessonDetail from '@/components/lesson/LessonDetail'
import type { ModularLesson } from '@/types/lesson'

describe('View Mode Filtering', () => {
  it('teacher view shows all sections', () => {
    expect(shouldShowSection('teacher', 'teacher')).toBe(true)
    expect(shouldShowSection('student', 'teacher')).toBe(true)
    expect(shouldShowSection('both', 'teacher')).toBe(true)
  })

  it('student view hides teacher-only sections', () => {
    expect(shouldShowSection('teacher', 'student')).toBe(false)
    expect(shouldShowSection('student', 'student')).toBe(true)
    expect(shouldShowSection('both', 'student')).toBe(true)
  })

  it('LessonDetail filters sections by view mode', () => {
    const mockLesson: ModularLesson = {
      id: 'test-8.1.1',
      title: 'Test Lesson',
      discipline: 'life-science',
      unit: '8.1',
      lessonNumber: '8.1.1',
      sections: [
        {
          id: 'obj-1',
          type: 'objectives',
          order: 0,
          audience: 'both',
          optional: false,
          content: {
            type: 'objectives',
            data: { objectives: [{ id: '1', text: 'Objective 1' }] }
          }
        },
        {
          id: 'notes-1',
          type: 'teaching-notes',
          order: 1,
          audience: 'teacher',
          optional: false,
          content: {
            type: 'teaching-notes',
            data: {
              topic: 'Teaching Strategy',
              content: 'Teacher guidance here',
              importance: 'important' as const
            }
          }
        }
      ],
      metadata: {
        schemaVersion: '2.0.0',
        customized: false
      },
      version: '2.0.0'
    }

    // Teacher view: Should see both sections
    const { rerender } = render(
      <LessonDetail lesson={mockLesson} viewMode="teacher" />
    )
    expect(screen.getByText('Objective 1')).toBeInTheDocument()
    expect(screen.getByText('Teaching Strategy')).toBeInTheDocument()

    // Student view: Should only see objectives
    rerender(<LessonDetail lesson={mockLesson} viewMode="student" />)
    expect(screen.getByText('Objective 1')).toBeInTheDocument()
    expect(screen.queryByText('Teaching Strategy')).not.toBeInTheDocument()
  })

  it('TeachingNotes never render in student view', () => {
    const { container } = render(
      <TeachingNotes
        topic="Test Notes"
        content="Content here"
        importance="important"
        viewMode="student"
      />
    )

    expect(container.firstChild).toBeNull()
  })
})
```

**Acceptance Criteria**:
- ✅ Core components accept `viewMode` prop
- ✅ Components filter content based on viewMode and audience tags
- ✅ No visual changes in MVP (always uses "teacher" view)
- ✅ Props documented with TypeScript types
- ✅ Component tests include both view modes
- ✅ ViewMode context available to prevent prop drilling

---

### Story 4.5: Design Authentication-Ready Routing Structure (2 points)

**Goal**: Establish routing architecture supporting protected routes for Phase 2 authentication.

#### 3.5.1 Route Structure Planning

```typescript
// docs/architecture/routing-structure.md

# Authentication-Ready Routing Structure

## Route Categories

### Public Routes (No Auth Required)
- `/` - Home page
- `/about` - About OpenSciEd curriculum
- `/browse` - Browse disciplines (Phase 3: public lesson discovery)
- `/browse/[discipline]` - Browse units within discipline
- Future: `/lessons/[id]/preview` - Public lesson preview (read-only)

### Protected Routes (Auth Required - Phase 2)
- `/browse/[discipline]/[unit]/[lesson]` - Full lesson access
- `/dashboard` - Teacher dashboard with recent lessons
- `/custom-lessons` - Custom lesson builder interface
- `/custom-lessons/[id]` - Edit custom lesson
- `/notes` - Personal teaching notes and reflections
- `/notes/[lessonId]` - Notes for specific lesson

### Auth Routes (Public - Phase 2)
- `/login` - Sign in page
- `/register` - Sign up page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset with token

### Admin Routes (Admin Only - Future)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/content` - Content management

## MVP Behavior (Phase 1)
- All routes are public (no authentication)
- Protected route wrappers exist but always allow access
- Auth routes (/login, /register) not yet implemented

## Phase 2 Behavior
- Protected routes require authentication
- Unauthenticated users redirect to /login
- After login, redirect to originally requested page
- Session persistence via JWT or session cookies

## Phase 3 Behavior
- Public preview mode for lesson discovery
- Protected full access for detailed lesson planning
- Student-specific routes for assignments
```

#### 3.5.2 Protected Route Component

```typescript
// components/auth/ProtectedRoute.tsx

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore, selectIsAuthenticated } from '@/lib/store/use-app-store'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * Protected Route Wrapper
 *
 * MVP Behavior: Always allows access (auth not implemented)
 * Phase 2 Behavior: Redirects to login if not authenticated
 *
 * Usage:
 * ```tsx
 * export default function LessonPage() {
 *   return (
 *     <ProtectedRoute>
 *       <LessonContent />
 *     </ProtectedRoute>
 *   )
 * }
 * ```
 */
export default function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAppStore(selectIsAuthenticated)

  // MVP: Skip authentication check
  const MVP_MODE = true  // Set to false in Phase 2

  useEffect(() => {
    if (MVP_MODE) {
      return  // Skip auth check in MVP
    }

    // Phase 2: Redirect if not authenticated
    if (!isAuthenticated) {
      // Store intended destination for post-login redirect
      const returnUrl = encodeURIComponent(pathname)
      router.push(`${redirectTo}?returnUrl=${returnUrl}`)
    }
  }, [isAuthenticated, router, pathname, redirectTo, MVP_MODE])

  // MVP: Always render children
  if (MVP_MODE) {
    return <>{children}</>
  }

  // Phase 2: Show loading state while checking auth
  if (!isAuthenticated) {
    return (
      fallback ?? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-dark-accent-blue" />
        </div>
      )
    )
  }

  return <>{children}</>
}
```

#### 3.5.3 Auth Hook for Components

```typescript
// hooks/use-auth.ts

import { useAppStore, selectIsAuthenticated } from '@/lib/store/use-app-store'

/**
 * Authentication Hook
 *
 * MVP Behavior: Always returns mock authenticated user
 * Phase 2 Behavior: Returns actual auth state from store
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useAuth()
 *
 * if (!isAuthenticated) {
 *   return <LoginPrompt />
 * }
 *
 * return <div>Welcome, {user.name}!</div>
 * ```
 */
export function useAuth() {
  const isAuthenticated = useAppStore(selectIsAuthenticated)
  const auth = useAppStore(state => state.auth)
  const login = useAppStore(state => state.login)
  const logout = useAppStore(state => state.logout)

  // MVP: Mock authentication
  const MVP_MODE = true  // Set to false in Phase 2

  if (MVP_MODE) {
    return {
      isAuthenticated: true,  // Always authenticated in MVP
      user: {
        id: 'mvp-user',
        name: 'Frank',
        email: 'frank@example.com'
      },
      login: async (email: string, password: string) => {
        console.log('MVP: Login not implemented yet')
        return true
      },
      logout: async () => {
        console.log('MVP: Logout not implemented yet')
      }
    }
  }

  // Phase 2: Actual authentication
  return {
    isAuthenticated,
    user: isAuthenticated ? {
      id: auth.userId!,
      name: auth.userName!,
      email: auth.userEmail!
    } : null,
    login: async (email: string, password: string) => {
      // TODO Phase 2: Implement actual login API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password })
      // })
      // const { userId, userName, userEmail } = await response.json()
      // login(userId, userName, userEmail)
      throw new Error('Login not yet implemented')
    },
    logout: async () => {
      // TODO Phase 2: Implement actual logout API call
      // await fetch('/api/auth/logout', { method: 'POST' })
      logout()
    }
  }
}
```

#### 3.5.4 Next.js Middleware (Future Phase 2)

```typescript
// middleware.ts (Created but not active in MVP)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware for Route Protection
 *
 * MVP: This file exists but doesn't enforce anything
 * Phase 2: Uncomment to enable route protection
 *
 * Note: Keep this file in source control to demonstrate
 * architecture planning, but it won't execute in MVP
 */

const MVP_MODE = true  // Set to false in Phase 2

// Routes that require authentication
const protectedRoutes = [
  '/browse',  // All lesson access
  '/dashboard',
  '/custom-lessons',
  '/notes'
]

// Routes that redirect away if already authenticated
const authRoutes = [
  '/login',
  '/register'
]

export function middleware(request: NextRequest) {
  if (MVP_MODE) {
    return NextResponse.next()  // Skip all auth checks in MVP
  }

  // Phase 2: Actual middleware logic
  const { pathname } = request.nextUrl

  // Check if user is authenticated (read from cookie or session)
  const isAuthenticated = checkAuthCookie(request)

  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

function checkAuthCookie(request: NextRequest): boolean {
  // TODO Phase 2: Implement actual auth check
  // const token = request.cookies.get('auth-token')
  // return !!token && validateToken(token)
  return false
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
```

#### 3.5.5 Documentation for Phase 2 Implementation

```markdown
# Phase 2 Authentication Implementation Guide

## Prerequisites
1. Choose authentication provider:
   - **NextAuth.js** (Recommended): Flexible, supports multiple providers
   - **Clerk**: Managed service, fastest setup
   - **Supabase Auth**: Good if using Supabase for database
   - **Auth0**: Enterprise-grade, comprehensive

2. Database setup:
   - User table schema
   - Session storage (if not using JWT-only)
   - Email verification status

## Implementation Steps

### Step 1: Install Dependencies
```bash
# For NextAuth.js
pnpm add next-auth @auth/prisma-adapter

# For Clerk
pnpm add @clerk/nextjs
```

### Step 2: Update Environment Variables
```env
# NextAuth.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Email provider (e.g., SendGrid)
EMAIL_SERVER=smtp://username:password@smtp.sendgrid.net:587
EMAIL_FROM=noreply@yourdomain.com

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### Step 3: Enable Auth Components
```typescript
// components/auth/ProtectedRoute.tsx
const MVP_MODE = false  // Change from true

// hooks/use-auth.ts
const MVP_MODE = false  // Change from true

// middleware.ts
const MVP_MODE = false  // Change from true
```

### Step 4: Implement Auth API Routes
Create `/app/api/auth/[...nextauth]/route.ts` or equivalent for your provider.

### Step 5: Update State Management
Remove mock auth from `useAuth()`, connect to real auth provider.

### Step 6: Test Authentication Flow
1. Login with valid credentials → should access protected routes
2. Login with invalid credentials → should show error
3. Logout → should redirect to login when accessing protected route
4. Direct URL access when not logged in → should redirect to login with returnUrl
5. Login → should redirect to returnUrl after successful authentication

## Security Checklist
- [ ] HTTPS enabled in production
- [ ] Secure session cookies (httpOnly, secure, sameSite)
- [ ] JWT secret rotated regularly
- [ ] Password requirements enforced (min length, complexity)
- [ ] Rate limiting on login endpoint
- [ ] Email verification required
- [ ] Password reset flow implemented securely
- [ ] CSRF protection enabled
```

**Acceptance Criteria**:
- ✅ Route structure defined for public/protected/auth routes
- ✅ ProtectedRoute wrapper component created
- ✅ useAuth hook for checking authentication
- ✅ MVP: All routes public (no actual protection)
- ✅ Auth state management pattern defined
- ✅ Redirect logic planned for unauthenticated users
- ✅ Documentation for adding auth in Phase 2

---

### Story 4.6: Document Architecture Decisions and Extension Patterns (3 points)

**Goal**: Create comprehensive documentation enabling confident future development without breaking existing systems.

#### 3.6.1 Architecture Decision Records (ADRs)

```markdown
# ADR 001: Modular Lesson Data Schema

**Date**: 2025-10-14
**Status**: Accepted
**Deciders**: Frank

## Context
The initial lesson data schema used a flat structure with fixed fields (objectives, materials, sequence, etc.). This works for MVP but creates problems for future features:
- Custom lesson builder cannot cherry-pick sections
- Cannot add new section types without schema changes
- Difficult to reorder or hide sections
- No clear separation of teacher vs. student content

## Decision
Restructure lesson data to use modular sections where each section is an independent, reorderable unit with:
- Unique ID for referencing
- Type identifier for rendering
- Order number for sequencing
- Audience tag for visibility control
- Optional flag for user customization
- Type-specific content payload

## Consequences

**Positive**:
- ✅ Custom lesson builder can be implemented without schema changes
- ✅ New section types can be added easily
- ✅ Sections can be reordered or hidden without data migration
- ✅ Clear separation of teacher/student content
- ✅ Each section is independently renderable

**Negative**:
- ❌ More complex data structure (requires migration script)
- ❌ More complex rendering logic (need universal section renderer)
- ❌ Increased JSON file size (more metadata per section)

**Mitigation**:
- Migration script handles complexity of transforming existing data
- SectionRenderer component abstracts rendering complexity
- JSON size increase is acceptable for static generation

## Alternatives Considered

**Alternative 1**: Keep flat schema, add "custom sections" array
- Rejected: Doesn't solve ordering or filtering problems

**Alternative 2**: Completely dynamic schema (JSON-LD or RDF)
- Rejected: Too complex for MVP needs, harder to type-check

**Alternative 3**: Separate files per section
- Rejected: File management overhead, harder to keep sections together
```

```markdown
# ADR 002: Zustand for State Management

**Date**: 2025-10-14
**Status**: Accepted
**Deciders**: Frank

## Context
Need state management solution for:
- UI state (sidebar open, modals)
- User preferences (last viewed lesson, settings)
- Future: Authentication state
- Future: User-specific data (notes, custom lessons)

Requirements:
- TypeScript support
- localStorage persistence
- DevTools integration
- Minimal boilerplate
- Good performance

## Decision
Use Zustand for state management abstraction layer.

## Consequences

**Positive**:
- ✅ Simple API, minimal boilerplate
- ✅ Excellent TypeScript support
- ✅ Built-in middleware for persistence and devtools
- ✅ No Provider wrapper needed
- ✅ Good performance (subscription-based)
- ✅ Easy to split state into slices

**Negative**:
- ❌ Additional dependency (5.5KB gzipped)
- ❌ Less ecosystem than Redux

**Mitigation**:
- Small bundle size impact acceptable
- Can migrate to Redux if needed (Zustand API is similar)

## Alternatives Considered

**Alternative 1**: React Context + useReducer
- Pros: No dependencies, built-in
- Cons: More boilerplate, Provider complexity, harder to split state
- Rejected: Developer experience inferior

**Alternative 2**: Redux Toolkit
- Pros: Large ecosystem, well-established patterns
- Cons: More boilerplate, overkill for current needs
- Rejected: Too complex for MVP scope

**Alternative 3**: Jotai
- Pros: Atoms approach, very granular
- Cons: Different mental model, less straightforward
- Rejected: Prefer Zustand's simplicity
```

```markdown
# ADR 003: Next.js 15 App Router with Static Generation

**Date**: 2025-10-14
**Status**: Accepted
**Deciders**: Frank

## Context
Need to choose frontend framework and deployment strategy for MVP.

Requirements:
- Fast page loads (teacher planning time is precious)
- Free deployment (MVP budget constraint)
- Dark mode support
- Responsive design
- Future: Add authentication without major refactor
- Future: Server-side features if needed

## Decision
Use Next.js 15 with App Router, fully static generation (SSG) for MVP.

## Consequences

**Positive**:
- ✅ Zero backend infrastructure (free deployment)
- ✅ Instant page loads (pre-rendered at build time)
- ✅ Built-in routing, code splitting, optimization
- ✅ Can add server-side features in Phase 2 without rewrite
- ✅ Excellent TypeScript support
- ✅ Large ecosystem and community

**Negative**:
- ❌ Need rebuild to update content (acceptable for MVP)
- ❌ Learning curve for App Router (relatively new)

**Mitigation**:
- Content updates infrequent enough for rebuild workflow
- App Router is future of Next.js, worth learning

## Alternatives Considered

**Alternative 1**: Vite + React Router
- Pros: Faster build times, simpler mental model
- Cons: More setup, no built-in SSG, harder to add server features later
- Rejected: Next.js provides more future flexibility

**Alternative 2**: Astro
- Pros: Excellent static generation, multi-framework support
- Cons: Smaller ecosystem, less corporate backing
- Rejected: React ecosystem familiarity more valuable

**Alternative 3**: Plain HTML/CSS/JS
- Pros: No dependencies, maximum performance
- Cons: No component model, no state management, harder to maintain
- Rejected: Too primitive for planned feature expansion
```

#### 3.6.2 Extension Guides

```markdown
# Extension Guide: Adding New Lesson Section Types

## Overview
The modular lesson schema makes it easy to add new section types without migrating existing data.

## Step-by-Step Process

### 1. Define Section Type

Add new type to `types/lesson.ts`:

```typescript
export type SectionType =
  | 'objectives'
  | 'materials'
  | 'phase'
  | 'teaching-notes'
  | 'assessment-guidance'
  | 'resources'
  | 'vocabulary'  // NEW TYPE
  | 'custom'

export interface VocabularyContent {
  terms: {
    term: string
    definition: string
    example?: string
    imageUrl?: string
  }[]
  notes?: string
}

export type SectionContent =
  | { type: 'objectives'; data: ObjectivesContent }
  // ... existing types
  | { type: 'vocabulary'; data: VocabularyContent }  // NEW
```

### 2. Create Component

Create `components/lesson/VocabularyList.tsx`:

```typescript
import { VocabularyContent } from '@/types/lesson'
import { BookOpen } from 'lucide-react'

interface VocabularyListProps {
  vocabulary: VocabularyContent
  viewMode: 'teacher' | 'student'
  className?: string
}

export default function VocabularyList({
  vocabulary,
  viewMode,
  className = ''
}: VocabularyListProps) {
  return (
    <section className={`bg-dark-bg-secondary rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-6 w-6 text-dark-accent-purple" />
        <h2 className="text-xl font-semibold text-dark-text-primary">
          Key Vocabulary
        </h2>
      </div>

      <dl className="space-y-4">
        {vocabulary.terms.map((term, index) => (
          <div key={index} className="border-l-2 border-dark-accent-purple pl-4">
            <dt className="text-lg font-semibold text-dark-text-primary mb-1">
              {term.term}
            </dt>
            <dd className="text-dark-text-secondary">
              {term.definition}
            </dd>
            {term.example && (
              <dd className="text-sm text-dark-text-tertiary mt-1 italic">
                Example: {term.example}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  )
}
```

### 3. Update SectionRenderer

Add case to `components/lesson/SectionRenderer.tsx`:

```typescript
export default function SectionRenderer({
  section,
  viewMode,
  className = ''
}: SectionRendererProps) {
  switch (section.content.type) {
    // ... existing cases

    case 'vocabulary':
      return (
        <VocabularyList
          vocabulary={section.content.data}
          viewMode={viewMode}
          className={className}
        />
      )

    default:
      console.warn('Unknown section type:', section.content)
      return null
  }
}
```

### 4. Update Data Files

Add vocabulary sections to lesson JSON:

```json
{
  "sections": [
    {
      "id": "8.1.1-vocabulary-0",
      "type": "vocabulary",
      "order": 1,
      "audience": "both",
      "optional": true,
      "content": {
        "type": "vocabulary",
        "data": {
          "terms": [
            {
              "term": "Heredity",
              "definition": "The passing of traits from parents to offspring",
              "example": "Eye color is an example of heredity"
            }
          ]
        }
      }
    }
  ]
}
```

### 5. Write Tests

Create `__tests__/vocabulary-section.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import VocabularyList from '@/components/lesson/VocabularyList'

describe('VocabularyList', () => {
  it('renders vocabulary terms', () => {
    const vocabulary = {
      terms: [
        {
          term: 'Heredity',
          definition: 'Passing traits from parents to offspring'
        }
      ]
    }

    render(<VocabularyList vocabulary={vocabulary} viewMode="teacher" />)

    expect(screen.getByText('Heredity')).toBeInTheDocument()
    expect(screen.getByText(/Passing traits/)).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Audience Tagging**: Consider whether new section should be teacher-only, student-only, or both
2. **Optional Flag**: Decide if section should be required or optional in custom lessons
3. **Type Safety**: Always use TypeScript interfaces for content structure
4. **Accessibility**: Include proper ARIA labels and semantic HTML
5. **Responsive Design**: Test on mobile, tablet, and desktop
6. **Dark Mode**: Use dark mode color tokens from Tailwind config
```

```markdown
# Extension Guide: Implementing Custom Lesson Builder (Phase 2)

## Overview
The modular lesson schema enables custom lesson builder feature where teachers can:
- Cherry-pick sections from multiple lessons
- Reorder sections within a lesson
- Hide optional sections
- Add custom notes and materials

## Architecture

### Data Model

Custom lessons reference sections from source lessons:

```typescript
interface CustomLesson {
  id: string
  title: string
  createdBy: string  // userId
  createdAt: string
  modifiedAt: string
  basedOn?: string[]  // Source lesson IDs
  sections: CustomLessonSection[]
}

interface CustomLessonSection {
  id: string  // New ID for custom lesson
  sourceId?: string  // Original section ID (if from source lesson)
  type: SectionType
  order: number
  audience: AudienceTag
  optional: boolean
  content: SectionContent
  customizations?: {
    notes?: string  // Teacher's custom notes on this section
    modifications?: string  // What was changed from original
  }
}
```

### UI Components

```typescript
// components/custom-lessons/LessonBuilder.tsx
export default function LessonBuilder({ baseLessonId }: { baseLessonId?: string }) {
  // 1. Load base lesson (if starting from existing)
  // 2. Display section picker (drag-and-drop interface)
  // 3. Allow reordering sections
  // 4. Allow hiding optional sections
  // 5. Allow adding custom sections
  // 6. Save custom lesson to state management (later: backend)
}

// components/custom-lessons/SectionPicker.tsx
export default function SectionPicker({ onAddSection }: { onAddSection: (section) => void }) {
  // Browse available sections from multiple lessons
  // Search and filter by type, discipline, unit
  // Drag sections to add to custom lesson
}
```

### State Management

Add to `lib/store/use-app-store.ts`:

```typescript
interface CustomLessonsState {
  customLessons: CustomLesson[]
  currentEditingLesson: string | null
}

interface CustomLessonsActions {
  createCustomLesson: (title: string, basedOn?: string[]) => string
  addSectionToLesson: (lessonId: string, section: CustomLessonSection) => void
  removeSectionFromLesson: (lessonId: string, sectionId: string) => void
  reorderSections: (lessonId: string, newOrder: string[]) => void
  saveCustomLesson: (lessonId: string) => Promise<void>
  deleteCustomLesson: (lessonId: string) => Promise<void>
}
```

### Implementation Steps

1. **Phase 2A**: Build UI for custom lesson creation (client-side only)
2. **Phase 2B**: Add backend storage for custom lessons (requires auth)
3. **Phase 2C**: Add sharing custom lessons between users
4. **Phase 2D**: Add lesson templates and starter packs

## Security Considerations

- Custom lessons are user-specific (require authentication)
- Validate that referenced section IDs exist
- Prevent XSS in custom notes (sanitize user input)
- Rate limit lesson creation to prevent abuse

## Testing Strategy

```typescript
describe('Custom Lesson Builder', () => {
  it('creates new custom lesson', () => {
    // Test lesson creation
  })

  it('adds sections from source lessons', () => {
    // Test section addition
  })

  it('reorders sections', () => {
    // Test drag-and-drop reordering
  })

  it('saves and loads custom lessons', () => {
    // Test persistence
  })
})
```
```

```markdown
# Extension Guide: Adding Student-Facing View (Phase 3)

## Overview
The audience tagging system and view mode props enable student-facing interface where students see:
- Learning objectives (WALTs)
- Materials needed
- Lesson activities
- Resources and links
- **NOT**: Teacher guidance, answer keys, assessment strategies

## Architecture Changes

### Routing
Add student routes to `middleware.ts`:

```typescript
const studentRoutes = [
  '/student',  // Student dashboard
  '/student/lessons',  // Assigned lessons
  '/student/lessons/[id]'  // Individual lesson view
]
```

### Authentication
Students need separate authentication:

```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'teacher' | 'student' | 'admin'
  // For students:
  teacherId?: string  // Assigned teacher
  grade?: number
  classIds?: string[]
}
```

### View Mode Toggle
Teachers can preview student view:

```typescript
// components/layout/ViewModeToggle.tsx
export default function ViewModeToggle() {
  const viewMode = useAppStore(state => state.preferences.viewMode)
  const updatePreferences = useAppStore(state => state.updatePreferences)

  return (
    <button
      onClick={() => {
        const newMode = viewMode === 'teacher' ? 'student' : 'teacher'
        updatePreferences({ viewMode: newMode })
      }}
      className="px-3 py-2 rounded bg-dark-bg-tertiary"
    >
      {viewMode === 'teacher' ? 'Preview Student View' : 'Back to Teacher View'}
    </button>
  )
}
```

### Student Dashboard

```typescript
// app/student/dashboard/page.tsx
export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>

      {/* Today's assignments */}
      <section>
        <h2>Today's Lessons</h2>
        <AssignedLessonsList date={new Date()} />
      </section>

      {/* Upcoming assignments */}
      <section>
        <h2>This Week</h2>
        <WeeklySchedule />
      </section>

      {/* Progress tracking */}
      <section>
        <h2>Your Progress</h2>
        <ProgressSummary studentId={user.id} />
      </section>
    </div>
  )
}
```

## Implementation Steps

1. **Phase 3A**: Build student UI with filtered content (use existing viewMode prop)
2. **Phase 3B**: Add student authentication and registration
3. **Phase 3C**: Build teacher assignment interface
4. **Phase 3D**: Add progress tracking and completion status
5. **Phase 3E**: Add parent access (read-only student view)

## Testing

```typescript
describe('Student View', () => {
  it('hides teacher-only sections', () => {
    // Test section filtering
  })

  it('shows objectives and materials', () => {
    // Test student-visible content
  })

  it('prevents access to teacher routes', () => {
    // Test route protection
  })
})
```

## Privacy Considerations

- Students cannot access other students' data
- Teachers can only see their assigned students
- Parents can only see their children's data
- Admin oversight for compliance (FERPA/COPPA)
```

#### 3.6.3 Component Architecture Diagram

```
# Component Architecture

## Page Components (Next.js App Router)

```
app/
├── layout.tsx                    # Root layout with ViewModeContext
├── page.tsx                      # Home page
├── browse/
│   ├── page.tsx                  # Browse disciplines
│   ├── [discipline]/
│   │   ├── page.tsx              # Browse units
│   │   └── [unit]/
│   │       ├── page.tsx          # Browse lessons
│   │       └── [lesson]/
│   │           └── page.tsx      # Lesson detail (uses LessonDetail component)
└── dashboard/
    └── page.tsx                  # Teacher dashboard (future)
```

## Core Components

```
components/
├── layout/
│   ├── Navigation.tsx            # Main navigation header
│   ├── Sidebar.tsx               # Hierarchical lesson browser
│   └── Breadcrumbs.tsx           # Current location indicator
│
├── lesson/
│   ├── LessonDetail.tsx          # Main lesson container (filters sections by viewMode)
│   ├── SectionRenderer.tsx       # Universal section renderer (delegates to specific components)
│   │
│   ├── LearningObjectives.tsx    # WALTs display
│   ├── MaterialsList.tsx         # Materials and supplies
│   ├── LessonPhase.tsx           # Individual phase (engage, explore, etc.)
│   ├── TeachingNotes.tsx         # Teacher-only guidance
│   ├── AssessmentGuidance.tsx    # Assessment strategies
│   ├── ResourceLinks.tsx         # External resources
│   └── VocabularyList.tsx        # Vocabulary terms (future)
│
├── auth/
│   ├── ProtectedRoute.tsx        # Route protection wrapper (MVP: always allows)
│   ├── LoginForm.tsx             # Login UI (future Phase 2)
│   └── RegisterForm.tsx          # Registration UI (future Phase 2)
│
└── ui/
    ├── Button.tsx                # Reusable button
    ├── Card.tsx                  # Reusable card
    ├── Modal.tsx                 # Reusable modal
    └── ...                       # Other UI primitives
```

## Data Flow

```
[JSON Files]
     ↓
[getLessonData()] ← lib/data.ts
     ↓
[LessonPage] ← app/browse/[...]/page.tsx
     ↓
[LessonDetail] ← components/lesson/LessonDetail.tsx
     ↓
[filters sections by viewMode]
     ↓
[SectionRenderer] (for each visible section)
     ↓
[Specific Component] (LearningObjectives, MaterialsList, etc.)
     ↓
[Rendered UI]
```

## State Management

```
[Zustand Store] ← lib/store/use-app-store.ts
     │
     ├── Navigation State
     │   ├── currentDiscipline
     │   ├── currentUnit
     │   └── currentLesson
     │
     ├── User Preferences (persisted to localStorage)
     │   ├── lastViewedLesson
     │   ├── viewMode (teacher | student)
     │   ├── compactMode
     │   └── showOptionalSections
     │
     ├── UI State
     │   ├── sidebarOpen
     │   ├── searchModalOpen
     │   └── feedbackModalOpen
     │
     └── Auth State (future Phase 2)
         ├── isAuthenticated
         ├── userId
         └── userName
```

## Context Providers

```
[App Root]
    ↓
[ViewModeContext.Provider] ← value from useAppStore
    ↓
[All Components] ← can access viewMode via useViewMode()
```
```

**Acceptance Criteria**:
- ✅ ADRs created for data schema, state management, routing, authentication
- ✅ Extension guides written for new section types, custom lesson builder, student view
- ✅ Data schema documented with TypeScript interfaces and examples
- ✅ Component architecture diagram created
- ✅ Future roadmap documented (Phase 2 and 3 plans)
- ✅ Documentation stored in `/docs` directory

---

## 4. Testing Strategy

### 4.1 Unit Tests

```typescript
// Test modular schema migration
describe('Schema Migration', () => {
  it('migrates legacy lessons to modular format')
  it('maintains data integrity during migration')
  it('assigns correct audience tags by content type')
  it('generates unique section IDs')
  it('maintains sequential order')
})

// Test state management
describe('Zustand Store', () => {
  it('updates navigation state')
  it('records lesson views with timestamps')
  it('persists preferences to localStorage')
  it('migrates localStorage schema versions')
  it('handles authentication state changes')
})

// Test view mode filtering
describe('View Mode', () => {
  it('teacher view shows all sections')
  it('student view hides teacher-only sections')
  it('components respect viewMode prop')
  it('ViewModeContext provides correct value')
})

// Test route protection
describe('Protected Routes', () => {
  it('allows all access in MVP mode')
  it('redirects unauthenticated users in Phase 2 mode')
  it('preserves returnUrl for post-login redirect')
})
```

### 4.2 Integration Tests

```typescript
// Test section rendering pipeline
describe('Section Rendering Integration', () => {
  it('LessonDetail filters and renders sections correctly')
  it('SectionRenderer delegates to correct component')
  it('View mode filtering works end-to-end')
})

// Test state persistence
describe('State Persistence Integration', () => {
  it('preferences saved to localStorage on update')
  it('preferences loaded from localStorage on mount')
  it('schema migration runs on version mismatch')
})
```

### 4.3 Manual Testing Checklist

- [ ] All existing lessons migrate successfully to modular schema
- [ ] No duplicate section IDs in migrated data
- [ ] Section order is sequential (0, 1, 2, ...)
- [ ] Audience tags match content type (teacher-only for guidance)
- [ ] State management persists across page reloads
- [ ] LastViewedLesson updates when viewing lessons
- [ ] ViewMode prop passed to all lesson components
- [ ] Teacher view shows all sections
- [ ] Student view hides teacher-only sections (test by toggling viewMode in store)
- [ ] ProtectedRoute allows access in MVP (MVP_MODE = true)
- [ ] Auth hooks return mock data in MVP
- [ ] ADR documents are clear and complete
- [ ] Extension guides include working code examples

---

## 5. Deployment Checklist

### Pre-Deployment
- [ ] Run schema migration script on all lesson data
- [ ] Validate migrated data with Zod schemas
- [ ] Run all unit and integration tests
- [ ] Build production bundle successfully
- [ ] Lighthouse audit passes (performance ≥90)

### During Deployment
- [ ] Deploy static files to hosting (Netlify/Vercel)
- [ ] Verify all routes accessible
- [ ] Test lesson navigation flow
- [ ] Verify localStorage persistence works

### Post-Deployment
- [ ] Smoke test: View 3-5 different lessons
- [ ] Verify lastViewedLesson updates correctly
- [ ] Test on mobile, tablet, desktop
- [ ] Verify dark mode colors render correctly
- [ ] Check browser console for errors (should be zero)

### MVP-Specific Validation
- [ ] Confirm all routes are public (no login required)
- [ ] Confirm viewMode is always "teacher" in production
- [ ] Confirm ProtectedRoute doesn't block access
- [ ] Confirm useAuth returns mock authenticated user

---

## 6. Dependencies and Prerequisites

### Technical Dependencies
```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "zustand": "5.x",
    "zod": "3.x"
  },
  "devDependencies": {
    "vitest": "2.x",
    "@testing-library/react": "16.x",
    "typescript": "5.x"
  }
}
```

### Data Prerequisites
- Lesson JSON files in legacy schema (Epic 1)
- Sample lessons for testing migration

### Knowledge Prerequisites
- Understanding of TypeScript discriminated unions
- Familiarity with Zustand state management patterns
- Understanding of Next.js App Router concepts

---

## 7. Known Limitations and Future Considerations

### MVP Limitations

**Data Migration**:
- One-time migration script (not incremental)
- Manual verification required for edge cases
- Large datasets may take time to migrate

**State Management**:
- localStorage only (no server-side persistence)
- No cross-device sync in MVP
- User preferences lost if localStorage cleared

**Authentication**:
- No actual authentication in MVP
- All code in place but not enforced
- Phase 2 requires backend setup

### Future Enhancements (Post-MVP)

**Phase 2 Additions**:
- Real authentication with JWT or session cookies
- User accounts and profiles
- Custom lesson builder interface
- Server-side state persistence
- Multi-user collaboration

**Phase 3 Additions**:
- Student-facing view with filtered content
- Assignment system for teachers
- Progress tracking for students
- Parent access (read-only view)

**Long-term Vision**:
- Real-time collaboration on custom lessons
- Lesson sharing marketplace
- Advanced analytics and insights
- Integration with school LMS systems
- Offline mode with service workers

### Technical Debt to Address

**Schema Migration**:
- Migrate all lessons before Epic 1 implementation (do in parallel)
- Consider incremental migration for very large datasets
- Plan for future schema version 3.0 migration path

**Type Safety**:
- Content unions work but can be verbose
- Consider code generation from schema for better DX
- Evaluate GraphQL for type-safe data layer in Phase 2

**Performance**:
- Section filtering happens on every render
- Consider memoization for large lessons (>50 sections)
- Profile state management updates in production

---

## 8. Success Metrics

### Quantitative Metrics

**Migration Success**:
- ✅ 100% of lessons migrate without errors
- ✅ Zero duplicate section IDs
- ✅ Zero missing audience tags
- ✅ Zero invalid section types

**State Management**:
- ✅ localStorage persistence works 100% of time
- ✅ State updates cause <50ms re-renders
- ✅ No memory leaks after 30 minutes of use

**Documentation Quality**:
- ✅ All ADRs follow standard format
- ✅ All extension guides include working code examples
- ✅ All TypeScript interfaces have JSDoc comments

### Qualitative Metrics

**Architecture Quality**:
- ✅ Phase 2 features can be added without refactoring core systems
- ✅ New section types can be added in <1 hour
- ✅ State management is easy to reason about
- ✅ Documentation enables confident development

**Code Quality**:
- ✅ Type safety maintained throughout (no `any` types except SectionContent)
- ✅ All public APIs documented
- ✅ Error handling covers edge cases
- ✅ Tests cover critical paths (>80% coverage)

---

## 9. References

### Internal Documents
- [Solution Architecture](./solution-architecture.md) - Overall technical architecture
- [Epic 1 Tech Spec](./tech-spec-epic-1.md) - Core navigation and data infrastructure
- [Epic 2 Tech Spec](./tech-spec-epic-2.md) - Lesson content display
- [Epic 3 Tech Spec](./tech-spec-epic-3.md) - UX polish and performance

### External Resources
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Zod Schema Validation](https://zod.dev/)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-14
**Next Review**: After Epic 4 implementation completion
