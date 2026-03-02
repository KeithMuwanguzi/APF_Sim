
import { ArticleStatus } from '../../components/createcms-components/newstypes';

export const StatusBadge = ({ status }: { status: ArticleStatus }) => {
  const themes = {
    Published: "bg-green-50 text-green-600 border-green-100",
    Draft: "bg-orange-50 text-orange-600 border-orange-100",
    Scheduled: "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${themes[status]}`}>
      {status}
    </span>
  );
};