/**
 * Custom hook for profile management
 * Follows React best practices and provides a clean API for profile operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  ProfileUpdateData,
  PrivacySettings,
  NotificationPreferences,
  ProfileCompletionStatus,
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
  updatePrivacySettings,
  updateNotificationPreferences,
  getProfileCompletionStatus,
  changePassword,
  validateProfilePicture,
  generateInitials
} from '../services/profileApi';

interface UseProfileReturn {
  // Profile data
  profile: UserProfile | null;
  completionStatus: ProfileCompletionStatus | null;
  
  // Loading states
  loading: boolean;
  updating: boolean;
  uploadingPicture: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  refetchProfile: () => Promise<void>; // Alias for loadProfile
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  uploadPicture: (file: File) => Promise<boolean>;
  removePicture: () => Promise<boolean>;
  deletePicture: () => Promise<boolean>; // Alias for removePicture
  updatePrivacy: (settings: PrivacySettings) => Promise<boolean>;
  updateNotifications: (preferences: NotificationPreferences) => Promise<boolean>;
  updatePassword: (data: { current_password: string; new_password: string; confirm_password: string }) => Promise<boolean>;
  loadCompletionStatus: () => Promise<void>;
  clearError: () => void;
  
  // Additional loading states
  changingPassword: boolean;
  
  // Computed values
  displayName: string;
  initials: string;
  profilePictureUrl: string | null;
  isProfileComplete: boolean;
  
  // Version tracking for re-renders
  profileVersion: number;
}

const PROFILE_STORAGE_KEY = 'user_profile';

const loadProfileFromStorage = (): UserProfile | null => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as UserProfile;
  } catch (error) {
    console.warn('Failed to parse stored profile data:', error);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
};

const saveProfileToStorage = (profile: UserProfile | null) => {
  if (!profile) {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return;
  }

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const useProfile = (): UseProfileReturn => {
  // State
  const [profile, setProfile] = useState<UserProfile | null>(loadProfileFromStorage);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(!profile);
  const [updating, setUpdating] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileVersion, setProfileVersion] = useState(0);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Profile] Fetching profile from API...');
      const profileData = await fetchUserProfile();
      console.log('[Profile] Received profile data:', {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        updated_at: profileData.updated_at,
        full_data: profileData
      });
      
      setProfile(profileData);
      saveProfileToStorage(profileData);
      setProfileVersion(prev => prev + 1); // Increment version to trigger re-renders
      
      console.log('[Profile] Profile updated in state and localStorage');
      console.log('[Profile] New profile version:', profileVersion + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, [profileVersion]);

  // Load completion status
  const loadCompletionStatus = useCallback(async () => {
    try {
      const status = await getProfileCompletionStatus();
      setCompletionStatus(status);
    } catch (err) {
      console.error('Error loading completion status:', err);
      // Don't set error for completion status as it's not critical
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      console.log('[Profile] Starting update with data:', data);
      
      setUpdating(true);
      setError(null);
      
      const updatedProfile = await updateUserProfile(data);
      console.log('[Profile] Update successful, received from API:', {
        email: updatedProfile.email,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        phone_number: updatedProfile.phone_number,
        updated_at: updatedProfile.updated_at,
        full_response: updatedProfile
      });
      
      // Use the data from the API response
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      setProfileVersion(prev => prev + 1); // Increment version to trigger re-renders
      
      console.log('[Profile] Profile state updated with fresh data from API');
      console.log('[Profile] New profile state:', updatedProfile);
      
      // Auto-refresh after successful update to ensure consistency
      console.log('[Profile] Auto-refreshing after update...');
      await loadProfile();
      
      // Reload completion status after update
      await loadCompletionStatus();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      console.error('[Profile] Update failed:', err);
      setError(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [loadCompletionStatus, loadProfile]);

  // Upload profile picture
  const uploadPicture = useCallback(async (file: File): Promise<boolean> => {
    try {
      // Validate file first
      const validationError = validateProfilePicture(file);
      if (validationError) {
        setError(validationError);
        return false;
      }

      setUploadingPicture(true);
      setError(null);
      
      await uploadProfilePicture(file);
      
      // Refetch the full profile to ensure consistency
      await loadProfile();
      
      // Reload completion status
      await loadCompletionStatus();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload picture';
      setError(errorMessage);
      console.error('Error uploading picture:', err);
      return false;
    } finally {
      setUploadingPicture(false);
    }
  }, [loadProfile, loadCompletionStatus]);

  // Remove profile picture
  const removePicture = useCallback(async (): Promise<boolean> => {
    try {
      setUploadingPicture(true);
      setError(null);
      
      await removeProfilePicture();
      
      // Refetch the full profile to ensure consistency
      await loadProfile();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove picture';
      setError(errorMessage);
      console.error('Error removing picture:', err);
      return false;
    } finally {
      setUploadingPicture(false);
    }
  }, [loadProfile]);

  // Update privacy settings
  const updatePrivacy = useCallback(async (settings: PrivacySettings): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      
      await updatePrivacySettings(settings);
      
      // Update local profile state
      if (profile) {
        const nextProfile = {
          ...profile,
          ...settings
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update privacy settings';
      setError(errorMessage);
      console.error('Error updating privacy settings:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [profile]);

  // Update notification preferences
  const updateNotifications = useCallback(async (preferences: NotificationPreferences): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      
      await updateNotificationPreferences(preferences);
      
      // Update local profile state
      if (profile) {
        const nextProfile = {
          ...profile,
          ...preferences
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification preferences';
      setError(errorMessage);
      console.error('Error updating notification preferences:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [profile]);

  // Update password
  const updatePassword = useCallback(async (_data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<boolean> => {
    try {
      setChangingPassword(true);
      setError(null);
      
      await changePassword({
        current_password: _data.current_password,
        new_password: _data.new_password,
        confirm_password: _data.confirm_password,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      console.error('Error changing password:', err);
      return false;
    } finally {
      setChangingPassword(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load profile on mount ONLY
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  // Load completion status when profile is loaded
  useEffect(() => {
    if (profile) {
      loadCompletionStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.email]); // Only re-run if the user changes

  // Computed values
  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User';
  const initials = profile?.initials || generateInitials(
    profile?.first_name || '',
    profile?.last_name || '',
    profile?.email
  );
  const profilePictureUrl = profile?.profile_picture_url || null;
  const isProfileComplete = profile?.is_profile_complete || false;

  return {
    // Profile data
    profile,
    completionStatus,
    
    // Loading states
    loading,
    updating,
    uploadingPicture,
    changingPassword,
    
    // Error states
    error,
    
    // Actions
    loadProfile,
    refetchProfile: loadProfile, // Alias
    updateProfile,
    uploadPicture,
    removePicture,
    deletePicture: removePicture, // Alias
    updatePrivacy,
    updateNotifications,
    updatePassword,
    loadCompletionStatus,
    clearError,
    
    // Computed values
    displayName,
    initials,
    profilePictureUrl,
    isProfileComplete,
    
    // Version tracking
    profileVersion,
  };
};
