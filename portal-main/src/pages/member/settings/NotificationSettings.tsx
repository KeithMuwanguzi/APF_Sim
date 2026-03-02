import { useState, useEffect } from 'react'
import { Bell, Save } from 'lucide-react'
import { useToast } from '../../../hooks/useToast'
import { useProfile } from '../../../hooks/useProfile'
import { getAccessToken } from '../../../utils/authStorage'
import { API_BASE_URL } from '../../../config/api'

interface NotificationPreferences {
  email_notifications: boolean
  sms_notifications: boolean
  newsletter_subscription: boolean
  event_notifications: boolean
}

export function NotificationSettings() {
  const { toast } = useToast()
  const { profile } = useProfile()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    sms_notifications: false,
    newsletter_subscription: true,
    event_notifications: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load preferences from profile
  useEffect(() => {
    if (profile) {
      setPreferences({
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? false,
        newsletter_subscription: profile.newsletter_subscription ?? true,
        event_notifications: profile.event_notifications ?? true,
      })
      setIsLoading(false)
    }
  }, [profile])

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const token = getAccessToken()
      const response = await fetch(`${API_BASE_URL}/profiles/notification-preferences/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      })

      if (!response.ok) {
        throw new Error('Failed to save notification preferences')
      }

      const data = await response.json()
      
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
      })
    } catch (error) {
      console.error('Error saving notification preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <Bell className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        <p className="text-sm text-gray-500">Loading preferences...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Bell className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      </div>

      <div className="space-y-3">
        <ToggleItem
          label="Email Notifications"
          description="Receive notifications via email"
          checked={preferences.email_notifications}
          onChange={() => handleToggle('email_notifications')}
        />

        <ToggleItem
          label="SMS Notifications"
          description="Receive notifications via SMS"
          checked={preferences.sms_notifications}
          onChange={() => handleToggle('sms_notifications')}
        />

        <ToggleItemDisabled
          label="Newsletter Subscription"
          description="Receive newsletters and updates"
          badge="Coming Soon"
        />

        <ToggleItem
          label="Event Notifications"
          description="Get notified about upcoming events"
          checked={preferences.event_notifications}
          onChange={() => handleToggle('event_notifications')}
        />

        <div className="pt-3 border-t border-gray-100 mt-4">
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
    </div>
  )
}

interface ToggleItemProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function ToggleItem({ label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          checked ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

interface ToggleItemDisabledProps {
  label: string
  description: string
  badge?: string
}

function ToggleItemDisabled({ label, description, badge }: ToggleItemDisabledProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 opacity-60">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {badge && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        disabled
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed"
      >
        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
      </button>
    </div>
  )
}
