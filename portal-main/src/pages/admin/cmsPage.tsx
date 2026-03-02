import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { 
  Plus, Newspaper, Calendar, 
  Layout, Info, Phone, Settings,
  Users, Lightbulb, Eye, Edit3
} from 'lucide-react';

interface PageCardProps {
  title: string;
  icon: React.ReactNode;
  desc: string;
  onClick: () => void;
}

const PageCard = ({ title, icon, desc, onClick }: PageCardProps) => (
  <button 
    onClick={onClick}
    className="group relative bg-white p-6 rounded-3xl border border-slate-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 text-left overflow-hidden font-['Plus_Jakarta_Sans']"
  >
    <div className="flex items-start justify-between relative z-10">
      <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-[#5C32A3] group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1 text-[10px] font-black text-purple-600 uppercase tracking-widest">
        <Edit3 size={12} /> Edit Page
      </div>
    </div>
    <div className="mt-5 relative z-10">
      <h3 className="font-black text-slate-800 text-base tracking-tight group-hover:text-[#5C32A3] transition-colors">
        {title}
      </h3>
      <p className="text-[12px] text-slate-400 font-bold mt-1.5 leading-snug">
        {desc}
      </p>
    </div>
    
    <div className="absolute -right-6 -bottom-6 text-slate-100 opacity-20 group-hover:opacity-40 transition-opacity scale-150 rotate-12">
        {icon}
    </div>
  </button>
);

const CmsContentPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-purple-100 selection:text-[#5C32A3] bg-[#FDFDFF]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen`}>
        <Header title="CMS Control Center" />

        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl font-[800] text-slate-900 tracking-tight">Portal Management</h1>
                <p className="text-slate-400 mt-2 text-sm font-bold">Live content control for the APF public website</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="bg-[#5C32A3] hover:bg-[#4a2885] text-white px-8 py-3.5 rounded-[20px] flex items-center gap-3 text-sm font-black shadow-2xl shadow-purple-200 transition-all active:scale-95"
                >
                  <Plus size={20} strokeWidth={3} /> Create Content
                </button>

                {showCreateMenu && (
                  <div className="absolute right-0 mt-4 w-72 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => navigate('/admin/NewsMgt')} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-[18px] transition-colors text-left group">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all"><Newspaper size={20}/></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">News Article</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Public News Feed</p>
                      </div>
                    </button>
                    <button onClick={() => navigate('/admin/eventMgt')} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-[18px] transition-colors text-left group">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all"><Calendar size={20}/></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Event Entry</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Public Events Page</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Structure Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <h2 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-3">
                   Website Structure
                </h2>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#5C32A3] bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  <Eye size={14} /> Live Preview
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PageCard 
                  title="Landing Page" 
                  icon={<Layout size={24}/>} 
                  desc="Main entrance, Hero banners, and Value propositions" 
                  onClick={() => navigate('/editLandingpage')} 
                />
                <PageCard 
                  title="Membership" 
                  icon={<Users size={24}/>} 
                  desc="Tiers, benefits, and registration workflow" 
                  onClick={() => navigate('/editMembership')} 
                />
                 <PageCard 
                  title="Insights" 
                  icon={<Lightbulb size={24}/>} 
                  desc="Research, News archives, and Data reports" 
                  onClick={() => navigate('/admin/edit-page/insights')} 
                />
                <PageCard 
                  title="About Us" 
                  icon={<Info size={24}/>} 
                  desc="Our history, mission, and leadership team" 
                  onClick={() => navigate('/editAbout')} 
                />
                <PageCard 
                  title="Contact Us" 
                  icon={<Phone size={24}/>} 
                  desc="Location details, Map settings, and Inquiries" 
                  onClick={() => navigate('/admin/edit-page/contact')} 
                />
                <PageCard 
                  title="Site Config" 
                  icon={<Settings size={24}/>} 
                  desc="Global Branding, SEO, and Navigation" 
                  onClick={() => navigate('/admin/settings')} 
                />
              </div>
            </section>

          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default CmsContentPage;