export interface DashboardStats {
  total_transactions: number;
  pending_revenue: number;
  total_revenue: number;
  growth_rates: {
    transactions: number;
    pending: number;
    revenue: number;
  };
}

export interface Payment {
  id: string | number;
  member_name: string;
  member_email: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
}