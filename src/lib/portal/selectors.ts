import type { ChecklistItem, Lesson, ProgressItem } from '@/src/types/portal';

const ACTIVE_STATUSES = new Set(['Gepland', 'Bevestigd', 'Wachtlijst']);

export function getConsumedMinutes(lessons: Lesson[]): number {
  return lessons
    .filter((lesson) => lesson.status === 'Voltooid')
    .reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
}

export function getScheduledMinutes(lessons: Lesson[]): number {
  return lessons
    .filter((lesson) => ACTIVE_STATUSES.has(lesson.status))
    .reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
}

export function getRemainingMinutes(totalMinutes: number, consumedMinutes: number, extraMinutes = 0): number {
  return totalMinutes + extraMinutes - consumedMinutes;
}

export function getOverbookedWarning(remainingMinutes: number, scheduledMinutes: number): string | null {
  if (scheduledMinutes <= remainingMinutes) return null;
  const overbooked = scheduledMinutes - remainingMinutes;
  return `Er staat ${overbooked} minuten meer gepland dan je resterende tegoed.`;
}

export function getUpcomingLessons(lessons: Lesson[]): Lesson[] {
  const now = Date.now();
  return lessons
    .filter((lesson) => new Date(lesson.start).getTime() >= now && lesson.status !== 'Geannuleerd')
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function getReadinessScore(checklist: ChecklistItem[], progress: ProgressItem[]): number {
  if (checklist.length === 0 || progress.length === 0) return 0;
  const doneChecklist = checklist.filter((item) => item.status === 'Voltooid').length / checklist.length;
  const levelScore = progress.reduce((sum, item) => {
    if (item.level === 'Examenklaar') return sum + 1;
    if (item.level === 'Goed') return sum + 0.8;
    if (item.level === 'Voldoende') return sum + 0.6;
    return sum + 0.3;
  }, 0) / progress.length;

  return Math.round(((doneChecklist * 0.55 + levelScore * 0.45) * 100));
}
