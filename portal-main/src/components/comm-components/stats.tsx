export const Badge = ({ label, type }: { label: string; type: string }) => {
  const styles: Record<string, string> = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Draft: "bg-orange-100 text-orange-700",
    Email: "bg-emerald-50 text-emerald-600",
    "In-App": "bg-purple-50 text-purple-600",
    Both: "bg-amber-50 text-amber-600",
    Audience: "bg-indigo-50 text-indigo-600"
  };

  const colorClass = styles[label] || styles[type] || "bg-gray-100 text-gray-600";
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-4xl font-bold mt-2 text-gray-800">{value}</h3>
      <p className="text-xs text-gray-400 mt-2">{subtext}</p>
    </div>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);