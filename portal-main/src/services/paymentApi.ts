/**
 * Mock Payment API Service
 * Feature: membership-registration-payment
 * 
 * Simulates third-party payment processing.
 * In production, this will be replaced with actual payment gateway integration.
 */

import { PaymentMethod } from '../types/registration';

export interface PaymentRequest {
  method: PaymentMethod;
  amount: number;
  // Mobile money fields
  phoneNumber?: string;
  // Credit card fields
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionReference?: string;
  errorMessage?: string;
}

/**
 * Mock payment processing function
 * Simulates a third-party payment gateway
 * 
 * @param request - Payment request details
 * @returns Promise that resolves with payment response after 2-3 seconds
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate network delay (2-3 seconds)
  const delay = 2000 + Math.random() * 1000;
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate 80% success rate for testing
  const isSuccessful = Math.random() < 0.8;
  
  if (isSuccessful) {
    // Generate mock transaction reference
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const transactionReference = `${request.method.toUpperCase()}-${timestamp}-${random}`;
    
    return {
      success: true,
      transactionReference,
    };
  } else {
    // Simulate various failure reasons based on payment method
    let errorMessages: string[];
    
    if (request.method === 'credit_card') {
      errorMessages = [
        'Card declined by issuer',
        'Insufficient funds',
        'Invalid card number',
        'Card expired',
        'CVV verification failed',
        'Transaction limit exceeded',
      ];
    } else {
      errorMessages = [
        'Insufficient funds in account',
        'Payment declined by provider',
        'Invalid phone number',
        'Network timeout - please try again',
        'Account not registered for mobile money',
      ];
    }
    
    const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    return {
      success: false,
      errorMessage,
    };
  }
}

/**
 * Validate phone number format for Uganda (256XXXXXXXXX)
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^256\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validate credit card number (basic Luhn algorithm check)
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all digits and has valid length (13-19 digits)
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate credit card expiry date (MM/YY format, not in past)
 */
export function validateExpiryDate(expiry: string): boolean {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
  if (!expiryRegex.test(expiry)) {
    return false;
  }
  
  const [month, year] = expiry.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  
  return expiryDate > now;
}

/**
 * Validate CVV (3 or 4 digits)
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Validate cardholder name (non-empty, letters and spaces only)
 */
export function validateCardholderName(name: string): boolean {
  return /^[a-zA-Z\s]{2,}$/.test(name.trim());
}
