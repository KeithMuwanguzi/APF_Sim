import { ChevronRight } from 'lucide-react';


interface RecentItemProps {
    title: string;
    subtitle: string;
    statusColor: string;
  }
  
  export const RecentItem = ({ title, subtitle, statusColor }: RecentItemProps) => (
    <div className="group flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`w-1.5 h-8 rounded-full shrink-0 ${statusColor}`} />
        <div className="truncate">
          <h4 className="text-[13px] font-bold text-slate-700 leading-tight truncate group-hover:text-indigo-600 transition-colors">{title}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{subtitle}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 translate-x-0 group-hover:translate-x-1 transition-all" />
    </div>
  );