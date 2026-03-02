interface StatsCardProps {
    title: string;
    value: string | number;
    trend: string;
    icon: React.ReactNode;
    isUrgent?: boolean;
  }
  
  const StatsCard = ({ title, value, trend, icon, isUrgent }: StatsCardProps) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
        <p className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${isUrgent ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {isUrgent && '⚠️ '}{trend}
        </p>
      </div>
      <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
        {icon}
      </div>
    </div>
  );
  export default StatsCard;