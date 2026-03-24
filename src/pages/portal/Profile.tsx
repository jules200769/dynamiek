import { useState } from 'react';
import EmptyState from '@/src/components/portal/EmptyState';
import { BasisprofielFields } from '@/src/components/portal/BasisprofielFields';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatDateTime } from '@/src/lib/portal/format';
import { getProfileFieldErrors, isProfileComplete } from '@/src/lib/portal/profileValidation';
import type { StudentDocument, StudentProfile } from '@/src/types/portal';

function getUploadStatus(nextFile: File): StudentDocument['status'] {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowed.includes(nextFile.type)) return 'rejected';
  if (nextFile.size > 5 * 1024 * 1024) return 'rejected';
  return 'uploaded';
}

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
  const profileIncomplete = !isProfileComplete(data.profile);

  const handleStartEdit = () => {
    setDraft({ ...data.profile });
    setEditing(true);
    setFieldErrors({});
    setSavedLabel(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    const errors = getProfileFieldErrors(draft);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(draft);
      setEditing(false);
      setDraft(null);
      setSavedLabel('Profiel opgeslagen.');
    } catch (err: unknown) {
      const e = err as { message?: string; details?: string; hint?: string };
      const msg = e.details || e.message || e.hint || 'Opslaan mislukt. Probeer het opnieuw.';
      setSaveError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isProfileComplete(data.profile)) return;
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
          profileIncomplete ? null : editing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={profileIncomplete}
                title={profileIncomplete ? 'Vul eerst je verplichte basisgegevens op en sla op.' : undefined}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
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
      {saveError && !profileIncomplete ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">{saveError}</div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {profileIncomplete ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500 xl:col-span-2">
            Je basisprofiel wordt hier getoond zodra je de verplichte gegevens hebt opgeslagen.
          </div>
        ) : (
          <SectionCard title="Basisprofiel" subtitle="Naam, adres, geboortedatum en contact">
            <BasisprofielFields profile={profile} editing={editing} fieldErrors={fieldErrors} setValue={setValue} />
          </SectionCard>
        )}

        <SectionCard title="CBR en opleiding" subtitle="Theorie en gezondheidsverklaring">
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">CBR-nummer</span>
              <input
                disabled={!editing || profileIncomplete}
                value={profile.cbrNumber}
                onChange={(event) => setValue('cbrNumber', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Theoriecertificaat</span>
              <input
                disabled={!editing || profileIncomplete}
                value={profile.theoryCertificateNumber}
                onChange={(event) => setValue('theoryCertificateNumber', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Rijbewijs categorie</span>
              <select
                disabled={!editing || profileIncomplete}
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
                  disabled={profileIncomplete}
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
