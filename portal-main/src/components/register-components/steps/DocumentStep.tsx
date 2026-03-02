import { useEffect } from "react";
import CloudUpload from "./UploadCard";
import { DocumentData } from "../../../types/registration";

interface DocumentsStepProps {
  documents: DocumentData[];
  onChange: (documents: DocumentData[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Document field identifiers
const DOCUMENT_FIELDS = {
  NATIONAL_ID_FRONT: 'national_id_front',
  NATIONAL_ID_BACK: 'national_id_back',
  PRACTISING_CERTIFICATE: 'practising_certificate',
  PASSPORT_PHOTO: 'passport_photo',
} as const;

const REQUIRED_DOCUMENT_IDS = [
  DOCUMENT_FIELDS.NATIONAL_ID_FRONT,
  DOCUMENT_FIELDS.NATIONAL_ID_BACK,
  DOCUMENT_FIELDS.PRACTISING_CERTIFICATE,
  DOCUMENT_FIELDS.PASSPORT_PHOTO,
] as const;


function DocumentsStep({ documents, onChange, onValidationChange }: DocumentsStepProps) {
  // Helper to find document by field ID
  const getDocumentByField = (fieldId: string): DocumentData | undefined => {
    return documents.find(doc => doc.id === fieldId);
  };

  // Helper to check if at least one document is uploaded
  // const hasAtLeastOneDocument = (): boolean => {
  //   return documents.some(doc => doc.file && doc.uploadStatus === 'uploaded');
  // };

  const hasAllRequiredDocuments = (): boolean => {
  return REQUIRED_DOCUMENT_IDS.every((id) =>
    documents.some(
      (doc) =>
        doc.id === id &&
        doc.uploadStatus === 'uploaded' &&
        doc.file instanceof File
    )
  );
};


  // Update validation state whenever documents change
  useEffect(() => {
    const isValid = hasAllRequiredDocuments();
    onValidationChange(isValid);
  }, [documents, onValidationChange]);

 
  
  // Handle file selection for a specific field
  const handleFileSelected = (fieldId: string, file: File) => {
    const newDocument: DocumentData = {
      id: fieldId,
      file: file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadStatus: 'uploaded',
    };

    // Update or add document
    const existingIndex = documents.findIndex(doc => doc.id === fieldId);
    let updatedDocuments: DocumentData[];
    
    if (existingIndex >= 0) {
      // Replace existing document
      updatedDocuments = [...documents];
      updatedDocuments[existingIndex] = newDocument;
    } else {
      // Add new document
      updatedDocuments = [...documents, newDocument];
    }

    onChange(updatedDocuments);
  };


  // Handle file removal for a specific field
  const handleFileRemoved = (fieldId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== fieldId);
    onChange(updatedDocuments);
  };

  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6">
        Document Uploads
      </h3>

      <div className="space-y-6">
        <CloudUpload
          title="Upload National ID (Front)"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.NATIONAL_ID_FRONT, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.NATIONAL_ID_FRONT)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.NATIONAL_ID_FRONT)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.NATIONAL_ID_FRONT)?.errorMessage || null}
        />

        <CloudUpload
          title="Upload National ID (Back)"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.NATIONAL_ID_BACK, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.NATIONAL_ID_BACK)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.NATIONAL_ID_BACK)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.NATIONAL_ID_BACK)?.errorMessage || null}
        />

        <CloudUpload
          title="Upload Practising Certificate"
          description="Max file size 5MB · JPG / PNG / PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={5}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.PRACTISING_CERTIFICATE, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.PRACTISING_CERTIFICATE)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.PRACTISING_CERTIFICATE)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.PRACTISING_CERTIFICATE)?.errorMessage || null}
        />

        <CloudUpload
          title="Upload Passport Photo"
          description="Max file size 2MB · JPG / PNG"
          accept=".jpg,.jpeg,.png"
          maxSizeMB={2}
          onFileSelected={(file) => handleFileSelected(DOCUMENT_FIELDS.PASSPORT_PHOTO, file)}
          onFileRemoved={() => handleFileRemoved(DOCUMENT_FIELDS.PASSPORT_PHOTO)}
          existingFile={getDocumentByField(DOCUMENT_FIELDS.PASSPORT_PHOTO)?.file || null}
          existingError={getDocumentByField(DOCUMENT_FIELDS.PASSPORT_PHOTO)?.errorMessage || null}
        />
      </div>

      {/* Validation message */}
      {documents.length === 0 && (
        <p className="text-xs text-gray-500 mt-4">
          Please upload at least one document to continue
        </p>
      )}
    </>
  );
}

export default DocumentsStep;
