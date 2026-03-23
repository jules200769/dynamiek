import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase/client';
import type { Database } from '@/src/lib/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Role = Profile['role'];

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, role?: Role) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** GoTrue returns 403 when the JWT `sub` no longer exists in auth.users (e.g. after DB reset). */
function isStaleJwtUserError(error: AuthError | null | undefined): boolean {
  return error?.status === 403 && (error.message?.includes('does not exist') ?? false);
}

async function fetchProfile(userId: string, retries = 0): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!data && retries < 5) {
    await new Promise((resolve) => setTimeout(resolve, 400 * (retries + 1)));
    return fetchProfile(userId, retries + 1);
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    let isMounted = true;

    const applySession = async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession?.user) {
        setProfile(null);
        return;
      }
      try {
        const profileData = await fetchProfile(nextSession.user.id);
        if (isMounted) setProfile(profileData);
      } catch {
        if (isMounted) setProfile(null);
      }
    };

    // Eerste load: wacht tot profiel binnen is voordat loading false — zo beslist RequireOwner nooit met role=null.
    void supabase.auth.getSession().then(async ({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setLoading(false);
        return;
      }
      if (!data.session) {
        await applySession(null);
        if (isMounted) setLoading(false);
        return;
      }
      const gu = await supabase.auth.getUser();
      if (gu.error && isStaleJwtUserError(gu.error)) {
        await supabase.auth.signOut();
        await applySession(null);
        if (isMounted) setLoading(false);
        return;
      }
      await applySession(data.session);
      if (isMounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Supabase stuurt direct INITIAL_SESSION; getSession hierboven doet dezelfde bootstrap.
      // Overslaan voorkomt dubbele fetch + korte loading=true waardoor guards opnieuw flitsen.
      if (event === 'INITIAL_SESSION') {
        return;
      }
      void (async () => {
        if (!isMounted) return;
        setLoading(true);
        if (!nextSession) {
          await applySession(null);
          if (isMounted) setLoading(false);
          return;
        }
        const gu = await supabase.auth.getUser();
        if (gu.error && isStaleJwtUserError(gu.error)) {
          await supabase.auth.signOut();
          await applySession(null);
          if (isMounted) setLoading(false);
          return;
        }
        await applySession(nextSession);
        if (isMounted) setLoading(false);
      })();
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  };

  const signUp = async (email: string, password: string, _role: Role = 'student') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
        },
      },
    });
    if (error) {
      return { error: error.message };
    }
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      user,
      profile,
      role: profile?.role ?? null,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [loading, session, user, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
