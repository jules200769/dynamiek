import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import { formatCurrency } from '@/src/lib/portal/format';

export default function OwnerStudentsPage() {
  const { data, loading, error } = useOwnerPortal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.students.filter((student) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        student.profile.fullName.toLowerCase().includes(q) ||
        student.profile.email.toLowerCase().includes(q) ||
        student.profile.city.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Leerlingen" description="Overzicht van alle ingelogde leerlingen." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Leerlingen niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Leerlingen"
        description="Beheer alle leerlingdossiers vanuit een centrale lijst."
        actions={
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek op naam, e-mail of stad"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:w-72"
          />
        }
      />

      <SectionCard title="Leerlingenlijst" subtitle={`${filtered.length} van ${data.students.length} zichtbaar`}>
        {filtered.length === 0 ? (
          <EmptyState title="Geen resultaten" description="Pas je zoekterm aan om leerlingen te vinden." />
        ) : (
          <div className="space-y-2">
            {filtered.map((student) => (
              <Link
                key={student.id}
                to={`/owner/leerlingen/${student.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">{student.profile.fullName}</p>
                  <p className="text-xs text-slate-600">
                    {student.profile.city} - {student.profile.email}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-slate-900">{student.status}</p>
                  <p className="text-xs text-slate-600">Open saldo: {formatCurrency(student.packageInfo.openBalance)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
