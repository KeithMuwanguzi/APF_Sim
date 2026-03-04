import { useState } from 'react';
import api from '../../utils/cmsapi';
import { CMS_BASE_URL } from '../../config/api';
import { 
  MapPin, Video, Image as ImageIcon, 
  Clock, Save, ArrowLeft, Layers, Bookmark
} from 'lucide-react';

export const EventForm = ({ initialData, onSave, onCancel }: any) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'workshop',
    state: 'upcoming',
    isFeatured: false,
    image: null as any,
  });

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('files', file);

    try {
      setUploading(true);
      const res = await api.post('/upload', uploadData);
      
      setFormData({ ...formData, image: res.data[0] });
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFinalSave = () => {
    // data for Strapi (needs to be inside a 'data' object)
    const payload = {
      data: {
        ...formData,
      
        image: formData.image?.id || null,
      }
    };
    onSave(payload);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#5C32A3] transition">
          <ArrowLeft size={18} /> Back to Events
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleFinalSave}
            className="px-8 py-2.5 bg-[#5C32A3] text-white rounded-xl font-black text-sm shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <Save size={18} /> {initialData ? "Update Event" : "Publish Event"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Event Identity</label>
              <input 
                placeholder="e.g. Annual Members Conference 2026"
                className="w-full text-3xl font-black text-slate-800 outline-none border-b-2 border-transparent focus:border-purple-100 py-2"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Short Description</label>
              <textarea 
                placeholder="Describe what will happen at this event..."
                className="w-full h-32 bg-slate-50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-purple-100 text-slate-600 font-medium"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            {/* Category & Status Selection */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><Layers size={12}/> Category</label>
                 <select 
                   className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none border-none"
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                 >
                   <option value="conference">Conference</option>
                   <option value="workshop">Workshop</option>
                   <option value="seminar">Seminar</option>
                   <option value="Forum">Forum</option>
                   <option value="Networking">Networking</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><Bookmark size={12}/> Status</label>
                 <select 
                   className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none border-none"
                   value={formData.state}
                   onChange={(e) => setFormData({...formData, state: e.target.value})}
                 >
                   <option value="upcoming">Upcoming</option>
                   <option value="ongoing">Ongoing</option>
                   <option value="completed">Completed</option>
                   <option value="cancelled">Cancelled</option>
                 </select>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logistics Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-purple-500" /> Logistics
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase">Event Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <MapPin size={18} className="text-rose-500" />
                <input 
                  placeholder="Venue Address or Link"
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <label className="text-xs font-bold text-slate-600">Featured Event?</label>
                <input 
                  type="checkbox" 
                  checked={formData.isFeatured} 
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-5 h-5 accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Featured Image Upload */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Event Banner</label>
             <div className="relative h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group overflow-hidden">
                {formData.image?.url ? (
                  <img src={`${CMS_BASE_URL}${formData.image.url}`} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-300" size={32} />
                    <span className="text-[10px] font-black text-purple-600 mt-2 uppercase">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
