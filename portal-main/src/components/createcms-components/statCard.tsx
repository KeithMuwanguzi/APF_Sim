
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  Icon: LucideIcon;
}

export const StatCard = ({ title, value, change, isUp, Icon }: StatCardProps) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className="p-2 bg-purple-50 rounded-lg">
        <Icon size={20} className="text-purple-600" />
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="flex items-center gap-1 text-sm">
      <span className={isUp ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
        {isUp ? '↑' : '↓'} {change}
      </span>
      <span className="text-gray-400">vs last month</span>
    </div>
  </div>
);