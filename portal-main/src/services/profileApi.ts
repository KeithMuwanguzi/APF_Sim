/**
 * Profile API Service
 * 
 * Handles communication with the backend API for user profile management.
 * Updated to use the new profiles app endpoints.
 */

import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

/**
 * User profile interface - updated to match backend model
 */
export interface UserProfile {
  // Computed fields
  full_name: string;
  initials: string;
  profile_picture_url: string | null;
  
  // User info
  email: string;
  user_role: string; // '1' for admin, '2' for member
  date_joined: string;
  
  // Personal Information
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string | null;
  gender: string;
  
  // Contact Information
  phone_number: string;
  alternative_phone: string;
  
  // Address Information
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  
  // Professional Information
  job_title: string;
  organization: string;
  department: string;
  icpau_registration_number: string;
  years_of_experience: number | null;
  specializations: string;
  
  // Profile Picture
  profile_picture: string | null;
  
  // Bio and Additional Info
  bio: string;
  website: string;
  linkedin_profile: string;
  
  // Preferences
  preferred_language: string;
  timezone: string;
  
  // Privacy Settings
  profile_visibility: string;
  show_email: boolean;
  show_phone: boolean;
  
  // Notification Preferences
  email_notifications: boolean;
  sms_notifications: boolean;
  newsletter_subscription: boolean;
  event_notifications: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  is_profile_complete: boolean;
}

/**
 * Profile completion status
 */
export interface ProfileCompletionStatus {
  overall_percentage: number;
  categories: {
    [key: string]: {
      percentage: number;
      filled_fields: number;
      total_fields: number;
      missing_fields: string[];
    };
  };
  missing_fields: string[];
  suggestions: Array<{
    priority: 'high' | 'medium' | 'low';
    message: string;
    action: string;
  }>;
}

/**
 * Profile activity log entry
 */
export interface ProfileActivity {
  action: string;
  field_changed: string;
  timestamp: string;
}

/**
 * Profile update data interface
 */
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  date_of_birth?: string | null;
  gender?: string;
  phone_number?: string;
  alternative_phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  job_title?: string;
  organization?: string;
  department?: string;
  icpau_registration_number?: string;
  years_of_experience?: number | null;
  specializations?: string;
  bio?: string;
  website?: string;
  linkedin_profile?: string;
  preferred_language?: string;
  timezone?: string;
}

/**
 * Privacy settings interface
 */
export interface PrivacySettings {
  profile_visibility: string;
  show_email: boolean;
  show_phone: boolean;
}

/**
 * Notification preferences interface
 */
export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  newsletter_subscription: boolean;
  event_notifications: boolean;
}

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Get multipart form headers with JWT token
 */
function getMultipartHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Handle API errors
 */
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Extract error message from response
    let errorMessage = 'An error occurred';
    
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      // Check for various error formats
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.errors) {
        // Handle validation errors
        const errors = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        errorMessage = errors || 'Validation error';
      }
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }
    
    console.error('API Error:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: errorMessage
    });
    
    // Throw a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = axiosError.response;
    throw enhancedError;
  }
  
  throw error;
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get<UserProfile>(
      `${API_BASE_URL}/api/v1/auth/profile/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    handleApiError(error);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: ProfileUpdateData): Promise<UserProfile> {
  try {
    const response = await axios.patch<UserProfile>(
      `${API_BASE_URL}/api/v1/auth/profile/`,
      data,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    handleApiError(error);
  }
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(file: File): Promise<{
  message: string;
  profile_picture_url: string | null;
  initials: string;
}> {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/profile/upload-picture/`,
      formData,
      {
        headers: getMultipartHeaders(),
        timeout: 60000, // Longer timeout for file upload
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    handleApiError(error);
  }
}

/**
 * Remove profile picture
 */
export async function removeProfilePicture(): Promise<{
  message: string;
  initials: string;
}> {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/auth/profile/remove-picture/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to remove profile picture:', error);
    handleApiError(error);
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(settings: PrivacySettings): Promise<{
  message: string;
  settings: PrivacySettings;
}> {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/auth/profile/privacy-settings/`,
      settings,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update privacy settings:', error);
    handleApiError(error);
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(preferences: NotificationPreferences): Promise<{
  message: string;
  preferences: NotificationPreferences;
}> {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/auth/profile/notification-preferences/`,
      preferences,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    handleApiError(error);
  }
}

/**
 * Get profile completion status
 */
export async function getProfileCompletionStatus(): Promise<ProfileCompletionStatus> {
  try {
    const response = await axios.get<ProfileCompletionStatus>(
      `${API_BASE_URL}/api/v1/auth/profile/completion-status/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile completion status:', error);
    handleApiError(error);
  }
}

/**
 * Get profile activity log
 */
export async function getProfileActivityLog(): Promise<{ activities: ProfileActivity[] }> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/auth/profile/activity-log/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile activity log:', error);
    handleApiError(error);
  }
}

/**
 * Change user password
 */
export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/profile/change-password/`,
      data,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    handleApiError(error);
  }
}

/**
 * Validate file for profile picture upload
 */
export function validateProfilePicture(file: File): string | null {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'Profile picture must be less than 5MB';
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, GIF, and WebP images are allowed';
  }
  
  return null;
}

/**
 * Generate initials from name
 */
export function generateInitials(firstName: string, lastName: string, email?: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  
  if (email) {
    const emailName = email.split('@')[0];
    return emailName.substring(0, 2).toUpperCase();
  }
  
  return 'U';
}
