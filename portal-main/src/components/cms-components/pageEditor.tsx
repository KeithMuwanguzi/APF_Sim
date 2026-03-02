// pages/admin/PageEditor.tsx
import { useState } from 'react';
import { SectionEditor } from '../../components/cms-components/sectionBuilder';

export const PageEditor = ({ pageId }: { pageId: string }) => {
  // This state will eventually be filled by Strapi
  const [pageData, setPageData] = useState({
    hero_title: "Welcome to the Portal",
    hero_sub: "Managing your content made easy",
  });

  const updateField = (key: string, value: string) => {
    setPageData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
           <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Editing: {pageId}</h2>
           <p className="text-xs text-slate-400 font-bold">Live updates for the public website</p>
        </div>
        <button className="bg-[#5C32A3] text-white px-8 py-2 rounded-xl font-black shadow-lg shadow-purple-100 hover:scale-105 transition">
          PUBLISH CHANGES
        </button>
      </div>

      <SectionEditor 
        sectionTitle="Hero Section"
        fields={[
          { id: 'hero_title', label: 'Main Headline', type: 'text' },
          { id: 'hero_sub', label: 'Sub-headline', type: 'textarea' }
        ]}
        values={pageData}
        onUpdate={updateField}
      />
    </div>
  );
};