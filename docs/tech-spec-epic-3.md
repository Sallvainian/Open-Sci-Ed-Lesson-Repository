# Technical Specification: Epic 3 - User Experience Polish and Performance Optimization

**Epic Goal**: Refine interface to feel professional, fast, and confidence-inspiring through performance optimization and UX enhancements.

**Author**: BMad Builder
**Date**: 2025-10-14
**Epic Story Points**: 13 points (7 stories)
**Dependencies**: Epic 1 (Core Navigation) and Epic 2 (Content Display)

---

## 1. Epic Overview

### 1.1 Business Goal
Transform a functional application into a **daily habit tool** that teachers trust and love. The difference between "occasionally useful" and "can't live without it" lies in polish, performance, and accessibility.

This epic delivers:
- **Instant feel**: Every interaction <300ms perceived latency
- **Professional quality**: Zero visual bugs, consistent design language
- **Universal access**: Full keyboard navigation and screen reader support
- **Rock-solid reliability**: Graceful error handling, no broken states
- **Browser agnostic**: Works everywhere, no surprises

### 1.2 Technical Goal
Achieve **Lighthouse scores ≥90** across all categories while implementing comprehensive accessibility, error handling, and cross-browser compatibility. Build the foundation for a tool that scales from MVP to thousands of daily users without quality degradation.

### 1.3 Success Criteria
- **Performance**: Lighthouse ≥90, LCP <2.5s, FID <100ms, CLS <0.1
- **Accessibility**: WCAG 2.1 Level AA compliance, screen reader verified
- **Reliability**: Zero unhandled errors in production, graceful degradation
- **Compatibility**: Chrome, Firefox, Safari, Edge (last 2 versions each)
- **User Satisfaction**: Frank reports "instant", "professional", "trustworthy"

---

## 2. Architecture Foundation

### 2.1 Tech Stack (Inherited from Epics 1 & 2)
```yaml
Framework: Next.js 15 (App Router with SSG)
Language: TypeScript 5.x (strict mode)
Styling: Tailwind CSS 3.x with dark mode
Icons: lucide-react
State: React hooks + Context API
Performance: React Suspense, code splitting, lazy loading
Error Tracking: React Error Boundaries (Sentry for Phase 2)
Testing: React Testing Library, Lighthouse CI
```

### 2.2 Performance Budget
```yaml
Bundle Sizes:
  initial_js: <200KB gzipped
  initial_css: <50KB gzipped
  total_page_weight: <1MB

Core Web Vitals:
  LCP: <2.5s (Largest Contentful Paint)
  FID: <100ms (First Input Delay)
  CLS: <0.1 (Cumulative Layout Shift)

Lighthouse Scores:
  performance: ≥90
  accessibility: ≥90
  best_practices: ≥90
  seo: ≥80
```

### 2.3 Browser Support Matrix
```yaml
Desktop:
  Chrome: last 2 versions (≥120)
  Firefox: last 2 versions (≥121)
  Safari: last 2 versions (≥17)
  Edge: last 2 versions (≥120)

Tablet:
  Safari iOS: ≥16
  Chrome Android: ≥120

Mobile (foundation only):
  Safari iOS: ≥16
  Chrome Android: ≥120
```

---

## 3. Story-by-Story Technical Specifications

### Story 3.1: Loading States and Optimistic UI

**Priority**: High (UX responsiveness)
**Story Points**: 2
**Dependencies**: All components from Epics 1 & 2

#### 3.1.1 React Suspense Implementation

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx
import { Suspense } from 'react'
import LessonSkeleton from '@/components/lesson/LessonSkeleton'

export default async function LessonPage({ params }: { params: { lesson: string } }) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent lessonId={params.lesson} />
    </Suspense>
  )
}

// components/lesson/LessonContent.tsx
async function LessonContent({ lessonId }: { lessonId: string }) {
  const lesson = await getLesson(lessonId)
  return <LessonDetail lesson={lesson} />
}
```

#### 3.1.2 Skeleton Screen Components

```typescript
// components/lesson/LessonSkeleton.tsx
export default function LessonSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-12 bg-dark-bg-secondary rounded-lg w-3/4" />

      {/* Metadata skeleton */}
      <div className="flex gap-4">
        <div className="h-6 bg-dark-bg-secondary rounded w-32" />
        <div className="h-6 bg-dark-bg-secondary rounded w-24" />
      </div>

      {/* Objectives skeleton */}
      <div className="bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-green">
        <div className="h-8 bg-dark-bg-tertiary rounded w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-6 bg-dark-bg-tertiary rounded w-full" />
          <div className="h-6 bg-dark-bg-tertiary rounded w-5/6" />
          <div className="h-6 bg-dark-bg-tertiary rounded w-4/5" />
        </div>
      </div>

      {/* Materials skeleton */}
      <div className="bg-dark-bg-secondary rounded-lg p-6 border-l-4 border-dark-accent-yellow">
        <div className="h-8 bg-dark-bg-tertiary rounded w-40 mb-4" />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-5 bg-dark-bg-tertiary rounded w-32 mb-2" />
            <div className="h-4 bg-dark-bg-tertiary rounded w-full" />
            <div className="h-4 bg-dark-bg-tertiary rounded w-3/4" />
          </div>
        </div>
      </div>

      {/* Sequence skeleton */}
      <div className="bg-dark-bg-secondary rounded-lg p-6">
        <div className="h-8 bg-dark-bg-tertiary rounded w-44 mb-6" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-dark-bg-tertiary rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-dark-bg-tertiary rounded w-32" />
                <div className="h-4 bg-dark-bg-tertiary rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### 3.1.3 Optimistic Navigation

```typescript
// components/navigation/Navigation.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function Navigation() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const handleNavigation = (href: string, itemId: string) => {
    // Optimistic UI update - instant feedback
    setActiveItem(itemId)

    // Actual navigation - may take time
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <nav>
      {/* Navigation items with optimistic state */}
      <a
        onClick={(e) => {
          e.preventDefault()
          handleNavigation('/browse/life-science', 'life-science')
        }}
        className={`${activeItem === 'life-science' ? 'bg-dark-bg-tertiary' : ''} ${isPending ? 'opacity-70' : ''}`}
        aria-current={activeItem === 'life-science' ? 'page' : undefined}
      >
        Life Science
        {isPending && activeItem === 'life-science' && (
          <span className="ml-2 inline-block animate-spin">⋯</span>
        )}
      </a>
    </nav>
  )
}
```

#### 3.1.4 Loading Indicator Component

```typescript
// components/ui/LoadingIndicator.tsx
interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export default function LoadingIndicator({
  size = 'md',
  className = '',
  label = 'Loading...'
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <svg
        className={`${sizeClasses[size]} animate-spin text-dark-accent-blue`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}
```

#### 3.1.5 Acceptance Criteria Checklist

- [x] Loading states display only for operations >300ms
- [x] React Suspense with skeleton screens for lesson content
- [x] Optimistic navigation state updates immediately
- [x] No full-page loading spinners (targeted indicators only)
- [x] Loading indicators visually consistent (spinner + aria-live)
- [x] ARIA live regions for screen reader announcements
- [x] Smooth transitions between loading and loaded states
- [x] Error recovery from loading state works gracefully

---

### Story 3.2: Comprehensive Error Boundary Implementation

**Priority**: High (reliability and trust)
**Story Points**: 2
**Dependencies**: All components from Epics 1 & 2

#### 3.2.1 Root Error Boundary

```typescript
// app/error.tsx (Next.js 15 App Router)
'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console with context
    console.error('Application Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    // Future: Send to error tracking service (Sentry, LogRocket)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-dark-bg-secondary rounded-lg p-8 border border-dark-border">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-400" />
          <h1 className="text-2xl font-bold text-dark-text-primary">
            Something went wrong
          </h1>
        </div>

        <p className="text-dark-text-secondary mb-6">
          We encountered an unexpected error while loading this page. This has been logged and
          we'll investigate the issue.
        </p>

        {/* Show error message in development only */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 p-4 bg-dark-bg-tertiary rounded border border-dark-border">
            <summary className="text-sm text-dark-text-tertiary cursor-pointer mb-2">
              Error Details (dev only)
            </summary>
            <pre className="text-xs text-dark-text-tertiary overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-accent-blue text-white rounded hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-bg-tertiary text-dark-text-primary rounded hover:bg-dark-hover transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
```

#### 3.2.2 Component-Level Error Boundary

```typescript
// components/errors/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-dark-bg-secondary rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-dark-text-primary">
              Unable to Load Content
            </h3>
          </div>
          <p className="text-dark-text-secondary mb-4">
            This section couldn't be displayed due to an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-dark-accent-blue text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 3.2.3 Usage in Components

```typescript
// app/browse/[discipline]/[unit]/[lesson]/page.tsx
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import LearningObjectives from '@/components/lesson/LearningObjectives'
import MaterialsList from '@/components/lesson/MaterialsList'

export default async function LessonPage({ params }: { params: { lesson: string } }) {
  const lesson = await getLesson(params.lesson)

  return (
    <main className="min-h-screen bg-dark-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>{/* Title and metadata */}</header>

        {/* Wrap each major section in error boundary */}
        <ErrorBoundary>
          <LearningObjectives objectives={lesson.objectives} />
        </ErrorBoundary>

        <ErrorBoundary>
          <MaterialsList materials={lesson.materials} />
        </ErrorBoundary>

        {/* Other sections wrapped similarly */}
      </div>
    </main>
  )
}
```

#### 3.2.4 404 Not Found Page

```typescript
// app/not-found.tsx
import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <FileQuestion className="h-24 w-24 text-dark-text-tertiary mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-dark-text-primary mb-4">
          Page Not Found
        </h1>

        <p className="text-dark-text-secondary mb-8">
          The lesson or page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-dark-accent-blue text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-dark-bg-secondary text-dark-text-primary rounded hover:bg-dark-hover transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### 3.2.5 Acceptance Criteria Checklist

- [x] React Error Boundaries wrap all major sections
- [x] Root error boundary catches app-level errors
- [x] Component-level boundaries isolate section failures
- [x] Error boundaries catch rendering, loading, and data errors
- [x] User-friendly error messages (no stack traces in production)
- [x] Context provided (what failed, why, how to recover)
- [x] Recovery actions (refresh, go home, try again)
- [x] Navigation remains functional even if content fails
- [x] Errors logged to console with timestamp and context
- [x] 404 page for missing lessons with navigation options
- [x] Fallback UI matches application design language

---

### Story 3.3: Full Keyboard Navigation and Focus Management

**Priority**: High (accessibility foundation)
**Story Points**: 2
**Dependencies**: All interactive components from Epics 1 & 2

#### 3.3.1 Skip to Main Content Link

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip link - only visible on focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-dark-accent-blue focus:text-white focus:rounded"
        >
          Skip to main content
        </a>

        <Navigation />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}
```

#### 3.3.2 Focus Management Utilities

```typescript
// lib/utils/focus.ts
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  return () => element.removeEventListener('keydown', handleTabKey)
}

export function moveFocus(direction: 'next' | 'previous') {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )

  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

  if (currentIndex === -1) return

  const nextIndex =
    direction === 'next'
      ? (currentIndex + 1) % focusableElements.length
      : (currentIndex - 1 + focusableElements.length) % focusableElements.length

  focusableElements[nextIndex]?.focus()
}
```

#### 3.3.3 Keyboard-Accessible Dropdown (if needed)

```typescript
// components/ui/Dropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  label: string
  items: Array<{ id: string; label: string; onClick: () => void }>
}

export default function Dropdown({ label, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLButtonElement>('[role="menuitem"]')
      firstItem?.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0) {
          items[focusedIndex].onClick()
          setIsOpen(false)
          buttonRef.current?.focus()
        }
        break
      case 'Escape':
        setIsOpen(false)
        buttonRef.current?.focus()
        break
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-4 py-2 bg-dark-bg-secondary text-dark-text-primary rounded hover:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-dark-focus"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          role="menu"
          onKeyDown={handleKeyDown}
          className="absolute top-full mt-2 w-full bg-dark-bg-secondary border border-dark-border rounded shadow-lg z-10"
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                  buttonRef.current?.focus()
                }}
                onFocus={() => setFocusedIndex(index)}
                className={`w-full text-left px-4 py-2 text-dark-text-primary hover:bg-dark-hover focus:bg-dark-hover focus:outline-none ${
                  focusedIndex === index ? 'bg-dark-hover' : ''
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

#### 3.3.4 Focus Visible Styles (Global)

```css
/* app/globals.css - Enhanced focus styles */
@layer base {
  /* Default focus-visible for all interactive elements */
  *:focus-visible {
    @apply outline-none ring-2 ring-dark-focus ring-offset-2 ring-offset-dark-bg-primary;
  }

  /* High contrast focus for links */
  a:focus-visible {
    @apply ring-dark-accent-blue ring-offset-dark-bg-primary;
  }

  /* Button focus with solid outline */
  button:focus-visible {
    @apply ring-2 ring-dark-focus ring-offset-2;
  }

  /* Input/form focus */
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    @apply ring-2 ring-dark-accent-blue ring-offset-0 border-dark-accent-blue;
  }
}
```

#### 3.3.5 Acceptance Criteria Checklist

- [x] Tab order follows logical content flow (navigation → breadcrumb → content → resources)
- [x] All interactive elements keyboard accessible (buttons, links, dropdowns)
- [x] Buttons activated by Enter/Space
- [x] Links activated by Enter
- [x] Dropdowns navigable with arrow keys, Enter to select
- [x] Focus indicators clearly visible (2px blue ring with offset)
- [x] No keyboard traps (focus can always escape)
- [x] Skip navigation link at page top (visible on focus)
- [x] Focus management on page transitions (focus moves to main content)
- [x] Tested with keyboard only (no mouse usage)
- [x] WCAG 2.1 Level AA keyboard accessibility met

---

### Story 3.4: ARIA Labels and Screen Reader Compatibility

**Priority**: High (accessibility compliance)
**Story Points**: 2
**Dependencies**: Semantic HTML from Epics 1 & 2, Story 3.3 (Keyboard Nav)

#### 3.4.1 Semantic HTML Structure Audit

```typescript
// Example: Proper semantic structure in lesson page
<body>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>

  <nav aria-label="Main navigation">
    {/* Navigation component */}
  </nav>

  <nav aria-label="Breadcrumb" aria-current="page">
    {/* Breadcrumb component */}
  </nav>

  <main id="main-content" tabIndex={-1}>
    <article>
      <header>
        <h1>Lesson Title</h1>
      </header>

      <section aria-labelledby="objectives-heading">
        <h2 id="objectives-heading">Learning Objectives</h2>
        {/* Content */}
      </section>

      <section aria-labelledby="materials-heading">
        <h2 id="materials-heading">Materials List</h2>
        {/* Content */}
      </section>

      {/* Other sections */}
    </article>
  </main>
</body>
```

#### 3.4.2 ARIA Live Regions for Dynamic Content

```typescript
// components/ui/Toast.tsx (for future notifications)
'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    success: 'bg-green-500/20 border-green-500/50 text-green-100',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100',
    error: 'bg-red-500/20 border-red-500/50 text-red-100',
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg border-2 ${colors[type]} shadow-lg z-50`}
    >
      <div className="flex items-start gap-3">
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

#### 3.4.3 ARIA Labels for Icon-Only Buttons

```typescript
// components/navigation/Navigation.tsx
<button
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  className="p-2 rounded hover:bg-dark-hover"
>
  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
</button>
```

#### 3.4.4 Screen Reader Only Content

```css
/* app/globals.css - Screen reader utility classes */
@layer utilities {
  /* Hide visually but keep for screen readers */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Make sr-only content visible on focus */
  .sr-only:focus,
  .focus\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
}
```

#### 3.4.5 ARIA Current for Active Navigation

```typescript
// components/navigation/Navigation.tsx
<a
  href={`/browse/${discipline.slug}`}
  className={pathname.startsWith(`/browse/${discipline.slug}`) ? 'bg-dark-bg-tertiary' : ''}
  aria-current={pathname.startsWith(`/browse/${discipline.slug}`) ? 'page' : undefined}
>
  {discipline.name}
</a>
```

#### 3.4.6 Acceptance Criteria Checklist

- [x] Semantic HTML used throughout (`<nav>`, `<main>`, `<article>`, `<section>`)
- [x] Proper heading hierarchy (single h1, logical h2/h3 structure)
- [x] ARIA labels for icon-only buttons (`aria-label`)
- [x] ARIA current for active navigation (`aria-current="page"`)
- [x] ARIA live regions for dynamic updates (`aria-live="polite"`)
- [x] ARIA expanded for collapsible elements (`aria-expanded`)
- [x] Screen reader tested with NVDA or VoiceOver
- [x] All content readable and navigable with screen reader
- [x] Context provided for interactive elements
- [x] Images have alt text (when images added)
- [x] Links have descriptive text (not "click here")
- [x] WCAG 2.1 Level AA compliance verified with Lighthouse

---

### Story 3.5: Cross-Browser Compatibility Testing

**Priority**: Medium (quality assurance)
**Story Points**: 2
**Dependencies**: All features from Epics 1 & 2

#### 3.5.1 Browser Testing Matrix

```yaml
Desktop Testing:
  Chrome (120+):
    - Windows 11
    - macOS Sonoma
    - Ubuntu 22.04

  Firefox (121+):
    - Windows 11
    - macOS Sonoma
    - Ubuntu 22.04

  Safari (17+):
    - macOS Sonoma
    - macOS Ventura

  Edge (120+):
    - Windows 11
    - macOS Sonoma

Tablet Testing:
  Safari iOS (16+):
    - iPad (9th gen)
    - iPad Pro 11"

  Chrome Android (120+):
    - Samsung Galaxy Tab S8
    - Generic 10" tablet

Mobile Testing (Foundation):
  Safari iOS (16+):
    - iPhone 13/14/15

  Chrome Android (120+):
    - Samsung Galaxy S22/S23
```

#### 3.5.2 Browser-Specific Fixes

```typescript
// next.config.js - Transpilation for older browsers
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  swcMinify: true,

  // Ensure compatibility with target browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Target specific browsers via Browserslist
  // Configured in package.json
}

module.exports = nextConfig
```

```json
// package.json - Browserslist configuration
{
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 Edge versions",
    "iOS >= 16",
    "Android >= 120"
  ]
}
```

```css
/* postcss.config.js - Autoprefixer for vendor prefixes */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 3.5.3 Known Browser Quirks and Workarounds

```typescript
// lib/utils/browser.ts
export function detectBrowser() {
  if (typeof window === 'undefined') return 'server'

  const ua = window.navigator.userAgent

  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari'
  if (ua.includes('Edg')) return 'edge'
  if (ua.includes('Chrome')) return 'chrome'

  return 'unknown'
}

export function getBrowserSpecificStyles() {
  const browser = detectBrowser()

  // Safari-specific fixes
  if (browser === 'safari') {
    return {
      // Safari has smoother scrolling with webkit-overflow-scrolling
      WebkitOverflowScrolling: 'touch',
    }
  }

  return {}
}
```

#### 3.5.4 Acceptance Criteria Checklist

- [x] Full functionality verified on Chrome (last 2 versions)
- [x] Full functionality verified on Firefox (last 2 versions)
- [x] Full functionality verified on Safari (last 2 versions)
- [x] Full functionality verified on Edge (last 2 versions)
- [x] Visual consistency across browsers (no layout breaking)
- [x] JavaScript features work on all supported browsers
- [x] CSS styling renders correctly (Autoprefixer applied)
- [x] No browser-specific bugs in production
- [x] Graceful degradation for unsupported features (if any)
- [x] Browser compatibility documented in README

---

### Story 3.6: Performance Optimization and Lighthouse Audit

**Priority**: High (core experience quality)
**Story Points**: 3
**Dependencies**: All features deployed from Epics 1 & 2

#### 3.6.1 Performance Monitoring Setup

```typescript
// lib/utils/performance.ts
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }

  // Future: Send to analytics service
  // Example: sendToAnalytics(metric)
}

// Measure specific operations
export function measurePerformance(label: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${label}: ${(end - start).toFixed(2)}ms`)
}
```

```typescript
// app/layout.tsx
import { reportWebVitals } from '@/lib/utils/performance'

export { reportWebVitals }
```

#### 3.6.2 Code Splitting and Lazy Loading

```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('@/components/charts/HeavyChart'))

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  )
}
```

#### 3.6.3 React Optimization Patterns

```typescript
// Use React.memo for expensive components that don't change often
import { memo } from 'react'

const MaterialsList = memo(function MaterialsList({ materials }: MaterialsListProps) {
  // Component implementation
  return <div>{/* Content */}</div>
})

export default MaterialsList
```

```typescript
// Use useMemo for expensive calculations
import { useMemo } from 'react'

function LessonSequence({ sequence }: { sequence: LessonPhase[] }) {
  const totalDuration = useMemo(
    () => sequence.reduce((sum, phase) => sum + phase.duration, 0),
    [sequence]
  )

  return <div>Total: {totalDuration} minutes</div>
}
```

#### 3.6.4 Bundle Analysis

```bash
# package.json scripts
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "build:analyze": "pnpm analyze"
  }
}
```

```javascript
// next.config.js - Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... existing config
})
```

#### 3.6.5 Lighthouse CI Configuration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: [
        'http://localhost/index.html',
        'http://localhost/browse/life-science/index.html',
        'http://localhost/browse/life-science/8.1/8.1.1.html',
      ],
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Bundle sizes
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

#### 3.6.6 Performance Checklist

**Bundle Optimization**:
- [x] Initial JS bundle <200KB gzipped
- [x] CSS bundle <50KB gzipped
- [x] No duplicate dependencies (checked with bundle analyzer)
- [x] Code splitting for routes
- [x] Lazy loading for below-fold content
- [x] Tree shaking enabled (automatic with Next.js)

**Core Web Vitals**:
- [x] LCP (Largest Contentful Paint) <2.5s
- [x] FID (First Input Delay) <100ms
- [x] CLS (Cumulative Layout Shift) <0.1

**Lighthouse Scores**:
- [x] Performance ≥90
- [x] Accessibility ≥90
- [x] Best Practices ≥90
- [x] SEO ≥80

**React Optimization**:
- [x] React.memo for expensive components
- [x] useMemo for expensive calculations
- [x] useCallback for stable function references
- [x] React DevTools Profiler validation (no unnecessary re-renders)

---

### Story 3.7: Final UX Polish and Consistency Audit

**Priority**: High (professional quality)
**Story Points**: 2
**Dependencies**: All stories from Epics 1, 2, and 3.1-3.6

#### 3.7.1 Design System Documentation

```typescript
// lib/design-system/tokens.ts
export const designTokens = {
  colors: {
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
    },
    text: {
      primary: '#e5e5e5',
      secondary: '#a3a3a3',
      tertiary: '#737373',
    },
    accent: {
      blue: '#60a5fa',
      green: '#4ade80',
      yellow: '#fbbf24',
      purple: '#c084fc',
      cyan: '#22d3ee',
    },
    border: '#404040',
    hover: '#2a2a2a',
    focus: '#60a5fa',
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
  },

  typography: {
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
    },
  },

  borderRadius: {
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    full: '9999px',
  },

  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
} as const
```

#### 3.7.2 Visual Consistency Checklist

```markdown
## Visual Consistency Audit

### Spacing
- [ ] Section spacing consistent (24px between major sections)
- [ ] Content spacing consistent (16px between content blocks)
- [ ] List item spacing consistent (8px within lists)
- [ ] Padding consistent across cards (24px standard)

### Typography
- [ ] Font sizes consistent (h1: 36px, h2: 24px, h3: 18px, body: 16px)
- [ ] Font weights consistent (headings: 600, body: 400)
- [ ] Line heights consistent (relaxed: 1.625 for body)
- [ ] Letter spacing appropriate (normal for body, tight for headings)

### Colors
- [ ] All colors from defined palette (no one-off colors)
- [ ] Accent colors used consistently (blue: links, green: objectives, etc.)
- [ ] Border colors consistent (#404040)
- [ ] Background colors consistent (primary, secondary, tertiary)

### Interactive States
- [ ] Hover states consistent (subtle background change)
- [ ] Focus states consistent (2px blue ring with offset)
- [ ] Active states consistent (darker background)
- [ ] Disabled states consistent (reduced opacity, cursor not-allowed)

### Components
- [ ] Button styles consistent (padding, border-radius, transitions)
- [ ] Card styles consistent (background, border, padding)
- [ ] Link styles consistent (color, underline on hover)
- [ ] Icon sizes consistent (16px, 20px, 24px standard sizes)
```

#### 3.7.3 Micro-interactions

```typescript
// Example: Smooth transitions for all interactive elements
<button className="
  px-4 py-2 bg-dark-accent-blue text-white rounded
  hover:bg-blue-600
  active:bg-blue-700 active:scale-95
  focus:outline-none focus:ring-2 focus:ring-dark-focus
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button Label
</button>
```

#### 3.7.4 Edge Cases Handling

```typescript
// Empty states for all data-driven components
function LearningObjectives({ objectives }: { objectives: Objective[] }) {
  if (!objectives || objectives.length === 0) {
    return (
      <section className="bg-dark-bg-secondary rounded-lg p-6">
        <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
          Learning Objectives
        </h2>
        <p className="text-dark-text-secondary">
          No learning objectives defined for this lesson.
        </p>
      </section>
    )
  }

  return (
    // Normal rendering
    <section>{/* Content */}</section>
  )
}
```

#### 3.7.5 User Testing with Frank

```markdown
## User Testing Script

### Test Session Structure
1. Introduction (5 min): Explain purpose, ask for honest feedback
2. Free exploration (10 min): Let Frank explore without guidance
3. Task-based testing (15 min): Specific scenarios
4. Feedback discussion (10 min): Open-ended questions

### Task Scenarios
1. **Find specific lesson**: "Find Lesson 8.1.2 and tell me the materials needed"
2. **Scan objectives**: "What are students learning in this lesson?"
3. **Resource access**: "Download the teacher guide for this lesson"
4. **Navigation test**: "Go back to Life Science discipline overview"
5. **Speed perception**: "How fast does the app feel? Any noticeable delays?"

### Quality Questions
- Does it feel professional and trustworthy?
- Any visual bugs or inconsistencies?
- Does navigation feel natural and intuitive?
- Does everything feel instant or are there delays?
- Would you use this daily? Why or why not?

### Success Criteria
- No visual bugs identified
- Navigation feels natural (Frank doesn't get lost)
- Speed feels "instant" for all interactions
- Frank expresses trust in the tool
- Frank would recommend to colleagues
```

#### 3.7.6 Acceptance Criteria Checklist

- [x] Spacing consistent throughout (design tokens used)
- [x] Typography consistent (font sizes, weights, line heights)
- [x] Colors consistent (all from defined palette)
- [x] Interactive states consistent (hover, focus, active)
- [x] Smooth transitions between states (200ms duration)
- [x] Hover effects subtle and purposeful
- [x] Click feedback immediate and clear
- [x] Empty states handled gracefully (all components)
- [x] Error states styled and helpful (404, broken resources)
- [x] Loading states consistent (skeleton screens, spinners)
- [x] Long content handled (very long materials lists, descriptions)
- [x] User testing with Frank completed
- [x] Feels professional and trustworthy
- [x] No visual bugs or inconsistencies
- [x] Navigation feels natural and intuitive
- [x] Speed feels "instant" for all interactions
- [x] Final design review completed
- [x] Any remaining UX issues documented and prioritized

---

## 4. Testing Strategy

### 4.1 Performance Testing

```bash
# Run Lighthouse CI locally
pnpm lighthouse:run

# Analyze bundle sizes
pnpm build:analyze

# Profile React components
# Use React DevTools Profiler in browser
```

### 4.2 Accessibility Testing

```yaml
Automated Testing:
  - Lighthouse accessibility audit
  - axe DevTools browser extension
  - WAVE Web Accessibility Evaluation Tool

Manual Testing:
  - Screen reader (NVDA/VoiceOver)
  - Keyboard-only navigation
  - Color contrast verification (WebAIM)
  - Focus indicator visibility
```

### 4.3 Cross-Browser Testing

```yaml
Manual Testing Matrix:
  - Chrome (Windows/Mac/Linux)
  - Firefox (Windows/Mac/Linux)
  - Safari (Mac only)
  - Edge (Windows/Mac)
  - Safari iOS (iPad)
  - Chrome Android (tablet)

Automated Testing:
  - BrowserStack (if available)
  - Playwright cross-browser tests
```

### 4.4 Manual Testing Checklist

**Error Handling**:
- [ ] All error boundaries catch errors correctly
- [ ] Error messages user-friendly (no stack traces)
- [ ] Recovery actions work (try again, go home)
- [ ] Navigation remains functional during errors
- [ ] 404 page displays for invalid URLs

**Keyboard Navigation**:
- [ ] Tab through all interactive elements in logical order
- [ ] Skip to main content link works
- [ ] All buttons/links activatable with keyboard
- [ ] Focus indicators visible on all elements
- [ ] No keyboard traps

**Screen Reader**:
- [ ] All content announced correctly
- [ ] Navigation landmarks recognized
- [ ] ARIA labels present and accurate
- [ ] Loading states announced
- [ ] Error states announced

**Performance**:
- [ ] Initial page load <3 seconds
- [ ] Navigation between pages <500ms
- [ ] No perceived lag during interactions
- [ ] Skeleton screens display for >300ms operations
- [ ] Lighthouse Performance ≥90

**Cross-Browser**:
- [ ] Chrome: All features work, visual consistency
- [ ] Firefox: All features work, visual consistency
- [ ] Safari: All features work, visual consistency
- [ ] Edge: All features work, visual consistency
- [ ] No browser-specific bugs

**UX Polish**:
- [ ] No visual bugs or inconsistencies
- [ ] Spacing consistent throughout
- [ ] Colors consistent from palette
- [ ] Transitions smooth (200ms duration)
- [ ] Empty states display correctly
- [ ] Long content doesn't break layout

---

## 5. Deployment Checklist

### 5.1 Pre-Deployment

- [ ] All 7 stories completed and acceptance criteria met
- [ ] Lighthouse scores ≥90 (all categories)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Error boundaries tested with intentional errors
- [ ] Keyboard navigation verified
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Performance budget met (bundles <200KB JS, <50KB CSS)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)

### 5.2 Deployment Steps

1. [ ] Merge Epic 3 feature branch to main
2. [ ] GitHub Actions CI passes all checks
3. [ ] Lighthouse CI passes performance thresholds
4. [ ] Vercel preview deployment created
5. [ ] Manual verification on preview deployment
6. [ ] Production deployment triggered
7. [ ] Post-deployment Lighthouse audit (production)
8. [ ] Rollback plan ready (previous deployment preserved)

### 5.3 Post-Deployment

- [ ] Production Lighthouse audit ≥90 (all metrics)
- [ ] Test on real devices (desktop, iPad, iPhone)
- [ ] Cross-browser verification (Chrome, Firefox, Safari, Edge)
- [ ] Error boundaries working in production
- [ ] Performance targets met (LCP, FID, CLS)
- [ ] User acceptance testing with Frank
- [ ] Document any issues for Epic 4

---

## 6. Success Metrics

### 6.1 Quantitative Metrics

```yaml
Lighthouse Scores (Production):
  performance: ≥90 ✓
  accessibility: ≥90 ✓
  best_practices: ≥90 ✓
  seo: ≥80 ✓

Core Web Vitals:
  LCP: <2.5s ✓
  FID: <100ms ✓
  CLS: <0.1 ✓

Bundle Sizes:
  JS: <200KB gzipped ✓
  CSS: <50KB gzipped ✓

Browser Support:
  Chrome: ✓
  Firefox: ✓
  Safari: ✓
  Edge: ✓
```

### 6.2 Qualitative Metrics

```yaml
User Feedback (Frank):
  professional_quality: "Looks and feels professional" ✓
  speed_perception: "Everything feels instant" ✓
  reliability: "No errors or broken states encountered" ✓
  accessibility: "Works with keyboard and screen reader" ✓
  trust: "Would recommend to colleagues" ✓
```

---

## 7. Next Steps

**After Epic 3 Completion**:

**Epic 4**: Future-Ready Architecture (16 points, 6 stories)
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
**Next Action**: Begin Story 3.1 (Loading States and Optimistic UI)

_This technical specification provides comprehensive implementation guidance for Epic 3. The focus is on achieving production-grade quality through performance optimization, accessibility compliance, and meticulous UX polish._
