import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Settings } from "lucide-react"
import { NotificationSettings } from "./settings/NotificationSettings"
import { LanguageRegionSettings } from "./settings/LanguageRegionSettings"
import { PrivacySecuritySettings } from "./settings/PrivacySecuritySettings"

function SettingsPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-sm text-gray-600">
          Manage application preferences and privacy settings
        </p>
        <p className="text-xs text-gray-500 mt-1">
          For personal info and password changes, visit your <a href="/profile" className="text-purple-600 hover:underline">Profile page</a>
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5 max-w-5xl">
        <NotificationSettings />
        <LanguageRegionSettings />
        <PrivacySecuritySettings />
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
