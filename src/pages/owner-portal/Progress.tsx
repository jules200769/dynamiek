import { useMemo, useState } from 'react';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatDateTime } from '@/src/lib/portal/format';
import { getReadinessScore } from '@/src/lib/portal/selectors';
import type { OwnerStudentRecord } from '@/src/types/ownerPortal';
import type { ChecklistStatus, ProgressLevel, ProgressTrend } from '@/src/types/portal';

const progressLevels: ProgressLevel[] = ['Beginner', 'Voldoende', 'Goed', 'Examenklaar'];
const progressTrends: ProgressTrend[] = ['stijgend', 'stabiel', 'dalend'];
const checklistStatuses: ChecklistStatus[] = ['Voltooid', 'In behandeling', 'Blokkerend'];

const levelPercent: Record<ProgressLevel, number> = {
  Beginner: 30,
  Voldoende: 60,
  Goed: 80,
  Examenklaar: 100,
};

function studentSelectLabel(s: OwnerStudentRecord) {
  const name = s.profile.fullName.trim();
  const email = s.profile.email.trim();
  if (!email) return name || 'Leerling';
  return `${name || email} · ${email}`;
}

export default function OwnerProgressPage() {
  const {
    data,
    loading,
    error,
    actionError,
    clearActionError,
    createProgressItem,
    updateProgressItem,
    createChecklistItem,
    updateChecklistItem,
  } = useOwnerPortal();
  const [studentId, setStudentId] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);

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

  const readiness = getReadinessScore(student.checklist, student.progress);
  const isExamReady = readiness >= 75 && student.checklist.length > 0 && student.checklist.every((item) => item.status !== 'Blokkerend');

  return (
    <div className="space-y-4">
      <PageHeader
        title="Voortgang"
        description="Inzicht in vaardigheidsgroei en examen-readiness."
        actions={
          <select
            value={student.id}
            onChange={(event) => {
              setStudentId(event.target.value);
              setEditingSkillId(null);
              setEditingChecklistId(null);
              clearActionError();
            }}
            className="max-w-[min(100%,22rem)] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            aria-label="Kies leerling"
          >
            {data.students.map((item) => (
              <option key={item.id} value={item.id}>
                {studentSelectLabel(item)}
              </option>
            ))}
          </select>
        }
      />

      {actionError ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{actionError}</span>
          <button type="button" onClick={() => clearActionError()} className="font-semibold text-rose-900 underline">
            Sluiten
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examengereedheid (indicatie)</p>
            <p className="mt-1 text-xl font-black text-slate-900">{isExamReady ? 'Ja, bijna klaar' : 'Nog niet klaar'}</p>
          </div>
          <StatusBadge value={isExamReady ? 'Voltooid' : 'In behandeling'} />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${readiness}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Score: <span className="font-semibold text-slate-900">{readiness}%</span>
          {student.progress.length === 0 || student.checklist.length === 0 ? (
            <span className="text-slate-500"> — vul vaardigheden en checklist in voor een betrouwbare indicatie.</span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Vaardigheden"
          subtitle="Niveau, trend en notities per onderdeel"
          actions={
            <AddProgressForm
              onCreate={async (skill, level, trend, note) => {
                await createProgressItem(student.id, skill, level, trend, note);
              }}
            />
          }
        >
          {student.progress.length === 0 ? (
            <EmptyState
              title="Nog geen vaardigheden"
              description="Voeg hieronder een eerste onderdeel toe (bijv. kijktechniek of fileertje) om voortgang vast te leggen."
            />
          ) : (
            <div className="space-y-2">
              {student.progress.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  {editingSkillId === item.id ? (
                    <SkillEditor
                      skill={item.skill}
                      initialLevel={item.level}
                      initialTrend={item.trend}
                      initialNote={item.note}
                      onSave={async (level, trend, note) => {
                        await updateProgressItem(item.id, student.id, level, trend, note);
                        setEditingSkillId(null);
                      }}
                      onCancel={() => setEditingSkillId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.skill}</p>
                        <div className="flex items-center gap-2">
                          <StatusBadge value={item.level} />
                          <StatusBadge value={item.trend} />
                        </div>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${levelPercent[item.level]}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{item.note}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.updatedAt)}</p>
                      <button
                        type="button"
                        onClick={() => setEditingSkillId(item.id)}
                        className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Bewerken
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Checklist"
          subtitle="CBR- en schoolvereisten"
          actions={
            <AddChecklistForm
              onCreate={async (requirement, status, advice) => {
                await createChecklistItem(student.id, requirement, status, advice);
              }}
            />
          }
        >
          {student.checklist.length === 0 ? (
            <EmptyState
              title="Nog geen checklistitems"
              description="Voeg punten toe zoals theoriecertificaat of gezondheidsverklaring om examen-readiness te kunnen volgen."
            />
          ) : (
            <div className="space-y-2">
              {student.checklist.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  {editingChecklistId === item.id ? (
                    <ChecklistEditor
                      requirement={item.requirement}
                      initialStatus={item.status}
                      initialAdvice={item.advice ?? ''}
                      onSave={async (status, advice) => {
                        await updateChecklistItem(item.id, student.id, status, advice || null);
                        setEditingChecklistId(null);
                      }}
                      onCancel={() => setEditingChecklistId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.requirement}</p>
                        <StatusBadge value={item.status} />
                      </div>
                      {item.advice ? <p className="mt-1 text-xs text-slate-600">{item.advice}</p> : null}
                      {item.blocker ? <p className="mt-1 text-xs text-rose-600">{item.blocker}</p> : null}
                      <button
                        type="button"
                        onClick={() => setEditingChecklistId(item.id)}
                        className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Bewerken
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function AddProgressForm({
  onCreate,
}: {
  onCreate: (skill: string, level: ProgressLevel, trend: ProgressTrend, note: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState<ProgressLevel>('Beginner');
  const [trend, setTrend] = useState<ProgressTrend>('stabiel');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-primary/30 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
      >
        + Vaardigheid
      </button>
    );
  }

  return (
    <form
      className="flex w-full min-w-[12rem] flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-left sm:min-w-[14rem]"
      onSubmit={async (e) => {
        e.preventDefault();
        const trimmed = skill.trim();
        if (!trimmed) return;
        setSaving(true);
        try {
          await onCreate(trimmed, level, trend, note);
          setSkill('');
          setNote('');
          setLevel('Beginner');
          setTrend('stabiel');
          setOpen(false);
        } finally {
          setSaving(false);
        }
      }}
    >
      <input
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Onderdeel (bijv. fileertje)"
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
        required
      />
      <div className="grid grid-cols-2 gap-1">
        <select value={level} onChange={(e) => setLevel(e.target.value as ProgressLevel)} className="rounded-lg border border-slate-200 px-1 py-1 text-[11px]">
          {progressLevels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select value={trend} onChange={(e) => setTrend(e.target.value as ProgressTrend)} className="rounded-lg border border-slate-200 px-1 py-1 text-[11px]">
          {progressTrends.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notitie (optioneel)"
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
      />
      <div className="flex gap-1">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
          Annuleer
        </button>
        <button type="submit" disabled={saving || !skill.trim()} className="rounded-lg bg-primary px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-50">
          {saving ? '…' : 'Toevoegen'}
        </button>
      </div>
    </form>
  );
}

function AddChecklistForm({
  onCreate,
}: {
  onCreate: (requirement: string, status: ChecklistStatus, advice: string | null) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [status, setStatus] = useState<ChecklistStatus>('In behandeling');
  const [advice, setAdvice] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-primary/30 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
      >
        + Checklist
      </button>
    );
  }

  return (
    <form
      className="flex w-full min-w-[12rem] flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-left sm:min-w-[14rem]"
      onSubmit={async (e) => {
        e.preventDefault();
        const trimmed = requirement.trim();
        if (!trimmed) return;
        setSaving(true);
        try {
          await onCreate(trimmed, status, advice.trim() || null);
          setRequirement('');
          setAdvice('');
          setStatus('In behandeling');
          setOpen(false);
        } finally {
          setSaving(false);
        }
      }}
    >
      <input
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        placeholder="Vereiste (bijv. theorie)"
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as ChecklistStatus)} className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs">
        {checklistStatuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input
        value={advice}
        onChange={(e) => setAdvice(e.target.value)}
        placeholder="Advies (optioneel)"
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
      />
      <div className="flex gap-1">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
          Annuleer
        </button>
        <button type="submit" disabled={saving || !requirement.trim()} className="rounded-lg bg-primary px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-50">
          {saving ? '…' : 'Toevoegen'}
        </button>
      </div>
    </form>
  );
}

function SkillEditor({
  skill,
  initialLevel,
  initialTrend,
  initialNote,
  onSave,
  onCancel,
}: {
  skill: string;
  initialLevel: ProgressLevel;
  initialTrend: ProgressTrend;
  initialNote: string;
  onSave: (level: ProgressLevel, trend: ProgressTrend, note: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [level, setLevel] = useState<ProgressLevel>(initialLevel);
  const [trend, setTrend] = useState<ProgressTrend>(initialTrend);
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">{skill}</p>
      <div className="grid grid-cols-2 gap-2">
        <select value={level} onChange={(e) => setLevel(e.target.value as ProgressLevel)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
          {progressLevels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select value={trend} onChange={(e) => setTrend(e.target.value as ProgressTrend)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
          {progressTrends.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notitie..."
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
      />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
          Annuleren
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(level, trend, note);
            setSaving(false);
          }}
          className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Bezig...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}

function ChecklistEditor({
  requirement,
  initialStatus,
  initialAdvice,
  onSave,
  onCancel,
}: {
  requirement: string;
  initialStatus: ChecklistStatus;
  initialAdvice: string;
  onSave: (status: ChecklistStatus, advice: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<ChecklistStatus>(initialStatus);
  const [advice, setAdvice] = useState(initialAdvice);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">{requirement}</p>
      <select value={status} onChange={(e) => setStatus(e.target.value as ChecklistStatus)} className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs">
        {checklistStatuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input
        value={advice}
        onChange={(e) => setAdvice(e.target.value)}
        placeholder="Advies..."
        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
      />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
          Annuleren
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(status, advice);
            setSaving(false);
          }}
          className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Bezig...' : 'Opslaan'}
        </button>
      </div>
    </div>
  );
}
