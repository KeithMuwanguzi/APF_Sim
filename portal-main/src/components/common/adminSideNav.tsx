import { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiInbox,
  FiLogOut,
  FiUser,
  FiChevronLeft,
  FiMenu,
} from "react-icons/fi";
import { MdDashboard, MdInsights } from "react-icons/md";
import { FaFileAlt, FaMoneyBill, FaComments } from "react-icons/fa";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <aside
      className={`bg-[#EBF3E8] text-[#6A7270] flex flex-col shadow-lg transition-all duration-300 fixed left-0 top-0 h-screen z-20 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo / Hamburger */}
      <div className="flex items-center justify-between h-20 px-4 border-b">
        {!collapsed ? (
          <>
            <img
              src="/favicon.png"
              alt="APF Logo"
              className="h-10 w-auto object-contain"
            />
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-6 h-6 text-purple-700" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2">
        <nav className="space-y-2 mt-4">
          <NavItem icon={<MdDashboard />} label="Dashboard" to="/admin/dashboard" collapsed={collapsed} />
          <NavItem icon={<FiInbox />} label="Manage CMS" to="/admin/cmsPage"  collapsed={collapsed} />
          <NavItem icon={<FiUser />} label="Membership Applications" to="/admin/approval" collapsed={collapsed} />
          <NavItem icon={<FiUser />} label="Profile" to="/admin/profile" collapsed={collapsed} />
          <NavItem icon={<FaFileAlt />} label="Manage Users" to="/admin/manageusers" collapsed={collapsed} />
          <NavItem icon={<FaMoneyBill />} label="Payments & Renewals" to="/admin/payments" collapsed={collapsed} />
          <NavItem icon={<MdInsights />} label="Reports & Analytics" to="/admin/reports" collapsed={collapsed} />
          <NavItem icon={<FaComments />} label="Community Forum" to="/admin/communityForum" collapsed={collapsed} />
          <NavItem icon={<FiBell />} label="Announcements" to="/admin/announcements" collapsed={collapsed} />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 mb-2 border-t border-[#D6EAD9]">
        <button
          onClick={handleLogout}
          className={`group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#D588FE] hover:text-black w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="text-[18px]">
            <FiLogOut />
          </span>
          {!collapsed && <span className="flex-1">Logout</span>}
          {collapsed && (
            <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badgeCount?: number;
  collapsed?: boolean;
}

const NavItem: FC<NavItemProps> = ({ icon, label, to, badgeCount, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-[#D588FE] text-black font-semibold"
          : "hover:bg-[#D588FE] hover:text-black"
      } ${collapsed ? "justify-center" : ""}`
    }
    title={collapsed ? label : ""}
  >
    <span className="text-[18px]">{icon}</span>
    {!collapsed && <span className="flex-1">{label}</span>}
    {badgeCount !== undefined && !collapsed && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
    {collapsed && (
      <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
    )}
  </NavLink>
);

export default Sidebar;