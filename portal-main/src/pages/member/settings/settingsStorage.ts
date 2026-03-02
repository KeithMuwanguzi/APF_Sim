/**
 * Settings Storage Helper
 * Manages frontend-only settings persistence
 */

import { LanguageRegionPreferences, PrivacySettings } from './types'

const STORAGE_KEYS = {
  LANGUAGE_REGION: 'user_language_region',
  PRIVACY: 'user_privacy_settings',
}

// Language & Region Preferences
export const getLanguageRegionPreferences = (): LanguageRegionPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE_REGION)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultLanguageRegionPreferences()
    }
  }
  return getDefaultLanguageRegionPreferences()
}

export const saveLanguageRegionPreferences = (prefs: LanguageRegionPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE_REGION, JSON.stringify(prefs))
}

const getDefaultLanguageRegionPreferences = (): LanguageRegionPreferences => ({
  language: 'en',
  timezone: 'Africa/Kampala',
  dateFormat: 'DD/MM/YYYY',
  currency: 'UGX',
})

// Privacy Settings
export const getPrivacySettings = (): PrivacySettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultPrivacySettings()
    }
  }
  return getDefaultPrivacySettings()
}

export const savePrivacySettings = (settings: PrivacySettings): void => {
  localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(settings))
}

const getDefaultPrivacySettings = (): PrivacySettings => ({
  profileVisibility: true,
  twoFactorEnabled: false,
})

