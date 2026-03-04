import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CMS_BASE_URL } from '../../config/api';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState({
    vision: '',
    mission: '',
    history: '',
    objectives: [] as any[],
    hero: { 
      title: '', 
      description: '', 
      backgroundImage: null as any 
    }
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      
      const res = await api.get('/about-page?populate[hero][populate]=*&populate[objectives][populate]=*');
      const attr = res.data.data.attributes;
      
      setData({
        vision: attr.vision || '',
        mission: attr.mission || '',
        history: attr.history || '',
        objectives: attr.objectives || [],
        hero: {
          title: attr.hero?.title || '',
          description: attr.hero?.description || '',
          backgroundImage: attr.hero?.backgroundImage?.data?.attributes || null
        }
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      setSaving(true);
      const uploadRes = await api.post('/upload', formData);
      const imageId = uploadRes.data[0].id;
      const imageUrl = uploadRes.data[0].url;

      
      setData({
        ...data,
        hero: { ...data.hero, backgroundImage: { id: imageId, url: imageUrl } }
      });
      alert("Image uploaded! Remember to Save Changes to commit.");
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      
      const payload = {
        ...data,
        hero: {
          ...data.hero,
          backgroundImage: data.hero.backgroundImage?.id || null 
        }
      };
      
      await api.put('/about-page', { data: payload });
      alert("About Page updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateObjective = (index: number, field: string, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    setData({ ...data, objectives: newObjectives });
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading About Content...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/governance')} // Redirect to Leadership Manager
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
          >
            <Users size={18} /> Manage Governance
          </button>
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
        {/* HERO SECTION WITH IMAGE */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Hero Section & Image</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
               <input 
                placeholder="Hero Title"
                className="w-full text-xl font-bold border-b border-slate-100 focus:border-purple-500 outline-none pb-2"
                value={data.hero.title}
                onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})}
              />
              <textarea 
                placeholder="Hero Subtitle"
                className="w-full p-3 bg-slate-50 rounded-xl text-sm text-slate-600 h-24"
                value={data.hero.description}
                onChange={(e) => setData({...data, hero: {...data.hero, description: e.target.value}})}
              />
            </div>
            <div className="w-full md:w-64">
              <div className="relative group aspect-video md:aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {data.hero.backgroundImage?.url ? (
                  <img 
                    src={`${CMS_BASE_URL}${data.hero.backgroundImage.url}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-center mt-2 font-bold text-slate-400">CLICK TO CHANGE HERO IMAGE</p>
            </div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Vision</h2>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-purple-100"
              value={data.vision}
              onChange={(e) => setData({...data, vision: e.target.value})}
            />
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Mission</h2>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-purple-100"
              value={data.mission}
              onChange={(e) => setData({...data, mission: e.target.value})}
            />
          </section>
        </div>

        {/* HISTORY */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Our History</h2>
          <textarea 
            className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[200px] outline-none focus:ring-2 focus:ring-purple-100"
            value={data.history}
            onChange={(e) => setData({...data, history: e.target.value})}
            placeholder="Write the organization history here (Markdown supported)"
          />
        </section>

        {/* OBJECTIVES */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-black text-purple-600 uppercase">Strategic Objectives</h2>
            <button 
              onClick={() => setData({...data, objectives: [...data.objectives, { title: '', description: '' }]})}
              className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100"
            >
              <Plus size={14} className="inline mr-1"/> Add Objective
            </button>
          </div>
          
          <div className="space-y-4">
            {data.objectives.map((obj, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl flex gap-4 items-start border border-slate-100">
                <div className="flex-1 space-y-3">
                  <input 
                    className="w-full bg-white px-3 py-2 rounded-lg font-bold text-slate-800 border-none outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="Objective Title"
                    value={obj.title}
                    onChange={(e) => updateObjective(index, 'title', e.target.value)}
                  />
                  <textarea 
                    className="w-full bg-white px-3 py-2 rounded-lg text-xs text-slate-500 border-none outline-none min-h-[60px] focus:ring-2 focus:ring-purple-100"
                    placeholder="Brief description"
                    value={obj.description}
                    onChange={(e) => updateObjective(index, 'description', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setData({...data, objectives: data.objectives.filter((_, i) => i !== index)})}
                  className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                ><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPageEditor;
