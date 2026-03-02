interface AnalyticsProps {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
  }
  
  export const AnalyticsCard = ({ label, value, trend, isPositive }: AnalyticsProps) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <p className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wide">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className={`text-xs mt-2 font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? '↑' : '↓'} {trend} increase
      </p>
    </div>
  );