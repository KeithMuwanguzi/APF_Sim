
import { Calendar, Clock, Video, MapPin, Sparkles } from 'lucide-react';

export const LogisticsSidebar = ({ data, onChange }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 font-sans">
    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
      <Sparkles size={18} className="text-purple-500" /> Logistics
    </h3>

    {/* Date Pickers */}
    <div className="space-y-4">
      {['startDate', 'endDate'].map((field) => (
        <div key={field} className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
            {field === 'startDate' ? 'Starts' : 'Ends'}
          </label>
          <div className="relative">
            {field === 'startDate' ? <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} /> : <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />}
            <input 
              type="datetime-local" 
              className="w-full bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
              onChange={(e) => onChange(field, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Venue Logic */}
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => onChange('isVirtual', false)}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${!data.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
        >PHYSICAL</button>
        <button 
          onClick={() => onChange('isVirtual', true)}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${data.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
        >VIRTUAL</button>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {data.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
        </div>
        <input 
          placeholder={data.isVirtual ? "Meeting Link" : "Venue Address"}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
      </div>
    </div>
  </div>
);