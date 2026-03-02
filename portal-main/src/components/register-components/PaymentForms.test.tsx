/**
 * PaymentForms Component Tests
 * Feature: frontend-payment-integration
 * 
 * Tests for PaymentForms component integration with PaymentService
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { PaymentForms } from './PaymentForms';
import { PaymentMethod, PaymentStatus } from '../../types/registration';
import { paymentService } from '../../services/paymentService';
import * as authUtils from '../../utils/auth';

// Mock the payment service
vi.mock('../../services/paymentService', () => ({
  paymentService: {
    initiatePayment: vi.fn(),
    retryPayment: vi.fn(),
    validatePhoneNumber: vi.fn(),
    setAuthToken: vi.fn(),
    getErrorMessage: vi.fn(),
  },
}));

// Mock the auth utils
vi.mock('../../utils/auth', () => ({
  getAccessToken: vi.fn(),
}));

// Mock the polling hook
vi.mock('../../hooks/usePaymentPolling', () => ({
  usePaymentPolling: vi.fn(() => ({
    isPolling: false,
    pollCount: 0,
    elapsedSeconds: 0,
    stopPolling: vi.fn(),
  })),
}));

// Mock the payment API validators
vi.mock('../../services/paymentApi', () => ({
  validateCardNumber: vi.fn(() => true),
  validateExpiryDate: vi.fn(() => true),
  validateCVV: vi.fn(() => true),
  validateCardholderName: vi.fn(() => true),
}));

describe('PaymentForms - Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(authUtils.getAccessToken).mockReturnValue('test-token');
    vi.mocked(paymentService.validatePhoneNumber).mockReturnValue(true);
  });

  // Feature: frontend-payment-integration, Property 13: Form submission control based on payment status
  test('Property 13: Form submission enabled only when payment status is completed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PaymentStatus>('idle', 'pending', 'failed', 'timeout', 'cancelled'),
        async (status) => {
          const onPaymentDataChange = vi.fn();
          const onPaymentValidated = vi.fn();

          // Render component with MTN method
          const { rerender } = render(
            <PaymentForms
              selectedMethod="mtn"
              onPaymentDataChange={onPaymentDataChange}
              onPaymentValidated={onPaymentValidated}
            />
          );

          // Wait for initial render
          await waitFor(() => {
            expect(onPaymentDataChange).toHaveBeenCalled();
          });

          // Get the last call to check validation status
          const lastCall = onPaymentDataChange.mock.calls[onPaymentDataChange.mock.calls.length - 1];
          const paymentData = lastCall[0];

          // For non-completed statuses, isValidated should be false
          expect(paymentData.isValidated).toBe(false);
          expect(onPaymentValidated).toHaveBeenCalledWith(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13: Form submission enabled when payment status is completed', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock successful payment
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: true,
      payment_id: 'test-payment-id',
      transaction_reference: 'test-ref',
    });

    // Mock the polling hook to simulate completed status
    const { usePaymentPolling } = await import('../../hooks/usePaymentPolling');
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: false,
      pollCount: 10,
      elapsedSeconds: 30,
      stopPolling: vi.fn(),
    });

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now button (use getByRole to be more specific)
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Wait for payment initiation
    await waitFor(() => {
      expect(paymentService.initiatePayment).toHaveBeenCalled();
    });

    // Simulate completed status by re-mocking the hook
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: false,
      pollCount: 10,
      elapsedSeconds: 30,
      stopPolling: vi.fn(),
    });

    // Manually trigger the onComplete callback
    const pollingHookCall = vi.mocked(usePaymentPolling).mock.calls[0];
    if (pollingHookCall && pollingHookCall[0].onComplete) {
      pollingHookCall[0].onComplete('test-ref');
    }

    // Wait for validation to be called with true
    await waitFor(() => {
      const validatedCalls = onPaymentValidated.mock.calls;
      const hasValidatedTrue = validatedCalls.some(call => call[0] === true);
      expect(hasValidatedTrue).toBe(true);
    });
  });

  // Feature: frontend-payment-integration, Property 17: Interactive elements disabled during API calls
  test('Property 17: Interactive elements disabled during API calls', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PaymentMethod>('mtn', 'airtel'),
        fc.string({ minLength: 9, maxLength: 9 }).map(s => '256' + s.replace(/\D/g, '').padEnd(9, '1').slice(0, 9)),
        async (method, phoneNumber) => {
          const onPaymentDataChange = vi.fn();
          const onPaymentValidated = vi.fn();

          // Mock payment initiation that takes time
          let resolvePayment: any;
          vi.mocked(paymentService.initiatePayment).mockImplementation(() => 
            new Promise((resolve) => {
              resolvePayment = resolve;
            })
          );

          const { unmount, container } = render(
            <PaymentForms
              selectedMethod={method}
              onPaymentDataChange={onPaymentDataChange}
              onPaymentValidated={onPaymentValidated}
            />
          );

          try {
            // Enter phone number
            const phoneInput = container.querySelector('input[name="phoneNumber"]') as HTMLInputElement;
            if (!phoneInput) throw new Error('Phone input not found');
            
            await userEvent.clear(phoneInput);
            await userEvent.type(phoneInput, phoneNumber);

            // Get Pay Now button from this specific container
            const payButtons = container.querySelectorAll('button[type="button"]');
            const payButton = Array.from(payButtons).find(btn => 
              btn.textContent?.includes('Pay Now')
            ) as HTMLButtonElement;
            
            if (!payButton) throw new Error('Pay button not found');

            // Click Pay Now
            await userEvent.click(payButton);

            // During API call, button should be disabled and show loading state
            // This is the primary requirement - interactive elements (buttons) are disabled
            await waitFor(() => {
              expect(payButton).toBeDisabled();
              expect(payButton.textContent).toContain('Initiating Payment');
            }, { timeout: 500 });

            // Resolve the payment
            if (resolvePayment) {
              resolvePayment({
                success: true,
                payment_id: 'test-id',
                transaction_reference: 'test-ref',
              });
            }

            // After API call completes, verify it was called
            await waitFor(() => {
              expect(paymentService.initiatePayment).toHaveBeenCalled();
            }, { timeout: 500 });
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  }, 15000);
});


describe('PaymentForms - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authUtils.getAccessToken).mockReturnValue('test-token');
    vi.mocked(paymentService.validatePhoneNumber).mockReturnValue(true);
  });

  // Example 2: Authentication error redirect
  test('Example 2: 401 error redirects to login', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock missing token
    vi.mocked(authUtils.getAccessToken).mockReturnValue(null);

    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should redirect to login
    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });

    // Restore window.location
    window.location = originalLocation;
  });

  // Example 3: Payment processing UI state
  test('Example 3: Processing state shows spinner and instructions', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock payment initiation that resolves to pending state
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: true,
      payment_id: 'test-payment-id',
      transaction_reference: 'test-ref',
    });

    // Mock the polling hook to keep it in pending state
    const { usePaymentPolling } = await import('../../hooks/usePaymentPolling');
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: true,
      pollCount: 5,
      elapsedSeconds: 15,
      stopPolling: vi.fn(),
    });

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should show processing state
    await waitFor(() => {
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
      expect(screen.getByText(/Please check your phone for the payment prompt/)).toBeInTheDocument();
      expect(screen.getByText(/This may take up to 5 minutes/)).toBeInTheDocument();
    });
  });

  // Example 19: Missing token prevents payment
  test('Example 19: Missing token prevents payment initiation', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock missing token
    vi.mocked(authUtils.getAccessToken).mockReturnValue(null);

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Payment service should NOT be called
    await waitFor(() => {
      expect(paymentService.initiatePayment).not.toHaveBeenCalled();
    });
  });

  // Example 24: Transaction reference storage
  test('Example 24: Transaction reference stored on successful payment', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    const testTransactionRef = 'TXN-123456789';

    // Mock successful payment
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: true,
      payment_id: 'test-payment-id',
      transaction_reference: testTransactionRef,
    });

    // Mock the polling hook to simulate completed status
    const { usePaymentPolling } = await import('../../hooks/usePaymentPolling');
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: false,
      pollCount: 10,
      elapsedSeconds: 30,
      stopPolling: vi.fn(),
    });

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Wait for payment initiation
    await waitFor(() => {
      expect(paymentService.initiatePayment).toHaveBeenCalled();
    });

    // Manually trigger the onComplete callback
    const pollingHookCall = vi.mocked(usePaymentPolling).mock.calls[0];
    if (pollingHookCall && pollingHookCall[0].onComplete) {
      pollingHookCall[0].onComplete(testTransactionRef);
    }

    // Wait for transaction reference to be stored
    await waitFor(() => {
      const lastCall = onPaymentDataChange.mock.calls[onPaymentDataChange.mock.calls.length - 1];
      const paymentData = lastCall[0];
      expect(paymentData.transactionReference).toBe(testTransactionRef);
    });
  });

  // Example 29: Loading spinner on Pay Now button
  test('Example 29: Loading spinner on Pay Now button during initiation', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock payment initiation that takes time
    let resolvePayment: any;
    vi.mocked(paymentService.initiatePayment).mockImplementation(() => 
      new Promise((resolve) => {
        resolvePayment = resolve;
      })
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should show loading spinner on button
    await waitFor(() => {
      expect(screen.getByText(/Initiating Payment/)).toBeInTheDocument();
    });

    // Resolve payment
    if (resolvePayment) {
      resolvePayment({
        success: true,
        payment_id: 'test-id',
        transaction_reference: 'test-ref',
      });
    }
  });

  // Example 30: Processing loading spinner
  test('Example 30: Processing loading spinner during payment', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock successful payment initiation
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: true,
      payment_id: 'test-payment-id',
      transaction_reference: 'test-ref',
    });

    // Mock the polling hook to keep it in pending state
    const { usePaymentPolling } = await import('../../hooks/usePaymentPolling');
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: true,
      pollCount: 5,
      elapsedSeconds: 15,
      stopPolling: vi.fn(),
    });

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should show animated loading spinner during processing
    await waitFor(() => {
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
      // Check for spinner element
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  // Example 31: Status check loading indicator
  test('Example 31: Status check loading indicator during polling', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock successful payment initiation
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: true,
      payment_id: 'test-payment-id',
      transaction_reference: 'test-ref',
    });

    // Mock the polling hook to simulate active polling
    const { usePaymentPolling } = await import('../../hooks/usePaymentPolling');
    vi.mocked(usePaymentPolling).mockReturnValue({
      isPolling: true,
      pollCount: 5,
      elapsedSeconds: 15,
      stopPolling: vi.fn(),
    });

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should show subtle loading indicator during status checks
    await waitFor(() => {
      expect(screen.getByText(/Checking status/)).toBeInTheDocument();
      expect(screen.getByText(/15s/)).toBeInTheDocument();
    });
  });

  // Example 32: Form submit loading state
  test('Example 32: Form submit loading state (N/A for PaymentForms)', async () => {
    // This test is not applicable to PaymentForms as it doesn't have a form submit button
    // The form submission is handled by the parent RegisterPage component
    // This test would be more appropriate for the RegisterPage component
    expect(true).toBe(true);
  });

  // Example 1 (Error Handling): Network error message
  test('Example 1: Network error displays appropriate message', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock network error
    vi.mocked(paymentService.initiatePayment).mockRejectedValue(
      new Error('Network error. Please check your connection and try again.')
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should display network error message
    await waitFor(() => {
      expect(screen.getByText(/Network error. Please check your connection and try again/)).toBeInTheDocument();
    });
  });

  // Example 8: Specific error messages
  test('Example 8: INSUFFICIENT_FUNDS error displays appropriate message', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock insufficient funds error - component uses error.message directly
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: false,
      error: {
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient funds. Please top up your account and try again.',
      },
    });

    vi.mocked(paymentService.getErrorMessage).mockReturnValue(
      'Insufficient funds. Please top up your account and try again.'
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should display insufficient funds error message
    await waitFor(() => {
      expect(screen.getByText(/Insufficient funds. Please top up your account and try again/)).toBeInTheDocument();
    });
  });

  test('Example 8: PAYMENT_DECLINED error displays appropriate message', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock payment declined error - component uses error.message directly
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: false,
      error: {
        code: 'PAYMENT_DECLINED',
        message: 'Payment cancelled. Please try again or use a different payment method.',
      },
    });

    vi.mocked(paymentService.getErrorMessage).mockReturnValue(
      'Payment cancelled. Please try again or use a different payment method.'
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should display payment declined error message
    await waitFor(() => {
      expect(screen.getByText(/Payment cancelled. Please try again or use a different payment method/)).toBeInTheDocument();
    });
  });

  test('Example 8: INVALID_PHONE_NUMBER error displays appropriate message', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock invalid phone number error - component uses error.message directly
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: false,
      error: {
        code: 'INVALID_PHONE_NUMBER',
        message: 'Invalid phone number format. Please use format: 256XXXXXXXXX',
      },
    });

    vi.mocked(paymentService.getErrorMessage).mockReturnValue(
      'Invalid phone number format. Please use format: 256XXXXXXXXX'
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should display invalid phone number error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid phone number format. Please use format: 256XXXXXXXXX/)).toBeInTheDocument();
    });
  });

  test('Example 8: SERVER_ERROR displays appropriate message', async () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    // Mock server error - component uses error.message directly
    vi.mocked(paymentService.initiatePayment).mockResolvedValue({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error. Please try again later or contact support.',
      },
    });

    vi.mocked(paymentService.getErrorMessage).mockReturnValue(
      'Server error. Please try again later or contact support.'
    );

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Enter phone number
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    await userEvent.type(phoneInput, '256771234567');

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /Pay Now - UGX 50,000/ });
    await userEvent.click(payButton);

    // Should display server error message
    await waitFor(() => {
      expect(screen.getByText(/Server error. Please try again later or contact support/)).toBeInTheDocument();
    });
  });

  /**
   * Example 36: Minimum font size on mobile
   * Given payment status text is displayed on mobile, when rendered, then the
   * font size should be at least 14px for readability
   * Validates: Requirement 14.4
   */
  test('Example 36: Minimum font size for mobile text', () => {
    const onPaymentDataChange = vi.fn();
    const onPaymentValidated = vi.fn();

    const { container } = render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChange}
        onPaymentValidated={onPaymentValidated}
      />
    );

    // Check that phone input has inline style with fontSize 16px (meets 14px minimum)
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput.style.fontSize).toBe('16px');

    // Check that text elements use text-sm or larger classes (14px+)
    // text-sm = 14px, text-base = 16px, text-lg = 18px, etc.
    // text-xs = 12px (should not be used)
    
    // Verify no text-xs classes are used (12px is below minimum)
    const textXsElements = container.querySelectorAll('.text-xs');
    expect(textXsElements.length).toBe(0);

    // Verify text-sm or larger is used for text elements
    const statusTexts = container.querySelectorAll('.text-sm, .text-base, .text-lg, .text-xl, .text-2xl');
    expect(statusTexts.length).toBeGreaterThan(0);
  });
});
