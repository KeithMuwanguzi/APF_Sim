/**
 * Activity type definitions
 * Represents user activity events from the backend
 */

export type ActivityType = 
  | 'profile_update'
  | 'payment'
  | 'document_upload'
  | 'document_download'
  | 'forum_post'
  | 'forum_reply'
  | 'application_submit'
  | 'application_approved'
  | 'application_rejected'
  | 'other'

export interface Activity {
  id: string
  type: ActivityType | string
  message: string
  createdAt: string // ISO 8601 format
  metadata?: {
    icon?: string
    color?: string
    [key: string]: any
  }
}
