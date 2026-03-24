import type {
  NewPlannedLessonInput,
  OwnerPortalData,
  UpdateInvoiceStatusInput,
  UpdateLessonStatusInput,
} from '@/src/types/ownerPortal';
import type { ChecklistStatus, ProgressLevel, ProgressTrend } from '@/src/types/portal';
import { supabase } from '@/src/lib/supabase/client';
import { loadOwnerPortalDataFromDb } from '@/src/lib/portal/supabaseData';

export const ownerPortalService = {
  async loadData(): Promise<OwnerPortalData> {
    return loadOwnerPortalDataFromDb();
  },

  async scheduleLesson(input: NewPlannedLessonInput) {
    const durationMinutes = Math.round((new Date(input.end).getTime() - new Date(input.start).getTime()) / 60000);
    const { error } = await supabase.from('lessons').insert({
      student_id: input.studentId,
      start_at: input.start,
      end_at: input.end,
      duration_minutes: durationMinutes,
      pickup_location: input.location,
      dropoff_location: input.location,
      instructor: input.instructor,
      car: input.car,
      lesson_type: input.lessonType,
      status: 'Gepland',
      notes: 'Ingepland via owner-portaal',
    });
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: input.studentId,
      entity: 'lesson',
      action: 'create',
    });

    return loadOwnerPortalDataFromDb();
  },

  async updateLessonStatus(input: UpdateLessonStatusInput) {
    const { error } = await supabase
      .from('lessons')
      .update({ status: input.status })
      .eq('id', input.lessonId)
      .eq('student_id', input.studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: input.studentId,
      entity: 'lesson',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async updateInvoiceStatus(input: UpdateInvoiceStatusInput) {
    const { error } = await supabase
      .from('invoices')
      .update({ status: input.status })
      .eq('id', input.invoiceId)
      .eq('student_id', input.studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: input.studentId,
      entity: 'invoice',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async setInternalNote(studentId: string, note: string) {
    const { error } = await supabase.from('students').update({ internal_note: note }).eq('id', studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'profile',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async setInstructorAdvice(studentId: string, advice: string) {
    const { error } = await supabase.from('students').update({ instructor_advice: advice.trim() }).eq('id', studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'profile',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async createProgressItem(
    studentId: string,
    skill: string,
    level: ProgressLevel,
    trend: ProgressTrend,
    note: string,
  ) {
    const { error } = await supabase.from('progress_items').insert({
      student_id: studentId,
      skill: skill.trim(),
      level,
      trend,
      note: note.trim(),
    });
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'progress',
      action: 'create',
    });

    return loadOwnerPortalDataFromDb();
  },

  async updateProgressItem(itemId: string, studentId: string, level: ProgressLevel, trend: ProgressTrend, note: string) {
    const { error } = await supabase
      .from('progress_items')
      .update({ level, trend, note })
      .eq('id', itemId)
      .eq('student_id', studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'progress',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async createChecklistItem(studentId: string, requirement: string, status: ChecklistStatus, advice: string | null) {
    const { error } = await supabase.from('checklist_items').insert({
      student_id: studentId,
      requirement: requirement.trim(),
      status,
      advice: advice?.trim() || null,
    });
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'progress',
      action: 'create',
    });

    return loadOwnerPortalDataFromDb();
  },

  async updateChecklistItem(itemId: string, studentId: string, status: ChecklistStatus, advice: string | null) {
    const { error } = await supabase
      .from('checklist_items')
      .update({ status, advice })
      .eq('id', itemId)
      .eq('student_id', studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'progress',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async sendOwnerMessage(threadId: string, studentId: string, body: string) {
    const { error } = await supabase.from('messages').insert({
      thread_id: threadId,
      sender: 'Rijschool',
      body,
    });
    if (error) throw error;

    await supabase.from('message_threads').update({ unread_count: 0 }).eq('id', threadId).eq('student_id', studentId);

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'profile',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },

  async runCalendarSync() {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('calendar_sync_state')
      .upsert({
        id: true,
        connected: true,
        status: 'Actief',
        pending_items: 0,
        last_sync_at: now,
      });
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: null,
      entity: 'calendar',
      action: 'update',
    });

    return loadOwnerPortalDataFromDb();
  },
};
