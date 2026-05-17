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
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isSessionsSection = location.pathname.startsWith('/sessions');

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-white/15 text-white'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  const subLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
      isActive
        ? 'bg-white/15 text-white'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-0 z-40
        bg-primary-dark flex flex-col
        transition-all duration-200
        ${collapsed ? 'w-[68px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
          B
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-lg tracking-tight">Breadcrumb</span>
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

      {/* Collapse */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
