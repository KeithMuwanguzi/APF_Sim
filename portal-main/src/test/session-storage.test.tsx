/**
 * Property-based tests for session storage persistence
 * Feature: membership-registration-payment
 * Requirements: 14.1, 14.2, 14.3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import type {
  AccountDetailsData,
  PersonalInfoData,
  PaymentData,
} from '../types/registration';

describe('Session Storage Persistence Tests', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    sessionStorage.clear();
  });

  /**
   * Property 33: Session Storage Persistence
   * 
   * For any form step with entered data, the Registration_Form should store
   * the step data in browser session storage.
   * 
   * Validates: Requirements 14.1
   */
  it('Property 33: should persist account details to session storage', () => {
    const accountDetailsArbitrary = fc.record({
      username: fc.string({ minLength: 1, maxLength: 20 }),
      email: fc.emailAddress(),
      password: fc.string({ minLength: 8, maxLength: 20 }),
      passwordConfirmation: fc.string({ minLength: 8, maxLength: 20 }),
    });

    fc.assert(
      fc.property(accountDetailsArbitrary, (accountDetails) => {
        const { result } = renderHook(() => useRegistrationForm());

        // Set account details
        act(() => {
          result.current.setAccountDetails(accountDetails);
        });

        // Verify data is stored in session storage
        const stored = sessionStorage.getItem('registration_account_details');
        expect(stored).not.toBeNull();
        
        const parsed = JSON.parse(stored!);
        expect(parsed.username).toBe(accountDetails.username);
        expect(parsed.email).toBe(accountDetails.email);
        expect(parsed.password).toBe(accountDetails.password);
        expect(parsed.passwordConfirmation).toBe(accountDetails.passwordConfirmation);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 33: should persist personal info to session storage', () => {
    const personalInfoArbitrary = fc.record({
      firstName: fc.string({ minLength: 1, maxLength: 20 }),
      lastName: fc.string({ minLength: 1, maxLength: 20 }),
      dateOfBirth: fc.date({ max: new Date() }).map(d => d.toISOString().split('T')[0]),
      phoneNumber: fc.integer({ min: 700000000, max: 799999999 }).map(n => `256${n}`),
      address: fc.string({ minLength: 5, maxLength: 100 }),
    });

    fc.assert(
      fc.property(personalInfoArbitrary, (personalInfo) => {
        const { result } = renderHook(() => useRegistrationForm());

        // Set personal info
        act(() => {
          result.current.setPersonalInfo(personalInfo);
        });

        // Verify data is stored in session storage
        const stored = sessionStorage.getItem('registration_personal_info');
        expect(stored).not.toBeNull();
        
        const parsed = JSON.parse(stored!);
        expect(parsed.firstName).toBe(personalInfo.firstName);
        expect(parsed.lastName).toBe(personalInfo.lastName);
        expect(parsed.dateOfBirth).toBe(personalInfo.dateOfBirth);
        expect(parsed.phoneNumber).toBe(personalInfo.phoneNumber);
        expect(parsed.address).toBe(personalInfo.address);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 33: should persist payment data to session storage', () => {
    const paymentArbitrary = fc.oneof(
      // MTN payment
      fc.record({
        method: fc.constant('mtn' as const),
        phoneNumber: fc.integer({ min: 700000000, max: 799999999 }).map(n => `256${n}`),
        transactionId: fc.string({ minLength: 10, maxLength: 15 }),
        isValidated: fc.boolean(),
      }),
      // Credit card payment
      fc.record({
        method: fc.constant('credit_card' as const),
        cardNumber: fc.string({ minLength: 16, maxLength: 19 }),
        expiryDate: fc.string({ minLength: 5, maxLength: 5 }),
        cvv: fc.string({ minLength: 3, maxLength: 3 }),
        cardholderName: fc.string({ minLength: 3, maxLength: 50 }),
        isValidated: fc.boolean(),
      })
    );

    fc.assert(
      fc.property(paymentArbitrary, (payment) => {
        const { result } = renderHook(() => useRegistrationForm());

        // Set payment data
        act(() => {
          result.current.setPayment(payment as PaymentData);
        });

        // Verify data is stored in session storage
        const stored = sessionStorage.getItem('registration_payment');
        expect(stored).not.toBeNull();
        
        const parsed = JSON.parse(stored!);
        expect(parsed.method).toBe(payment.method);
        expect(parsed.isValidated).toBe(payment.isValidated);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 33: should persist current step to session storage', () => {
    const stepArbitrary = fc.integer({ min: 0, max: 3 });

    fc.assert(
      fc.property(stepArbitrary, (step) => {
        const { result } = renderHook(() => useRegistrationForm());

        // Set current step
        act(() => {
          result.current.setCurrentStep(step);
        });

        // Verify step is stored in session storage
        const stored = sessionStorage.getItem('registration_current_step');
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!)).toBe(step);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 34: Session Storage Round Trip
   * 
   * For any form data stored in session storage, refreshing the page should
   * restore all previously entered data.
   * 
   * Validates: Requirements 14.2
   */
  it('Property 34: should restore account details from session storage', () => {
    const accountDetailsArbitrary = fc.record({
      username: fc.string({ minLength: 1, maxLength: 20 }),
      email: fc.emailAddress(),
      password: fc.string({ minLength: 8, maxLength: 20 }),
      passwordConfirmation: fc.string({ minLength: 8, maxLength: 20 }),
    });

    fc.assert(
      fc.property(accountDetailsArbitrary, (accountDetails) => {
        // First hook instance - save data
        const { result: result1 } = renderHook(() => useRegistrationForm());
        
        act(() => {
          result1.current.setAccountDetails(accountDetails);
        });

        // Second hook instance - simulates page refresh
        const { result: result2 } = renderHook(() => useRegistrationForm());

        // Verify data is restored
        expect(result2.current.accountDetails).not.toBeNull();
        expect(result2.current.accountDetails?.username).toBe(accountDetails.username);
        expect(result2.current.accountDetails?.email).toBe(accountDetails.email);
        expect(result2.current.accountDetails?.password).toBe(accountDetails.password);
        expect(result2.current.accountDetails?.passwordConfirmation).toBe(accountDetails.passwordConfirmation);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 34: should restore personal info from session storage', () => {
    const personalInfoArbitrary = fc.record({
      firstName: fc.string({ minLength: 1, maxLength: 20 }),
      lastName: fc.string({ minLength: 1, maxLength: 20 }),
      dateOfBirth: fc.date({ max: new Date() }).map(d => d.toISOString().split('T')[0]),
      phoneNumber: fc.integer({ min: 700000000, max: 799999999 }).map(n => `256${n}`),
      address: fc.string({ minLength: 5, maxLength: 100 }),
    });

    fc.assert(
      fc.property(personalInfoArbitrary, (personalInfo) => {
        // First hook instance - save data
        const { result: result1 } = renderHook(() => useRegistrationForm());
        
        act(() => {
          result1.current.setPersonalInfo(personalInfo);
        });

        // Second hook instance - simulates page refresh
        const { result: result2 } = renderHook(() => useRegistrationForm());

        // Verify data is restored
        expect(result2.current.personalInfo).not.toBeNull();
        expect(result2.current.personalInfo?.firstName).toBe(personalInfo.firstName);
        expect(result2.current.personalInfo?.lastName).toBe(personalInfo.lastName);
        expect(result2.current.personalInfo?.dateOfBirth).toBe(personalInfo.dateOfBirth);
        expect(result2.current.personalInfo?.phoneNumber).toBe(personalInfo.phoneNumber);
        expect(result2.current.personalInfo?.address).toBe(personalInfo.address);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 34: should restore current step from session storage', () => {
    const stepArbitrary = fc.integer({ min: 0, max: 3 });

    fc.assert(
      fc.property(stepArbitrary, (step) => {
        // First hook instance - save step
        const { result: result1 } = renderHook(() => useRegistrationForm());
        
        act(() => {
          result1.current.setCurrentStep(step);
        });

        // Second hook instance - simulates page refresh
        const { result: result2 } = renderHook(() => useRegistrationForm());

        // Verify step is restored
        expect(result2.current.currentStep).toBe(step);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 35: Session Storage Cleanup
   * 
   * For any successful application submission, the Registration_Form should
   * clear all session storage data.
   * 
   * Validates: Requirements 14.3
   */
  it('Property 35: should clear all session storage data', () => {
    const formDataArbitrary = fc.record({
      step: fc.integer({ min: 0, max: 3 }),
      accountDetails: fc.record({
        username: fc.string({ minLength: 1, maxLength: 20 }),
        email: fc.emailAddress(),
        password: fc.string({ minLength: 8, maxLength: 20 }),
        passwordConfirmation: fc.string({ minLength: 8, maxLength: 20 }),
      }),
      personalInfo: fc.record({
        firstName: fc.string({ minLength: 1, maxLength: 20 }),
        lastName: fc.string({ minLength: 1, maxLength: 20 }),
        dateOfBirth: fc.date({ max: new Date() }).map(d => d.toISOString().split('T')[0]),
        phoneNumber: fc.integer({ min: 700000000, max: 799999999 }).map(n => `256${n}`),
        address: fc.string({ minLength: 5, maxLength: 100 }),
      }),
    });

    fc.assert(
      fc.property(formDataArbitrary, (formData) => {
        const { result } = renderHook(() => useRegistrationForm());

        // Set all form data
        act(() => {
          result.current.setCurrentStep(formData.step);
          result.current.setAccountDetails(formData.accountDetails);
          result.current.setPersonalInfo(formData.personalInfo);
        });

        // Verify data is in session storage
        expect(sessionStorage.getItem('registration_current_step')).not.toBeNull();
        expect(sessionStorage.getItem('registration_account_details')).not.toBeNull();
        expect(sessionStorage.getItem('registration_personal_info')).not.toBeNull();

        // Clear all data
        act(() => {
          result.current.clearAllData();
        });

        // Verify all session storage is cleared
        expect(sessionStorage.getItem('registration_current_step')).toBeNull();
        expect(sessionStorage.getItem('registration_account_details')).toBeNull();
        expect(sessionStorage.getItem('registration_personal_info')).toBeNull();
        expect(sessionStorage.getItem('registration_documents')).toBeNull();
        expect(sessionStorage.getItem('registration_payment')).toBeNull();
        expect(sessionStorage.getItem('registration_last_updated')).toBeNull();

        // Verify state is reset
        expect(result.current.currentStep).toBe(0);
        expect(result.current.accountDetails).toBeNull();
        expect(result.current.personalInfo).toBeNull();
        expect(result.current.documents).toEqual([]);
        expect(result.current.payment).toBeNull();

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
