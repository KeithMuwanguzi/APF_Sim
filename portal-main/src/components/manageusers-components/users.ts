
export interface User {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Pending' | 'Expired' | 'Suspended';
    renewalDate: string;
  }
  
  export interface DashboardStats {
    totalUsers: number;
    pendingRenewals: number;
    expiredUsers: number;
  }