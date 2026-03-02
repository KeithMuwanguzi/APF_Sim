/**
 * usePaymentPolling - Custom React hook for payment status polling
 * 
 * This hook manages the polling lifecycle for checking payment status,
 * including interval management, retry logic, and cleanup.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9
 */

import { useEffect, useRef, useState } from 'react';
import paymentService from '../services/paymentService';
import type { PaymentStatus } from '../types/payment';

/**
 * Options for configuring the payment polling hook
 */
export interface UsePaymentPollingOptions {
  /** Payment ID to poll for status */
  paymentId: string | null;
  /** Callback when status changes */
  onStatusChange: (status: PaymentStatus, message: string) => void;
  /** Callback when payment completes successfully */
  onComplete: (transactionReference: string) => void;
  /** Callback when payment fails */
  onFailed: (errorMessage: string) => void;
  /** Callback when polling times out */
  onTimeout: () => void;
  /** Whether polling is enabled */
  enabled: boolean;
}

/**
 * Return value from the payment polling hook
 */
export interface UsePaymentPollingReturn {
  /** Whether polling is currently active */
  isPolling: boolean;
  /** Number of polls completed */
  pollCount: number;
  /** Elapsed time in seconds since polling started */
  elapsedSeconds: number;
  /** Function to manually stop polling */
  stopPolling: () => void;
}

/**
 * Terminal payment statuses that should stop polling
 */
const TERMINAL_STATUSES: PaymentStatus[] = ['completed', 'failed', 'cancelled'];

/**
 * Polling configuration constants
 */
const POLLING_INTERVAL_MS = 3000; // 3 seconds (Requirement 4.2)
const MAX_POLL_ATTEMPTS = 30; // 90 seconds total (Requirement 4.7)
const MAX_NETWORK_RETRIES = 3; // Network error retry limit (Requirement 4.8)

/**
 * Custom hook for polling payment status
 * 
 * @param options - Configuration options for polling behavior
 * @returns Polling state and control functions
 */
export function usePaymentPolling(
  options: UsePaymentPollingOptions
): UsePaymentPollingReturn {
  const {
    paymentId,
    onStatusChange,
    onComplete,
    onFailed,
    onTimeout,
    enabled,
  } = options;

  // State
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Refs to track polling state across renders
  const intervalIdRef = useRef<number | null>(null);
  const networkRetryCountRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  /**
   * Stop polling and clean up
   * Requirement 4.9
   */
  const stopPolling = () => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsPolling(false);
    startTimeRef.current = null;
  };

  /**
   * Check payment status and handle response
   */
  const checkStatus = async () => {
    if (!paymentId) {
      stopPolling();
      return;
    }

    try {
      // Call API to check status (Requirement 4.2)
      const response = await paymentService.checkPaymentStatus(paymentId);

      // Reset network retry count on successful response
      networkRetryCountRef.current = 0;

      // Update elapsed time
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
      }

      // Increment poll count
      setPollCount((prev) => {
        const newCount = prev + 1;

        // Check if max attempts reached (Requirement 4.7)
        if (newCount >= MAX_POLL_ATTEMPTS) {
          stopPolling();
          onTimeout();
          return newCount;
        }

        return newCount;
      });

      // Notify status change
      onStatusChange(response.status, response.message);

      // Check for terminal statuses (Requirements 4.4, 4.5, 4.6)
      if (TERMINAL_STATUSES.includes(response.status)) {
        stopPolling();

        if (response.status === 'completed') {
          // Payment successful
          const transactionRef = response.provider_transaction_id || '';
          onComplete(transactionRef);
        } else if (response.status === 'failed') {
          // Payment failed
          onFailed(response.message);
        }
        // For 'cancelled', we just stop polling without additional callbacks
      }
    } catch (error: any) {
      // Handle network errors with retry (Requirement 4.8)
      networkRetryCountRef.current += 1;

      if (networkRetryCountRef.current >= MAX_NETWORK_RETRIES) {
        // Max retries reached, stop polling and notify failure
        stopPolling();
        const errorMessage = error.message || 'Network error occurred during status check';
        onFailed(errorMessage);
      }
      // Otherwise, continue polling (automatic retry on next interval)
    }
  };

  /**
   * Effect to manage polling lifecycle
   * Requirements: 4.1, 4.3, 4.9
   */
  useEffect(() => {
    // Start polling when enabled and paymentId is available (Requirement 4.1)
    if (enabled && paymentId && !isPolling) {
      setIsPolling(true);
      setPollCount(0);
      setElapsedSeconds(0);
      networkRetryCountRef.current = 0;
      startTimeRef.current = Date.now();

      // Set up interval for polling (Requirement 4.2)
      // Start immediately with first check
      checkStatus();
      intervalIdRef.current = window.setInterval(checkStatus, POLLING_INTERVAL_MS);
    }

    // Stop polling when disabled or paymentId is cleared
    if (!enabled || !paymentId) {
      stopPolling();
    }

    // Cleanup on unmount (Requirement 4.9)
    return () => {
      stopPolling();
    };
  }, [enabled, paymentId]); // Only re-run when enabled or paymentId changes

  return {
    isPolling,
    pollCount,
    elapsedSeconds,
    stopPolling,
  };
}

export default usePaymentPolling;
