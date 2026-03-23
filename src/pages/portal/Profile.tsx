import { useState } from 'react';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime } from '@/src/lib/portal/format';
import type { StudentDocument, StudentProfile } from '@/src/types/portal';

function validateProfile(profile: StudentProfile) {
  const errors: Partial<Record<keyof StudentProfile, string>> = {};
  if (!profile.fullName.trim()) errors.fullName = 'Naam is verplicht.';
  if (!profile.dateOfBirth.trim()) errors.dateOfBirth = 'Geboortedatum is verplicht.';
  if (!profile.phone.trim()) errors.phone = 'Telefoonnummer is verplicht.';
  if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = 'Voer een geldig e-mailadres in.';
  return errors;
}

function getUploadStatus(nextFile: File): StudentDocument['status'] {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowed.includes(nextFile.type)) return 'rejected';
  if (nextFile.size > 5 * 1024 * 1024) return 'rejected';
  return 'uploaded';
}

/** Static list — must not use hooks after loading/error early returns (Rules of Hooks). */
const REQUIRED_PROFILE_FIELDS: (keyof StudentProfile)[] = ['fullName', 'dateOfBirth', 'phone', 'email'];

export default function PortalProfilePage() {
  const { data, loading, error, saveProfile, updateDocuments } = usePortal();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);

  const [draft, setDraft] = useState<StudentProfile | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof StudentProfile, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Persoonlijke gegevens" description="Beheer je profiel en documenten." />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Profiel niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const profile = draft ?? data.profile;
  const docs = data.documents;

  const handleStartEdit = () => {
    setDraft({ ...data.profile });
    setEditing(true);
    setFieldErrors({});
    setSavedLabel(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    const errors = validateProfile(draft);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);
    // #region agent log
    fetch('http://127.0.0.1:7620/ingest/3700e228-2541-4bc9-8154-c88faffd3439', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '19c8fa' },
      body: JSON.stringify({
        sessionId: '19c8fa',
        runId: 'profile-save',
        hypothesisId: 'H400',
        location: 'Profile.tsx:handleSave',
        message: 'saveProfile attempt',
        data: { hasDraft: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    try {
      await saveProfile(draft);
      setEditing(false);
      setDraft(null);
      setSavedLabel('Profiel opgeslagen.');
    } catch (err: unknown) {
      const e = err as { message?: string; details?: string; hint?: string };
      const msg = e.details || e.message || e.hint || 'Opslaan mislukt. Probeer het opnieuw.';
      setSaveError(String(msg));
      // #region agent log
      fetch('http://127.0.0.1:7620/ingest/3700e228-2541-4bc9-8154-c88faffd3439', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '19c8fa' },
        body: JSON.stringify({
          sessionId: '19c8fa',
          runId: 'profile-save',
          hypothesisId: 'H400',
          location: 'Profile.tsx:handleSave:catch',
          message: 'saveProfile failed',
          data: { errType: err?.constructor?.name },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(null);
    setEditing(false);
    setFieldErrors({});
  };

  const handleUpload = async (documentId: string, nextFile: File | null) => {
    if (!nextFile) return;
    const nextStatus = getUploadStatus(nextFile);

    const nextDocuments = docs.map((document) => {
      if (document.id !== documentId) return document;
      if (nextStatus === 'rejected') {
        return {
          ...document,
          status: 'rejected',
          rejectionReason: 'Alleen JPG, PNG of PDF tot 5MB is toegestaan.',
        };
      }
      return {
        ...document,
        status: document.fileName ? 'replace' : 'uploaded',
        fileName: nextFile.name,
        uploadedAt: new Date().toISOString(),
        rejectionReason: undefined,
      };
    });

    await updateDocuments(nextDocuments);
    setSavedLabel('Documentstatus bijgewerkt.');
  };

  const setValue = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Persoonlijke gegevens"
        description="Gegevens wijzigen, CBR-status volgen en documenten uploaden."
        actions={
          editing ? (
            <>
              <button type="button" onClick={handleCancel} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                Annuleren
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </button>
            </>
          ) : (
            <button type="button" onClick={handleStartEdit} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
              Gegevens wijzigen
            </button>
          )
        }
      />

      {savedLabel ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{savedLabel}</div> : null}
      {saveError ? <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">{saveError}</div> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Basisprofiel" subtitle="Naam, adres, geboortedatum en contact">
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ['fullName', 'Naam'],
                ['address', 'Adres'],
                ['city', 'Plaats'],
                ['postalCode', 'Postcode'],
                ['dateOfBirth', 'Geboortedatum'],
                ['phone', 'Telefoonnummer'],
                ['email', 'E-mail'],
                ['trainingStartDate', 'Startdatum opleiding'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <input
                  disabled={!editing}
                  value={profile[key]}
                  onChange={(event) => setValue(key, event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
                />
                {fieldErrors[key] ? <span className="text-xs text-rose-600">{fieldErrors[key]}</span> : null}
              </label>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            Verplicht: {REQUIRED_PROFILE_FIELDS.join(', ')}
          </div>
        </SectionCard>

        <SectionCard title="CBR en opleiding" subtitle="Theorie en gezondheidsverklaring">
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">CBR-nummer</span>
              <input
                disabled={!editing}
                value={profile.cbrNumber}
                onChange={(event) => setValue('cbrNumber', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Theoriecertificaat</span>
              <input
                disabled={!editing}
                value={profile.theoryCertificateNumber}
                onChange={(event) => setValue('theoryCertificateNumber', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Rijbewijs categorie</span>
              <select
                disabled={!editing}
                value={profile.licenseCategory}
                onChange={(event) => setValue('licenseCategory', event.target.value as StudentProfile['licenseCategory'])}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              >
                <option value="B">B</option>
                <option value="BE">BE</option>
                <option value="A">A</option>
                <option value="AM">AM</option>
              </select>
            </label>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gezondheidsverklaring</p>
              <div className="mt-2">
                <StatusBadge value={profile.healthDeclarationStatus} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Documenten uploaden" subtitle="ID en theoriecertificaat met uploadstatus">
        <div className="grid gap-3 md:grid-cols-2">
          {docs.map((document) => (
            <div key={document.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{document.type}</p>
              <div className="mt-2">
                <StatusBadge value={document.status === 'idle' ? 'In behandeling' : document.status === 'uploaded' ? 'Voltooid' : document.status === 'rejected' ? 'Blokkerend' : 'In behandeling'} />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {document.fileName ? `${document.fileName}${document.uploadedAt ? ` - ${formatDateTime(document.uploadedAt)}` : ''}` : 'Nog geen bestand'}
              </p>
              {document.rejectionReason ? <p className="mt-1 text-xs text-rose-600">{document.rejectionReason}</p> : null}
              <label className="mt-3 inline-flex cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Bestand kiezen
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(event) => void handleUpload(document.id, event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
