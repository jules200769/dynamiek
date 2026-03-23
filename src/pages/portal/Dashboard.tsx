import { Link } from 'react-router-dom';
import { usePortal } from '@/src/components/portal/PortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatCard from '@/src/components/portal/StatCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import TimelineRow from '@/src/components/portal/TimelineRow';
import { formatCurrency, formatDateTime } from '@/src/lib/portal/format';
import { getConsumedMinutes, getReadinessScore, getRemainingMinutes, getScheduledMinutes, getUpcomingLessons } from '@/src/lib/portal/selectors';

export default function PortalDashboardPage() {
  const { data, loading, error } = usePortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Dashboard" description="Overzicht van je opleiding, lessen en betalingen." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Dashboard niet beschikbaar"
        description={error ?? 'Geen data beschikbaar.'}
      />
    );
  }

  const upcoming = getUpcomingLessons(data.lessons);
  const nextLesson = upcoming[0];
  const consumed = getConsumedMinutes(data.lessons);
  const scheduled = getScheduledMinutes(data.lessons);
  const remaining = getRemainingMinutes(data.packageInfo.totalMinutes, consumed, data.packageInfo.extraMinutes);
  const readiness = getReadinessScore(data.checklist, data.progress);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Alles in een oogopslag: komende les, voortgang, saldo en aandachtspunten."
        actions={
          <>
            <Link
              to="/portaal/agenda"
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Les boeken
            </Link>
            <Link
              to="/portaal/betalingen"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Betalingen bekijken
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resterende tijd" value={remaining} mode="minutes" />
        <StatCard label="Reeds gereden" value={consumed} mode="minutes" />
        <StatCard label="Gepland" value={scheduled} mode="minutes" />
        <StatCard label="Openstaand saldo" value={formatCurrency(data.packageInfo.openBalance)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Volgende les" subtitle="Eerstvolgende geplande of bevestigde les">
          {nextLesson ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{formatDateTime(nextLesson.start)}</p>
                <StatusBadge value={nextLesson.status} />
              </div>
              <p className="text-sm text-slate-600">
                {nextLesson.instructor} - {nextLesson.car}
              </p>
              <p className="text-sm text-slate-600">
                {nextLesson.pickupLocation} naar {nextLesson.dropoffLocation}
              </p>
              {nextLesson.notes ? (
                <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-700">{nextLesson.notes}</p>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Geen komende lessen"
              description="Plan je volgende praktijkles in de agenda."
              action={
                <Link to="/portaal/agenda" className="text-sm font-semibold text-primary">
                  Naar agenda
                </Link>
              }
            />
          )}
        </SectionCard>

        <SectionCard title="Examengereedheid" subtitle="Indicatie op basis van checklist en voortgang">
          <div className="space-y-3">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${readiness}%` }} />
            </div>
            <p className="text-sm text-slate-700">
              <span className="font-bold text-slate-900">{readiness}%</span> van je examendoelen behaald.
            </p>
            <p className="text-sm text-slate-600">{data.instructorAdvice}</p>
            <Link to="/portaal/voortgang" className="text-sm font-semibold text-primary">
              Bekijk volledige opleidingskaart
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Notificaties" subtitle="Recente updates van je rijschool">
          <div className="space-y-2">
            {data.notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  {!item.read ? <span className="h-2 w-2 rounded-full bg-rose-500" /> : null}
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.body}</p>
              </div>
            ))}
            <Link to="/portaal/berichten" className="text-sm font-semibold text-primary">
              Alles bekijken
            </Link>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recente lessen" subtitle="Laatste lesactiviteiten en feedback">
        <div className="grid gap-2 md:grid-cols-2">
          {data.lessons.slice().reverse().slice(0, 4).map((lesson) => (
            <div key={lesson.id}>
              <TimelineRow lesson={lesson} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
