import { useState, useEffect } from 'react';
import { Payment, DashboardStats } from '../components/payment-components/types'; 
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const [stats, setStats] = useState<DashboardStats>({
    total_transactions: 0,
    pending_revenue: 0,
    total_revenue: 0,
    growth_rates: {
      transactions: 0,
      pending: 0,
      revenue: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Fetch statistics and recent payments in parallel
      const [statsRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/applications/statistics/`, { headers }),
        fetch(`${API_BASE_URL}/api/v1/applications/recent-payments/?limit=10`, { headers }),
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch payment statistics');
      if (!paymentsRes.ok) throw new Error('Failed to fetch recent payments');

      const statsData = await statsRes.json();
      const paymentsData = await paymentsRes.json();

      // Map backend statistics to DashboardStats shape
      setStats({
        total_transactions: statsData.paid_applications || 0,
        pending_revenue: (statsData.pending_applications || 0) * 50000,
        total_revenue: statsData.total_revenue || 0,
        growth_rates: {
          transactions: statsData.trends?.paid_change || 0,
          pending: statsData.trends?.pending_change || 0,
          revenue: statsData.trends?.revenue_change || 0,
        },
      });

      // Map backend payments to Payment shape
      const mappedPayments: Payment[] = (paymentsData || []).map((p: any) => ({
        id: p.id,
        member_name: p.member_name || '',
        member_email: p.member_email || '',
        description: `Membership Fee (${p.payment_method || 'N/A'})`,
        amount: p.amount || 0,
        currency: 'UGX',
        status: p.status || 'unknown',
      }));
      setPayments(mappedPayments);

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return { payments, stats, loading, error, refresh: fetchPayments };
};
