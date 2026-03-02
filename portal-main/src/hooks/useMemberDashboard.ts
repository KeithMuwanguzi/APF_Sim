import { useEffect, useState } from 'react';
import {
  fetchMemberDashboard,
  MemberDashboardResponse,
} from '../services/memberDashboard';

export const useMemberDashboard = () => {
  const [data, setData] = useState<MemberDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchMemberDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Member dashboard error:', err);
      setError('Failed to load member dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: loadDashboard,
  };
};
