# Testing Strategy

## Unit Testing (Vitest)

**Test Coverage Goals**:

- API route handlers: 80%+
- Service functions: 80%+
- Utility functions: 90%+
- React components: 70%+

**Example Unit Test**:

```typescript
// lib/search/searchService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { searchLessons } from './searchService';

describe('searchLessons', () => {
  beforeEach(async () => {
    // Seed test database
  });

  it('should return lessons matching query in name', async () => {
    const results = await searchLessons('Forces');

    expect(results).toHaveLength(3);
    expect(results[0].matchType).toBe('name');
    expect(results[0].lesson.name).toContain('Forces');
  });

  it('should filter by discipline', async () => {
    const results = await searchLessons('Energy', {
      disciplineId: 'physical-science-id',
    });

    expect(results.every((r) => r.discipline.id === 'physical-science-id')).toBe(true);
  });
});
```

## Component Testing (React Testing Library)

**Testing Philosophy**:

- Test user interactions, not implementation details
- Focus on accessibility
- Use semantic queries (getByRole, getByLabelText)

**Example Component Test**:

```typescript
// components/lessons/LessonCard.test.tsx
import { render, screen } from '@testing-library/react';
import { LessonCard } from './LessonCard';

describe('LessonCard', () => {
  const mockLesson = {
    id: '1',
    name: 'Lesson 1: Forces',
    status: 'upcoming',
    scheduledDate: new Date('2025-10-02'),
    // ... other fields
  };

  it('should display lesson name', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    expect(screen.getByText('Lesson 1: Forces')).toBeInTheDocument();
  });

  it('should display status badge', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    render(<LessonCard lesson={mockLesson} unit={mockUnit} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
```

## E2E Testing (Playwright)

**Critical User Flows**:

1. Find tomorrow's lesson materials (primary use case)
2. Browse and discover lesson by concept
3. Add new lesson to repository
4. Search for lesson by keyword

**Example E2E Test**:

```typescript
// tests/e2e/find-lesson.spec.ts
import { test, expect } from '@playwright/test';

test("teacher can find tomorrow's lesson materials", async ({ page }) => {
  await page.goto('http://localhost:3000');

  // 1. Homepage loads with upcoming lessons
  await expect(page.getByRole('heading', { name: 'Upcoming Lessons' })).toBeVisible();

  // 2. Click on tomorrow's lesson
  await page.getByText('Lesson 2: Net Forces').click();

  // 3. Lesson detail page loads
  await expect(page.getByRole('heading', { name: 'Lesson 2: Net Forces' })).toBeVisible();

  // 4. Verify all template sections are present
  await expect(page.getByText('Standards')).toBeVisible();
  await expect(page.getByText('Learning Objectives')).toBeVisible();
  await expect(page.getByText('We are learning to')).toBeVisible();
  await expect(page.getByText('Teaching Approach')).toBeVisible();
  await expect(page.getByText('Resources')).toBeVisible();

  // 5. Verify resources are listed
  await expect(page.getByText('Lesson 2 Slides.pptx')).toBeVisible();

  // 6. Click resource to view inline
  await page.getByText('Lesson 2 Slides.pptx').click();
  await expect(page.locator('iframe[title="File Viewer"]')).toBeVisible();

  // Success: Found materials in <30 seconds (manual timing)
});
```

## Testing Commands

```bash
# Unit tests
pnpm test                # Run all unit tests
pnpm test --watch        # Watch mode
pnpm test --coverage     # Generate coverage report

# E2E tests
pnpm test:e2e            # Run all E2E tests
pnpm test:e2e --ui       # Open Playwright UI
pnpm test:e2e --debug    # Debug mode
```

---
