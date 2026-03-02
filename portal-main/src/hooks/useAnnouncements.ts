import { useState, useEffect, useCallback } from 'react';
import { announcementsApi, Announcement, AnnouncementStats } from '../services/announcementsApi';

export const useAnnouncements = (filters?: {
  status?: string;
  audience?: string;
  channel?: string;
  search?: string;
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await announcementsApi.getAll(filters);
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.audience, filters?.channel, filters?.search]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await announcementsApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, [fetchAnnouncements, fetchStats]);

  const refetch = useCallback(() => {
    fetchAnnouncements();
    fetchStats();
  }, [fetchAnnouncements, fetchStats]);

  return {
    announcements,
    stats,
    loading,
    error,
    refetch,
  };
};
