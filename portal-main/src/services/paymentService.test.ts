/**
 * Tests for PaymentService
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import paymentService from './paymentService';

describe('PaymentService Tests', () => {
  beforeEach(() => {
    paymentService.setAuthToken('');
  });

  // Feature: frontend-payment-integration, Property 18: URL validation before requests
  test('Property 18: validates HTTP/HTTPS URLs correctly', async () => {
    const testService = new (paymentService.constructor as any)();
    
    // Valid URLs should not throw INVALID_URL
    (testService as any).baseURL = 'http://localhost:8000';
    try {
      await (testService as any).request('/test', { method: 'GET' });
    } catch (error: any) {
      expect(error.code).not.toBe('INVALID_URL');
    }

    (testService as any).baseURL = 'https://api.example.com';
    try {
      await (testService as any).request('/test', { method: 'GET' });
    } catch (error: any) {
      expect(error.code).not.toBe('INVALID_URL');
    }

    // Invalid URLs should throw INVALID_URL
    (testService as any).baseURL = 'ftp://invalid.com';
    try {
      await (testService as any).request('/test', { method: 'GET' });
      expect.fail('Should have thrown INVALID_URL error');
    } catch (error: any) {
      expect(error.code).toBe('INVALID_URL');
    }

    (testService as any).baseURL = 'not-a-url';
    try {
      await (testService as any).request('/test', { method: 'GET' });
      expect.fail('Should have thrown INVALID_URL error');
    } catch (error: any) {
      expect(error.code).toBe('INVALID_URL');
    }
  });

  // Feature: frontend-payment-integration, Property 4: Phone number format validation
  test('Property 4: validates phone number format 256XXXXXXXXX', () => {
    // Valid phone numbers
    expect(paymentService.validatePhoneNumber('256700000000')).toBe(true);
    expect(paymentService.validatePhoneNumber('256777123456')).toBe(true);
    expect(paymentService.validatePhoneNumber('256789999999')).toBe(true);

    // Invalid phone numbers
    expect(paymentService.validatePhoneNumber('')).toBe(false);
    expect(paymentService.validatePhoneNumber('256')).toBe(false);
    expect(paymentService.validatePhoneNumber('25612345678')).toBe(false); // Too short
    expect(paymentService.validatePhoneNumber('2561234567890')).toBe(false); // Too long
    expect(paymentService.validatePhoneNumber('255123456789')).toBe(false); // Wrong prefix
    expect(paymentService.validatePhoneNumber('256abc123456')).toBe(false); // Contains letters
    expect(paymentService.validatePhoneNumber('not-a-phone')).toBe(false);
  });

  // Feature: frontend-payment-integration, Property 1, 2, 7: API endpoint, auth token, and amount
  test('Property 1, 2, 7: initiatePayment uses correct endpoint, auth token, and amount', async () => {
    const originalFetch = global.fetch;
    let capturedRequest: { url: string; options: RequestInit } | null = null;

    global.fetch = vi.fn(async (url: string | URL, options?: RequestInit) => {
      capturedRequest = { url: url.toString(), options: options || {} };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          payment_id: 'test-payment-id',
          transaction_reference: 'test-ref',
        }),
      } as Response;
    });

    try {
      // Test with auth token
      paymentService.setAuthToken('test-token-123');
      await paymentService.initiatePayment('256700000000', 'mtn', 50000, 'app-123');

      expect(capturedRequest).not.toBeNull();
      expect(capturedRequest!.url).toContain('/api/v1/payments/initiate/');
      
      const headers = capturedRequest!.options.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-token-123');
      
      const body = JSON.parse(capturedRequest!.options.body as string);
      expect(body.phone_number).toBe('256700000000');
      expect(body.provider).toBe('mtn');
      expect(body.amount).toBe(50000);
      expect(body.application_id).toBe('app-123');

      // Test without application_id
      capturedRequest = null;
      await paymentService.initiatePayment('256777123456', 'airtel', 150000);
      
      const body2 = JSON.parse(capturedRequest!.options.body as string);
      expect(body2.phone_number).toBe('256777123456');
      expect(body2.provider).toBe('airtel');
      expect(body2.amount).toBe(150000);
      expect(body2.application_id).toBeUndefined();
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Feature: frontend-payment-integration, Property 1, 2: API endpoint and auth token for checkPaymentStatus
  test('Property 1, 2: checkPaymentStatus uses correct endpoint and includes auth token', async () => {
    const originalFetch = global.fetch;
    let capturedRequest: { url: string; options: RequestInit } | null = null;

    global.fetch = vi.fn(async (url: string | URL, options?: RequestInit) => {
      capturedRequest = { url: url.toString(), options: options || {} };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          status: 'completed',
          message: 'Payment successful',
          updated_at: '2024-01-01T00:00:00Z',
          amount: '50000',
          currency: 'UGX',
          provider: 'mtn',
        }),
      } as Response;
    });

    try {
      // Test with auth token
      paymentService.setAuthToken('test-token-456');
      await paymentService.checkPaymentStatus('payment-123');

      expect(capturedRequest).not.toBeNull();
      expect(capturedRequest!.url).toContain('/api/v1/payments/status/payment-123/');
      expect(capturedRequest!.options.method).toBe('GET');
      
      const headers = capturedRequest!.options.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-token-456');

      // Test with different payment ID
      capturedRequest = null;
      await paymentService.checkPaymentStatus('payment-xyz-789');
      
      expect(capturedRequest!.url).toContain('/api/v1/payments/status/payment-xyz-789/');
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Feature: frontend-payment-integration, Property 1, 15: API endpoint for retryPayment and new payment ID
  test('Property 1, 15: retryPayment uses correct endpoint and returns new payment ID', async () => {
    const originalFetch = global.fetch;
    let capturedRequest: { url: string; options: RequestInit } | null = null;

    global.fetch = vi.fn(async (url: string | URL, options?: RequestInit) => {
      capturedRequest = { url: url.toString(), options: options || {} };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          new_payment_id: 'new-payment-id-123',
          transaction_reference: 'new-ref-456',
          message: 'Payment retry initiated',
        }),
      } as Response;
    });

    try {
      // Test retry with original payment ID
      paymentService.setAuthToken('test-token-789');
      const result = await paymentService.retryPayment('original-payment-id');

      expect(capturedRequest).not.toBeNull();
      expect(capturedRequest!.url).toContain('/api/v1/payments/original-payment-id/retry/');
      expect(capturedRequest!.options.method).toBe('POST');
      
      const headers = capturedRequest!.options.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-token-789');

      // Verify new payment ID is returned
      expect(result.success).toBe(true);
      expect(result.new_payment_id).toBe('new-payment-id-123');
      expect(result.transaction_reference).toBe('new-ref-456');
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Feature: frontend-payment-integration, Property 1: API endpoint correctness for cancelPayment
  test('Property 1: cancelPayment uses correct endpoint', async () => {
    const originalFetch = global.fetch;
    let capturedRequest: { url: string; options: RequestInit } | null = null;

    global.fetch = vi.fn(async (url: string | URL, options?: RequestInit) => {
      capturedRequest = { url: url.toString(), options: options || {} };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Payment cancelled successfully',
        }),
      } as Response;
    });

    try {
      paymentService.setAuthToken('test-token-cancel');
      const result = await paymentService.cancelPayment('payment-to-cancel');

      expect(capturedRequest).not.toBeNull();
      expect(capturedRequest!.url).toContain('/api/v1/payments/payment-to-cancel/cancel/');
      expect(capturedRequest!.options.method).toBe('POST');
      
      const headers = capturedRequest!.options.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-token-cancel');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Payment cancelled successfully');
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Feature: frontend-payment-integration, Property 3, 16: Network error handling and backend error messages
  test('Property 3, 16: handles network errors and displays backend error messages', async () => {
    const originalFetch = global.fetch;

    try {
      // Test network error
      global.fetch = vi.fn(async () => {
        throw new Error('Network connection failed');
      });

      try {
        await paymentService.initiatePayment('256700000000', 'mtn', 50000);
        expect.fail('Should have thrown network error');
      } catch (error: any) {
        expect(error.code).toBe('NETWORK_ERROR');
        const message = paymentService.getErrorMessage(error);
        expect(message).toBe('Network error. Please check your connection and try again.');
      }

      // Test backend error message
      global.fetch = vi.fn(async () => ({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            code: 'INSUFFICIENT_FUNDS',
            message: 'Insufficient funds in account',
          },
        }),
      } as Response));

      try {
        await paymentService.initiatePayment('256700000000', 'mtn', 50000);
        expect.fail('Should have thrown insufficient funds error');
      } catch (error: any) {
        expect(error.code).toBe('INSUFFICIENT_FUNDS');
        const message = paymentService.getErrorMessage(error);
        expect(message).toBe('Insufficient funds. Please top up your account and try again.');
      }

      // Test 401 authentication error
      global.fetch = vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({}),
      } as Response));

      try {
        await paymentService.checkPaymentStatus('payment-123');
        expect.fail('Should have thrown authentication error');
      } catch (error: any) {
        expect(error.code).toBe('AUTHENTICATION_ERROR');
        const message = paymentService.getErrorMessage(error);
        expect(message).toBe('Session expired. Please log in again.');
      }

      // Test 500 server error
      global.fetch = vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response));

      try {
        await paymentService.initiatePayment('256700000000', 'mtn', 50000);
        expect.fail('Should have thrown server error');
      } catch (error: any) {
        expect(error.code).toBe('SERVER_ERROR');
        const message = paymentService.getErrorMessage(error);
        expect(message).toBe('Server error. Please try again later or contact support.');
      }
    } finally {
      global.fetch = originalFetch;
    }
  });

  // Example 38: Development mode API logging
  // Validates: Requirements 7.4
  test('Example 38: logs API endpoint in development mode', async () => {
    // Mock console.log to capture logs
    const originalConsoleLog = console.log;
    const logs: any[] = [];
    console.log = vi.fn((...args: any[]) => {
      logs.push(args);
    });

    // Mock import.meta.env.DEV to simulate development mode
    const originalEnv = import.meta.env.DEV;
    (import.meta.env as any).DEV = true;

    try {
      // Create a new instance to trigger initialization logging
      const TestService = paymentService.constructor as any;
      const testService = new TestService();

      // Verify initialization log
      const initLog = logs.find(log => 
        log[0] === '[PaymentService] Initialized with API base URL:'
      );
      expect(initLog).toBeDefined();
      expect(initLog[1]).toBeDefined(); // Should log the base URL

      // Clear logs for request/response testing
      logs.length = 0;

      // Mock fetch for request/response logging
      const originalFetch = global.fetch;
      global.fetch = vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ success: true }),
      } as Response));

      // Make a request to trigger request/response logging
      testService.setAuthToken('test-token');
      await testService.initiatePayment('256700000000', 'mtn', 50000);

      // Verify request log
      const requestLog = logs.find(log => 
        log[0] === '[PaymentService] Request:'
      );
      expect(requestLog).toBeDefined();
      expect(requestLog[1]).toMatchObject({
        method: 'POST',
        endpoint: '/api/v1/payments/initiate/',
        hasToken: true
      });

      // Verify response log
      const responseLog = logs.find(log => 
        log[0] === '[PaymentService] Response:'
      );
      expect(responseLog).toBeDefined();
      expect(responseLog[1]).toMatchObject({
        status: 200,
        statusText: 'OK'
      });

      global.fetch = originalFetch;
    } finally {
      console.log = originalConsoleLog;
      (import.meta.env as any).DEV = originalEnv;
    }
  });

  // Example 38 (continued): Error logging in development mode
  // Validates: Requirements 7.4
  test('Example 38 (continued): logs errors in development mode', async () => {
    // Mock console.error to capture error logs
    const originalConsoleError = console.error;
    const errorLogs: any[] = [];
    console.error = vi.fn((...args: any[]) => {
      errorLogs.push(args);
    });

    // Mock import.meta.env.DEV to simulate development mode
    const originalEnv = import.meta.env.DEV;
    (import.meta.env as any).DEV = true;

    // Mock fetch to throw an error
    const originalFetch = global.fetch;
    global.fetch = vi.fn(async () => {
      throw new Error('Network failure');
    });

    try {
      const TestService = paymentService.constructor as any;
      const testService = new TestService();
      testService.setAuthToken('test-token');

      // Attempt a request that will fail
      try {
        await testService.initiatePayment('256700000000', 'mtn', 50000);
      } catch (error) {
        // Expected to throw
      }

      // Verify error log
      const errorLog = errorLogs.find(log => 
        log[0] === '[PaymentService] Error:'
      );
      expect(errorLog).toBeDefined();
      expect(errorLog[1]).toBeDefined(); // Should log the error object
    } finally {
      console.error = originalConsoleError;
      (import.meta.env as any).DEV = originalEnv;
      global.fetch = originalFetch;
    }
  });
});
