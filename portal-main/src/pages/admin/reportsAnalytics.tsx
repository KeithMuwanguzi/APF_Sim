import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import ReportCard from "../../components/reports-Components/reportsCard";
import CustomGenerator from "../../components/reports-Components/customGenerator";
import RecentReports from "../../components/reports-Components/recentReports";

// Chart components
import MembershipGrowthChart from "../../components/charts/MembershipGrowthChart";
import ApplicationStatusChart from "../../components/charts/ApplicationStatusChart";
import DailyActivityChart from "../../components/charts/DailyActivityChart";

// Analytics hooks
import { useAnalytics } from "../../hooks/useAnalytics";
import { useReportTemplates } from "../../hooks/useReportTemplates";

const ReportsAnalytics = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // We pass '30d' as the default period to the hook
  const { analytics, loading: analyticsLoading } = useAnalytics('30d');
  const { templates, loading: templatesLoading, error: templatesError } = useReportTemplates();

  const handleRefreshReports = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // specific counts from chart data arrays
  const getCountFromChart = (chartData: { labels: string[], data: number[] }, targetLabel: string) => {
    if (!chartData || !chartData.labels) return 0;
    const index = chartData.labels.findIndex(
      label => label.toLowerCase() === targetLabel.toLowerCase()
    );
    return index !== -1 ? chartData.data[index] : 0;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="Reports & Analytics" />

        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-500 mt-1">Generate, analyze, and download detailed reports with real-time data visualization</p>
            </div>

            {/* Analytics Overview Cards */}
            {!analyticsLoading && analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Members */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.membership.total_members}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Applications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.applications.total_applications}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pending Applications  */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {getCountFromChart(analytics.applications.status_breakdown, 'Pending')}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Active Users  */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.system.active_users_30d || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MembershipGrowthChart />
              <ApplicationStatusChart />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <DailyActivityChart />
            </div>

            {/* Available Reports Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Available Templates</h2>
              
              {templatesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5E2590]"></div>
                </div>
              ) : templatesError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-red-600 font-medium mb-2">Failed to load report templates</p>
                  <p className="text-sm text-red-500">{templatesError}</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="bg-white/50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
                  <p className="text-slate-600 font-medium">No templates found</p>
                  <p className="text-sm text-slate-400 mt-2">Use the generator below to create your first report template.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {templates.map((template) => (
                    <ReportCard 
                      key={template.id}
                      template={template}
                      date={getCurrentDate()}
                      onSuccess={handleRefreshReports}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Generator Section */}
            <CustomGenerator onSuccess={handleRefreshReports} />

            {/* Recent Reports List Section */}
            <RecentReports refreshTrigger={refreshTrigger} />
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default ReportsAnalytics;