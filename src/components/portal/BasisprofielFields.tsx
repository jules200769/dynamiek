import BirthDatePicker from '@/src/components/portal/BirthDatePicker';
import { REQUIRED_PROFILE_FIELDS } from '@/src/lib/portal/profileValidation';
import type { StudentProfile } from '@/src/types/portal';

function isRequiredField(key: keyof StudentProfile): boolean {
  return REQUIRED_PROFILE_FIELDS.includes(key);
}

export const BASIS_FIELD_ROWS = [
  ['fullName', 'Naam'],
  ['address', 'Adres'],
  ['city', 'Plaats'],
  ['postalCode', 'Postcode'],
  ['dateOfBirth', 'Geboortedatum'],
  ['phone', 'Telefoonnummer'],
  ['email', 'E-mail'],
  ['trainingStartDate', 'Startdatum opleiding'],
] as const;

export type BasisprofielFieldsProps = {
  profile: StudentProfile;
  editing: boolean;
  fieldErrors: Partial<Record<keyof StudentProfile, string>>;
  setValue: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void;
  footerClassName?: string;
};

export function BasisprofielFields({ profile, editing, fieldErrors, setValue, footerClassName }: BasisprofielFieldsProps) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 md:items-start">
        {BASIS_FIELD_ROWS.map(([key, label]) => {
          if (key === 'dateOfBirth') {
            return (
              <div key={key} className="grid min-w-0 gap-1 self-start text-sm">
                <span className="font-medium text-slate-700">
                  {label}
                  {isRequiredField(key) ? <span className="text-rose-600"> *</span> : null}
                </span>
                <BirthDatePicker
                  value={profile.dateOfBirth}
                  onChange={(iso) => setValue('dateOfBirth', iso)}
                  disabled={!editing}
                />
                {fieldErrors[key] ? <span className="text-xs text-rose-600">{fieldErrors[key]}</span> : null}
              </div>
            );
          }
          return (
            <label
              key={key}
              className={`grid min-w-0 gap-1 self-start text-sm${key === 'phone' ? ' mt-4' : ''}`}
            >
              <span className="font-medium text-slate-700">
                {label}
                {isRequiredField(key) ? <span className="text-rose-600"> *</span> : null}
              </span>
              <input
                disabled={!editing}
                required={editing && isRequiredField(key)}
                type={key === 'phone' ? 'tel' : 'text'}
                inputMode={key === 'phone' ? 'tel' : undefined}
                autoComplete={key === 'phone' ? 'tel' : undefined}
                value={profile[key]}
                onChange={(event) => setValue(key, event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
              {fieldErrors[key] ? <span className="text-xs text-rose-600">{fieldErrors[key]}</span> : null}
            </label>
          );
        })}
      </div>
      <div className={`mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ${footerClassName ?? ''}`}>
        Verplicht: naam, geboortedatum, telefoonnummer en e-mailadres.
      </div>
    </>
  );
}
