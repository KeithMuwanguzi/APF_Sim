/**
 * PaymentService - API client for mobile money payment operations
 * 
 * This service handles all communication with the backend payment API,
 * including payment initiation, status checking, retry, and cancellation.
 * 
 * Requirements: 1.1, 7.1, 7.2, 7.5, 10.5
 */

import type {
  PaymentProvider,
  PaymentInitiationResponse,
  PaymentStatusResponse,
  PaymentRetryResponse,
  PaymentCancelResponse,
  PaymentError,
} from '../types/payment';

/**
 * Error code to user-friendly message mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  'VALIDATION_ERROR': 'Invalid input data. Please check your phone number.',
  'PAYMENT_INITIATION_FAILED': 'Unable to initiate payment. Please try again.',
  'INSUFFICIENT_FUNDS': 'Insufficient funds. Please top up your account and try again.',
  'PAYMENT_DECLINED': 'Payment cancelled. Please try again or use a different payment method.',
  'INVALID_PHONE_NUMBER': 'Invalid phone number format. Please use format: 256XXXXXXXXX',
  'NETWORK_ERROR': 'Network error. Please check your connection and try again.',
  'AUTHENTICATION_ERROR': 'Session expired. Please log in again.',
  'SERVER_ERROR': 'Server error. Please try again later or contact support.',
  'TIMEOUT': 'Payment verification timed out. Please check your phone and try again.',
  'FORBIDDEN': 'You do not have permission to access this payment.',
};

/**
 * PaymentService class for handling all payment API operations
 */
class PaymentService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    // Initialize from environment variables (Requirement 1.1, 7.1, 7.2)
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Log API endpoint in development mode (Requirement 7.4)
    if (import.meta.env.DEV) {
      console.log('[PaymentService] Initialized with API base URL:', this.baseURL);
    }
  }

  /**
   * Validate that the API base URL is properly formatted
   * Requirement 7.5
   */
  private validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Set authentication token for API requests
   * Requirement 10.5
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get authentication token from storage or auth context
   * Requirement 10.5
   */
  private getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Make authenticated API request with error handling
   * Requirements: 1.6, 1.7, 1.8
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Validate URL before making request (Requirement 7.5)
    const fullURL = `${this.baseURL}${endpoint}`;
    if (!this.validateURL(fullURL)) {
      throw {
        code: 'INVALID_URL',
        message: 'Invalid API URL configuration',
        details: { url: fullURL }
      } as PaymentError;
    }

    // Get authentication token (Requirement 1.8, 10.1)
    const token = this.getAuthToken();

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Include JWT token if available (Requirement 1.8)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Log request in development mode
    if (import.meta.env.DEV) {
      console.log('[PaymentService] Request:', {
        method: options.method || 'GET',
        endpoint,
        hasToken: !!token
      });
    }

    try {
      const response = await fetch(fullURL, {
        ...options,
        headers,
      });

      // Log response in development mode
      if (import.meta.env.DEV) {
        console.log('[PaymentService] Response:', {
          status: response.status,
          statusText: response.statusText
        });
      }

      // Handle authentication errors (Requirement 1.7, 6.6, 10.3)
      if (response.status === 401) {
        throw {
          code: 'AUTHENTICATION_ERROR',
          message: ERROR_MESSAGES['AUTHENTICATION_ERROR'],
          details: { status: 401 }
        } as PaymentError;
      }

      // Handle forbidden errors
      if (response.status === 403) {
        throw {
          code: 'FORBIDDEN',
          message: ERROR_MESSAGES['FORBIDDEN'],
          details: { status: 403 }
        } as PaymentError;
      }

      // Parse response body
      const data = await response.json();

      // Handle server errors (Requirement 6.7)
      if (response.status >= 500) {
        throw {
          code: 'SERVER_ERROR',
          message: ERROR_MESSAGES['SERVER_ERROR'],
          details: { status: response.status, data }
        } as PaymentError;
      }

      // Handle client errors (Requirement 6.4)
      if (response.status >= 400) {
        throw {
          code: data.error?.code || 'VALIDATION_ERROR',
          message: data.error?.message || data.message || ERROR_MESSAGES['VALIDATION_ERROR'],
          details: data.error?.details || data
        } as PaymentError;
      }

      return data as T;
    } catch (error: any) {
      // Log error in development mode
      if (import.meta.env.DEV) {
        console.error('[PaymentService] Error:', error);
      }

      // If it's already a PaymentError, rethrow it
      if (error.code && error.message) {
        throw error;
      }

      // Handle network errors (Requirement 1.6, 6.1)
      throw {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES['NETWORK_ERROR'],
        details: { originalError: error.message }
      } as PaymentError;
    }
  }

  /**
   * Get user-friendly error message from error code
   * Requirements: 6.1-6.7
   */
  getErrorMessage(error: PaymentError): string {
    return ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES['SERVER_ERROR'];
  }

  /**
   * Validate phone number format (256XXXXXXXXX)
   * Requirements: 5.1, 5.2
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^256\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Initiate a new payment
   * Requirements: 1.2, 1.8, 2.3, 3.6
   */
  async initiatePayment(
    phoneNumber: string,
    provider: PaymentProvider,
    amount: number,
    applicationId?: string
  ): Promise<PaymentInitiationResponse> {
    const requestBody: any = {
      phone_number: phoneNumber,
      provider,
      amount,
    };

    if (applicationId) {
      requestBody.application_id = applicationId;
    }

    return this.request<PaymentInitiationResponse>(
      '/api/v1/payments/initiate/',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );
  }

  /**
   * Check payment status
   * Requirements: 1.3, 1.8, 4.2
   */
  async checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return this.request<PaymentStatusResponse>(
      `/api/v1/payments/status/${paymentId}/`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Retry a failed payment
   * Requirements: 1.4, 1.8, 12.2
   */
  async retryPayment(paymentId: string): Promise<PaymentRetryResponse> {
    return this.request<PaymentRetryResponse>(
      `/api/v1/payments/${paymentId}/retry/`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Cancel a pending payment
   * Requirements: 1.5, 1.8, 12.5
   */
  async cancelPayment(paymentId: string): Promise<PaymentCancelResponse> {
    return this.request<PaymentCancelResponse>(
      `/api/v1/payments/${paymentId}/cancel/`,
      {
        method: 'POST',
      }
    );
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;

