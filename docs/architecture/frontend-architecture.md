# Frontend Architecture

## App Router Structure

```
app/
├── layout.tsx                     # Root layout with providers
├── page.tsx                       # HomePage (dashboard)
├── globals.css                    # Global styles
├── calendar/
│   └── page.tsx                   # CalendarViewPage
├── library/
│   └── page.tsx                   # LibraryViewPage
├── lessons/
│   ├── [id]/
│   │   └── page.tsx               # LessonDetailPage (dynamic route)
│   └── new/
│       └── page.tsx               # AddLessonPage
├── search/
│   └── page.tsx                   # SearchResultsPage
└── api/                           # API routes (backend)
    ├── disciplines/
    │   ├── route.ts               # GET /api/disciplines
    │   └── [id]/
    │       └── route.ts           # GET /api/disciplines/:id
    ├── units/
    │   ├── route.ts               # GET /api/units
    │   └── [id]/
    │       └── route.ts           # GET/PUT /api/units/:id
    ├── lessons/
    │   ├── route.ts               # GET/POST /api/lessons
    │   └── [id]/
    │       ├── route.ts           # GET/PUT/DELETE /api/lessons/:id
    │       └── status/
    │           └── route.ts       # PATCH /api/lessons/:id/status
    ├── resources/
    │   ├── route.ts               # GET/POST /api/resources
    │   └── [id]/
    │       ├── route.ts           # GET/PUT/DELETE /api/resources/:id
    │       └── download/
    │           └── route.ts       # GET /api/resources/:id/download
    ├── search/
    │   └── route.ts               # GET /api/search
    └── calendar/
        ├── route.ts               # GET /api/calendar
        └── upcoming/
            └── route.ts           # GET /api/calendar/upcoming
```

## State Management Strategy

**Server State (TanStack Query)**:

- All data fetching from API
- Automatic caching and refetching
- Optimistic updates for mutations
- Background refetching for stale data

**Client State (Zustand)**:

```typescript
// stores/navigationStore.ts
interface NavigationState {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  mode: 'library', // Default mode
  setMode: (mode) => set({ mode }),
}));
```

**Local Storage**:

- Navigation mode preference
- Recent searches
- UI preferences (compact view, etc.)

## Data Fetching Patterns

**Page-Level Data Fetching** (Server Components):

```typescript
// app/lessons/[id]/page.tsx
export default async function LessonDetailPage({ params }: { params: { id: string } }) {
  // Fetch initial data on server
  const lesson = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/lessons/${params.id}`)
    .then(r => r.json());

  return <LessonDetailClient initialData={lesson} />;
}
```

**Client-Side Data Fetching** (useQuery):

```typescript
// Client component
function LessonDetailClient({ initialData }: { initialData: Lesson }) {
  const {
    data: lesson,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', initialData.id],
    queryFn: () => fetch(`/api/lessons/${initialData.id}`).then((r) => r.json()),
    initialData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Render lesson detail UI
}
```

**Mutations with Optimistic Updates**:

```typescript
const updateLessonMutation = useMutation({
  mutationFn: (data: Partial<Lesson>) =>
    fetch(`/api/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['lessons', lessonId]);

    // Snapshot previous value
    const previousLesson = queryClient.getQueryData(['lessons', lessonId]);

    // Optimistically update
    queryClient.setQueryData(['lessons', lessonId], (old: Lesson) => ({
      ...old,
      ...newData,
    }));

    return { previousLesson };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['lessons', lessonId], context?.previousLesson);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['lessons', lessonId]);
  },
});
```

## Routing and Navigation

**Programmatic Navigation**:

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigate to lesson detail
router.push(`/lessons/${lesson.id}`);

// Navigate with search params
router.push(`/search?q=${encodeURIComponent(query)}`);

// Navigate back
router.back();
```

**Link Components** (Prefetching):

```typescript
import Link from 'next/link';

<Link href={`/lessons/${lesson.id}`} prefetch={true}>
  {lesson.name}
</Link>
```

## Performance Optimizations

1. **Server Components by Default**
   - Most pages use React Server Components
   - Reduces client-side JavaScript
   - Faster initial page loads

2. **Code Splitting**
   - Dynamic imports for heavy components

   ```typescript
   const FileViewerEmbed = dynamic(() => import('@/components/resources/FileViewerEmbed'), {
     loading: () => <Spinner />,
     ssr: false
   });
   ```

3. **Image Optimization**

   ```typescript
   import Image from 'next/image';

   <Image
     src="/logo.png"
     alt="Logo"
     width={200}
     height={100}
     priority={true}  // For above-the-fold images
   />
   ```

4. **Route Caching**
   - Static routes cached at CDN edge
   - Dynamic routes use ISR (Incremental Static Regeneration)

   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

5. **Bundle Analysis**
   ```bash
   ANALYZE=true npm run build  # Analyze bundle sizes
   ```

---
