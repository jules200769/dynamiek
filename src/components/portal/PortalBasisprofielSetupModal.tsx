import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BasisprofielFields } from '@/src/components/portal/BasisprofielFields';
import { usePortal } from '@/src/components/portal/PortalContext';
import { useAuth } from '@/src/components/auth/AuthContext';
import { getProfileFieldErrors, isProfileComplete } from '@/src/lib/portal/profileValidation';
import type { StudentProfile } from '@/src/types/portal';

/**
 * Overlay op het portaal (dashboard op de achtergrond) tot het verplichte basisprofiel is opgeslagen.
 */
export default function PortalBasisprofielSetupModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data, loading, error, saveProfile } = usePortal();
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<StudentProfile | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof StudentProfile, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const fromSignup = Boolean((location.state as { fromSignup?: boolean } | null)?.fromSignup);

  useEffect(() => {
    if (loading || error || !data) return;
    if (isProfileComplete(data.profile)) return;
    setDraft((prev) => (prev ? prev : { ...data.profile }));
  }, [loading, error, data]);

  useEffect(() => {
    if (!data || isProfileComplete(data.profile)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [data]);

  if (loading || error || !data || isProfileComplete(data.profile)) {
    return null;
  }

  const profileIncomplete = !isProfileComplete(data.profile);
  const profile = draft ?? data.profile;

  const modalIntro =
    fromSignup && profileIncomplete
      ? 'Welkom! Vul je verplichte basisgegevens in en klik op Opslaan om verder te gaan in het portaal.'
      : 'Vul je verplichte basisgegevens in en klik op Opslaan om verder te gaan.';

  const setValue = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((prev) => {
      const base = prev ?? data.profile;
      return { ...base, [key]: value };
    });
  };

  const handleSave = async () => {
    const toSave = draft ?? data.profile;
    const errors = getProfileFieldErrors(toSave);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(toSave);
      setDraft(null);
    } catch (err: unknown) {
      const e = err as { message?: string; details?: string; hint?: string };
      const msg = e.details || e.message || e.hint || 'Opslaan mislukt. Probeer het opnieuw.';
      setSaveError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleModalSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="basisprofiel-modal-title"
    >
      <div className="max-h-[min(90vh,720px)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h2 id="basisprofiel-modal-title" className="text-lg font-bold text-slate-900">
          Basisprofiel
        </h2>
        <p className="mt-1 text-sm text-slate-600">Naam, adres, geboortedatum en contact</p>
        <p className="mt-3 text-sm text-slate-700">{modalIntro}</p>

        <div className="mt-5">
          <BasisprofielFields profile={profile} editing fieldErrors={fieldErrors} setValue={setValue} />
        </div>

        {saveError ? <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-800">{saveError}</div> : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button type="button" onClick={() => void handleModalSignOut()} className="text-sm font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900">
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
}
