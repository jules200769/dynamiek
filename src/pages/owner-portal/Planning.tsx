import { useMemo, useState } from 'react';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import { formatDateTime } from '@/src/lib/portal/format';

export default function OwnerPlanningPage() {
  const { data, loading, error, scheduleLesson, updateLessonStatus } = useOwnerPortal();
  const [studentId, setStudentId] = useState('');

  const currentStudent = useMemo(
    () => data?.students.find((student) => student.id === studentId) ?? data?.students[0],
    [data, studentId],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Planning" description="Geplande lessen voor elke leerling beheren." />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Planning niet beschikbaar" description={error ?? 'Geen data beschikbaar.'} />;
  }

  const selectedStudent = currentStudent;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Planning"
        description="Plan en beheer lessen per leerling."
        actions={
          <select
            value={selectedStudent?.id ?? ''}
            onChange={(event) => setStudentId(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.profile.fullName}
              </option>
            ))}
          </select>
        }
      />

      {!selectedStudent ? (
        <EmptyState title="Geen leerling geselecteerd" description="Kies een leerling om planning te tonen." />
      ) : (
        <>
          <SectionCard
            title="Beschikbare slots"
            subtitle="Gebruikt het eerste beschikbare slot om direct een les in te plannen"
            actions={
              <button
                type="button"
                onClick={() => {
                  const slot = selectedStudent.availability[0];
                  if (!slot) return;
                  void scheduleLesson({
                    studentId: selectedStudent.id,
                    start: slot.start,
                    end: slot.end,
                    instructor: slot.instructor,
                    car: slot.car,
                    location: slot.location,
                    lessonType: 'Praktijkles',
                  });
                }}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Plan eerstvolgende slot
              </button>
            }
          >
            <div className="space-y-2">
              {selectedStudent.availability.map((slot) => (
                <div key={slot.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{formatDateTime(slot.start)}</p>
                  <p className="text-xs text-slate-600">{slot.instructor} - {slot.location}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Lessenoverzicht" subtitle="Statuswijzigingen direct doorvoeren">
            <div className="space-y-2">
              {selectedStudent.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{formatDateTime(lesson.start)}</p>
                      <p className="text-xs text-slate-600">{lesson.instructor} - {lesson.car}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={lesson.status} />
                      <button
                        type="button"
                        onClick={() =>
                          void updateLessonStatus({
                            studentId: selectedStudent.id,
                            lessonId: lesson.id,
                            status: lesson.status === 'Voltooid' ? 'Gepland' : 'Voltooid',
                          })
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Markeer {lesson.status === 'Voltooid' ? 'gepland' : 'voltooid'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
