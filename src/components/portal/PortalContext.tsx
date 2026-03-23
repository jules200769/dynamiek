import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { portalService } from '@/src/lib/portal/portalService';
import { supabase } from '@/src/lib/supabase/client';
import { getCurrentStudentByAuth } from '@/src/lib/portal/supabaseData';
import type {
  AvailabilitySlot,
  Lesson,
  Message,
  PaymentMethod,
  PortalData,
  PortalScenario,
  ReminderSettings,
  StudentDocument,
  StudentProfile,
} from '@/src/types/portal';

type PortalContextValue = {
  data: PortalData | null;
  loading: boolean;
  error: string | null;
  reload: (scenario?: PortalScenario) => Promise<void>;
  saveProfile: (profile: StudentProfile) => Promise<void>;
  saveReminderSettings: (settings: ReminderSettings) => Promise<void>;
  saveBookingPreferences: (preferences: PortalData['bookingPreferences']) => Promise<void>;
  updateDocuments: (documents: StudentDocument[]) => Promise<void>;
  bookLesson: (slot: AvailabilitySlot) => Promise<void>;
  rescheduleLesson: (lessonId: string, slot: AvailabilitySlot) => Promise<void>;
  cancelLesson: (lessonId: string) => Promise<void>;
  sendMessage: (threadId: string, body: string) => Promise<Message>;
  setThreadUnread: (threadId: string, unread: boolean) => Promise<void>;
  toggleThreadPinned: (threadId: string, pinned: boolean) => Promise<void>;
  markNotificationRead: (notificationId: string, read: boolean) => Promise<void>;
  runMockCheckout: (input: { productId: string; label: string; amount: number; paymentMethod: PaymentMethod; success: boolean }) => Promise<void>;
  setLessonsLocal: (updater: (lessons: Lesson[]) => Lesson[]) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (_scenario: PortalScenario = 'normal') => {
    try {
      setLoading(true);
      setError(null);
      const fresh = await portalService.loadData();
      setData(fresh);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error('PortalContext load failed:', detail);
      const hint =
        import.meta.env.DEV && detail
          ? ` (${detail})`
          : '';
      setError(`Portaaldata kon niet worden geladen.${hint}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const tables = [
      'students',
      'package_infos',
      'lessons',
      'availability_slots',
      'documents',
      'invoices',
      'progress_items',
      'checklist_items',
      'message_threads',
      'notifications',
      'reminder_settings',
      'booking_preferences',
      'payment_attempts',
      'sync_events',
    ];

    const startRealtime = async () => {
      const student = await getCurrentStudentByAuth();
      if (!student || !isMounted) return;

      channel = supabase.channel(`portal-live-${student.id}`);
      tables.forEach((table) => {
        const filter = table === 'students' ? `id=eq.${student.id}` : `student_id=eq.${student.id}`;
        channel = channel?.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          () => {
            void reload();
          },
        ) ?? channel;
      });
      channel?.subscribe();
    };

    void startRealtime();

    return () => {
      isMounted = false;
      if (channel) {
        void channel.unsubscribe();
      }
    };
  }, [reload]);

  const saveProfile = async (profile: StudentProfile) => {
    const saved = await portalService.saveProfile(profile);
    setData((prev) => (prev ? { ...prev, profile: saved } : prev));
  };

  const saveReminderSettings = async (settings: ReminderSettings) => {
    const saved = await portalService.saveReminderSettings(settings);
    setData((prev) => (prev ? { ...prev, reminderSettings: saved } : prev));
  };

  const saveBookingPreferences = async (preferences: PortalData['bookingPreferences']) => {
    const saved = await portalService.saveBookingPreferences(preferences);
    setData((prev) => (prev ? { ...prev, bookingPreferences: saved } : prev));
  };

  const updateDocuments = async (documents: StudentDocument[]) => {
    const saved = await portalService.updateDocuments(documents);
    setData((prev) => (prev ? { ...prev, documents: saved } : prev));
  };

  const bookLesson = async (slot: AvailabilitySlot) => {
    const lesson = await portalService.bookLesson(slot);
    setData((prev) => (prev ? { ...prev, lessons: [...prev.lessons, lesson] } : prev));
  };

  const rescheduleLesson = async (lessonId: string, slot: AvailabilitySlot) => {
    const lessons = await portalService.rescheduleLesson(lessonId, slot);
    setData((prev) => (prev ? { ...prev, lessons } : prev));
  };

  const cancelLesson = async (lessonId: string) => {
    const lessons = await portalService.cancelLesson(lessonId);
    setData((prev) => (prev ? { ...prev, lessons } : prev));
  };

  const sendMessage = async (threadId: string, body: string) => {
    const message = await portalService.sendMessage(threadId, body);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messageThreads: prev.messageThreads.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                unreadCount: 0,
                messages: [...thread.messages, message],
              }
            : thread,
        ),
      };
    });
    return message;
  };

  const setThreadUnread = async (threadId: string, unread: boolean) => {
    await portalService.setThreadUnread(threadId, unread);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messageThreads: prev.messageThreads.map((thread) =>
          thread.id === threadId ? { ...thread, unreadCount: unread ? 1 : 0 } : thread,
        ),
      };
    });
  };

  const toggleThreadPinned = async (threadId: string, pinned: boolean) => {
    await portalService.toggleThreadPinned(threadId, pinned);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messageThreads: prev.messageThreads.map((thread) => (thread.id === threadId ? { ...thread, pinned } : thread)),
      };
    });
  };

  const markNotificationRead = async (notificationId: string, read: boolean) => {
    await portalService.markNotificationRead(notificationId, read);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((item) => (item.id === notificationId ? { ...item, read } : item)),
      };
    });
  };

  const runMockCheckout = async (input: {
    productId: string;
    label: string;
    amount: number;
    paymentMethod: PaymentMethod;
    success: boolean;
  }) => {
    const attempt = await portalService.startMockCheckout({
      productId: input.productId,
      label: input.label,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
    });
    await portalService.finalizeMockCheckout(attempt.id, input.success);
    await reload();
  };

  const setLessonsLocal = (updater: (lessons: Lesson[]) => Lesson[]) => {
    setData((prev) => (prev ? { ...prev, lessons: updater(prev.lessons) } : prev));
  };

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      reload,
      saveProfile,
      saveReminderSettings,
      saveBookingPreferences,
      updateDocuments,
      bookLesson,
      rescheduleLesson,
      cancelLesson,
      sendMessage,
      setThreadUnread,
      toggleThreadPinned,
      markNotificationRead,
      runMockCheckout,
      setLessonsLocal,
    }),
    [data, loading, error, reload],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used inside PortalProvider');
  }
  return context;
}
