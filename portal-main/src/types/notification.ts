/**
 * Notification type definitions
 * Notifications are backend-generated and event-driven
 */

export type NotificationType = 
  | 'announcement'
  | 'system'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'membership'
  | 'payment'
  | 'security'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string // ISO 8601 format
  readAt?: string
  metadata?: {
    category?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    actionUrl?: string
    [key: string]: any
  }
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
  urgent: number
  byType: {
    announcement: number
    system: number
    membership: number
    payment: number
    security: number
  }
}
