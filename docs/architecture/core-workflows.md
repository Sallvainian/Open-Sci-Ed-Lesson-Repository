# Core Workflows

## Workflow 1: Find Tomorrow's Lesson Materials (Primary Use Case)

**User Goal**: Teacher needs to quickly access complete materials for tomorrow's lesson

**Steps**:

1. User opens application (HomePage)
2. Dashboard shows "Upcoming Lessons" widget
3. User clicks on tomorrow's lesson card
4. System navigates to Lesson Detail Page
5. Page displays:
   - Standards and objectives
   - Teaching approach
   - All resources with inline viewers
6. User reviews materials, clicks resource to view inline
7. **Success**: User found complete materials in <30 seconds

**Technical Flow**:

```typescript
// 1. HomePage fetches upcoming lessons
const { data: upcomingLessons } = useQuery({
  queryKey: ['lessons', 'upcoming'],
  queryFn: () => fetch('/api/calendar/upcoming?limit=5').then(r => r.json())
});

// 2. User clicks lesson card
router.push(`/lessons/${lesson.id}`);

// 3. Lesson Detail Page fetches full lesson data
const { data: lessonData } = useQuery({
  queryKey: ['lessons', lessonId],
  queryFn: () => fetch(`/api/lessons/${lessonId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000  // Cache for 5 minutes
});

// 4. Resources render with inline viewers
<FileViewerEmbed resource={resource} height="600px" />
```

## Workflow 2: Browse and Discover Lesson by Concept

**User Goal**: Teacher wants to find a lesson about "contact forces" in the Physical Science curriculum

**Steps**:

1. User clicks "Library View" in header navigation
2. System displays three-column layout:
   - Column 1: Disciplines (Physical Science selected by default)
   - Column 2: Units in Physical Science
   - Column 3: Empty (awaiting unit selection)
3. User clicks "8.1 Forces and Motion" unit
4. Column 3 populates with lessons in that unit
5. User scans lesson names, finds "Lesson 1: Investigating Contact Forces"
6. User clicks lesson card
7. System navigates to Lesson Detail Page
8. **Success**: User discovered relevant lesson through conceptual navigation

**Technical Flow**:

```typescript
// 1. LibraryViewPage maintains selection state
const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

// 2. Fetch disciplines
const { data: disciplines } = useQuery({
  queryKey: ['disciplines'],
  queryFn: () => fetch('/api/disciplines').then((r) => r.json()),
});

// 3. Fetch units when discipline selected
const { data: units } = useQuery({
  queryKey: ['units', selectedDiscipline],
  queryFn: () => fetch(`/api/units?discipline_id=${selectedDiscipline}`).then((r) => r.json()),
  enabled: !!selectedDiscipline,
});

// 4. Fetch lessons when unit selected
const { data: lessons } = useQuery({
  queryKey: ['lessons', selectedUnit],
  queryFn: () => fetch(`/api/lessons?unit_id=${selectedUnit}`).then((r) => r.json()),
  enabled: !!selectedUnit,
});
```

## Workflow 3: Add New Lesson to Repository

**User Goal**: Teacher wants to add a new lesson to the repository with complete template information

**Steps**:

1. User navigates to desired unit in Library View
2. User clicks "Add New Lesson" button
3. System displays Add Lesson Form with unit pre-selected
4. User fills in lesson template fields:
   - Lesson name and number
   - Standards (multi-select or text input)
   - Learning objectives (dynamic list)
   - Student-friendly targets ("We are learning to...")
   - Teaching approach (rich text)
   - Scheduled date
5. User uploads resources (PDFs, slides, handouts)
6. User clicks "Save Lesson"
7. System validates data, creates lesson record, uploads files
8. System navigates to newly created Lesson Detail Page
9. **Success**: New lesson added with complete information

**Technical Flow**:

```typescript
// 1. Add Lesson Form with React Hook Form
const form = useForm<LessonFormData>({
  resolver: zodResolver(createLessonSchema),
  defaultValues: {
    unitId: preselectedUnitId,
    standards: [],
    objectives: [],
    studentTargets: [],
  },
});

// 2. Submit handler
const onSubmit = async (data: LessonFormData) => {
  // Create lesson
  const response = await fetch('/api/lessons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const newLesson = await response.json();

  // Upload resources (if any)
  for (const file of uploadedFiles) {
    await uploadResource(newLesson.data.id, file);
  }

  // Navigate to new lesson
  router.push(`/lessons/${newLesson.data.id}`);
};

// 3. API Route Handler
export async function POST(request: Request) {
  const body = await request.json();
  const validated = createLessonSchema.parse(body);

  const lesson = await prisma.lesson.create({
    data: {
      ...validated,
      status: 'upcoming',
      displayOrder: await getNextDisplayOrder(validated.unitId),
    },
  });

  return Response.json({ data: lesson });
}
```

## Workflow 4: Search for Lesson by Keyword

**User Goal**: Teacher wants to find all lessons related to "Newton's Laws"

**Steps**:

1. User enters "Newton's Laws" in search bar (header or homepage)
2. System debounces input (500ms) and triggers search
3. System navigates to Search Results Page
4. Page displays:
   - Number of results
   - Results grouped by Discipline/Unit
   - Context snippets with keyword highlights
   - Relevance scores
5. User clicks on a result
6. System navigates to Lesson Detail Page
7. **Success**: User found relevant lessons through keyword search

**Technical Flow**:

```typescript
// 1. SearchBar with debounced input
const debouncedSearch = useDebouncedCallback((query: string) => {
  router.push(`/search?q=${encodeURIComponent(query)}`);
}, 500);

// 2. Search Results Page
const searchParams = useSearchParams();
const query = searchParams.get('q');

const { data: results } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetch(`/api/search?q=${encodeURIComponent(query!)}`).then((r) => r.json()),
  enabled: !!query,
});

// 3. API Route Handler with full-text search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const results = await prisma.lesson.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { standards: { hasSome: [query] } },
        { objectives: { hasSome: [query] } },
        { teachingApproach: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      unit: {
        include: { discipline: true },
      },
    },
  });

  // Transform to SearchResult format
  const searchResults: SearchResult[] = results.map((lesson) => ({
    lesson,
    unit: lesson.unit,
    discipline: lesson.unit.discipline,
    matchType: determineMatchType(lesson, query),
    snippet: generateSnippet(lesson, query),
    relevanceScore: calculateRelevance(lesson, query),
  }));

  return Response.json({ data: searchResults });
}
```

---
