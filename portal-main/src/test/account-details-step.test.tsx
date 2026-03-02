/**
 * Property-based and unit tests for Account Details Step component
 * Feature: membership-registration-payment
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import AccountDetailsStep from '../components/register-components/steps/AccountStep';
import { AccountDetailsData } from '../types/registration';

describe('Feature: membership-registration-payment - Account Details Step', () => {
  /**
   * Property 8: Valid Account Details Enable Progression
   * Validates: Requirements 2.5
   * 
   * For any account details data where all fields are valid
   * (valid email, matching passwords, password length ≥ 8),
   * the Next button should be enabled.
   */
  it('Property 8: Valid Account Details Enable Progression', () => {
    fc.assert(
      fc.property(
        // Generate valid account details
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 0),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 30 }),
        }).chain(({ username, email, password }) => 
          fc.constant({
            username,
            email,
            password,
            passwordConfirmation: password, // Matching password
          })
        ),
        (validAccountDetails) => {
          const onChangeMock = vi.fn();
          const onValidationChangeMock = vi.fn();

          render(
            <AccountDetailsStep
              data={validAccountDetails}
              onChange={onChangeMock}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Wait for validation to complete
          waitFor(() => {
            // Check that onValidationChange was called with true
            const calls = onValidationChangeMock.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall).toBeDefined();
            expect(lastCall[0]).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Account Details Step - Unit Tests', () => {
  /**
   * Unit Test: All required fields are present
   * Validates: Requirements 2.1
   */
  it('should render all required fields', () => {
    const mockData: AccountDetailsData = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    };

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i).length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Unit Test: Validation with empty fields
   * Validates: Requirements 2.5
   */
  it('should call onValidationChange with false when fields are empty', async () => {
    const mockData: AccountDetailsData = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    };

    const onValidationChangeMock = vi.fn();

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={onValidationChangeMock}
      />
    );

    await waitFor(() => {
      expect(onValidationChangeMock).toHaveBeenCalled();
      const calls = onValidationChangeMock.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe(false);
    });
  });

  /**
   * Unit Test: Validation with valid data
   * Validates: Requirements 2.5
   */
  it('should call onValidationChange with true when all fields are valid', async () => {
    const mockData: AccountDetailsData = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    const onValidationChangeMock = vi.fn();

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={onValidationChangeMock}
      />
    );

    await waitFor(() => {
      expect(onValidationChangeMock).toHaveBeenCalled();
      const calls = onValidationChangeMock.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe(true);
    });
  });

  /**
   * Unit Test: Field change triggers onChange callback
   * Validates: Requirements 2.1
   */
  it('should call onChange when field values change', () => {
    const mockData: AccountDetailsData = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    };

    const onChangeMock = vi.fn();

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={onChangeMock}
        onValidationChange={vi.fn()}
      />
    );

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });

    expect(onChangeMock).toHaveBeenCalledWith({
      username: 'johndoe',
      email: '',
      password: '',
      passwordConfirmation: '',
    });
  });

  /**
   * Unit Test: Error display on blur with invalid email
   * Validates: Requirements 2.2
   */
  it('should display error when email is invalid after blur', async () => {
    const mockData: AccountDetailsData = {
      username: 'johndoe',
      email: 'invalid-email',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/email must be in valid format/i)).toBeInTheDocument();
    });
  });

  /**
   * Unit Test: Error display when passwords don't match
   * Validates: Requirements 2.3
   */
  it('should display error when passwords do not match after blur', async () => {
    const mockData: AccountDetailsData = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password456',
    };

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const confirmPasswordInput = screen.getAllByLabelText(/password/i)[1];
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  /**
   * Unit Test: Error display when password is too short
   * Validates: Requirements 2.4
   */
  it('should display error when password is less than 8 characters after blur', async () => {
    const mockData: AccountDetailsData = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'short',
      passwordConfirmation: 'short',
    };

    render(
      <AccountDetailsStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      // Look for the error message specifically (red text)
      const errorMessages = screen.getAllByText(/password must be at least 8 characters/i);
      // Should have both the error message and the hint text
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
      // Check that at least one has the error styling
      const hasError = errorMessages.some(el => el.className.includes('text-red-500'));
      expect(hasError).toBe(true);
    });
  });
});
