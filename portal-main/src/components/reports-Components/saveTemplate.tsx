
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface SaveTemplateModalProps {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  isSaving: boolean;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Save as Template</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Name</label>
            <input 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5E2590] outline-none"
              placeholder="e.g., Monthly Membership Audit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-[#5E2590] outline-none"
              placeholder="Describe what this report is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 bg-slate-50 rounded-b-xl flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-bold text-sm">Cancel</button>
          <button 
            disabled={!name || isSaving}
            onClick={() => onSave(name, description)}
            className="flex-1 bg-[#5E2590] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : <><Save size={16}/> Save Template</>}
          </button>
        </div>
      </div>
    </div>
  );
};