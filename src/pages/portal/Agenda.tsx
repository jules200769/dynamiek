import { useMemo, useState } from 'react';
import { CalendarDays, Clock3, RefreshCw, Trash2 } from 'lucide-react';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime } from '@/src/lib/portal/format';
import type { AvailabilitySlot, Lesson, LessonStatus } from '@/src/types/portal';

const statusOptions: LessonStatus[] = ['Gepland', 'Bevestigd', 'Voltooid', 'Geannuleerd', 'Wachtlijst'];

function hoursUntil(start: string) {
  return (new Date(start).getTime() - Date.now()) / (1000 * 60 * 60);
}

function BookLessonDialog({
  open,
  slots,
  onClose,
  onConfirm,
}: {
  open: boolean;
  slots: AvailabilitySlot[];
  onClose: () => void;
  onConfirm: (slot: AvailabilitySlot, preferences: { preferredWindow: string; preferredLocation: string }) => Promise<void>;
}) {
  const [step, setStep] = useState(1);
  const [preferredWindow, setPreferredWindow] = useState('Doordeweeks 18:00-21:00');
  const [preferredLocation, setPreferredLocation] = useState('CS Utrecht Jaarbeurszijde');
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSaving(true);
    await onConfirm(selectedSlot, { preferredWindow, preferredLocation });
    setSaving(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Les boeken</h3>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
            Sluiten
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Stap 1: kies voorkeurstijden en ophaallocatie.</p>
            <select
              value={preferredWindow}
              onChange={(event) => setPreferredWindow(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option>Doordeweeks 18:00-21:00</option>
              <option>Doordeweeks 15:00-18:00</option>
              <option>Zaterdag 09:00-12:00</option>
            </select>
            <input
              value={preferredLocation}
              onChange={(event) => setPreferredLocation(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Beschikbaarheid bekijken
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Stap 2: kies een beschikbaar slot.</p>
            <div className="grid gap-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedSlotId === slot.id ? 'border-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{formatDateTime(slot.start)}</p>
                  <p className="text-xs text-slate-600">
                    {slot.instructor} - {slot.car} - {slot.location}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Terug
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Bevestigen
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Stap 3: bevestig je boeking.</p>
            {selectedSlot ? (
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{formatDateTime(selectedSlot.start)}</p>
                <p className="text-xs text-slate-600">{selectedSlot.instructor} - {selectedSlot.location}</p>
              </div>
            ) : null}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Terug
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={saving || !selectedSlot}
                className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
              >
                {saving ? 'Bezig...' : 'Les boeken'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RescheduleLessonDialog({
  open,
  slots,
  onClose,
  onConfirm,
}: {
  open: boolean;
  slots: AvailabilitySlot[];
  onClose: () => void;
  onConfirm: (slot: AvailabilitySlot) => Promise<void>;
}) {
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Les verplaatsen</h3>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
            Sluiten
          </button>
        </div>
        {slots.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">Er zijn momenteel geen beschikbare slots. Neem contact op met de rijschool.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Kies een nieuw tijdslot voor je les.</p>
            <div className="grid gap-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedSlotId === slot.id ? 'border-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{formatDateTime(slot.start)}</p>
                  <p className="text-xs text-slate-600">
                    {slot.instructor} - {slot.car} - {slot.location}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Annuleren
              </button>
              <button
                type="button"
                disabled={saving || !selectedSlot}
                onClick={async () => {
                  if (!selectedSlot) return;
                  setSaving(true);
                  await onConfirm(selectedSlot);
                  setSaving(false);
                  onClose();
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Bezig...' : 'Verplaatsen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortalAgendaPage() {
  const { data, loading, error, bookLesson, rescheduleLesson, cancelLesson, saveReminderSettings, saveBookingPreferences } = usePortal();
  const [statusFilter, setStatusFilter] = useState<LessonStatus | 'Alles'>('Alles');
  const [instructorFilter, setInstructorFilter] = useState('Alles');
  const [carFilter, setCarFilter] = useState('Alles');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Agenda & Lesplanning" description="Plan, verplaats en annuleer je lessen." />
        <LoadingSkeleton rows={7} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Agenda niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const instructors = ['Alles', ...Array.from(new Set(data.lessons.map((lesson) => lesson.instructor)))];
  const cars = ['Alles', ...Array.from(new Set(data.lessons.map((lesson) => lesson.car)))];

  const filteredLessons = data.lessons
    .filter((lesson) => (statusFilter === 'Alles' ? true : lesson.status === statusFilter))
    .filter((lesson) => (instructorFilter === 'Alles' ? true : lesson.instructor === instructorFilter))
    .filter((lesson) => (carFilter === 'Alles' ? true : lesson.car === carFilter))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const selectedLesson: Lesson | null = filteredLessons.find((item) => item.id === selectedLessonId) ?? filteredLessons[0] ?? null;

  const handleCancel = async (lesson: Lesson) => {
    const hours = hoursUntil(lesson.start);
    if (hours < 24) {
      setAlert('Annuleren binnen 24 uur is niet kosteloos volgens de voorwaarden.');
      return;
    }

    setBusy(lesson.id);
    await cancelLesson(lesson.id);
    setBusy(null);
    setAlert('Les geannuleerd.');
  };

  const handleReschedule = (_lesson: Lesson) => {
    setRescheduleOpen(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Agenda & Lesplanning"
        description="Komende lessen, kalenderweergave, beschikbaarheid, wachtlijst en herinneringen."
        actions={
          <button
            type="button"
            onClick={() => setBookOpen(true)}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Les boeken
          </button>
        }
      />

      {alert ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">{alert}</div>
      ) : null}

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as LessonStatus | 'Alles')} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option>Alles</option>
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select value={instructorFilter} onChange={(event) => setInstructorFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          {instructors.map((instructor) => (
            <option key={instructor}>{instructor}</option>
          ))}
        </select>
        <select value={carFilter} onChange={(event) => setCarFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          {cars.map((car) => (
            <option key={car}>{car}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Kalender en komende lessen" subtitle="Lijstweergave met realtime status">
          {filteredLessons.length === 0 ? (
            <EmptyState title="Geen lessen gevonden" description="Pas je filters aan of boek een nieuwe les." />
          ) : (
            <div className="grid gap-2">
              {filteredLessons.map((lesson) => (
                <button
                  type="button"
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedLesson?.id === lesson.id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{formatDateTime(lesson.start)}</p>
                    <StatusBadge value={lesson.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {lesson.instructor} - {lesson.pickupLocation} - {lesson.car}
                  </p>
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Lesdetails & acties" subtitle="Verplaatsen, annuleren en voorkeuren">
          {selectedLesson ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{formatDateTime(selectedLesson.start)}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {selectedLesson.lessonType} - {selectedLesson.instructor}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {selectedLesson.pickupLocation} naar {selectedLesson.dropoffLocation}
                </p>
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => handleReschedule(selectedLesson)}
                  disabled={busy === selectedLesson.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Les verplaatsen
                </button>
                <button
                  type="button"
                  onClick={() => void handleCancel(selectedLesson)}
                  disabled={busy === selectedLesson.id || selectedLesson.status === 'Geannuleerd'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Les annuleren
                </button>
              </div>

              <div className="grid gap-2 rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Wachtlijst & voorkeurstijden</p>
                <p className="text-sm text-slate-700">
                  {data.bookingPreferences.waitlistEnabled ? 'Wachtlijst staat aan' : 'Wachtlijst staat uit'} -{' '}
                  {data.bookingPreferences.preferredTimeWindows.join(', ')}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState title="Selecteer een les" description="Klik links op een les voor details." />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Beschikbaarheid" subtitle="Eerstvolgende beschikbare tijden">
          <div className="grid gap-2">
            {data.availability.map((slot) => (
              <div key={slot.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{formatDateTime(slot.start)}</p>
                <p className="text-xs text-slate-600">
                  {slot.instructor} - {slot.location} - {slot.car}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Herinneringen & kalender" subtitle="Mail, SMS, push en calendar sync">
          <div className="space-y-2">
            {([
              ['email', 'E-mail herinneringen'],
              ['sms', 'SMS herinneringen'],
              ['push', 'Push notificaties'],
              ['calendarSync', 'Google/Apple calendar sync'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-2">
                  {key === 'calendarSync' ? <CalendarDays size={15} /> : <Clock3 size={15} />}
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={data.reminderSettings[key]}
                  onChange={async () => {
                    await saveReminderSettings({ ...data.reminderSettings, [key]: !data.reminderSettings[key] });
                  }}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </SectionCard>
      </div>

      <BookLessonDialog
        open={bookOpen}
        slots={data.availability}
        onClose={() => setBookOpen(false)}
        onConfirm={async (slot, preferences) => {
          await saveBookingPreferences({
            ...data.bookingPreferences,
            preferredLocation: preferences.preferredLocation,
            preferredTimeWindows: [preferences.preferredWindow],
          });
          await bookLesson(slot);
          setAlert('Nieuwe les is ingepland.');
        }}
      />

      {selectedLesson ? (
        <RescheduleLessonDialog
          open={rescheduleOpen}
          slots={data.availability}
          onClose={() => setRescheduleOpen(false)}
          onConfirm={async (slot) => {
            setBusy(selectedLesson.id);
            await rescheduleLesson(selectedLesson.id, slot);
            setBusy(null);
            setAlert('Les verplaatst naar het gekozen tijdslot.');
          }}
        />
      ) : null}
    </div>
  );
}
