import { Type, AlignLeft, ImageIcon, Link as LinkIcon } from 'lucide-react';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'url';
  placeholder?: string;
}

interface SectionEditorProps {
  sectionTitle: string;
  fields: Field[];
  values: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
}

export const SectionEditor = ({ sectionTitle, fields, values, onUpdate }: SectionEditorProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-black text-[#5C32A3] uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          {sectionTitle}
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {fields.length} Editable Fields
        </span>
      </div>

      {/* Fields Container */}
      <div className="p-8 space-y-8">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              {field.type === 'text' && <Type size={14} className="text-slate-400" />}
              {field.type === 'textarea' && <AlignLeft size={14} className="text-slate-400" />}
              {field.type === 'image' && <ImageIcon size={14} className="text-slate-400" />}
              {field.type === 'url' && <LinkIcon size={14} className="text-slate-400" />}
              <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                {field.label}
              </label>
            </div>

            {/* Render Text Input */}
            {field.type === 'text' && (
              <input
                type="text"
                value={values[field.id] || ''}
                onChange={(e) => onUpdate(field.id, e.target.value)}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-medium text-slate-700"
              />
            )}

            {/* Render Textarea */}
            {field.type === 'textarea' && (
              <textarea
                rows={4}
                value={values[field.id] || ''}
                onChange={(e) => onUpdate(field.id, e.target.value)}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all font-medium text-slate-700 resize-none"
              />
            )}

            {/* Render Image Uploader Placeholder */}
            {field.type === 'image' && (
              <div className="relative group">
                <div className="h-44 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:border-purple-300 group-hover:bg-purple-50/30 overflow-hidden">
                  {values[field.id] ? (
                    <>
                      <img src={values[field.id]} alt={field.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button 
                          onClick={() => onUpdate(field.id, '')} 
                          className="px-4 py-2 bg-white text-red-600 rounded-lg text-xs font-bold shadow-xl"
                        >
                          Remove Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="p-3 bg-white rounded-full shadow-sm w-fit mx-auto mb-3 text-slate-400 group-hover:text-purple-500 transition-colors">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-500">Click to upload {field.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                      {/* In a real scenario, this would trigger a file input or Strapi Media Library */}
                      <button 
                        onClick={() => onUpdate(field.id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800')} 
                        className="mt-3 text-[10px] font-black text-purple-600 uppercase hover:underline"
                      >
                        Select from Media Library
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};