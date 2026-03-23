export type LessonStatus =
  | 'Gepland'
  | 'Bevestigd'
  | 'Voltooid'
  | 'Geannuleerd'
  | 'Wachtlijst';

export type LessonType = 'Praktijkles' | 'Toetsles' | 'Examentraining';

export type Lesson = {
  id: string;
  start: string;
  end: string;
  durationMinutes: number;
  pickupLocation: string;
  dropoffLocation: string;
  instructor: string;
  car: string;
  lessonType: LessonType;
  status: LessonStatus;
  notes?: string;
  feedback?: string;
};

export type AvailabilitySlot = {
  id: string;
  start: string;
  end: string;
  instructor: string;
  car: string;
  location: string;
};

export type StudentProfile = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  cbrNumber: string;
  theoryCertificateNumber: string;
  healthDeclarationStatus: 'Ingediend' | 'Goedgekeurd' | 'Ontbreekt';
  licenseCategory: 'B' | 'BE' | 'A' | 'AM';
  trainingStartDate: string;
};

export type DocumentStatus = 'idle' | 'uploading' | 'uploaded' | 'rejected' | 'replace';

export type StudentDocument = {
  id: string;
  type: 'ID' | 'Theoriecertificaat';
  fileName?: string;
  uploadedAt?: string;
  status: DocumentStatus;
  rejectionReason?: string;
};

export type InvoiceStatus = 'Betaald' | 'Openstaand' | 'Verlopen' | 'In behandeling';

export type PaymentMethod = 'iDEAL' | 'Kaart';

export type Invoice = {
  id: string;
  invoiceNumber: string;
  period: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  downloadUrl?: string;
};

export type PackageInfo = {
  packageName: string;
  totalMinutes: number;
  usedMinutes: number;
  extraMinutes: number;
  openBalance: number;
  nextInstallmentDate?: string;
};

export type ProgressLevel = 'Beginner' | 'Voldoende' | 'Goed' | 'Examenklaar';

export type ProgressTrend = 'stijgend' | 'stabiel' | 'dalend';

export type ProgressItem = {
  id: string;
  skill: string;
  level: ProgressLevel;
  trend: ProgressTrend;
  updatedAt: string;
  note: string;
};

export type ChecklistStatus = 'Voltooid' | 'In behandeling' | 'Blokkerend';

export type ChecklistItem = {
  id: string;
  requirement: string;
  status: ChecklistStatus;
  blocker?: string;
  advice?: string;
};

export type MessageType = 'Algemeen' | 'Planning' | 'Betaling' | 'Voortgang' | 'Systeem';

export type MessagePriority = 'Normaal' | 'Belangrijk';

export type Message = {
  id: string;
  sender: 'Leerling' | 'Rijschool';
  body: string;
  createdAt: string;
};

export type MessageThread = {
  id: string;
  subject: string;
  type: MessageType;
  priority: MessagePriority;
  unreadCount: number;
  pinned: boolean;
  messages: Message[];
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: MessageType;
};

export type ReminderSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  calendarSync: boolean;
};

export type BookingPreferences = {
  preferredTimeWindows: string[];
  preferredLocation: string;
  preferredInstructor?: string;
  waitlistEnabled: boolean;
};

export type PortalScenario = 'normal' | 'drukke-week' | 'betalingsachterstand';

export type PortalData = {
  profile: StudentProfile;
  documents: StudentDocument[];
  lessons: Lesson[];
  availability: AvailabilitySlot[];
  bookingPreferences: BookingPreferences;
  packageInfo: PackageInfo;
  invoices: Invoice[];
  progress: ProgressItem[];
  checklist: ChecklistItem[];
  instructorAdvice: string;
  messageThreads: MessageThread[];
  notifications: NotificationItem[];
  reminderSettings: ReminderSettings;
};
