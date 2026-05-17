import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Bell,
  BellOff,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Badge, Button } from '../components/ui';
import { getComplianceData, TRAINING_TYPES, type CertStatus, type TrainingType } from '../data/mock';

type SortKey = 'name' | 'employer' | 'type' | 'date' | 'expiry' | 'status';
type SortDir = 'asc' | 'desc';

const statusOrder: Record<CertStatus, number> = { 'Expired': 0, 'Expiring Soon': 1, 'Valid': 2 };

export function Compliance() {
  const allData = useMemo(() => getComplianceData(), []);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TrainingType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CertStatus | 'all'>('all');
  const [employerFilter, setEmployerFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('expiry');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    allData.forEach(d => { map[`${d.workerId}-${d.sessionId}`] = d.notifyEnabled; });
    return map;
  });

  const employers = useMemo(() => [...new Set(allData.map(d => d.employer))].sort(), [allData]);

  const filtered = useMemo(() => {
    return allData.filter(d => {
      const matchesSearch =
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        d.employer.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || d.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesEmployer = employerFilter === 'all' || d.employer === employerFilter;
      return matchesSearch && matchesType && matchesStatus && matchesEmployer;
    });
  }, [allData, search, typeFilter, statusFilter, employerFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`); break;
        case 'employer': cmp = a.employer.localeCompare(b.employer); break;
        case 'type': cmp = a.type.localeCompare(b.type); break;
        case 'date': cmp = new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime(); break;
        case 'expiry': cmp = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(); break;
        case 'status': cmp = statusOrder[a.status] - statusOrder[b.status]; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleNotification = (workerId: string, sessionId: string) => {
    const key = `${workerId}-${sessionId}`;
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const statusBadgeVariant = (status: CertStatus) => {
    switch (status) {
      case 'Valid': return 'success' as const;
      case 'Expiring Soon': return 'warning' as const;
      case 'Expired': return 'danger' as const;
    }
  };

  const ThHeader = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700 select-none"
      onClick={() => toggleSort(sortKeyVal)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={12} className={sortKey === sortKeyVal ? 'text-primary' : 'text-neutral-300'} />
      </div>
    </th>
  );

  const expiringSoon = allData.filter(d => d.status === 'Expiring Soon').length;
  const expired = allData.filter(d => d.status === 'Expired').length;
  const valid = allData.filter(d => d.status === 'Valid').length;

  return (
    <div>
      <Header title="Compliance Dashboard" subtitle="Track worker certifications and expiries" />
      <main className="p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-neutral-900">{valid}</p>
                <p className="text-sm text-neutral-500">Valid certifications</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-neutral-900">{expiringSoon}</p>
                <p className="text-sm text-neutral-500">Expiring soon</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-neutral-900">{expired}</p>
                <p className="text-sm text-neutral-500">Expired</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="sm" className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search workers or employers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as TrainingType | 'all')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Types</option>
              {TRAINING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={employerFilter}
              onChange={e => setEmployerFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Employers</option>
              {employers.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as CertStatus | 'all')}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Statuses</option>
              <option value="Valid">Valid</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
            <Button variant="outline" size="sm" icon={<Download size={14} />}>
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <ThHeader label="Worker" sortKeyVal="name" />
                  <ThHeader label="Employer" sortKeyVal="employer" />
                  <ThHeader label="Training" sortKeyVal="type" />
                  <ThHeader label="Completed" sortKeyVal="date" />
                  <ThHeader label="Expires" sortKeyVal="expiry" />
                  <ThHeader label="Status" sortKeyVal="status" />
                  <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">Notify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sorted.map((row, i) => {
                  const notifKey = `${row.workerId}-${row.sessionId}`;
                  return (
                    <tr key={`${row.workerId}-${row.sessionId}-${i}`} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-neutral-900">
                          {row.firstName} {row.lastName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{row.employer}</td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{row.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {new Date(row.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {new Date(row.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(row.status)} dot>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleNotification(row.workerId, row.sessionId)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            notifications[notifKey]
                              ? 'text-primary hover:bg-primary/10'
                              : 'text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500'
                          }`}
                          title={notifications[notifKey] ? 'Notification enabled' : 'Notification disabled'}
                        >
                          {notifications[notifKey] ? <Bell size={16} /> : <BellOff size={16} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {sorted.length === 0 && (
            <div className="text-center py-12">
              <Filter size={32} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500 font-medium">No records match your filters</p>
              <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
          <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
            Showing {sorted.length} of {allData.length} records
          </div>
        </Card>
      </main>
    </div>
  );
}
