import { Eye,  Edit3,  TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  type: 'published' | 'draft';
}

export const MetricCard = ({ label, value, trend, isPositive, type }: MetricCardProps) => (
  <div className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
          {type === 'published' ? <Eye size={16} /> : <Edit3 size={16} />}
        </button>
      </div>
    </div>
    
    <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
      <span className={`p-0.5 rounded-full ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      </span>
      {trend}
    </div>
  </div>
);