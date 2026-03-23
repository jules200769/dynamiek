import { formatDateTime } from '@/src/lib/portal/format';
import type { Lesson } from '@/src/types/portal';
import StatusBadge from './StatusBadge';

export default function TimelineRow({ lesson }: { lesson: Lesson }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{lesson.lessonType}</p>
        <StatusBadge value={lesson.status} />
      </div>
      <p className="mt-1 text-sm text-slate-600">{formatDateTime(lesson.start)}</p>
      <p className="mt-1 text-xs text-slate-500">
        {lesson.instructor} - {lesson.pickupLocation}
      </p>
      {lesson.feedback ? <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-700">{lesson.feedback}</p> : null}
    </div>
  );
}
