import type {
  NewPlannedLessonInput,
  OwnerPortalData,
  UpdateInvoiceStatusInput,
  UpdateLessonStatusInput,
} from '@/src/types/ownerPortal';
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
