# Coding Standards

## TypeScript Standards

**Type Annotations**:

- Always use explicit types for function parameters and return types
- Use type inference for variable declarations
- Prefer interfaces over type aliases for object shapes
- Use `unknown` instead of `any` when type is truly unknown

**Example**:

```typescript
// ✅ Good
interface LessonFormData {
  name: string;
  unitId: string;
  standards: string[];
}

function createLesson(data: LessonFormData): Promise<Lesson> {
  // Implementation
}

// ❌ Avoid
function createLesson(data: any): any {
  // Implementation
}
```

## React Best Practices

**Component Structure**:

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useLessonQuery } from '@/hooks/useLessonQuery';

// 2. Type definitions
interface LessonDetailProps {
  lessonId: string;
}

// 3. Component
export function LessonDetail({ lessonId }: LessonDetailProps) {
  // 4. Hooks (in order: state, queries, mutations, effects)
  const [isEditing, setIsEditing] = useState(false);
  const { data: lesson, isLoading } = useLessonQuery(lessonId);

  // 5. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 6. Conditional returns
  if (isLoading) return <Spinner />;
  if (!lesson) return <NotFound />;

  // 7. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Naming Conventions**:

- Components: PascalCase (`LessonCard`)
- Functions: camelCase (`createLesson`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Files: kebab-case (`lesson-card.tsx`) or PascalCase for components
- Hooks: camelCase with `use` prefix (`useLessonQuery`)

## API Route Standards

**Consistent Structure**:

```typescript
// 1. Imports
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { handleApiError } from '@/lib/api/errorHandler';

// 2. Type definitions
interface RouteParams {
  params: { id: string };
}

// 3. HTTP method handlers
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 4. Input validation
    const { id } = params;

    // 5. Business logic
    const data = await prisma.lesson.findUnique({ where: { id } });

    // 6. Response
    return NextResponse.json({ data });
  } catch (error) {
    // 7. Error handling
    return NextResponse.json(handleApiError(error));
  }
}
```

## Code Formatting

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

**ESLint Configuration** (`.eslintrc.json`):

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---
