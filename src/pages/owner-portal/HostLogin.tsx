import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/components/auth/AuthContext';

/**
 * Discrete host/owner login — linked from footer as "hosts".
 * Geen openbare registratie; alleen inloggen voor bestaande host-accounts.
 */
export default function HostLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === 'owner') {
      const routeFromGuard = (location.state as { from?: string } | null)?.from;
      navigate(routeFromGuard && routeFromGuard.startsWith('/owner') ? routeFromGuard : '/owner', {
        replace: true,
      });
      return;
    }
    if (role === 'student') {
      navigate('/portaal', {
        replace: true,
        state: { message: 'Je bent ingelogd als leerling. Je bent doorgestuurd naar het klantenportaal.' },
      });
    }
  }, [user, role, loading, navigate, location.state]);

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    const result = await signIn(email.trim(), password);
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700">
          <ShieldCheck size={24} />
        </div>
        <h1 className="mt-4 text-center text-xl font-black tracking-tight text-slate-900">Hostportaal</h1>
        <p className="mt-2 text-center text-xs text-slate-500">
          Alleen voor rijschoolbeheer. Geen openbare registratie — accounts worden door de beheerder aangemaakt.
        </p>

        <div className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Wachtwoord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{error}</div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={busy || !email.trim() || !password || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {busy ? 'Bezig...' : 'Inloggen'}
            <ArrowRight size={16} />
          </button>

          <Link to="/login" className="text-center text-xs font-medium text-primary hover:underline">
            Leerling? Inloggen klantenportaal
          </Link>
          <Link to="/" className="text-center text-xs text-slate-500 hover:text-slate-700">
            Terug naar website
          </Link>
        </div>
      </div>
    </div>
  );
}
