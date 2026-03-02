/**
 * Notifications service - handles all notification-related API calls
 * Notifications are in-app messages sent to users (announcements, system messages, etc.)
 * 
 * Backend endpoints:
 * - GET /api/v1/notifications/user-notifications/
 * - POST /api/v1/notifications/user-notifications/{id}/mark_read/
 * - POST /api/v1/notifications/user-notifications/mark_all_read/
 * - GET /api/v1/notifications/user-notifications/unread_count/
 */

import { API_V1_BASE_URL } from '../config/api'
import { getAccessToken } from '../utils/authStorage'

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
    priority?: 'low' | 'medium' | 'high'
    actionUrl?: string
    [key: string]: any
  }
}

export interface UserNotificationResponse {
  id: number
  title: string
  message: string
  notification_type: string
  priority: string
  is_read: boolean
  created_at: string
  read_at?: string
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

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Transform backend notification to frontend format
 */
function transformNotification(notification: UserNotificationResponse): Notification {
  return {
    id: notification.id.toString(),
    title: notification.title,
    message: notification.message,
    type: notification.notification_type as NotificationType,
    isRead: notification.is_read,
    createdAt: notification.created_at,
    readAt: notification.read_at,
    metadata: {
      priority: notification.priority as 'low' | 'medium' | 'high'
    }
  };
}

/**
 * Get all notifications for the current user
 * @param filter - Optional filter (all, unread, read)
 * @returns Promise with array of notifications
 */
export const getNotifications = async (filter?: string): Promise<Notification[]> => {
  try {
    const url = `${API_V1_BASE_URL}/notifications/user-notifications/`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: UserNotificationResponse[] = await response.json();
    
    // Apply filter if specified
    let filtered = data;
    if (filter === 'unread') {
      filtered = data.filter(n => !n.is_read);
    } else if (filter === 'read') {
      filtered = data.filter(n => n.is_read);
    }

    return filtered.map(transformNotification);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
}

/**
 * Get unread notification count
 * @returns Promise with unread count
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const url = `${API_V1_BASE_URL}/notifications/user-notifications/unread_count/`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.unread_count || 0;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return 0;
  }
}

/**
 * Get notification statistics
 * @returns Promise with notification stats
 */
export const getNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const notifications = await getNotifications();
    
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    const urgent = notifications.filter(n => n.metadata?.priority === 'high').length;

    const byType = {
      announcement: notifications.filter(n => n.type === 'announcement').length,
      system: notifications.filter(n => n.type === 'system').length,
      membership: notifications.filter(n => n.type === 'membership').length,
      payment: notifications.filter(n => n.type === 'payment').length,
      security: notifications.filter(n => n.type === 'security').length,
    };

    return {
      total,
      unread,
      read,
      urgent,
      byType
    };
  } catch (error) {
    console.error('Failed to fetch notification stats:', error);
    return {
      total: 0,
      unread: 0,
      read: 0,
      urgent: 0,
      byType: {
        announcement: 0,
        system: 0,
        membership: 0,
        payment: 0,
        security: 0
      }
    };
  }
}

/**
 * Mark a notification as read
 * @param notificationId - ID of notification to mark as read
 * @returns Promise with updated notification
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const url = `${API_V1_BASE_URL}/notifications/user-notifications/${notificationId}/mark_read/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: UserNotificationResponse = await response.json();
    return transformNotification(data);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 * @returns Promise with number of notifications marked as read
 */
export const markAllNotificationsAsRead = async (): Promise<number> => {
  try {
    const url = `${API_V1_BASE_URL}/notifications/user-notifications/mark_all_read/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.marked_read || 0;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete a notification (not implemented in backend yet)
 * @param _notificationId - ID of notification to delete
 * @returns Promise with success status
 */
export const deleteNotification = async (_notificationId: string): Promise<boolean> => {
  // TODO: Implement when backend supports deletion
  console.warn('Delete notification not implemented in backend yet');
  return false;
}
