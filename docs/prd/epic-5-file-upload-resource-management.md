# Epic 5: File Upload & Resource Management

**Epic Goal:** Add comprehensive file upload capabilities with cloud storage integration, embedded file viewers for PDFs and documents, and resource association with lessons. Deliver complete file management workflow from upload through display, enabling users to store all lesson materials within the application for instant access. This epic fulfills the "hosted resources" requirement allowing teachers to consolidate materials in one place.

## Story 5.1: File Upload Infrastructure and Storage

As a developer,
I want cloud file storage configured with upload capabilities from browser,
so that users can upload lesson resource files and they are stored reliably.

**Acceptance Criteria:**

1. Cloud storage service integrated (AWS S3, Cloudflare R2, Backblaze B2, or similar) with credentials configured in environment variables
2. File upload API endpoint implemented: POST /api/lessons/:lessonId/files accepting multipart/form-data
3. Endpoint supports files up to 50MB per file
4. Endpoint validates file types: PDF (.pdf), PowerPoint (.pptx, .ppt), Word documents (.docx, .doc) only; rejects others with 400 Bad Request
5. Uploaded file stored in cloud storage with unique filename (UUID or hash-based to prevent collisions)
6. File metadata saved in database: id, lessonId (foreign key), originalFilename, storedFilename, fileSize, fileType (MIME type), uploadedAt timestamp
7. Successful upload returns JSON with file metadata including public URL for accessing file
8. Failed upload returns clear error: file too large, unsupported type, storage error, etc.
9. File upload endpoint requires authentication; return 401 if not authenticated
10. Files are stored securely with appropriate access controls (public read if no authentication needed for viewing, or presigned URLs for temporary access)

## Story 5.2: File Upload UI Component

As a user,
I want to upload files from my computer to associate with a lesson,
so that all lesson materials are stored together and easily accessible.

**Acceptance Criteria:**

1. Lesson detail page Resources section updated with "Upload File" button or drag-and-drop area
2. Clicking "Upload File" opens file picker dialog (browser native input type="file")
3. File picker restricts to accepted types: PDF, PPTX, PPT, DOCX, DOC (accept attribute configured)
4. Drag-and-drop area accepts files dragged from desktop; displays "Drop file here" message on hover
5. Multiple files can be selected or dropped simultaneously (up to 5 files at once)
6. Upload progress indicator displays for each file: progress bar, percentage, or spinner with "Uploading <filename>..."
7. Successful upload shows confirmation: "File uploaded successfully" with checkmark icon
8. Failed upload shows error: "Failed to upload <filename>: <reason>" in red text
9. Uploaded files immediately appear in Resources section list without page refresh
10. Upload button disabled during active upload to prevent duplicate submissions
11. File size limit (50MB) enforced in UI; files exceeding limit show error before upload attempt: "File too large. Maximum size: 50MB"

## Story 5.3: Resource List Display on Lesson Page

As a user,
I want to see all uploaded files for a lesson in an organized list,
so that I know what materials are available and can access them quickly.

**Acceptance Criteria:**

1. Lesson detail page Resources section displays list of all associated files
2. File list fetched via GET /api/lessons/:lessonId/files on page load
3. Each file displays: original filename, file type icon (PDF, PPTX, DOCX), file size (formatted: KB, MB), upload date
4. Files sorted by upload date descending (most recent first)
5. Empty resources section displays: "No files uploaded yet. Upload your first resource."
6. Each file entry has "View" button to open embedded viewer (Story 5.4)
7. Each file entry has "Download" link to download original file
8. Each file entry has "Delete" button (icon: trash can or X) to remove file
9. Resources section is collapsible with section heading "Resources (X files)" showing count
10. Section layout is responsive: file list stacks vertically on tablet viewports

## Story 5.4: Embedded File Viewers

As a user,
I want to preview uploaded files directly on the lesson page without downloading,
so that I can quickly check content without leaving the application.

**Acceptance Criteria:**

1. Clicking "View" button on PDF file opens embedded PDF viewer in modal or inline expansion
2. PDF viewer displays full document with scroll capability
3. PDF viewer includes basic controls: zoom in/out, fit to width, download button
4. Clicking "View" button on PPTX/PPT file opens embedded PowerPoint viewer (using Office Online viewer, Google Docs viewer, or similar embedded iframe)
5. PowerPoint viewer displays slides with navigation controls (if supported by viewer service)
6. Clicking "View" button on DOCX/DOC file opens embedded Word document viewer (using Office Online viewer, Google Docs viewer, or similar)
7. Word viewer displays formatted document with scroll capability
8. All viewers include "Close" button to dismiss and return to lesson page
9. Viewer modal/expansion is responsive: scales appropriately on tablet viewports
10. Viewer loading shows spinner or "Loading document..." message while content loads
11. Viewer error handling: if document fails to load, display error message: "Unable to preview this file. Try downloading instead." with download button

## Story 5.5: File Deletion and Management

As a user,
I want to delete uploaded files that are no longer needed,
so that I can keep lesson resources current and remove outdated materials.

**Acceptance Criteria:**

1. Clicking "Delete" button on file shows confirmation modal: "Are you sure you want to delete <filename>? This cannot be undone."
2. Confirmation modal has "Cancel" and "Delete" buttons
3. Clicking "Delete" in confirmation calls DELETE /api/lessons/:lessonId/files/:fileId
4. API endpoint removes file from cloud storage and deletes metadata from database
5. Successful deletion removes file from Resources list immediately without page refresh
6. Successful deletion shows brief confirmation: "File deleted" message
7. Failed deletion shows error: "Failed to delete file: <reason>" and file remains in list
8. Deleted files cannot be recovered (permanent deletion confirmed in UI messaging)
9. Deleting file while viewer is open closes viewer automatically
10. File deletion requires authentication; return 401 if not authenticated

## Story 5.6: Bulk File Operations

As a user,
I want to upload multiple files at once and manage files in batch,
so that I can efficiently organize many resources without repetitive individual uploads.

**Acceptance Criteria:**

1. File upload UI supports selecting multiple files (5 files maximum per batch)
2. Drag-and-drop area accepts multiple files simultaneously
3. Each file in batch shows individual upload progress
4. Failed files in batch do not cancel other uploads; each file handled independently
5. Batch upload completion shows summary: "Uploaded 4 of 5 files successfully. 1 failed." with details on failures
6. Resources list includes "Select Multiple" checkbox mode for bulk actions
7. Clicking "Select Multiple" enables checkboxes next to each file in list
8. Selecting multiple files enables "Delete Selected" button
9. "Delete Selected" shows confirmation: "Delete X selected files?" with count
10. Bulk delete processes all selected files with summary: "Deleted X files successfully" or "Failed to delete Y of X files"
11. "Select All" and "Deselect All" options available in checkbox mode
12. Exiting checkbox mode (clicking "Done" or "Cancel") deselects all files and hides checkboxes

## Story 5.7: File Type Icons and Visual Indicators

As a user,
I want clear visual indicators showing file types and status,
so that I can quickly identify document types without reading filenames.

**Acceptance Criteria:**

1. PDF files display red PDF icon or badge
2. PowerPoint files display orange/red PowerPoint icon or PPTX badge
3. Word documents display blue Word icon or DOCX badge
4. Icons positioned consistently (left of filename) in resources list
5. File size displayed in human-readable format: "1.2 MB", "345 KB"
6. Large files (>10 MB) have size displayed in bold or warning color to indicate potentially slow loading
7. Upload date formatted relative: "Today", "Yesterday", "3 days ago", or "Sep 29, 2025" for older files
8. Files currently being viewed have visual indicator (highlighted background or "Currently viewing" badge)
9. Failed uploads display error icon (red X or warning triangle) with error tooltip on hover
10. All icons and indicators are accessible with appropriate alt text or ARIA labels

---
