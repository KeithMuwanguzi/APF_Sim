import { FC, useState } from "react";
import {
    FiEye,
    FiDownload,
    FiLoader,
} from "react-icons/fi";
import { Application } from "../../types/Application";

interface ApplicationsTableProps {
    applicants: Application[];
    loading: boolean;
    onApprove?: (applicationId: number) => Promise<void>;
    onReject?: (applicationId: number) => Promise<void>;
    onRetry?: (applicationId: number) => Promise<void>;
    onView?: (applicationId: number) => void;
    actionLoading?: number | null;
}

const ApplicationsTable: FC<ApplicationsTableProps> = ({
    applicants,
    loading,
    onView,
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            const exportData = applicants.map(app => ({
                'Applicant Name': app.name,
                'Email Address': app.email,
                'Category': app.category,
                'ICPA Certificate No': app.icpaCertNo,
                'Fee Status': app.feeStatus,
                'Application Status': app.status,
                'Submission Date': app.submissionDate,
            }));

            const headers = Object.keys(exportData[0]);
            const csvContent = [
                headers.join(','),
                ...exportData.map(row => 
                    headers.map(header => {
                        const value = row[header as keyof typeof row];
                        return `"${String(value).replace(/"/g, '""')}"`;
                    }).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting applications:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleView = (applicationId: number) => {
        if (onView) {
            onView(applicationId);
        }
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-[#5F2F8B] text-2xl mr-2" />
                    <p className="text-gray-500">Loading applications...</p>
                </div>
            </div>
        );
    }

    if (!applicants || applicants.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500 text-center py-8">No applications found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 ">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">All Applications</h3>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        disabled={isExporting || applicants.length === 0}
                        className="flex items-center bg-transparent border-2 border-[#5F2F8B] gap-1 text-sm text-[#5F2F8B] hover:text-white hover:bg-[#5F2F8B] rounded-xl px-3 py-1 pl-2 pr-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isExporting ? <FiLoader className="text-base animate-spin" /> : <FiDownload className="text-base" />}
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 border border-[#F4F2FE] rounded-xl">
                    <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border-b min-w-[150px]">Applicant Name</th>
                            <th className="px-4 py-2 border-b min-w-[200px] max-w-[250px]">Email Address</th>
                            <th className="px-4 py-2 border-b min-w-[120px]">Category</th>
                            <th className="px-4 py-2 border-b min-w-[120px]">ICPA Cert. No.</th>
                            <th className="px-4 py-2 border-b min-w-[100px]">Fee Status</th>
                            <th className="px-4 py-2 border-b min-w-[120px]">Application Status</th>
                            <th className="px-4 py-2 border-b min-w-[120px]">Submission Date</th>
                            <th className="px-4 py-2 border-b min-w-[100px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.map((app) => (
                            <tr key={app.id} className="border-b last:border-none hover:bg-gray-50">
                                <td className="px-4 py-2 font-bold">{app.name}</td>
                                <td className="px-4 py-2 font-medium max-w-xs">
                                    <div className="truncate" title={app.email}>{app.email}</div>
                                </td>
                                <td className="px-4 py-2 font-medium">{app.category}</td>
                                <td className="px-4 py-2 font-medium">{app.icpaCertNo}</td>
                                <td className="px-4 py-2 text-sm font-medium">
                                    {app.feeStatus === "Paid" ? (
                                        <span className="text-[#0FB880] font-bold">Paid</span>
                                    ) : (
                                        <span className="text-[#EE4444] font-bold">Not Paid</span>
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            app.status === "Pending"
                                                ? "bg-[#E5E0FE] text-[#5F2F8B]"
                                                : app.status === "Approved"
                                                ? "bg-[#D3F0E6] text-[#0FB880]"
                                                : "bg-[#FEE2E2] text-[#EE4444]"
                                        }`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 font-medium">{app.submissionDate}</td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleView(app.id)}
                                            className="bg-transparent border-2 border-gray-200 hover:bg-[#5F2F8B] hover:border-[#5F2F8B] hover:text-white text-gray-900 px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1"
                                            title="View Details"
                                        >
                                            <FiEye />
                                            <span>View</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicationsTable;