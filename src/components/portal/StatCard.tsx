import { formatMinutes } from '@/src/lib/portal/format';

type StatCardProps = {
  label: string;
  value: number | string;
  helpText?: string;
  mode?: 'minutes' | 'default';
};

export default function StatCard({ label, value, helpText, mode = 'default' }: StatCardProps) {
  const displayValue = mode === 'minutes' && typeof value === 'number' ? formatMinutes(value) : value;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{displayValue}</p>
      {helpText ? <p className="mt-1 text-xs text-slate-500">{helpText}</p> : null}
    </article>
  );
}
