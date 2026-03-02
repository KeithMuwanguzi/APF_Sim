/**
 * Unit tests for PaymentValidator component
 * Feature: membership-registration-payment
 * 
 * Tests MTN, Airtel, and Credit Card payment validation
 * Requirements: 6.1, 7.1, 8.1
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PaymentValidator } from '../components/register-components/PaymentValidator';
import { PaymentData } from '../types/registration';

describe('PaymentValidator - Unit Tests', () => {
  /**
   * Unit Test: MTN payment validation with valid data
   * Validates: Requirements 6.1
   */
  it('should validate MTN payment with valid phone and transaction ID', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="mtn"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be valid
    expect(lastCall[0]).toBe(true);
    // Should have no errors
    expect(lastCall[1]).toHaveLength(0);
  });

  /**
   * Unit Test: MTN payment validation with invalid phone
   * Validates: Requirements 6.1, 6.2
   */
  it('should reject MTN payment with invalid phone format', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '123456789', // Invalid format
      transactionId: 'MTN-AB12-CD34',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="mtn"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for phoneNumber
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'phoneNumber',
          message: expect.stringContaining('256XXXXXXXXX'),
        }),
      ])
    );
  });

  /**
   * Unit Test: MTN payment validation with invalid transaction ID
   * Validates: Requirements 6.1, 6.3
   */
  it('should reject MTN payment with invalid transaction ID format', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'INVALID-ID', // Invalid format
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="mtn"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for transactionId
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'transactionId',
          message: expect.stringContaining('MTN-XXXX-XXXX'),
        }),
      ])
    );
  });

  /**
   * Unit Test: MTN payment validation with missing fields
   * Validates: Requirements 6.1
   */
  it('should reject MTN payment with missing required fields', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="mtn"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have errors for both fields
    expect(lastCall[1]).toHaveLength(2);
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'phoneNumber' }),
        expect.objectContaining({ field: 'transactionId' }),
      ])
    );
  });

  /**
   * Unit Test: Airtel payment validation with valid data
   * Validates: Requirements 7.1
   */
  it('should validate Airtel payment with valid phone and transaction ID', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      phoneNumber: '256752345678',
      transactionId: 'AM-XY12-ZW34',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="airtel"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be valid
    expect(lastCall[0]).toBe(true);
    // Should have no errors
    expect(lastCall[1]).toHaveLength(0);
  });

  /**
   * Unit Test: Airtel payment validation with invalid phone
   * Validates: Requirements 7.1, 7.2
   */
  it('should reject Airtel payment with invalid phone format', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      phoneNumber: '0752345678', // Invalid format (missing 256)
      transactionId: 'AM-XY12-ZW34',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="airtel"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for phoneNumber
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'phoneNumber',
          message: expect.stringContaining('256XXXXXXXXX'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Airtel payment validation with invalid transaction ID
   * Validates: Requirements 7.1, 7.3
   */
  it('should reject Airtel payment with invalid transaction ID format', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      phoneNumber: '256752345678',
      transactionId: 'MTN-AB12-CD34', // Wrong prefix (MTN instead of AM)
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="airtel"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for transactionId
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'transactionId',
          message: expect.stringContaining('AM-XXXX-XXXX'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Airtel payment validation with missing fields
   * Validates: Requirements 7.1
   */
  it('should reject Airtel payment with missing required fields', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="airtel"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have errors for both fields
    expect(lastCall[1]).toHaveLength(2);
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'phoneNumber' }),
        expect.objectContaining({ field: 'transactionId' }),
      ])
    );
  });

  /**
   * Unit Test: Credit Card payment validation with valid data
   * Validates: Requirements 8.1
   */
  it('should validate Credit Card payment with all valid fields', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/28', // Future date
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be valid
    expect(lastCall[0]).toBe(true);
    // Should have no errors
    expect(lastCall[1]).toHaveLength(0);
  });

  /**
   * Unit Test: Credit Card payment validation with invalid card number
   * Validates: Requirements 8.1, 8.2
   */
  it('should reject Credit Card payment with invalid card number format', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '1234567890123456', // Missing dashes
      expiryDate: '12/28', // Future date
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for cardNumber
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'cardNumber',
          message: expect.stringContaining('XXXX-XXXX-XXXX-XXXX'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Credit Card payment validation with invalid expiry date
   * Validates: Requirements 8.1, 8.3
   */
  it('should reject Credit Card payment with invalid expiry date format', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '13/28', // Invalid month (13)
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for expiryDate
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'expiryDate',
          message: expect.stringContaining('MM/YY'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Credit Card payment validation with invalid CVV
   * Validates: Requirements 8.1, 8.4
   */
  it('should reject Credit Card payment with invalid CVV format', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/28', // Future date
      cvv: '12', // Too short
      cardholderName: 'John Doe',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for cvv
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'cvv',
          message: expect.stringContaining('3 digits'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Credit Card payment validation with missing cardholder name
   * Validates: Requirements 8.1, 8.4
   */
  it('should reject Credit Card payment with missing cardholder name', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/28', // Future date
      cvv: '123',
      cardholderName: '', // Empty
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have error for cardholderName
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'cardholderName',
          message: expect.stringContaining('required'),
        }),
      ])
    );
  });

  /**
   * Unit Test: Credit Card payment validation with all missing fields
   * Validates: Requirements 8.1
   */
  it('should reject Credit Card payment with all missing fields', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      isValidated: false,
    };

    const onValidationResultMock = vi.fn();

    render(
      <PaymentValidator
        method="credit_card"
        paymentData={paymentData}
        onValidationResult={onValidationResultMock}
      />
    );

    expect(onValidationResultMock).toHaveBeenCalled();
    const calls = onValidationResultMock.mock.calls;
    const lastCall = calls[calls.length - 1];

    // Should be invalid
    expect(lastCall[0]).toBe(false);
    // Should have errors for all 4 fields
    expect(lastCall[1]).toHaveLength(4);
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'cardNumber' }),
        expect.objectContaining({ field: 'expiryDate' }),
        expect.objectContaining({ field: 'cvv' }),
        expect.objectContaining({ field: 'cardholderName' }),
      ])
    );
  });

  /**
   * Unit Test: Validation updates when payment data changes
   * Validates: Requirements 6.1, 7.1, 8.1
   */
  it('should update validation when payment data changes', () => {
    const onValidationResultMock = vi.fn();

    // Start with invalid MTN data
    const { rerender } = render(
      <PaymentValidator
        method="mtn"
        paymentData={{
          method: 'mtn',
          phoneNumber: '',
          transactionId: '',
          isValidated: false,
        }}
        onValidationResult={onValidationResultMock}
      />
    );

    // Should be invalid initially
    expect(onValidationResultMock).toHaveBeenCalled();
    let calls = onValidationResultMock.mock.calls;
    expect(calls[calls.length - 1][0]).toBe(false);

    // Update with valid data
    rerender(
      <PaymentValidator
        method="mtn"
        paymentData={{
          method: 'mtn',
          phoneNumber: '256701234567',
          transactionId: 'MTN-AB12-CD34',
          isValidated: false,
        }}
        onValidationResult={onValidationResultMock}
      />
    );

    // Should now be valid
    calls = onValidationResultMock.mock.calls;
    expect(calls[calls.length - 1][0]).toBe(true);
    expect(calls[calls.length - 1][1]).toHaveLength(0);
  });

  /**
   * Unit Test: Component doesn't render anything
   */
  it('should not render any visible content', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: false,
    };

    const { container } = render(
      <PaymentValidator
        method="mtn"
        paymentData={paymentData}
        onValidationResult={vi.fn()}
      />
    );

    // Component should render null (no visible content)
    expect(container.firstChild).toBeNull();
  });
});
