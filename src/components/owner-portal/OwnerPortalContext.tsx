import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ownerPortalService } from '@/src/lib/portal/ownerPortalService';
import { supabase } from '@/src/lib/supabase/client';
import type {
  NewPlannedLessonInput,
  OwnerPortalData,
  OwnerPortalScenario,
  OwnerStudentRecord,
  UpdateInvoiceStatusInput,
  UpdateLessonStatusInput,
} from '@/src/types/ownerPortal';

type OwnerPortalContextValue = {
  data: OwnerPortalData | null;
  loading: boolean;
  error: string | null;
  reload: (scenario?: OwnerPortalScenario) => Promise<void>;
  findStudentById: (studentId: string) => OwnerStudentRecord | null;
  scheduleLesson: (input: NewPlannedLessonInput) => Promise<void>;
  updateLessonStatus: (input: UpdateLessonStatusInput) => Promise<void>;
  updateInvoiceStatus: (input: UpdateInvoiceStatusInput) => Promise<void>;
  setInternalNote: (studentId: string, note: string) => Promise<void>;
  runCalendarSync: () => Promise<void>;
};

const OwnerPortalContext = createContext<OwnerPortalContextValue | null>(null);

export function OwnerPortalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OwnerPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (_scenario: OwnerPortalScenario = 'normal') => {
    try {
      setLoading(true);
      setError(null);
      const fresh = await ownerPortalService.loadData();
      setData(fresh);
    } catch {
      setError('Owner-portaaldata kon niet worden geladen.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const tables = [
      'school_settings',
      'students',
      'package_infos',
      'lessons',
      'availability_slots',
      'documents',
      'invoices',
      'progress_items',
      'checklist_items',
      'message_threads',
      'messages',
      'calendar_sync_state',
      'school_alerts',
      'sync_events',
      'notifications',
      'payment_attempts',
    ];
    let channel = supabase.channel('owner-live');
    tables.forEach((table) => {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        () => {
          void reload();
        },
      );
    });
    channel.subscribe();
    return () => {
      void channel.unsubscribe();
    };
  }, [reload]);

  const scheduleLesson = async (input: NewPlannedLessonInput) => {
    const updated = await ownerPortalService.scheduleLesson(input);
    setData(updated);
  };

  const updateLessonStatus = async (input: UpdateLessonStatusInput) => {
    const updated = await ownerPortalService.updateLessonStatus(input);
    setData(updated);
  };

  const updateInvoiceStatus = async (input: UpdateInvoiceStatusInput) => {
    const updated = await ownerPortalService.updateInvoiceStatus(input);
    setData(updated);
  };

  const setInternalNote = async (studentId: string, note: string) => {
    const updated = await ownerPortalService.setInternalNote(studentId, note);
    setData(updated);
  };

  const runCalendarSync = async () => {
    const updated = await ownerPortalService.runCalendarSync();
    setData(updated);
  };

  const findStudentById = (studentId: string) => {
    return data?.students.find((student) => student.id === studentId) ?? null;
  };

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      reload,
      findStudentById,
      scheduleLesson,
      updateLessonStatus,
      updateInvoiceStatus,
      setInternalNote,
      runCalendarSync,
    }),
    [data, loading, error, reload],
  );

  return <OwnerPortalContext.Provider value={value}>{children}</OwnerPortalContext.Provider>;
}

export function useOwnerPortal() {
  const context = useContext(OwnerPortalContext);
  if (!context) {
    throw new Error('useOwnerPortal must be used inside OwnerPortalProvider');
  }
  return context;
}
