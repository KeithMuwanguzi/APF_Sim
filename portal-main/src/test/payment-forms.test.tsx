/**
 * Property-based and unit tests for PaymentForms component
 * Feature: membership-registration-payment
 * 
 * Tests payment method forms, validation integration, and data clearing
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { PaymentForms } from '../components/register-components/PaymentForms';
import { PaymentMethod } from '../types/registration';

describe('Feature: membership-registration-payment - PaymentForms', () => {
  /**
   * Property 14: Payment Method Change Clears Data
   * Validates: Requirements 5.3
   * 
   * For any payment method selection with entered payment data,
   * changing to a different payment method should clear all previously entered payment data.
   */
  it('Property 14: Payment Method Change Clears Data', () => {
    fc.assert(
      fc.property(
        // Generate two different payment methods
        fc.constantFrom<PaymentMethod>('mtn', 'airtel', 'credit_card'),
        fc.constantFrom<PaymentMethod>('mtn', 'airtel', 'credit_card'),
        (method1, method2) => {
          // Skip if methods are the same
          if (method1 === method2) {
            return true;
          }

          const onPaymentDataChangeMock = vi.fn();
          const onPaymentValidatedMock = vi.fn();

          // Render with first method
          const { rerender, unmount } = render(
            <PaymentForms
              selectedMethod={method1}
              onPaymentDataChange={onPaymentDataChangeMock}
              onPaymentValidated={onPaymentValidatedMock}
            />
          );

          // Enter some data based on method1
          if (method1 === 'mtn' || method1 === 'airtel') {
            const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
            fireEvent.change(phoneInput, { target: { value: '256701234567' } });
          } else {
            const cardInput = screen.getByPlaceholderText('XXXX-XXXX-XXXX-XXXX');
            fireEvent.change(cardInput, { target: { value: '4532-1234-5678-9010' } });
          }

          // Change to method2
          rerender(
            <PaymentForms
              selectedMethod={method2}
              onPaymentDataChange={onPaymentDataChangeMock}
              onPaymentValidated={onPaymentValidatedMock}
            />
          );

          // Verify data was cleared - check that new form has empty fields
          if (method2 === 'mtn' || method2 === 'airtel') {
            const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX') as HTMLInputElement;
            expect(phoneInput.value).toBe('');
          } else {
            const cardInput = screen.getByPlaceholderText('XXXX-XXXX-XXXX-XXXX') as HTMLInputElement;
            expect(cardInput.value).toBe('');
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PaymentForms - Unit Tests', () => {
  /**
   * Unit Test: Display MTN payment form
   * Validates: Requirements 5.1, 5.2
   */
  it('should display MTN payment form when MTN is selected', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText('MTN Mobile Money Payment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('256XXXXXXXXX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MTN-XXXX-XXXX')).toBeInTheDocument();
  });

  /**
   * Unit Test: Display Airtel payment form
   * Validates: Requirements 5.1, 5.2
   */
  it('should display Airtel payment form when Airtel is selected', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="airtel"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText('Airtel Money Payment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('256XXXXXXXXX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('AM-XXXX-XXXX')).toBeInTheDocument();
  });

  /**
   * Unit Test: Display Credit Card payment form
   * Validates: Requirements 5.1, 5.2
   */
  it('should display Credit Card payment form when Credit Card is selected', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="credit_card"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText('Credit Card Payment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('XXXX-XXXX-XXXX-XXXX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('XXX')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
  });

  /**
   * Unit Test: Don't display form when no method selected
   * Validates: Requirements 5.4
   */
  it('should not display any form when no payment method is selected', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    const { container } = render(
      <PaymentForms
        selectedMethod={null}
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  /**
   * Unit Test: MTN form has required fields
   * Validates: Requirements 5.1
   */
  it('should have phone number and transaction ID fields for MTN', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const transactionInput = screen.getByLabelText(/Transaction ID/i);

    expect(phoneInput).toBeInTheDocument();
    expect(transactionInput).toBeInTheDocument();
  });

  /**
   * Unit Test: Airtel form has required fields
   * Validates: Requirements 5.1
   */
  it('should have phone number and transaction ID fields for Airtel', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="airtel"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const transactionInput = screen.getByLabelText(/Transaction ID/i);

    expect(phoneInput).toBeInTheDocument();
    expect(transactionInput).toBeInTheDocument();
  });

  /**
   * Unit Test: Credit Card form has all required fields
   * Validates: Requirements 5.1
   */
  it('should have all required fields for Credit Card', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="credit_card"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    const cardNumberInput = screen.getByLabelText(/Card Number/i);
    const expiryInput = screen.getByLabelText(/Expiry Date/i);
    const cvvInput = screen.getByLabelText(/CVV/i);
    const nameInput = screen.getByLabelText(/Cardholder Name/i);

    expect(cardNumberInput).toBeInTheDocument();
    expect(expiryInput).toBeInTheDocument();
    expect(cvvInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  /**
   * Unit Test: Field changes trigger callback
   * Validates: Requirements 5.2
   */
  it('should trigger onPaymentDataChange when field values change', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    fireEvent.change(phoneInput, { target: { value: '256701234567' } });

    expect(onPaymentDataChangeMock).toHaveBeenCalled();
  });

  /**
   * Unit Test: Changing payment method clears MTN data
   * Validates: Requirements 5.3
   */
  it('should clear MTN data when changing to Airtel', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    const { rerender } = render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    // Enter MTN data
    const phoneInput = screen.getByPlaceholderText('256XXXXXXXXX');
    fireEvent.change(phoneInput, { target: { value: '256701234567' } });

    // Change to Airtel
    rerender(
      <PaymentForms
        selectedMethod="airtel"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    // Verify Airtel form has empty fields
    const airtelPhoneInput = screen.getByPlaceholderText('256XXXXXXXXX') as HTMLInputElement;
    expect(airtelPhoneInput.value).toBe('');
  });

  /**
   * Unit Test: Changing payment method clears Credit Card data
   * Validates: Requirements 5.3
   */
  it('should clear Credit Card data when changing to MTN', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    const { rerender } = render(
      <PaymentForms
        selectedMethod="credit_card"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    // Enter Credit Card data
    const cardInput = screen.getByPlaceholderText('XXXX-XXXX-XXXX-XXXX');
    fireEvent.change(cardInput, { target: { value: '4532-1234-5678-9010' } });

    // Change to MTN
    rerender(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    // Verify MTN form has empty fields
    const mtnPhoneInput = screen.getByPlaceholderText('256XXXXXXXXX') as HTMLInputElement;
    expect(mtnPhoneInput.value).toBe('');
  });

  /**
   * Unit Test: MTN form shows instructions
   * Validates: Requirements 5.5
   */
  it('should display payment instructions for MTN', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="mtn"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText(/Instructions:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dial \*165#/i)).toBeInTheDocument();
  });

  /**
   * Unit Test: Airtel form shows instructions
   * Validates: Requirements 5.5
   */
  it('should display payment instructions for Airtel', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="airtel"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText(/Instructions:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dial \*185#/i)).toBeInTheDocument();
  });

  /**
   * Unit Test: Credit Card form shows security message
   * Validates: Requirements 5.5
   */
  it('should display security message for Credit Card', () => {
    const onPaymentDataChangeMock = vi.fn();
    const onPaymentValidatedMock = vi.fn();

    render(
      <PaymentForms
        selectedMethod="credit_card"
        onPaymentDataChange={onPaymentDataChangeMock}
        onPaymentValidated={onPaymentValidatedMock}
      />
    );

    expect(screen.getByText(/Secure Payment:/i)).toBeInTheDocument();
    expect(screen.getByText(/encrypted and secure/i)).toBeInTheDocument();
  });
});
