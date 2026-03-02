import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  User,
  FileText,
  CreditCard,
  Activity,
  BarChart3,
  StickyNote,
  Eye,
  Upload,
  RotateCcw,
  Edit,
  Download,
  Briefcase,
  MoreVertical,
  MapPin,
  FileCheck,
  Megaphone,
  ExternalLink,
  Loader2,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useRecentTransactions } from "../../hooks/usePaymentHistory"
import { useSpendingOverview } from "../../hooks/useSpending"
import { useMemberDashboard } from "../../hooks/useMemberDashboard"
import { dashboardEvents } from "../../utils/dashboardEvents"

const MemberDashboard: React.FC = () => {
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useMemberDashboard();
  
  // Subscribe to dashboard refresh events
  useEffect(() => {
    const unsubscribe = dashboardEvents.subscribe(() => {
      refetchDashboard();
    });
    
    return unsubscribe;
  }, [refetchDashboard]);
  
  // Get recent transactions from payment history
  const { transactions: recentTransactions, loading: transactionsLoading } = useRecentTransactions(5);
  
  // Get spending overview data
  const { data: spendingData, loading: spendingLoading } = useSpendingOverview();

  const profile = dashboardData?.profile;
  const documents = dashboardData?.documents ?? [];
  const recentActivity = dashboardData?.recent_activity ?? [];
  const notifications = dashboardData?.notifications ?? [];

  // Get display name from dashboard profile
  const displayName = profile?.display_name || 'Member';

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get document icon
  const getDocumentIcon = (docName: string) => {
    if (docName.toLowerCase().includes('id')) return User;
    if (docName.toLowerCase().includes('icpau') || docName.toLowerCase().includes('certificate')) return FileCheck;
    if (docName.toLowerCase().includes('business') || docName.toLowerCase().includes('license')) return Briefcase;
    return FileText;
  };

  // Helper function to get activity icon and color based on type
  const getActivityDisplay = (type: string) => {
    const typeMap: Record<string, { icon: any; bgColor: string }> = {
      'profile_update': { icon: Edit, bgColor: 'bg-purple-600' },
      'payment': { icon: CreditCard, bgColor: 'bg-green-600' },
      'document_upload': { icon: Upload, bgColor: 'bg-green-400' },
      'document_remove': { icon: FileText, bgColor: 'bg-gray-500' },
      'document_approved': { icon: FileCheck, bgColor: 'bg-green-600' },
      'document_rejected': { icon: FileText, bgColor: 'bg-red-600' },
      'document_download': { icon: Download, bgColor: 'bg-purple-400' },
      'forum_post': { icon: StickyNote, bgColor: 'bg-blue-600' },
      'forum_reply': { icon: StickyNote, bgColor: 'bg-blue-400' },
      'application_submit': { icon: FileText, bgColor: 'bg-yellow-600' },
      'application_approved': { icon: FileCheck, bgColor: 'bg-green-600' },
      'application_rejected': { icon: FileText, bgColor: 'bg-red-600' },
      'other': { icon: Activity, bgColor: 'bg-gray-600' },
    };
    
    return typeMap[type] || { icon: Activity, bgColor: 'bg-gray-600' };
  };

  const getActivityType = (action: string) => {
    // Return action directly if it's already a known type
    if (['document_upload', 'document_remove', 'document_approved', 'document_rejected', 'other'].includes(action)) {
      return action;
    }
    
    // Map old profile actions to types
    switch (action) {
      case 'picture_uploaded':
        return 'document_upload';
      case 'picture_removed':
      case 'created':
      case 'updated':
      case 'privacy_changed':
      case 'notifications_changed':
        return 'profile_update';
      default:
        return 'other';
    }
  };

  const activities = recentActivity
    .slice(0, 3)
    .map((activity) => ({
      id: String(activity.id),
      type: getActivityType(activity.action),
      message: activity.message || 'Account activity',
      createdAt: activity.timestamp,
    }));

  const getNotificationDisplay = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: FileCheck, color: 'text-green-600' };
      case 'warning':
        return { icon: MapPin, color: 'text-yellow-600' };
      case 'error':
        return { icon: Megaphone, color: 'text-red-600' };
      default:
        return { icon: Megaphone, color: 'text-purple-600' };
    }
  };

  // Helper function to format activity timestamp
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8">
          {dashboardLoading ? (
            <>
              <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-64 md:w-96"></div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName}!</h1>
              <p className="text-sm md:text-base text-gray-600">Here's your membership dashboard with financial insights and recent activity.</p>
            </>
          )}
        </div>

        {/* Top Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Membership Status Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Membership Status</span>
                <span className="sm:hidden">Status</span>
              </CardTitle>
              <Badge
                className={`text-xs ${
                  profile?.membership_status?.toLowerCase() === 'active'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {profile?.membership_status || 'Unknown'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category</span>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  {profile?.membership_category || 'Member'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Renewal</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatDate(profile?.next_renewal_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatDate(profile?.member_since)}
                </span>
              </div>
              <div className="space-y-2 pt-3 md:pt-4">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
                <Link to="/payments">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm">
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Renew Subscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Your Recent Activity</span>
                <span className="sm:hidden">Activity</span>
              </CardTitle>
              <Link to="/notifications">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">View All</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {dashboardLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                  <p className="text-gray-500 text-xs mt-1">Your recent actions will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {activities.map((activity) => {
                    const { icon: IconComponent, bgColor } = getActivityDisplay(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 md:w-10 md:h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                          <p className="text-xs text-gray-500">{formatActivityTime(activity.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents & Certificates Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="hidden sm:inline">Documents & Certificates</span>
                <span className="sm:hidden">Documents</span>
              </CardTitle>
              <Link to="/documents">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">View All</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {dashboardLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                  <Link to="/documents">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {documents
                    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
                    .slice(0, 3)
                    .map((doc) => {
                    const IconComponent = getDocumentIcon(doc.name);
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">Uploaded: {formatDate(doc.uploaded_at)}</p>
                          </div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table - Mobile Responsive */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              Payment History
            </CardTitle>
            <Link to="/payment-history">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View All</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading payment history...</div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No payment history yet</p>
                <Link to="/payments">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Make a Payment
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Description</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm">{transaction.date}</td>
                          <td className="py-4 px-4 text-sm">{transaction.type}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-purple-600">{transaction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                        <p className="text-sm font-semibold text-purple-600">{transaction.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bottom Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Spending Overview Chart */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                Spending Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {spendingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : spendingData.breakdown.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No spending data yet</p>
                  <Link to="/payment-history">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      View Payment History
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="h-40 md:h-56 flex items-end justify-center gap-3 md:gap-6 px-2 md:px-4 py-4 md:py-6">
                  {/* Chart bars - responsive sizing */}
                  {spendingData.breakdown.map((item) => (
                    <div key={item.year} className="flex flex-col items-center flex-1 max-w-12 md:max-w-16">
                      <div className="text-xs font-semibold text-purple-600 mb-1 md:mb-2">{item.formattedAmount}</div>
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:opacity-90"
                        style={{ 
                          height: `${Math.max((item.amount / spendingData.totalSpent) * 100, 10)}%` 
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-1 md:mt-2">{item.year}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <StickyNote className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              {dashboardLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent notifications</p>
                  <p className="text-gray-500 text-xs mt-1">Updates will appear here</p>
                </div>
              ) : (
                notifications.slice(0, 3).map((notification) => {
                  const { icon: NoteIcon, color } = getNotificationDisplay(notification.type);
                  return (
                    <div key={notification.id} className="flex items-center gap-3 p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                      <NoteIcon className={`w-4 h-4 md:w-5 md:h-5 ${color} flex-shrink-0`} />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-gray-700 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-500">{formatActivityTime(notification.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
        </div>
    </DashboardLayout>
  )
}

export default MemberDashboard
