import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { EventForm } from '../../components/cms-components/eventForm';
import { Plus, Calendar, MapPin, Trash2, Edit3, AlertCircle } from 'lucide-react';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const res = await api.get('/events?populate=image&sort=date:desc');
      
    
      const fetchedData = res.data.data || [];
      setEvents(fetchedData);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload: any) => {
    try {
      if (currentEvent && currentEvent.id) {
        // Update existing entry
        await api.put(`/events/${currentEvent.id}`, payload);
      } else {
        // Create new entry
        await api.post('/events', payload);
      }
      setIsEditing(false);
      fetchEvents(); // Refresh list after save
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed. Please check the console for details.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete the event.");
      }
    }
  };

  if (isEditing) {
    return (
      <EventForm 
        // Pass the object directly (no .attributes)
        initialData={currentEvent} 
        onSave={handleSave} 
        onCancel={() => {
          setIsEditing(false);
          setCurrentEvent(null);
        }} 
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Events Manager</h1>
          <p className="text-slate-500 font-medium">Create and manage public website events</p>
        </div>
        <button 
          onClick={() => {
            setCurrentEvent(null);
            setIsEditing(true);
          }}
          className="bg-[#5C32A3] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#4a2885] transition-all"
        >
          <Plus size={20} /> Create New Event
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400">Loading Events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-50 rounded-[32px] border border-dashed border-slate-200 py-20 flex flex-col items-center">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg">No events found</p>
          <p className="text-slate-400 text-sm">Start by creating your first event</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => {
            
            const item = event.attributes || event;
            const id = event.id;
            const imageUrl = item.image?.data?.attributes?.url || item.image?.url;

            return (
              <div key={id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                {/* Thumbnail */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {imageUrl ? (
                    <img 
                      src={`http://localhost:1337${imageUrl}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-purple-700 shadow-sm border border-purple-50">
                    {item.category || 'General'}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-1">{item.title}</h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <Calendar size={14} className="text-purple-500" /> 
                      {item.date ? new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date not set'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <MapPin size={14} className="text-rose-500" /> 
                      <span className="line-clamp-1">{item.location || 'Online/TBA'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => {
                        setCurrentEvent(event); // Pass full event object including ID
                        setIsEditing(true);
                      }}
                      className="flex-1 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 py-2.5 rounded-xl text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit3 size={14}/> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(id)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl text-rose-500 transition-all"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsManager;