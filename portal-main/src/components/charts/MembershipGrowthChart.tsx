import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { TrendingUp, Calendar } from 'lucide-react';

const MembershipGrowthChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'30d' | '12m'>('30d');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
       
        const data = await analyticsApi.getMembershipGrowthChart(period);
        
        if (!data || !data.labels || data.labels.length === 0) {
          setError('No data available');
        } else {
          setChartData(data);
        }
      } catch (err) {
        setError('Failed to load chart');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period]);

  const data = {
    labels: chartData?.labels || [],
    datasets: [{
      label: 'New Members',
      data: chartData?.data || [],
      backgroundColor: 'rgba(95, 47, 139, 0.1)',
      borderColor: '#5F2F8B',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Membership Growth</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as '30d' | '12m')}
          className="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="30d">Last 30 Days</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">Loading...</div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-gray-400">{error}</div>
      ) : (
        <ChartWrapper type="line" data={data} height={280} />
      )}
    </div>
  );
};

export default MembershipGrowthChart;