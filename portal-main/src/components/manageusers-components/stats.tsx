const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className={`p-6 rounded-lg shadow-md border-l-4 ${color} bg-white`}>
      <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
  export default StatCard;