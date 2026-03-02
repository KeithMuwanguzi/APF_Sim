import { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, Edit3, Clock, 
  Search, Plus, ArrowLeft, Trash2, Image as ImageIcon 
} from 'lucide-react';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { NewsArticle, ArticleStatus } from '../../components/createcms-components/newstypes';
import { StatCard } from '../../components/createcms-components/statCard';
import { StatusBadge } from '../../components/createcms-components/status';
import { ArticleForm } from '../../components/createcms-components/article';
import { requireAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const INITIAL_DATA: NewsArticle[] = [
  { 
    id: '1', 
    title: 'New Community Guidelines Released', 
    subtitle: 'Updated financial community standards for 2026', 
    category: 'News', 
    status: 'Published', 
    publishDate: '2026-01-24', 
    views: '1,248',
    featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    contentBlocks: [{ id: 'b1', type: 'text', value: 'This is the start of the article...' }]
  }
];

const NewsManagement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | undefined>();
  const [filter, setFilter] = useState<ArticleStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    requireAdmin();
  }, []);

  const handleSave = (data: Partial<NewsArticle>) => {
    if (selectedArticle) {
      setArticles(articles.map(a => a.id === selectedArticle.id ? { ...a, ...data } as NewsArticle : a));
    } else {
      const newArt: NewsArticle = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        publishDate: data.status === 'Published' ? new Date().toISOString().split('T')[0] : null,
        views: '0',
        contentBlocks: data.contentBlocks || []
      } as NewsArticle;
      setArticles([newArt, ...articles]);
    }
    setIsEditing(false);
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'All' || a.status === filter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="News Management" />
        

        <div className="flex-1 bg-[#F4F2FE] p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* Back Button Fix */}
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-[#5C32A3] font-bold text-xs uppercase tracking-widest transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Back to Portal
            </button>
            
            {isEditing ? (
              <ArticleForm initialData={selectedArticle} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-[#5C32A3]">Manage News</h1>
                    <p className="text-slate-500 mt-1">Create News for your platform community.</p>
                  </div>
                  <div className="flex gap-3">
                    
                    <button 
                      onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} 
                      className="flex items-center gap-2 px-6 py-2.5 bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition text-sm font-black shadow-lg shadow-purple-200"
                    >
                      <Plus size={18} /> Create News
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard title="Stories" value={articles.length.toString()} change="10%" isUp={true} Icon={FileText} />
                  <StatCard title="Live" value={articles.filter(a=>a.status==='Published').length.toString()} change="12%" isUp={true} Icon={CheckCircle} />
                  <StatCard title="Drafts" value={articles.filter(a=>a.status==='Draft').length.toString()} change="2%" isUp={false} Icon={Edit3} />
                  <StatCard title="Waitlist" value={articles.filter(a=>a.status==='Scheduled').length.toString()} change="5%" isUp={true} Icon={Clock} />
                </div>

                {/* List Container */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                      <div className="flex bg-gray-100/50 p-1.5 rounded-2xl">
                        {['All', 'Published', 'Draft', 'Scheduled'].map((t) => (
                          <button key={t} onClick={() => setFilter(t as any)} className={`px-5 py-2 text-xs font-black rounded-xl transition ${filter === t ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}>{t}</button>
                        ))}
                      </div>
                      <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input placeholder="Search stories..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium" />
                      </div>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <tr>
                            <th className="px-8 py-5 text-left">Article Overview</th>
                            <th className="px-8 py-5 text-center">Engagement</th>
                            <th className="px-8 py-5 text-left">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50/40 transition group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-5">
                                  <div className="w-16 h-12 rounded-xl bg-gray-100 border overflow-hidden shadow-inner flex-shrink-0">
                                    {article.featuredImage ? <img src={article.featuredImage} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-gray-200"/></div>}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-gray-900 text-sm">{article.title}</h4>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{article.category} • {article.publishDate || 'Not Live'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-center">
                                <span className="text-xs font-black text-gray-700">{article.views} Views</span>
                              </td>
                              <td className="px-8 py-5"><StatusBadge status={article.status} /></td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-2.5 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"><Edit3 size={18} /></button>
                                  <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto"><Footer /></div>
      </main>
    </div>
  );
};

export default NewsManagement;