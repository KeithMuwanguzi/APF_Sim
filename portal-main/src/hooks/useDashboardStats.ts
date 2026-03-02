/**
 * Dashboard Statistics Hook
 * 
 * Provides dashboard statistics with trend data for admin pages.
 */

import { useEffect, useState, useCallback } from 'react';
import { DashboardStatistics, fetchDashboardStatistics } from '../services/dashboard';

interface UseDashboardStatsReturn {
  statistics: DashboardStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchDashboardStatistics();
      setStatistics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard statistics';
      setError(errorMessage);
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: loadStatistics,
  };
};