import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="ml-[260px] transition-all duration-200">
        <Outlet />
      </div>
    </div>
  );
}
