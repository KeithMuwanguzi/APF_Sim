/**
 * PaymentModal - Reusable modal component for mobile money payments
 * 
 * This component provides a focused payment experience in a modal dialog,
 * handling phone number input, payment initiation, status polling, and
 * user feedback throughout the payment lifecycle.
 * 
 * 
 */

import { useState, useEffect } from 'react';
import type { PaymentProvider, PaymentStatus } from '../../types/payment';
import paymentService from '../../services/paymentService';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';

/**
 * Props for the PaymentModal component
 */
export interface PaymentModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Selected payment provider (MTN or Airtel) */
  provider: PaymentProvider;
  /** Payment amount in UGX */
  amount: number;
  /** Callback when payment completes successfully */
  onPaymentSuccess: (transactionReference: string) => void;
}

/**
 * Internal state for the PaymentModal component
 */
interface PaymentModalState {
  phoneNumber: string;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  transactionReference: string | null;
  errorMessage: string | null;
  isProcessing: boolean;
  pollCount: number;
  validationError: string | null;
}

/**
 * PaymentModal component
 * 
 * Provides a modal interface for collecting phone number and processing
 * mobile money payments with real-time status updates.
 */
function PaymentModal({
  isOpen,
  onClose,
  provider,
  amount,
  onPaymentSuccess,
}: PaymentModalProps) {
  // Component state (Requirement 3.2)
  const [state, setState] = useState<PaymentModalState>({
    phoneNumber: '',
    paymentStatus: 'idle',
    paymentId: null,
    transactionReference: null,
    errorMessage: null,
    isProcessing: false,
    pollCount: 0,
    validationError: null,
  });

  // Payment status polling (Requirements: 3.8, 3.9, 3.10, 3.11, 4.3)
  const { isPolling, pollCount, elapsedSeconds } = usePaymentPolling({
    paymentId: state.paymentId,
    enabled: state.paymentStatus === 'pending',
    onStatusChange: (status) => {
      setState((prev) => ({
        ...prev,
        paymentStatus: status,
        pollCount,
      }));
    },
    onComplete: (transactionReference) => {
      // Handle completion: show success message (Requirement 3.9)
      setState((prev) => ({
        ...prev,
        paymentStatus: 'completed',
        transactionReference,
        isProcessing: false,
        errorMessage: null,
      }));
    },
    onFailed: (errorMessage) => {
      // Handle failure: show error message with retry button (Requirement 3.10)
      setState((prev) => ({
        ...prev,
        paymentStatus: 'failed',
        errorMessage,
        isProcessing: false,
      }));
    },
    onTimeout: () => {
      // Handle timeout: show timeout message with retry button (Requirement 3.11)
      setState((prev) => ({
        ...prev,
        paymentStatus: 'timeout',
        errorMessage: 'Payment verification timed out. Please check your phone and try again.',
        isProcessing: false,
      }));
    },
  });

  // Prevent body scroll when modal is open (Requirement 14.5)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, state.paymentStatus]);

  /**
   * Handle modal close with state-dependent behavior
   * Requirements: 8.7, 8.8, 8.9, 8.10, 8.11
   */
  const handleClose = () => {
    // Close immediately when in idle state (Requirement 8.7)
    if (state.paymentStatus === 'idle') {
      resetState();
      onClose();
      return;
    }

    // Delay close for 2 seconds after successful payment (Requirement 8.10)
    if (state.paymentStatus === 'completed') {
      // Call onPaymentSuccess callback before closing (Requirement 8.11)
      if (state.transactionReference) {
        onPaymentSuccess(state.transactionReference);
      }
      
      // Delay close for 2 seconds
      setTimeout(() => {
        resetState();
        onClose();
      }, 2000);
      return;
    }

    // Show confirmation dialog when in processing state (Requirement 8.8)
    if (state.paymentStatus === 'pending') {
      const confirmed = window.confirm(
        'Payment is in progress. Are you sure you want to cancel?'
      );
      
      if (confirmed && state.paymentId) {
        // Call cancelPayment API (Requirement 8.9)
        paymentService.cancelPayment(state.paymentId)
          .then(() => {
            resetState();
            onClose();
          })
          .catch((error) => {
            console.error('Failed to cancel payment:', error);
            // Still close the modal even if cancel fails
            resetState();
            onClose();
          });
      }
      return;
    }

    // For other states (failed, timeout), close normally
    resetState();
    onClose();
  };

  /**
   * Reset all modal state (Requirement 8.11)
   */
  const resetState = () => {
    setState({
      phoneNumber: '',
      paymentStatus: 'idle',
      paymentId: null,
      transactionReference: null,
      errorMessage: null,
      isProcessing: false,
      pollCount: 0,
      validationError: null,
    });
  };

  /**
   * Validate phone number in real-time
   * Requirements: 3.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
   */
  const validatePhoneNumber = (phoneNumber: string): string | null => {
    // Check if empty (Requirement 5.3)
    if (!phoneNumber) {
      return 'Phone number is required';
    }

    // Check format (Requirement 5.2)
    if (!paymentService.validatePhoneNumber(phoneNumber)) {
      return 'Invalid phone number format. Please use format: 256XXXXXXXXX';
    }

    // Check provider prefix mismatch (Requirements 5.5, 5.6)
    const mtnPrefixes = ['25677', '25678', '25676'];
    const airtelPrefixes = ['25670', '25675', '25674'];
    
    const phonePrefix = phoneNumber.substring(0, 5);
    
    if (provider === 'mtn' && airtelPrefixes.includes(phonePrefix)) {
      return 'This appears to be an Airtel number. Please select Airtel as your payment method.';
    }
    
    if (provider === 'airtel' && mtnPrefixes.includes(phonePrefix)) {
      return 'This appears to be an MTN number. Please select MTN as your payment method.';
    }

    return null;
  };

  /**
   * Handle phone number input change with real-time validation
   * Requirement 5.1
   */
  const handlePhoneNumberChange = (value: string) => {
    setState({
      ...state,
      phoneNumber: value,
      validationError: value ? validatePhoneNumber(value) : null,
    });
  };

  /**
   * Check if Pay Now button should be enabled
   * Requirement 5.4
   */
  const isPayNowEnabled = (): boolean => {
    if (state.isProcessing) return false;
    if (!state.phoneNumber) return false;
    if (state.validationError) return false;
    return true;
  };

  /**
   * Handle payment initiation
   * Requirements: 3.6, 3.7, 9.2, 9.3, 13.1, 13.4
   */
  const handlePayNow = async () => {
    // Validate phone number one more time
    const validationError = validatePhoneNumber(state.phoneNumber);
    if (validationError) {
      setState({ ...state, validationError });
      return;
    }

    // Set processing state (Requirement 13.4)
    setState({
      ...state,
      isProcessing: true,
      paymentStatus: 'pending',
      errorMessage: null,
    });

    try {
      // Call PaymentService to initiate payment (Requirement 3.6)
      const response = await paymentService.initiatePayment(
        state.phoneNumber,
        provider,
        amount
      );

      if (response.success && response.payment_id) {
        // Transition to pending state on success (Requirement 3.7)
        setState({
          ...state,
          isProcessing: true,
          paymentStatus: 'pending',
          paymentId: response.payment_id,
          transactionReference: response.transaction_reference || null,
          errorMessage: null,
        });
      } else {
        // Handle initiation failure
        const errorMsg = response.error
          ? paymentService.getErrorMessage(response.error)
          : 'Failed to initiate payment. Please try again.';
        
        setState({
          ...state,
          isProcessing: false,
          paymentStatus: 'failed',
          errorMessage: errorMsg,
        });
      }
    } catch (error: any) {
      // Handle error
      const errorMsg = error.message || paymentService.getErrorMessage(error);
      setState({
        ...state,
        isProcessing: false,
        paymentStatus: 'failed',
        errorMessage: errorMsg,
      });
    }
  };

  /**
   * Handle payment retry
   * Requirements: 6.9, 12.2, 12.3
   */
  const handleRetry = async () => {
    if (state.paymentId) {
      // Try to retry with existing payment ID (Requirement 12.2)
      setState({
        ...state,
        isProcessing: true,
        errorMessage: null,
      });

      try {
        const response = await paymentService.retryPayment(state.paymentId);

        if (response.success && response.new_payment_id) {
          // Start new polling cycle with new paymentId (Requirement 12.3)
          setState({
            ...state,
            isProcessing: true,
            paymentStatus: 'pending',
            paymentId: response.new_payment_id,
            transactionReference: response.transaction_reference || null,
            errorMessage: null,
          });
        } else {
          setState({
            ...state,
            isProcessing: false,
            errorMessage: response.message || 'Retry failed. Please try again.',
          });
        }
      } catch (error: any) {
        setState({
          ...state,
          isProcessing: false,
          errorMessage: error.message || 'Retry failed. Please try again.',
        });
      }
    } else {
      // Reset state to allow phone number modification (Requirement 12.3)
      setState({
        ...state,
        paymentStatus: 'idle',
        isProcessing: false,
        errorMessage: null,
        paymentId: null,
        transactionReference: null,
      });
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        // Only close on backdrop click if not processing
        if (e.target === e.currentTarget && state.paymentStatus !== 'pending') {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative max-sm:h-full max-sm:max-w-full max-sm:rounded-none max-sm:flex max-sm:flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (X) in top corner (Requirement 8.6) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className="mt-8">
          {/* Provider logo and name (Requirements 3.3, 8.2) */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              {/* Provider icon/logo placeholder */}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                provider === 'mtn' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  provider === 'mtn' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {provider === 'mtn' ? 'MTN' : 'Airtel'}
                </span>
              </div>
              <h2 id="payment-modal-title" className="text-lg font-semibold text-gray-900">
                {provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'}
              </h2>
            </div>
          </div>

          {/* Payment amount prominently displayed (Requirements 3.4, 8.3) */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-purple-600">
              {amount.toLocaleString()} UGX
            </p>
          </div>

          {/* Phone number input field (Requirements 3.4, 8.4, 14.2) */}
          <div className="mb-6">
            <label 
              htmlFor="phone-number" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone-number"
              type="tel"
              value={state.phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              placeholder="256XXXXXXXXX"
              disabled={state.isProcessing}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-base ${
                state.validationError ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }} // Minimum 16px to prevent zoom on iOS (Requirement 14.4)
            />
            {/* Display validation error (Requirements 5.1, 5.2, 5.3) */}
            {state.validationError && (
              <p className="mt-2 text-sm text-red-600">
                {state.validationError}
              </p>
            )}
            
            {/* User instruction text (Requirement 9.1) */}
            {!state.validationError && state.paymentStatus === 'idle' && (
              <div className="mt-3 text-sm text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Enter your phone number. You will receive a payment prompt on your phone.</span>
                </p>
              </div>
            )}
          </div>

          {/* Processing status with loading spinner (Requirements 3.7, 9.2, 9.3, 13.1) */}
          {state.paymentStatus === 'pending' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              
              {/* User instruction text (Requirements 9.2, 9.3) */}
              <p className="text-sm text-center text-gray-700 mb-2">
                Please check your phone for the payment prompt.
              </p>
              <p className="text-sm text-center text-gray-600 mb-2">
                This may take up to 5 minutes.
              </p>
              
              {/* Display elapsed time during polling (Requirement 4.3) */}
              {isPolling && (
                <p className="text-sm text-center text-gray-500">
                  Elapsed time: {elapsedSeconds}s
                </p>
              )}
            </div>
          )}

          {/* Success state (Requirements 3.9, 9.4) */}
          {state.paymentStatus === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              
              {/* User instruction text (Requirement 9.4) */}
              <p className="text-sm text-center text-gray-700 font-semibold mb-2">
                Your payment has been processed successfully.
              </p>
              
              {state.transactionReference && (
                <p className="text-sm text-center text-gray-600">
                  Transaction Reference: {state.transactionReference}
                </p>
              )}
            </div>
          )}

          {/* Error message display (Requirements 3.10, 3.11, 9.6) */}
          {state.errorMessage && (state.paymentStatus === 'failed' || state.paymentStatus === 'timeout') && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 mb-2">{state.errorMessage}</p>
              
              {/* User instruction text for timeout (Requirement 9.6) */}
              {state.paymentStatus === 'timeout' && (
                <p className="text-sm text-gray-700 mb-3">
                  Please check your phone and try again.
                </p>
              )}
              
              {/* Retry button (Requirements 6.9, 12.2, 12.3) */}
              <button
                onClick={handleRetry}
                disabled={state.isProcessing}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                style={{ minHeight: '44px' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Pay Now button (Requirements 8.5, 14.3) */}
          {state.paymentStatus === 'idle' && (
            <button
              onClick={handlePayNow}
              disabled={!isPayNowEnabled() || state.isProcessing}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-base font-medium transition touch-manipulation flex items-center justify-center"
              style={{ minHeight: '44px' }} // Minimum touch target size (Requirement 14.3)
            >
              {state.isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Initiating...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
