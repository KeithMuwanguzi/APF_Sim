import React, { useState } from "react"
import { Calendar, ShieldCheck, FileText, Upload, AlertTriangle } from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { useDocuments } from "../../hooks/useDocuments"
import { Document } from "../../types/documents"
import { DocumentCard } from "../../components/documents/DocumentCard"
import { UploadArea } from "../../components/documents/UploadArea"
import { toastMessages, showInfo } from "../../utils/toast-helpers"
import { refreshDashboard } from "../../utils/dashboardEvents"

const DocumentsPage: React.FC = () => {
  const { documents, loading, uploadDocument, replaceDocument, viewDocument, downloadDocument, removeDocument } = useDocuments()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [documentToRemove, setDocumentToRemove] = useState<Document | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleViewDocument = async (doc: Document) => {
    if (!doc.fileUrl) {
      showInfo('No file available for this document yet.', 'Document Preview')
      return
    }
    
    const success = await viewDocument(doc.id)
    if (!success) {
      showInfo('Failed to view document. Please try again.', 'View Error')
    }
  }

  const handleDownloadDocument = async (doc: Document) => {
    const success = await downloadDocument(doc.id, doc.name)
    if (success) {
      toastMessages.document.downloaded(doc.name)
    } else {
      showInfo('Failed to download document. Please try again.', 'Download Error')
    }
  }

  const handleReuploadDocument = (doc: Document) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png,.pdf'
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const success = await replaceDocument(doc.id, target.files[0])
        if (success) {
          toastMessages.document.replaced(doc.name)
          // Refresh dashboard to update document info
          refreshDashboard()
        }
      }
    }
    input.click()
  }

  const handleRemoveDocument = async (doc: Document) => {
    // Check if document can be deleted (only pending or rejected)
    const canDelete = doc.status === 'pending' || doc.status === 'rejected'
    
    if (!canDelete) {
      showInfo("Approved documents can't be deleted.", 'Not Allowed')
      return
    }
    
    setDocumentToRemove(doc)
    setShowConfirmModal(true)
  }

  const confirmRemoveDocument = async () => {
    if (!documentToRemove) return
    
    console.log('[DocumentsPage] Confirming removal of:', documentToRemove.id, documentToRemove.name);
    
    setIsDeleting(true)
    
    try {
      const success = await removeDocument(documentToRemove.id)
      
      console.log('[DocumentsPage] Removal success:', success);
      
      if (success) {
        // Close modal automatically on success
        setShowConfirmModal(false)
        setDocumentToRemove(null)
        toastMessages.document.deleted(documentToRemove.name)
        
        // Refresh dashboard to update document count
        refreshDashboard()
      } else {
        // Keep modal open on error, show error message
        showInfo('Failed to delete document. Please try again.', 'Delete Error')
      }
    } catch (error) {
      console.error('[DocumentsPage] Remove error:', error)
      showInfo('Failed to delete document. Please try again.', 'Delete Error')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelRemoveDocument = () => {
    if (isDeleting) return // Prevent closing while deleting
    setShowConfirmModal(false)
    setDocumentToRemove(null)
  }

  const handleUploadNewDocument = async (
    file: File
  ): Promise<boolean> => {
    const success = await uploadDocument(file)
    if (success) {
      toastMessages.document.uploaded()
      // Refresh dashboard to update document count
      refreshDashboard()
    }
    return success
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents & Certificates</h1>
            <p className="text-gray-600">
              Manage your required documents and upload additional certificates for verification
            </p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 w-fit">
            <Calendar className="w-4 h-4" />
            {getCurrentDateFormatted()}
          </div>
        </div>

        {/*SECTION 1: UPLOAD NEW DOCUMENT */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload New Document</h2>
              <p className="text-sm text-gray-600">Add additional certificates or qualifications for admin review</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <UploadArea onUpload={handleUploadNewDocument} />
          </div>
        </div>

        {/* SECTION 2: OTHER DOCUMENTS (User Uploads) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Documents Pending Review</h2>
                <p className="text-sm text-gray-600">Additional certificates and qualifications (require admin review)</p>
              </div>
            </div>
          </div>

          {/* Grid of user-uploaded documents */}
          {documents.user.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.user.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                  onReupload={doc.status === 'rejected' ? handleReuploadDocument : undefined}
                  onRemove={handleRemoveDocument}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No additional documents uploaded yet</p>
              <p className="text-sm text-gray-500 mt-1">Upload your first document below</p>
            </div>
          )}
        </div>

        {/* SECTION 3: APPROVED DOCUMENTS (System Required) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Approved Documents</h2>
              <p className="text-sm text-gray-600">System-required documents for membership verification</p>
            </div>
          </div>

          {/* Grid of approved/system documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.system.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onReupload={handleReuploadDocument}
                onRemove={handleRemoveDocument}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && documentToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>

            {/* Confirmation Message */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Remove Document?</h3>
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to remove
            </p>
            <p className="text-gray-900 font-semibold text-center mb-4">
              "{documentToRemove.name}"
            </p>
            <p className="text-sm text-gray-500 text-center mb-8">
              This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelRemoveDocument}
                disabled={isDeleting}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveDocument}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default DocumentsPage
