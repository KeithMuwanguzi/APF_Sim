import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FolderCheck,
  Bell,
  CreditCard,
  MessageSquare,
  LogOut,
  ChevronLeft,
  User,
  History,
  Plus,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"
import logoDashboard from "../../assets/LogoDashboard.png"

/* MEMBER navigation items - Clean, semantic icon mapping */
const memberNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FolderCheck },
  { label: "Notifications", href: "/notifications", icon: Bell },
]

interface MemberSideNavProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileToggle?: () => void
}

function MemberSideNav({ isCollapsed, onToggle, isMobileOpen = false, onMobileToggle }: MemberSideNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)
  const [showForumDropdown, setShowForumDropdown] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    
    // Redirect to landing page
    navigate('/')
  }

  const isPaymentActive = 
    activeSection === 'payments' ||
    location.pathname === '/payments' ||
    location.pathname === '/payment-history'
    
  const isForumActive = 
    activeSection === 'forum' ||
    location.pathname === '/forum' ||
    location.pathname === '/forum/create-post'

  const handleMobileLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onMobileToggle) {
      onMobileToggle()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-white/80 backdrop-blur-xl border-r border-gray-200/50 fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 shadow-xl ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        // Mobile responsive classes
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* ================= LOGO & TOGGLE ================= */}
        <div className="h-16 md:h-20 flex-shrink-0 flex items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-4 w-full truncate" onClick={handleMobileLinkClick}>
            <img
              src={logoDashboard}
              alt="APF Logo"
              className="h-8 md:h-10 w-auto object-contain flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                <div>APF</div>
                <div className="text-lg md:text-xl">Uganda</div>
              </div>
            )}
          </Link>
          
          {/* Desktop toggle button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-all duration-300 flex-shrink-0 hidden md:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : 'rotate-0'
            }`} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileToggle}
            className="p-2 rounded-lg transition-all duration-300 flex-shrink-0 md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/*  NAV LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {memberNavItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  setActiveSection(null)
                  handleMobileLinkClick()
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#D689FF] text-white shadow-lg shadow-[#D689FF]/25'
                    : 'text-gray-600'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            )
          })}

          {/* PAYMENTS WITH EXPANDABLE SECTION */}
          <div className="relative">
            <Link
              to="/payments"
              onClick={(e) => {
                if (!isCollapsed) {
                  // If dropdown is already open, prevent navigation and just toggle
                  if (showPaymentDropdown) {
                    e.preventDefault()
                    setShowPaymentDropdown(false)
                  } else {
                    // Navigate to payments page and set active section
                    setActiveSection('payments')
                    setShowPaymentDropdown(true)
                    handleMobileLinkClick()
                  }
                } else {
                  handleMobileLinkClick()
                }
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isPaymentActive
                  ? 'bg-[#D689FF] text-white shadow-lg shadow-[#D689FF]/25'
                  : 'text-gray-600'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Payments & Renewals' : ''}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">Payments & Renewals</span>}
              </div>
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowPaymentDropdown(!showPaymentDropdown)
                    setActiveSection('payments')
                  }}
                  className="p-1 rounded transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPaymentDropdown ? 'rotate-180' : ''}`} />
                </button>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Payments & Renewals
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
            
            {/* Expandable Payment Sub-item - Only Payment History */}
            {showPaymentDropdown && !isCollapsed && (
              <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <Link
                  to="/payment-history"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 ml-6 rounded-lg transition-all duration-200 group relative ${
                    location.pathname === '/payment-history'
                      ? 'bg-[#D689FF]/70 text-white font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  <History className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Payment History</span>
                </Link>
              </div>
            )}
          </div>

          {/*COMMUNITY FORUM WITH EXPANDABLE SECTION */}
          <div className="relative">
            <Link
              to="/forum"
              onClick={(e) => {
                if (!isCollapsed) {
                  // If dropdown is already open, prevent navigation and just toggle
                  if (showForumDropdown) {
                    e.preventDefault()
                    setShowForumDropdown(false)
                  } else {
                    // Navigate to forum page and set active section
                    setActiveSection('forum')
                    setShowForumDropdown(true)
                    handleMobileLinkClick()
                  }
                } else {
                  handleMobileLinkClick()
                }
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isForumActive
                  ? 'bg-[#D689FF] text-white shadow-lg shadow-[#D689FF]/25'
                  : 'text-gray-600'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Community Forum' : ''}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">Community Forum</span>}
              </div>
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowForumDropdown(!showForumDropdown)
                    setActiveSection('forum')
                  }}
                  className="p-1 rounded transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showForumDropdown ? 'rotate-180' : ''}`} />
                </button>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Community Forum
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
            
            {/* Expandable Forum Sub-item - Only Create Post */}
            {showForumDropdown && !isCollapsed && (
              <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <Link
                  to="/forum/create-post"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 ml-6 rounded-lg transition-all duration-200 group relative ${
                    location.pathname === '/forum/create-post'
                      ? 'bg-[#D689FF]/70 text-white font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Create New Post</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* BOTTOM SECTION */}
        <div className="px-3 pb-4 space-y-2 border-t border-gray-200/50 pt-4">
          {/* Profile Link */}
          <Link
            to="/profile"
            onClick={handleMobileLinkClick}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
              location.pathname === '/profile'
                ? 'bg-[#D689FF] text-white shadow-lg shadow-[#D689FF]/25'
                : 'text-gray-600'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Profile' : ''}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Profile</span>}
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Profile
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 transition-all duration-200 group relative ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Log Out' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Log Out</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Log Out
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

export default MemberSideNav