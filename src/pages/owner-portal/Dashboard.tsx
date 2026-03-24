import { Link } from 'react-router-dom';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatCard from '@/src/components/portal/StatCard';
import { formatCurrency } from '@/src/lib/portal/format';

export default function OwnerDashboardPage() {
  const { data, loading, error } = useOwnerPortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Owner dashboard" description="Volledig schooloverzicht met planning, uren en financiële status." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Owner dashboard niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  const totalStudents = data.students.length;
  const activeStudents = data.students.filter((student) => student.status === 'Actief').length;
  const scheduledLessons = data.students
    .flatMap((student) => student.lessons)
    .filter((lesson) => lesson.status === 'Gepland' || lesson.status === 'Bevestigd').length;
  const completedLessons = data.students.flatMap((student) => student.lessons).filter((lesson) => lesson.status === 'Voltooid')
    .length;
  const openAmount = data.students.reduce((sum, student) => sum + student.packageInfo.openBalance, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Owner dashboard"
        description="Alle operationele data van de school in een oogopslag."
        actions={
          <>
            <Link to="/owner/leerlingen" className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
              Leerlingen beheren
            </Link>
            <Link to="/owner/planning" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Planning openen
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Totaal leerlingen" value={totalStudents} />
        <StatCard label="Actieve leerlingen" value={activeStudents} />
        <StatCard label="Geplande lessen" value={scheduledLessons} />
        <StatCard label="Voltooide lessen" value={completedLessons} />
        <StatCard label="Open saldo school" value={formatCurrency(openAmount)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Alerts" subtitle="Meldingen die aandacht vragen">
          <div className="space-y-2">
            {data.alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-1 text-xs text-slate-600">{alert.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Kalendersync status" subtitle="Google Calendar-koppeling (status uit database)">
          <div className="space-y-2 text-sm text-slate-700">
            <p>Status: <span className="font-semibold">{data.calendarSync.status}</span></p>
            <p>Agenda: <span className="font-semibold">{data.calendarSync.externalCalendarName}</span></p>
            <p>Openstaande sync-items: <span className="font-semibold">{data.calendarSync.pendingItems}</span></p>
            <Link to="/owner/calendar-sync" className="inline-block text-sm font-semibold text-primary">
              Naar calendar sync
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
