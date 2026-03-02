import { ChevronRight, MoreHorizontal } from 'lucide-react';

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  viewAllLink?: string;
}



export const ManagementColumn = ({ title, icon, children }: ColumnProps) => (
  <div className="bg-[#f8fafc] rounded-3xl p-2 border border-slate-200/60 flex flex-col h-full">
    <div className="bg-white p-5 rounded-[22px] shadow-sm border border-slate-100 flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="space-y-3 flex-grow">
        {children}
      </div>

      <button className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-slate-100 text-slate-400 font-bold text-xs hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex justify-center items-center gap-2">
         View Full Registry <ChevronRight size={14} />
      </button>
    </div>
  </div>
);