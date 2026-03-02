/**
 * Local Activity Tracker (DEPRECATED)
 * 
 * @deprecated This utility is no longer used. Recent Activity is now provided
 * directly by the backend API through the dashboard endpoint.
 * 
 * The backend returns a complete activity feed that includes:
 * - Profile updates (ProfileActivityLog)
 * - Document activities (UserNotification)
 * 
 * All activities are sorted by timestamp and limited to 10 items on the backend.
 * 
 * This file is kept for reference only and may be removed in a future cleanup.
 */

interface LocalActivity {
  id: string;
  action: string;
  message: string;
  timestamp: string;
}

const ACTIVITY_KEY = 'local_activities';
const MAX_ACTIVITIES = 10;

/**
 * @deprecated Use backend API activity feed instead
 */
export const addLocalActivity = (action: string, message: string): void => {
  console.warn('addLocalActivity is deprecated. Activities are now tracked by the backend.');
  // Functionality disabled - backend handles all activity tracking
};

/**
 * @deprecated Use backend API activity feed instead
 */
export const getLocalActivities = (): LocalActivity[] => {
  console.warn('getLocalActivities is deprecated. Use backend API activity feed instead.');
  return [];
};

/**
 * @deprecated Use backend API activity feed instead
 */
export const clearLocalActivities = (): void => {
  console.warn('clearLocalActivities is deprecated. Activities are managed by the backend.');
  // Functionality disabled
};

/**
 * @deprecated Use backend API activity feed instead
 */
export const mergeActivities = (backendActivities: any[]): any[] => {
  console.warn('mergeActivities is deprecated. Backend provides complete activity feed.');
  return backendActivities;
};