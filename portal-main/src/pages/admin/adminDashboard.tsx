import { Users, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

import Sidebar from "../../components/common/adminSideNav";
import StatsGrid from "../../components/adminOverview-components/statGrid";
import { Stat } from "../../types/dashboard";
import RecentApplications from "../../components/adminOverview-components/recentApplications";
import RecentPayments from "../../components/adminOverview-components/recentPayments";
import QuickActions from "../../components/adminOverview-components/quickActions";
import Header from "../../components/layout/Header";
import WelcomeBanner from "../../components/adminOverview-components/banner";
import Footer from "../../components/layout/Footer";
import { fetchDashboardStats, DashboardStats } from "../../services/dashboard";
import { requireAdmin } from "../../utils/auth";
import { useProfile } from "../../hooks/useProfile";

function AdminDashboard(){
    const [collapsed, setCollapsed] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    
    // Get profile data for welcome banner
    const { profile } = useProfile();
    
    // Check authentication on component mount
    useEffect(() => {
      if (!requireAdmin()) {
        return; // Will redirect to login
      }
    }, []);
   
   const loadDashboardStats = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const stats = await fetchDashboardStats();
        setDashboardStats(stats);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

   useEffect(() => {
      loadDashboardStats();
      
      // Auto-refresh every 30 seconds to keep revenue stats current
      const intervalId = setInterval(() => {
        loadDashboardStats(true);
      }, 30 * 1000); // 30 seconds

      return () => clearInterval(intervalId);
   }, []);

  // Get display name from profile or fallback to email
  const displayName = profile?.full_name || profile?.first_name || profile?.email?.split('@')[0] || 'Admin';

  // Format last updated time
  const formatLastUpdated = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Create stats array from dashboard data
  const stats: Stat[] = dashboardStats ? [
    { 
      title: "Total Members", 
      value: dashboardStats.totalMembers.value.toString(), 
      trend: dashboardStats.totalMembers.trend,
      percentage: `${dashboardStats.totalMembers.trend === 'up' ? '+' : '-'}${dashboardStats.totalMembers.change}%`,
      period: "from last month", 
      icon: Users, 
      color: "purple" 
    },
    { 
      title: "Total Applications", 
      value: dashboardStats.totalApplications.value.toString(), 
      trend: dashboardStats.totalApplications.trend, 
      percentage: `${dashboardStats.totalApplications.trend === 'up' ? '+' : '-'}${dashboardStats.totalApplications.change}%`,
      period: "from last month",
      icon: FileText,
      color: "orange" 
    },
    { 
      title: "Total Revenue", 
      value: dashboardStats.revenue.value, 
      trend: dashboardStats.revenue.trend,
      percentage: `${dashboardStats.revenue.trend === 'up' ? '+' : '-'}${dashboardStats.revenue.change}%`, 
      period: "from last month", 
      icon: TrendingUp,  
      color: "green" 
    },
  ] : [];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Content wrapper with margin to avoid overlap */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} min-h-screen`}>
        {/* Top Bar */}
        <Header title="Dashboard Overview" />

        <main className="flex-1 p-6">
          {/* Welcome Banner with Refresh */}
          <div className="flex items-center justify-between mb-6">
            <WelcomeBanner name={displayName} />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Updated: {formatLastUpdated()}
              </span>
              <button
                onClick={() => loadDashboardStats(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh dashboard data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StatsGrid stats={stats} />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Applications */}
            <RecentApplications />

            {/* Recent Payments */}
            <RecentPayments />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 animate-slide-up rounded-xl border border-border bg-card p-4">
            <QuickActions />
          </div>
        </main>
        
        {/* Sticky Footer */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;