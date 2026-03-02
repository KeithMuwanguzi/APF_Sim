export type DocumentType = "SYSTEM" | "USER"
export type DocumentStatus = "approved" | "pending" | "rejected" | "expired"

export interface Document {
  id: string
  name: string
  type: DocumentType
  status: DocumentStatus
  uploadedDate: string
  expiryDate?: string | null
  fileUrl?: string | null
  adminFeedback?: string | null
  reviewedBy?: string | null
  reviewedDate?: string | null
}

export const isExpired = (expiryDate?: string | null): boolean => {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}
