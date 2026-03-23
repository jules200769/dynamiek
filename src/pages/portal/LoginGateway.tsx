import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/components/auth/AuthContext';

export default function LoginGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signUpRole, setSignUpRole] = useState<'student' | 'owner'>('student');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const routeFromGuard = (location.state as { from?: string } | null)?.from;
    if (routeFromGuard) {
      navigate(routeFromGuard, { replace: true });
      return;
    }
    navigate(role === 'owner' ? '/owner' : '/portaal', { replace: true });
  }, [user, role, location.state, navigate]);

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    const result =
      mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password, signUpRole);
    if (result.error) {
      setError(result.error);
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={28} />
        </div>
        <h1 className="mt-4 text-center text-3xl font-black tracking-tight text-slate-900">Inloggen</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
          Log in op het studentenportaal of owner-portaal. Owner gebruikers krijgen automatisch extra rechten.
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
              Account maken
            </button>
          </div>

          {mode === 'signup' ? (
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Nieuwe account rol</span>
              <select
                value={signUpRole}
                onChange={(event) => setSignUpRole(event.target.value as 'student' | 'owner')}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="student">Student</option>
                <option value="owner">Owner</option>
              </select>
            </label>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={busy || !email.trim() || !password}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? 'Bezig...' : mode === 'signin' ? 'Inloggen' : 'Account maken'}
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
