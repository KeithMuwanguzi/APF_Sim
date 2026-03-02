import StatCard from "./statCard";
import { Stat } from "../../types/dashboard";

type StatsGridProps = {
  stats: Stat[];
};

function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          stat={stat}
          index={index}
        />
      ))}
    </div>
  );
}

export default StatsGrid;
