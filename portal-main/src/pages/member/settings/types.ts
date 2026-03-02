/**
 * Settings Types
 * TypeScript interfaces for settings components
 */

/**
 * Language & Region Preferences
 * Used by LanguageRegionSettings component
 */
export interface LanguageRegionPreferences {
  language: string
  timezone: string
  dateFormat: string
  currency: string
}

/**
 * Privacy Settings
 * Used by PrivacySecuritySettings component
 */
export interface PrivacySettings {
  profileVisibility: boolean
  twoFactorEnabled: boolean
}
