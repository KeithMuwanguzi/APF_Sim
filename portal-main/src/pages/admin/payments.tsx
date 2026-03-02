import { useState } from 'react';
import { 
  RotateCcw, 
  FileText, 
  Settings, 
  ChevronRight, 
  Hash, 
  Clock, 
  Banknote 
} from 'lucide-react';

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { usePayments } from '../../hooks/usepayment';
import { PaymentStatCard } from '../../components/payment-components/statcard';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { payments, stats, loading, error } = usePayments();

 
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
        <Header title="Payments Management" />

        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            {/* Title Section */}
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Payments Dashboard</h1>
              <p className="text-slate-500 mt-1">Monitor transactions, revenue trends, and payment statuses.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <PaymentStatCard 
                title="Total Transactions" 
                value={(stats?.total_transactions ?? 0).toLocaleString()} 
                change={stats?.growth_rates?.transactions || 0}
                icon={Hash}
                iconBg="bg-blue-600"
                color="border-blue-500" 
              />
              
              <PaymentStatCard 
                title="Pending Amount" 
                value={`UGX ${(stats?.pending_revenue ?? 0).toLocaleString()}`} 
                change={stats?.growth_rates?.pending || 0}
                icon={Clock}
                iconBg="bg-amber-500"
                color="border-yellow-500" 
              />

              <PaymentStatCard 
                title="Total Revenue" 
                value={`UGX ${(stats?.total_revenue ?? 0).toLocaleString()}`} 
                change={stats?.growth_rates?.revenue || 0}
                icon={Banknote}
                iconBg="bg-emerald-600"
                color="border-green-500" 
              />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <div className="lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <RotateCcw size={18} className="text-slate-400" /> Recent Transactions
                  </h2>
                  <button className="text-xs font-bold text-[#5E2590] hover:underline">View All</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal text-left">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 border-b border-gray-100">Member</th>
                        <th className="px-6 py-4 border-b border-gray-100">Description</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Amount</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="text-center py-12">
                            <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                          </td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors text-sm">
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-800">{p.member_name}</div>
                              <div className="text-[11px] text-gray-400">{p.member_email}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{p.description}</td>
                            <td className="px-6 py-4 font-black text-gray-800 text-right">
                              {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(p.status)}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
                  <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Settings size={18} className="text-slate-400" /> Quick Actions
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Process Refund', icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { label: 'Generate Report', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Payment Settings', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50' }
                    ].map((action, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                        <div className="flex items-center gap-3">
                          <div className={`${action.bg} ${action.color} p-2 rounded-lg`}>
                            <action.icon size={18} />
                          </div>
                          <span className="font-bold text-gray-700 text-sm">{action.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ManagePayments;