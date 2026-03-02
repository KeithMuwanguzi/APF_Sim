/**
 * Property-based and unit tests for API client
 * Feature: membership-registration-payment
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import axios from 'axios';
import { submitApplication, formatFieldErrors } from '../services/applicationApi';
import { ApplicationSubmissionData } from '../types/registration';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Feature: membership-registration-payment - API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 31: API Error Display
   * Validates: Requirements 13.2
   * 
   * For any API request failure, a user-friendly error message should be
   * displayed to the user.
   */
  it('Property 31: API Error Display', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate various error scenarios
        fc.oneof(
          // Network errors (no response)
          fc.record({
            type: fc.constant('network'),
            code: fc.constantFrom('ECONNABORTED', 'ENOTFOUND', 'ETIMEDOUT', undefined),
            message: fc.constantFrom(
              'Network Error',
              'timeout of 30000ms exceeded',
              'connect ECONNREFUSED'
            ),
          }),
          // Server errors (5xx)
          fc.record({
            type: fc.constant('server'),
            status: fc.constantFrom(500, 502, 503, 504),
            data: fc.constant({}),
          }),
          // Validation errors (400)
          fc.record({
            type: fc.constant('validation'),
            status: fc.constant(400),
            data: fc.record({
              errors: fc.dictionary(
                fc.constantFrom('email', 'username', 'phone_number', 'date_of_birth'),
                fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
                { minKeys: 1 } // Ensure at least one error field
              ),
            }),
          }),
          // Conflict errors (409)
          fc.record({
            type: fc.constant('conflict'),
            status: fc.constant(409),
            data: fc.record({
              errors: fc.dictionary(
                fc.constantFrom('email', 'username'),
                fc.array(fc.constant('This field is already registered.'), { minLength: 1, maxLength: 1 }),
                { minKeys: 1 } // Ensure at least one error field
              ),
            }),
          }),
          // Payload too large (413)
          fc.record({
            type: fc.constant('payload'),
            status: fc.constant(413),
            data: fc.constant({}),
          }),
        ),
        async (errorScenario) => {
          // Clear mocks before each iteration
          vi.clearAllMocks();
          
          // Create mock application data
          const mockApplicationData: ApplicationSubmissionData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            dateOfBirth: '1990-01-01',
            phoneNumber: '256701234567',
            address: '123 Test St',
            nationalIdNumber: 'CM12345678',
            icpauCertificateNumber: 'ICPAU12345',
            paymentMethod: 'mtn',
            paymentPhone: '256701234567',
            paymentStatus: 'success',
            paymentTransactionReference: 'MTN-123-456',
            documents: [],
          };

          // Mock axios error based on scenario type
          if (errorScenario.type === 'network') {
            const error: any = new Error(errorScenario.message);
            error.code = errorScenario.code;
            error.isAxiosError = true;
            mockedAxios.post.mockRejectedValue(error);
            mockedAxios.isAxiosError.mockReturnValue(true);
          } else {
            const error: any = new Error('Request failed');
            error.isAxiosError = true;
            error.response = {
              status: errorScenario.status,
              data: errorScenario.data,
            };
            mockedAxios.post.mockRejectedValue(error);
            mockedAxios.isAxiosError.mockReturnValue(true);
          }

          // Call submitApplication
          const result = await submitApplication(mockApplicationData);

          // Verify error handling
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toBeTruthy();
          expect(typeof result.error).toBe('string');
          expect(result.error!.length).toBeGreaterThan(0);

          // Verify user-friendly error messages
          if (errorScenario.type === 'network') {
            expect(result.error).toMatch(/connect|connection|timed out|server/i);
          } else if (errorScenario.type === 'server') {
            expect(result.error).toMatch(/wrong|try again|later/i);
          } else if (errorScenario.type === 'validation') {
            expect(result.error).toMatch(/correct|errors|information|invalid|check/i);
            expect(result.fieldErrors).toBeDefined();
          } else if (errorScenario.type === 'conflict') {
            expect(result.error).toMatch(/already|registered|taken/i);
          } else if (errorScenario.type === 'payload') {
            expect(result.error).toMatch(/large|size|5MB/i);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Unit Test: Successful submission
   * Validates: Requirements 9.2
   * 
   * Test that successful API response returns success result with data.
   */
  it('should return success result for successful submission', async () => {
    const mockApplicationData: ApplicationSubmissionData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567',
      address: '123 Test St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU12345',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      paymentStatus: 'success',
      paymentTransactionReference: 'MTN-123-456',
      documents: [],
    };

    const mockResponse = {
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        phoneNumber: '256701234567',
        address: '123 Test St',
        nationalIdNumber: 'CM12345678',
        icpauCertificateNumber: 'ICPAU12345',
        paymentMethod: 'mtn',
        paymentPhone: '256701234567',
        paymentStatus: 'success',
        paymentTransactionReference: 'MTN-123-456',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        documents: [],
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await submitApplication(mockApplicationData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe(1);
    expect(result.data?.username).toBe('testuser');
    expect(result.error).toBeUndefined();
  });

  /**
   * Unit Test: Network error handling
   * Validates: Requirements 9.5, 13.2, 13.3
   * 
   * Test that network errors are handled with user-friendly messages.
   */
  it('should handle network errors with user-friendly message', async () => {
    const mockApplicationData: ApplicationSubmissionData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567',
      address: '123 Test St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU12345',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      documents: [],
    };

    const error: any = new Error('Network Error');
    error.isAxiosError = true;
    mockedAxios.post.mockRejectedValueOnce(error);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const result = await submitApplication(mockApplicationData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('connection');
  });

  /**
   * Unit Test: API validation error handling
   * Validates: Requirements 9.5, 13.2
   * 
   * Test that API validation errors are parsed and returned with field errors.
   */
  it('should handle API validation errors with field errors', async () => {
    const mockApplicationData: ApplicationSubmissionData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2010-01-01', // Underage
      phoneNumber: '256701234567',
      address: '123 Test St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU12345',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      documents: [],
    };

    const error: any = new Error('Validation Error');
    error.isAxiosError = true;
    error.response = {
      status: 400,
      data: {
        errors: {
          email: ['Enter a valid email address.'],
          date_of_birth: ['You must be at least 18 years old.'],
        },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(error);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const result = await submitApplication(mockApplicationData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.email).toEqual(['Enter a valid email address.']);
    expect(result.fieldErrors?.date_of_birth).toEqual(['You must be at least 18 years old.']);
  });

  /**
   * Unit Test: Duplicate email/username error handling
   * Validates: Requirements 9.5, 13.2
   * 
   * Test that duplicate email/username errors return 409 conflict.
   */
  it('should handle duplicate email/username with conflict error', async () => {
    const mockApplicationData: ApplicationSubmissionData = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567',
      address: '123 Test St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU12345',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      documents: [],
    };

    const error: any = new Error('Conflict');
    error.isAxiosError = true;
    error.response = {
      status: 409,
      data: {
        errors: {
          email: ['This email is already registered.'],
        },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(error);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const result = await submitApplication(mockApplicationData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('already registered');
  });

  /**
   * Unit Test: Timeout error handling
   * Validates: Requirements 13.2, 13.3
   * 
   * Test that timeout errors are handled with retry message.
   */
  it('should handle timeout errors with retry message', async () => {
    const mockApplicationData: ApplicationSubmissionData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567',
      address: '123 Test St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU12345',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      documents: [],
    };

    const error: any = new Error('timeout of 30000ms exceeded');
    error.code = 'ECONNABORTED';
    error.isAxiosError = true;
    mockedAxios.post.mockRejectedValueOnce(error);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const result = await submitApplication(mockApplicationData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/timed out|timeout/i);
    expect(result.error).toMatch(/try again/i);
  });

  /**
   * Unit Test: Format field errors utility
   * 
   * Test that field errors are formatted into readable messages.
   */
  it('should format field errors into readable messages', () => {
    const fieldErrors = {
      email: ['Enter a valid email address.'],
      date_of_birth: ['You must be at least 18 years old.'],
      phone_number: ['Phone number must be in format 256XXXXXXXXX.'],
    };

    const formatted = formatFieldErrors(fieldErrors);

    expect(formatted).toContain('Email:');
    expect(formatted).toContain('Enter a valid email address.');
    expect(formatted).toContain('Date Of Birth:');
    expect(formatted).toContain('You must be at least 18 years old.');
    expect(formatted).toContain('Phone Number:');
    expect(formatted).toContain('Phone number must be in format 256XXXXXXXXX.');
  });
});
