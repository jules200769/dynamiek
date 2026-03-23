import { useMemo, useState } from 'react';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime } from '@/src/lib/portal/format';

export default function PortalMessagesPage() {
  const { data, loading, error, sendMessage, setThreadUnread, toggleThreadPinned, markNotificationRead } = usePortal();
  const [search, setSearch] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Berichten en notificaties" description="Inbox, systeemmeldingen en communicatie met de rijschool." />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Berichten niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const activeThreads = data.messageThreads;
  const filteredThreads = useMemo(
    () =>
      activeThreads.filter((thread) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return thread.subject.toLowerCase().includes(q) || thread.type.toLowerCase().includes(q);
      }),
    [activeThreads, search],
  );

  const selectedThread =
    filteredThreads.find((thread) => thread.id === selectedThreadId) ??
    filteredThreads[0] ??
    null;

  const totalUnread = activeThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  const handleSend = async () => {
    if (!selectedThread || !draftMessage.trim()) return;
    setSendState('sending');
    try {
      await sendMessage(selectedThread.id, draftMessage.trim());
      setDraftMessage('');
      setSendState('success');
      setTimeout(() => setSendState('idle'), 1200);
    } catch {
      setSendState('error');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Berichten en notificaties" description="Minder WhatsApp-chaos: centraal overzicht van berichten, threads en systeemmeldingen." />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        Ongelezen berichten: <span className="font-semibold text-slate-900">{totalUnread}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Inbox" subtitle="Zoek, filter en beheer threads">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Zoek op onderwerp of type..."
            className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          {filteredThreads.length === 0 ? (
            <EmptyState title="Geen threads gevonden" description="Pas je zoekterm aan." />
          ) : (
            <div className="grid gap-2">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`rounded-xl border p-3 ${selectedThread?.id === thread.id ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
                >
                  <button type="button" onClick={() => setSelectedThreadId(thread.id)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{thread.subject}</p>
                      {thread.unreadCount > 0 ? (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">{thread.unreadCount}</span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge value={thread.type} />
                      <StatusBadge value={thread.priority} />
                    </div>
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void setThreadUnread(thread.id, thread.unreadCount === 0)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      Markeer {thread.unreadCount > 0 ? 'gelezen' : 'ongelezen'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleThreadPinned(thread.id, !thread.pinned)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      {thread.pinned ? 'Unpin' : 'Pin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Thread en composer" subtitle="Verzenden met success- en errorstates">
          {selectedThread ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{selectedThread.subject}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Type: {selectedThread.type} - Prioriteit: {selectedThread.priority}
                </p>
              </div>
              <div className="max-h-72 space-y-2 overflow-auto pr-1">
                {selectedThread.messages.map((message) => (
                  <div key={message.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{message.sender}</p>
                    <p className="mt-1 text-sm text-slate-700">{message.body}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{formatDateTime(message.createdAt)}</p>
                  </div>
                ))}
              </div>

              <textarea
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                rows={4}
                placeholder="Typ je bericht..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={sendState === 'sending' || !draftMessage.trim()}
                  className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  {sendState === 'sending' ? 'Verzenden...' : 'Versturen'}
                </button>
                {sendState === 'success' ? <p className="self-center text-sm text-emerald-700">Verzonden.</p> : null}
                {sendState === 'error' ? (
                  <button type="button" onClick={() => setSendState('idle')} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700">
                    Fout - opnieuw proberen
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState title="Geen thread geselecteerd" description="Selecteer links een gesprek." />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Notificaties" subtitle="Systeemmeldingen zoals annuleringen en wijzigingen">
        <div className="grid gap-2 md:grid-cols-2">
          {data.notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void markNotificationRead(item.id, true)}
              className="rounded-xl border border-slate-200 p-3 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                {!item.read ? <span className="h-2 w-2 rounded-full bg-rose-500" /> : null}
              </div>
              <p className="mt-1 text-xs text-slate-600">{item.body}</p>
              <p className="mt-2 text-[11px] text-slate-500">{formatDateTime(item.createdAt)}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
