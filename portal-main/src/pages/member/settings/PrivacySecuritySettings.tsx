import { useState } from 'react'
import { Lock, Save } from 'lucide-react'
import { useToast } from '../../../hooks/useToast'
import { getPrivacySettings, savePrivacySettings } from './settingsStorage'
import { PrivacySettings } from './types'

export function PrivacySecuritySettings() {
  const { toast } = useToast()
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(getPrivacySettings())
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Save to localStorage (frontend-only for now)
    savePrivacySettings(privacySettings)
    
    // TODO: API Integration - When backend endpoint is available:
    // try {
    //   const response = await fetch('/api/v1/user/privacy-settings/', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${getAccessToken()}`
    //     },
    //     body: JSON.stringify(privacySettings)
    //   })
    //   if (!response.ok) throw new Error('Failed to save privacy settings')
    // } catch (error) {
    //   toast({ title: 'Error', description: 'Failed to save privacy settings' })
    //   setIsSaving(false)
    //   return
    // }
    
    toast({
      title: 'Privacy settings saved',
      description: 'Your privacy preferences have been updated.',
    })
    
    setIsSaving(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Lock className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Allow other members to view your profile
            </p>
          </div>
          <button
            onClick={() => handleToggle('profileVisibility')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              privacySettings.profileVisibility ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.profileVisibility ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2.5 opacity-60">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            disabled
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed"
          >
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 mt-4">
          <button
            onClick={handleSavePrivacy}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> For password changes and security settings, please visit your{' '}
            <a href="/profile" className="underline hover:text-blue-900">Profile page</a> and go to the Security tab.
          </p>
        </div>
      </div>
    </div>
  )
}
