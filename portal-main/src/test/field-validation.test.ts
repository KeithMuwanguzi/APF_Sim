/**
 * Property-based tests for field validation utilities
 * Feature: membership-registration-payment
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  validateEmail,
  validatePasswordLength,
  validatePasswordMatch,
  validatePhoneNumber,
  validateAge,
  validateFileSize,
  validateFileFormat,
} from '../utils/validators';

describe('Feature: membership-registration-payment - Field Validation', () => {
  /**
   * Property 5: Invalid Email Rejection
   * Validates: Requirements 2.2
   * 
   * For any string that does not match valid email format,
   * the email validator should reject it and display an error message.
   */
  it('Property 5: Invalid Email Rejection', () => {
    fc.assert(
      fc.property(
        // Generate strings that are NOT valid emails
        fc.oneof(
          fc.string().filter(s => !s.includes('@')), // No @ symbol
          fc.string().filter(s => s.includes('@') && !s.includes('.')), // Has @ but no dot
          fc.constant(''), // Empty string
          fc.constant('   '), // Whitespace only
          fc.constant('@example.com'), // Missing local part
          fc.constant('user@'), // Missing domain
          fc.constant('user@.com'), // Invalid domain
          fc.constant('user @example.com'), // Space in email
        ),
        (invalidEmail) => {
          const result = validateEmail(invalidEmail);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Password Mismatch Rejection
   * Validates: Requirements 2.3
   * 
   * For any pair of password strings where password ≠ passwordConfirmation,
   * the validator should reject them and display an error message.
   */
  it('Property 6: Password Mismatch Rejection', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (password, passwordConfirmation) => {
          // Only test when passwords are different
          fc.pre(password !== passwordConfirmation);
          
          const result = validatePasswordMatch(password, passwordConfirmation);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBe('Passwords do not match');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Short Password Rejection
   * Validates: Requirements 2.4
   * 
   * For any password string with length < 8 characters,
   * the validator should reject it and display an error message.
   */
  it('Property 7: Short Password Rejection', () => {
    fc.assert(
      fc.property(
        // Generate strings with length 0-7
        fc.string({ maxLength: 7 }),
        (shortPassword) => {
          const result = validatePasswordLength(shortPassword);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Invalid Phone Format Rejection
   * Validates: Requirements 3.2
   * 
   * For any phone number string that does not match the expected format
   * or contains non-numeric characters, the validator should reject it
   * and display an error message.
   */
  it('Property 9: Invalid Phone Format Rejection', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong prefix
          fc.string().filter(s => !s.startsWith('256')),
          // Correct prefix but wrong length
          fc.constantFrom('256', '25612', '2561234567', '256123456789012'),
          // Contains non-numeric characters
          fc.constant('256abc123456'),
          fc.constant('256-123-456-789'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
        ),
        (invalidPhone) => {
          const result = validatePhoneNumber(invalidPhone);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Underage User Rejection
   * Validates: Requirements 3.3
   * 
   * For any date of birth that results in age < 18 years from the current date,
   * the validator should reject it and display an error message.
   */
  it('Property 10: Underage User Rejection', () => {
    fc.assert(
      fc.property(
        // Generate dates that result in age < 18
        fc.integer({ min: 0, max: 17 }).chain(yearsAgo => {
          const today = new Date();
          const birthYear = today.getFullYear() - yearsAgo;
          
          return fc.record({
            year: fc.constant(birthYear),
            month: fc.integer({ min: 0, max: 11 }),
            day: fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
          }).map(({ year, month, day }) => {
            const date = new Date(year, month, day);
            // Ensure the date is in the future relative to 18 years ago
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            
            if (date > eighteenYearsAgo) {
              return date.toISOString().split('T')[0];
            }
            // If not underage, adjust to make them underage
            const underageDate = new Date();
            underageDate.setFullYear(underageDate.getFullYear() - yearsAgo);
            return underageDate.toISOString().split('T')[0];
          });
        }),
        (underageDOB) => {
          const result = validateAge(underageDOB);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11: Oversized File Rejection
   * Validates: Requirements 4.2
   * 
   * For any file with size > 5MB (5 * 1024 * 1024 bytes),
   * the file upload validator should reject it and display an error message.
   */
  it('Property 11: Oversized File Rejection', () => {
    fc.assert(
      fc.property(
        // Generate file sizes larger than 5MB
        fc.integer({ min: 5 * 1024 * 1024 + 1, max: 100 * 1024 * 1024 }),
        fc.string({ minLength: 1 }),
        (fileSize, fileName) => {
          // Create a mock File object
          const file = new File([''], fileName, { type: 'application/pdf' });
          
          // Override the size property
          Object.defineProperty(file, 'size', {
            value: fileSize,
            writable: false,
          });
          
          const result = validateFileSize(file);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBe('File size must be less than 5MB');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12: Unsupported File Format Rejection
   * Validates: Requirements 4.3
   * 
   * For any file with extension not in ['.pdf', '.jpg', '.jpeg', '.png'],
   * the file upload validator should reject it and display an error message.
   */
  it('Property 12: Unsupported File Format Rejection', () => {
    fc.assert(
      fc.property(
        // Generate filenames with unsupported extensions
        fc.oneof(
          fc.constant('document.txt'),
          fc.constant('document.doc'),
          fc.constant('document.docx'),
          fc.constant('document.xls'),
          fc.constant('document.xlsx'),
          fc.constant('document.zip'),
          fc.constant('document.exe'),
          fc.constant('document.sh'),
          fc.constant('document.bat'),
          fc.constant('document'), // No extension
          fc.string().filter(s => {
            const lower = s.toLowerCase();
            return !lower.endsWith('.pdf') && 
                   !lower.endsWith('.jpg') && 
                   !lower.endsWith('.jpeg') && 
                   !lower.endsWith('.png') &&
                   s.length > 0;
          }),
        ),
        (fileName) => {
          // Create a mock File object with unsupported format
          const file = new File([''], fileName, { type: 'application/octet-stream' });
          
          const result = validateFileFormat(file);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBe('Only PDF, JPG, JPEG, and PNG files are accepted');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Payment Validation Property Tests
 */

import {
  validateMTNPhone,
  validateMTNTransactionId,
  validateAirtelPhone,
  validateAirtelTransactionId,
  validateCreditCardNumber,
  validateCreditCardExpiry,
  validateCreditCardCVV,
} from '../utils/validators';

describe('Feature: membership-registration-payment - Payment Validation', () => {
  /**
   * Property 15: Mobile Money Phone Format Validation
   * Validates: Requirements 6.2, 7.2
   * 
   * For any mobile money payment (MTN or Airtel), the phone number must match
   * the format 256XXXXXXXXX (where X is a digit 0-9), otherwise validation
   * should fail with an error message.
   */
  it('Property 15: Mobile Money Phone Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong prefix
          fc.string().filter(s => !s.startsWith('256')),
          // Correct prefix but wrong length
          fc.constantFrom('256', '25612', '2561234567', '256123456789012'),
          // Contains non-numeric characters after prefix
          fc.constant('256abc123456'),
          fc.constant('256-123-456-789'),
          fc.constant('256 123456789'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
          // Wrong country code
          fc.constant('254123456789'), // Kenya
          fc.constant('255123456789'), // Tanzania
        ),
        (invalidPhone) => {
          // Test both MTN and Airtel validators
          const mtnResult = validateMTNPhone(invalidPhone);
          expect(mtnResult.isValid).toBe(false);
          expect(mtnResult.errorMessage).toBeDefined();
          expect(mtnResult.errorMessage).toBeTruthy();
          
          const airtelResult = validateAirtelPhone(invalidPhone);
          expect(airtelResult.isValid).toBe(false);
          expect(airtelResult.errorMessage).toBeDefined();
          expect(airtelResult.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 16: MTN Transaction ID Format Validation
   * Validates: Requirements 6.3
   * 
   * For any MTN Mobile Money payment, the transaction ID must match the format
   * MTN-XXXX-XXXX (where X is alphanumeric), otherwise validation should fail
   * with an error message.
   */
  it('Property 16: MTN Transaction ID Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong prefix
          fc.string().filter(s => !s.startsWith('MTN-')),
          // Correct prefix but wrong format
          fc.constant('MTN-123'),
          fc.constant('MTN-12345678'),
          fc.constant('MTN-123-456'),
          fc.constant('MTN-12345-6789'),
          // Contains invalid characters (lowercase, special chars)
          fc.constant('MTN-abcd-efgh'),
          fc.constant('MTN-12@3-45#6'),
          fc.constant('MTN-12 3-456 '),
          // Missing hyphens
          fc.constant('MTN12345678'),
          fc.constant('MTNABCDWXYZ'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
          // Wrong provider prefix
          fc.constant('AM-1234-5678'),
          fc.constant('AIRTEL-1234-5678'),
        ),
        (invalidTransactionId) => {
          const result = validateMTNTransactionId(invalidTransactionId);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17: Airtel Transaction ID Format Validation
   * Validates: Requirements 7.3
   * 
   * For any Airtel Money payment, the transaction ID must match the format
   * AM-XXXX-XXXX (where X is alphanumeric), otherwise validation should fail
   * with an error message.
   */
  it('Property 17: Airtel Transaction ID Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong prefix
          fc.string().filter(s => !s.startsWith('AM-')),
          // Correct prefix but wrong format
          fc.constant('AM-123'),
          fc.constant('AM-12345678'),
          fc.constant('AM-123-456'),
          fc.constant('AM-12345-6789'),
          // Contains invalid characters (lowercase, special chars)
          fc.constant('AM-abcd-efgh'),
          fc.constant('AM-12@3-45#6'),
          fc.constant('AM-12 3-456 '),
          // Missing hyphens
          fc.constant('AM12345678'),
          fc.constant('AMABCDWXYZ'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
          // Wrong provider prefix
          fc.constant('MTN-1234-5678'),
          fc.constant('AIRTEL-1234-5678'),
        ),
        (invalidTransactionId) => {
          const result = validateAirtelTransactionId(invalidTransactionId);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18: Credit Card Number Format Validation
   * Validates: Requirements 8.2
   * 
   * For any Credit Card payment, the card number must match the format
   * XXXX-XXXX-XXXX-XXXX (where X is a digit 0-9), otherwise validation
   * should fail with an error message.
   */
  it('Property 18: Credit Card Number Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong length
          fc.constant('1234-5678-9012'),
          fc.constant('1234-5678-9012-3456-7890'),
          // Wrong format (no hyphens)
          fc.constant('1234567890123456'),
          // Wrong format (different separators)
          fc.constant('1234 5678 9012 3456'),
          fc.constant('1234.5678.9012.3456'),
          // Contains non-numeric characters
          fc.constant('abcd-efgh-ijkl-mnop'),
          fc.constant('123a-5678-9012-3456'),
          // Wrong number of digits per group
          fc.constant('123-5678-9012-3456'),
          fc.constant('12345-678-9012-3456'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
        ),
        (invalidCardNumber) => {
          const result = validateCreditCardNumber(invalidCardNumber);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19: Credit Card Expiry Date Format Validation
   * Validates: Requirements 8.3
   * 
   * For any Credit Card payment, the expiry date must match the format MM/YY
   * and not be in the past, otherwise validation should fail with an error message.
   */
  it('Property 19: Credit Card Expiry Date Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong format
          fc.constant('13/25'), // Invalid month
          fc.constant('00/25'), // Invalid month
          fc.constant('1/25'), // Single digit month
          fc.constant('12/2025'), // Four digit year
          fc.constant('12-25'), // Wrong separator
          fc.constant('12.25'), // Wrong separator
          fc.constant('122025'), // No separator
          // Past dates - generate dates from 2020 to current year
          fc.integer({ min: 20, max: 23 }).chain(year => 
            fc.integer({ min: 1, max: 12 }).map(month => 
              `${month.toString().padStart(2, '0')}/${year}`
            )
          ),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
        ),
        (invalidExpiry) => {
          const result = validateCreditCardExpiry(invalidExpiry);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 20a: Credit Card CVV Format Validation
   * Validates: Requirements 8.4
   * 
   * For any Credit Card payment, the CVV must match the format XXX
   * (where X is a digit 0-9), otherwise validation should fail with an error message.
   */
  it('Property 20a: Credit Card CVV Format Validation', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Wrong length
          fc.constant('12'),
          fc.constant('1234'),
          fc.constant('12345'),
          // Contains non-numeric characters
          fc.constant('abc'),
          fc.constant('12a'),
          fc.constant('1@3'),
          // Empty or whitespace
          fc.constant(''),
          fc.constant('   '),
        ),
        (invalidCVV) => {
          const result = validateCreditCardCVV(invalidCVV);
          expect(result.isValid).toBe(false);
          expect(result.errorMessage).toBeDefined();
          expect(result.errorMessage).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});
