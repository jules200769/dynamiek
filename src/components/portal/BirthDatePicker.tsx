import { useEffect, useMemo, useState } from 'react';
import { toHtmlDateInputValue } from '@/src/lib/portal/format';

const MONTHS: { value: number; label: string }[] = [
  { value: 1, label: 'januari' },
  { value: 2, label: 'februari' },
  { value: 3, label: 'maart' },
  { value: 4, label: 'april' },
  { value: 5, label: 'mei' },
  { value: 6, label: 'juni' },
  { value: 7, label: 'juli' },
  { value: 8, label: 'augustus' },
  { value: 9, label: 'september' },
  { value: 10, label: 'oktober' },
  { value: 11, label: 'november' },
  { value: 12, label: 'december' },
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseParts(raw: string): { day: number; month: number; year: number } {
  const iso = toHtmlDateInputValue(raw);
  if (!iso) return { day: 0, month: 0, year: 0 };
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return { day: 0, month: 0, year: 0 };
  return { day: d, month: m, year: y };
}

function toIso(day: number, month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

type Part = { day: number; month: number; year: number };

function clampDay(p: Part): Part {
  if (!p.month || !p.year) return p;
  const cap = daysInMonth(p.year, p.month);
  if (p.day > cap) return { ...p, day: cap };
  return p;
}

type BirthDatePickerProps = {
  value: string;
  onChange: (isoYyyyMmDd: string) => void;
  disabled?: boolean;
  id?: string;
};

/** Zelfde basis als tekstvelden in BasisprofielFields (border, padding, hoogte). */
const selectClass =
  'box-border min-h-[38px] min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70';

export default function BirthDatePicker({ value, onChange, disabled, id }: BirthDatePickerProps) {
  const [local, setLocal] = useState<Part>(() => parseParts(value));

  useEffect(() => {
    setLocal(parseParts(value));
  }, [value]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const yearOptions = useMemo(() => {
    const out: number[] = [];
    for (let y = currentYear; y >= currentYear - 120; y--) out.push(y);
    return out;
  }, [currentYear]);

  const maxDay = useMemo(() => {
    if (!local.month) return 31;
    if (!local.year) {
      if (local.month === 2) return 29;
      if ([4, 6, 9, 11].includes(local.month)) return 30;
      return 31;
    }
    return daysInMonth(local.year, local.month);
  }, [local.month, local.year]);

  const display = clampDay(local);
  const dayVal = display.day > 0 && display.day <= maxDay ? display.day : 0;

  const push = (patch: Partial<Part>) => {
    setLocal((prev) => {
      const merged = clampDay({ ...prev, ...patch });
      if (merged.day && merged.month && merged.year) {
        onChange(toIso(merged.day, merged.month, merged.year));
      } else {
        onChange('');
      }
      return merged;
    });
  };

  const baseId = id ?? 'birth-date';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-3 gap-2">
        <div className="grid min-w-0 gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Dag</span>
          <select
            id={`${baseId}-day`}
            aria-label="Dag"
            disabled={disabled}
            className={selectClass}
            value={dayVal || ''}
            onChange={(e) => {
              const v = e.target.value === '' ? 0 : Number(e.target.value);
              push({ day: v });
            }}
          >
            <option value="">—</option>
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="grid min-w-0 gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Maand</span>
          <select
            id={`${baseId}-month`}
            aria-label="Maand"
            disabled={disabled}
            className={selectClass}
            value={display.month || ''}
            onChange={(e) => {
              const v = e.target.value === '' ? 0 : Number(e.target.value);
              push({ month: v });
            }}
          >
            <option value="">—</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid min-w-0 gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Jaar</span>
          <select
            id={`${baseId}-year`}
            aria-label="Jaar"
            disabled={disabled}
            className={selectClass}
            value={display.year || ''}
            onChange={(e) => {
              const v = e.target.value === '' ? 0 : Number(e.target.value);
              push({ year: v });
            }}
          >
            <option value="">—</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-[11px] text-slate-500">Dag, maand en jaar — februari en schrikkeljaren worden automatisch goed gezet.</p>
    </div>
  );
}
