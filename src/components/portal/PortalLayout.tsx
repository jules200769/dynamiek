import { Bell, LogOut, MoreHorizontal } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { PortalProvider, usePortal } from './PortalContext';
import { portalNavItems } from './portalNav';
import { useAuth } from '@/src/components/auth/AuthContext';

function crumbsFromPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return ['Portaal'];
  return ['Portaal', ...parts.slice(1).map((part) => part.charAt(0).toUpperCase() + part.slice(1))];
}

const PRIMARY_COUNT = 4;

function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = portalNavItems.slice(0, PRIMARY_COUNT);
  const overflow = portalNavItems.slice(PRIMARY_COUNT);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      {moreOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 py-2">
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-1">
            {overflow.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-slate-600'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1 p-2">
        {primary.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/portaal'}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600'
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold ${
            moreOpen ? 'bg-primary/10 text-primary' : 'text-slate-600'
          }`}
        >
          <MoreHorizontal size={16} />
          Meer
        </button>
      </div>
    </nav>
  );
}

function PortalShell() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const location = useLocation();
  const { data, markNotificationRead } = usePortal();
  const unreadCount = data?.notifications.filter((item) => !item.read).length ?? 0;
  const crumbs = useMemo(() => crumbsFromPath(location.pathname), [location.pathname]);

  const handleOpenNotifications = async () => {
    const unreadNotifications = data?.notifications.filter((item) => !item.read) ?? [];
    await Promise.all(unreadNotifications.map((item) => markNotificationRead(item.id, true)));
    navigate('/portaal/berichten');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:p-6">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Dynamiek portaal</p>
          <nav className="mt-4 space-y-1">
            {portalNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/portaal'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-4 pb-20 lg:pb-0">
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{crumbs.join(' / ')}</p>
                <p className="text-base font-bold text-slate-900">{data?.profile.fullName ?? 'Leerling'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleOpenNotifications()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Bell size={16} />
                  Notificaties
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">{unreadCount}</span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <LogOut size={16} />
                  Uitloggen
                </button>
              </div>
            </div>
          </header>

          <Outlet />
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

export default function PortalLayout() {
  return (
    <PortalProvider>
      <PortalShell />
    </PortalProvider>
  );
}
