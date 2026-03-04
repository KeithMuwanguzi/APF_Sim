import { useState, useEffect } from 'react';
import Input from "../Input";
import { PersonalInfoData } from '../../../types/registration';
import {
  validatePhoneNumber,
  
} from '../../../lib/validators';

const AGE_RANGES = [
  '18 – 24',
  '25 – 34',
  '35 – 44',
  '45 – 54',
  '55 – 64',
  '65+',
];
interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onValidationChange: (isValid: boolean) => void;
}

function PersonalStep({ data, onChange, onValidationChange }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate all fields and update validation state
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Validate first name (required)
    if (!data.firstName || data.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name (required)
    if (!data.lastName || data.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    }

    // Validate date of birth (required and age validation)
    if (!data.ageRange || data.ageRange.trim() === '') {
      newErrors.ageRange = 'Age range is required';
    } 

    // Validate phone number (required and format validation)
    if (!data.phoneNumber || data.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const phoneResult = validatePhoneNumber(data.phoneNumber);
      if (!phoneResult.isValid) {
        newErrors.phoneNumber = phoneResult.errorMessage || 'Invalid phone number';
      }
    }

    // Validate address (required)
    if (!data.address || data.address.trim() === '') {
      newErrors.address = 'Address is required';
    }

    // Validate National ID Number (required, must start with CF or CM and be 13 characters - alphanumeric)
    if (!data.nationalIdNumber || data.nationalIdNumber.trim() === '') {
      newErrors.nationalIdNumber = 'National ID Number is required';
    } else {
      const nationalIdPattern = /^(CF|CM)[A-Z0-9]{11}$/i;
      if (!nationalIdPattern.test(data.nationalIdNumber.trim())) {
        newErrors.nationalIdNumber = 'National ID must start with CF or CM and be exactly 13 characters (letters and numbers, e.g., CF12345ABC67)';
      }
    }

    // Validate ICPAU Certificate Number (required)
    if (!data.icpauCertificateNumber || data.icpauCertificateNumber.trim() === '') {
      newErrors.icpauCertificateNumber = 'ICPAU Practising Certificate Number is required';
    }

    // Organization is optional, no validation needed

    setErrors(newErrors);

    // Notify parent of validation state
    const isValid = Object.keys(newErrors).length === 0 &&
                    data.firstName.trim() !== '' &&
                    data.lastName.trim() !== '' &&
                    data.ageRange.trim() !== '' &&
                    data.phoneNumber.trim() !== '' &&
                    data.address.trim() !== '' &&
                    data.nationalIdNumber.trim() !== '' &&
                    data.icpauCertificateNumber.trim() !== '';
    
    onValidationChange(isValid);
  }, [data, onValidationChange]);

  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleBlur = (field: keyof PersonalInfoData) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const getFieldError = (field: keyof PersonalInfoData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6">
        Personal & Professional Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          name="firstName"
          value={data.firstName}
          onChange={(e) => handleFieldChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          error={getFieldError('firstName')}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          name="lastName"
          value={data.lastName}
          onChange={(e) => handleFieldChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          error={getFieldError('lastName')}
          required
        />

       <div className=''>
       <label className="block text-sm font-medium text-gray-700 mb-1">
         Age Range <span className="text-red-500">*</span>
       </label>

        <select
        value={data.ageRange}
        onChange={(e) => handleFieldChange('ageRange', e.target.value)}
        onBlur={() => handleBlur('ageRange')}
        className=" w-full h-10 px-3 rounded-md border border-gray-300 text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ">
        <option value="">Select age range</option>
          {AGE_RANGES.map((range) => (
          <option key={range} value={range}>
             {range}
          </option>
        ))}
        </select>

       {getFieldError('ageRange') && (
          <p className="text-xs text-red-500 mt-1">
          {getFieldError('ageRange')}
         </p>
       )}
      </div>


        <Input
          label="Phone Number"
          type="text"
          placeholder="256XXXXXXXXX"
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
          onBlur={() => handleBlur('phoneNumber')}
          error={getFieldError('phoneNumber')}
          required
        />

        <Input
          label="Address"
          type="text"
          placeholder="123 Main St, Kampala"
          name="address"
          value={data.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          error={getFieldError('address')}
          required
        />

        <Input
          label="National ID Number (NIN)"
          type="text"
          placeholder="CF12345ABC67 or CM1234567890A"
          name="nationalIdNumber"
          value={data.nationalIdNumber}
          onChange={(e) => handleFieldChange('nationalIdNumber', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('nationalIdNumber')}
          error={getFieldError('nationalIdNumber')}
          required
        />

        <Input
          label="ICPAU Practising Certificate Number"
          type="text"
          placeholder="ICPAU/XXXX/XX"
          name="icpauCertificateNumber"
          value={data.icpauCertificateNumber}
          onChange={(e) => handleFieldChange('icpauCertificateNumber', e.target.value)}
          onBlur={() => handleBlur('icpauCertificateNumber')}
          error={getFieldError('icpauCertificateNumber')}
          required
        />

        <Input
          label="Organization / Firm (Optional)"
          type="text"
          placeholder="ABC Accounting Firm"
          name="organization"
          value={data.organization || ''}
          onChange={(e) => handleFieldChange('organization', e.target.value)}
          onBlur={() => handleBlur('organization')}
          error={getFieldError('organization')}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Phone number must be in format 256XXXXXXXXX.
      </p>
    </>
  );
}

export default PersonalStep;