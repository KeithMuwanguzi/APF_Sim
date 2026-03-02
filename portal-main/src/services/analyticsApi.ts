import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';


export interface ChartData {
  labels: string[];
  data: number[];
  title?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  report_type: string;
  report_type_display: string;
  description: string;
  output_format: string;
  created_at: string;
  chart_configs?: {
    preview_data?: number[];
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsApi = {
 
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await api.get('/api/v1/reports/templates/');
    return response.data;
  },

  createReportTemplate: async (data: any): Promise<ReportTemplate> => {
    const response = await api.post('/api/v1/reports/templates/', data);
    return response.data;
  },

  // --- Report Generation ---
  generateReport: async (templateId: string, title: string, format: string) => {
    const response = await api.post('/api/v1/reports/generated-reports/', {
      template: templateId,
      title: title,
      file_format: format.toLowerCase()
    });
    return response.data;
  },

  getGeneratedReports: async () => {
    const response = await api.get('/api/v1/reports/generated-reports/');
    return response.data;
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/api/v1/reports/download/${reportId}/`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // --- Dashboard Chart Data ---

  /**
   * Fetches data for the Membership Growth line chart
   * 
   */
  getMembershipGrowthChart: async (period: string = '30d'): Promise<ChartData> => {
    const response = await api.get(`/api/v1/reports/analytics/charts/`, {
      params: { type: 'membership_growth', period }
    });
    return response.data;
  },

  /**
   * Fetches the Daily Activity bar chart data
   */
  getDailyActivityChart: async (period: string = '7d'): Promise<ChartData> => {
    const response = await api.get(`/api/v1/reports/analytics/charts/`, {
      params: { type: 'daily_activity', period }
    });
    return response.data;
  },

  /**
   * Fetches data for Application Status 
   */
  getApplicationStatusChart: async (period: string = '30d'): Promise<ChartData> => {
    const response = await api.get('/api/v1/reports/analytics/charts/', {
      params: { type: 'application_status', period }
    });
    return response.data;
  },

  /**
   * Fetches the overall summary for dashboard cards
   
   */
  getDashboardSummary: async (period: string = '30d') => {
    const response = await api.get('/api/v1/reports/analytics/summary/', {
      params: { period }
    });
    return response.data;
  },

  /**
   * Fetches available charts metadata
   */
  getAvailableCharts: async () => {
    const response = await api.get('/api/v1/reports/analytics/charts/available/');
    return response.data;
  }
};

export default analyticsApi;