import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { 
  Plus, Megaphone, FileEdit, Clock, 
  Eye, ChevronLeft, ChevronRight, Trash2, Send, Copy
} from 'lucide-react';
import { StatCard, Badge } from '../../components/comm-components/stats';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { announcementsApi } from '../../services/announcementsApi';

export default function CommunicationsDashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);
  
  const { announcements, stats, loading, refetch } = useAnnouncements({
    status: statusFilter,
    search: searchQuery,
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await announcementsApi.delete(id);
      refetch();
    } catch (error) {
      alert('Failed to delete announcement');
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('Are you sure you want to send this announcement now?')) return;
    
    try {
      await announcementsApi.send(id);
      refetch();
    } catch (error) {
      alert('Failed to send announcement');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await announcementsApi.duplicate(id);
      refetch();
    } catch (error) {
      alert('Failed to duplicate announcement');
    }
  };

  const formatAudience = (audience: string) => {
    const map: Record<string, string> = {
      'all_users': 'All Users',
      'members': 'Members',
      'applicants': 'Applicants',
      'admins': 'Admins',
      'expired_members': 'Expired Members',
    };
    return map[audience] || audience;
  };

  const formatChannel = (channel: string) => {
    const map: Record<string, string> = {
      'both': 'Both',
      'email': 'Email',
      'in_app': 'In-App',
    };
    return map[channel] || channel;
  };

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      'draft': 'Draft',
      'scheduled': 'Scheduled',
      'sent': 'Sent',
    };
    return map[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen">
     
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      
      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
        
        <Header title="Communications Dashboard" />

        
        <div className="flex-1 bg-[#F4F7FE] p-8">
          <div className="max-w-[1200px] mx-auto">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Communications</h1>
                <nav className="text-sm font-medium text-gray-400">
                  Admin Dashboard <span className="mx-1">&gt;</span> Communications
                </nav>
              </div>
              <button 
                onClick={() => navigate('/admin/create-announcement')}
                className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-purple-200 hover:bg-[#4A2882] transition-all"
              >
                <Plus size={20} strokeWidth={3} /> New Announcement
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Total Announcements" 
                value={stats?.total || 0} 
                subtext="All announcements created" 
                icon={Megaphone} 
                color="bg-purple-100 text-purple-600" 
              />
              <StatCard 
                title="Draft Announcements" 
                value={stats?.draft || 0} 
                subtext="Announcements in draft status" 
                icon={FileEdit} 
                color="bg-orange-50 text-orange-500" 
              />
              <StatCard 
                title="Scheduled Announcements" 
                value={stats?.scheduled || 0} 
                subtext="Scheduled for future delivery" 
                icon={Clock} 
                color="bg-green-50 text-green-500" 
              />
            </div>

            {/* Announcements Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-800">All Announcements</h2>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C32A3]"></div>
                  <p className="mt-4 text-gray-600">Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="p-12 text-center">
                  <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No announcements found</p>
                  <button
                    onClick={() => navigate('/admin/create-announcement')}
                    className="mt-4 text-[#5C32A3] hover:underline font-medium"
                  >
                    Create your first announcement
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Audience</th>
                        <th className="px-6 py-4">Channel</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Created By</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {announcements.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                          <td className="px-6 py-5 font-semibold text-gray-800 max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="px-6 py-5">
                            <Badge label={formatAudience(item.audience)} type="Audience" />
                          </td>
                          <td className="px-6 py-5">
                            <Badge label={formatChannel(item.channel)} type={item.channel} />
                          </td>
                          <td className="px-6 py-5">
                            <Badge label={formatStatus(item.status)} type={item.status} />
                          </td>
                          <td className="px-6 py-5 text-gray-600 font-medium">
                            {item.created_by_name}
                          </td>
                          <td className="px-6 py-5 text-gray-500 text-xs">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.status !== 'sent' && (
                                <button
                                  onClick={() => handleSend(item.id)}
                                  title="Send Now"
                                  className="p-1.5 text-gray-400 hover:text-green-600"
                                >
                                  <Send size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDuplicate(item.id)}
                                title="Duplicate"
                                className="p-1.5 text-gray-400 hover:text-blue-600"
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                onClick={() => navigate(`/admin/announcements/${item.id}`)}
                                title="View"
                                className="p-1.5 text-gray-400 hover:text-[#5C32A3]"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                                className="p-1.5 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination - can be enhanced later */}
              {!loading && announcements.length > 0 && (
                <div className="p-6 border-t border-gray-50 flex justify-center items-center gap-2">
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition">
                    <ChevronLeft size={18}/>
                  </button>
                  <button className="w-9 h-9 rounded-lg text-sm font-bold bg-[#5C32A3] text-white shadow-md">
                    1
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition">
                    <ChevronRight size={18}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <Footer />
      </main>
    </div>
  );
}