import { Announcement } from './types';

const AnnouncementTable = ({ data }: { data: Announcement[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Audience</th>
            <th className="px-6 py-4">Channel</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created By</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-indigo-900">{item.title}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 font-medium">
                  {item.audience}
                </span>
              </td>
             
              <td className="px-6 py-4 text-right">
                 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AnnouncementTable;