# Field Validation Utilities

This directory contains validation utilities for the membership registration payment system.

## Files

### validators.ts

Contains all field validation functions for the registration form:

- **validateEmail(email: string)**: Validates email format using regex
- **validatePasswordLength(password: string)**: Ensures password is at least 8 characters
- **validatePasswordMatch(password: string, passwordConfirmation: string)**: Verifies passwords match
- **validatePhoneNumber(phoneNumber: string)**: Validates phone format (256XXXXXXXXX)
- **validateAge(dateOfBirth: string)**: Ensures user is 18 years or older
- **validateFileSize(file: File)**: Validates file size is under 5MB
- **validateFileFormat(file: File)**: Validates file format (PDF, JPG, JPEG, PNG)
- **validateFile(file: File)**: Combined validation for file size and format

All validators return a `ValidationResult` object with:
```typescript
{
  isValid: boolean;
  errorMessage?: string;
}
```

## Usage Example

```typescript
import { validateEmail, validatePasswordLength } from './utils/validators';

const emailResult = validateEmail('user@example.com');
if (!emailResult.isValid) {
  console.error(emailResult.errorMessage);
}

const passwordResult = validatePasswordLength('mypassword');
if (passwordResult.isValid) {
  console.log('Password is valid');
}
```

## Testing

The validators are tested with:
- **Property-based tests** (field-validation.test.ts): Tests universal properties across 100+ random inputs
- **Unit tests** (validators-unit.test.ts): Tests specific examples and edge cases

Run tests with:
```bash
npm test -- validators
```
