import { useMemo, useState } from 'react';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatDateTime } from '@/src/lib/portal/format';

export default function OwnerProgressPage() {
  const { data, loading, error } = useOwnerPortal();
  const [studentId, setStudentId] = useState('');

  const student = useMemo(
    () => data?.students.find((item) => item.id === studentId) ?? data?.students[0],
    [data, studentId],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Voortgang" description="Vaardigheden en checkliststatus per leerling." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Voortgang niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  if (!student) {
    return <EmptyState title="Geen leerling" description="Er is nog geen leerling om voortgang te tonen." />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Voortgang"
        description="Inzicht in vaardigheidsgroei en examen-readiness."
        actions={
          <select
            value={student.id}
            onChange={(event) => setStudentId(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            {data.students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.profile.fullName}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Vaardigheden">
          <div className="space-y-2">
            {student.progress.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.skill}</p>
                  <StatusBadge value={item.trend} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.note}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.updatedAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Checklist">
          <div className="space-y-2">
            {student.checklist.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.requirement}</p>
                  <StatusBadge value={item.status} />
                </div>
                {item.advice ? <p className="mt-1 text-xs text-slate-600">{item.advice}</p> : null}
                {item.blocker ? <p className="mt-1 text-xs text-rose-600">{item.blocker}</p> : null}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
