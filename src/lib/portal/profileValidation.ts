import type { StudentProfile } from '@/src/types/portal';

/** Velden die voor een geldig basisprofiel ingevuld moeten zijn. */
export const REQUIRED_PROFILE_FIELDS: (keyof StudentProfile)[] = ['fullName', 'dateOfBirth', 'phone', 'email'];

export function getProfileFieldErrors(profile: StudentProfile): Partial<Record<keyof StudentProfile, string>> {
  const errors: Partial<Record<keyof StudentProfile, string>> = {};
  if (!profile.fullName.trim()) errors.fullName = 'Naam is verplicht.';
  if (!profile.dateOfBirth.trim()) errors.dateOfBirth = 'Geboortedatum is verplicht.';
  if (!profile.phone.trim()) errors.phone = 'Telefoonnummer is verplicht.';
  if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = 'Voer een geldig e-mailadres in.';
  return errors;
}

export function isProfileComplete(profile: StudentProfile): boolean {
  return Object.keys(getProfileFieldErrors(profile)).length === 0;
}

const PORTAL_PROFILE_SETUP_KEY = 'portalExpectProfileSetup';
/** Tijdelijke guard tegen dubbele default-navigatie (o.a. React Strict Mode in dev). */
const PORTAL_SIGNUP_REDIRECT_HANDLED_KEY = 'portalSignupRedirectHandled';

/** Na succesvolle signup zetten; LoginGateway leest dit en stuurt naar /portaal/profiel. */
export function setPortalProfileSetupFlag() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(PORTAL_PROFILE_SETUP_KEY, '1');
  }
}

/** Leest en wist de signup-profielvlag in één keer (LoginGateway redirect). */
export function takePortalProfileSetupFlag(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  const pending = sessionStorage.getItem(PORTAL_PROFILE_SETUP_KEY) === '1';
  if (pending) sessionStorage.removeItem(PORTAL_PROFILE_SETUP_KEY);
  return pending;
}

export function markSignupProfileRedirectHandled() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(PORTAL_SIGNUP_REDIRECT_HANDLED_KEY, '1');
  }
}

export function consumeSignupProfileRedirectHandled(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  const v = sessionStorage.getItem(PORTAL_SIGNUP_REDIRECT_HANDLED_KEY);
  if (v === '1') {
    sessionStorage.removeItem(PORTAL_SIGNUP_REDIRECT_HANDLED_KEY);
    return true;
  }
  return false;
}
