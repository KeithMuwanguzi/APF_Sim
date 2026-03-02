/**
 * Payment and transaction type definitions
 */

// ============================================================================
// Payment Provider and Status Types
// ============================================================================

/**
 * Mobile money payment provider types
 */
export type PaymentProvider = 'mtn' | 'airtel';

/**
 * Payment status types representing the lifecycle of a payment
 */
export type PaymentStatus = 'idle' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'timeout';

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Request payload for initiating a new payment
 */
export interface PaymentInitiationRequest {
  phone_number: string;
  provider: PaymentProvider;
  amount: number;
  application_id?: string;
}

/**
 * Request payload for checking payment status
 */
export interface PaymentStatusRequest {
  payment_id: string;
}

/**
 * Request payload for retrying a failed payment
 */
export interface PaymentRetryRequest {
  payment_id: string;
}

/**
 * Request payload for cancelling a pending payment
 */
export interface PaymentCancelRequest {
  payment_id: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Response from payment initiation endpoint
 */
export interface PaymentInitiationResponse {
  success: boolean;
  payment_id?: string;
  transaction_reference?: string;
  message?: string;
  amount?: string;
  currency?: string;
  error?: PaymentError;
}

/**
 * Response from payment status check endpoint
 */
export interface PaymentStatusResponse {
  status: PaymentStatus;
  message: string;
  provider_transaction_id?: string;
  updated_at: string;
  amount: string;
  currency: string;
  provider: PaymentProvider;
}

/**
 * Response from payment retry endpoint
 */
export interface PaymentRetryResponse {
  success: boolean;
  new_payment_id?: string;
  transaction_reference?: string;
  message: string;
}

/**
 * Response from payment cancellation endpoint
 */
export interface PaymentCancelResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Structured error response from payment API
 */
export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// Legacy Types (for backward compatibility)
// ============================================================================

export interface Transaction {
  date: string
  type: string
  reference: string
  amount: string
  method: string
  methodIcon: any
  status: string
  description: string
}

export interface Receipt {
  id: string
  title: string
  date: string
  amount: string
  type: 'invoice' | 'receipt'
  reference: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: any
  disabled: boolean
}
