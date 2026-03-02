/**
 * Property-based and unit tests for StepValidator component
 * Feature: membership-registration-payment
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import StepValidator from '../components/common/StepValidator';
import { ValidationRule } from '../types/registration';

describe('Feature: membership-registration-payment - StepValidator', () => {
  /**
   * Property 1: Incomplete Fields Disable Navigation
   * Validates: Requirements 1.2, 3.4
   * 
   * For any registration step and any combination of incomplete required fields,
   * the Next button should remain disabled until all required fields are complete and valid.
   */
  it('Property 1: Incomplete Fields Disable Navigation', () => {
    fc.assert(
      fc.property(
        // Generate step data with at least one empty/invalid field
        fc.record({
          field1: fc.oneof(fc.constant(''), fc.constant(null), fc.constant(undefined)),
          field2: fc.string(),
          field3: fc.string(),
        }),
        (incompleteStepData) => {
          const validationRules: ValidationRule[] = [
            {
              field: 'field1',
              validators: [(value) => value !== '' && value !== null && value !== undefined],
              errorMessage: 'Field 1 is required',
            },
            {
              field: 'field2',
              validators: [(value) => value !== '' && value !== null && value !== undefined],
              errorMessage: 'Field 2 is required',
            },
            {
              field: 'field3',
              validators: [(value) => value !== '' && value !== null && value !== undefined],
              errorMessage: 'Field 3 is required',
            },
          ];

          const onValidationChangeMock = vi.fn();

          render(
            <StepValidator
              stepData={incompleteStepData}
              validationRules={validationRules}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Validation should have been called
          expect(onValidationChangeMock).toHaveBeenCalled();
          
          // Get the last call
          const calls = onValidationChangeMock.mock.calls;
          const lastCall = calls[calls.length - 1];
          
          // Should be invalid (false) because field1 is empty
          expect(lastCall[0]).toBe(false);
          
          // Should have errors
          const errors = lastCall[1];
          expect(Object.keys(errors).length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Complete Valid Fields Enable Navigation
   * Validates: Requirements 1.3, 3.5
   * 
   * For any registration step with all required fields complete and valid,
   * the Next button should be enabled.
   */
  it('Property 2: Complete Valid Fields Enable Navigation', () => {
    fc.assert(
      fc.property(
        // Generate step data with all fields filled
        fc.record({
          field1: fc.string({ minLength: 1 }),
          field2: fc.string({ minLength: 1 }),
          field3: fc.string({ minLength: 1 }),
        }),
        (completeStepData) => {
          const validationRules: ValidationRule[] = [
            {
              field: 'field1',
              validators: [(value) => value && value.length > 0],
              errorMessage: 'Field 1 is required',
            },
            {
              field: 'field2',
              validators: [(value) => value && value.length > 0],
              errorMessage: 'Field 2 is required',
            },
            {
              field: 'field3',
              validators: [(value) => value && value.length > 0],
              errorMessage: 'Field 3 is required',
            },
          ];

          const onValidationChangeMock = vi.fn();

          render(
            <StepValidator
              stepData={completeStepData}
              validationRules={validationRules}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Validation should have been called
          expect(onValidationChangeMock).toHaveBeenCalled();
          
          // Get the last call
          const calls = onValidationChangeMock.mock.calls;
          const lastCall = calls[calls.length - 1];
          
          // Should be valid (true) because all fields are filled
          expect(lastCall[0]).toBe(true);
          
          // Should have no errors
          const errors = lastCall[1];
          expect(Object.keys(errors).length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 30: Validation Error Display
   * Validates: Requirements 13.1
   * 
   * For any validation error that occurs, the error message should be
   * displayed adjacent to the relevant form field.
   */
  it('Property 30: Validation Error Display', () => {
    fc.assert(
      fc.property(
        // Generate invalid field data
        fc.record({
          fieldName: fc.constantFrom('email', 'username', 'password'),
          fieldValue: fc.oneof(fc.constant(''), fc.constant(null), fc.constant(undefined)),
          errorMessage: fc.string({ minLength: 5, maxLength: 50 }),
        }),
        ({ fieldName, fieldValue, errorMessage }) => {
          const stepData = {
            [fieldName]: fieldValue,
          };

          const validationRules: ValidationRule[] = [
            {
              field: fieldName,
              validators: [(value) => value !== '' && value !== null && value !== undefined],
              errorMessage: errorMessage,
            },
          ];

          const onValidationChangeMock = vi.fn();

          render(
            <StepValidator
              stepData={stepData}
              validationRules={validationRules}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Validation should have been called
          expect(onValidationChangeMock).toHaveBeenCalled();
          
          // Get the last call
          const calls = onValidationChangeMock.mock.calls;
          const lastCall = calls[calls.length - 1];
          
          // Should be invalid
          expect(lastCall[0]).toBe(false);
          
          // Should have error for the field
          const errors = lastCall[1];
          expect(errors[fieldName]).toBe(errorMessage);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 32: Error Clearing on Correction
   * Validates: Requirements 13.4
   * 
   * For any form field with a displayed error message, correcting the field
   * value to be valid should clear the error message.
   */
  it('Property 32: Error Clearing on Correction', () => {
    fc.assert(
      fc.property(
        // Generate field name and valid value
        fc.record({
          fieldName: fc.constantFrom('email', 'username', 'password'),
          validValue: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ fieldName, validValue }) => {
          const validationRules: ValidationRule[] = [
            {
              field: fieldName,
              validators: [(value) => value && value.length > 0],
              errorMessage: 'Field is required',
            },
          ];

          const onValidationChangeMock = vi.fn();

          // Start with invalid data
          const { rerender } = render(
            <StepValidator
              stepData={{ [fieldName]: '' }}
              validationRules={validationRules}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Should be invalid initially
          let calls = onValidationChangeMock.mock.calls;
          expect(calls[calls.length - 1][0]).toBe(false);
          expect(calls[calls.length - 1][1][fieldName]).toBeDefined();

          // Correct the field
          rerender(
            <StepValidator
              stepData={{ [fieldName]: validValue }}
              validationRules={validationRules}
              onValidationChange={onValidationChangeMock}
            />
          );

          // Should now be valid and error should be cleared
          calls = onValidationChangeMock.mock.calls;
          expect(calls[calls.length - 1][0]).toBe(true);
          expect(calls[calls.length - 1][1][fieldName]).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('StepValidator - Unit Tests', () => {
  /**
   * Unit Test: Validation with empty fields
   * Validates: Requirements 1.2
   */
  it('should report invalid state when fields are empty', () => {
    const stepData = {
      username: '',
      email: '',
    };

    const validationRules: ValidationRule[] = [
      {
        field: 'username',
        validators: [(value) => value && value.length > 0],
        errorMessage: 'Username is required',
      },
      {
        field: 'email',
        validators: [(value) => value && value.length > 0],
        errorMessage: 'Email is required',
      },
    ];

    const onValidationChangeMock = vi.fn();

    render(
      <StepValidator
        stepData={stepData}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    expect(onValidationChangeMock).toHaveBeenCalled();
    const calls = onValidationChangeMock.mock.calls;
    const lastCall = calls[calls.length - 1];
    
    expect(lastCall[0]).toBe(false);
    expect(lastCall[1]).toHaveProperty('username');
    expect(lastCall[1]).toHaveProperty('email');
  });

  /**
   * Unit Test: Validation with valid fields
   * Validates: Requirements 1.3
   */
  it('should report valid state when all fields are valid', () => {
    const stepData = {
      username: 'johndoe',
      email: 'john@example.com',
    };

    const validationRules: ValidationRule[] = [
      {
        field: 'username',
        validators: [(value) => value && value.length > 0],
        errorMessage: 'Username is required',
      },
      {
        field: 'email',
        validators: [(value) => value && value.includes('@')],
        errorMessage: 'Email must be valid',
      },
    ];

    const onValidationChangeMock = vi.fn();

    render(
      <StepValidator
        stepData={stepData}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    expect(onValidationChangeMock).toHaveBeenCalled();
    const calls = onValidationChangeMock.mock.calls;
    const lastCall = calls[calls.length - 1];
    
    expect(lastCall[0]).toBe(true);
    expect(Object.keys(lastCall[1]).length).toBe(0);
  });

  /**
   * Unit Test: Multiple validators per field
   * Validates: Requirements 13.1
   */
  it('should execute multiple validators for a single field', () => {
    const stepData = {
      password: 'short',
    };

    const validationRules: ValidationRule[] = [
      {
        field: 'password',
        validators: [
          (value) => value && value.length >= 8,
          (value) => /[A-Z]/.test(value),
        ],
        errorMessage: 'Password must be at least 8 characters and contain uppercase',
      },
    ];

    const onValidationChangeMock = vi.fn();

    render(
      <StepValidator
        stepData={stepData}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    expect(onValidationChangeMock).toHaveBeenCalled();
    const calls = onValidationChangeMock.mock.calls;
    const lastCall = calls[calls.length - 1];
    
    expect(lastCall[0]).toBe(false);
    expect(lastCall[1]).toHaveProperty('password');
  });

  /**
   * Unit Test: Validation updates when data changes
   * Validates: Requirements 13.4
   */
  it('should update validation when step data changes', () => {
    const validationRules: ValidationRule[] = [
      {
        field: 'username',
        validators: [(value) => value && value.length > 0],
        errorMessage: 'Username is required',
      },
    ];

    const onValidationChangeMock = vi.fn();

    const { rerender } = render(
      <StepValidator
        stepData={{ username: '' }}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    // First render should be invalid
    expect(onValidationChangeMock).toHaveBeenCalled();
    let calls = onValidationChangeMock.mock.calls;
    expect(calls[calls.length - 1][0]).toBe(false);

    // Update with valid data
    rerender(
      <StepValidator
        stepData={{ username: 'johndoe' }}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    // Should now be valid
    calls = onValidationChangeMock.mock.calls;
    expect(calls[calls.length - 1][0]).toBe(true);
  });

  /**
   * Unit Test: Error messages are provided
   * Validates: Requirements 13.1
   */
  it('should provide error messages for invalid fields', () => {
    const stepData = {
      email: 'invalid-email',
    };

    const validationRules: ValidationRule[] = [
      {
        field: 'email',
        validators: [(value) => value && value.includes('@')],
        errorMessage: 'Email must contain @',
      },
    ];

    const onValidationChangeMock = vi.fn();

    render(
      <StepValidator
        stepData={stepData}
        validationRules={validationRules}
        onValidationChange={onValidationChangeMock}
      />
    );

    const calls = onValidationChangeMock.mock.calls;
    const lastCall = calls[calls.length - 1];
    
    expect(lastCall[0]).toBe(false);
    expect(lastCall[1].email).toBe('Email must contain @');
  });

  /**
   * Unit Test: Renders children
   */
  it('should render children components', () => {
    const stepData = { field: 'value' };
    const validationRules: ValidationRule[] = [];

    const { getByText } = render(
      <StepValidator
        stepData={stepData}
        validationRules={validationRules}
        onValidationChange={vi.fn()}
      >
        <div>Child Component</div>
      </StepValidator>
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });
});
