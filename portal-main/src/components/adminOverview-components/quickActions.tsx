
import { Link } from "react-router-dom"
import {FileText, Users, TrendingUp, CreditCard } from "lucide-react"
function QuickActions(){
    return(
        <div className="mt-6 animate-slide-up rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Review Applications", icon: FileText, to: "/admin/approval" },
            { label: "Send Announcement", icon: Users, to: "/admin/announcements" },
            { label: "Generate Report", icon: TrendingUp, to: "/admin/reports" },
            { label: "Manage Forum", icon: CreditCard, to: "/admin/communityForum" },
          ].map((action) => (
            <Link key={action.label} to={action.to}>
              <button className="flex w-full items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted">
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    )
}export default QuickActions