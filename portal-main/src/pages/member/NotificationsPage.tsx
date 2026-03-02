import React, { useState } from "react"
import {
  Bell,
  Filter,
  CheckCheck,
  Search,
  CreditCard,
  Server,
  Star,
  CheckCircle,
  Shield,
  AlertTriangle,
  Loader2,
  Activity,
  Upload,
  FileText,
  Edit,
  Download,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useNotifications, useNotificationStats } from "../../hooks/useNotifications"
import { useMemberDashboard } from "../../hooks/useMemberDashboard"

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'notifications' | 'activities'>('notifications')
  
  // Get notifications from backend
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications(activeFilter)
  
  // Get notification statistics
  const { stats, loading: statsLoading } = useNotificationStats()
  
  // Get activities from dashboard data
  const { data: dashboardData, loading: dashboardLoading } = useMemberDashboard()
  const allActivities = dashboardData?.recent_activity ?? []

  // Helper function to get activity icon and color based on type
  const getActivityDisplay = (type: string) => {
    const typeMap: Record<string, { icon: React.ElementType; bgColor: string }> = {
      'profile_update': { icon: Edit, bgColor: 'bg-purple-600' },
      'payment': { icon: CreditCard, bgColor: 'bg-green-600' },
      'document_upload': { icon: Upload, bgColor: 'bg-green-400' },
      'document_remove': { icon: FileText, bgColor: 'bg-gray-500' },
      'document_approved': { icon: CheckCircle, bgColor: 'bg-green-600' },
      'document_rejected': { icon: FileText, bgColor: 'bg-red-600' },
      'document_download': { icon: Download, bgColor: 'bg-purple-400' },
      'other': { icon: Activity, bgColor: 'bg-gray-600' },
    }
    
    return typeMap[type] || { icon: Activity, bgColor: 'bg-gray-600' }
  }

  const getActivityType = (action: string) => {
    if (['document_upload', 'document_remove', 'document_approved', 'document_rejected', 'other'].includes(action)) {
      return action
    }
    
    switch (action) {
      case 'picture_uploaded':
        return 'document_upload'
      case 'picture_removed':
      case 'created':
      case 'updated':
      case 'privacy_changed':
      case 'notifications_changed':
        return 'profile_update'
      default:
        return 'other'
    }
  }

  // Helper function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'announcement': Bell,
      'membership': Star,
      'payment': CreditCard,
      'system': Server,
      'security': Shield,
      'info': Bell,
      'success': CheckCircle,
      'warning': AlertTriangle,
      'error': AlertTriangle,
    }
    return iconMap[type] || Bell
  }

  // Helper function to format notification timestamp
  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (diffDays < 7) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-purple-100 text-purple-600'
      case 'membership':
        return 'bg-purple-100 text-purple-600'
      case 'payment':
        return 'bg-green-100 text-green-600'
      case 'system':
      case 'info':
        return 'bg-blue-100 text-blue-600'
      case 'security':
      case 'error':
        return 'bg-red-100 text-red-600'
      case 'warning':
        return 'bg-yellow-100 text-yellow-600'
      case 'success':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const toggleNotificationRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  // Separate notifications into today, this week, and older
  const todayNotifications = notifications.filter(n => {
    const date = new Date(n.createdAt)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  })

  const weekNotifications = notifications.filter(n => {
    const date = new Date(n.createdAt)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date < today && date >= weekAgo && date.toDateString() !== today.toDateString()
  })

  const olderNotifications = notifications.filter(n => {
    const date = new Date(n.createdAt)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date < weekAgo
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications & Activity</h1>
            <div className="flex gap-2 mt-4">
              <Button
                variant={activeTab === 'notifications' ? "default" : "outline"}
                onClick={() => setActiveTab('notifications')}
                className={activeTab === 'notifications' ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant={activeTab === 'activities' ? "default" : "outline"}
                onClick={() => setActiveTab('activities')}
                className={activeTab === 'activities' ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                <Activity className="w-4 h-4 mr-2" />
                Recent Activity
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            {activeTab === 'notifications' && (
              <Button 
                onClick={handleMarkAllAsRead}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                disabled={loading || stats.unread === 0}
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">{stats.unread}</h3>
                )}
                <p className="text-gray-600">Unread Notifications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">{stats.read}</h3>
                )}
                <p className="text-gray-600">Read Notifications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">{stats.urgent}</h3>
                )}
                <p className="text-gray-600">Urgent Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'notifications' ? (
              <>
                {/* Notification Filters */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'unread', label: 'Unread' },
                      { key: 'payment', label: 'Payments' },
                      { key: 'membership', label: 'Membership' },
                    ].map((filter) => (
                      <Button
                        key={filter.key}
                        variant={activeFilter === filter.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(filter.key)}
                        className={activeFilter === filter.key ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>

                {/* Today's Notifications */}
                <Card className="bg-white shadow-lg border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Today</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                      </div>
                    ) : todayNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No notifications today</p>
                        <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      todayNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`flex p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50 ${
                              !notification.isRead 
                                ? 'bg-purple-50/50 border-l-purple-600' 
                                : 'border-l-transparent'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
                              <div className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.message}</div>
                              <div className="text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleNotificationRead(notification.id)}
                                className="text-gray-500 hover:text-purple-600 text-xs"
                              >
                                {!notification.isRead ? 'Mark as read' : 'Mark as unread'}
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                {/* This Week's Notifications */}
                {!loading && weekNotifications.length > 0 && (
                  <Card className="bg-white shadow-lg border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {weekNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`flex p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50 ${
                              !notification.isRead 
                                ? 'bg-purple-50/50 border-l-purple-600' 
                                : 'border-l-transparent'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
                              <div className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.message}</div>
                              <div className="text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleNotificationRead(notification.id)}
                                className="text-gray-500 hover:text-purple-600 text-xs"
                              >
                                {!notification.isRead ? 'Mark as read' : 'Mark as unread'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}

                {/* Older Notifications */}
                {!loading && olderNotifications.length > 0 && (
                  <Card className="bg-white shadow-lg border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Older</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {olderNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`flex p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50 ${
                              !notification.isRead 
                                ? 'bg-purple-50/50 border-l-purple-600' 
                                : 'border-l-transparent'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
                              <div className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.message}</div>
                              <div className="text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleNotificationRead(notification.id)}
                                className="text-gray-500 hover:text-purple-600 text-xs"
                              >
                                {!notification.isRead ? 'Mark as read' : 'Mark as unread'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Activities Tab */
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">All Activity History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                    </div>
                  ) : allActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">No activity history</p>
                      <p className="text-gray-500 text-xs mt-1">Your activities will appear here</p>
                    </div>
                  ) : (
                    allActivities.map((activity) => {
                      const activityType = getActivityType(activity.action)
                      const { icon: IconComponent, bgColor } = getActivityDisplay(activityType)
                      return (
                        <div key={activity.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                            <p className="text-xs text-gray-500">{formatNotificationTime(activity.timestamp)}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notification Summary */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Notification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple Chart */}
                <div className="h-32 flex items-end gap-2 mb-4">
                  {[80, 60, 90, 40, 70, 50, 85].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-200 to-purple-400 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                
                {/* Summary Stats */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  {statsLoading ? (
                    <>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Announcements</span>
                        <span className="font-semibold">{stats.byType.announcement || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membership Updates</span>
                        <span className="font-semibold">{stats.byType.membership || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Notifications</span>
                        <span className="font-semibold">{stats.byType.payment || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Alerts</span>
                        <span className="font-semibold">{stats.byType.system || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Alerts</span>
                        <span className="font-semibold">{stats.byType.security || 0}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NotificationsPage