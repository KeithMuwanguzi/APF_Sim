import React, { useEffect, useState } from 'react';
import { ValidationRule } from '../../types/registration';

interface StepValidatorProps {
  stepData: Record<string, any>;
  validationRules: ValidationRule[];
  onValidationChange: (isValid: boolean, errors: Record<string, string>) => void;
  children?: React.ReactNode;
}

/**
 * StepValidator component validates form step data and reports validation state
 * 
 * @param stepData - The data for the current step
 * @param validationRules - Array of validation rules to apply
 * @param onValidationChange - Callback when validation state changes
 * @param children - Optional child components to render
 */
function StepValidator({
  stepData,
  validationRules,
  onValidationChange,
  children,
}: StepValidatorProps) {
  const [, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Execute validation rules for each field
    const newErrors: Record<string, string> = {};

    validationRules.forEach((rule) => {
      const fieldValue = stepData[rule.field];

      // Execute all validators for this field
      for (const validator of rule.validators) {
        const isValid = validator(fieldValue);
        
        if (!isValid) {
          newErrors[rule.field] = rule.errorMessage;
          break; // Stop at first validation failure for this field
        }
      }
    });

    setErrors(newErrors);

    // Determine if step is valid
    const isValid = Object.keys(newErrors).length === 0;

    // Notify parent of validation state change
    onValidationChange(isValid, newErrors);
  }, [stepData, validationRules, onValidationChange]);

  // This component doesn't render anything itself
  // It's a logic-only component that manages validation state
  return <>{children}</>;
}

export default StepValidator;
