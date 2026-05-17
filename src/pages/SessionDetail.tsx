import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  Download,
  Check,
  X,
  Maximize2,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Badge, Button, Modal } from '../components/ui';
import { sessions, enrollments as allEnrollments, type Enrollment, type EnrollmentStatus } from '../data/mock';

function QRPlaceholder({ size = 120 }: { size?: number }) {
  const cells = 9;
  const cellSize = size / cells;
  // Deterministic pattern
  const pattern = [
    1,1,1,0,1,0,1,1,1,
    1,0,1,1,0,1,1,0,1,
    1,1,1,0,1,1,1,1,1,
    0,0,0,1,0,0,0,0,0,
    1,0,1,0,1,0,1,0,1,
    0,0,0,0,0,1,0,0,0,
    1,1,1,0,1,0,1,1,1,
    1,0,1,1,1,0,1,0,1,
    1,1,1,0,0,1,1,1,1,
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {pattern.map((v, i) => (
        <rect
          key={i}
          x={(i % cells) * cellSize}
          y={Math.floor(i / cells) * cellSize}
          width={cellSize}
          height={cellSize}
          fill={v ? '#1b2b1d' : 'white'}
        />
      ))}
    </svg>
  );
}

function ConfidenceBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-neutral-400">N/A</span>;
  const pct = Math.round(score * 100);
  let color = 'bg-green-600';
  if (pct < 50) color = 'bg-red-600';
  else if (pct < 75) color = 'bg-yellow-600';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-neutral-200-full overflow-hidden">
        <div className={`h-full-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-neutral-600">{pct}%</span>
    </div>
  );
}

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const session = sessions.find(s => s.id === id);
  const [enrollmentData, setEnrollmentData] = useState<Enrollment[]>(
    allEnrollments.filter(e => e.sessionId === id)
  );
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showQR, setShowQR] = useState(false);

  if (!session) {
    return (
      <div>
        <Header title="Session Not Found" />
        <main className="p-8">
          <Card className="text-center py-12">
            <p className="text-neutral-500">Session not found.</p>
            <Link to="/sessions" className="text-brand-600 text-sm mt-2 inline-block">Back to sessions</Link>
          </Card>
        </main>
      </div>
    );
  }

  const updateStatus = (enrollmentId: string, status: EnrollmentStatus) => {
    setEnrollmentData(prev =>
      prev.map(e => e.id === enrollmentId ? { ...e, status } : e)
    );
  };

  const bulkAction = (status: EnrollmentStatus) => {
    setEnrollmentData(prev =>
      prev.map(e => selectedRows.has(e.id) ? { ...e, status } : e)
    );
    setSelectedRows(new Set());
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === enrollmentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(enrollmentData.map(e => e.id)));
    }
  };

  const approved = enrollmentData.filter(e => e.status === 'Approved').length;
  const pending = enrollmentData.filter(e => e.status === 'Pending').length;
  const rejected = enrollmentData.filter(e => e.status === 'Rejected').length;

  return (
    <div>
      <Header
        title={session.name}
        subtitle={`${session.type} training session`}
      />
      <main className="p-8">
        <Link to="/sessions" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
          <ArrowLeft size={16} /> Back to sessions
        </Link>

        {/* Session Header */}
        <div className="grid grid-cols-[1fr_auto] gap-6 mb-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant={session.status === 'Open' ? 'success' : 'neutral'} dot>
                    {session.status}
                  </Badge>
                  <Badge variant="info">{session.type}</Badge>
                </div>
                <h2 className="text-xl font-semibold text-neutral-950 mb-1">{session.name}</h2>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{new Date(session.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}</span>
                  </div>
                  <span className="text-neutral-300">|</span>
                  <span>{session.location}</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users size={14} className="text-neutral-400" />
                    <span className="text-neutral-600">{enrollmentData.length} enrolled</span>
                  </div>
                  <Badge variant="success">{approved} approved</Badge>
                  <Badge variant="warning">{pending} pending</Badge>
                  <Badge variant="danger">{rejected} rejected</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link to={`/sessions/${session.id}/qr`}>
                  <Button variant="outline" size="sm" icon={<Maximize2 size={16} />}>
                    Full QR
                  </Button>
                </Link>
                <Link to={`/sessions/${session.id}/otpr`}>
                  <Button variant="outline" size="sm" icon={<FileText size={16} />}>
                    OTPR Export
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* QR Mini */}
          <Card className="flex flex-col items-center justify-center w-[200px] cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowQR(true)}>
            <QRPlaceholder size={120} />
            <p className="text-xs text-neutral-500 mt-3 font-medium">Scan to enroll</p>
            <p className="text-xs text-neutral-400 mt-0.5">Click to enlarge</p>
          </Card>
        </div>

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-brand-50 border border-brand-200">
            <span className="text-sm font-medium text-brand-600">{selectedRows.size} selected</span>
            <Button size="sm" variant="primary" icon={<Check size={14} />} onClick={() => bulkAction('Approved')}>
              Approve
            </Button>
            <Button size="sm" variant="danger" icon={<X size={14} />} onClick={() => bulkAction('Rejected')}>
              Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedRows(new Set())}>
              Clear
            </Button>
          </div>
        )}

        {/* Enrollment Table */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-neutral-300 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-950">Enrollment Roster</h3>
            <div className="flex items-center gap-2">
              <Link to={`/enroll/${session.id}`} target="_blank">
                <Button variant="outline" size="sm" icon={<QrCode size={14} />}>
                  Preview Enrollment
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-300">
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === enrollmentData.length && enrollmentData.length > 0}
                      onChange={toggleAll}
                      className="border-neutral-300 accent-brand-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Worker</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Employer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Enrolled</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enrollmentData.map(enrollment => (
                  <tr key={enrollment.id} className={`hover:bg-neutral-50 transition-colors ${selectedRows.has(enrollment.id) ? 'bg-brand-50' : ''}`}>
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(enrollment.id)}
                        onChange={() => toggleRow(enrollment.id)}
                        className="border-neutral-300 accent-brand-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-neutral-950">
                        {enrollment.firstName} {enrollment.lastName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{enrollment.employer}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceBar score={enrollment.aiConfidence} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          enrollment.status === 'Approved' ? 'success' :
                          enrollment.status === 'Pending' ? 'warning' : 'danger'
                        }
                        dot
                      >
                        {enrollment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {enrollment.status !== 'Approved' && (
                          <button
                            onClick={() => updateStatus(enrollment.id, 'Approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                            title="Approve"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {enrollment.status !== 'Rejected' && (
                          <button
                            onClick={() => updateStatus(enrollment.id, 'Rejected')}
                            className="p-1.5 text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Documents Section */}
        <Card className="mt-6">
          <h3 className="font-semibold text-neutral-950 mb-4">Attached Documents</h3>
          {session.status === 'Closed' ? (
            <div className="space-y-2">
              {['Training Materials.pdf', 'Attendance Sheet.pdf', 'Assessment Results.xlsx'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-neutral-400" />
                    <span className="text-sm text-neutral-700">{doc}</span>
                  </div>
                  <button className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-300 p-6 text-center">
              <FileText size={24} className="mx-auto text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-500">No documents attached yet</p>
              <p className="text-xs text-neutral-400 mt-1">Documents will appear here once uploaded</p>
            </div>
          )}
        </Card>

        {/* QR Modal */}
        <Modal open={showQR} onClose={() => setShowQR(false)} title="Enrollment QR Code" size="sm">
          <div className="flex flex-col items-center py-4">
            <QRPlaceholder size={240} />
            <p className="text-sm font-medium text-neutral-700 mt-4">{session.name}</p>
            <Badge variant={session.status === 'Open' ? 'success' : 'neutral'} dot className="mt-2">
              {session.status}
            </Badge>
            <p className="text-xs text-neutral-400 mt-4">
              Workers scan this QR code to enroll in the training session
            </p>
          </div>
        </Modal>
      </main>
    </div>
  );
}
