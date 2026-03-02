/**
 * Property-based and unit tests for usePaymentPolling hook
 * 
 * Tests polling interval consistency, termination conditions, and error handling
 */

import { describe, it, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { usePaymentPolling } from './usePaymentPolling';
import paymentService from '../services/paymentService';
import type { PaymentStatus, PaymentStatusResponse } from '../types/payment';

// Mock the payment service
vi.mock('../services/paymentService', () => ({
  default: {
    checkPaymentStatus: vi.fn(),
  },
}));

describe('usePaymentPolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ============================================================================
  // Property 9: Polling interval consistency
  // Feature: frontend-payment-integration, Property 9: Polling interval consistency
  // Validates: Requirements 2.5, 3.8, 4.2
  // ============================================================================

  describe('Property 9: Polling interval consistency', () => {
    test('should poll every 3 seconds for any payment in pending status', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 50 }), // paymentId
          fc.integer({ min: 2, max: 5 }), // Number of polls to test
          async (paymentId, numPolls) => {
            // Setup mock response
            const mockResponse: PaymentStatusResponse = {
              status: 'pending',
              message: 'Payment is pending',
              updated_at: new Date().toISOString(),
              amount: '50000',
              currency: 'UGX',
              provider: 'mtn',
            };

            vi.mocked(paymentService.checkPaymentStatus).mockResolvedValue(mockResponse);

            // Setup callbacks
            const onStatusChange = vi.fn();
            const onComplete = vi.fn();
            const onFailed = vi.fn();
            const onTimeout = vi.fn();

            // Render hook
            const { result } = renderHook(() =>
              usePaymentPolling({
                paymentId,
                onStatusChange,
                onComplete,
                onFailed,
                onTimeout,
                enabled: true,
              })
            );

            // Wait for initial call
            await act(async () => {
              await vi.runOnlyPendingTimersAsync();
            });

            // Get the initial call count (should be at least 1)
            const initialCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
            expect(initialCallCount).toBeGreaterThanOrEqual(1);

            // Advance through additional polls
            for (let i = 1; i < numPolls; i++) {
              await act(async () => {
                await vi.advanceTimersByTimeAsync(3000);
              });
            }

            // Verify we have at least numPolls calls total
            const finalCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
            expect(finalCallCount).toBeGreaterThanOrEqual(numPolls);

            // Verify polling is still active
            expect(result.current.isPolling).toBe(true);

            // Cleanup
            act(() => {
              result.current.stopPolling();
            });
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  // ============================================================================
  // Property 10: Polling termination on completion
  // Feature: frontend-payment-integration, Property 10: Polling termination on completion
  // Validates: Requirements 4.4, 4.5, 4.6
  // ============================================================================

  describe('Property 10: Polling termination on completion', () => {
    test('should stop polling immediately when payment reaches terminal status', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 50 }), // paymentId
          fc.constantFrom('completed', 'failed', 'cancelled'), // Terminal statuses
          fc.string({ minLength: 10, maxLength: 50 }), // transaction reference
          async (paymentId, terminalStatus, transactionRef) => {
            // Setup mock to return pending first, then terminal status
            const pendingResponse: PaymentStatusResponse = {
              status: 'pending',
              message: 'Payment is pending',
              updated_at: new Date().toISOString(),
              amount: '50000',
              currency: 'UGX',
              provider: 'mtn',
            };

            const terminalResponse: PaymentStatusResponse = {
              status: terminalStatus as PaymentStatus,
              message: `Payment ${terminalStatus}`,
              provider_transaction_id: transactionRef,
              updated_at: new Date().toISOString(),
              amount: '50000',
              currency: 'UGX',
              provider: 'mtn',
            };

            vi.mocked(paymentService.checkPaymentStatus)
              .mockResolvedValueOnce(pendingResponse)
              .mockResolvedValueOnce(terminalResponse);

            // Setup callbacks
            const onStatusChange = vi.fn();
            const onComplete = vi.fn();
            const onFailed = vi.fn();
            const onTimeout = vi.fn();

            // Render hook
            const { result } = renderHook(() =>
              usePaymentPolling({
                paymentId,
                onStatusChange,
                onComplete,
                onFailed,
                onTimeout,
                enabled: true,
              })
            );

            // Wait for first poll (pending)
            await act(async () => {
              await vi.runOnlyPendingTimersAsync();
            });

            const firstCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
            expect(firstCallCount).toBeGreaterThanOrEqual(1);

            // Advance time for second poll (terminal status)
            await act(async () => {
              await vi.advanceTimersByTimeAsync(3000);
            });

            // Verify polling stopped (terminal status was received)
            expect(result.current.isPolling).toBe(false);

            // Verify no further status checks are made
            const callCountAfterTerminal = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;

            // Advance time significantly
            await act(async () => {
              await vi.advanceTimersByTimeAsync(10000);
            });

            // Verify call count hasn't increased
            expect(paymentService.checkPaymentStatus).toHaveBeenCalledTimes(callCountAfterTerminal);

            // Verify appropriate callback was invoked
            if (terminalStatus === 'completed') {
              expect(onComplete).toHaveBeenCalledWith(transactionRef);
            } else if (terminalStatus === 'failed') {
              expect(onFailed).toHaveBeenCalledWith(terminalResponse.message);
            }
            // For cancelled, no specific callback is expected
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  // ============================================================================
  // Example 4: Maximum poll attempts timeout
  // Validates: Requirements 2.8, 3.11, 4.7
  // ============================================================================

  describe('Example 4: Maximum poll attempts timeout', () => {
    it('should stop polling and call onTimeout after 30 attempts (90 seconds)', async () => {
      const paymentId = 'test-payment-123';
      const mockResponse: PaymentStatusResponse = {
        status: 'pending',
        message: 'Payment is pending',
        updated_at: new Date().toISOString(),
        amount: '50000',
        currency: 'UGX',
        provider: 'mtn',
      };

      vi.mocked(paymentService.checkPaymentStatus).mockResolvedValue(mockResponse);

      const onStatusChange = vi.fn();
      const onComplete = vi.fn();
      const onFailed = vi.fn();
      const onTimeout = vi.fn();

      const { result } = renderHook(() =>
        usePaymentPolling({
          paymentId,
          onStatusChange,
          onComplete,
          onFailed,
          onTimeout,
          enabled: true,
        })
      );

      // Wait for initial call
      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });

      const initialCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
      expect(initialCallCount).toBeGreaterThanOrEqual(1);

      // Advance through remaining polls to reach 30 total
      const remainingPolls = 30 - initialCallCount;
      for (let i = 0; i < remainingPolls; i++) {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(3000);
        });
      }

      // Verify timeout was called
      expect(onTimeout).toHaveBeenCalled();
      expect(result.current.isPolling).toBe(false);

      // Verify at least 30 polls were made
      const finalCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
      expect(finalCallCount).toBeGreaterThanOrEqual(30);

      // Verify no further polls after timeout
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });
      expect(paymentService.checkPaymentStatus).toHaveBeenCalledTimes(finalCallCount);
    });
  });

  // ============================================================================
  // Example 5: Network error retry logic
  // Validates: Requirements 4.8
  // ============================================================================

  describe('Example 5: Network error retry logic', () => {
    it('should retry up to 3 times on network error before calling onFailed', async () => {
      const paymentId = 'test-payment-456';
      const networkError = new Error('Network error');

      vi.mocked(paymentService.checkPaymentStatus).mockRejectedValue(networkError);

      const onStatusChange = vi.fn();
      const onComplete = vi.fn();
      const onFailed = vi.fn();
      const onTimeout = vi.fn();

      const { result } = renderHook(() =>
        usePaymentPolling({
          paymentId,
          onStatusChange,
          onComplete,
          onFailed,
          onTimeout,
          enabled: true,
        })
      );

      // Wait for initial call (retry 1)
      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });

      const initialCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
      expect(initialCallCount).toBeGreaterThanOrEqual(1);

      // Advance for retry 2
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      const secondCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
      expect(secondCallCount).toBeGreaterThan(initialCallCount);

      // Advance for retry 3
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      // Verify onFailed was called after 3 retries
      expect(onFailed).toHaveBeenCalledWith('Network error');
      expect(result.current.isPolling).toBe(false);

      const finalCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;

      // Verify no further calls after max retries
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });
      expect(paymentService.checkPaymentStatus).toHaveBeenCalledTimes(finalCallCount);
    });
  });

  // ============================================================================
  // Example 6: Component unmount cleanup
  // Validates: Requirements 4.9
  // ============================================================================

  describe('Example 6: Component unmount cleanup', () => {
    it('should clear interval and stop polling when component unmounts', async () => {
      const paymentId = 'test-payment-789';
      const mockResponse: PaymentStatusResponse = {
        status: 'pending',
        message: 'Payment is pending',
        updated_at: new Date().toISOString(),
        amount: '50000',
        currency: 'UGX',
        provider: 'mtn',
      };

      vi.mocked(paymentService.checkPaymentStatus).mockResolvedValue(mockResponse);

      const onStatusChange = vi.fn();
      const onComplete = vi.fn();
      const onFailed = vi.fn();
      const onTimeout = vi.fn();

      const { result, unmount } = renderHook(() =>
        usePaymentPolling({
          paymentId,
          onStatusChange,
          onComplete,
          onFailed,
          onTimeout,
          enabled: true,
        })
      );

      // Wait for initial call
      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });

      const initialCallCount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;
      expect(initialCallCount).toBeGreaterThanOrEqual(1);
      expect(result.current.isPolling).toBe(true);

      const callCountBeforeUnmount = vi.mocked(paymentService.checkPaymentStatus).mock.calls.length;

      // Unmount the component
      unmount();

      // Advance time significantly
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // Verify no additional API calls were made after unmount
      expect(paymentService.checkPaymentStatus).toHaveBeenCalledTimes(callCountBeforeUnmount);
    });
  });
});
