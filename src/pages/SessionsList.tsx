import { Link } from 'react-router-dom';
import {
  Plus,
  GraduationCap,
  Clock,
  Users,
  Search,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Badge, Button } from '../components/ui';
import { sessions, enrollments } from '../data/mock';
import { useState } from 'react';

export function SessionsList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'Closed'>('all');

  const filtered = sessions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <Header title="Training Sessions" subtitle="Manage all your training sessions" />
      <main className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-neutral-300 bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 w-[280px]"
              />
            </div>
            <div className="flex bg-neutral-100 p-0.5">
              {(['all', 'Open', 'Closed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-neutral-0 text-neutral-950 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
          <Link to="/sessions/new">
            <Button icon={<Plus size={18} />}>Create Session</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {sorted.map(session => {
            const sessionEnrollments = enrollments.filter(e => e.sessionId === session.id);
            const approved = sessionEnrollments.filter(e => e.status === 'Approved').length;
            const pending = sessionEnrollments.filter(e => e.status === 'Pending').length;
            const rejected = sessionEnrollments.filter(e => e.status === 'Rejected').length;

            return (
              <Link key={session.id} to={`/sessions/${session.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center ${
                        session.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <p className="text-base font-medium text-neutral-950">{session.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5 text-neutral-500">
                            <Clock size={14} />
                            <span className="text-sm">
                              {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className="text-neutral-300">|</span>
                          <span className="text-sm text-neutral-500">{session.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <Users size={16} />
                        <span className="text-sm">{sessionEnrollments.length} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {approved > 0 && <Badge variant="success">{approved} approved</Badge>}
                        {pending > 0 && <Badge variant="warning">{pending} pending</Badge>}
                        {rejected > 0 && <Badge variant="danger">{rejected} rejected</Badge>}
                      </div>
                      <Badge variant={session.status === 'Open' ? 'success' : 'neutral'} dot>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <Card className="text-center py-12">
            <GraduationCap size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium">No sessions found</p>
            <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
          </Card>
        )}
      </main>
    </div>
  );
}
