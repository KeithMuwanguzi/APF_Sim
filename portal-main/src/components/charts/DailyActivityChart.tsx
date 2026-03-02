/**
 * Daily Activity Chart Component
 */

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { Activity, Users, Calendar } from 'lucide-react';

interface DailyActivityChartProps {
  className?: string;
}

const DailyActivityChart: React.FC<DailyActivityChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getDailyActivityChart(period);
      setChartData(data);
    } catch (err) {
      setError('Failed to load daily activity data');
      console.error('Error fetching daily activity chart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5F2F8B]" />
            <h3 className="text-lg font-semibold text-gray-800">Daily Activity</h3>
          </div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5F2F8B]" />
            <h3 className="text-lg font-semibold text-gray-800">Daily Activity</h3>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Active Users',
        data: chartData?.data || [],
        backgroundColor: '#5F2F8B',
        borderColor: '#5F2F8B',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Active Users: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const totalActiveUsers = chartData?.data.reduce((a, b) => a + b, 0) || 0;
  const averageDaily = totalActiveUsers > 0 ? Math.round(totalActiveUsers / chartData!.data.length) : 0;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Daily Activity</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Avg: {averageDaily}/day</span>
          </div>
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as '7d' | '30d')}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5F2F8B] focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
        </div>
      </div>
      
      <ChartWrapper
        type="bar"
        data={data}
        options={options}
        height={280}
      />
    </div>
  );
};

export default DailyActivityChart;