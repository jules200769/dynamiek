import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ownerPortalService } from '@/src/lib/portal/ownerPortalService';
import { supabase } from '@/src/lib/supabase/client';
import type {
  NewPlannedLessonInput,
  OwnerPortalData,
  OwnerStudentRecord,
  UpdateInvoiceStatusInput,
  UpdateLessonStatusInput,
} from '@/src/types/ownerPortal';
import type { ChecklistStatus, ProgressLevel, ProgressTrend } from '@/src/types/portal';

type OwnerPortalContextValue = {
  data: OwnerPortalData | null;
  loading: boolean;
  error: string | null;
  actionError: string | null;
  clearActionError: () => void;
  reload: () => Promise<void>;
  findStudentById: (studentId: string) => OwnerStudentRecord | null;
  scheduleLesson: (input: NewPlannedLessonInput) => Promise<void>;
  updateLessonStatus: (input: UpdateLessonStatusInput) => Promise<void>;
  updateInvoiceStatus: (input: UpdateInvoiceStatusInput) => Promise<void>;
  setInternalNote: (studentId: string, note: string) => Promise<void>;
  setInstructorAdvice: (studentId: string, advice: string) => Promise<void>;
  sendOwnerMessage: (threadId: string, studentId: string, body: string) => Promise<void>;
  createProgressItem: (
    studentId: string,
    skill: string,
    level: ProgressLevel,
    trend: ProgressTrend,
    note: string,
  ) => Promise<void>;
  updateProgressItem: (itemId: string, studentId: string, level: ProgressLevel, trend: ProgressTrend, note: string) => Promise<void>;
  createChecklistItem: (studentId: string, requirement: string, status: ChecklistStatus, advice: string | null) => Promise<void>;
  updateChecklistItem: (itemId: string, studentId: string, status: ChecklistStatus, advice: string | null) => Promise<void>;
  runCalendarSync: () => Promise<void>;
};

const OwnerPortalContext = createContext<OwnerPortalContextValue | null>(null);

export function OwnerPortalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OwnerPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(async () => {
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

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedReload = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => void reload(), 500);
    };

    let channel = supabase.channel('owner-live');
    tables.forEach((table) => {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        debouncedReload,
      );
    });
    channel.subscribe();
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      void channel.unsubscribe();
    };
  }, [reload]);

  const scheduleLesson = async (input: NewPlannedLessonInput) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.scheduleLesson(input);
      setData(updated);
    } catch (err) {
      setActionError(`Les inplannen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const updateLessonStatus = async (input: UpdateLessonStatusInput) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.updateLessonStatus(input);
      setData(updated);
    } catch (err) {
      setActionError(`Status wijzigen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const updateInvoiceStatus = async (input: UpdateInvoiceStatusInput) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.updateInvoiceStatus(input);
      setData(updated);
    } catch (err) {
      setActionError(`Factuurstatus wijzigen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const setInternalNote = async (studentId: string, note: string) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.setInternalNote(studentId, note);
      setData(updated);
    } catch (err) {
      setActionError(`Notitie opslaan mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const setInstructorAdvice = async (studentId: string, advice: string) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.setInstructorAdvice(studentId, advice);
      setData(updated);
    } catch (err) {
      setActionError(`Advies opslaan mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const createProgressItem = async (
    studentId: string,
    skill: string,
    level: ProgressLevel,
    trend: ProgressTrend,
    note: string,
  ) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.createProgressItem(studentId, skill, level, trend, note);
      setData(updated);
    } catch (err) {
      setActionError(`Vaardigheid toevoegen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const updateProgressItem = async (itemId: string, studentId: string, level: ProgressLevel, trend: ProgressTrend, note: string) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.updateProgressItem(itemId, studentId, level, trend, note);
      setData(updated);
    } catch (err) {
      setActionError(`Voortgang bijwerken mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const createChecklistItem = async (studentId: string, requirement: string, status: ChecklistStatus, advice: string | null) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.createChecklistItem(studentId, requirement, status, advice);
      setData(updated);
    } catch (err) {
      setActionError(`Checklistpunt toevoegen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const updateChecklistItem = async (itemId: string, studentId: string, status: ChecklistStatus, advice: string | null) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.updateChecklistItem(itemId, studentId, status, advice);
      setData(updated);
    } catch (err) {
      setActionError(`Checklist bijwerken mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const sendOwnerMessage = async (threadId: string, studentId: string, body: string) => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.sendOwnerMessage(threadId, studentId, body);
      setData(updated);
    } catch (err) {
      setActionError(`Bericht versturen mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const runCalendarSync = async () => {
    try {
      setActionError(null);
      const updated = await ownerPortalService.runCalendarSync();
      setData(updated);
    } catch (err) {
      setActionError(`Calendar sync mislukt: ${err instanceof Error ? err.message : 'Onbekende fout'}`);
    }
  };

  const findStudentById = (studentId: string) => {
    return data?.students.find((student) => student.id === studentId) ?? null;
  };

  const clearActionError = () => setActionError(null);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      actionError,
      clearActionError,
      reload,
      findStudentById,
      setInstructorAdvice,
      scheduleLesson,
      updateLessonStatus,
      updateInvoiceStatus,
      setInternalNote,
      sendOwnerMessage,
      createProgressItem,
      updateProgressItem,
      createChecklistItem,
      updateChecklistItem,
      runCalendarSync,
    }),
    [data, loading, error, actionError, reload],
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
