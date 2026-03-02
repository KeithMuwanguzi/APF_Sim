/**
 * Activity service - handles all activity-related API calls
 * Currently returns empty data - will be connected to backend API
 * 
 * Backend will record events when:
 * - Document uploaded
 * - Payment completed
 * - Admin approves/rejects
 * - User posts in forum
 * - Profile updated
 * 
 * Backend endpoint: GET /members/{id}/activity
 */

import { Activity } from '../types/activity'

/**
 * Get recent activity for the current user
 * @param _limit - Optional limit for number of activities to fetch
 * @returns Promise with array of activities
 */
export const getRecentActivity = async (_limit?: number): Promise<Activity[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/members/activity?limit=${_limit || 10}`, {
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`
  //   }
  // })
  // return response.json()
  
  return []
}

/**
 * Get activity by type
 * @param _type - Activity type filter
 * @returns Promise with filtered activities
 */
export const getActivityByType = async (_type: string): Promise<Activity[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/members/activity?type=${_type}`)
  // return response.json()
  
  return []
}

/**
 * Get activity within a date range
 * @param _startDate - Start date (ISO format)
 * @param _endDate - End date (ISO format)
 * @returns Promise with activities in date range
 */
export const getActivityByDateRange = async (_startDate: string, _endDate: string): Promise<Activity[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/members/activity?start=${_startDate}&end=${_endDate}`)
  // return response.json()
  
  return []
}
