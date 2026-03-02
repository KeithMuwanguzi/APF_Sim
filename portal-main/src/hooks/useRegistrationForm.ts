/**
 * Custom hook for managing registration form state with session storage persistence
 * Feature: membership-registration-payment
 * Requirements: 14.1, 14.2, 14.3, 1.4, 1.5
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  AccountDetailsData,
  PersonalInfoData,
  DocumentData,
  PaymentData,
} from '../types/registration';

// Session storage keys
const STORAGE_KEYS = {
  CURRENT_STEP: 'registration_current_step',
  ACCOUNT_DETAILS: 'registration_account_details',
  PERSONAL_INFO: 'registration_personal_info',
  DOCUMENTS: 'registration_documents',
  PAYMENT: 'registration_payment',
  LAST_UPDATED: 'registration_last_updated',
} as const;

interface UseRegistrationFormReturn {
  // State
  currentStep: number;
  accountDetails: AccountDetailsData | null;
  personalInfo: PersonalInfoData | null;
  documents: DocumentData[];
  payment: PaymentData | null;
  
  // Setters
  setCurrentStep: (step: number) => void;
  setAccountDetails: (data: AccountDetailsData | null) => void;
  setPersonalInfo: (data: PersonalInfoData | null) => void;
  setDocuments: (data: DocumentData[]) => void;
  setPayment: (data: PaymentData | null) => void;
  
  // Utilities
  clearAllData: () => void;
  restoreFromSession: () => void;
}

/**
 * Custom hook for managing registration form state with automatic session storage persistence
 * 
 * Features:
 * - Automatic save to session storage on field change (Requirement 14.1)
 * - Automatic restore from session storage on page load (Requirement 14.2)
 * - Clear session storage on successful submission (Requirement 14.3)
 * - Preserve data across step navigation (Requirements 1.4, 1.5)
 */
export function useRegistrationForm(): UseRegistrationFormReturn {
  // Initialize state
  const [currentStep, setCurrentStepState] = useState<number>(0);
  const [accountDetails, setAccountDetailsState] = useState<AccountDetailsData | null>(null);
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfoData | null>(null);
  const [documents, setDocumentsState] = useState<DocumentData[]>([]);
  const [payment, setPaymentState] = useState<PaymentData | null>(null);

  /**
   * Save data to session storage
   * Requirement 14.1: Store step data in browser session storage
   */
  const saveToSessionStorage = useCallback((key: string, value: any) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      sessionStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save to session storage:', error);
    }
  }, []);

  /**
   * Load data from session storage
   * Requirement 14.2: Restore previously entered data from session storage
   */
  const loadFromSessionStorage = useCallback(<T,>(key: string, defaultValue: T): T => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from session storage:', error);
      return defaultValue;
    }
  }, []);

  /**
   * Restore all form data from session storage on mount
   * Requirement 14.2: Restore all previously entered data from session storage
   */
  const restoreFromSession = useCallback(() => {
    const savedStep = loadFromSessionStorage(STORAGE_KEYS.CURRENT_STEP, 0);
    const savedAccountDetails = loadFromSessionStorage<AccountDetailsData | null>(
      STORAGE_KEYS.ACCOUNT_DETAILS,
      null
    );
    const savedPersonalInfo = loadFromSessionStorage<PersonalInfoData | null>(
      STORAGE_KEYS.PERSONAL_INFO,
      null
    );
    const savedDocuments = loadFromSessionStorage<DocumentData[]>(
      STORAGE_KEYS.DOCUMENTS,
      []
    );
    const savedPayment = loadFromSessionStorage<PaymentData | null>(
      STORAGE_KEYS.PAYMENT,
      null
    );

    setCurrentStepState(savedStep);
    setAccountDetailsState(savedAccountDetails);
    setPersonalInfoState(savedPersonalInfo);
    setDocumentsState(savedDocuments);
    setPaymentState(savedPayment);
  }, [loadFromSessionStorage]);

  /**
   * Clear all session storage data
   * Requirement 14.3: Clear all session storage data on successful submission
   */
  const clearAllData = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      sessionStorage.removeItem(STORAGE_KEYS.ACCOUNT_DETAILS);
      sessionStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
      sessionStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      sessionStorage.removeItem(STORAGE_KEYS.PAYMENT);
      sessionStorage.removeItem(STORAGE_KEYS.LAST_UPDATED);

      // Reset state
      setCurrentStepState(0);
      setAccountDetailsState(null);
      setPersonalInfoState(null);
      setDocumentsState([]);
      setPaymentState(null);
    } catch (error) {
      console.error('Failed to clear session storage:', error);
    }
  }, []);

  /**
   * Restore data from session storage on component mount
   */
  useEffect(() => {
    restoreFromSession();
  }, [restoreFromSession]);

  /**
   * Wrapped setter for currentStep with session storage persistence
   * Requirement 14.1: Store step data in browser session storage
   */
  const setCurrentStep = useCallback((step: number) => {
    setCurrentStepState(step);
    saveToSessionStorage(STORAGE_KEYS.CURRENT_STEP, step);
  }, [saveToSessionStorage]);

  /**
   * Wrapped setter for accountDetails with session storage persistence
   * Requirement 14.1: Store step data in browser session storage
   */
  const setAccountDetails = useCallback((data: AccountDetailsData | null) => {
    setAccountDetailsState(data);
    saveToSessionStorage(STORAGE_KEYS.ACCOUNT_DETAILS, data);
  }, [saveToSessionStorage]);

  /**
   * Wrapped setter for personalInfo with session storage persistence
   * Requirement 14.1: Store step data in browser session storage
   */
  const setPersonalInfo = useCallback((data: PersonalInfoData | null) => {
    setPersonalInfoState(data);
    saveToSessionStorage(STORAGE_KEYS.PERSONAL_INFO, data);
  }, [saveToSessionStorage]);

  /**
   * Wrapped setter for documents with session storage persistence
   * Requirement 14.1: Store step data in browser session storage
   * Note: File objects cannot be serialized, so we store metadata only
   */
  const setDocuments = useCallback((data: DocumentData[]) => {
    setDocumentsState(data);
    // Store only serializable metadata (exclude File objects)
    const serializableData = data.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      uploadStatus: doc.uploadStatus,
      errorMessage: doc.errorMessage,
    }));
    saveToSessionStorage(STORAGE_KEYS.DOCUMENTS, serializableData);
  }, [saveToSessionStorage]);

  /**
   * Wrapped setter for payment with session storage persistence
   * Requirement 14.1: Store step data in browser session storage
   */
  const setPayment = useCallback((data: PaymentData | null) => {
    setPaymentState(data);
    saveToSessionStorage(STORAGE_KEYS.PAYMENT, data);
  }, [saveToSessionStorage]);

  return {
    // State
    currentStep,
    accountDetails,
    personalInfo,
    documents,
    payment,
    
    // Setters
    setCurrentStep,
    setAccountDetails,
    setPersonalInfo,
    setDocuments,
    setPayment,
    
    // Utilities
    clearAllData,
    restoreFromSession,
  };
}
