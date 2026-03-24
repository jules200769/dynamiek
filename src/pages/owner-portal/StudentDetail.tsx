import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOwnerPortal } from '@/src/components/owner-portal/OwnerPortalContext';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import TimelineRow from '@/src/components/portal/TimelineRow';
import { formatDate, formatDateTime, formatMinutes } from '@/src/lib/portal/format';

export default function OwnerStudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { loading, data, findStudentById, setInternalNote, setInstructorAdvice } = useOwnerPortal();
  const student = studentId ? findStudentById(studentId) : null;
  const [note, setNote] = useState(student?.internalNote ?? '');
  const [advice, setAdvice] = useState(student?.instructorAdvice ?? '');
  const isNoteDirty = useRef(false);
  const isAdviceDirty = useRef(false);

  useEffect(() => {
    if (!isNoteDirty.current) {
      setNote(student?.internalNote ?? '');
    }
  }, [student?.internalNote]);

  useEffect(() => {
    if (!isAdviceDirty.current) {
      setAdvice(student?.instructorAdvice ?? '');
    }
  }, [student?.instructorAdvice]);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Leerlingdetail" description="Dossier met alle operationele gegevens per leerling." />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (!data || !student) {
    return (
      <EmptyState
        title="Leerling niet gevonden"
        description="Controleer de URL of ga terug naar de leerlingenlijst."
        action={
          <Link to="/owner/leerlingen" className="text-sm font-semibold text-primary">
            Terug naar leerlingen
          </Link>
        }
      />
    );
  }

  const remaining = student.packageInfo.totalMinutes + student.packageInfo.extraMinutes - student.packageInfo.usedMinutes;

  return (
    <div className="space-y-4">
      <PageHeader
        title={student.profile.fullName}
        description="Volledig leerlingdossier met planning, documenten, uren en voortgang."
        actions={
          <>
            <Link to="/owner/planning" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Planning
            </Link>
            <Link to="/owner/facturatie" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Facturatie
            </Link>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Profielgegevens">
          <div className="space-y-1 text-sm text-slate-700">
            <p>{student.profile.email}</p>
            <p>{student.profile.phone}</p>
            <p>{student.profile.address}, {student.profile.city}</p>
            <p>CBR: {student.profile.cbrNumber}</p>
            <p>Start opleiding: {formatDate(student.profile.trainingStartDate)}</p>
          </div>
        </SectionCard>
        <SectionCard title="Urenoverzicht">
          <div className="space-y-1 text-sm text-slate-700">
            <p>Totaal: <span className="font-semibold">{formatMinutes(student.packageInfo.totalMinutes)}</span></p>
            <p>Gebruikt: <span className="font-semibold">{formatMinutes(student.packageInfo.usedMinutes)}</span></p>
            <p>Extra: <span className="font-semibold">{formatMinutes(student.packageInfo.extraMinutes)}</span></p>
            <p>Resterend: <span className="font-semibold">{formatMinutes(remaining)}</span></p>
          </div>
        </SectionCard>
        <SectionCard title="Documentstatus">
          <div className="space-y-2">
            {student.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
                <p>{doc.type}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{doc.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Advies voor leerlingportaal" subtitle="Zichtbaar op dashboard en voortgang in het klantenportaal">
        <div className="space-y-2">
          <textarea
            value={advice}
            onChange={(event) => {
              isAdviceDirty.current = true;
              setAdvice(event.target.value);
            }}
            rows={3}
            placeholder="Bijv. focus deze week op invoegen en kijken..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
          />
          <button
            type="button"
            onClick={() => {
              void setInstructorAdvice(student.id, advice).then(() => {
                isAdviceDirty.current = false;
              });
            }}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Advies opslaan
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Interne owner-notitie" subtitle="Alleen zichtbaar in dit portaal">
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(event) => {
              isNoteDirty.current = true;
              setNote(event.target.value);
            }}
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
          />
          <button
            type="button"
            onClick={() => {
              void setInternalNote(student.id, note).then(() => {
                isNoteDirty.current = false;
              });
            }}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Notitie opslaan
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Recente lessen">
        <div className="grid gap-2 md:grid-cols-2">
          {student.lessons.slice().reverse().slice(0, 6).map((lesson) => (
            <div key={lesson.id}>
              <TimelineRow lesson={lesson} />
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(lesson.start)}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
