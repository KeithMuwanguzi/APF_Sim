import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { ActionHeader } from '../../components/adminEvents/contentEditor';
import { LogisticsSidebar } from '../../components/adminEvents/logistics';

const EventCreatePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isVirtual: false,
    location: '',
  });

  const updateField = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#F4F2FE]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col`}>
        <Header title="Create Content" />

        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            
            <ActionHeader 
              onBack={() => navigate(-1)} 
              onPublish={() => alert("Connecting to Strapi...")} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                  <input 
                    type="text"
                    placeholder="Event Headline..."
                    className="w-full text-4xl font-black text-slate-900 outline-none border-none placeholder:text-slate-200 mb-8"
                    value={eventData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                  />
                  
                  <div className="h-[1px] w-full bg-slate-100 mb-8" />

                  <textarea 
                    placeholder="Write a detailed description of the event, agenda, and speakers..."
                    className="w-full h-[500px] bg-transparent text-slate-600 font-medium leading-relaxed outline-none resize-none text-lg"
                    value={eventData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>
              </div>

              {/* Sidebar Area */}
              <LogisticsSidebar 
                data={eventData} 
                onChange={updateField} 
              />

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default EventCreatePage;