import { useMemo, useState } from 'react';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatCard from '@/src/components/portal/StatCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime, formatMinutes } from '@/src/lib/portal/format';
import { getConsumedMinutes, getOverbookedWarning, getRemainingMinutes, getScheduledMinutes } from '@/src/lib/portal/selectors';

export default function PortalHoursPage() {
  const { data, loading, error } = usePortal();
  const [statusFilter, setStatusFilter] = useState('Alles');
  const [search, setSearch] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Uren en minuten" description="Inzicht in verbruik, planning en resterende lestijd." />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Urenoverzicht niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const consumed = getConsumedMinutes(data.lessons);
  const scheduled = getScheduledMinutes(data.lessons);
  const remaining = getRemainingMinutes(data.packageInfo.totalMinutes, consumed, data.packageInfo.extraMinutes);
  const warning = getOverbookedWarning(remaining, scheduled);

  const filteredHistory = useMemo(
    () =>
      data.lessons
        .filter((lesson) => (statusFilter === 'Alles' ? true : lesson.status === statusFilter))
        .filter((lesson) => {
          if (!search.trim()) return true;
          const normalized = search.toLowerCase();
          return (
            lesson.instructor.toLowerCase().includes(normalized) ||
            lesson.pickupLocation.toLowerCase().includes(normalized) ||
            (lesson.feedback ?? '').toLowerCase().includes(normalized)
          );
        })
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
    [data.lessons, statusFilter, search],
  );

  const selectedLesson =
    filteredHistory.find((lesson) => lesson.id === selectedLessonId) ??
    filteredHistory[0] ??
    null;

  return (
    <div className="space-y-4">
      <PageHeader title="Uren en minuten" description="Voorkom discussies met een transparant minutenoverzicht per les." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Pakket totaal" value={data.packageInfo.totalMinutes} mode="minutes" />
        <StatCard label="Verbruikt" value={consumed} mode="minutes" />
        <StatCard label="Resterend" value={remaining} mode="minutes" />
        <StatCard label="Gepland (nog niet gereden)" value={scheduled} mode="minutes" />
        <StatCard label="Extra tijd" value={data.packageInfo.extraMinutes} mode="minutes" />
      </div>

      {warning ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">{warning}</div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard title="Leshistorie" subtitle="Datum, duur, instructeur en status">
          <div className="mb-3 grid gap-2 md:grid-cols-2">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option>Alles</option>
              <option>Voltooid</option>
              <option>Gepland</option>
              <option>Bevestigd</option>
              <option>Geannuleerd</option>
              <option>Wachtlijst</option>
            </select>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Zoek op instructeur, locatie of feedback..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <EmptyState title="Geen lessen gevonden" description="Pas je filters aan om resultaten te tonen." />
          ) : (
            <div className="grid gap-2">
              {filteredHistory.map((lesson) => (
                <button
                  type="button"
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedLesson?.id === lesson.id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{formatDateTime(lesson.start)}</p>
                    <StatusBadge value={lesson.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {lesson.instructor} - {formatMinutes(lesson.durationMinutes)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Detail en feedback" subtitle="Per les inzichtelijk voor leerling en ouder">
          {selectedLesson ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{formatDateTime(selectedLesson.start)}</p>
                <p className="mt-1 text-xs text-slate-600">Duur: {formatMinutes(selectedLesson.durationMinutes)}</p>
                <p className="mt-1 text-xs text-slate-600">Instructeur: {selectedLesson.instructor}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notities</p>
                <p className="mt-1 text-sm text-slate-700">{selectedLesson.notes ?? 'Geen notities toegevoegd.'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feedback</p>
                <p className="mt-1 text-sm text-slate-700">{selectedLesson.feedback ?? 'Nog geen feedback beschikbaar.'}</p>
              </div>
            </div>
          ) : (
            <EmptyState title="Geen les geselecteerd" description="Selecteer een les om details te zien." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
