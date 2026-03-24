import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/components/auth/AuthContext';
import {
  consumeSignupProfileRedirectHandled,
  markSignupProfileRedirectHandled,
  setPortalProfileSetupFlag,
  takePortalProfileSetupFlag,
} from '@/src/lib/portal/profileValidation';

/**
 * Publieke inlog/aanmelding — alleen voor leerlingen (klantenportaal).
 * Host/owner: zie footerlink "hosts" → /hosts
 */
export default function LoginGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === 'owner') {
      navigate('/owner', { replace: true });
      return;
    }
    if (consumeSignupProfileRedirectHandled()) {
      return;
    }
    if (takePortalProfileSetupFlag()) {
      markSignupProfileRedirectHandled();
      navigate('/portaal', { replace: true, state: { fromSignup: true } });
      return;
    }
    const routeFromGuard = (location.state as { from?: string } | null)?.from;
    if (routeFromGuard && routeFromGuard.startsWith('/portaal')) {
      navigate(routeFromGuard, { replace: true });
      return;
    }
    navigate('/portaal', { replace: true });
  }, [user, role, loading, location.state, navigate]);

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    const result =
      mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password, 'student');
    if (result.error) {
      setError(result.error);
    } else if (mode === 'signup') {
      setPortalProfileSetupFlag();
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={28} />
        </div>
        <h1 className="mt-4 text-center text-3xl font-black tracking-tight text-slate-900">Klantenportaal</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
          Inloggen of aanmelden als leerling. Je planning, facturen en berichten op één plek.
        </p>

        <div className="mt-8 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="naam@voorbeeld.nl"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Wachtwoord</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                mode === 'signin' ? 'bg-primary text-white' : 'border border-slate-200 text-slate-700'
              }`}
            >
              Inloggen
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                mode === 'signup' ? 'bg-primary text-white' : 'border border-slate-200 text-slate-700'
              }`}
            >
              Aanmelden
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={busy || !email.trim() || !password || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? 'Bezig...' : mode === 'signin' ? 'Inloggen' : 'Account aanmaken'}
            <ArrowRight size={16} />
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Terug naar website
          </Link>
        </div>
      </div>
    </div>
  );
}
