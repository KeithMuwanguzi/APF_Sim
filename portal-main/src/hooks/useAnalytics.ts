import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/analyticsApi';


interface AnalyticsState {
  membership: { 
    total_members: number; 
    growth: { labels: string[]; data: number[] } 
  };
  applications: { 
    total_applications: number; 
    status_breakdown: { labels: string[]; data: number[] } 
  };
  system: { 
    active_users_30d: number; 
    daily_activity: { labels: string[]; data: number[] } 
  };
}

export const useAnalytics = (period: string = '30d') => {
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    membership: { total_members: 0, growth: { labels: [], data: [] } },
    applications: { total_applications: 0, status_breakdown: { labels: [], data: [] } },
    system: { active_users_30d: 0, daily_activity: { labels: [], data: [] } }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
     
      const results = await Promise.allSettled([
        analyticsApi.getDashboardSummary(period),
        analyticsApi.getApplicationStatusChart(period),
        analyticsApi.getDailyActivityChart('7d')
      ]);

      const [summaryRes, appsRes, systemRes] = results;

      setAnalytics({
        // 1. Membership comes from the summary endpoint
        membership: summaryRes.status === 'fulfilled' 
          ? summaryRes.value?.membership 
          : { total_members: 0, growth: { labels: [], data: [] } },

      
        applications: appsRes.status === 'fulfilled' 
          ? { 
              total_applications: summaryRes.status === 'fulfilled' ? summaryRes.value?.applications?.total_applications : 0,
              status_breakdown: appsRes.value 
            }
          : { total_applications: 0, status_breakdown: { labels: [], data: [] } },

        system: systemRes.status === 'fulfilled' 
          ? { 
              active_users_30d: summaryRes.status === 'fulfilled' ? summaryRes.value?.system?.active_users_30d : 0,
              daily_activity: systemRes.value 
            }
          : { active_users_30d: 0, daily_activity: { labels: [], data: [] } }
      });

      if (results.every(r => r.status === 'rejected')) {
        setError("Unable to connect to analytics services.");
      } else {
        setError(null);
      }
    } catch (err: any) {
      console.error("Critical Analytics Hook Error:", err);
      setError("A critical error occurred while fetching analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]); 

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { analytics, loading, error, refresh: fetchAllData };
};