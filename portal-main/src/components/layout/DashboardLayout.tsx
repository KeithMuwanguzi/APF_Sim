import React, { useState, useRef, useEffect } from "react"
import {
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Globe,
  Settings,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import MemberSideNav from "../common/memberSideNav"
import { useProfile } from "../../hooks/useProfile"
import { clearAuth } from "../../utils/authStorage"

interface DashboardLayoutProps {
  children: React.ReactNode
  headerContent?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  headerContent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { profile, loading } = useProfile()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User'
  const initials = profile?.initials || 'U'
  const membershipType = profile?.user_role === '1' ? 'Administrator' : 'Member'

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const handleLogout = () => {
    // Clear auth using new storage helper
    clearAuth()
    // Redirect to login
    navigate('/login')
  }

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false)
    navigate('/profile')
  }

  const handleSettings = () => {
    setIsProfileDropdownOpen(false)
    navigate('/member/settings')
  }

  const handleBackToWebsite = () => {
    setIsProfileDropdownOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/*MEMBER SIDEBAR */}
      <MemberSideNav 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/*MAIN CONTENT AREA */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        // Desktop: adjust margin based on sidebar state
        // Mobile: no margin adjustment, sidebar is overlay
        'md:' + (isCollapsed ? 'ml-16' : 'ml-64')
      }`}>
        {/* Header - Mobile responsive */}
        <header className="bg-white border-b px-4 md:px-6 h-14 md:h-16 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {headerContent}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {/* Notification badge - can be made dynamic later */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {loading ? (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={displayName}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-[#60308C] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs md:text-sm font-medium">
                        {initials}
                      </span>
                    </div>
                  )}
                  {loading ? (
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
                  ) : (
                    <span className="font-medium text-sm md:text-base hidden sm:block">{displayName}</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        {profile?.profile_picture_url ? (
                          <img
                            src={profile.profile_picture_url}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {initials}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {profile?.email}
                          </p>
                          <p className="text-xs text-purple-600 font-medium mt-0.5">
                            {membershipType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={handleSettings}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleBackToWebsite}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>Back to Website</span>
                      </button>

                      {/* Divider */}
                      <div className="my-1 h-px bg-gray-200" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Mobile responsive padding */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer - Mobile responsive */}
        <footer className="border-t border-gray-200 p-3 md:p-4 bg-white">
          <div className="text-center text-xs md:text-sm text-gray-500">
            © 2026 APF Uganda. All rights reserved. | 
            <span className="hidden sm:inline"> Privacy Policy | Terms of Service</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
