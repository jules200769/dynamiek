import type { LucideIcon } from 'lucide-react';
import {
  CalendarSync,
  CircleUserRound,
  CreditCard,
  Gauge,
  LayoutDashboard,
  ListChecks,
  MessageSquareMore,
  UsersRound,
} from 'lucide-react';

export type OwnerNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const ownerNavItems: OwnerNavItem[] = [
  { label: 'Dashboard', to: '/owner', icon: LayoutDashboard },
  { label: 'Leerlingen', to: '/owner/leerlingen', icon: UsersRound },
  { label: 'Planning', to: '/owner/planning', icon: ListChecks },
  { label: 'Uren', to: '/owner/uren', icon: Gauge },
  { label: 'Voortgang', to: '/owner/voortgang', icon: CircleUserRound },
  { label: 'Facturatie', to: '/owner/facturatie', icon: CreditCard },
  { label: 'Berichten', to: '/owner/berichten', icon: MessageSquareMore },
  { label: 'Calendar sync', to: '/owner/calendar-sync', icon: CalendarSync },
];
