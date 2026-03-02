import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecentPayments, RecentPayment } from "../../services/dashboard";

function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      'mobile_money': 'Mobile Money',
      'credit_card': 'Credit Card',
      'bank_transfer': 'Bank Transfer',
    };
    return methodMap[method] || method;
  };

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Payments</h2>
        <Link to="/admin/payments" className="text-sm text-purple-600 hover:underline">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{payment.member_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPaymentMethod(payment.payment_method)} • {payment.payment_id}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatAmount(payment.amount)}</p>
                <span className="rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recent payments found</p>
        </div>
      )}
    </div>
  );
}

export default RecentPayments;