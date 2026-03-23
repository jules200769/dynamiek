import type {
  ChecklistStatus,
  InvoiceStatus,
  LessonStatus,
  MessagePriority,
  MessageType,
  ProgressTrend,
} from '@/src/types/portal';

type AllowedStatus = LessonStatus | InvoiceStatus | ChecklistStatus | MessagePriority | MessageType | ProgressTrend;

const styles: Record<AllowedStatus, string> = {
  Gepland: 'bg-blue-100 text-blue-800',
  Bevestigd: 'bg-emerald-100 text-emerald-800',
  Voltooid: 'bg-slate-200 text-slate-800',
  Geannuleerd: 'bg-rose-100 text-rose-800',
  Wachtlijst: 'bg-amber-100 text-amber-800',
  Betaald: 'bg-emerald-100 text-emerald-800',
  Openstaand: 'bg-amber-100 text-amber-800',
  Verlopen: 'bg-rose-100 text-rose-800',
  'In behandeling': 'bg-slate-100 text-slate-800',
  Blokkerend: 'bg-rose-100 text-rose-800',
  Algemeen: 'bg-slate-100 text-slate-700',
  Planning: 'bg-blue-100 text-blue-700',
  Betaling: 'bg-amber-100 text-amber-800',
  Voortgang: 'bg-indigo-100 text-indigo-700',
  Systeem: 'bg-purple-100 text-purple-700',
  Normaal: 'bg-slate-100 text-slate-700',
  Belangrijk: 'bg-rose-100 text-rose-800',
  stijgend: 'bg-emerald-100 text-emerald-700',
  stabiel: 'bg-blue-100 text-blue-700',
  dalend: 'bg-rose-100 text-rose-700',
};

export default function StatusBadge({ value }: { value: AllowedStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value]}`}>{value}</span>;
}
