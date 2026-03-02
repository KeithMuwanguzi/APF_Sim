import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MembershipEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
 
  const [data, setData] = useState({
    hero: { title: '', description: '' },
    introText: '',
    requirements: '',
    processSteps: [] as any[], 
    callToAction: { title: '', buttonText: '', link: '' }
  });

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
     
      const res = await api.get('/membership-page?populate=*');
      const attr = res.data.data.attributes;
      setData({
        hero: attr.hero || { title: '', description: '' },
        introText: attr.introText || '',
        requirements: attr.requirements || '',
        processSteps: attr.processSteps || [],
        callToAction: attr.callToAction || { title: '', buttonText: '', link: '' }
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/membership-page', { data });
      alert("Membership Page updated successfully!");
    } catch (err) {
      alert("Failed to update page.");
    } finally {
      setSaving(false);
    }
  };

 
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...data.processSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setData({ ...data, processSteps: newSteps });
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Membership Schema...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-slate-900">Membership Page Editor</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#4a2885] transition-all disabled:opacity-50"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* HERO SECTION */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4">Hero Section</h2>
          <div className="space-y-4">
            <input 
              placeholder="Hero Title"
              className="w-full text-2xl font-bold border-b border-slate-100 focus:border-purple-500 outline-none pb-2"
              value={data.hero.title}
              onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})}
            />
            <textarea 
              placeholder="Hero Description"
              className="w-full p-3 bg-slate-50 rounded-xl text-sm text-slate-600"
              value={data.hero.description}
              onChange={(e) => setData({...data, hero: {...data.hero, description: e.target.value}})}
            />
          </div>
        </section>

        {/* REPEATABLE PROCESS STEPS */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-black text-purple-600 uppercase tracking-widest">Membership Steps</h2>
            <button 
              onClick={() => setData({...data, processSteps: [...data.processSteps, { title: '', description: '' }]})}
              className="text-[10px] font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-100 transition-colors"
            >
              + Add Step
            </button>
          </div>
          
          <div className="grid gap-4">
            {data.processSteps.map((step, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl flex gap-4 items-start">
                <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">{index + 1}</span>
                <div className="flex-1 space-y-2">
                  <input 
                    className="w-full bg-transparent font-bold text-slate-800 outline-none"
                    placeholder="Step Title"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                  />
                  <input 
                    className="w-full bg-transparent text-xs text-slate-500 outline-none"
                    placeholder="Brief description of this step"
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setData({...data, processSteps: data.processSteps.filter((_, i) => i !== index)})}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                ><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* INTRO TEXT (Richtext) */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4">Introduction Text</h2>
          <textarea 
            className="w-full h-40 p-4 bg-slate-50 rounded-2xl text-slate-700 text-sm border-none focus:ring-2 focus:ring-purple-200"
            value={data.introText}
            onChange={(e) => setData({...data, introText: e.target.value})}
          />
        </section>
      </div>
    </div>
  );
};

export default MembershipEditor;