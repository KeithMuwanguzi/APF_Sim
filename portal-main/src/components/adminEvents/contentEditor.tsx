import { ArrowLeft, Save, Globe } from 'lucide-react';

export const ActionHeader = ({ onPublish, onBack }: any) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 font-sans">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-purple-700 transition">
      <ArrowLeft size={16} /> Discard & Return
    </button>
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
        <Globe size={14} />
        <span className="text-[10px] font-black uppercase tracking-tighter">Public Visibility</span>
      </div>
      <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition">
        Save Draft
      </button>
      <button onClick={onPublish} className="px-8 py-2.5 bg-[#5C32A3] text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-200 hover:scale-105 transition flex items-center gap-2">
        <Save size={18} /> Publish Event
      </button>
    </div>
  </div>
);