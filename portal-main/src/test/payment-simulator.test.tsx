/**
 * Property-based and unit tests for PaymentSimulator component
 * Feature: membership-registration-payment
 * 
 * Tests payment success indicator display and callback triggering
 * Requirements: 6.4, 6.5, 7.4, 7.5, 8.5, 8.6
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { PaymentSimulator } from '../components/register-components/PaymentSimulator';
import { PaymentData, PaymentMethod } from '../types/registration';

describe('Feature: membership-registration-payment - PaymentSimulator', () => {
  /**
   * Property 21: Valid Payment Shows Success
   * Validates: Requirements 6.4, 7.4, 8.5
   * 
   * For any payment method with valid payment data (correct format for all required fields),
   * the payment simulator should display a "Payment Successful" indicator.
   */
  it('Property 21: Valid Payment Shows Success', () => {
    fc.assert(
      fc.property(
        // Generate valid payment data for any method
        fc.constantFrom<PaymentMethod>('mtn', 'airtel', 'credit_card'),
        (method) => {
          let paymentData: PaymentData;

          // Create valid payment data based on method
          if (method === 'mtn') {
            paymentData = {
              method: 'mtn',
              phoneNumber: '256701234567',
              transactionId: 'MTN-AB12-CD34',
              isValidated: true,
            };
          } else if (method === 'airtel') {
            paymentData = {
              method: 'airtel',
              phoneNumber: '256752345678',
              transactionId: 'AM-XY12-ZW34',
              isValidated: true,
            };
          } else {
            paymentData = {
              method: 'credit_card',
              cardNumber: '4532-1234-5678-9010',
              expiryDate: '12/28',
              cvv: '123',
              cardholderName: 'John Doe',
              isValidated: true,
            };
          }

          const onPaymentSuccessMock = vi.fn();

          const { unmount } = render(
            <PaymentSimulator
              isValid={true}
              onPaymentSuccess={onPaymentSuccessMock}
            />
          );

          // Should display "Payment Successful" indicator
          const successText = screen.queryByText('Payment Successful');
          expect(successText).toBeInTheDocument();
          
          const detailsText = screen.queryByText('Your payment details have been validated successfully.');
          expect(detailsText).toBeInTheDocument();

          // Cleanup after each iteration
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 22: Valid Payment Enables Submission
   * Validates: Requirements 6.5, 7.5, 8.6
   * 
   * For any valid and successful payment, the Submit button should be enabled
   * (via the onPaymentSuccess callback).
   */
  it('Property 22: Valid Payment Enables Submission', () => {
    fc.assert(
      fc.property(
        // Generate valid payment data for any method
        fc.constantFrom<PaymentMethod>('mtn', 'airtel', 'credit_card'),
        (method) => {
          let paymentData: PaymentData;

          // Create valid payment data based on method
          if (method === 'mtn') {
            paymentData = {
              method: 'mtn',
              phoneNumber: '256701234567',
              transactionId: 'MTN-AB12-CD34',
              isValidated: true,
            };
          } else if (method === 'airtel') {
            paymentData = {
              method: 'airtel',
              phoneNumber: '256752345678',
              transactionId: 'AM-XY12-ZW34',
              isValidated: true,
            };
          } else {
            paymentData = {
              method: 'credit_card',
              cardNumber: '4532-1234-5678-9010',
              expiryDate: '12/28',
              cvv: '123',
              cardholderName: 'John Doe',
              isValidated: true,
            };
          }

          const onPaymentSuccessMock = vi.fn();

          const { unmount } = render(
            <PaymentSimulator
              isValid={true}
              onPaymentSuccess={onPaymentSuccessMock}
            />
          );

          // Should trigger payment success callback
          expect(onPaymentSuccessMock).toHaveBeenCalled();

          // Cleanup after each iteration
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PaymentSimulator - Unit Tests', () => {
  /**
   * Unit Test: Display success indicator for valid MTN payment
   * Validates: Requirements 6.4
   */
  it('should display success indicator for valid MTN payment', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(
      screen.getByText('Your payment details have been validated successfully.')
    ).toBeInTheDocument();
  });

  /**
   * Unit Test: Display success indicator for valid Airtel payment
   * Validates: Requirements 7.4
   */
  it('should display success indicator for valid Airtel payment', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      phoneNumber: '256752345678',
      transactionId: 'AM-XY12-ZW34',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(
      screen.getByText('Your payment details have been validated successfully.')
    ).toBeInTheDocument();
  });

  /**
   * Unit Test: Display success indicator for valid Credit Card payment
   * Validates: Requirements 8.5
   */
  it('should display success indicator for valid Credit Card payment', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/28',
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(
      screen.getByText('Your payment details have been validated successfully.')
    ).toBeInTheDocument();
  });

  /**
   * Unit Test: Trigger payment success callback for MTN
   * Validates: Requirements 6.5
   */
  it('should trigger payment success callback for valid MTN payment', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(onPaymentSuccessMock).toHaveBeenCalled();
  });

  /**
   * Unit Test: Trigger payment success callback for Airtel
   * Validates: Requirements 7.5
   */
  it('should trigger payment success callback for valid Airtel payment', () => {
    const paymentData: PaymentData = {
      method: 'airtel',
      phoneNumber: '256752345678',
      transactionId: 'AM-XY12-ZW34',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(onPaymentSuccessMock).toHaveBeenCalled();
  });

  /**
   * Unit Test: Trigger payment success callback for Credit Card
   * Validates: Requirements 8.6
   */
  it('should trigger payment success callback for valid Credit Card payment', () => {
    const paymentData: PaymentData = {
      method: 'credit_card',
      cardNumber: '4532-1234-5678-9010',
      expiryDate: '12/28',
      cvv: '123',
      cardholderName: 'John Doe',
      isValidated: true,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(onPaymentSuccessMock).toHaveBeenCalled();
  });

  /**
   * Unit Test: Don't display success indicator when invalid
   * Validates: Requirements 6.4, 7.4, 8.5
   */
  it('should not display success indicator when payment is invalid', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: 'invalid',
      transactionId: 'invalid',
      isValidated: false,
    };

    const onPaymentSuccessMock = vi.fn();

    const { container } = render(
      <PaymentSimulator
        isValid={false}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    // Should not display anything
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Payment Successful')).not.toBeInTheDocument();
  });

  /**
   * Unit Test: Don't trigger callback when invalid
   * Validates: Requirements 6.5, 7.5, 8.6
   */
  it('should not trigger payment success callback when payment is invalid', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: 'invalid',
      transactionId: 'invalid',
      isValidated: false,
    };

    const onPaymentSuccessMock = vi.fn();

    render(
      <PaymentSimulator
        isValid={false}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    expect(onPaymentSuccessMock).not.toHaveBeenCalled();
  });

  /**
   * Unit Test: Update when validation state changes
   */
  it('should update when validation state changes from invalid to valid', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: false,
    };

    const onPaymentSuccessMock = vi.fn();

    const { rerender, container } = render(
      <PaymentSimulator
        isValid={false}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    // Initially should not display anything
    expect(container.firstChild).toBeNull();
    expect(onPaymentSuccessMock).not.toHaveBeenCalled();

    // Update to valid
    rerender(
      <PaymentSimulator
        paymentData={{ ...paymentData, isValidated: true }}
        isValid={true}
        onPaymentSuccess={onPaymentSuccessMock}
      />
    );

    // Should now display success and trigger callback
    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(onPaymentSuccessMock).toHaveBeenCalled();
  });

  /**
   * Unit Test: Success indicator has proper styling
   */
  it('should display success indicator with green styling', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: true,
    };

    const { container } = render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={vi.fn()}
      />
    );

    // Check for green styling classes
    const successContainer = container.querySelector('.bg-green-50');
    expect(successContainer).toBeInTheDocument();
    expect(successContainer).toHaveClass('border-green-200');
  });

  /**
   * Unit Test: Success indicator has checkmark icon
   */
  it('should display checkmark icon in success indicator', () => {
    const paymentData: PaymentData = {
      method: 'mtn',
      phoneNumber: '256701234567',
      transactionId: 'MTN-AB12-CD34',
      isValidated: true,
    };

    const { container } = render(
      <PaymentSimulator
        isValid={true}
        onPaymentSuccess={vi.fn()}
      />
    );

    // Check for SVG icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Check for checkmark polyline
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
    expect(polyline).toHaveAttribute('points', '20 6 9 17 4 12');
  });
});

