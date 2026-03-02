import { useState } from "react";
import Stepper from "./steps/Stepper";
import AccountStep from "./steps/AccountStep";
import PersonalStep from "./steps/PersonalStep";
import DocumentsStep from "./steps/DocumentStep";
import PaymentSteps from "./steps/PaymentSteps";
import SuccessModal from "./SuccessModal";
import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import { submitApplication } from "../../services/applicationApi";
import { AccountDetailsData, PersonalInfoData, DocumentData, PaymentData, ApplicationSubmissionData } from "../../types/registration";


// Constants
const STEPS = [
  "Account Details",
  "Personal Information",
  "Documents",
  "Payments",
];

function ApplyForm() {
  
  // Form state management
  const {
    currentStep,
    accountDetails,
    personalInfo,
    documents,
    payment,
    setCurrentStep,
    setAccountDetails,
    setPersonalInfo,
    setDocuments,
    setPayment,
    clearAllData,
  } = useRegistrationForm();

  // Validation states for each step
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isDocumentsValid, setIsDocumentsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isLastStep = currentStep === STEPS.length - 1;

  // Initialize data if null
  const accountData: AccountDetailsData = accountDetails || {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const personalData: PersonalInfoData = personalInfo || {
    firstName: '',
    lastName: '',
    ageRange: '',
    phoneNumber: '',
    address: '',
    nationalIdNumber: '',
    icpauCertificateNumber: '',
    organization: '',
  };

  const documentsData: DocumentData[] = documents || [];

  const paymentData: PaymentData | null = payment || null;

  // Determine if Next button should be enabled
  const canProceed = () => {
    if (currentStep === 0) return isAccountValid;
    if (currentStep === 1) return isPersonalInfoValid;
    if (currentStep === 2) return isDocumentsValid;
    if (currentStep === 3) return isPaymentValid;
    return true; // For other steps, allow navigation for now
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('[Applyform] handleSubmit called');
    console.log('[Applyform] accountData:', accountData);
    console.log('[Applyform] personalData:', personalData);
    console.log('[Applyform] documentsData:', documentsData);
    console.log('[Applyform] paymentData:', paymentData);
    
    // Validate all required data is present
    if (!accountData || !personalData || documentsData.length === 0 || !paymentData) {
      console.log('[Applyform] Validation failed: missing data');
      setSubmissionError('Please complete all required fields');
      return;
    }

    // Validate payment is successful - check both status and isValidated flag
    if ((paymentData.status !== 'success' && paymentData.status !== 'completed') || !paymentData.isValidated) {
      console.log('[Applyform] Validation failed: payment not completed', {
        status: paymentData.status,
        isValidated: paymentData.isValidated
      });
      setSubmissionError('Please complete payment before submitting');
      return;
    }

    console.log('[Applyform] Starting submission...');
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Transform data to ApplicationSubmissionData format
      const submissionData: ApplicationSubmissionData = {
        // Account details
        username: accountData.username,
        email: accountData.email,
        password: accountData.password,
        
        // Personal information
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        age_range: personalData.ageRange,
        phoneNumber: personalData.phoneNumber,
        address: personalData.address,
        nationalIdNumber: personalData.nationalIdNumber,
        icpauCertificateNumber: personalData.icpauCertificateNumber,
        organization: personalData.organization,
        
        // Payment information
        paymentMethod: paymentData.method,
        paymentPhone: paymentData.phoneNumber,
        paymentCardNumber: paymentData.cardNumber,
        paymentCardExpiry: paymentData.expiryDate,
        paymentCardCvv: paymentData.cvv,
        paymentCardholderName: paymentData.cardholderName,
        paymentStatus: paymentData.status,
        paymentTransactionReference: paymentData.transactionReference,
        paymentErrorMessage: paymentData.errorMessage,
        paymentAmount: 50000, // Standard application fee
        
        // Documents with IDs
        documents: documentsData.filter((doc) => doc.file instanceof File),
      };

      // Submit application
      const result = await submitApplication(submissionData);

      if (result.success) {
        // Clear session storage on successful submission (Requirement 14.3)
        clearAllData();

        // Show success modal (Requirement 9.3)
        setShowSuccessModal(true);
      } else {
        // Display error message on submission failure (Requirement 9.5)
        setSubmissionError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      // Display error message on submission failure (Requirement 9.5)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Next/Submit button click
  const handleNextOrSubmit = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Back button click
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Optionally redirect to home page or login
    window.location.href = '/';
  };

  return (
    <section className="bg-gray-100 py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Apply for APF Membership
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below to submit your membership application for review.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="w-full mb-6">
          {/* Mobile: simple indicator */}
          <div className="sm:hidden text-center">
            <p className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {STEPS[currentStep]}
            </p>
          </div>

          {/* Desktop: full stepper */}
          <div className="hidden sm:block">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* FORM CARD */}
        <div className="w-full max-w-4xl bg-white border border-purple-300 rounded-lg p-4 sm:p-6 md:p-8">
          {currentStep === 0 && (
            <AccountStep
              data={accountData}
              onChange={setAccountDetails}
              onValidationChange={setIsAccountValid}
            />
          )}
          {currentStep === 1 && (
            <PersonalStep
              data={personalData}
              onChange={setPersonalInfo}
              onValidationChange={setIsPersonalInfoValid}
            />
          )}
          {currentStep === 2 && (
            <DocumentsStep
              documents={documentsData}
              onChange={setDocuments}
              onValidationChange={setIsDocumentsValid}
            />
          )}
          {currentStep === 3 && (
            <PaymentSteps
              data={paymentData}
              onChange={setPayment}
              onValidationChange={setIsPaymentValid}
              onPaymentComplete={handleSubmit}
            />
          )}

          {/* ACTIONS */}
          <div className="flex justify-between mt-10 gap-4">
            <button
              disabled={currentStep === 0}
              onClick={handleBack}
              className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-sm font-medium min-h-[44px] min-w-[44px]
                ${
                  currentStep === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Back
            </button>

            <button
              type="button"
              disabled={!canProceed() || isSubmitting}
              onClick={handleNextOrSubmit}
              className={`px-6 sm:px-8 py-3 sm:py-2 rounded-lg text-white text-sm font-medium transition min-h-[44px] min-w-[44px]
                ${canProceed() && !isSubmitting
                  ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Submitting..." : isLastStep ? "Submit" : "Next"}
            </button>
          </div>

          {/* Error message display */}
          {submissionError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submissionError}</p>
            </div>
          )}
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          message="Your application has been submitted successfully! Please await a confirmation email from the admin."
        />
      </div>
    </section>
  );
}

export default ApplyForm;
