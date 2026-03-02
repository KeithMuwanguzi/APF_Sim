import { Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRecentApplications,RecentApplication } from "../../services/dashboard";

function RecentApplications() {
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (date: string) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    return `${hours} hours ago`;
  };




  return (
    <div className="rounded-xl border border-border bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Recent Applications
        </h2>
        <Link
          to="/admin/approval"
          className="text-sm text-purple-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-400">Loading applications…</p>
      )}

      {/* List */}
      <div className="divide-y divide-gray-100">
       {applications.map((app) => {
        const isApproved = app.status === "approved";
        const isRejected = app.status === "rejected";

  return (
    <div
      key={app.id}
      className="flex items-center justify-between py-3"
    >
      {/* Left */}
      <div>
        <p className="text-sm font-medium text-gray-800">
          {app.first_name} {app.last_name}
        </p>
        <p className="text-xs text-gray-400">
          Member • {timeAgo(app.submitted_at)}
        </p>
      </div>

      {/* Status */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
          isApproved
            ? "bg-green-100 text-green-700"
            : isRejected
            ? "bg-red-100 text-red-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        {isApproved ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
      </span>
    </div>
  );
})}


        {!loading && applications.length === 0 && (
          <p className="text-sm text-gray-400 py-3">
            No recent applications found.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentApplications;
