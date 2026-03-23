import { useState } from 'react';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatDateTime } from '@/src/lib/portal/format';

export default function OwnerMessagesPage() {
  const { data, loading, error, sendOwnerMessage } = useOwnerPortal();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

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
      studentId: student.id,
      studentName: student.profile.fullName,
      thread,
    })),
  );

  const selectedEntry = threads.find((entry) => entry.thread.id === selectedThreadId) ?? threads[0] ?? null;

  const handleSend = async () => {
    if (!selectedEntry || !draft.trim()) return;
    setSending(true);
    await sendOwnerMessage(selectedEntry.thread.id, selectedEntry.studentId, draft.trim());
    setDraft('');
    setSending(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Berichten" description="Alle berichtthreads over planning, betaling en voortgang." />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <SectionCard title="Threads">
          <div className="space-y-2">
            {threads.map((entry) => {
              const lastMessage = entry.thread.messages[entry.thread.messages.length - 1];
              return (
                <button
                  key={entry.thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(entry.thread.id)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    selectedEntry?.thread.id === entry.thread.id ? 'border-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
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
                    <p className="mt-2 truncate text-xs text-slate-600">
                      {lastMessage.sender}: {lastMessage.body}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Gesprek" subtitle={selectedEntry ? `${selectedEntry.thread.subject} — ${selectedEntry.studentName}` : undefined}>
          {selectedEntry ? (
            <div className="flex flex-col gap-3">
              <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                {selectedEntry.thread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      msg.sender === 'Rijschool'
                        ? 'ml-6 bg-primary/10 text-slate-900'
                        : 'mr-6 bg-white text-slate-700 shadow-sm'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-500">{msg.sender} — {formatDateTime(msg.createdAt)}</p>
                    <p className="mt-1">{msg.body}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Typ een bericht..."
                  rows={2}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
                <button
                  type="button"
                  disabled={sending || !draft.trim()}
                  onClick={() => void handleSend()}
                  className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  {sending ? 'Bezig...' : 'Versturen'}
                </button>
              </div>
            </div>
          ) : (
            <EmptyState title="Selecteer een thread" description="Kies links een berichtthread om het gesprek te bekijken." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
