import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  CircleUserRound,
  CreditCard,
  Gauge,
  LayoutDashboard,
  MessageSquareMore,
  Route,
} from 'lucide-react';

export type PortalNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const portalNavItems: PortalNavItem[] = [
  { label: 'Dashboard', to: '/portaal', icon: LayoutDashboard },
  { label: 'Agenda', to: '/portaal/agenda', icon: CalendarClock },
  { label: 'Uren', to: '/portaal/uren', icon: Gauge },
  { label: 'Betalingen', to: '/portaal/betalingen', icon: CreditCard },
  { label: 'Profiel', to: '/portaal/profiel', icon: CircleUserRound },
  { label: 'Voortgang', to: '/portaal/voortgang', icon: Route },
  { label: 'Berichten', to: '/portaal/berichten', icon: MessageSquareMore },
];
