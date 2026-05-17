import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  List,
  LifeBuoy,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

function BreadcrumbLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/breadcrumb-logo.jpg"
      alt="Breadcrumb"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isSessionsSection = location.pathname.startsWith('/sessions');

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[--radius-md] transition-colors duration-150 ${
      isActive
        ? 'bg-khaki-20 text-neutral-950'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
    }`;

  const subLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 pl-10 pr-3 py-2 text-sm rounded-[--radius-md] transition-colors duration-150 ${
      isActive
        ? 'bg-khaki-20 text-neutral-950 font-medium'
        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
    }`;

  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-0 z-40
        bg-neutral-0 border-r border-neutral-300 flex flex-col
        transition-all duration-200
        ${collapsed ? 'w-[68px]' : 'w-[260px]'}
      `}
    >
      {/* Logo + Company Switcher */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-neutral-300">
        <div className="shrink-0">
          <BreadcrumbLogo size={collapsed ? 28 : 32} />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-neutral-950 truncate">Training Centre</span>
            <ChevronDown size={14} className="text-neutral-400 shrink-0" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
          <LayoutDashboard size={20} className="shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <div>
          <NavLink
            to="/sessions"
            end
            className={() => navLinkClass(isSessionsSection)}
          >
            <GraduationCap size={20} className="shrink-0" />
            {!collapsed && <span>Sessions</span>}
          </NavLink>
          {!collapsed && isSessionsSection && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/sessions" end className={({ isActive }) => subLinkClass(isActive)}>
                <List size={16} className="shrink-0" />
                <span>All Sessions</span>
              </NavLink>
              <NavLink to="/sessions/new" className={({ isActive }) => subLinkClass(isActive)}>
                <Plus size={16} className="shrink-0" />
                <span>Create Session</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/compliance" className={({ isActive }) => navLinkClass(isActive)}>
          <ShieldCheck size={20} className="shrink-0" />
          {!collapsed && <span>Compliance</span>}
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => navLinkClass(isActive)}>
          <Settings size={20} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-neutral-300 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 rounded-[--radius-md] transition-colors cursor-pointer">
          <LifeBuoy size={20} className="shrink-0" />
          {!collapsed && <span>Support</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 rounded-[--radius-md] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={20} className="shrink-0" /> : <ChevronLeft size={20} className="shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
