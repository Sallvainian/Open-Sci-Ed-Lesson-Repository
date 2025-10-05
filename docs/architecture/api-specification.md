# API Specification

## REST API Endpoints

### Discipline Endpoints

```http
GET /api/disciplines
```

- **Description**: List all disciplines with optional unit counts
- **Query Params**: `include_units` (boolean)
- **Response**: `ApiResponse<Discipline[]>`
- **Use Case**: Populate Library View navigation

```http
GET /api/disciplines/:id
```

- **Description**: Get single discipline with nested units
- **Response**: `ApiResponse<Discipline & { units: Unit[] }>`
- **Use Case**: Discipline detail page

### Unit Endpoints

```http
GET /api/units
```

- **Description**: List units with filtering
- **Query Params**: `discipline_id` (string), `include_lessons` (boolean)
- **Response**: `ApiResponse<Unit[]>`
- **Use Case**: Filter units by discipline

```http
GET /api/units/:id
```

- **Description**: Get single unit with nested lessons
- **Response**: `ApiResponse<Unit & { lessons: Lesson[] }>`
- **Use Case**: Unit detail page, Library View

```http
POST /api/units
```

- **Description**: Create new unit (admin)
- **Body**: `Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `ApiResponse<Unit>`
- **Use Case**: Add new curriculum unit

```http
PUT /api/units/:id
```

- **Description**: Update unit metadata
- **Body**: `Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>`
- **Response**: `ApiResponse<Unit>`
- **Use Case**: Edit unit details

### Lesson Endpoints

```http
GET /api/lessons
```

- **Description**: List lessons with filtering and sorting
- **Query Params**:
  - `unit_id` (string)
  - `status` (LessonStatus)
  - `scheduled_after` (ISO date)
  - `scheduled_before` (ISO date)
  - `sort` ('display_order' | 'scheduled_date' | 'name')
  - `include_resources` (boolean)
- **Response**: `ApiResponse<Lesson[]>`
- **Use Case**: Calendar View, upcoming lessons widget

```http
GET /api/lessons/:id
```

- **Description**: Get single lesson with all details
- **Response**: `ApiResponse<Lesson & { unit: Unit, discipline: Discipline, resources: Resource[] }>`
- **Use Case**: Lesson Detail Page (primary use case)

```http
POST /api/lessons
```

- **Description**: Create new lesson
- **Body**: `Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Add New Lesson Form

```http
PUT /api/lessons/:id
```

- **Description**: Update lesson (full or partial)
- **Body**: `Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Inline editing on Lesson Detail Page

```http
PATCH /api/lessons/:id/status
```

- **Description**: Update lesson status only
- **Body**: `{ status: LessonStatus, completedDate?: Date }`
- **Response**: `ApiResponse<Lesson>`
- **Use Case**: Quick status toggle

```http
DELETE /api/lessons/:id
```

- **Description**: Delete lesson (soft delete recommended)
- **Response**: `ApiResponse<{ success: boolean }>`
- **Use Case**: Remove obsolete lessons

### Resource Endpoints

```http
GET /api/resources
```

- **Description**: List resources with filtering
- **Query Params**: `lesson_id` (string), `category` (ResourceCategory)
- **Response**: `ApiResponse<Resource[]>`
- **Use Case**: Fetch resources for lesson

```http
GET /api/resources/:id
```

- **Description**: Get single resource metadata
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Resource details before download

```http
POST /api/resources
```

- **Description**: Upload new resource
- **Body**: `multipart/form-data` with file + metadata
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Add resource to lesson

```http
PUT /api/resources/:id
```

- **Description**: Update resource metadata
- **Body**: `Partial<Omit<Resource, 'id' | 'fileUrl' | 'uploadedAt'>>`
- **Response**: `ApiResponse<Resource>`
- **Use Case**: Rename file, change category

```http
DELETE /api/resources/:id
```

- **Description**: Delete resource (removes file from storage)
- **Response**: `ApiResponse<{ success: boolean }>`
- **Use Case**: Remove outdated materials

```http
GET /api/resources/:id/download
```

- **Description**: Generate signed download URL
- **Response**: `ApiResponse<{ downloadUrl: string, expiresAt: Date }>`
- **Use Case**: Secure file downloads

### Search Endpoint

```http
GET /api/search
```

- **Description**: Full-text search across lessons
- **Query Params**:
  - `q` (string, required) - search query
  - `discipline_id` (string, optional)
  - `unit_id` (string, optional)
  - `limit` (number, default 20)
- **Response**: `ApiResponse<SearchResult[]>`
- **Use Case**: Search Results Page
- **Search Fields**: lesson.name, standards, objectives, teachingApproach, teacherNotes

### Calendar Endpoints

```http
GET /api/calendar
```

- **Description**: Get lessons organized by scheduled dates
- **Query Params**:
  - `start_date` (ISO date, required)
  - `end_date` (ISO date, required)
- **Response**: `ApiResponse<Record<string, Lesson[]>>`
- **Use Case**: Calendar View, pacing guide

```http
GET /api/calendar/upcoming
```

- **Description**: Get next N upcoming lessons
- **Query Params**: `limit` (number, default 5)
- **Response**: `ApiResponse<Lesson[]>`
- **Use Case**: Home Dashboard upcoming lessons widget

## API Error Responses

```typescript
interface ApiError {
  error: string; // Error code (e.g., "NOT_FOUND", "VALIDATION_ERROR")
  message: string; // Human-readable message
  details?: any; // Additional context (validation errors, etc.)
  statusCode: number; // HTTP status code
}
```

**Standard Error Codes**:

- `400 BAD_REQUEST` - Invalid request parameters
- `404 NOT_FOUND` - Resource not found
- `422 VALIDATION_ERROR` - Data validation failed
- `500 INTERNAL_ERROR` - Server error

---
