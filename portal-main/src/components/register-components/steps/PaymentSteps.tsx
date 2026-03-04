import { useState, useEffect, useCallback } from "react";
import PaymentOption from "./PaymentOption";
import { PaymentForms } from "../PaymentForms";
import mtnLogo from "../../../assets/images/registerPage-images/mtn.png";
import airtelLogo from "../../../assets/images/registerPage-images/airtel.png";
import dfcuLogo from "../../../assets/images/registerPage-images/dfcu.jpg";
import { PaymentData, PaymentMethod } from "../../../types/registration";

interface PaymentStepsProps {
  data?: PaymentData | null;
  onChange?: (data: PaymentData) => void;
  onValidationChange?: (isValid: boolean) => void;
  onPaymentComplete?: () => void; // Callback when payment is successfully completed
}

function PaymentsStep({ data, onChange, onValidationChange, onPaymentComplete }: PaymentStepsProps) {
  const [consentEKYC, setConsentEKYC] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    data?.method || null
  );
  const [, setPaymentData] = useState<PaymentData | null>(data || null);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Restore consent state from data if available
  useEffect(() => {
    if (data) {
      setPaymentMethod(data.method);
      setPaymentData(data);
      setIsPaymentValid(data.isValidated);
    }
  }, [data]);

  // Update validation state based on consent and payment validation
  useEffect(() => {
    // Both consent checkboxes must be checked and payment must be valid
    const isValid = consentEKYC && agreeTerms && isPaymentValid;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [consentEKYC, agreeTerms, isPaymentValid, onValidationChange]);

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    const paymentMethodValue = method as PaymentMethod;
    setPaymentMethod(paymentMethodValue);
    
    // Clear previous payment data when method changes (Requirement 5.3)
    const newPaymentData: PaymentData = {
      method: paymentMethodValue,
      status: 'idle',
      isValidated: false,
    };
    setPaymentData(newPaymentData);
    setIsPaymentValid(false);
    
    if (onChange) {
      onChange(newPaymentData);
    }
  };

  // Handle payment data change from PaymentForms
  const handlePaymentDataChange = useCallback((data: PaymentData) => {
    setPaymentData(data);
    if (onChange) {
      onChange(data);
    }
  }, [onChange]);

  // Handle payment validation result from PaymentForms
  const handlePaymentValidated = useCallback((isValid: boolean) => {
    setIsPaymentValid(isValid);
    // Note: Payment data is already updated by handlePaymentDataChange
    // No need to update it again here to avoid overwriting the status
  }, []);

  return (
    <div className="space-y-6">
      {/* CONSENT & DECLARATION */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Consent & Declaration
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 accent-purple-600"
              checked={consentEKYC}
              onChange={(e) => setConsentEKYC(e.target.checked)}
            />
            <span>
              I consent to electronic identity verification (eKYC)
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 accent-purple-600"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                href="#"
                className="text-purple-600 hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-purple-600 hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      </div>

      {/* APPLICATION FEE - Only show if consent is given */}
      {consentEKYC && agreeTerms && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Application Fee
          </h3>

          <p className="text-xl font-semibold text-[#5F1C9F] mt-2">
            UGX 50,000
          </p>

          <p className="text-sm text-gray-600 mt-1">
            This is a one-time non-refundable application fee. Payment does not
            guarantee membership approval.
          </p>

          {/* PAYMENT OPTIONS */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Payment Options
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PaymentOption
                label="MTN Mobile Money"
                value="mtn"
                logo={mtnLogo}
                selected={paymentMethod}
                onSelect={handlePaymentMethodSelect}
              />

              <PaymentOption
                label="Airtel Money"
                value="airtel"
                logo={airtelLogo}
                selected={paymentMethod}
                onSelect={handlePaymentMethodSelect}
              />

              <div className="relative">
                <PaymentOption
                  label="Credit Card"
                  value="credit_card"
                  logo={dfcuLogo}
                  selected={paymentMethod}
                  onSelect={handlePaymentMethodSelect}
                  disabled={true}
                />
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center pointer-events-none">
                  <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT FORMS - Conditional based on selected method */}
          {paymentMethod && (
            <PaymentForms
              selectedMethod={paymentMethod}
              onPaymentDataChange={handlePaymentDataChange}
              onPaymentValidated={handlePaymentValidated}
              onPaymentComplete={onPaymentComplete}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentsStep;
