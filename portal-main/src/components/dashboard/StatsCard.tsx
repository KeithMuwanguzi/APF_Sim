import { FC } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  direction?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, change, direction, icon }) => {
  // Determine direction based on change value if not explicitly provided
  const actualDirection = direction || (change > 0 ? "up" : change < 0 ? "down" : "neutral");
  
  const arrow = actualDirection === "up" ? "↑" : actualDirection === "down" ? "↓" : "→";
  const changeColor = actualDirection === "up" 
    ? "text-green-600" 
    : actualDirection === "down" 
    ? "text-red-600" 
    : "text-gray-600";

  const formatChange = (changeValue: number) => {
    if (changeValue === 0) return "No change";
    const absChange = Math.abs(changeValue);
    return `${absChange}%`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 h-32 flex flex-col justify-between relative">
      {/* Icon */}
      <div className="absolute top-3 right-3 text-xl text-[#5f2f8b]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h3>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>

      {/* Change */}
      <span className={`text-xs mt-1 ${changeColor}`}>
        {arrow} {formatChange(change)} from last month
      </span>
    </div>
  );
};

export default StatsCard;