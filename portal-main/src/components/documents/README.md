# Documents Components

This folder contains reusable components for the Documents page.

## Components

### DocumentCard
A card component that displays document information with status badges and actions.

**Props:**
- `document: Document` - The document data to display
- `onView?: (doc: Document) => void` - Callback when user clicks View button
- `onReupload?: (doc: Document) => void` - Callback when user clicks Re-upload button

**Features:**
- Status badges (Approved, Pending, Rejected, Expired)
- Conditional re-upload button (only for expired/rejected documents)
- Admin feedback display
- Expiry date tracking
- Responsive card layout

### UploadArea
A drag-and-drop upload area with file validation.

**Props:**
- `onUpload: (file: File) => Promise<boolean>` - Async callback for file upload
- `maxSizeMB?: number` - Maximum file size in MB (default: 5)
- `acceptedFormats?: string[]` - Accepted file formats (default: ['.jpg', '.jpeg', '.png', '.pdf'])

**Features:**
- Drag and drop support
- File browser fallback
- Upload progress states (idle, uploading, success)
- File size validation
- Visual feedback for drag over
- Security notice

## Usage Example

```tsx
import { DocumentCard } from '../../components/documents/DocumentCard'
import { UploadArea } from '../../components/documents/UploadArea'
import { useDocuments } from '../../hooks/useDocuments'

function MyPage() {
  const { documents, uploadDocument } = useDocuments()

  return (
    <div>
      {/* Display documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.system.map(doc => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onView={handleView}
            onReupload={handleReupload}
          />
        ))}
      </div>

      {/* Upload area */}
      <UploadArea onUpload={uploadDocument} />
    </div>
  )
}
```

## Document Types

- **SYSTEM**: Required documents (ICPAU License, National ID, etc.)
  - Approved documents show no "Submit for review" button
  - Re-upload only available if expired
  - Re-upload triggers admin review

- **USER**: Optional user uploads (CPD certificates, additional qualifications)
  - Always require admin approval
  - Show status badges (Pending, Approved, Rejected)
  - Re-upload available for rejected documents

## Grid Layout

The components are designed to work with Tailwind's responsive grid:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards here */}
</div>
```

This provides:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
