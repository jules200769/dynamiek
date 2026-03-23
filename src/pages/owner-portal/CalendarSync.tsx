import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import { formatDateTime } from '@/src/lib/portal/format';

export default function OwnerCalendarSyncPage() {
  const { data, loading, error, runCalendarSync } = useOwnerPortal();

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Google Calendar sync" description="Synchronisatie tussen schoolplanning en externe agenda." />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Calendar sync niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Google Calendar sync"
        description="Placeholder flow voor latere OAuth/database integratie."
        actions={
          <button
            type="button"
            onClick={() => void runCalendarSync()}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Start sync nu
          </button>
        }
      />

      <SectionCard title="Sync status">
        <div className="space-y-2 text-sm text-slate-700">
          <p>Kalendernaam: <span className="font-semibold">{data.calendarSync.externalCalendarName}</span></p>
          <p>Status: <span className="font-semibold">{data.calendarSync.status}</span></p>
          <p>Verbonden: <span className="font-semibold">{data.calendarSync.connected ? 'Ja' : 'Nee'}</span></p>
          <p>Laatste sync: <span className="font-semibold">{data.calendarSync.lastSyncAt ? formatDateTime(data.calendarSync.lastSyncAt) : 'Nog niet'}</span></p>
          <p>Openstaande items: <span className="font-semibold">{data.calendarSync.pendingItems}</span></p>
        </div>
      </SectionCard>

      <SectionCard title="Sync event-log (mock)">
        <div className="space-y-2">
          {data.syncEvents.slice(0, 8).map((event) => (
            <div key={event.id} className="rounded-lg border border-slate-200 p-2 text-xs text-slate-700">
              <p>
                {event.entity} / {event.action} / {event.studentId}
              </p>
              <p>{formatDateTime(event.updatedAt)} - v{event.version}</p>
            </div>
          ))}
          {data.syncEvents.length === 0 ? (
            <p className="text-sm text-slate-600">Nog geen sync events geregistreerd.</p>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
