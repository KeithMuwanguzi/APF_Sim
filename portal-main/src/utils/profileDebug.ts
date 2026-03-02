/**
 * Debug utilities for profile operations
 */

import { UserProfile } from '../services/profileApi';

export const logProfileState = (label: string, profile: UserProfile | null) => {
  if (!profile) {
    console.log(`[Profile Debug] ${label}: Profile is null`);
    return;
  }

  console.log(`[Profile Debug] ${label}:`, {
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone_number: profile.phone_number,
    profile_picture_url: profile.profile_picture_url,
    has_all_required_fields: !!(profile.first_name && profile.last_name && profile.email),
  });
};

export const validateProfileForUpdate = (profile: UserProfile | null): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!profile) {
    errors.push('Profile is null');
    return { valid: false, errors };
  }

  if (!profile.email) {
    errors.push('Email is missing');
  }

  // Check if profile has the basic structure
  if (typeof profile !== 'object') {
    errors.push('Profile is not an object');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const clearProfileCache = () => {
  localStorage.removeItem('user_profile');
  console.log('[Profile Debug] Profile cache cleared');
};
