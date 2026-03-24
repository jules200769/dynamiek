import type {
  AvailabilitySlot,
  ChecklistItem,
  Invoice,
  InvoiceStatus,
  Lesson,
  LessonStatus,
  MessageThread,
  PackageInfo,
  ProgressItem,
  StudentDocument,
  StudentProfile,
} from '@/src/types/portal';

export type StudentLifecycleStatus = 'Actief' | 'Gepauzeerd' | 'Afgerond';

export type OwnerStudentRecord = {
  id: string;
  status: StudentLifecycleStatus;
  profile: StudentProfile;
  packageInfo: PackageInfo;
  lessons: Lesson[];
  availability: AvailabilitySlot[];
  invoices: Invoice[];
  progress: ProgressItem[];
  checklist: ChecklistItem[];
  documents: StudentDocument[];
  messageThreads: MessageThread[];
  internalNote?: string;
  /** Shown in the student portal (dashboard / progress). */
  instructorAdvice: string;
  updatedAt: string;
  version: number;
};

export type CalendarSyncState = {
  connected: boolean;
  lastSyncAt: string | null;
  status: 'Actief' | 'Niet gekoppeld' | 'Storing';
  pendingItems: number;
  externalCalendarName: string;
};

export type SchoolAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
};

export type SyncEvent = {
  id: string;
  studentId: string;
  entity: 'lesson' | 'invoice' | 'progress' | 'document' | 'calendar' | 'profile';
  action: 'create' | 'update' | 'delete';
  updatedAt: string;
  version: number;
};

export type OwnerPortalData = {
  schoolName: string;
  schoolTimezone: string;
  instructors: string[];
  students: OwnerStudentRecord[];
  calendarSync: CalendarSyncState;
  alerts: SchoolAlert[];
  syncEvents: SyncEvent[];
};

export type OwnerDashboardStats = {
  totalStudents: number;
  activeStudents: number;
  scheduledLessons: number;
  completedLessons: number;
  remainingMinutes: number;
  openAmount: number;
  overdueInvoices: number;
};

export type NewPlannedLessonInput = {
  studentId: string;
  start: string;
  end: string;
  instructor: string;
  car: string;
  location: string;
  lessonType: Lesson['lessonType'];
};

export type UpdateLessonStatusInput = {
  studentId: string;
  lessonId: string;
  status: LessonStatus;
};

export type UpdateInvoiceStatusInput = {
  studentId: string;
  invoiceId: string;
  status: InvoiceStatus;
};
