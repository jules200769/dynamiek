import type {
  AvailabilitySlot,
  BookingPreferences,
  InvoiceStatus,
  ReminderSettings,
  PortalData,
  StudentDocument,
  StudentProfile,
} from '@/src/types/portal';
import { supabase } from '@/src/lib/supabase/client';
import { getCurrentStudentIdOrThrow, loadPortalDataFromDb } from '@/src/lib/portal/supabaseData';

export const portalService = {
  async loadData(): Promise<PortalData> {
    return loadPortalDataFromDb();
  },

  async saveProfile(profile: StudentProfile) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('students')
      .update({
        full_name: profile.fullName,
        address: profile.address,
        city: profile.city,
        postal_code: profile.postalCode,
        date_of_birth: profile.dateOfBirth || null,
        phone: profile.phone,
        email: profile.email,
        cbr_number: profile.cbrNumber,
        theory_certificate_number: profile.theoryCertificateNumber,
        health_declaration_status: profile.healthDeclarationStatus,
        license_category: profile.licenseCategory,
        training_start_date: profile.trainingStartDate || null,
      })
      .eq('id', studentId);
    if (error) throw error;
    return profile;
  },

  async saveReminderSettings(settings: ReminderSettings) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase.from('reminder_settings').upsert({
      student_id: studentId,
      email: settings.email,
      sms: settings.sms,
      push: settings.push,
      calendar_sync: settings.calendarSync,
    });
    if (error) throw error;
    return settings;
  },

  async saveBookingPreferences(preferences: BookingPreferences) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase.from('booking_preferences').upsert({
      student_id: studentId,
      preferred_time_windows: preferences.preferredTimeWindows,
      preferred_location: preferences.preferredLocation,
      preferred_instructor: preferences.preferredInstructor ?? null,
      waitlist_enabled: preferences.waitlistEnabled,
    });
    if (error) throw error;
    return preferences;
  },

  async updateDocuments(documents: StudentDocument[]) {
    const studentId = await getCurrentStudentIdOrThrow();
    await Promise.all(
      documents.map(async (document) => {
        const { error } = await supabase
          .from('documents')
          .update({
            type: document.type,
            file_name: document.fileName ?? null,
            uploaded_at: document.uploadedAt ?? null,
            status: document.status,
            rejection_reason: document.rejectionReason ?? null,
          })
          .eq('id', document.id)
          .eq('student_id', studentId);
        if (error) throw error;
      }),
    );
    return documents;
  },

  async bookLesson(slot: AvailabilitySlot) {
    const studentId = await getCurrentStudentIdOrThrow();
    const durationMinutes = Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000);
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        student_id: studentId,
        start_at: slot.start,
        end_at: slot.end,
        duration_minutes: durationMinutes,
        pickup_location: slot.location,
        dropoff_location: slot.location,
        instructor: slot.instructor,
        car: slot.car,
        lesson_type: 'Praktijkles',
        status: 'Gepland',
        notes: 'Geboekt via portaal.',
      })
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new Error('Lesson create returned no data');

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'lesson',
      action: 'create',
    });

    return {
      id: data.id,
      start: data.start_at,
      end: data.end_at,
      durationMinutes: data.duration_minutes,
      pickupLocation: data.pickup_location,
      dropoffLocation: data.dropoff_location,
      instructor: data.instructor,
      car: data.car,
      lessonType: data.lesson_type,
      status: data.status,
      notes: data.notes ?? undefined,
      feedback: data.feedback ?? undefined,
    };
  },

  async rescheduleLesson(lessonId: string, slot: AvailabilitySlot) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('lessons')
      .update({
        start_at: slot.start,
        end_at: slot.end,
        duration_minutes: Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000),
        pickup_location: slot.location,
        dropoff_location: slot.location,
        instructor: slot.instructor,
        car: slot.car,
        status: 'Gepland',
      })
      .eq('id', lessonId)
      .eq('student_id', studentId);
    if (error) throw error;

    await supabase.from('sync_events').insert({
      student_id: studentId,
      entity: 'lesson',
      action: 'update',
    });

    const fresh = await loadPortalDataFromDb();
    return fresh.lessons;
  },

  async cancelLesson(lessonId: string) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('lessons')
      .update({ status: 'Geannuleerd' })
      .eq('id', lessonId)
      .eq('student_id', studentId);
    if (error) throw error;

    await Promise.all([
      supabase.from('notifications').insert({
        student_id: studentId,
        title: 'Les geannuleerd',
        body: 'Je les is geannuleerd in het portaal.',
        read: false,
        kind: 'Planning',
      }),
      supabase.from('sync_events').insert({
        student_id: studentId,
        entity: 'lesson',
        action: 'update',
      }),
    ]);

    const fresh = await loadPortalDataFromDb();
    return fresh.lessons;
  },

  async sendMessage(threadId: string, body: string) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        sender: 'Leerling',
        body,
      })
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new Error('Message create returned no data');

    await Promise.all([
      supabase.from('message_threads').update({ unread_count: 0 }).eq('id', threadId).eq('student_id', studentId),
      supabase.from('sync_events').insert({
        student_id: studentId,
        entity: 'profile',
        action: 'update',
      }),
    ]);

    return {
      id: data.id,
      sender: data.sender,
      body: data.body,
      createdAt: data.created_at,
    };
  },

  async setThreadUnread(threadId: string, unread: boolean) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('message_threads')
      .update({ unread_count: unread ? 1 : 0 })
      .eq('id', threadId)
      .eq('student_id', studentId);
    if (error) throw error;
  },

  async toggleThreadPinned(threadId: string, pinned: boolean) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('message_threads')
      .update({ pinned })
      .eq('id', threadId)
      .eq('student_id', studentId);
    if (error) throw error;
  },

  async markNotificationRead(notificationId: string, read: boolean) {
    const studentId = await getCurrentStudentIdOrThrow();
    const { error } = await supabase
      .from('notifications')
      .update({ read })
      .eq('id', notificationId)
      .eq('student_id', studentId);
    if (error) throw error;
  },

  async startMockCheckout(input: {
    productId: string;
    label: string;
    amount: number;
    paymentMethod: 'iDEAL' | 'Kaart';
  }): Promise<{ id: string; amount: number }> {
    const studentId = await getCurrentStudentIdOrThrow();
    const { data, error } = await supabase
      .from('payment_attempts')
      .insert({
        student_id: studentId,
        product_id: input.productId,
        label: input.label,
        amount: input.amount,
        payment_method: input.paymentMethod,
        status: 'pending',
      })
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new Error('Payment attempt create returned no data');
    return { id: data.id, amount: Number(data.amount) };
  },

  async finalizeMockCheckout(attemptId: string, succeeded: boolean) {
    const studentId = await getCurrentStudentIdOrThrow();
    const status = succeeded ? 'succeeded' : 'failed';
    const { data: updatedAttempt, error } = await supabase
      .from('payment_attempts')
      .update({ status })
      .eq('id', attemptId)
      .eq('student_id', studentId)
      .select('*')
      .single();
    if (error) throw error;
    if (!updatedAttempt) throw new Error('Payment attempt update returned no data');

    if (succeeded) {
      const now = new Date();
      const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const invoiceNumber = `WEB-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate(),
      ).padStart(2, '0')}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;
      const period = `${now.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })} extra aanschaf`;

      const invoiceStatus: InvoiceStatus = 'In behandeling';
      const upsertInvoice = supabase.from('invoices').insert({
        student_id: studentId,
        invoice_number: invoiceNumber,
        period,
        amount: updatedAttempt.amount,
        due_date: dueDate.toISOString().slice(0, 10),
        status: invoiceStatus,
      });

      const increaseBalance = supabase
        .from('package_infos')
        .select('open_balance')
        .eq('student_id', studentId)
        .maybeSingle()
        .then(async ({ data, error: readError }) => {
          if (readError) throw readError;
          const current = Number(data?.open_balance ?? 0);
          const { error: writeError } = await supabase
            .from('package_infos')
            .upsert({ student_id: studentId, open_balance: current + Number(updatedAttempt.amount) });
          if (writeError) throw writeError;
        });

      const addNotification = supabase.from('notifications').insert({
        student_id: studentId,
        title: 'Betaling verwerkt',
        body: 'Je checkout is verwerkt en toegevoegd aan je factuuroverzicht.',
        read: false,
        kind: 'Betaling',
      });

      await Promise.all([upsertInvoice, increaseBalance, addNotification]);
    }
  },
};
