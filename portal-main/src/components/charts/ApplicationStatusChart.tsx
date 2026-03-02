/**
 * Application Status Distribution Chart Component
 */

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { PieChart, FileText, Calendar } from 'lucide-react';

interface ApplicationStatusChartProps {
  className?: string;
}

type PeriodType = '7d' | '30d' | '90d';

const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('30d');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getApplicationStatusChart();
      setChartData(data);
    } catch (err) {
      setError('Failed to load application status data');
      console.error('Error fetching application status chart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5F2F8B]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Color mapping for different statuses
  const getStatusColors = (labels: string[]) => {
    return labels.map(label => {
      switch (label.toLowerCase()) {
        case 'pending':
          return '#F59E0B'; // Amber
        case 'approved':
          return '#10B981'; // Emerald
        case 'rejected':
          return '#EF4444'; // Red
        default:
          return '#6B7280'; // Gray
      }
    });
  };

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Applications',
        data: chartData?.data || [],
        backgroundColor: getStatusColors(chartData?.labels || []),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalApplications = chartData?.data.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>Total: {totalApplications}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5F2F8B] focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      <ChartWrapper
        type="doughnut"
        data={data}
        options={options}
        height={280}
      />
    </div>
  );
};

export default ApplicationStatusChart;