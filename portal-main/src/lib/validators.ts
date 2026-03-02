/**
 * Field validation utilities for membership registration payment system
 * Feature: membership-registration-payment
 */

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Email format validator with regex
 * Requirements: 2.2
 * 
 * @param email - Email string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Email is required'
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: 'Email must be in valid format'
    };
  }

  return { isValid: true };
}

/**
 * Password length validator (min 8 chars)
 * Requirements: 2.4
 * 
 * @param password - Password string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validatePasswordLength(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      errorMessage: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      errorMessage: 'Password must be at least 8 characters'
    };
  }

  return { isValid: true };
}

/**
 * Password match validator
 * Requirements: 2.3
 * 
 * @param password - Original password
 * @param passwordConfirmation - Confirmation password
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validatePasswordMatch(
  password: string,
  passwordConfirmation: string
): ValidationResult {
  if (password !== passwordConfirmation) {
    return {
      isValid: false,
      errorMessage: 'Passwords do not match'
    };
  }

  return { isValid: true };
}

/**
 * Phone number format validator (256XXXXXXXXX)
 * Requirements: 3.2
 * 
 * @param phoneNumber - Phone number string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validatePhoneNumber(phoneNumber: string): ValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Phone number is required'
    };
  }

  // Format: 256XXXXXXXXX (256 followed by 9 digits)
  const phoneRegex = /^256\d{9}$/;
  
  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      errorMessage: 'Phone number must be in format 256XXXXXXXXX'
    };
  }

  return { isValid: true };
}

/**
 * Age validator (18+ years)
 * Requirements: 3.3
 * 
 * @param dateOfBirth - Date of birth in ISO format (YYYY-MM-DD)
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateAge(dateOfBirth: string): ValidationResult {
  if (!dateOfBirth || dateOfBirth.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Date of birth is required'
    };
  }

  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(dob.getTime())) {
    return {
      isValid: false,
      errorMessage: 'Invalid date format'
    };
  }

  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  
  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 18) {
    return {
      isValid: false,
      errorMessage: 'You must be at least 18 years old'
    };
  }

  return { isValid: true };
}

/**
 * File size validator (max 5MB)
 * Requirements: 4.2
 * 
 * @param file - File object to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateFileSize(file: File): ValidationResult {
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: 'File size must be less than 5MB'
    };
  }

  return { isValid: true };
}

/**
 * File format validator (PDF, JPG, JPEG, PNG)
 * Requirements: 4.3
 * 
 * @param file - File object to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateFileFormat(file: File): ValidationResult {
  const acceptedFormats = ['.pdf', '.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  
  const hasValidExtension = acceptedFormats.some(format => 
    fileName.endsWith(format)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      errorMessage: 'Only PDF, JPG, JPEG, and PNG files are accepted'
    };
  }

  return { isValid: true };
}

/**
 * Combined file validator (size and format)
 * Requirements: 4.2, 4.3
 * 
 * @param file - File object to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateFile(file: File): ValidationResult {
  // Check file size first
  const sizeResult = validateFileSize(file);
  if (!sizeResult.isValid) {
    return sizeResult;
  }

  // Check file format
  const formatResult = validateFileFormat(file);
  if (!formatResult.isValid) {
    return formatResult;
  }

  return { isValid: true };
}

/**
 * Payment Validation Utilities
 * Requirements: 6.2, 6.3, 7.2, 7.3, 8.2, 8.3, 8.4
 */

/**
 * MTN phone format validator (256XXXXXXXXX)
 * Requirements: 6.2
 * 
 * @param phoneNumber - Phone number string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateMTNPhone(phoneNumber: string): ValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'MTN phone number is required'
    };
  }

  // Format: 256XXXXXXXXX (256 followed by 9 digits)
  const phoneRegex = /^256\d{9}$/;
  
  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      errorMessage: 'MTN phone number must be in format 256XXXXXXXXX'
    };
  }

  return { isValid: true };
}

/**
 * MTN transaction ID validator (MTN-XXXX-XXXX)
 * Requirements: 6.3
 * 
 * @param transactionId - Transaction ID string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateMTNTransactionId(transactionId: string): ValidationResult {
  if (!transactionId || transactionId.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'MTN transaction ID is required'
    };
  }

  // Format: MTN-XXXX-XXXX (where X is alphanumeric)
  const transactionRegex = /^MTN-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  
  if (!transactionRegex.test(transactionId)) {
    return {
      isValid: false,
      errorMessage: 'MTN transaction ID must be in format MTN-XXXX-XXXX'
    };
  }

  return { isValid: true };
}

/**
 * Airtel phone format validator (256XXXXXXXXX)
 * Requirements: 7.2
 * 
 * @param phoneNumber - Phone number string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateAirtelPhone(phoneNumber: string): ValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Airtel phone number is required'
    };
  }

  // Format: 256XXXXXXXXX (256 followed by 9 digits)
  const phoneRegex = /^256\d{9}$/;
  
  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      errorMessage: 'Airtel phone number must be in format 256XXXXXXXXX'
    };
  }

  return { isValid: true };
}

/**
 * Airtel transaction ID validator (AM-XXXX-XXXX)
 * Requirements: 7.3
 * 
 * @param transactionId - Transaction ID string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateAirtelTransactionId(transactionId: string): ValidationResult {
  if (!transactionId || transactionId.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Airtel transaction ID is required'
    };
  }

  // Format: AM-XXXX-XXXX (where X is alphanumeric)
  const transactionRegex = /^AM-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  
  if (!transactionRegex.test(transactionId)) {
    return {
      isValid: false,
      errorMessage: 'Airtel transaction ID must be in format AM-XXXX-XXXX'
    };
  }

  return { isValid: true };
}

/**
 * Credit Card number validator (XXXX-XXXX-XXXX-XXXX)
 * Requirements: 8.2
 * 
 * @param cardNumber - Card number string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateCreditCardNumber(cardNumber: string): ValidationResult {
  if (!cardNumber || cardNumber.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Credit card number is required'
    };
  }

  // Format: XXXX-XXXX-XXXX-XXXX (where X is a digit)
  const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  
  if (!cardRegex.test(cardNumber)) {
    return {
      isValid: false,
      errorMessage: 'Credit card number must be in format XXXX-XXXX-XXXX-XXXX'
    };
  }

  return { isValid: true };
}

/**
 * Credit Card expiry date validator (MM/YY, not in past)
 * Requirements: 8.3
 * 
 * @param expiryDate - Expiry date string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateCreditCardExpiry(expiryDate: string): ValidationResult {
  if (!expiryDate || expiryDate.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Credit card expiry date is required'
    };
  }

  // Format: MM/YY
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
  if (!expiryRegex.test(expiryDate)) {
    return {
      isValid: false,
      errorMessage: 'Credit card expiry date must be in format MM/YY'
    };
  }

  // Check if date is not in the past
  const [month, year] = expiryDate.split('/');
  const expiryMonth = parseInt(month, 10);
  const expiryYear = 2000 + parseInt(year, 10); // Convert YY to YYYY

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed

  // Check if expiry date is in the past
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return {
      isValid: false,
      errorMessage: 'Credit card expiry date cannot be in the past'
    };
  }

  return { isValid: true };
}

/**
 * Credit Card CVV validator (XXX)
 * Requirements: 8.4
 * 
 * @param cvv - CVV string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateCreditCardCVV(cvv: string): ValidationResult {
  if (!cvv || cvv.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Credit card CVV is required'
    };
  }

  // Format: XXX (where X is a digit)
  const cvvRegex = /^\d{3}$/;
  
  if (!cvvRegex.test(cvv)) {
    return {
      isValid: false,
      errorMessage: 'Credit card CVV must be 3 digits'
    };
  }

  return { isValid: true };
}

/**
 * Credit Card cardholder name validator (required, non-empty)
 * Requirements: 8.4
 * 
 * @param cardholderName - Cardholder name string to validate
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateCreditCardholderName(cardholderName: string): ValidationResult {
  if (!cardholderName || cardholderName.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Cardholder name is required'
    };
  }

  return { isValid: true };
}
