import React, { useState } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, X, 
  Type, Video, Paperclip, Trash2, 
  MoveUp, MoveDown, UploadCloud 
} from 'lucide-react';
import { NewsArticle, ContentBlock, BlockType, Category, ArticleStatus } from './newstypes';

interface ArticleFormProps {
  initialData?: Partial<NewsArticle>;
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

export const ArticleForm = ({ initialData, onSave, onCancel }: ArticleFormProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialData?.contentBlocks || [{ id: '1', type: 'text', value: '' }]);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [title, setTitle] = useState(initialData?.title || "");

  // --- Block Management ---
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, value: string, fileName?: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value, fileName } : b));
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newBlocks.length) {
      [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const handleFinalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      featuredImage,
      contentBlocks: blocks,
      status: (initialData?.status || 'Draft') as ArticleStatus,
      category: (initialData?.category || 'News') as Category,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-[#5C32A3] transition font-medium">
        <ArrowLeft size={18} /> Back to News
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        {/* Header Media */}
        <section className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Featured Image</label>
          <div className="relative h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group hover:border-purple-300 transition-colors">
            {featuredImage ? (
              <>
                <img src={featuredImage} className="w-full h-full object-cover" alt="Featured" />
                <button onClick={() => setFeaturedImage("")} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 transition"><X size={18}/></button>
              </>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto text-gray-300 mb-2" size={40} />
                <button type="button" onClick={() => setFeaturedImage("https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80")} className="text-purple-600 font-bold hover:underline">Upload Header Image</button>
              </div>
            )}
          </div>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=" title..." 
            className="w-full text-4xl font-black outline-none border-b-2 border-transparent focus:border-purple-100 py-2 placeholder:text-gray-200" 
          />
        </section>

        {/* Dynamic Canvas */}
        <div className="space-y-10 min-h-[300px]">
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative pl-8 border-l-2 border-transparent hover:border-purple-200 transition-all">
              {/* Floating Controls */}
              <div className="absolute -left-4 top-0 hidden group-hover:flex flex-col gap-1 bg-white border rounded-lg shadow-xl p-1 z-10">
                <button onClick={() => moveBlock(index, 'up')} className="p-1.5 hover:bg-gray-100 text-gray-500"><MoveUp size={14}/></button>
                <button onClick={() => moveBlock(index, 'down')} className="p-1.5 hover:bg-gray-100 text-gray-500"><MoveDown size={14}/></button>
                <button onClick={() => removeBlock(block.id)} className="p-1.5 hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
              </div>

              {/* Render Block Types */}
              {block.type === 'text' && (
                <textarea 
                  placeholder="Type content here..."
                  className="w-full min-h-[80px] outline-none text-lg text-gray-700 resize-none leading-relaxed placeholder:text-gray-300"
                  value={block.value}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-3">
                   <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                      {block.value ? <img src={block.value} className="w-full h-full object-cover" alt="Article Content" /> : <ImageIcon className="text-gray-200" size={60} />}
                   </div>
                   <input 
                    placeholder="Paste Image URL..." 
                    value={block.value}
                    className="text-xs w-full p-2 bg-gray-50 rounded border-none outline-none text-purple-600 font-mono" 
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                   />
                </div>
              )}

              {block.type === 'video' && (
                <div className="p-6 bg-slate-900 rounded-2xl flex items-center gap-6 text-white shadow-2xl">
                  <div className="p-4 bg-white/10 rounded-full"><Video size={28} /></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Video Link (YouTube / Vimeo)</p>
                    <input 
                      placeholder="https://youtube.com/watch?v=..." 
                      className="w-full bg-transparent border-b border-slate-700 outline-none pb-1 focus:border-purple-400 transition"
                      value={block.value}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                    />
                  </div>
                </div>
              )}

              {block.type === 'attachment' && (
                <div className="p-5 border-2 border-gray-100 rounded-2xl flex items-center justify-between bg-white hover:bg-purple-50/30 transition shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600"><Paperclip size={22} /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{block.fileName || "No file chosen"}</p>
                      <p className="text-xs text-gray-400 uppercase font-medium">Article Attachment</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => updateBlock(block.id, "file_url", "Guideline_2026.pdf")} className="px-4 py-2 bg-white border border-gray-200 text-xs font-black text-purple-600 rounded-lg hover:shadow-md transition">Upload</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Toolbar - Section Adder */}
        <div className="mt-12 p-6 bg-[#F4F2FE] rounded-3xl flex items-center justify-center gap-8 border border-purple-100 shadow-inner">
           <ToolbarButton icon={<Type size={20}/>} label="Text" onClick={() => addBlock('text')} />
           <ToolbarButton icon={<ImageIcon size={20}/>} label="Image" onClick={() => addBlock('image')} />
           <ToolbarButton icon={<Video size={20}/>} label="Video" onClick={() => addBlock('video')} />
           <ToolbarButton icon={<Paperclip size={20}/>} label="File" onClick={() => addBlock('attachment')} />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button onClick={onCancel} className="px-8 py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition">Discard Changes</button>
        <button onClick={handleFinalSave} className="px-10 py-3 bg-purple-700 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-800 transition transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
          <Save size={20} /> Save & Update Article
        </button>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }: any) => (
  <button 
    type="button"
    onClick={onClick} 
    className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-purple-700 transition group"
  >
    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);