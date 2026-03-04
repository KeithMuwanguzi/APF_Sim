import { useState, useEffect } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import StatsCard from "../../components/dashboard/StatsCard";
import ApplicationsTable from "../../components/applications/ApplicationsTable";
import ApplicationDetailModal from "../../components/applications/ApplicationDetailModal";
import Footer from "../../components/layout/Footer";
import { useApplications } from "../../hooks/useApplications";
import { useAdminActions } from "../../hooks/useAdminActions";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { requireAdmin } from "../../utils/auth";
import { AuthDebug } from "../../components/debug/AuthDebug";

import {
    MdPendingActions,
    MdCheckCircle,
    MdCancel,
    MdAttachMoney,
} from "react-icons/md";

const AdminApprovals = () => {
    const { applications, loading, error: fetchError, refetch } = useApplications();
    const { statistics, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { approve, reject, retry, error: actionError, clearError } = useAdminActions();
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false); // track sidebar state
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

 
    useEffect(() => {
        if (!requireAdmin()) {
            return; // Will redirect to login
        }
    }, []);

    
    const pendingCount = statistics?.pending_applications ?? applications.filter((app) => app.status === "Pending").length;
    const approvedCount = statistics?.approved_applications ?? applications.filter((app) => app.status === "Approved").length;
    const rejectedCount = statistics?.rejected_applications ?? applications.filter((app) => app.status === "Rejected").length;

    
    const formatRevenue = (amount: number): string => {
        if (amount >= 1000000000) {
            return `UGX ${(amount / 1000000000).toFixed(2)}B`;
        } else if (amount >= 1000000) {
            return `UGX ${(amount / 1000000).toFixed(2)}M`;
        } else if (amount >= 1000) {
            return `UGX ${(amount / 1000).toFixed(2)}K`;
        }
        return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const totalRevenue = statistics?.total_revenue ?? 0;
    const formattedRevenue = formatRevenue(totalRevenue);

    
    console.log('Admin Approval Stats:', {
        statistics,
        totalRevenue,
        formattedRevenue,
        hasTotalRevenue: statistics?.total_revenue !== undefined
    });

    
    useEffect(() => {
        const interval = setInterval(() => {
            refetchStats();
        }, 300000); // Refresh every 5 minutes (300000ms)

        return () => clearInterval(interval);
    }, [refetchStats]);

    const handleApprove = async (applicationId: number) => {
        clearError();
        setSuccessMessage(null);
        setActionLoadingId(applicationId);
        try {
            const result = await approve(applicationId);
            if (result.success) {
                setSuccessMessage("Application approved successfully");
                
                // Approval email is sent by backend automatically
                const application = applications.find(app => app.id === applicationId);
                if (application) {
                    console.log('Approval email sent by backend to:', application.email);
                }
            }

            
            await Promise.all([refetch(), refetchStats()]);
            
            setTimeout(() => {
                refetchStats();  
                setSuccessMessage(null);
            }, 3000);
        } catch (error) {
            console.error("Failed to approve application:", error);
        } finally {
            setActionLoadingId(null);
        }
    };

const handleReject = async (applicationId: number) => {
    clearError();
    setSuccessMessage(null);
    setActionLoadingId(applicationId);
    try {
        const result = await reject(applicationId);
        if (result.success) {
            setSuccessMessage("Application rejected successfully");
            
            // Refresh only stats after action
            await refetchStats();
            
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    } catch (error) {
        console.error("Failed to reject application:", error);
    } finally {
        setActionLoadingId(null);
    }
};

const handleRetry = async (applicationId: number) => {
    clearError();
    setSuccessMessage(null);
    setActionLoadingId(applicationId);
    try {
        const result = await retry(applicationId);
        if (result.success) {
            setSuccessMessage("Application reset to pending successfully");
            
            await Promise.all([refetch(), refetchStats()]);
            
            setTimeout(() => {
                refetchStats();  
                setSuccessMessage(null);
            }, 3000);
        }
    } catch (error) {
        console.error("Failed to reset application:", error);
    } finally {
        setActionLoadingId(null);
    }
};

const handleView = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsDetailModalOpen(true);
};

const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicationId(null);
};

return (
    <div className="flex min-h-screen flex-col">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

        
        <main
            className={`flex-1 bg-gray-50 p-0 overflow-y-auto transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"
                } flex flex-col min-h-screen`}
        >
            <Header title="Application Approval" />

            
            {(successMessage || actionError || fetchError || statsError) && (
                <div className="mx-6 mt-4">
                    {successMessage && (
                        <div
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">{successMessage}</span>
                            <button
                                onClick={() => setSuccessMessage(null)}
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            >
                                <span className="text-green-700">×</span>
                            </button>
                        </div>
                    )}
                    {actionError && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">{actionError}</span>
                            <button
                                onClick={clearError}
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            >
                                <span className="text-red-700">×</span>
                            </button>
                        </div>
                    )}
                    {(fetchError || statsError) && (
                        <div
                            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">{fetchError || statsError}</span>
                        </div>
                    )}
                </div>
            )}

            
            <div className="flex-1 bg-[#F4F2FE] p-6 rounded-lg mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title="Pending Applications"
                        value={pendingCount}
                        change={statistics?.trends.pending_change ?? 0}
                        icon={<MdPendingActions />}
                    />
                    <StatsCard
                        title="Approved"
                        value={approvedCount}
                        change={statistics?.trends.approved_change ?? 0}
                        icon={<MdCheckCircle />}
                    />
                    <StatsCard
                        title="Rejected"
                        value={rejectedCount}
                        change={statistics?.trends.rejected_change ?? 0}
                        icon={<MdCancel />}
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={formattedRevenue}
                        change={statistics?.trends.revenue_change ?? 0}
                        icon={<MdAttachMoney />}
                    />
                </div>
                <ApplicationsTable
                    applicants={applications}
                    loading={loading || statsLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRetry={handleRetry}
                    onView={handleView}
                    actionLoading={actionLoadingId}
                />
            </div>

            
            <div className="mt-auto">
                <Footer />
            </div>
            <AuthDebug />
        </main>

        {/* Application Detail Modal */}
{selectedApplicationId && (
    <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onRetry={handleRetry}
    /> 
)}
    </div>
);
};

export default AdminApprovals;