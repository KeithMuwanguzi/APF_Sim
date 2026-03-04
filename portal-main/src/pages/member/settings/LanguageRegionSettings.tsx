import { useState, useEffect } from 'react'
import { Globe, Save } from 'lucide-react'
import { useToast } from '../../../hooks/useToast'
import { getLanguageRegionPreferences, saveLanguageRegionPreferences } from './settingsStorage'
import { LanguageRegionPreferences } from './types'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'pt', label: 'Portuguese (Português)' },
  { value: 'ru', label: 'Russian (Русский)' },
  { value: 'ja', label: 'Japanese (日本語)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
]

const TIMEZONES = [
  { value: 'Africa/Kampala', label: 'East Africa Time (EAT)' },
  { value: 'Africa/Nairobi', label: 'East Africa Time (Nairobi)' },
  { value: 'UTC', label: 'UTC' },
]

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
]

const CURRENCIES = [
  { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
]

export function LanguageRegionSettings() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<LanguageRegionPreferences>(getLanguageRegionPreferences())
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: keyof LanguageRegionPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Save to localStorage (frontend-only for now)
    saveLanguageRegionPreferences(preferences)
    
    // TODO: API Integration - When backend endpoint is available:
    // try {
    //   const response = await fetch('/api/v1/user/preferences/', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${getAccessToken()}`
    //     },
    //     body: JSON.stringify({
    //       language: preferences.language,
    //       timezone: preferences.timezone,
    //       date_format: preferences.dateFormat,
    //       currency: preferences.currency
    //     })
    //   })
    //   if (!response.ok) throw new Error('Failed to save preferences')
    // } catch (error) {
    //   toast({ title: 'Error', description: 'Failed to save preferences' })
    //   setIsSaving(false)
    //   return
    // }
    
    toast({
      title: 'Preferences saved',
      description: 'Your language and region preferences have been updated.',
    })
    
    setIsSaving(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Globe className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {DATE_FORMATS.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Currency Display
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {CURRENCIES.map(curr => (
              <option key={curr.value} value={curr.value}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
