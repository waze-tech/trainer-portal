import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  PlayCircle,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  Forklift,
  ShieldAlert,
  Flame,
  HeartPulse,
  Lock,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Badge, Button } from '../components/ui';
import { sessions, enrollments, getComplianceData, type TrainingType } from '../data/mock';

const trainingIcons: Record<TrainingType, React.ReactNode> = {
  'OSHA 10': <GraduationCap size={20} />,
  'OSHA 30': <GraduationCap size={20} />,
  'Fall Protection': <ShieldAlert size={20} />,
  'Confined Space': <Lock size={20} />,
  'Forklift': <Forklift size={20} />,
  'First Aid/CPR': <HeartPulse size={20} />,
  'Hot Work': <Flame size={20} />,
  'Lockout/Tagout': <Lock size={20} />,
  'Scaffolding': <Wrench size={20} />,
  'Other': <GraduationCap size={20} />,
};

const trainingIconColors: Record<TrainingType, string> = {
  'OSHA 10': 'bg-blue-100 text-blue-600',
  'OSHA 30': 'bg-purple-100 text-purple-600',
  'Fall Protection': 'bg-yellow-100 text-yellow-700',
  'Confined Space': 'bg-neutral-100 text-neutral-600',
  'Forklift': 'bg-brand-50 text-brand-600',
  'First Aid/CPR': 'bg-red-100 text-red-600',
  'Hot Work': 'bg-red-100 text-red-600',
  'Lockout/Tagout': 'bg-neutral-100 text-neutral-700',
  'Scaffolding': 'bg-green-100 text-green-600',
  'Other': 'bg-neutral-100 text-neutral-500',
};

function StatCard({ icon, label, value, accent, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
  trend?: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-[--radius-md] flex items-center justify-center shrink-0 ${accent || 'bg-brand-50 text-brand-600'}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-neutral-950">{value}</p>
      <p className="text-sm text-neutral-500 mt-0.5">{label}</p>
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
            icon={<GraduationCap size={20} />}
            label="Total Sessions"
            value={totalSessions}
            trend="+2 this month"
          />
          <StatCard
            icon={<Users size={20} />}
            label="Workers Trained"
            value={totalTrained}
            accent="bg-blue-100 text-blue-600"
            trend="+8 this month"
          />
          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Expiring Soon"
            value={expiringSoon}
            accent="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            icon={<PlayCircle size={20} />}
            label="Active Sessions"
            value={activeSessions}
            accent="bg-green-100 text-green-600"
          />
        </div>

        {/* Recent Sessions */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-950">Recent Sessions</h3>
            <Link to="/sessions" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Enrollment</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentSessions.map(session => {
                const sessionEnrollments = enrollments.filter(e => e.sessionId === session.id);
                const approved = sessionEnrollments.filter(e => e.status === 'Approved').length;
                const total = sessionEnrollments.length;

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/sessions/${session.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-[--radius-md] flex items-center justify-center ${trainingIconColors[session.type]}`}>
                          {trainingIcons[session.type]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-950">{session.name}</p>
                          <p className="text-xs text-neutral-500">{session.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        <Clock size={14} className="text-neutral-400" />
                        {new Date(session.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        <MapPin size={14} className="text-neutral-400" />
                        {session.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500">{approved}/{total}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={session.status === 'Open' ? 'success' : 'neutral'}
                        dot
                      >
                        {session.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
