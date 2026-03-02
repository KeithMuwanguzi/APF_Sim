import React, { useState } from 'react';
import { 
  Users, Eye, Download, FileText, BarChart3, 
  ShieldCheck, TrendingUp, DollarSign, Calendar, 
  Loader2, CheckCircle2 
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { analyticsApi, ReportTemplate } from '../../services/analyticsApi';

interface ReportCardProps {
  template?: ReportTemplate;
  title?: string;
  date?: string;
  description?: string;
  onView?: () => void;
  onSuccess?: () => void; 
}

const ReportsCard: React.FC<ReportCardProps> = ({ 
  template,
  title: propTitle, 
  date: propDate, 
  description: propDescription, 
  onView,
  onSuccess
}) => {
  const { analytics } = useAnalytics();
  const [isGenerating, setIsGenerating] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  
  const title = template ? template.name : propTitle || 'Report';
  const description = template ? template.description : propDescription || '';
  const date = propDate || (template ? new Date(template.created_at).toLocaleDateString() : 'Recent');
  
  const getIcon = () => {
    const reportType = template ? template.report_type : title.toLowerCase();
    if (reportType.includes('membership')) return <Users className="w-5 h-5" />;
    if (reportType.includes('financial')) return <DollarSign className="w-5 h-5" />;
    if (reportType.includes('event')) return <Calendar className="w-5 h-5" />;
    if (reportType.includes('compliance')) return <ShieldCheck className="w-5 h-5" />;
    if (reportType.includes('growth')) return <TrendingUp className="w-5 h-5" />;
    if (reportType.includes('application')) return <FileText className="w-5 h-5" />;
    return <BarChart3 className="w-5 h-5" />;
  };

 
  const getChartData = (): number[] => {
    
    if (template?.chart_configs?.preview_data) {
      return template.chart_configs.preview_data as number[];
    }
    
    
    if (template?.report_type === 'membership' && analytics?.membership?.growth?.data) {
      const growthData = analytics.membership.growth.data;
      
     
      return growthData.length > 0 
        ? growthData.slice(-6) 
        : [0, 0, 0, 0, 0, 0];
    }

   
    if (template?.report_type === 'applications' && analytics?.applications?.status_breakdown?.data) {
        return analytics.applications.status_breakdown.data;
    }
    
    
    return [30, 45, 35, 60, 40, 50]; 
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData, 1);

  const handleGenerateRequest = async () => {
    if (!template?.id) return;
    
    setIsGenerating(true);
    try {
      await analyticsApi.generateReport(
        template.id,
        `${template.name} - ${new Date().toLocaleDateString()}`,
        template.output_format
      );

      setJustFinished(true);
      if (onSuccess) onSuccess(); // Refreshes the "Recently Generated" list
      
      setTimeout(() => setJustFinished(false), 3000);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to start report generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md hover:border-indigo-100 transition-all group">
      <div className="flex justify-between items-start mb-4 gap-x-4"> 
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-indigo-50 text-[#5E2590] rounded-xl group-hover:bg-[#5E2590] group-hover:text-white transition-colors shrink-0">
            {getIcon()}
          </div>
          <div className="truncate">
            <h3 className="font-bold text-slate-800 text-[15px] leading-tight truncate">
              {title}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {template?.output_format?.toUpperCase() || 'PDF'} • {date}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-[12px] text-slate-500 leading-relaxed mb-6 line-clamp-2 min-h-[32px]">
        {description}
      </p>

      {/* Mini Chart Visualization */}
      <div className="flex items-end gap-1.5 h-14 mb-6 px-1">
        {chartData.map((val: number, i: number) => (
          <div 
            key={i} 
            className="flex-1 bg-indigo-100 rounded-t-md group-hover:bg-indigo-200 transition-colors" 
            style={{ height: `${(val / maxValue) * 100}%` }}
          >
            <div className="w-full h-full bg-[#5E2590] rounded-t-md opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <button 
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 text-[11px] font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
        >
          <Eye size={14} strokeWidth={2.5} /> 
          <span>Preview</span>
        </button>
        
        <button 
          onClick={handleGenerateRequest}
          disabled={isGenerating || !template}
          className={`flex-1 flex items-center justify-center gap-2 text-white text-[11px] font-bold py-3 rounded-xl transition-all shadow-sm ${
            justFinished 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-[#5E2590] hover:bg-[#4a1d72] shadow-indigo-100'
          }`}
        >
          {isGenerating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : justFinished ? (
            <CheckCircle2 size={14} />
          ) : (
            <Download size={14} strokeWidth={2.5} />
          )}
          <span>{isGenerating ? 'Processing...' : justFinished ? 'Queued' : 'Generate'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsCard;