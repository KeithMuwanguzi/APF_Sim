import { useState, useEffect } from 'react';
import { Payment, DashboardStats } from '../components/payment-components/types'; 
import { API_BASE_URL } from '../config/api';

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

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/payments/dashboard/`);
      if (!response.ok) throw new Error('Failed to fetch payment data');
      
      const data = await response.json();
      
   
      if (data.recent_payments) setPayments(data.recent_payments);
      if (data.stats) setStats(data.stats);
      
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
