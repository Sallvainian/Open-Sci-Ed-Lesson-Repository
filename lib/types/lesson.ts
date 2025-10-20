// lib/types/lesson.ts

/**
 * Discipline represents one of the three main OpenSciEd science areas
 * (Life Science, Earth & Space Science, Physical Science)
 */
export interface Discipline {
  /** Unique identifier (e.g., "life-science") */
  id: string
  /** Display name (e.g., "Life Science") */
  name: string
  /** URL-friendly slug (e.g., "life-science") */
  slug: string
  /** Brief description for discipline page */
  description: string
  /** Icon identifier for UI */
  iconName: string
  /** Tailwind color class (e.g., "bg-green-600") */
  color: string
  /** Total units in this discipline */
  unitCount: number
}

/**
 * Unit represents a collection of related lessons within a discipline
 * (e.g., Unit 6.1: Genetics and Heredity)
 */
export interface Unit {
  /** Unique identifier (e.g., "6.1") */
  id: string
  /** Unit title (e.g., "Genetics and Heredity") */
  title: string
  /** Parent discipline slug (e.g., "life-science") */
  disciplineSlug: string
  /** Number of lessons in this unit */
  lessonCount: number
  /** Estimated duration (e.g., "3 weeks") */
  estimatedDuration: string
  /** Unit overview */
  description: string
}

/**
 * LessonMaterial represents a single item needed for the lesson
 */
export interface LessonMaterial {
  /** Quantity specification (e.g., "Per Group", "Per Student", "Per Class") */
  quantity: string
  /** Material description (e.g., "250mL beaker") */
  description: string
  /** Optional notes (e.g., "reusable") */
  notes?: string
  /** Target audience for this material - supports FR-12 student-facing views */
  audience?: 'teacher' | 'student' | 'both'
}

/**
 * LessonPhase represents one phase of the 5E instructional model
 * (Engage, Explore, Explain, Elaborate, Evaluate)
 */
export interface LessonPhase {
  /** The 5E phase name */
  phase: 'Engage' | 'Explore' | 'Explain' | 'Elaborate' | 'Evaluate'
  /** Duration in minutes */
  duration: number
  /** Brief activity description */
  description: string
  /** Target audience for this phase - supports FR-12 student-facing views */
  audience?: 'teacher' | 'student' | 'both'
}

/**
 * TeachingGuidance represents teacher-specific instructional notes
 */
export interface TeachingGuidance {
  /** Common student misconceptions */
  misconceptions: string[]
  /** Essential questions to ask */
  keyQuestions: string[]
  /** Optional differentiation strategies */
  differentiationNotes?: string
  /** Target audience - defaults to 'teacher' - supports FR-12 student-facing views */
  audience?: 'teacher' | 'student' | 'both'
}

/**
 * Resource represents a supplementary file or link (PDF, PPT, etc.)
 */
export interface Resource {
  /** Resource type */
  type: 'PDF' | 'PPT' | 'DOC' | 'URL'
  /** Resource title (e.g., "Teacher Guide") */
  title: string
  /** Absolute or relative URL */
  url: string
  /** Target audience for this resource - supports FR-12 student-facing views */
  audience?: 'teacher' | 'student' | 'both'
}

/**
 * Lesson represents a complete lesson with all instructional content
 */
export interface Lesson {
  /** Unique identifier (e.g., "8.1.2") */
  id: string
  /** Lesson title */
  title: string
  /** Parent discipline ID (e.g., "physical-science") */
  disciplineId: string
  /** Parent discipline slug for URL routing (e.g., "physical-science") */
  disciplineSlug: string
  /** Parent unit ID (e.g., "8.1") */
  unitId: string
  /** Unit name for breadcrumbs */
  unitTitle: string
  /** Lesson duration (e.g., "45 minutes") */
  duration: string
  /** NGSS standards alignment (e.g., ["MS-PS1-2"]) */
  standards: string[]
  /** Learning objectives (WALTs - We Are Learning To) */
  objectives: string[]
  /** Required materials list */
  materials: LessonMaterial[]
  /** 5E lesson phases */
  sequence: LessonPhase[]
  /** Teacher-specific instructional guidance */
  teachingGuidance: TeachingGuidance
  /** Supplementary files and resources */
  resources: Resource[]
  /** Target audience for overall lesson - supports FR-12 student-facing views */
  audience?: 'teacher' | 'student' | 'both'
}
