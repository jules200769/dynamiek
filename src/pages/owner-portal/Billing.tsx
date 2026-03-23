import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatCurrency, formatDate } from '@/src/lib/portal/format';

export default function OwnerBillingPage() {
  const { data, loading, error, updateInvoiceStatus } = useOwnerPortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Facturatie" description="Openstaande, verlopen en betaalde facturen per leerling." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Facturatie niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  const entries = data.students.flatMap((student) =>
    student.invoices.map((invoice) => ({
      studentId: student.id,
      studentName: student.profile.fullName,
      invoice,
    })),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Facturatie" description="Volledig financieel overzicht van de school." />
      <SectionCard title="Facturen">
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.invoice.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{entry.studentName}</p>
                  <p className="text-xs text-slate-600">
                    {entry.invoice.invoiceNumber} - {entry.invoice.period} - vervaldatum {formatDate(entry.invoice.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(entry.invoice.amount)}</p>
                  <StatusBadge value={entry.invoice.status} />
                  {entry.invoice.status !== 'Betaald' ? (
                    <button
                      type="button"
                      onClick={() =>
                        void updateInvoiceStatus({
                          studentId: entry.studentId,
                          invoiceId: entry.invoice.id,
                          status: 'Betaald',
                        })
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Markeer betaald
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
