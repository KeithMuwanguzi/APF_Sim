import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { User } from '../components/manageusers-components/users';
import { getAccessToken } from '../utils/authStorage';

const getHeaders = () => ({
  'Authorization': `Bearer ${getAccessToken()}`,
  'Content-Type': 'application/json'
});

export const userManagementApi = {
  fetchMembers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/admin-management/members/`, {
      headers: getHeaders()
    });

   
    const rawData = response.data.results || [];

    return rawData.map((member: any) => ({
      id: member.id.toString(),
     
      name: member.full_name || member.email || "Unknown Member",
      email: member.email,
     
      status: member.membership_status === 'SUSPENDED' ? 'Suspended' : 'Active',
   
      renewalDate: member.subscription_due_date || 'N/A',
    }));
  },

  suspendMember: async (id: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/suspend/`, 
      { reason: "Administrative suspension" }, 
      { headers: getHeaders() }
    );
  },

  reactivateMember: async (id: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/reactivate/`, 
      {}, 
      { headers: getHeaders() }
    );
  },

  fetchMemberDocuments: async (userId: string) => {
    console.log(`[API] Fetching documents for user ${userId}`);
    console.log(`[API] URL: ${API_BASE_URL}/api/v1/documents/member-documents/${userId}/`);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/documents/member-documents/${userId}/`,
        { headers: getHeaders() }
      );
      console.log('[API] Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[API] Error fetching documents:', error);
      console.error('[API] Error response:', error.response?.data);
      throw error;
    }
  },

  updateDocumentStatus: async (documentId: string, status: string, feedback?: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/admin-review/`,
      { status, admin_feedback: feedback },
      { headers: getHeaders() }
    );
  }
};
