import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime } from '@/src/lib/portal/format';
import { getReadinessScore } from '@/src/lib/portal/selectors';

const levelPercent: Record<string, number> = {
  Beginner: 30,
  Voldoende: 60,
  Goed: 80,
  Examenklaar: 100,
};

export default function PortalProgressPage() {
  const { data, loading, error } = usePortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Voortgang en opleidingskaart" description="Beoordeling per onderdeel en CBR checklist." />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Voortgang niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const readiness = getReadinessScore(data.checklist, data.progress);
  const isExamReady =
    readiness !== null && readiness >= 75 && data.checklist.every((item) => item.status !== 'Blokkerend');
  const hasExamData = data.checklist.length > 0 || data.progress.length > 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Voortgang en opleidingskaart" description="Volg je niveau op kernvaardigheden en zie wat nog nodig is richting praktijkexamen." />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Klaar voor praktijkexamen</p>
            <p className="mt-1 text-xl font-black text-slate-900">
              {!hasExamData
                ? 'Nog niet bepaald'
                : isExamReady
                  ? 'Ja, bijna klaar'
                  : 'Nog niet klaar'}
            </p>
          </div>
          <StatusBadge value={!hasExamData ? 'In behandeling' : isExamReady ? 'Voltooid' : 'In behandeling'} />
        </div>
        {readiness === null ? (
          <p className="mt-4 text-sm text-slate-600">
            Je rijschool registreert hier je competenties en CBR-checklist. Zodra die gegevens er zijn, verschijnt je
            examengereedheid.
          </p>
        ) : (
          <>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${readiness}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Examengereedheid: <span className="font-semibold text-slate-900">{readiness}%</span>
            </p>
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Competentiekaart" subtitle="Per onderdeel niveau, trend en feedback">
          {data.progress.length === 0 ? (
            <p className="text-sm text-slate-600">
              Er zijn nog geen vaardigheden geregistreerd. Je rijschool voegt onderdelen toe (zoals kijktechniek of invoegen)
              vanuit het owner-portaal.
            </p>
          ) : (
            <div className="grid gap-3">
              {data.progress.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.skill}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={item.level === 'Examenklaar' ? 'Voltooid' : 'In behandeling'} />
                      <StatusBadge value={item.trend} />
                    </div>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-secondary" style={{ width: `${levelPercent[item.level]}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{item.note}</p>
                  <p className="mt-1 text-[11px] text-slate-500">Laatste update: {formatDateTime(item.updatedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="CBR checklist" subtitle="Exameneisen en blockers">
            {data.checklist.length === 0 ? (
              <p className="text-sm text-slate-600">
                Nog geen checklist-items. Je rijschool vult de CBR-vereisten voor jouw dossier in.
              </p>
            ) : (
              <div className="grid gap-2">
                {data.checklist.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.requirement}</p>
                      <StatusBadge value={item.status} />
                    </div>
                    {item.blocker ? <p className="mt-1 text-xs text-rose-600">{item.blocker}</p> : null}
                    {item.advice ? <p className="mt-1 text-xs text-slate-600">{item.advice}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Advies instructeur" subtitle="Concreet vervolg voor komende weken">
            <p className="text-sm text-slate-700">
              {data.instructorAdvice.trim()
                ? data.instructorAdvice
                : 'Je instructeur heeft hier nog geen persoonlijk advies geplaatst.'}
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
