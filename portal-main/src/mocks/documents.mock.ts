/**
 * Mock document data for the Documents page
 * This will be replaced with API calls when backend is ready
 */

export type DocumentType = "SYSTEM" | "USER"
export type DocumentStatus = "approved" | "pending" | "rejected" | "expired"

export interface Document {
  id: string
  name: string
  type: DocumentType
  status: DocumentStatus
  uploadedDate: string
  expiryDate?: string
  fileUrl?: string
  adminFeedback?: string
  reviewedBy?: string
  reviewedDate?: string
}

/**
 * System-required documents (ICPAU License, National ID, etc.)
 * These are mandatory for membership verification
 */
export const systemDocuments: Document[] = [
  {
    id: "sys-1",
    name: "ICPAU Licence",
    type: "SYSTEM",
    status: "approved",
    uploadedDate: "2023-10-26",
    expiryDate: "2025-12-31",
    fileUrl: "/documents/icpau-licence.pdf",
    adminFeedback: "Verified and approved by admin team",
    reviewedBy: "John Doe",
    reviewedDate: "2023-10-27",
  },
  {
    id: "sys-2",
    name: "National ID",
    type: "SYSTEM",
    status: "approved",
    uploadedDate: "2023-10-26",
    fileUrl: "/documents/national-id.pdf",
    adminFeedback: "Identity verified successfully",
    reviewedBy: "Jane Smith",
    reviewedDate: "2023-10-27",
  },
  {
    id: "sys-3",
    name: "Professional Certificate",
    type: "SYSTEM",
    status: "expired",
    uploadedDate: "2022-08-15",
    expiryDate: "2024-01-15",
    fileUrl: "/documents/professional-cert.pdf",
    adminFeedback: "Certificate has expired. Please upload renewed version.",
  },
]

/**
 * User-uploaded documents (optional, require admin review)
 * These are additional documents submitted by members
 */
export const userDocuments: Document[] = [
  {
    id: "user-1",
    name: "CPD Certificate - Tax Workshop 2023",
    type: "USER",
    status: "approved",
    uploadedDate: "2023-11-10",
    fileUrl: "/documents/cpd-tax-2023.pdf",
    adminFeedback: "CPD certificate verified",
    reviewedBy: "Admin Team",
    reviewedDate: "2023-11-11",
  },
  {
    id: "user-2",
    name: "Additional Qualification - CPA",
    type: "USER",
    status: "pending",
    uploadedDate: "2023-12-01",
    fileUrl: "/documents/cpa-cert.pdf",
    adminFeedback: "Under review by admin team",
  },
  {
    id: "user-3",
    name: "Professional Membership - ACCA",
    type: "USER",
    status: "rejected",
    uploadedDate: "2023-09-15",
    fileUrl: "/documents/acca-membership.pdf",
    adminFeedback: "Document quality is poor. Please upload a clearer scan.",
    reviewedBy: "Admin Team",
    reviewedDate: "2023-09-16",
  },
  {
    id: "user-4",
    name: "Ethics Training Certificate",
    type: "USER",
    status: "approved",
    uploadedDate: "2023-08-20",
    fileUrl: "/documents/ethics-cert.pdf",
    adminFeedback: "Certificate approved",
    reviewedBy: "Admin Team",
    reviewedDate: "2023-08-21",
  },
]

/**
 * Utility function to check if a document is expired
 */
export const isExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

/**
 * Get document status display text
 */
export const getStatusText = (doc: Document): string => {
  if (isExpired(doc.expiryDate)) return "Expired"
  return doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
}

/**
 * Get all documents (for API simulation)
 */
export const getAllDocuments = (): Document[] => {
  return [...systemDocuments, ...userDocuments]
}

/**
 * Get documents by type
 */
export const getDocumentsByType = (type: DocumentType): Document[] => {
  return getAllDocuments().filter(doc => doc.type === type)
}

/**
 * Get documents by status
 */
export const getDocumentsByStatus = (status: DocumentStatus): Document[] => {
  return getAllDocuments().filter(doc => doc.status === status)
}
