import { supabase } from '@/src/lib/supabase/client';
import type { Database } from '@/src/lib/supabase/database.types';
import type {
  AvailabilitySlot,
  BookingPreferences,
  ChecklistItem,
  Invoice,
  Lesson,
  Message,
  MessageThread,
  NotificationItem,
  PackageInfo,
  PortalData,
  ProgressItem,
  ReminderSettings,
  StudentDocument,
  StudentProfile,
} from '@/src/types/portal';
import type { CalendarSyncState, OwnerPortalData, OwnerStudentRecord, SchoolAlert, SyncEvent } from '@/src/types/ownerPortal';

type Tables = Database['public']['Tables'];
type StudentRow = Tables['students']['Row'];
type StudentIdRecord = { student_id: string };

function assertData<T>(value: T | null, label: string): T {
  if (value === null) {
    throw new Error(`Missing data for ${label}`);
  }
  return value;
}

export async function getCurrentAuthUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('No authenticated user');
  return data.user;
}

export async function getCurrentStudentByAuth() {
  const user = await getCurrentAuthUser();
  const { data, error } = await supabase.from('students').select('*').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return (data as StudentRow | null) ?? null;
}

export async function getCurrentStudentIdOrThrow() {
  const student = await getCurrentStudentByAuth();
  return assertData(student, 'current student').id;
}

function toStudentProfile(student: StudentRow): StudentProfile {
  return {
    fullName: student.full_name,
    address: student.address,
    city: student.city,
    postalCode: student.postal_code,
    dateOfBirth: student.date_of_birth ?? '',
    phone: student.phone,
    email: student.email,
    cbrNumber: student.cbr_number,
    theoryCertificateNumber: student.theory_certificate_number,
    healthDeclarationStatus:
      student.health_declaration_status === 'In behandeling' ? 'Ontbreekt' : student.health_declaration_status,
    licenseCategory: student.license_category,
    trainingStartDate: student.training_start_date ?? '',
  };
}

function toPackageInfo(data: Tables['package_infos']['Row'] | null): PackageInfo {
  return {
    packageName: data?.package_name ?? 'Startpakket',
    totalMinutes: data?.total_minutes ?? 0,
    usedMinutes: data?.used_minutes ?? 0,
    extraMinutes: data?.extra_minutes ?? 0,
    openBalance: Number(data?.open_balance ?? 0),
    nextInstallmentDate: data?.next_installment_date ?? undefined,
  };
}

function toLesson(row: Tables['lessons']['Row']): Lesson {
  return {
    id: row.id,
    start: row.start_at,
    end: row.end_at,
    durationMinutes: row.duration_minutes,
    pickupLocation: row.pickup_location,
    dropoffLocation: row.dropoff_location,
    instructor: row.instructor,
    car: row.car,
    lessonType: row.lesson_type,
    status: row.status,
    notes: row.notes ?? undefined,
    feedback: row.feedback ?? undefined,
  };
}

function toAvailabilitySlot(row: Tables['availability_slots']['Row']): AvailabilitySlot {
  return {
    id: row.id,
    start: row.start_at,
    end: row.end_at,
    instructor: row.instructor,
    car: row.car,
    location: row.location,
  };
}

function toDocument(row: Tables['documents']['Row']): StudentDocument {
  return {
    id: row.id,
    type: row.type,
    fileName: row.file_name ?? undefined,
    uploadedAt: row.uploaded_at ?? undefined,
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined,
  };
}

function toInvoice(row: Tables['invoices']['Row']): Invoice {
  const fallbackDownloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
    `Factuur ${row.invoice_number}\nPeriode: ${row.period}\nBedrag: ${row.amount}\nStatus: ${row.status}`,
  )}`;
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    period: row.period,
    amount: Number(row.amount),
    dueDate: row.due_date,
    status: row.status,
    downloadUrl: row.download_url ?? fallbackDownloadUrl,
  };
}

function toProgress(row: Tables['progress_items']['Row']): ProgressItem {
  return {
    id: row.id,
    skill: row.skill,
    level: row.level,
    trend: row.trend,
    updatedAt: row.updated_at,
    note: row.note,
  };
}

function toChecklist(row: Tables['checklist_items']['Row']): ChecklistItem {
  return {
    id: row.id,
    requirement: row.requirement,
    status: row.status,
    blocker: row.blocker ?? undefined,
    advice: row.advice ?? undefined,
  };
}

function toMessage(row: Tables['messages']['Row']): Message {
  return {
    id: row.id,
    sender: row.sender,
    body: row.body,
    createdAt: row.created_at,
  };
}

function toMessageThread(
  row: Tables['message_threads']['Row'],
  allMessages: Tables['messages']['Row'][],
): MessageThread {
  return {
    id: row.id,
    subject: row.subject,
    type: row.type,
    priority: row.priority,
    unreadCount: row.unread_count,
    pinned: row.pinned,
    messages: allMessages.filter((message) => message.thread_id === row.id).map(toMessage),
  };
}

function toNotification(row: Tables['notifications']['Row']): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    read: row.read,
    kind: row.kind,
  };
}

function toReminderSettings(row: Tables['reminder_settings']['Row'] | null): ReminderSettings {
  return {
    email: row?.email ?? true,
    sms: row?.sms ?? false,
    push: row?.push ?? true,
    calendarSync: row?.calendar_sync ?? false,
  };
}

function toBookingPreferences(row: Tables['booking_preferences']['Row'] | null): BookingPreferences {
  return {
    preferredTimeWindows: row?.preferred_time_windows ?? [],
    preferredLocation: row?.preferred_location ?? '',
    preferredInstructor: row?.preferred_instructor ?? undefined,
    waitlistEnabled: row?.waitlist_enabled ?? true,
  };
}

function byStudentId<T extends StudentIdRecord>(rows: T[]): Record<string, T[]> {
  return rows.reduce<Record<string, T[]>>((acc, row) => {
    if (!acc[row.student_id]) acc[row.student_id] = [];
    acc[row.student_id].push(row);
    return acc;
  }, {});
}

export async function loadPortalDataFromDb(): Promise<PortalData> {
  const student = await getCurrentStudentByAuth();
  if (!student) {
    throw new Error('No student linked to this account');
  }

  const studentId = student.id;
  const [
    packageInfoRes,
    lessonsRes,
    availabilityRes,
    documentsRes,
    invoicesRes,
    progressRes,
    checklistRes,
    threadsRes,
    messagesRes,
    notificationsRes,
    reminderRes,
    preferencesRes,
  ] = await Promise.all([
    supabase.from('package_infos').select('*').eq('student_id', studentId).maybeSingle(),
    supabase.from('lessons').select('*').eq('student_id', studentId).order('start_at', { ascending: true }),
    supabase.from('availability_slots').select('*').eq('student_id', studentId).order('start_at', { ascending: true }),
    supabase.from('documents').select('*').eq('student_id', studentId),
    supabase.from('invoices').select('*').eq('student_id', studentId).order('due_date', { ascending: false }),
    supabase.from('progress_items').select('*').eq('student_id', studentId).order('updated_at', { ascending: false }),
    supabase.from('checklist_items').select('*').eq('student_id', studentId),
    supabase.from('message_threads').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
    supabase.from('messages').select('*,message_threads!inner(student_id)').eq('message_threads.student_id', studentId),
    supabase.from('notifications').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
    supabase.from('reminder_settings').select('*').eq('student_id', studentId).maybeSingle(),
    supabase.from('booking_preferences').select('*').eq('student_id', studentId).maybeSingle(),
  ]);

  const errors = [
    packageInfoRes.error,
    lessonsRes.error,
    availabilityRes.error,
    documentsRes.error,
    invoicesRes.error,
    progressRes.error,
    checklistRes.error,
    threadsRes.error,
    messagesRes.error,
    notificationsRes.error,
    reminderRes.error,
    preferencesRes.error,
  ].filter(Boolean);
  if (errors.length > 0) {
    throw errors[0] as Error;
  }

  const rawMessages = ((messagesRes.data as Tables['messages']['Row'][] | null) ?? []).map((row) => ({
    id: row.id,
    thread_id: row.thread_id,
    sender: row.sender,
    body: row.body,
    created_at: row.created_at,
  }));

  return {
    profile: toStudentProfile(student),
    documents: (((documentsRes.data as Tables['documents']['Row'][] | null) ?? []).map(toDocument)),
    lessons: (((lessonsRes.data as Tables['lessons']['Row'][] | null) ?? []).map(toLesson)),
    availability: (((availabilityRes.data as Tables['availability_slots']['Row'][] | null) ?? []).map(toAvailabilitySlot)),
    bookingPreferences: toBookingPreferences(preferencesRes.data),
    packageInfo: toPackageInfo(packageInfoRes.data),
    invoices: (((invoicesRes.data as Tables['invoices']['Row'][] | null) ?? []).map(toInvoice)),
    progress: (((progressRes.data as Tables['progress_items']['Row'][] | null) ?? []).map(toProgress)),
    checklist: (((checklistRes.data as Tables['checklist_items']['Row'][] | null) ?? []).map(toChecklist)),
    instructorAdvice: (student.instructor_advice ?? '').trim(),
    messageThreads: (((threadsRes.data as Tables['message_threads']['Row'][] | null) ?? []).map((thread) =>
      toMessageThread(thread, rawMessages),
    )),
    notifications: (((notificationsRes.data as Tables['notifications']['Row'][] | null) ?? []).map(toNotification)),
    reminderSettings: toReminderSettings(reminderRes.data),
  };
}

function toCalendarSyncState(row: Tables['calendar_sync_state']['Row'] | null): CalendarSyncState {
  return {
    connected: row?.connected ?? false,
    lastSyncAt: row?.last_sync_at ?? null,
    status: row?.status ?? 'Niet gekoppeld',
    pendingItems: row?.pending_items ?? 0,
    externalCalendarName: row?.external_calendar_name ?? 'Google Agenda',
  };
}

function toSchoolAlert(row: Tables['school_alerts']['Row']): SchoolAlert {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity,
  };
}

function toSyncEvent(row: Tables['sync_events']['Row']): SyncEvent {
  return {
    id: row.id,
    studentId: row.student_id ?? 'school',
    entity: row.entity,
    action: row.action,
    updatedAt: row.updated_at,
    version: row.version,
  };
}

export async function loadOwnerPortalDataFromDb(): Promise<OwnerPortalData> {
  const [
    schoolRes,
    calendarRes,
    alertsRes,
    syncRes,
    studentsRes,
    packageRes,
    lessonsRes,
    availabilityRes,
    invoicesRes,
    progressRes,
    checklistRes,
    documentsRes,
    threadsRes,
    messagesRes,
  ] = await Promise.all([
    supabase.from('school_settings').select('*').limit(1).maybeSingle(),
    supabase.from('calendar_sync_state').select('*').eq('id', true).maybeSingle(),
    supabase.from('school_alerts').select('*').order('created_at', { ascending: false }),
    supabase.from('sync_events').select('*').order('updated_at', { ascending: false }).limit(100),
    supabase.from('students').select('*').order('full_name', { ascending: true }),
    supabase.from('package_infos').select('*'),
    supabase.from('lessons').select('*').order('start_at', { ascending: false }),
    supabase.from('availability_slots').select('*').order('start_at', { ascending: true }),
    supabase.from('invoices').select('*').order('due_date', { ascending: false }),
    supabase.from('progress_items').select('*').order('updated_at', { ascending: false }),
    supabase.from('checklist_items').select('*'),
    supabase.from('documents').select('*'),
    supabase.from('message_threads').select('*').order('created_at', { ascending: false }),
    supabase.from('messages').select('*').order('created_at', { ascending: true }),
  ]);

  const errors = [
    schoolRes.error,
    calendarRes.error,
    alertsRes.error,
    syncRes.error,
    studentsRes.error,
    packageRes.error,
    lessonsRes.error,
    availabilityRes.error,
    invoicesRes.error,
    progressRes.error,
    checklistRes.error,
    documentsRes.error,
    threadsRes.error,
    messagesRes.error,
  ].filter(Boolean);
  if (errors.length > 0) {
    throw errors[0] as Error;
  }

  const packageRows = (packageRes.data as Tables['package_infos']['Row'][] | null) ?? [];
  const lessonRows = (lessonsRes.data as Tables['lessons']['Row'][] | null) ?? [];
  const availabilityRows = (availabilityRes.data as Tables['availability_slots']['Row'][] | null) ?? [];
  const invoiceRows = (invoicesRes.data as Tables['invoices']['Row'][] | null) ?? [];
  const progressRows = (progressRes.data as Tables['progress_items']['Row'][] | null) ?? [];
  const checklistRows = (checklistRes.data as Tables['checklist_items']['Row'][] | null) ?? [];
  const documentRows = (documentsRes.data as Tables['documents']['Row'][] | null) ?? [];
  const threadRows = (threadsRes.data as Tables['message_threads']['Row'][] | null) ?? [];
  const messageRows = (messagesRes.data as Tables['messages']['Row'][] | null) ?? [];
  const school = (schoolRes.data as Tables['school_settings']['Row'] | null) ?? null;

  const packageByStudent = packageRows.reduce<Record<string, Tables['package_infos']['Row']>>((acc, row) => {
    acc[row.student_id] = row;
    return acc;
  }, {});
  const lessonsByStudent = byStudentId(lessonRows);
  const availabilityByStudent = byStudentId(availabilityRows);
  const invoicesByStudent = byStudentId(invoiceRows);
  const progressByStudent = byStudentId(progressRows);
  const checklistByStudent = byStudentId(checklistRows);
  const documentsByStudent = byStudentId(documentRows);
  const threadsByStudent = byStudentId(threadRows);

  const allMessages = messageRows;

  const students: OwnerStudentRecord[] = (((studentsRes.data as StudentRow[] | null) ?? []).map((student) => {
    const studentThreads = (threadsByStudent[student.id] ?? []).map((thread) => toMessageThread(thread, allMessages));
    return {
      id: student.id,
      status: student.status,
      profile: toStudentProfile(student),
      packageInfo: toPackageInfo(packageByStudent[student.id] ?? null),
      lessons: (lessonsByStudent[student.id] ?? []).map(toLesson),
      availability: (availabilityByStudent[student.id] ?? []).map(toAvailabilitySlot),
      invoices: (invoicesByStudent[student.id] ?? []).map(toInvoice),
      progress: (progressByStudent[student.id] ?? []).map(toProgress),
      checklist: (checklistByStudent[student.id] ?? []).map(toChecklist),
      documents: (documentsByStudent[student.id] ?? []).map(toDocument),
      messageThreads: studentThreads,
      internalNote: student.internal_note ?? undefined,
      instructorAdvice: (student.instructor_advice ?? '').trim(),
      updatedAt: student.updated_at,
      version: student.version,
    };
  }));

  return {
    schoolName: school?.school_name ?? 'Dynamiek Rijschool',
    schoolTimezone: school?.school_timezone ?? 'Europe/Amsterdam',
    instructors: school?.instructors ?? [],
    students,
    calendarSync: toCalendarSyncState(calendarRes.data),
    alerts: (((alertsRes.data as Tables['school_alerts']['Row'][] | null) ?? []).map(toSchoolAlert)),
    syncEvents: (((syncRes.data as Tables['sync_events']['Row'][] | null) ?? []).map(toSyncEvent)),
  };
}
