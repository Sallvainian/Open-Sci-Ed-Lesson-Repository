# AI Frontend Generation Prompt - OpenSciEd Lesson Repository

**Generated:** 2025-10-13
**Target Platform:** Web (Next.js/React)
**Design System:** shadcn/ui + Tailwind CSS
**Source:** UX Specification v1.0

---

## Project Overview

Create a comprehensive web application for the **OpenSciEd Lesson Repository** - a platform transforming OpenSciEd middle school science curriculum from unwieldy PDFs into a structured, searchable, easily navigable digital experience.

**Primary User:** Frank, a middle school science teacher who plans lessons in the evening (7-10 PM) and currently wastes 20-30 minutes per lesson searching through massive PDF documents. Goal: Reduce planning time by 50% through instant access to lesson objectives, materials, and teaching guidance.

**Key Metrics:**
- Initial load: <3 seconds
- Navigation transitions: <500ms
- Zero learning curve: 90%+ of users navigate successfully in <60 seconds, first try, no training
- Lighthouse score: >90 (desktop), >85 (tablet)

---

## Technical Stack Requirements

### Core Framework
- **Framework:** Next.js 14+ with App Router OR Vite + React Router (developer choice)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3+
- **Components:** shadcn/ui (copy-paste approach, NOT a library dependency)
- **Icons:** Lucide React
- **State:** React Context API OR Zustand (for localStorage persistence)

### Data Layer (MVP)
- **Data Source:** Static JSON files (no backend)
- **Schema Structure:**
```typescript
interface Discipline {
  id: string; // "physical-science" | "life-science" | "earth-space-science"
  name: string;
  color: string; // "#fb923c" | "#4ade80" | "#60a5fa"
  units: Unit[];
}

interface Unit {
  id: string; // "8.1"
  disciplineId: string;
  name: string; // "Chemical Reactions and Matter"
  lessonCount: number;
  duration: string; // "~3 weeks"
  lessons: Lesson[];
}

interface Lesson {
  id: string; // "8.1.2"
  unitId: string;
  title: string;
  duration: number; // minutes
  standards: string[]; // ["MS-PS1-2", "MS-PS3-1"]
  objectives: string[]; // WALTs (We Are Learning To...)
  materials: Material[];
  sequence: SequencePhase[];
  teachingGuidance: {
    misconceptions: string[];
    keyQuestions: string[];
    differentiation?: string;
  };
  resources: Resource[];
}

interface Material {
  quantity: string; // "Per Group" | "Per Student" | "Per Class"
  description: string;
  notes?: string;
}

interface SequencePhase {
  name: "Engage" | "Explore" | "Explain" | "Elaborate" | "Evaluate";
  duration: number; // minutes
  description: string;
}

interface Resource {
  title: string;
  type: "PDF" | "PPT" | "DOC" | "Other";
  url: string;
}
```

### Local Storage Schema
```typescript
interface AppState {
  lastViewedLesson: {
    lessonId: string;
    timestamp: number;
  } | null;
  recentlyViewed: Array<{
    lessonId: string;
    disciplineId: string;
    unitId: string;
    timestamp: number;
  }>; // max 5 items
  preferences: {
    // Future: user preferences
  };
}
```

---

## Design System Configuration

### Tailwind Config (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode palette (DEFAULT)
        background: '#0a0a0a',
        surface: '#1a1a1a',
        surfaceVariant: '#2a2a2a',
        border: '#3a3a3a',

        // Text
        textPrimary: '#e0e0e0',
        textSecondary: '#a0a0a0',
        textTertiary: '#707070',
        textDisabled: '#606060',

        // Discipline colors
        lifeScience: '#4ade80',      // Green
        earthSpace: '#60a5fa',       // Blue
        physicalScience: '#fb923c',  // Orange

        // Interactive
        primary: '#3b82f6',          // Blue
        primaryHover: '#2563eb',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',

        // Semantic
        comingSoon: '#f59e0b',       // Amber badge
        teacherOnly: '#8b5cf6',      // Purple badge
        studentFacing: '#10b981',    // Emerald badge
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### Global CSS (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 10 10 10; /* #0a0a0a */
    --foreground: 224 224 224; /* #e0e0e0 */
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-textPrimary font-sans;
  }

  /* Typography defaults */
  h1 {
    @apply text-h1;
  }
  h2 {
    @apply text-h2;
  }
  h3 {
    @apply text-h3;
  }
  h4 {
    @apply text-h4;
  }

  /* Focus states */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }

  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

---

## Screen Implementations

### 1. Dashboard (Landing Page) - Priority #1

**Route:** `/` (home page, default landing)

**Layout Requirements:**
- Max container width: 1280px
- Padding: px-8 (desktop), px-6 (tablet), px-4 (mobile)
- Section spacing: mb-6 to mb-8

**Component Structure:**

```tsx
<DashboardLayout>
  <AppHeader /> {/* Hamburger menu + Logo */}

  <main className="max-w-[1280px] mx-auto px-8 py-6">
    {/* Section 1: Pick Up Where You Left Off */}
    <section className="mb-6">
      <h2 className="text-h3 mb-4">Pick Up Where You Left Off</h2>
      <LastViewedCard lesson={lastViewedLesson} />
    </section>

    {/* Section 2: Coming Soon - My Classes */}
    <section className="mb-6">
      <ComingSoonCard
        title="My Classes"
        description="View and manage your classes by period"
        phase="Phase 2 - Multi-User Release"
      />
    </section>

    {/* Section 3: Recently Viewed */}
    <section className="mb-8">
      <h2 className="text-h3 mb-4">Recently Viewed Lessons</h2>
      <RecentlyViewedList items={recentlyViewed} />
    </section>

    {/* Section 4: Browse by Discipline */}
    <section>
      <h2 className="text-h3 mb-4">Browse by Discipline</h2>
      <div className="grid grid-cols-3 gap-6">
        <DisciplineCard
          discipline="life-science"
          name="Life Science"
          color="lifeScience"
          unitCount={15}
          icon={<DnaIcon />}
        />
        <DisciplineCard
          discipline="earth-space-science"
          name="Earth & Space Science"
          color="earthSpace"
          unitCount={12}
          icon={<GlobeIcon />}
        />
        <DisciplineCard
          discipline="physical-science"
          name="Physical Science"
          color="physicalScience"
          unitCount={18}
          icon={<AtomIcon />}
        />
      </div>
    </section>
  </main>
</DashboardLayout>
```

**Component Specs:**

**LastViewedCard:**
- Background: surface (#1a1a1a)
- Padding: p-6
- Border radius: rounded-lg
- Hover: scale(1.02), shadow-lg
- Transition: 200ms ease
- Layout: Horizontal (icon left, content center, CTA right)
- Content: Discipline icon, lesson number, lesson title, unit breadcrumb, duration
- CTA: "Continue →" button (primary color)
- Click: Navigate to lesson detail page
- Empty state: Show "No recent lessons" with "Browse Curriculum" CTA

**ComingSoonCard:**
- Background: surfaceVariant (#2a2a2a)
- Opacity: 0.5
- Border: 2px dashed border (#3a3a3a)
- Padding: p-6
- Badge: "Coming Soon" (amber, top-right)
- Content: Feature title, brief description, phase info
- Cursor: not-allowed
- Hover tooltip: "This feature will be available in Phase 2"
- NOT clickable (disabled state)

**RecentlyViewedList:**
- Layout: Horizontal scroll (desktop), vertical list (mobile)
- Grid: flex gap-4
- Items: Max 5 lessons
- Card: Compact lesson card
  - Discipline icon (color-coded)
  - Unit # + Lesson # (e.g., "8.1.2")
  - Lesson title (truncated to 2 lines)
  - Timestamp (relative: "2 hours ago")
- Hover: scale(1.02), shadow-md
- Click: Navigate to lesson detail

**DisciplineCard:**
- Background: surface (#1a1a1a)
- Accent: 4px top border (discipline color)
- Padding: p-8
- Border radius: rounded-lg
- Hover: scale(1.02), shadow-lg, lift effect (translateY(-2px))
- Transition: 200ms ease
- Icon: 64x64px (discipline-specific color)
- Text: Discipline name (h3), unit count (caption)
- Click: Navigate to `/browse/[discipline-slug]`

---

### 2. Lesson Detail Page - Priority #2

**Route:** `/browse/[discipline]/[unit-id]/[lesson-id]`
**Example:** `/browse/physical-science/8.1/8.1.2`

**Layout Requirements:**
- Max content width: 768px (reading-optimized)
- Padding: px-8 (desktop), px-6 (tablet), px-4 (mobile)
- Section spacing: mb-10 (40px between major sections)

**Component Structure:**

```tsx
<LessonDetailLayout>
  <AppHeader /> {/* Hamburger menu + Logo */}
  <Breadcrumb trail={['Physical Science', 'Unit 8.1', 'Lesson 8.1.2']} />

  <main className="max-w-[768px] mx-auto px-8 py-6">
    {/* Header */}
    <LessonHeader
      number="8.1.2"
      title="Chemical Reactions and Energy Transfer"
      duration={45}
      standards={["MS-PS1-2", "MS-PS3-1"]}
      className="mb-8"
    />

    {/* Learning Objectives */}
    <section className="mb-10">
      <SectionHeading icon={<TargetIcon />} title="Learning Objectives (We Are Learning To...)" />
      <ObjectivesList objectives={lesson.objectives} />
    </section>

    {/* Materials List */}
    <section className="mb-10">
      <SectionHeading icon={<PackageIcon />} title="Materials List" />
      <MaterialsTable materials={lesson.materials} />
    </section>

    {/* Lesson Sequence */}
    <section className="mb-10">
      <SectionHeading icon={<RepeatIcon />} title="Lesson Sequence" />
      <SequenceTimeline phases={lesson.sequence} />
    </section>

    {/* Teaching Guidance */}
    <section className="mb-10">
      <SectionHeading icon={<LightbulbIcon />} title="Teaching Guidance" />
      <TeachingGuidanceCard guidance={lesson.teachingGuidance} />
    </section>

    {/* Resources */}
    <section>
      <SectionHeading icon={<FileTextIcon />} title="Resources" />
      <ResourceGrid resources={lesson.resources} />
    </section>
  </main>
</LessonDetailLayout>
```

**Component Specs:**

**Breadcrumb:**
- Background: transparent
- Padding: py-3 px-4
- Font: body-sm, mono
- Color: textSecondary
- Separator: chevron icon (>)
- Links: textPrimary on hover
- Current segment: textPrimary, bold, not clickable
- Mobile: Truncate to "... > Current" if too long

**LessonHeader:**
- Layout: Vertical stack
- Lesson number: text-h4, mono, textSecondary
- Title: text-h1, mb-2
- Metadata: Horizontal flex (duration, standards)
- Duration: Clock icon + text
- Standards: Comma-separated, mono font

**ObjectivesList:**
- Background: surfaceVariant (#2a2a2a)
- Padding: p-6
- Border radius: rounded-lg
- List style: Ordered (1, 2, 3...)
- Font: body-lg
- Line height: 1.6
- Spacing: gap-3 between items
- Emphasis: Each objective is a complete sentence

**MaterialsTable:**
- Layout: Table (desktop), list (mobile)
- Border: 1px solid border (#3a3a3a)
- Header: Background surfaceVariant, bold
- Rows: Hover background surfaceVariant
- Columns: Quantity (150px), Description (auto)
- Font: body
- Padding: px-4 py-3 per cell

**SequenceTimeline:**
- Layout: Horizontal timeline (desktop), vertical list (mobile)
- Phases: 5 connected nodes
- Node: Circle (64px), phase name, duration badge
- Connector: Line between nodes
- Active phase: Highlighted (future feature)
- Colors: Discipline-specific accent
- Description: Shown on hover (tooltip)

**TeachingGuidanceCard:**
- Background: surfaceVariant (#2a2a2a)
- Border-left: 4px solid teacherOnly (#8b5cf6)
- Padding: p-6
- Sections: Misconceptions, Key Questions, Differentiation
- Icon: Lightbulb
- Font: body
- Lists: Bullet points
- Emphasis: Bold for section headings

**ResourceGrid:**
- Layout: Grid 2 columns (desktop), 1 column (mobile)
- Gap: gap-4
- Card: Surface background, hover lift
- Icon: File type icon (PDF red, PPT orange, DOC blue)
- Title: body-sm
- Type badge: Caption, uppercase
- Click: Open in new tab (target="_blank", rel="noopener noreferrer")
- Error state: Grayed out, "Unavailable" message

---

### 3. Navigation System - Priority #3

**AppHeader Component:**

```tsx
<header className="sticky top-0 z-50 bg-background border-b border-border">
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-4">
      <HamburgerButton onClick={toggleMenu} />
      <Logo />
    </div>
    <UserAvatar /> {/* Future feature, placeholder for now */}
  </div>
</header>
```

**HamburgerMenu Component:**

```tsx
{/* Overlay backdrop */}
{isOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40"
    onClick={closeMenu}
  />
)}

{/* Menu panel */}
<aside className={cn(
  "fixed top-0 left-0 h-full w-64 bg-surface z-50",
  "transform transition-transform duration-200",
  isOpen ? "translate-x-0" : "-translate-x-full"
)}>
  <nav className="p-4">
    <MenuItem
      icon={<HomeIcon />}
      label="Dashboard"
      href="/"
      active={pathname === "/"}
    />
    <MenuItem
      icon={<UsersIcon />}
      label="Users"
      disabled
      tooltip="Coming in Phase 2"
    />
    <MenuItem
      icon={<GroupIcon />}
      label="Classes"
      disabled
      tooltip="Coming in Phase 2"
    />
    <MenuItem
      icon={<BookIcon />}
      label="Lessons"
      href="/browse"
    />
    <MenuItem
      icon={<LibraryIcon />}
      label="OpenSciEd Curriculum"
      href="/browse"
    />
  </nav>
</aside>
```

**MenuItem Component:**
- Height: 44px (touch-friendly)
- Padding: px-3 py-2
- Border radius: rounded-md
- Hover: Background surfaceVariant
- Active: Background surfaceVariant, border-left primary 4px
- Disabled: opacity-50, cursor-not-allowed, tooltip on hover
- Font: body
- Icon: 24px, left-aligned
- Gap: gap-3

**Keyboard Navigation:**
- Tab: Focus moves through menu items
- Enter/Space: Activate menu item
- Escape: Close menu
- Arrow keys: Navigate menu items (optional enhancement)

---

### 4. Discipline Browse View - Priority #4

**Route:** `/browse/[discipline-slug]`
**Example:** `/browse/physical-science`

**Layout:**

```tsx
<DisciplineLayout>
  <AppHeader />
  <Breadcrumb trail={['Physical Science']} />

  <main className="max-w-[1280px] mx-auto px-8 py-6">
    <div className="mb-6">
      <h1 className="text-h1 mb-2">Physical Science Units</h1>
      <p className="text-body text-textSecondary">Middle School Science - Grades 6-8</p>
    </div>

    <div className="flex flex-col gap-6">
      {units.map(unit => (
        <UnitCard
          key={unit.id}
          unit={unit}
          disciplineColor="physicalScience"
        />
      ))}
    </div>
  </main>
</DisciplineLayout>
```

**UnitCard Component:**
- Background: surface (#1a1a1a)
- Padding: p-6
- Border radius: rounded-lg
- Border-left: 4px solid discipline color
- Hover: scale(1.01), shadow-lg
- Layout: Horizontal (content left, CTA right)
- Content:
  - Unit ID + Name (e.g., "Unit 8.1: Chemical Reactions")
  - Metadata: Lesson count, duration estimate
- CTA: "View Lessons →" button
- Click: Navigate to `/browse/[discipline]/[unit-id]`

---

### 5. Unit Lesson List - Priority #5

**Route:** `/browse/[discipline]/[unit-id]`
**Example:** `/browse/physical-science/8.1`

**Layout:**

```tsx
<UnitLayout>
  <AppHeader />
  <Breadcrumb trail={['Physical Science', 'Unit 8.1']} />

  <main className="max-w-[1280px] mx-auto px-8 py-6">
    <div className="mb-8">
      <h1 className="text-h1 mb-2">{unit.name}</h1>
      <div className="flex gap-4 text-body-sm text-textSecondary">
        <span>{unit.lessonCount} Lessons</span>
        <span>•</span>
        <span>{unit.duration}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {unit.lessons.map(lesson => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          disciplineColor="physicalScience"
        />
      ))}
    </div>
  </main>
</UnitLayout>
```

**LessonCard Component:**
- Background: surface (#1a1a1a)
- Padding: p-4
- Border radius: rounded-lg
- Hover: scale(1.02), shadow-md
- Layout: Vertical stack
- Content:
  - Lesson number (mono, textSecondary)
  - Lesson title (truncate 2 lines)
  - Duration badge
  - First objective preview (truncate 1 line, textSecondary)
- Click: Navigate to `/browse/[discipline]/[unit-id]/[lesson-id]`

---

## Responsive Breakpoints

### Desktop (≥1024px) - Primary Target
- Full 3-column layouts
- Persistent sidebar option (future)
- Hover states active
- Optimal reading line length (768px content max)
- Performance target: Lighthouse >90

### Tablet (768-1023px) - Secondary Target
- 2-column layouts
- Hamburger menu collapses to icon
- Touch targets: 44x44px minimum
- Full feature parity with desktop
- Performance target: Lighthouse >85

### Mobile (<768px) - Future-Ready Architecture
- Single-column layouts
- Full-screen hamburger overlay
- Touch targets: 48x48px minimum
- Vertical scrolling optimized
- Phase 2 full implementation

**Tailwind Responsive Classes:**
```tsx
// Example responsive component
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  md:gap-6
  px-4
  md:px-6
  lg:px-8
">
  {/* Content */}
</div>
```

---

## Accessibility Requirements (WCAG 2.1 AA)

### Semantic HTML
```tsx
// Use proper landmark elements
<header>
<nav aria-label="Main navigation">
<main>
<article>
<section aria-labelledby="objectives-heading">
<footer>
```

### ARIA Labels
```tsx
// Buttons
<button aria-label="Open navigation menu">
  <MenuIcon aria-hidden="true" />
</button>

// Links
<a href="/browse/physical-science" aria-label="Browse Physical Science curriculum">
  Physical Science
</a>

// Disabled items
<button disabled aria-label="Users - Coming in Phase 2">
  Users
</button>

// Live regions (for dynamic updates)
<div aria-live="polite" aria-atomic="true">
  {/* Status messages */}
</div>
```

### Keyboard Navigation
```tsx
// Focus management
const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Tab trap logic
};

// Skip navigation
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">
  {/* Content */}
</main>
```

### Color Contrast
- Normal text: 4.5:1 minimum (#e0e0e0 on #0a0a0a = 13.4:1 ✓)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

### Screen Reader Support
```tsx
// Hidden text for screen readers
<span className="sr-only">Opens in new window</span>

// Descriptive text for icons
<LightbulbIcon aria-label="Teaching guidance section" />

// Table headers
<table>
  <thead>
    <tr>
      <th scope="col">Quantity</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    {/* Rows */}
  </tbody>
</table>
```

---

## Animation & Transitions

### Performance-Optimized Animations

```css
/* Page transitions */
.page-transition-enter {
  opacity: 0;
  transform: scale(0.98);
}
.page-transition-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 250ms ease-out, transform 250ms ease-out;
}

/* Card hover (transform and opacity only for 60fps) */
.card-hover {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card-hover:hover {
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Button interaction */
.button-interaction {
  transition: background-color 150ms ease, transform 150ms ease;
}
.button-interaction:hover {
  transform: translateY(-1px);
}
.button-interaction:active {
  transform: translateY(0);
}

/* Loading skeleton shimmer */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #2a2a2a 0%,
    #3a3a3a 50%,
    #2a2a2a 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## localStorage Implementation

### State Management Hook

```typescript
// useAppState.ts
import { useEffect, useState } from 'react';

interface AppState {
  lastViewedLesson: {
    lessonId: string;
    timestamp: number;
  } | null;
  recentlyViewed: Array<{
    lessonId: string;
    disciplineId: string;
    unitId: string;
    timestamp: number;
  }>;
}

const STORAGE_KEY = 'opensci-ed-state';
const MAX_RECENT = 5;

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return {
      lastViewedLesson: null,
      recentlyViewed: [],
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      lastViewedLesson: null,
      recentlyViewed: [],
    };
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const trackLessonView = (lesson: {
    lessonId: string;
    disciplineId: string;
    unitId: string;
  }) => {
    const timestamp = Date.now();

    setState(prev => ({
      lastViewedLesson: {
        lessonId: lesson.lessonId,
        timestamp,
      },
      recentlyViewed: [
        { ...lesson, timestamp },
        ...prev.recentlyViewed
          .filter(item => item.lessonId !== lesson.lessonId)
          .slice(0, MAX_RECENT - 1)
      ],
    }));
  };

  return { state, trackLessonView };
}
```

### Usage in Components

```tsx
// Dashboard.tsx
export function Dashboard() {
  const { state, trackLessonView } = useAppState();

  return (
    <div>
      {state.lastViewedLesson && (
        <LastViewedCard lesson={state.lastViewedLesson} />
      )}

      <RecentlyViewedList items={state.recentlyViewed} />

      {/* ... */}
    </div>
  );
}

// LessonDetail.tsx
export function LessonDetail({ lesson }) {
  const { trackLessonView } = useAppState();

  useEffect(() => {
    trackLessonView({
      lessonId: lesson.id,
      disciplineId: lesson.disciplineId,
      unitId: lesson.unitId,
    });
  }, [lesson.id]);

  return (
    <div>
      {/* Lesson content */}
    </div>
  );
}
```

---

## Error Handling & Loading States

### Error Boundary Component

```tsx
// ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-h2 mb-4">Something went wrong</h1>
          <p className="text-body text-textSecondary mb-6">
            We encountered an error loading this page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Loading Skeleton Components

```tsx
// LessonDetailSkeleton.tsx
export function LessonDetailSkeleton() {
  return (
    <div className="max-w-[768px] mx-auto px-8 py-6 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-4 w-20 bg-surfaceVariant rounded mb-2" />
        <div className="h-10 w-3/4 bg-surfaceVariant rounded mb-4" />
        <div className="h-4 w-1/3 bg-surfaceVariant rounded" />
      </div>

      {/* Objectives skeleton */}
      <div className="mb-10">
        <div className="h-6 w-1/4 bg-surfaceVariant rounded mb-4" />
        <div className="bg-surfaceVariant p-6 rounded-lg">
          <div className="space-y-3">
            <div className="h-4 w-full bg-surface rounded" />
            <div className="h-4 w-5/6 bg-surface rounded" />
            <div className="h-4 w-4/5 bg-surface rounded" />
          </div>
        </div>
      </div>

      {/* Repeat for other sections */}
    </div>
  );
}

// Usage
import { Suspense } from 'react';

<Suspense fallback={<LessonDetailSkeleton />}>
  <LessonDetail lessonId={params.lessonId} />
</Suspense>
```

### 404 Not Found Page

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-h1 mb-4">404 - Page Not Found</h1>
      <p className="text-body text-textSecondary mb-6">
        We couldn't find the page you're looking for.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
      >
        Return to Dashboard
      </a>
    </div>
  );
}
```

---

## Performance Optimization

### Image Optimization (Future)
```tsx
import Image from 'next/image'; // Next.js only

<Image
  src="/discipline-icons/physical-science.svg"
  alt="Physical Science"
  width={64}
  height={64}
  loading="lazy"
/>
```

### Route Preloading
```tsx
// Preload likely next pages
<Link
  href={`/browse/physical-science/8.1/8.1.2`}
  prefetch={true} // Next.js only
  onMouseEnter={() => {
    // Or manual prefetch for other routers
    router.prefetch(`/browse/physical-science/8.1/8.1.2`);
  }}
>
  Lesson 8.1.2
</Link>
```

### Code Splitting
```tsx
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<ChartSkeleton />}>
  <HeavyChart data={data} />
</Suspense>
```

---

## Testing Checklist

### Functional Testing
- [ ] Dashboard loads in <3 seconds
- [ ] Navigation between pages <500ms
- [ ] Recently viewed tracks correctly (max 5 items)
- [ ] Last viewed lesson persists across sessions
- [ ] Breadcrumbs navigate correctly
- [ ] All links open resources in new tabs
- [ ] Coming Soon cards show tooltips
- [ ] Hamburger menu opens/closes smoothly
- [ ] Discipline cards navigate to correct pages

### Accessibility Testing
- [ ] All pages pass Lighthouse accessibility audit (>90)
- [ ] Keyboard-only navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces all content correctly (test with NVDA/VoiceOver)
- [ ] Color contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] Skip navigation link works
- [ ] No keyboard traps

### Responsive Testing
- [ ] Desktop (1024px+): All features work, optimal layout
- [ ] Tablet (768-1023px): Touch-friendly, full feature parity
- [ ] Mobile (<768px): Single-column, future-ready architecture
- [ ] Touch targets ≥44x44px (tablet), ≥48x48px (mobile)
- [ ] No horizontal scrolling at any breakpoint

### Performance Testing
- [ ] Initial load <3 seconds (Lighthouse performance >90)
- [ ] Navigation transitions <500ms
- [ ] No layout shift (CLS <0.1)
- [ ] Animations run at 60fps
- [ ] Bundle size optimized (<500KB initial JS)

---

## Implementation Priority Order

### Sprint 1: Core Foundation (Week 1)
1. Project setup (Next.js/Vite + TypeScript + Tailwind)
2. Install shadcn/ui CLI, configure Tailwind
3. Create global styles, font loading
4. Create AppHeader component (hamburger menu)
5. Create Dashboard page (basic layout)
6. Create DisciplineCard component
7. Implement routing structure

### Sprint 2: Dashboard & Navigation (Week 2)
8. LastViewedCard component
9. RecentlyViewedList component
10. ComingSoonCard component
11. HamburgerMenu with working navigation
12. localStorage state management hook
13. Responsive layouts (desktop + tablet)

### Sprint 3: Lesson Detail (Week 3)
14. LessonDetail page layout
15. Breadcrumb component
16. ObjectivesList component
17. MaterialsTable component
18. SequenceTimeline component
19. TeachingGuidanceCard component
20. ResourceGrid component

### Sprint 4: Browse Views (Week 4)
21. Discipline Browse page
22. UnitCard component
23. Unit Lesson List page
24. LessonCard component
25. Error boundaries
26. Loading skeletons
27. 404 Not Found page

### Sprint 5: Polish & Optimization (Week 5)
28. Accessibility audit and fixes
29. Performance optimization
30. Animation refinement
31. Responsive tablet testing
32. Cross-browser testing
33. User acceptance testing with Frank

---

## Sample Data Structure

### Example JSON: Physical Science Discipline

```json
{
  "id": "physical-science",
  "name": "Physical Science",
  "color": "#fb923c",
  "units": [
    {
      "id": "8.1",
      "disciplineId": "physical-science",
      "name": "Chemical Reactions and Matter",
      "lessonCount": 12,
      "duration": "~3 weeks",
      "lessons": [
        {
          "id": "8.1.2",
          "unitId": "8.1",
          "title": "Chemical Reactions and Energy Transfer",
          "duration": 45,
          "standards": ["MS-PS1-2", "MS-PS3-1"],
          "objectives": [
            "Analyze evidence that chemical reactions involve energy transfer",
            "Construct explanations using molecular models to show energy changes",
            "Develop claims supported by evidence from investigations"
          ],
          "materials": [
            {
              "quantity": "Per Group",
              "description": "250mL beaker"
            },
            {
              "quantity": "Per Group",
              "description": "Thermometer (-10°C to 110°C)"
            },
            {
              "quantity": "Per Student",
              "description": "Safety goggles"
            },
            {
              "quantity": "Per Class",
              "description": "Baking soda (50g)"
            },
            {
              "quantity": "Per Class",
              "description": "Vinegar (500mL)"
            }
          ],
          "sequence": [
            {
              "name": "Engage",
              "duration": 10,
              "description": "Hook activity to spark interest in chemical reactions"
            },
            {
              "name": "Explore",
              "duration": 15,
              "description": "Hands-on investigation of energy changes in reactions"
            },
            {
              "name": "Explain",
              "duration": 10,
              "description": "Connect observations to scientific concepts"
            },
            {
              "name": "Elaborate",
              "duration": 5,
              "description": "Apply concepts to new contexts"
            },
            {
              "name": "Evaluate",
              "duration": 5,
              "description": "Assess understanding through exit ticket"
            }
          ],
          "teachingGuidance": {
            "misconceptions": [
              "Students may think energy is 'used up' in reactions",
              "Confusion between temperature and heat transfer"
            ],
            "keyQuestions": [
              "Where does the energy come from in this reaction?",
              "How can we measure energy changes?"
            ]
          },
          "resources": [
            {
              "title": "Teacher Guide",
              "type": "PDF",
              "url": "/resources/physical-science/8.1/8.1.2/teacher-guide.pdf"
            },
            {
              "title": "Presentation Slides",
              "type": "PPT",
              "url": "/resources/physical-science/8.1/8.1.2/slides.pptx"
            },
            {
              "title": "Student Worksheet",
              "type": "PDF",
              "url": "/resources/physical-science/8.1/8.1.2/student-worksheet.pdf"
            },
            {
              "title": "Lab Safety Guide",
              "type": "PDF",
              "url": "/resources/physical-science/8.1/8.1.2/lab-safety.pdf"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Final Deliverables Checklist

### Code
- [ ] Complete Next.js/Vite + React + TypeScript project
- [ ] shadcn/ui components installed and configured
- [ ] Tailwind CSS configured with design tokens
- [ ] All 5 screens implemented and functional
- [ ] localStorage state management working
- [ ] Responsive layouts (desktop + tablet)
- [ ] Dark mode styling complete

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation functional
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML throughout

### Performance
- [ ] Lighthouse score >90 (desktop)
- [ ] Lighthouse score >85 (tablet)
- [ ] Initial load <3 seconds
- [ ] Navigation <500ms
- [ ] Animations at 60fps
- [ ] Bundle size optimized

### Documentation
- [ ] README with setup instructions
- [ ] Component documentation
- [ ] Deployment guide
- [ ] User guide (optional)

---

## Additional Notes

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- No IE11 support required

### Deployment Recommendations
- **Vercel** (Next.js): Zero-config, optimal for Next.js apps
- **Netlify**: Great for Vite apps, free tier generous
- **GitHub Pages**: Static hosting option, requires build setup

### Future Enhancements (Phase 2+)
- User authentication
- Multi-user support (teacher classes)
- Search functionality
- Lesson notes/bookmarks
- Custom lesson builder
- Student-facing filtered views
- Print-friendly layouts
- PWA capabilities (offline access)

---

**End of AI Frontend Generation Prompt**

_This prompt provides comprehensive specifications for implementing the OpenSciEd Lesson Repository frontend. All design decisions are documented in the UX Specification (docs/ux-specification.md). For questions or clarifications, reference specific section numbers from the UX spec._

**Next Steps:**
1. Use this prompt with v0.dev or Lovable AI to generate initial screens
2. Iterate on generated components with refinements
3. Integrate components into full application
4. Test for accessibility and performance
5. Deploy to staging for user validation

**Success Criteria:**
- Frank can navigate to any lesson in <60 seconds on first try
- Planning time reduced by 50% (from 20-30 min to 10-15 min)
- WCAG 2.1 AA compliance verified
- Lighthouse performance >90 on target devices
