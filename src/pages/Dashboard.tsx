import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  PlayCircle,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Badge, Button } from '../components/ui';
import { sessions, enrollments, getComplianceData } from '../data/mock';

function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Card className="flex items-start gap-4">
      <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${accent || 'bg-brand-50 text-brand-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-500 font-medium">{label}</p>
        <p className="text-2xl font-semibold text-neutral-950 mt-0.5">{value}</p>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const compliance = getComplianceData();
  const totalSessions = sessions.length;
  const totalTrained = compliance.length;
  const expiringSoon = compliance.filter(c => c.status === 'Expiring Soon').length;
  const activeSessions = sessions.filter(s => s.status === 'Open').length;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <Header title="Dashboard" subtitle="Training session overview" />
      <main className="p-8">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">Welcome back, Mike</h2>
            <p className="text-sm text-neutral-500 mt-1">Here's what's happening with your training sessions.</p>
          </div>
          <Link to="/sessions/new">
            <Button icon={<Plus size={18} />}>Create Session</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<GraduationCap size={24} />}
            label="Total Sessions"
            value={totalSessions}
          />
          <StatCard
            icon={<Users size={24} />}
            label="Workers Trained"
            value={totalTrained}
            accent="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<AlertTriangle size={24} />}
            label="Expiring Soon"
            value={expiringSoon}
            accent="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            icon={<PlayCircle size={24} />}
            label="Active Sessions"
            value={activeSessions}
            accent="bg-green-100 text-green-600"
          />
        </div>

        {/* Recent Sessions */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-neutral-300 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-950">Recent Sessions</h3>
            <Link to="/sessions" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentSessions.map(session => {
              const sessionEnrollments = enrollments.filter(e => e.sessionId === session.id);
              const approved = sessionEnrollments.filter(e => e.status === 'Approved').length;
              const pending = sessionEnrollments.filter(e => e.status === 'Pending').length;

              return (
                <Link
                  key={session.id}
                  to={`/sessions/${session.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      session.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-950">{session.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={12} className="text-neutral-400" />
                        <span className="text-xs text-neutral-500">
                          {new Date(session.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-neutral-400">|</span>
                        <span className="text-xs text-neutral-500">{session.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <p className="text-sm text-neutral-600">{approved} approved, {pending} pending</p>
                    </div>
                    <Badge
                      variant={session.status === 'Open' ? 'success' : 'neutral'}
                      dot
                    >
                      {session.status}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
