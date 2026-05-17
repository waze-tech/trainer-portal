export type TrainingType =
  | 'OSHA 10'
  | 'OSHA 30'
  | 'Fall Protection'
  | 'Confined Space'
  | 'Forklift'
  | 'First Aid/CPR'
  | 'Hot Work'
  | 'Lockout/Tagout'
  | 'Scaffolding'
  | 'Other';

export type SessionStatus = 'Open' | 'Closed';
export type EnrollmentStatus = 'Pending' | 'Approved' | 'Rejected';
export type CertStatus = 'Valid' | 'Expiring Soon' | 'Expired';

export interface EnrollmentQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface Session {
  id: string;
  name: string;
  type: TrainingType;
  status: SessionStatus;
  createdAt: string;
  scheduledDate: string;
  location: string;
  expiryMonths: number;
  enrollmentQuestions: EnrollmentQuestion[];
  aiQualityPrompt: string;
  enrollmentCount: number;
  approvedCount: number;
}

export interface Enrollment {
  id: string;
  sessionId: string;
  firstName: string;
  lastName: string;
  employer: string;
  phone: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  aiConfidence: number | null;
  answers: Record<string, string>;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  employer: string;
  phone: string;
  trainings: WorkerTraining[];
}

export interface WorkerTraining {
  sessionId: string;
  type: TrainingType;
  completedDate: string;
  expiryDate: string;
  status: CertStatus;
  notifyEnabled: boolean;
}

export const TRAINING_TYPES: TrainingType[] = [
  'OSHA 10',
  'OSHA 30',
  'Fall Protection',
  'Confined Space',
  'Forklift',
  'First Aid/CPR',
  'Hot Work',
  'Lockout/Tagout',
  'Scaffolding',
  'Other',
];

export const EXPIRY_OPTIONS = [
  { label: '6 months', value: 6 },
  { label: '1 year', value: 12 },
  { label: '2 years', value: 24 },
  { label: '3 years', value: 36 },
  { label: '5 years', value: 60 },
  { label: 'No expiry', value: 0 },
];

export const sessions: Session[] = [
  {
    id: 'ses-001',
    name: 'OSHA 10 - May 2026 - Downtown HQ',
    type: 'OSHA 10',
    status: 'Open',
    createdAt: '2026-05-10T09:00:00Z',
    scheduledDate: '2026-05-20T08:00:00Z',
    location: 'Downtown HQ, Building A',
    expiryMonths: 60,
    enrollmentQuestions: [
      { id: 'q1', question: 'Do you have prior OSHA training?', type: 'select', required: true, options: ['Yes', 'No'] },
      { id: 'q2', question: 'Emergency contact name & number', type: 'text', required: true },
    ],
    aiQualityPrompt: 'Verify that the worker has a valid employer association and that the employer is a known construction company.',
    enrollmentCount: 8,
    approvedCount: 5,
  },
  {
    id: 'ses-002',
    name: 'Fall Protection - May 2026 - Riverside Site',
    type: 'Fall Protection',
    status: 'Open',
    createdAt: '2026-05-12T10:30:00Z',
    scheduledDate: '2026-05-22T07:00:00Z',
    location: 'Riverside Construction Site',
    expiryMonths: 12,
    enrollmentQuestions: [
      { id: 'q3', question: 'Current harness certification number (if any)', type: 'text', required: false },
    ],
    aiQualityPrompt: 'Check that the worker is associated with an active project at the Riverside site.',
    enrollmentCount: 6,
    approvedCount: 4,
  },
  {
    id: 'ses-003',
    name: 'Confined Space - Apr 2026 - Industrial Park',
    type: 'Confined Space',
    status: 'Closed',
    createdAt: '2026-04-01T08:00:00Z',
    scheduledDate: '2026-04-15T08:00:00Z',
    location: 'Industrial Park, Unit 7',
    expiryMonths: 24,
    enrollmentQuestions: [],
    aiQualityPrompt: '',
    enrollmentCount: 5,
    approvedCount: 5,
  },
  {
    id: 'ses-004',
    name: 'Forklift Certification - May 2026 - Warehouse',
    type: 'Forklift',
    status: 'Open',
    createdAt: '2026-05-14T14:00:00Z',
    scheduledDate: '2026-05-25T09:00:00Z',
    location: 'Central Warehouse',
    expiryMonths: 36,
    enrollmentQuestions: [
      { id: 'q4', question: 'Years of forklift experience', type: 'text', required: true },
      { id: 'q5', question: 'Type of forklift (Sit-down, Stand-up, Reach)', type: 'select', required: true, options: ['Sit-down', 'Stand-up', 'Reach', 'All'] },
    ],
    aiQualityPrompt: 'Verify the worker has relevant warehouse or construction experience.',
    enrollmentCount: 4,
    approvedCount: 2,
  },
  {
    id: 'ses-005',
    name: 'First Aid/CPR - Mar 2026 - Main Office',
    type: 'First Aid/CPR',
    status: 'Closed',
    createdAt: '2026-02-20T09:00:00Z',
    scheduledDate: '2026-03-10T10:00:00Z',
    location: 'Main Office, Conference Room B',
    expiryMonths: 24,
    enrollmentQuestions: [],
    aiQualityPrompt: '',
    enrollmentCount: 12,
    approvedCount: 12,
  },
  {
    id: 'ses-006',
    name: 'OSHA 30 - May 2026 - Northside Project',
    type: 'OSHA 30',
    status: 'Open',
    createdAt: '2026-05-15T11:00:00Z',
    scheduledDate: '2026-06-01T08:00:00Z',
    location: 'Northside Development, Phase 2',
    expiryMonths: 60,
    enrollmentQuestions: [
      { id: 'q6', question: 'OSHA 10 completion date', type: 'text', required: true },
      { id: 'q7', question: 'Supervisor name', type: 'text', required: true },
    ],
    aiQualityPrompt: 'Confirm the worker has completed OSHA 10 before enrolling in OSHA 30.',
    enrollmentCount: 3,
    approvedCount: 1,
  },
  {
    id: 'ses-007',
    name: 'Hot Work Permit - Jan 2026 - Steel Plant',
    type: 'Hot Work',
    status: 'Closed',
    createdAt: '2025-12-15T08:00:00Z',
    scheduledDate: '2026-01-10T07:00:00Z',
    location: 'Metro Steel Plant',
    expiryMonths: 12,
    enrollmentQuestions: [],
    aiQualityPrompt: '',
    enrollmentCount: 7,
    approvedCount: 7,
  },
  {
    id: 'ses-008',
    name: 'Scaffolding Safety - May 2026 - Tower Project',
    type: 'Scaffolding',
    status: 'Open',
    createdAt: '2026-05-16T13:00:00Z',
    scheduledDate: '2026-05-28T08:00:00Z',
    location: 'Tower Project, East Wing',
    expiryMonths: 12,
    enrollmentQuestions: [
      { id: 'q8', question: 'Height comfort level (stories)', type: 'text', required: false },
    ],
    aiQualityPrompt: 'Check that the worker is on the approved list for the Tower Project.',
    enrollmentCount: 5,
    approvedCount: 3,
  },
];

export const enrollments: Enrollment[] = [
  // Session 1 - OSHA 10
  { id: 'enr-001', sessionId: 'ses-001', firstName: 'Carlos', lastName: 'Martinez', employer: 'Summit Builders', phone: '+1-555-0101', enrolledAt: '2026-05-11T08:30:00Z', status: 'Approved', aiConfidence: 0.95, answers: { q1: 'Yes', q2: 'Maria Martinez, 555-0201' } },
  { id: 'enr-002', sessionId: 'ses-001', firstName: 'James', lastName: 'O\'Brien', employer: 'Cornerstone Construction', phone: '+1-555-0102', enrolledAt: '2026-05-11T09:15:00Z', status: 'Approved', aiConfidence: 0.92, answers: { q1: 'No', q2: 'Sarah O\'Brien, 555-0202' } },
  { id: 'enr-003', sessionId: 'ses-001', firstName: 'Miguel', lastName: 'Santos', employer: 'Summit Builders', phone: '+1-555-0103', enrolledAt: '2026-05-12T07:00:00Z', status: 'Approved', aiConfidence: 0.88, answers: { q1: 'Yes', q2: 'Rosa Santos, 555-0203' } },
  { id: 'enr-004', sessionId: 'ses-001', firstName: 'David', lastName: 'Kim', employer: 'Pacific Contractors', phone: '+1-555-0104', enrolledAt: '2026-05-12T10:45:00Z', status: 'Pending', aiConfidence: 0.72, answers: { q1: 'No', q2: 'Jenny Kim, 555-0204' } },
  { id: 'enr-005', sessionId: 'ses-001', firstName: 'Robert', lastName: 'Johnson', employer: 'Unknown LLC', phone: '+1-555-0105', enrolledAt: '2026-05-13T06:30:00Z', status: 'Rejected', aiConfidence: 0.31, answers: { q1: 'Yes', q2: 'N/A' } },
  { id: 'enr-006', sessionId: 'ses-001', firstName: 'Ahmad', lastName: 'Hassan', employer: 'Cornerstone Construction', phone: '+1-555-0106', enrolledAt: '2026-05-14T08:00:00Z', status: 'Approved', aiConfidence: 0.91, answers: { q1: 'Yes', q2: 'Fatima Hassan, 555-0206' } },
  { id: 'enr-007', sessionId: 'ses-001', firstName: 'Tommy', lastName: 'Nguyen', employer: 'Pacific Contractors', phone: '+1-555-0107', enrolledAt: '2026-05-15T11:20:00Z', status: 'Pending', aiConfidence: 0.65, answers: { q1: 'No', q2: 'Lisa Nguyen, 555-0207' } },
  { id: 'enr-008', sessionId: 'ses-001', firstName: 'Patrick', lastName: 'Walsh', employer: 'Summit Builders', phone: '+1-555-0108', enrolledAt: '2026-05-15T14:00:00Z', status: 'Approved', aiConfidence: 0.97, answers: { q1: 'Yes', q2: 'Ciara Walsh, 555-0208' } },

  // Session 2 - Fall Protection
  { id: 'enr-009', sessionId: 'ses-002', firstName: 'Luis', lastName: 'Garcia', employer: 'Apex Construction', phone: '+1-555-0109', enrolledAt: '2026-05-13T07:00:00Z', status: 'Approved', aiConfidence: 0.89, answers: { q3: 'HC-2024-4412' } },
  { id: 'enr-010', sessionId: 'ses-002', firstName: 'Ryan', lastName: 'Mitchell', employer: 'Apex Construction', phone: '+1-555-0110', enrolledAt: '2026-05-13T07:30:00Z', status: 'Approved', aiConfidence: 0.94, answers: { q3: 'HC-2024-5501' } },
  { id: 'enr-011', sessionId: 'ses-002', firstName: 'Andrei', lastName: 'Volkov', employer: 'Metro Builders', phone: '+1-555-0111', enrolledAt: '2026-05-14T09:00:00Z', status: 'Pending', aiConfidence: 0.58, answers: { q3: '' } },
  { id: 'enr-012', sessionId: 'ses-002', firstName: 'Kevin', lastName: 'Thompson', employer: 'Apex Construction', phone: '+1-555-0112', enrolledAt: '2026-05-14T10:15:00Z', status: 'Approved', aiConfidence: 0.91, answers: { q3: 'HC-2023-3320' } },
  { id: 'enr-013', sessionId: 'ses-002', firstName: 'Sean', lastName: 'Murphy', employer: 'Metro Builders', phone: '+1-555-0113', enrolledAt: '2026-05-15T06:45:00Z', status: 'Approved', aiConfidence: 0.87, answers: { q3: '' } },
  { id: 'enr-014', sessionId: 'ses-002', firstName: 'Jamal', lastName: 'Williams', employer: 'Pacific Contractors', phone: '+1-555-0114', enrolledAt: '2026-05-16T08:00:00Z', status: 'Pending', aiConfidence: null, answers: { q3: 'HC-2025-0019' } },

  // Session 3 - Confined Space (closed)
  { id: 'enr-015', sessionId: 'ses-003', firstName: 'Carlos', lastName: 'Martinez', employer: 'Summit Builders', phone: '+1-555-0101', enrolledAt: '2026-04-02T08:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-016', sessionId: 'ses-003', firstName: 'James', lastName: 'O\'Brien', employer: 'Cornerstone Construction', phone: '+1-555-0102', enrolledAt: '2026-04-02T08:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-017', sessionId: 'ses-003', firstName: 'Luis', lastName: 'Garcia', employer: 'Apex Construction', phone: '+1-555-0109', enrolledAt: '2026-04-03T09:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-018', sessionId: 'ses-003', firstName: 'Ryan', lastName: 'Mitchell', employer: 'Apex Construction', phone: '+1-555-0110', enrolledAt: '2026-04-03T09:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-019', sessionId: 'ses-003', firstName: 'Kevin', lastName: 'Thompson', employer: 'Apex Construction', phone: '+1-555-0112', enrolledAt: '2026-04-04T07:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },

  // Session 4 - Forklift
  { id: 'enr-020', sessionId: 'ses-004', firstName: 'Derek', lastName: 'Brown', employer: 'Summit Builders', phone: '+1-555-0115', enrolledAt: '2026-05-15T10:00:00Z', status: 'Approved', aiConfidence: 0.93, answers: { q4: '5', q5: 'Sit-down' } },
  { id: 'enr-021', sessionId: 'ses-004', firstName: 'Tony', lastName: 'Russo', employer: 'Metro Builders', phone: '+1-555-0116', enrolledAt: '2026-05-15T11:00:00Z', status: 'Approved', aiConfidence: 0.85, answers: { q4: '2', q5: 'All' } },
  { id: 'enr-022', sessionId: 'ses-004', firstName: 'Marcus', lastName: 'Davis', employer: 'Pacific Contractors', phone: '+1-555-0117', enrolledAt: '2026-05-16T07:00:00Z', status: 'Pending', aiConfidence: 0.45, answers: { q4: '0', q5: 'Sit-down' } },
  { id: 'enr-023', sessionId: 'ses-004', firstName: 'Piotr', lastName: 'Kowalski', employer: 'Cornerstone Construction', phone: '+1-555-0118', enrolledAt: '2026-05-16T09:00:00Z', status: 'Pending', aiConfidence: 0.78, answers: { q4: '3', q5: 'Reach' } },

  // Session 5 - First Aid/CPR (closed)
  { id: 'enr-024', sessionId: 'ses-005', firstName: 'Carlos', lastName: 'Martinez', employer: 'Summit Builders', phone: '+1-555-0101', enrolledAt: '2026-02-25T08:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-025', sessionId: 'ses-005', firstName: 'James', lastName: 'O\'Brien', employer: 'Cornerstone Construction', phone: '+1-555-0102', enrolledAt: '2026-02-25T08:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-026', sessionId: 'ses-005', firstName: 'Luis', lastName: 'Garcia', employer: 'Apex Construction', phone: '+1-555-0109', enrolledAt: '2026-02-26T09:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-027', sessionId: 'ses-005', firstName: 'Ahmad', lastName: 'Hassan', employer: 'Cornerstone Construction', phone: '+1-555-0106', enrolledAt: '2026-02-26T09:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-028', sessionId: 'ses-005', firstName: 'Derek', lastName: 'Brown', employer: 'Summit Builders', phone: '+1-555-0115', enrolledAt: '2026-02-27T07:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-029', sessionId: 'ses-005', firstName: 'Tony', lastName: 'Russo', employer: 'Metro Builders', phone: '+1-555-0116', enrolledAt: '2026-02-27T07:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-030', sessionId: 'ses-005', firstName: 'Sean', lastName: 'Murphy', employer: 'Metro Builders', phone: '+1-555-0113', enrolledAt: '2026-02-28T08:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-031', sessionId: 'ses-005', firstName: 'Andrei', lastName: 'Volkov', employer: 'Metro Builders', phone: '+1-555-0111', enrolledAt: '2026-02-28T08:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-032', sessionId: 'ses-005', firstName: 'Tommy', lastName: 'Nguyen', employer: 'Pacific Contractors', phone: '+1-555-0107', enrolledAt: '2026-03-01T09:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-033', sessionId: 'ses-005', firstName: 'Patrick', lastName: 'Walsh', employer: 'Summit Builders', phone: '+1-555-0108', enrolledAt: '2026-03-01T09:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-034', sessionId: 'ses-005', firstName: 'Piotr', lastName: 'Kowalski', employer: 'Cornerstone Construction', phone: '+1-555-0118', enrolledAt: '2026-03-02T07:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-035', sessionId: 'ses-005', firstName: 'Marcus', lastName: 'Davis', employer: 'Pacific Contractors', phone: '+1-555-0117', enrolledAt: '2026-03-02T07:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },

  // Session 6 - OSHA 30
  { id: 'enr-036', sessionId: 'ses-006', firstName: 'Carlos', lastName: 'Martinez', employer: 'Summit Builders', phone: '+1-555-0101', enrolledAt: '2026-05-16T08:00:00Z', status: 'Approved', aiConfidence: 0.98, answers: { q6: '2021-06-15', q7: 'Mike Reynolds' } },
  { id: 'enr-037', sessionId: 'ses-006', firstName: 'Ahmad', lastName: 'Hassan', employer: 'Cornerstone Construction', phone: '+1-555-0106', enrolledAt: '2026-05-16T10:00:00Z', status: 'Pending', aiConfidence: 0.82, answers: { q6: '2023-01-20', q7: 'Bill Crawford' } },
  { id: 'enr-038', sessionId: 'ses-006', firstName: 'Sean', lastName: 'Murphy', employer: 'Metro Builders', phone: '+1-555-0113', enrolledAt: '2026-05-17T07:00:00Z', status: 'Pending', aiConfidence: 0.76, answers: { q6: '2022-09-10', q7: 'Dan O\'Leary' } },

  // Session 7 - Hot Work (closed)
  { id: 'enr-039', sessionId: 'ses-007', firstName: 'Derek', lastName: 'Brown', employer: 'Summit Builders', phone: '+1-555-0115', enrolledAt: '2025-12-20T08:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-040', sessionId: 'ses-007', firstName: 'Tony', lastName: 'Russo', employer: 'Metro Builders', phone: '+1-555-0116', enrolledAt: '2025-12-20T08:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-041', sessionId: 'ses-007', firstName: 'Piotr', lastName: 'Kowalski', employer: 'Cornerstone Construction', phone: '+1-555-0118', enrolledAt: '2025-12-21T09:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-042', sessionId: 'ses-007', firstName: 'Ryan', lastName: 'Mitchell', employer: 'Apex Construction', phone: '+1-555-0110', enrolledAt: '2025-12-21T09:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-043', sessionId: 'ses-007', firstName: 'Kevin', lastName: 'Thompson', employer: 'Apex Construction', phone: '+1-555-0112', enrolledAt: '2025-12-22T07:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-044', sessionId: 'ses-007', firstName: 'Jamal', lastName: 'Williams', employer: 'Pacific Contractors', phone: '+1-555-0114', enrolledAt: '2025-12-22T07:30:00Z', status: 'Approved', aiConfidence: null, answers: {} },
  { id: 'enr-045', sessionId: 'ses-007', firstName: 'Miguel', lastName: 'Santos', employer: 'Summit Builders', phone: '+1-555-0103', enrolledAt: '2025-12-23T08:00:00Z', status: 'Approved', aiConfidence: null, answers: {} },

  // Session 8 - Scaffolding
  { id: 'enr-046', sessionId: 'ses-008', firstName: 'Luis', lastName: 'Garcia', employer: 'Apex Construction', phone: '+1-555-0109', enrolledAt: '2026-05-16T14:00:00Z', status: 'Approved', aiConfidence: 0.90, answers: { q8: '10+' } },
  { id: 'enr-047', sessionId: 'ses-008', firstName: 'Ryan', lastName: 'Mitchell', employer: 'Apex Construction', phone: '+1-555-0110', enrolledAt: '2026-05-16T14:30:00Z', status: 'Approved', aiConfidence: 0.88, answers: { q8: '8' } },
  { id: 'enr-048', sessionId: 'ses-008', firstName: 'David', lastName: 'Kim', employer: 'Pacific Contractors', phone: '+1-555-0104', enrolledAt: '2026-05-17T07:00:00Z', status: 'Pending', aiConfidence: 0.55, answers: { q8: '3' } },
  { id: 'enr-049', sessionId: 'ses-008', firstName: 'Andrei', lastName: 'Volkov', employer: 'Metro Builders', phone: '+1-555-0111', enrolledAt: '2026-05-17T08:00:00Z', status: 'Approved', aiConfidence: 0.83, answers: { q8: '15+' } },
  { id: 'enr-050', sessionId: 'ses-008', firstName: 'Marcus', lastName: 'Davis', employer: 'Pacific Contractors', phone: '+1-555-0117', enrolledAt: '2026-05-17T09:30:00Z', status: 'Pending', aiConfidence: 0.41, answers: { q8: '1' } },
];

// Helper: derive compliance data from closed sessions
export function getComplianceData(): Array<{
  workerId: string;
  firstName: string;
  lastName: string;
  employer: string;
  type: TrainingType;
  completedDate: string;
  expiryDate: string;
  status: CertStatus;
  sessionId: string;
  notifyEnabled: boolean;
}> {
  const closedSessions = sessions.filter(s => s.status === 'Closed');
  const approvedEnrollments = enrollments.filter(
    e => e.status === 'Approved' && closedSessions.some(s => s.id === e.sessionId)
  );

  const now = new Date('2026-05-17');
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return approvedEnrollments.map(e => {
    const session = sessions.find(s => s.id === e.sessionId)!;
    const completedDate = new Date(session.scheduledDate);
    const expiryDate = new Date(completedDate);
    if (session.expiryMonths > 0) {
      expiryDate.setMonth(expiryDate.getMonth() + session.expiryMonths);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 100);
    }

    let status: CertStatus = 'Valid';
    if (expiryDate < now) {
      status = 'Expired';
    } else if (expiryDate.getTime() - now.getTime() < thirtyDays) {
      status = 'Expiring Soon';
    }

    return {
      workerId: `w-${e.firstName.toLowerCase()}-${e.lastName.toLowerCase()}`,
      firstName: e.firstName,
      lastName: e.lastName,
      employer: e.employer,
      type: session.type,
      completedDate: session.scheduledDate,
      expiryDate: expiryDate.toISOString(),
      status,
      sessionId: e.sessionId,
      notifyEnabled: true,
    };
  });
}

export const trainerInfo = {
  name: 'Mike Reynolds',
  email: 'mike.reynolds@breadcrumb.com',
  certifications: ['OSHA Outreach Trainer', 'Certified Safety Professional (CSP)'],
  company: 'Breadcrumb Safety Inc.',
  trainerId: 'TR-2024-0847',
};
