import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, Button, Badge } from '../components/ui';
import { sessions, enrollments, trainerInfo } from '../data/mock';

export function OTPRExport() {
  const { id } = useParams<{ id: string }>();
  const session = sessions.find(s => s.id === id);
  const sessionEnrollments = enrollments.filter(
    e => e.sessionId === id && e.status === 'Approved'
  );

  if (!session) {
    return (
      <div>
        <Header title="OTPR Export" />
        <main className="p-8">
          <Card className="text-center py-12">
            <p className="text-neutral-500">Session not found.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="OTPR Export" subtitle="OSHA Outreach Training Program Report - Form 4-50.1" />
      <main className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/sessions/${session.id}`} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
            <ArrowLeft size={16} /> Back to session
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
              Print
            </Button>
            <Button size="sm" icon={<Download size={14} />}>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="print:shadow-none print:border-2 print:border-black">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">U.S. Department of Labor</p>
                <p className="text-xs text-neutral-400">Occupational Safety and Health Administration</p>
                <h2 className="text-lg font-bold text-neutral-900 mt-2">Outreach Training Program Report</h2>
                <p className="text-sm text-neutral-500">Form 4-50.1</p>
              </div>
              <Badge variant="info" className="text-sm">
                {session.type}
              </Badge>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3">Section A: Trainer Information</h3>
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4">
              <div>
                <p className="text-xs text-neutral-400">Trainer Name</p>
                <p className="text-sm font-medium text-neutral-900">{trainerInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Trainer ID</p>
                <p className="text-sm font-medium text-neutral-900">{trainerInfo.trainerId}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Email</p>
                <p className="text-sm font-medium text-neutral-900">{trainerInfo.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Organization</p>
                <p className="text-sm font-medium text-neutral-900">{trainerInfo.company}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-neutral-400">Certifications</p>
                <p className="text-sm font-medium text-neutral-900">{trainerInfo.certifications.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Training Details */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3">Section B: Training Details</h3>
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4">
              <div>
                <p className="text-xs text-neutral-400">Course Type</p>
                <p className="text-sm font-medium text-neutral-900">{session.type}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Session Name</p>
                <p className="text-sm font-medium text-neutral-900">{session.name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Training Date</p>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Training Location</p>
                <p className="text-sm font-medium text-neutral-900">{session.location}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Expiry Period</p>
                <p className="text-sm font-medium text-neutral-900">
                  {session.expiryMonths > 0 ? `${session.expiryMonths} months` : 'No expiry'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Total Approved Attendees</p>
                <p className="text-sm font-medium text-neutral-900">{sessionEnrollments.length}</p>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3">Section C: Approved Attendees</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-2 text-left font-semibold text-neutral-600 text-xs">#</th>
                    <th className="px-4 py-2 text-left font-semibold text-neutral-600 text-xs">Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-neutral-600 text-xs">Employer</th>
                    <th className="px-4 py-2 text-left font-semibold text-neutral-600 text-xs">Phone</th>
                    <th className="px-4 py-2 text-left font-semibold text-neutral-600 text-xs">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sessionEnrollments.map((e, i) => (
                    <tr key={e.id}>
                      <td className="px-4 py-2 text-neutral-400">{i + 1}</td>
                      <td className="px-4 py-2 font-medium text-neutral-900">{e.firstName} {e.lastName}</td>
                      <td className="px-4 py-2 text-neutral-600">{e.employer}</td>
                      <td className="px-4 py-2 text-neutral-600">{e.phone}</td>
                      <td className="px-4 py-2 text-neutral-500">
                        {new Date(e.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Block */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-neutral-300 pb-8 mb-2" />
                <p className="text-xs text-neutral-500">Trainer Signature</p>
              </div>
              <div>
                <div className="border-b border-neutral-300 pb-8 mb-2" />
                <p className="text-xs text-neutral-500">Date</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
