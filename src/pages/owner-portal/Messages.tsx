import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatDateTime } from '@/src/lib/portal/format';

export default function OwnerMessagesPage() {
  const { data, loading, error } = useOwnerPortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Berichten" description="Communicatie-overzicht tussen owner/instructeur en leerlingen." />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Berichten niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  const threads = data.students.flatMap((student) =>
    student.messageThreads.map((thread) => ({
      studentName: student.profile.fullName,
      thread,
    })),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Berichten" description="Alle berichtthreads over planning, betaling en voortgang." />
      <SectionCard title="Threads">
        <div className="space-y-2">
          {threads.map((entry) => {
            const lastMessage = entry.thread.messages[entry.thread.messages.length - 1];
            return (
              <div key={entry.thread.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{entry.thread.subject}</p>
                    <p className="text-xs text-slate-600">{entry.studentName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={entry.thread.type} />
                    <StatusBadge value={entry.thread.priority} />
                  </div>
                </div>
                {lastMessage ? (
                  <p className="mt-2 text-xs text-slate-600">
                    Laatste: {lastMessage.body} ({formatDateTime(lastMessage.createdAt)})
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
