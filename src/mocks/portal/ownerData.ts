import { getPortalDataByScenario } from '@/src/mocks/portal/data';
import type {
  OwnerPortalData,
  OwnerPortalScenario,
  OwnerStudentRecord,
  StudentLifecycleStatus,
} from '@/src/types/ownerPortal';

const basePortalData = getPortalDataByScenario('normal');

function mapIds(prefix: string, value: string) {
  return `${prefix}-${value}`;
}

function shiftIso(iso: string, days: number) {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function createStudent(
  id: string,
  name: string,
  status: StudentLifecycleStatus,
  city: string,
  openBalance: number,
  lessonOffsetDays: number,
): OwnerStudentRecord {
  const clone = structuredClone(basePortalData);
  return {
    id,
    status,
    profile: {
      ...clone.profile,
      fullName: name,
      city,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      cbrNumber: `CBR-${Math.floor(Math.random() * 900000 + 100000)}`,
    },
    packageInfo: {
      ...clone.packageInfo,
      openBalance,
    },
    lessons: clone.lessons.map((lesson) => ({
      ...lesson,
      id: mapIds(id, lesson.id),
      start: shiftIso(lesson.start, lessonOffsetDays),
      end: shiftIso(lesson.end, lessonOffsetDays),
    })),
    availability: clone.availability.map((slot) => ({
      ...slot,
      id: mapIds(id, slot.id),
      start: shiftIso(slot.start, lessonOffsetDays),
      end: shiftIso(slot.end, lessonOffsetDays),
    })),
    invoices: clone.invoices.map((invoice) => ({
      ...invoice,
      id: mapIds(id, invoice.id),
      invoiceNumber: `${id.toUpperCase()}-${invoice.invoiceNumber}`,
      amount: Number((invoice.amount + openBalance * 0.1).toFixed(2)),
    })),
    progress: clone.progress.map((item) => ({ ...item, id: mapIds(id, item.id) })),
    checklist: clone.checklist.map((item) => ({ ...item, id: mapIds(id, item.id) })),
    documents: clone.documents.map((item) => ({ ...item, id: mapIds(id, item.id) })),
    messageThreads: clone.messageThreads.map((thread) => ({
      ...thread,
      id: mapIds(id, thread.id),
      messages: thread.messages.map((message) => ({
        ...message,
        id: mapIds(id, message.id),
      })),
    })),
    internalNote: `Aandachtspunt ${name}: bewaak lesfrequentie en examendatum.`,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

const baseStudents: OwnerStudentRecord[] = [
  createStudent('std-001', 'Jayden van Dijk', 'Actief', 'Utrecht', 215, 0),
  createStudent('std-002', 'Lina Hassan', 'Actief', 'Nieuwegein', 490, 2),
  createStudent('std-003', 'Milan de Groot', 'Gepauzeerd', 'Houten', 0, -3),
];

function buildScenarioData(scenario: OwnerPortalScenario): OwnerPortalData {
  const data: OwnerPortalData = {
    schoolName: 'Dynamiek Rijschool',
    schoolTimezone: 'Europe/Amsterdam',
    instructors: ['Samir', 'Nora', 'Iris'],
    students: structuredClone(baseStudents),
    calendarSync: {
      connected: true,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'Actief',
      pendingItems: 3,
      externalCalendarName: 'Dynamiek Owner Agenda',
    },
    alerts: [
      {
        id: 'alert-1',
        title: '2 facturen verlopen',
        description: 'Controleer betalingsregeling voor leerlingen met achterstand.',
        severity: 'warning',
      },
      {
        id: 'alert-2',
        title: 'CBR examendatum inplannen',
        description: 'Minimaal 1 leerling is examenklaar zonder ingeboekt praktijkexamen.',
        severity: 'info',
      },
    ],
    syncEvents: [],
  };

  if (scenario === 'drukke-week') {
    data.students = data.students.map((student) => ({
      ...student,
      lessons: [
        ...student.lessons,
        {
          ...student.lessons[0],
          id: `${student.id}-extra-les`,
          start: shiftIso(student.lessons[0].start, 1),
          end: shiftIso(student.lessons[0].end, 1),
          status: 'Gepland',
          notes: 'Extra ingeplande les in drukke week.',
        },
      ],
      version: student.version + 1,
      updatedAt: new Date().toISOString(),
    }));
    data.calendarSync.pendingItems = 8;
  }

  if (scenario === 'betalingsachterstand') {
    data.students = data.students.map((student) => ({
      ...student,
      packageInfo: {
        ...student.packageInfo,
        openBalance: student.packageInfo.openBalance + 280,
      },
      invoices: student.invoices.map((invoice, index) =>
        index === 0 ? { ...invoice, status: 'Verlopen', dueDate: '2026-03-01' } : invoice,
      ),
      version: student.version + 1,
      updatedAt: new Date().toISOString(),
    }));
    data.alerts.unshift({
      id: 'alert-3',
      title: 'Achterstanden opgelopen',
      description: 'Openstaand saldo stijgt, stuur betaalherinneringen vandaag.',
      severity: 'critical',
    });
  }

  return data;
}

export function getOwnerPortalDataByScenario(scenario: OwnerPortalScenario): OwnerPortalData {
  return buildScenarioData(scenario);
}
