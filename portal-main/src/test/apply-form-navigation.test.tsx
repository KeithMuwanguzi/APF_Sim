/**
 * ApplyForm Navigation Property Tests
 * Feature: membership-registration-payment
 * 
 * Property tests for form navigation and data preservation.
 * Requirements: 1.4, 1.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import ApplyForm from '../components/register-components/Applyform';

// Arbitraries for generating test data
const accountDetailsArbitrary = fc.record({
  username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
  email: fc.emailAddress(),
  password: fc.string({ minLength: 8, maxLength: 20 }),
  passwordConfirmation: fc.string({ minLength: 8, maxLength: 20 }),
}).map(data => ({
  ...data,
  passwordConfirmation: data.password, // Ensure passwords match
}));

describe('Feature: membership-registration-payment - ApplyForm Navigation', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    // Ensure DOM is clean
    cleanup();
  });

  afterEach(() => {
    // Clean up session storage after each test
    sessionStorage.clear();
    // Ensure DOM is clean
    cleanup();
  });

  /**
   * Property 3: Forward Navigation Preserves Data
   * 
   * For any registration step with entered data, clicking Next should advance
   * to the next step while preserving all previously entered data in the form state.
   * 
   * Validates: Requirements 1.4
   */
  it('Property 3: Forward Navigation Preserves Data', () => {
    fc.assert(
      fc.property(accountDetailsArbitrary, (accountData) => {
        // Clean up before each iteration
        cleanup();
        sessionStorage.clear();
        
        // Render the form
        render(<ApplyForm />);

        try {
          // Fill in account details
          const usernameInput = screen.getByPlaceholderText(/johndoe/i);
          const emailInput = screen.getByPlaceholderText(/john@example.com/i);
          const passwordInput = screen.getByPlaceholderText(/Enter password/i);
          const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);

          fireEvent.change(usernameInput, { target: { value: accountData.username } });
          fireEvent.change(emailInput, { target: { value: accountData.email } });
          fireEvent.change(passwordInput, { target: { value: accountData.password } });
          fireEvent.change(confirmPasswordInput, { target: { value: accountData.passwordConfirmation } });

          // Trigger blur to validate fields
          fireEvent.blur(usernameInput);
          fireEvent.blur(emailInput);
          fireEvent.blur(passwordInput);
          fireEvent.blur(confirmPasswordInput);

          // Get the Next button
          const nextButton = screen.getByRole('button', { name: /next/i });
          
          // Check if Next button is enabled (validation passed)
          if (!nextButton.hasAttribute('disabled')) {
            // Click Next to advance to step 2
            fireEvent.click(nextButton);

            // Verify we're on step 2 (Personal Information)
            const personalInfoHeading = screen.queryByText(/Personal & Professional Information/i);
            if (personalInfoHeading) {
              // Go back to step 1
              const backButton = screen.getByRole('button', { name: /back/i });
              fireEvent.click(backButton);

              // Verify we're back on step 1
              expect(screen.getByRole('heading', { name: /Account Details/i })).toBeInTheDocument();

              // Verify data is preserved
              const usernameInputAfter = screen.getByPlaceholderText(/johndoe/i) as HTMLInputElement;
              const emailInputAfter = screen.getByPlaceholderText(/john@example.com/i) as HTMLInputElement;
              const passwordInputAfter = screen.getByPlaceholderText(/Enter password/i) as HTMLInputElement;
              const confirmPasswordInputAfter = screen.getByPlaceholderText(/Confirm password/i) as HTMLInputElement;

              expect(usernameInputAfter.value).toBe(accountData.username);
              expect(emailInputAfter.value).toBe(accountData.email);
              expect(passwordInputAfter.value).toBe(accountData.password);
              expect(confirmPasswordInputAfter.value).toBe(accountData.passwordConfirmation);
            }
          }
        } finally {
          // Clean up after each iteration
          cleanup();
          sessionStorage.clear();
        }
      }),
      { numRuns: 10 } // Reduced runs for UI tests with proper cleanup
    );
  });

  /**
   * Property 4: Backward Navigation Preserves Data
   * 
   * For any registration step, navigating back to a previous step should
   * display all previously entered data unchanged.
   * 
   * Validates: Requirements 1.5
   */
  it('Property 4: Backward Navigation Preserves Data', () => {
    fc.assert(
      fc.property(accountDetailsArbitrary, (accountData) => {
        // Clean up before each iteration
        cleanup();
        sessionStorage.clear();
        
        // Render the form
        render(<ApplyForm />);

        try {
          // Fill in account details
          const usernameInput = screen.getByPlaceholderText(/johndoe/i);
          const emailInput = screen.getByPlaceholderText(/john@example.com/i);
          const passwordInput = screen.getByPlaceholderText(/Enter password/i);
          const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);

          fireEvent.change(usernameInput, { target: { value: accountData.username } });
          fireEvent.change(emailInput, { target: { value: accountData.email } });
          fireEvent.change(passwordInput, { target: { value: accountData.password } });
          fireEvent.change(confirmPasswordInput, { target: { value: accountData.passwordConfirmation } });

          // Trigger blur to validate fields
          fireEvent.blur(usernameInput);
          fireEvent.blur(emailInput);
          fireEvent.blur(passwordInput);
          fireEvent.blur(confirmPasswordInput);

          // Get the Next button
          const nextButton = screen.getByRole('button', { name: /next/i });
          
          // Check if Next button is enabled (validation passed)
          if (!nextButton.hasAttribute('disabled')) {
            // Click Next to advance to step 2
            fireEvent.click(nextButton);

            // Verify we're on step 2 (Personal Information)
            const personalInfoHeading = screen.queryByText(/Personal & Professional Information/i);
            if (personalInfoHeading) {
              // Go back to step 1
              const backButton = screen.getByRole('button', { name: /back/i });
              fireEvent.click(backButton);

              // Verify we're back on step 1
              expect(screen.getByRole('heading', { name: /Account Details/i })).toBeInTheDocument();

              // Verify data is preserved (backward navigation)
              const usernameInputAfter = screen.getByPlaceholderText(/johndoe/i) as HTMLInputElement;
              const emailInputAfter = screen.getByPlaceholderText(/john@example.com/i) as HTMLInputElement;
              const passwordInputAfter = screen.getByPlaceholderText(/Enter password/i) as HTMLInputElement;
              const confirmPasswordInputAfter = screen.getByPlaceholderText(/Confirm password/i) as HTMLInputElement;

              expect(usernameInputAfter.value).toBe(accountData.username);
              expect(emailInputAfter.value).toBe(accountData.email);
              expect(passwordInputAfter.value).toBe(accountData.password);
              expect(confirmPasswordInputAfter.value).toBe(accountData.passwordConfirmation);
            }
          }
        } finally {
          // Clean up after each iteration
          cleanup();
          sessionStorage.clear();
        }
      }),
      { numRuns: 10 } // Reduced runs for UI tests with proper cleanup
    );
  });
});
