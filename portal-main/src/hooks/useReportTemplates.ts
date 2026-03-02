import { useState, useEffect } from 'react';
import { analyticsApi, ReportTemplate } from '../services/analyticsApi';

interface UseReportTemplatesResult {
  templates: ReportTemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useReportTemplates = (): UseReportTemplatesResult => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getReportTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching report templates:', err);
      setError('Failed to load report templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
};
