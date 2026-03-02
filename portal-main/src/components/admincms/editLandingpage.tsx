import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Layout, Quote, BarChart3, Building2, Plus, Trash2, Upload } from 'lucide-react';
import * as cms from '../../services/cmsApi';

const HomepageEditor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const chairFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const fetched = await cms.getHomepage();
      setData(fetched);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (media: any) => {
    if (!media) return null;
    const url = media.data?.attributes?.url || media.attributes?.url || media.url;
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (fileObject: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);
    setSaving(true);
    try {
      const response = await fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result[0]?.id) {
        callback(result[0]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setSaving(false);
    }
  };

  const prepareDataForStrapi = (item: any): any => {
    if (!item) return null;
    if (Array.isArray(item)) return item.map(prepareDataForStrapi);
    if (typeof item === 'object') {
      
      if (item.id && (item.url || item.attributes || item.mime)) return item.id;
      if (item.data && item.id) return item.id;

      const cleanObj: any = {};
      for (const key in item) {
        if (['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'formats', 'hash', 'ext', 'mime', 'size', 'previewUrl', 'provider', 'provider_metadata'].includes(key)) continue;
        cleanObj[key] = prepareDataForStrapi(item[key]);
      }
      return cleanObj;
    }
    return item;
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const attr = data.attributes || data;
      const payload = prepareDataForStrapi(attr);
      await cms.updateHomepage(payload);
      alert("SUCCESS! Published.");
      loadData();
    } catch (err: any) {
      console.error("Save Error:", err.response?.data);
      alert(`Error: ${err.response?.data?.error?.message || "Check Console"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black">SYNCING CONTENT...</div>;
  const attr = data.attributes || data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="group flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-2 pr-4 rounded-full transition-all">
            <div className="bg-white p-1 rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={18} className="text-slate-900"/>
            </div>
            <span className="text-xs font-bold text-slate-600">DASHBOARD</span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <h1 className="font-black text-slate-800 tracking-tight text-xl">HOMEPAGE EDITOR</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-[#5C32A3] hover:bg-[#4A2882] text-white px-8 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-purple-200 disabled:opacity-50">
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
          PUBLISH CHANGES
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-12 space-y-10 px-6">
        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Layout size={14}/> Hero Header
            </div>
            <div className="w-40 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group cursor-pointer" onClick={() => heroFileRef.current?.click()}>
              {attr.hero?.backgroundImage ? <img src={getImageUrl(attr.hero.backgroundImage)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-400"><Upload size={20} /></div>}
            </div>
            <input type="file" ref={heroFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (file) => setData({...data, attributes: {...attr, hero: {...attr.hero, backgroundImage: file}}}))}/>
          </div>
          <input className="w-full text-4xl font-black outline-none mb-4" value={attr.hero?.title || ""} onChange={(e) => setData({...data, attributes: {...attr, hero: {...attr.hero, title: e.target.value}}})} />
          <textarea className="w-full text-lg text-slate-500 outline-none h-24 resize-none leading-relaxed" value={attr.hero?.subtitle || ""} onChange={(e) => setData({...data, attributes: {...attr, hero: {...attr.hero, subtitle: e.target.value}}})} />
        </div>

        {/* STATS SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14}/> Impact Statistics
            </div>
            <button onClick={() => setData({...data, attributes: {...attr, stats: [...(attr.stats || []), { value: "0", label: "New Label" }]}})} className="text-emerald-600 flex items-center gap-1 text-xs font-bold hover:bg-emerald-50 px-3 py-1 rounded-lg"><Plus size={14}/> ADD STAT</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {attr.stats?.map((s: any, i: number) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border flex flex-col relative group">
                <button onClick={() => setData({...data, attributes: {...attr, stats: attr.stats.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                <input className="w-full text-2xl font-black text-emerald-600 bg-transparent outline-none" value={s.value} onChange={(e) => { const next = [...attr.stats]; next[i].value = e.target.value; setData({...data, attributes: {...attr, stats: next}}); }} />
                <input className="w-full text-[10px] font-bold text-slate-400 bg-transparent outline-none uppercase" value={s.label} onChange={(e) => { const next = [...attr.stats]; next[i].label = e.target.value; setData({...data, attributes: {...attr, stats: next}}); }} />
              </div>
            ))}
          </div>
        </div>

        {/* CHAIRPERSON SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Quote size={14}/> Leadership Message
            </div>
            <div className="relative group cursor-pointer" onClick={() => chairFileRef.current?.click()}>
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                {attr.chairMessage?.photo ? <img src={getImageUrl(attr.chairMessage.photo)} className="w-full h-full object-cover" /> : <Upload size={20} className="text-slate-400" />}
              </div>
              <input type="file" ref={chairFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (file) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, photo: file}}}))}/>
            </div>
          </div>
          <input className="w-full text-2xl font-black outline-none mb-2" value={attr.chairMessage?.name || ""} onChange={(e) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, name: e.target.value}}})} />
          <textarea className="w-full bg-slate-50 p-6 rounded-2xl outline-none h-48 resize-none text-slate-600" value={attr.chairMessage?.fullMessage || ""} onChange={(e) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, fullMessage: e.target.value}}})} />
        </div>

        {/* PARTNER LOGOS */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Building2 size={14}/> Partner Logos
            </div>
            <button onClick={() => setData({...data, attributes: {...attr, partnerlogo: [...(attr.partnerlogo || []), { name: "", logo: null }]}})} className="text-slate-600 flex items-center gap-1 text-xs font-bold hover:bg-slate-100 px-3 py-1 rounded-lg"><Plus size={14}/> ADD LOGO</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(attr.partnerlogo || []).map((p: any, i: number) => (
              <div key={i} className="group relative border rounded-xl p-2 bg-slate-50/50">
                <div className="w-full h-20 bg-white rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center p-2 relative overflow-hidden">
                    {p.logo ? (
                      <>
                        <img src={getImageUrl(p.logo)} className="max-w-full max-h-full object-contain" />
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                          <Upload size={14} className="text-white"/>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (file) => {
                               const next = [...attr.partnerlogo]; next[i].logo = file;
                               setData({...data, attributes: {...attr, partnerlogo: next}});
                          })}/>
                        </label>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload size={16} className="text-slate-300"/>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (file) => {
                             const next = [...attr.partnerlogo]; next[i].logo = file;
                             setData({...data, attributes: {...attr, partnerlogo: next}});
                        })}/>
                      </label>
                    )}
                </div>
                <input className="w-full mt-1 text-[10px] font-bold text-center outline-none bg-transparent" placeholder="NAME" value={p.name || ""} onChange={(e) => {
                  const next = [...attr.partnerlogo]; next[i].name = e.target.value;
                  setData({...data, attributes: {...attr, partnerlogo: next}});
                }} />
                <button onClick={() => setData({...data, attributes: {...attr, partnerlogo: attr.partnerlogo.filter((_:any, idx:number) => idx !== i)}})} className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all border border-slate-100"><Trash2 size={12}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageEditor;