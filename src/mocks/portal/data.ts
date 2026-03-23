import type {
  AvailabilitySlot,
  ChecklistItem,
  Invoice,
  Lesson,
  MessageThread,
  NotificationItem,
  PackageInfo,
  PortalData,
  PortalScenario,
  ProgressItem,
  ReminderSettings,
  StudentDocument,
  StudentProfile,
} from '@/src/types/portal';

const profile: StudentProfile = {
  fullName: 'Jayden van Dijk',
  address: 'Stationsstraat 14',
  city: 'Utrecht',
  postalCode: '3511AA',
  dateOfBirth: '2006-08-12',
  phone: '06 1234 5678',
  email: 'jayden.vdijk@example.com',
  cbrNumber: 'CBR-938410',
  theoryCertificateNumber: 'TH-2025-1142',
  healthDeclarationStatus: 'Goedgekeurd',
  licenseCategory: 'B',
  trainingStartDate: '2025-09-10',
};

const documents: StudentDocument[] = [
  { id: 'doc-1', type: 'ID', fileName: 'id-voorzijde.jpg', uploadedAt: '2026-02-05T14:23:00Z', status: 'uploaded' },
  {
    id: 'doc-2',
    type: 'Theoriecertificaat',
    fileName: 'theoriecertificaat.pdf',
    uploadedAt: '2026-01-20T10:11:00Z',
    status: 'uploaded',
  },
];

const lessons: Lesson[] = [
  {
    id: 'les-101',
    start: '2026-03-25T15:00:00+01:00',
    end: '2026-03-25T16:30:00+01:00',
    durationMinutes: 90,
    pickupLocation: 'CS Utrecht Jaarbeurszijde',
    dropoffLocation: 'Lombok, Utrecht',
    instructor: 'Samir',
    car: 'VW Golf - 12-AB-34',
    lessonType: 'Praktijkles',
    status: 'Bevestigd',
    notes: 'Focus op invoegen snelweg en kijktechniek.',
  },
  {
    id: 'les-102',
    start: '2026-03-28T10:00:00+01:00',
    end: '2026-03-28T11:30:00+01:00',
    durationMinutes: 90,
    pickupLocation: 'Winkelcentrum Overvecht',
    dropoffLocation: 'Winkelcentrum Overvecht',
    instructor: 'Samir',
    car: 'VW Golf - 12-AB-34',
    lessonType: 'Praktijkles',
    status: 'Gepland',
  },
  {
    id: 'les-103',
    start: '2026-03-20T17:00:00+01:00',
    end: '2026-03-20T18:30:00+01:00',
    durationMinutes: 90,
    pickupLocation: 'Leidsche Rijn Centrum',
    dropoffLocation: 'Leidsche Rijn Centrum',
    instructor: 'Nora',
    car: 'Peugeot 208 - 56-CD-78',
    lessonType: 'Praktijkles',
    status: 'Voltooid',
    feedback: 'Rustig rijden, spiegelen verbeterd, bochtentechniek nog oefenen.',
  },
  {
    id: 'les-104',
    start: '2026-03-17T16:30:00+01:00',
    end: '2026-03-17T18:00:00+01:00',
    durationMinutes: 90,
    pickupLocation: 'Kanaleneiland',
    dropoffLocation: 'Kanaleneiland',
    instructor: 'Nora',
    car: 'Peugeot 208 - 56-CD-78',
    lessonType: 'Toetsles',
    status: 'Geannuleerd',
    notes: 'Geannuleerd binnen 24 uur (beleid toegepast).',
  },
  {
    id: 'les-105',
    start: '2026-04-02T18:00:00+01:00',
    end: '2026-04-02T19:30:00+01:00',
    durationMinutes: 90,
    pickupLocation: 'CS Utrecht Jaarbeurszijde',
    dropoffLocation: 'CS Utrecht Jaarbeurszijde',
    instructor: 'Samir',
    car: 'VW Golf - 12-AB-34',
    lessonType: 'Praktijkles',
    status: 'Wachtlijst',
    notes: 'Voorkeur doordeweeks na 18:00.',
  },
];

const availability: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    start: '2026-03-27T18:00:00+01:00',
    end: '2026-03-27T19:30:00+01:00',
    instructor: 'Samir',
    car: 'VW Golf - 12-AB-34',
    location: 'CS Utrecht Jaarbeurszijde',
  },
  {
    id: 'slot-2',
    start: '2026-03-29T09:00:00+01:00',
    end: '2026-03-29T10:30:00+01:00',
    instructor: 'Nora',
    car: 'Peugeot 208 - 56-CD-78',
    location: 'Winkelcentrum Overvecht',
  },
  {
    id: 'slot-3',
    start: '2026-03-30T16:30:00+01:00',
    end: '2026-03-30T18:00:00+01:00',
    instructor: 'Samir',
    car: 'VW Golf - 12-AB-34',
    location: 'Leidsche Rijn Centrum',
  },
];

const packageInfo: PackageInfo = {
  packageName: 'Pakket 30 uur',
  totalMinutes: 1800,
  usedMinutes: 990,
  extraMinutes: 90,
  openBalance: 215,
  nextInstallmentDate: '2026-04-05',
};

const invoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: '2026-00112',
    period: 'Februari 2026',
    amount: 220,
    dueDate: '2026-03-05',
    status: 'Betaald',
    downloadUrl: '#',
  },
  {
    id: 'inv-2',
    invoiceNumber: '2026-00151',
    period: 'Maart 2026',
    amount: 215,
    dueDate: '2026-03-29',
    status: 'Openstaand',
    downloadUrl: '#',
  },
  {
    id: 'inv-3',
    invoiceNumber: '2026-00162',
    period: 'Inhaaltoeslag',
    amount: 45,
    dueDate: '2026-03-10',
    status: 'Verlopen',
    downloadUrl: '#',
  },
];

const progress: ProgressItem[] = [
  {
    id: 'p-1',
    skill: 'Spiegelen en kijktechniek',
    level: 'Goed',
    trend: 'stijgend',
    updatedAt: '2026-03-20T18:30:00+01:00',
    note: 'Zelfstandig vooruitkijken en dode hoek controleren.',
  },
  {
    id: 'p-2',
    skill: 'Snelweg invoegen/uitvoegen',
    level: 'Voldoende',
    trend: 'stijgend',
    updatedAt: '2026-03-20T18:30:00+01:00',
    note: 'Tempo op op- en afritten nog consistenter maken.',
  },
  {
    id: 'p-3',
    skill: 'Bijzondere verrichtingen',
    level: 'Voldoende',
    trend: 'stabiel',
    updatedAt: '2026-03-14T17:00:00+01:00',
    note: 'Fileparkeren lukt, bocht achteruit nog herhalen.',
  },
  {
    id: 'p-4',
    skill: 'Kruispunten en voorrang',
    level: 'Goed',
    trend: 'stabiel',
    updatedAt: '2026-03-18T20:00:00+01:00',
    note: 'Prima scan, soms te defensief bij doorrijden.',
  },
];

const checklist: ChecklistItem[] = [
  { id: 'c-1', requirement: 'Theoriecertificaat geldig', status: 'Voltooid' },
  { id: 'c-2', requirement: 'Gezondheidsverklaring goedgekeurd', status: 'Voltooid' },
  { id: 'c-3', requirement: 'Bijzondere verrichtingen op niveau', status: 'In behandeling', advice: '2 extra sessies plannen.' },
  { id: 'c-4', requirement: 'Snelweg zelfstandig en veilig', status: 'In behandeling', advice: 'Nog 1 praktijkles met focus snelweg.' },
];

const messageThreads: MessageThread[] = [
  {
    id: 't-1',
    subject: 'Les op zaterdag verplaatsen',
    type: 'Planning',
    priority: 'Normaal',
    unreadCount: 1,
    pinned: false,
    messages: [
      { id: 'm-1', sender: 'Leerling', body: 'Kan de les van zaterdag naar vrijdagavond?', createdAt: '2026-03-22T19:15:00+01:00' },
      { id: 'm-2', sender: 'Rijschool', body: 'Ja, ik heb een plek om 18:00. Wil je die vastzetten?', createdAt: '2026-03-23T08:12:00+01:00' },
    ],
  },
  {
    id: 't-2',
    subject: 'Openstaande factuur maart',
    type: 'Betaling',
    priority: 'Belangrijk',
    unreadCount: 0,
    pinned: true,
    messages: [
      {
        id: 'm-3',
        sender: 'Rijschool',
        body: 'Je factuur van maart staat nog open. Betaal voor 29 maart om extra kosten te voorkomen.',
        createdAt: '2026-03-21T11:05:00+01:00',
      },
    ],
  },
];

const notifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Les bevestigd',
    body: 'Je les op 25 maart om 15:00 is bevestigd.',
    createdAt: '2026-03-23T09:00:00+01:00',
    read: false,
    kind: 'Planning',
  },
  {
    id: 'n-2',
    title: 'Annuleringsbeleid toegepast',
    body: 'Les van 17 maart is geannuleerd binnen 24 uur.',
    createdAt: '2026-03-17T18:05:00+01:00',
    read: true,
    kind: 'Systeem',
  },
];

const reminderSettings: ReminderSettings = {
  email: true,
  sms: false,
  push: true,
  calendarSync: false,
};

const baseData: PortalData = {
  profile,
  documents,
  lessons,
  availability,
  bookingPreferences: {
    preferredTimeWindows: ['Doordeweeks 18:00-21:00', 'Zaterdag 09:00-12:00'],
    preferredLocation: 'CS Utrecht Jaarbeurszijde',
    preferredInstructor: 'Samir',
    waitlistEnabled: true,
  },
  packageInfo,
  invoices,
  progress,
  checklist,
  instructorAdvice: 'Je zit op schema. Plan twee lessen met focus op bijzondere verrichtingen en snelweg.',
  messageThreads,
  notifications,
  reminderSettings,
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function getPortalDataByScenario(scenario: PortalScenario): PortalData {
  const data = clone(baseData);

  if (scenario === 'drukke-week') {
    data.lessons.push({
      id: 'les-106',
      start: '2026-03-26T19:00:00+01:00',
      end: '2026-03-26T20:30:00+01:00',
      durationMinutes: 90,
      pickupLocation: 'Papendorp',
      dropoffLocation: 'Papendorp',
      instructor: 'Nora',
      car: 'Peugeot 208 - 56-CD-78',
      lessonType: 'Examentraining',
      status: 'Gepland',
    });
    return data;
  }

  if (scenario === 'betalingsachterstand') {
    data.packageInfo.openBalance = 495;
    data.invoices = data.invoices.map((invoice) =>
      invoice.status === 'Openstaand' ? { ...invoice, amount: 350 } : invoice,
    );
    data.notifications.unshift({
      id: 'n-3',
      title: 'Betalingsherinnering',
      body: 'Je openstaande saldo is verhoogd. Neem contact op voor een regeling.',
      createdAt: '2026-03-23T10:00:00+01:00',
      read: false,
      kind: 'Betaling',
    });
    return data;
  }

  return data;
}
