/**
 * Tests for registration TypeScript types
 * Feature: membership-registration-payment
 * Task: 6.1 - Verify TypeScript types are properly configured
 */

import { describe, it, expect } from 'vitest';
import type {
  AccountDetailsData,
  PersonalInfoData,
  DocumentData,
  PaymentData,
  PaymentMethod,
  ApplicationSubmissionData,
  ValidationError,
  ValidationRule,
} from '../types/registration';

describe('Registration TypeScript Types', () => {
  it('should allow creating AccountDetailsData objects', () => {
    const accountDetails: AccountDetailsData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    expect(accountDetails.username).toBe('testuser');
    expect(accountDetails.email).toBe('test@example.com');
  });

  it('should allow creating PersonalInfoData objects', () => {
    const personalInfo: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      phoneNumber: '256701234567',
      address: '123 Main St',
    };

    expect(personalInfo.firstName).toBe('John');
    expect(personalInfo.phoneNumber).toBe('256701234567');
  });

  it('should allow creating PaymentData objects with different methods', () => {
    const mtnPayment: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: true,
    };

    const creditCardPayment: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: true,
    };

    expect(mtnPayment.method).toBe('mtn');
    expect(creditCardPayment.method).toBe('credit_card');
  });

  it('should enforce PaymentMethod type constraints', () => {
    const validMethods: PaymentMethod[] = ['mtn', 'airtel', 'credit_card'];
    
    expect(validMethods).toHaveLength(3);
    expect(validMethods).toContain('mtn');
    expect(validMethods).toContain('airtel');
    expect(validMethods).toContain('credit_card');
  });

  it('should allow creating ValidationError objects', () => {
    const error: ValidationError = {
      field: 'email',
      message: 'Invalid email format',
    };

    expect(error.field).toBe('email');
    expect(error.message).toBe('Invalid email format');
  });

  it('should allow creating ValidationRule objects', () => {
    const rule: ValidationRule = {
      field: 'email',
      validators: [(value: string) => value.includes('@')],
      errorMessage: 'Email must contain @',
    };

    expect(rule.field).toBe('email');
    expect(rule.validators).toHaveLength(1);
    expect(rule.validators[0]('test@example.com')).toBe(true);
    expect(rule.validators[0]('invalid')).toBe(false);
  });

  it('should allow creating ApplicationSubmissionData objects', () => {
    const submission: ApplicationSubmissionData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      phoneNumber: '256701234567',
      address: '123 Main St',
      paymentMethod: 'mtn',
      paymentPhone: '256701234567',
      paymentTransactionId: 'MTN-AB12-CD34',
      documents: [],
    };

    expect(submission.username).toBe('testuser');
    expect(submission.paymentMethod).toBe('mtn');
    expect(submission.documents).toEqual([]);
  });
});
