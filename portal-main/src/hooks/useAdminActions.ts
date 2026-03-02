/**
 * Admin Actions Hook
 * 
 * Provides a clean interface for admin operations on applications.
 * Follows SOLID principles:
 * - Single Responsibility: Handles only admin action logic
 * - Separation of Concerns: Separates API calls from UI logic
 * 
 * @returns Object with admin action functions and loading/error states
 */

import { useState, useCallback } from 'react';
import {
  approveApplication,
  rejectApplication,
  retryApplication,
  AdminActionResult,
} from '../services/applicationApi';

interface UseAdminActionsReturn {
  approve: (applicationId: number) => Promise<AdminActionResult>;
  reject: (applicationId: number) => Promise<AdminActionResult>;
  retry: (applicationId: number) => Promise<AdminActionResult>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAdminActions = (): UseAdminActionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const approve = useCallback(async (applicationId: number): Promise<AdminActionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await approveApplication(applicationId);
      
      if (!result.success) {
        setError(result.error || 'Failed to approve application');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reject = useCallback(async (applicationId: number): Promise<AdminActionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await rejectApplication(applicationId);
      
      if (!result.success) {
        setError(result.error || 'Failed to reject application');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(async (applicationId: number): Promise<AdminActionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await retryApplication(applicationId);
      
      if (!result.success) {
        setError(result.error || 'Failed to reset application');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    approve,
    reject,
    retry,
    isLoading,
    error,
    clearError,
  };
};
