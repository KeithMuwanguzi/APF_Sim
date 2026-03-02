/**
 * Application API Client
 * Feature: membership-registration-payment
 * 
 * Handles communication with the backend API for application submission.
 * Requirements: 9.2, 9.5, 13.2
 */

import axios, { AxiosError } from 'axios';
import { ApplicationSubmissionData } from '../types/registration';
import { Application } from '../types/Application';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

/**
 * Shape of application items returned by the backend list endpoint
 */
interface ApplicationListItem {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  national_id_number?: string;
  icpau_certificate_number?: string;
  payment_status: string;
  status: string;
  submitted_at: string;
}

/**
 * Map raw API application list item to UI `Application` type
 */
function mapApiApplicationToApplication(app: ApplicationListItem): Application {
  // Derive full name
  const name = `${app.first_name} ${app.last_name}`.trim();

  // Map status to constrained union used in the UI
  const rawStatus = (app.status || '').toLowerCase();
  let status: Application['status'];
  if (rawStatus === 'approved') {
    status = 'Approved';
  } else if (rawStatus === 'rejected') {
    status = 'Rejected';
  } else {
    status = 'Pending';
  }

  // Map payment status
  const rawPaymentStatus = (app.payment_status || '').toLowerCase();
  const feeStatus: Application['feeStatus'] =
    rawPaymentStatus === 'success' || rawPaymentStatus === 'completed'
      ? 'Paid'
      : 'Not Paid';

  // Normalize submitted date to YYYY-MM-DD for display
  let submissionDate = app.submitted_at;
  const parsedDate = new Date(app.submitted_at);
  if (!Number.isNaN(parsedDate.getTime())) {
    submissionDate = parsedDate.toISOString().split('T')[0];
  }

  // Category is not yet defined in the backend response type.
  // Default to "Full Member" until backend adds a specific field.
  const category: Application['category'] = 'Full Member';

  return {
    id: app.id,
    name,
    email: app.email,
    category,
    icpaCertNo: app.icpau_certificate_number || "N/A", // Use actual backend field
    feeStatus,
    status,
    submissionDate,
  };
}

/**
 * Detailed application data returned by the backend detail endpoint
 */
export interface ApplicationDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age_range: string;
  phone_number: string;
  address: string;
  national_id_number: string;
  icpau_certificate_number: string;
  payment_method: string;
  payment_phone?: string;
  payment_card_number?: string;
  payment_card_expiry?: string;
  payment_cardholder_name?: string;
  payment_status: string;
  payment_transaction_reference?: string;
  payment_error_message?: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  documents: {
    id: number;
    file: string;
    file_name: string;
    file_size: number;
    file_type: string;
    document_type: string;
    uploaded_at: string;
  }[];
}

/**
 * Fetch applications for admin approval dashboard
 */
export async function fetchApplications(): Promise<Application[]> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      console.error('No access token found - user not logged in');
      return [];
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<ApplicationListItem[]>(
      `${API_BASE_URL}/api/v1/applications/`,
      {
        headers,
        timeout: 30000,
      }
    );

    return response.data.map(mapApiApplicationToApplication);
  } catch (error) {
    console.error('Failed to fetch applications', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be invalid or expired');
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return [];
  }
}

/**
 * Fetch a single application's detailed information
 * 
 * @param applicationId - ID of the application to fetch
 * @returns Promise with application detail or null if not found
 */
export async function fetchApplicationDetail(applicationId: number): Promise<ApplicationDetail | null> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      console.error('No access token found - user not logged in');
      return null;
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<ApplicationDetail>(
      `${API_BASE_URL}/api/v1/applications/${applicationId}/`,
      {
        headers,
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch application detail', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be invalid or expired');
      }
    }
    return null;
  }
}

/**
 * API response for successful application submission
 */
export interface ApplicationAPIResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age_range: string;
  phoneNumber: string;
  address: string;
  nationalIdNumber: string;
  icpauCertificateNumber: string;
  organization?: string;
  paymentMethod: string;
  paymentPhone?: string;
  paymentCardNumber?: string;
  paymentCardExpiry?: string;
  paymentCardholderName?: string;
  paymentStatus?: string;
  paymentTransactionReference?: string;
  paymentErrorMessage?: string;
  status: string;
  submittedAt: string;
  documents: any[];
}

/**
 * API error response structure
 */
export interface ApplicationAPIError {
  errors: {
    [field: string]: string[];
  };
}

/**
 * Result type for application submission
 */
export interface SubmissionResult {
  success: boolean;
  data?: ApplicationAPIResponse;
  error?: string;
  fieldErrors?: {
    [field: string]: string[];
  };
}

/**
 * Submit application to backend API
 * 
 * Creates FormData with all application fields and uploaded documents,
 * sends POST request to /api/v1/applications/, and handles response/errors.
 * 
 * @param applicationData - Complete application data including files
 * @returns Promise with submission result
 * 
 * Requirements: 9.2, 9.5, 13.2
 */
export async function submitApplication(
  applicationData: ApplicationSubmissionData
): Promise<SubmissionResult> {
  try {
    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    
    // Add account details
    formData.append('username', applicationData.username);
    formData.append('email', applicationData.email);
    formData.append('password_hash', applicationData.password); // Backend expects password_hash
    
    // Add personal information
    formData.append('first_name', applicationData.firstName);
    formData.append('last_name', applicationData.lastName);
    formData.append('age_range', applicationData.age_range);
    formData.append('phone_number', applicationData.phoneNumber);
    formData.append('address', applicationData.address);
    formData.append('national_id_number', applicationData.nationalIdNumber);
    formData.append('icpau_certificate_number', applicationData.icpauCertificateNumber);
    
    // Add optional organization field
    if (applicationData.organization) {
      formData.append('organization', applicationData.organization);
    }
    
    // Add payment information
    formData.append('payment_method', applicationData.paymentMethod);
    
    // Add payment-specific fields based on method
    if (applicationData.paymentMethod === 'mtn' || applicationData.paymentMethod === 'airtel') {
      if (applicationData.paymentPhone) {
        formData.append('payment_phone', applicationData.paymentPhone);
      }
    } else if (applicationData.paymentMethod === 'credit_card') {
      if (applicationData.paymentCardNumber) {
        formData.append('payment_card_number', applicationData.paymentCardNumber);
      }
      if (applicationData.paymentCardExpiry) {
        formData.append('payment_card_expiry', applicationData.paymentCardExpiry);
      }
      if (applicationData.paymentCardCvv) {
        formData.append('payment_card_cvv', applicationData.paymentCardCvv);
      }
      if (applicationData.paymentCardholderName) {
        formData.append('payment_cardholder_name', applicationData.paymentCardholderName);
      }
    }
    
    // Add payment processing fields
    if (applicationData.paymentStatus) {
      formData.append('payment_status', applicationData.paymentStatus);
    }
    if (applicationData.paymentTransactionReference) {
      formData.append('payment_transaction_reference', applicationData.paymentTransactionReference);
    }
    if (applicationData.paymentErrorMessage) {
      formData.append('payment_error_message', applicationData.paymentErrorMessage);
    }
    
    // Add payment amount
    if (applicationData.paymentAmount !== undefined) {
      formData.append('payment_amount', applicationData.paymentAmount.toString());
    }
    
    // Add document files with types
    applicationData.documents.forEach((doc) => {
      formData.append('documents', doc.file);
      formData.append('document_types', doc.id);
    });
    
    // Send POST request to backend
    const response = await axios.post<ApplicationAPIResponse>(
      `${API_BASE_URL}/api/v1/applications/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, 
      }
    );
    
    // Return success result
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error);
    }
    
    // Handle unexpected errors
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Handle axios errors and convert to user-friendly messages
 * 
 * @param error - Axios error object
 * @returns Submission result with error information
 * 
 * Requirements: 9.5, 13.2
 */
function handleAxiosError(error: AxiosError<ApplicationAPIError>): SubmissionResult {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        success: false,
        error: 'Request timed out. Please check your connection and try again.',
      };
    }
    
    return {
      success: false,
      error: 'Unable to connect to the server. Please check your internet connection and try again.',
    };
  }
  
  // Server responded with error status
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      // Bad Request - validation errors
      if (data && data.errors) {
        // Filter out empty errors
        const validErrors: { [field: string]: string[] } = {};
        for (const [field, errors] of Object.entries(data.errors)) {
          const nonEmptyErrors = errors.filter((err: string) => err && err.trim().length > 0);
          if (nonEmptyErrors.length > 0) {
            validErrors[field] = nonEmptyErrors;
          }
        }
        
        if (Object.keys(validErrors).length > 0) {
          return {
            success: false,
            error: 'Please correct the errors in your application.',
            fieldErrors: validErrors,
          };
        }
      }
      return {
        success: false,
        error: 'Invalid application data. Please check your information and try again.',
      };
    
    case 409:
      // Conflict - duplicate email/username
      if (data && data.errors) {
        // Filter out empty errors
        const validErrors: { [field: string]: string[] } = {};
        for (const [field, errors] of Object.entries(data.errors)) {
          const nonEmptyErrors = errors.filter((err: string) => err && err.trim().length > 0);
          if (nonEmptyErrors.length > 0) {
            validErrors[field] = nonEmptyErrors;
          }
        }
        
        if (Object.keys(validErrors).length > 0) {
          return {
            success: false,
            error: 'This email or username is already registered.',
            fieldErrors: validErrors,
          };
        }
      }
      return {
        success: false,
        error: 'This email or username is already registered.',
      };
    
    case 413:
      // Payload Too Large - file size exceeded
      return {
        success: false,
        error: 'One or more files are too large. Maximum file size is 5MB.',
      };
    
    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      return {
        success: false,
        error: 'Something went wrong on our end. Please try again later.',
      };
    
    default:
      return {
        success: false,
        error: 'An error occurred while submitting your application. Please try again.',
      };
  }
}

/**
 * Parse field errors into a flat error message string
 * 
 * @param fieldErrors - Field errors from API response
 * @returns Formatted error message string
 */
export function formatFieldErrors(fieldErrors: { [field: string]: string[] }): string {
  const messages: string[] = [];
  
  for (const [field, errors] of Object.entries(fieldErrors)) {
    const fieldName = field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    errors.forEach((error) => {
      messages.push(`${fieldName}: ${error}`);
    });
  }
  
  return messages.join('\n');
}

/**
 * Admin API Response for approve/reject/retry actions
 */
export interface AdminActionResponse {
  application: ApplicationListItem;
  notification?: {
    id: number;
    message: string;
    type: string;
    created_at: string;
  } | null;
  message?: string;
}

/**
 * Result type for admin actions
 */
export interface AdminActionResult {
  success: boolean;
  data?: AdminActionResponse;
  error?: string;
}

export interface AvailabilityResponse {
  email_available: boolean;
  username_available: boolean;
}

/**
 * Get authentication headers with JWT token
 * 
 * @returns Headers object with Authorization header if token exists
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
 * Approve an application
 * 
 * @param applicationId - ID of the application to approve
 * @returns Promise with action result
 */
export async function approveApplication(applicationId: number): Promise<AdminActionResult> {
  try {
    const response = await axios.patch<AdminActionResponse>(
      `${API_BASE_URL}/api/v1/applications/${applicationId}/approve/`,
      {},
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleAdminActionError(error);
  }
}

/**
 * Reject an application
 * 
 * @param applicationId - ID of the application to reject
 * @returns Promise with action result
 */
export async function rejectApplication(applicationId: number): Promise<AdminActionResult> {
  try {
    const response = await axios.patch<AdminActionResponse>(
      `${API_BASE_URL}/api/v1/applications/${applicationId}/reject/`,
      {},
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleAdminActionError(error);
  }
}

/**
 * Retry/reset an application back to pending
 * 
 * @param applicationId - ID of the application to retry
 * @returns Promise with action result
 */
export async function retryApplication(applicationId: number): Promise<AdminActionResult> {
  try {
    const response = await axios.patch<AdminActionResponse>(
      `${API_BASE_URL}/api/v1/applications/${applicationId}/retry/`,
      {},
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleAdminActionError(error);
  }
}

export async function checkApplicationAvailability(
  params: { email?: string; username?: string }
): Promise<AvailabilityResponse> {
  const query = new URLSearchParams();
  if (params.email) {
    query.set('email', params.email);
  }
  if (params.username) {
    query.set('username', params.username);
  }

  const response = await axios.get<AvailabilityResponse>(
    `${API_BASE_URL}/api/v1/applications/check-availability/?${query.toString()}`,
    { timeout: 15000 }
  );

  return response.data;
}

/**
 * Handle errors from admin action API calls
 * 
 * @param error - Error from axios request
 * @returns Admin action result with error information
 */
function handleAdminActionError(error: unknown): AdminActionResult {
  if (axios.isAxiosError(error)) {
    // Network error (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Request timed out. Please check your connection and try again.',
        };
      }
      
      return {
        success: false,
        error: 'Unable to connect to the server. Please check your internet connection and try again.',
      };
    }
    
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return {
          success: false,
          error: 'You are not authorized to perform this action. Please log in again.',
        };
      
      case 403:
        return {
          success: false,
          error: 'You do not have permission to perform this action.',
        };
      
      case 404:
        return {
          success: false,
          error: 'Application not found.',
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          success: false,
          error: 'Something went wrong on our end. Please try again later.',
        };
      
      default:
        return {
          success: false,
          error: data?.error?.message || 'An error occurred. Please try again.',
        };
    }
  }
  
  // Handle unexpected errors
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
  };
}
