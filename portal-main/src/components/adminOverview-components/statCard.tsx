import { Stat, StatColor } from "../../types/dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  stat: Stat;
  index: number;
};

const colorMap: Record<
  StatColor,
  { bg: string; text: string }
> = {
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
};

function StatCard({ stat, index }: StatCardProps) {
  const colors = colorMap[stat.color];

  return (
    <div
      className="animate-slide-up rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Title + Icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {stat.title}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg}`}
        >
          <stat.icon className={`h-4 w-4 ${colors.text}`} />
        </div>
      </div>

      {/* Value */}
      <p className="mt-4 text-2xl font-semibold text-gray-900">
        {stat.value}
      </p>

      {/* Growth */}
      <div className="mt-2 flex items-center gap-1 text-sm">
          <span
          className={`flex items-center gap-1 font-medium ${
            stat.trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
           {stat.trend === "up" ? (
             <TrendingUp className="h-3 w-3" />
           ) : (
             <TrendingDown className="h-3 w-3" />
           )}
           {stat.percentage}
          </span>

          <span className="text-gray-400">
           {stat.period}
         </span>
      </div>   
    </div>
  );
}

export default StatCard;
