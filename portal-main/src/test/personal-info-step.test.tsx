/**
 * Unit tests for Personal Information Step component
 * Feature: membership-registration-payment
 * Requirements: 3.1, 3.2, 3.3
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalStep from '../components/register-components/steps/PersonalStep';
import { PersonalInfoData } from '../types/registration';

describe('Personal Information Step - Unit Tests', () => {
  /**
   * Unit Test: All required fields are present
   * Validates: Requirements 3.1
   */
  it('should render all required fields', () => {
    const mockData: PersonalInfoData = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      nationalIdNumber: '',
      icpauCertificateNumber: '',
      organization: '',
    };

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    // Check all required fields are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/national id number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/icpau practising certificate number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization.*firm.*optional/i)).toBeInTheDocument();
  });

  /**
   * Unit Test: Phone number validation with invalid format
   * Validates: Requirements 3.2
   */
  it('should display error when phone number is invalid after blur', async () => {
    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '123456789', // Invalid format
      address: '123 Main St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '',
    };

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      // Check for red error text specifically
      const errorElements = screen.getAllByText(/phone number must be in format 256XXXXXXXXX/i);
      const hasRedError = errorElements.some(el => el.className.includes('text-red-500'));
      expect(hasRedError).toBe(true);
    });
  });

  /**
   * Unit Test: Phone number validation with valid format
   * Validates: Requirements 3.2
   */
  it('should not display error when phone number is valid', async () => {
    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567', // Valid format
      address: '123 Main St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '',
    };

    const onValidationChangeMock = vi.fn();

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={onValidationChangeMock}
      />
    );

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      // Should not have phone number error (check for red error text, not hint text)
      const errorElements = screen.queryAllByText(/phone number must be in format 256XXXXXXXXX/i);
      const hasRedError = errorElements.some(el => el.className.includes('text-red-500'));
      expect(hasRedError).toBe(false);
    });
  });

  /**
   * Unit Test: Age validation with underage user
   * Validates: Requirements 3.3
   */
  it('should display error when user is under 18 years old after blur', async () => {
    // Calculate a date that makes user 17 years old
    const today = new Date();
    const underageDate = new Date(
      today.getFullYear() - 17,
      today.getMonth(),
      today.getDate()
    );
    const underageDateString = underageDate.toISOString().split('T')[0];

    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: underageDateString,
      phoneNumber: '256701234567',
      address: '123 Main St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '',
    };

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const dobInput = screen.getByLabelText(/date of birth/i);
    fireEvent.blur(dobInput);

    await waitFor(() => {
      // Check for red error text specifically
      const errorElements = screen.getAllByText(/you must be at least 18 years old/i);
      const hasRedError = errorElements.some(el => el.className.includes('text-red-500'));
      expect(hasRedError).toBe(true);
    });
  });

  /**
   * Unit Test: Age validation with valid age
   * Validates: Requirements 3.3
   */
  it('should not display error when user is 18 years or older', async () => {
    // Calculate a date that makes user exactly 18 years old
    const today = new Date();
    const validDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const validDateString = validDate.toISOString().split('T')[0];

    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: validDateString,
      phoneNumber: '256701234567',
      address: '123 Main St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '',
    };

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const dobInput = screen.getByLabelText(/date of birth/i);
    fireEvent.blur(dobInput);

    await waitFor(() => {
      // Should not have age error (check for red error text, not hint text)
      const errorElements = screen.queryAllByText(/you must be at least 18 years old/i);
      const hasRedError = errorElements.some(el => el.className.includes('text-red-500'));
      expect(hasRedError).toBe(false);
    });
  });

  /**
   * Unit Test: Validation with empty fields
   * Validates: Requirements 3.1
   */
  it('should call onValidationChange with false when required fields are empty', async () => {
    const mockData: PersonalInfoData = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      nationalIdNumber: '',
      icpauCertificateNumber: '',
      organization: '',
    };

    const onValidationChangeMock = vi.fn();

    render(
      <PersonalStep
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
   * Validates: Requirements 3.1, 3.2, 3.3
   */
  it('should call onValidationChange with true when all required fields are valid', async () => {
    const today = new Date();
    const validDate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate()
    );
    const validDateString = validDate.toISOString().split('T')[0];

    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: validDateString,
      phoneNumber: '256701234567',
      address: '123 Main St, Kampala',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: 'ABC Accounting Firm',
    };

    const onValidationChangeMock = vi.fn();

    render(
      <PersonalStep
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
   * Validates: Requirements 3.1
   */
  it('should call onChange when field values change', () => {
    const mockData: PersonalInfoData = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      nationalIdNumber: '',
      icpauCertificateNumber: '',
      organization: '',
    };

    const onChangeMock = vi.fn();

    render(
      <PersonalStep
        data={mockData}
        onChange={onChangeMock}
        onValidationChange={vi.fn()}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    expect(onChangeMock).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      nationalIdNumber: '',
      icpauCertificateNumber: '',
      organization: '',
    });
  });

  /**
   * Unit Test: Organization field is optional
   * Validates: Requirements 3.1
   */
  it('should validate successfully when organization field is empty', async () => {
    const today = new Date();
    const validDate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate()
    );
    const validDateString = validDate.toISOString().split('T')[0];

    const mockData: PersonalInfoData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: validDateString,
      phoneNumber: '256701234567',
      address: '123 Main St, Kampala',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '', // Empty optional field
    };

    const onValidationChangeMock = vi.fn();

    render(
      <PersonalStep
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
   * Unit Test: Error display on blur with empty required field
   * Validates: Requirements 3.1
   */
  it('should display error when required field is empty after blur', async () => {
    const mockData: PersonalInfoData = {
      firstName: '',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '256701234567',
      address: '123 Main St',
      nationalIdNumber: 'CM12345678',
      icpauCertificateNumber: 'ICPAU/1234/22',
      organization: '',
    };

    render(
      <PersonalStep
        data={mockData}
        onChange={vi.fn()}
        onValidationChange={vi.fn()}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });
});
