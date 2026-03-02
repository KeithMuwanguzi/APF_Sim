import { API_V1_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  audience: 'all_users' | 'members' | 'applicants' | 'admins' | 'expired_members';
  channel: 'email' | 'in_app' | 'both';
  status: 'draft' | 'scheduled' | 'sent';
  created_by: number;
  created_by_name: string;
  created_by_email: string;
  created_at: string;
  updated_at: string;
  scheduled_for?: string;
  sent_at?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AnnouncementCreate {
  title: string;
  content: string;
  audience: string;
  channel: string;
  status: string;
  scheduled_for?: string;
  priority: string;
}

export interface AnnouncementStats {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
}

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const announcementsApi = {
  // Get all announcements with optional filters
  getAll: async (filters?: {
    status?: string;
    audience?: string;
    channel?: string;
    search?: string;
  }): Promise<Announcement[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.audience) params.append('audience', filters.audience);
    if (filters?.channel) params.append('channel', filters.channel);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = `${API_V1_BASE_URL}/notifications/announcements/${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch announcements');
    }
  },

  // Get announcement statistics
  getStats: async (): Promise<AnnouncementStats> => {
    try {
      const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/stats/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to fetch announcement stats:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch announcement stats');
    }
  },

  // Get single announcement
  getById: async (id: number): Promise<Announcement> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/${id}/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch announcement');
    }

    return response.json();
  },

  // Create new announcement
  create: async (data: AnnouncementCreate): Promise<Announcement> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create announcement';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || JSON.stringify(error);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Update announcement
  update: async (id: number, data: Partial<AnnouncementCreate>): Promise<Announcement> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update announcement');
    }

    return response.json();
  },

  // Delete announcement
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete announcement');
    }
  },

  // Send announcement immediately
  send: async (id: number): Promise<Announcement> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/${id}/send/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send announcement');
    }

    return response.json();
  },

  // Duplicate announcement
  duplicate: async (id: number): Promise<Announcement> => {
    const response = await fetch(`${API_V1_BASE_URL}/notifications/announcements/${id}/duplicate/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate announcement');
    }

    return response.json();
  },
};
