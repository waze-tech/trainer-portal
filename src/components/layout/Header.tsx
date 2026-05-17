import { Bell, User } from 'lucide-react';
import { trainerInfo } from '../../data/mock';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-neutral-0 border-b border-neutral-300 flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-950">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-300">
          <div className="w-8 h-8 bg-brand-600-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-800">{trainerInfo.name}</p>
            <p className="text-xs text-neutral-500">Trainer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
