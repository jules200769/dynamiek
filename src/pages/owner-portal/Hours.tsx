import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import { formatMinutes } from '@/src/lib/portal/format';

export default function OwnerHoursPage() {
  const { data, loading, error } = useOwnerPortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Uren en tijden" description="Tijdtegoed en verbruik per leerling." />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Uren niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  const rows = data.students.map((student) => {
    const planned = student.lessons
      .filter((lesson) => lesson.status === 'Gepland' || lesson.status === 'Bevestigd' || lesson.status === 'Wachtlijst')
      .reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
    const used = student.packageInfo.usedMinutes;
    const remaining = student.packageInfo.totalMinutes + student.packageInfo.extraMinutes - used;
    const overbooked = planned > remaining ? planned - remaining : 0;
    return { student, planned, used, remaining, overbooked };
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Uren en tijden" description="Operationeel overzicht van tegoed, gebruik en overplanning." />
      <SectionCard title="Uren per leerling">
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.student.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 text-sm md:grid-cols-5 md:items-center">
              <p className="font-semibold text-slate-900">{row.student.profile.fullName}</p>
              <p className="text-slate-700">Gebruikt: {formatMinutes(row.used)}</p>
              <p className="text-slate-700">Gepland: {formatMinutes(row.planned)}</p>
              <p className="text-slate-700">Resterend: {formatMinutes(row.remaining)}</p>
              <p className={row.overbooked > 0 ? 'font-semibold text-rose-600' : 'text-slate-500'}>
                {row.overbooked > 0 ? `Overpland: ${formatMinutes(row.overbooked)}` : 'Binnen tegoed'}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
