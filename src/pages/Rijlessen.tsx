import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Car, ChevronDown, Star, Calendar, CreditCard, User, X } from 'lucide-react';

const packages = [
  {
    name: 'Instap Pakket',
    tagline: 'Ideaal om te starten',
    blocks: '5 bloklessen van 100 minuten',
    lessons: '10 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Vaste instructeur', 'Vanaf 16,5 jaar'],
    price: '570,00',
    highlight: false,
  },
  {
    name: 'Basis Pakket',
    tagline: 'Meer lessen, meer zekerheid',
    blocks: '10 bloklessen van 100 minuten',
    lessons: '20 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Vaste instructeur', 'Vanaf 16,5 jaar', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
    price: '1.533,50',
    highlight: false,
  },
  {
    name: 'Compact Pakket',
    tagline: 'Populair bij onze leerlingen',
    blocks: '13 bloklessen van 100 minuten',
    lessons: '26 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Vaste instructeur', 'Vanaf 16,5 jaar', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
    price: '1.875,00',
    highlight: true,
  },
  {
    name: 'Complete Pakket',
    tagline: 'Ruim voldoende oefening',
    blocks: '15 bloklessen van 100 minuten',
    lessons: '30 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Vaste instructeur', 'Vanaf 16,5 jaar', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
    price: '2.103,50',
    highlight: false,
    mostChosen: true,
  },
  {
    name: 'All-in Pakket',
    tagline: 'Alles inbegrepen, geen verrassingen',
    blocks: '20 bloklessen van 100 minuten',
    lessons: '40 rijlessen van 50 minuten',
    features: [
      'Snel beginnen',
      'Vaste instructeur',
      'Vanaf 16,5 jaar',
      'Een gratis herhalingsles (50 minuten)',
      'Praktijkexamen',
    ],
    price: '2.673,50',
    highlight: true,
  },
  {
    name: 'HerExamen Pakket',
    tagline: 'Speciaal voor herexamen',
    blocks: '6 bloklessen van 100 minuten',
    lessons: '12 rijlessen van 50 minuten',
    features: [
      'Snel beginnen',
      'Vaste instructeur',
      'Vanaf 16,5 jaar',
      'Een gratis herhalingsles (50 minuten)',
      'Één gratis Praktijk (Her)Examen',
    ],
    price: '1.077,50',
    highlight: false,
  },
];

type PackageItem = (typeof packages)[0];
type BookingItem = { type: 'package'; pkg: PackageItem } | { type: 'single'; price: string };

function getBookingLabel(item: BookingItem): string {
  return item.type === 'package' ? item.pkg.name : 'Losse rijles';
}
function getBookingPrice(item: BookingItem): string {
  return item.type === 'package' ? item.pkg.price : '55,00';
}

/* Kalender: eerste beschikbare startdatum */
function getDaysInMonth(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const days: (number | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function isPast(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/* Smooth: iets te groot → correct formaat, vloeiende ease-out */
const smoothEase = [0.33, 1, 0.68, 1];

const cardVariants = {
  hidden: { scale: 1.06, opacity: 0.96 },
  visible: ({ index }: { index: number; side: 'left' | 'right' }) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.03,
      duration: 0.55,
      ease: smoothEase,
    },
  }),
};

const branchVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.45,
      ease: smoothEase,
    },
  }),
};

const nodeVariants = {
  hidden: { scale: 1.08, opacity: 0.9 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: smoothEase,
    },
  }),
};

function BookingModal({
  item,
  onClose,
}: {
  item: BookingItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const monthLabel = viewMonth.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(viewMonth.getFullYear(), viewMonth.getMonth());
  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  const handlePrevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1));
  const handleNextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1));

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">Aanmelden – {getBookingLabel(item)}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Sluiten">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Aanmelding ontvangen</h4>
              <p className="text-gray-600 mb-6">
                Je ontvangt binnen enkele minuten een betaallink op <strong>{form.email}</strong>. Via deze link kun je veilig betalen met iDEAL of creditcard.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Sluiten
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Gekozen pakket</p>
                    <p className="text-lg font-bold text-gray-900">{getBookingLabel(item)}</p>
                    <p className="text-2xl font-black text-primary mt-1">€ {getBookingPrice(item)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    Startdatum kiezen <Calendar size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-medium text-gray-700">Vanaf wanneer kun je starten?</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                      <button type="button" onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-200 text-gray-600">
                        <ChevronDown className="rotate-90" size={16} />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{monthLabel}</span>
                      <button type="button" onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-200 text-gray-600">
                        <ChevronDown className="-rotate-90" size={16} />
                      </button>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {weekDays.map((w) => (
                          <div key={w} className="text-center text-[10px] font-medium text-gray-500">{w}</div>
                        ))}
                        {days.map((d, i) => {
                          if (d === null) return <div key={`e-${i}`} />;
                          const past = isPast(viewMonth.getFullYear(), viewMonth.getMonth(), d);
                          const selected =
                            startDate &&
                            startDate.getDate() === d &&
                            startDate.getMonth() === viewMonth.getMonth() &&
                            startDate.getFullYear() === viewMonth.getFullYear();
                          return (
                            <button
                              key={d}
                              type="button"
                              disabled={past}
                              onClick={() => !past && setStartDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d))}
                              className={`min-w-[28px] w-7 h-7 rounded text-xs font-medium transition-colors flex items-center justify-center ${
                                past
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : selected
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-primary/10 text-gray-700'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-0.5">
                    <button type="button" onClick={() => setStep(1)} className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!startDate}
                      className="flex-1 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Doorgaan
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium text-gray-700">Kies een tijd (vanaf 10:00 tot 18:00)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const selected = startTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setStartTime(time)}
                          className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                            selected
                              ? 'bg-primary text-white'
                              : 'border border-gray-200 text-gray-700 hover:bg-primary/10'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(2)} className="py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      disabled={!startTime}
                      className="flex-1 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Doorgaan
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium text-gray-700">Jouw gegevens</p>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(5); }} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Naam"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="email"
                      placeholder="E-mailadres"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Telefoonnummer"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setStep(3)} className="py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                        Terug
                      </button>
                      <button type="submit" className="flex-1 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                        Doorgaan <User size={18} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 5 && (
                <motion.form
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>{getBookingLabel(item)}</strong> · Startdatum:{' '}
                      {startDate?.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {startTime && ` · ${startTime} uur`}
                    </p>
                    <p className="text-xl font-bold text-primary">€ {getBookingPrice(item)}</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                    <CreditCard size={24} className="text-primary shrink-0" />
                    <p className="text-sm text-gray-600">
                      Na bevestiging ontvang je een veilige betaallink (iDEAL, creditcard). Je gegevens worden niet opgeslagen op onze servers.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(4)} className="py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                      Terug
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      Betaal veilig <CreditCard size={18} />
                    </button>
                  </div>
                </motion.form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MeestGekozenBadge() {
  return (
    <motion.div
      className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-secondary/40 whitespace-nowrap"
      initial={{ scale: 1.05, opacity: 0.95 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: smoothEase }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star size={14} fill="currentColor" className="text-white" />
      </motion.span>
      <span>Meest gekozen</span>
    </motion.div>
  );
}

function PackageCard({
  pkg,
  index,
  side,
  onSelect,
}: {
  pkg: (typeof packages)[0];
  index: number;
  side: 'left' | 'right';
  onSelect: (pkg: PackageItem) => void;
}) {
  const branchLine = (
    <motion.div
      className="h-0.5 w-12 md:w-20 bg-primary/50 rounded-full origin-center shrink-0"
      style={{ transformOrigin: side === 'left' ? 'left center' : 'right center' }}
      custom={index}
      variants={branchVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    />
  );
  const isMostChosen = 'mostChosen' in pkg && pkg.mostChosen;
  return (
    <>
      {side === 'right' && branchLine}
      <div className="relative">
        {isMostChosen && <MeestGekozenBadge />}
        <motion.article
          custom={{ index, side }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl border flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] shrink-0 ${
            pkg.highlight
              ? 'bg-primary text-white border-primary-dark'
              : 'bg-white text-gray-900 border-gray-100'
          }`}
        >
        {pkg.highlight && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary" />
        )}
        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-xl font-bold mb-1">{pkg.name}</h3>
          <p
            className={`text-xs font-medium mb-4 ${
              pkg.highlight ? 'text-blue-100' : 'text-primary'
            }`}
          >
            {pkg.tagline}
          </p>
          <div
            className={`space-y-2 mb-4 text-sm ${
              pkg.highlight ? 'text-blue-50' : 'text-gray-600'
            }`}
          >
            <p className="font-semibold">{pkg.blocks}</p>
            <p className="font-semibold">{pkg.lessons}</p>
          </div>
          <ul className="space-y-2 mb-6 flex-grow">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                    pkg.highlight ? 'bg-secondary/30' : 'bg-blue-100'
                  }`}
                >
                  <Check
                    size={12}
                    className={pkg.highlight ? 'text-white' : 'text-primary'}
                  />
                </span>
                <span className="text-xs">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-gray-200/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mb-0.5">
              Totale prijs
            </p>
            <p className="text-xl md:text-2xl font-black">€ {pkg.price}</p>
            <button
              type="button"
              onClick={() => onSelect(pkg)}
              className={`mt-3 inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                pkg.highlight
                  ? 'bg-secondary text-white hover:bg-secondary-dark shadow-lg'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Aanmelden
            </button>
          </div>
        </div>
      </motion.article>
      </div>
      {side === 'left' && branchLine}
    </>
  );
}

function SubtleBackgroundPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Moderne gradient-blobs – zichtbaar en vloeiend */}
      <motion.div
        className="absolute w-[min(80vw,600px)] h-[min(80vw,600px)] rounded-full opacity-[0.14] blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgb(30 58 138 / 0.45) 0%, rgb(30 58 138 / 0.12) 50%, transparent 70%)',
          top: '10%',
          left: '5%',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[min(70vw,500px)] h-[min(70vw,500px)] rounded-full opacity-[0.12] blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgb(30 58 138 / 0.4) 0%, rgb(30 58 138 / 0.1) 50%, transparent 70%)',
          bottom: '15%',
          right: '10%',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 35, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[min(50vw,340px)] h-[min(50vw,340px)] rounded-full opacity-[0.1] blur-[80px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgb(245 158 11 / 0.3) 0%, rgb(245 158 11 / 0.06) 50%, transparent 70%)',
          top: '50%',
          left: '50%',
        }}
        animate={{
          x: [0, 28, 0],
          y: [0, -22, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Subtiel raster voor modern gevoel */}
      <motion.div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgb(30 58 138 / 0.45) 1px, transparent 1px),
            linear-gradient(90deg, rgb(30 58 138 / 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        animate={{ opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Vakjes die afwisselend iets donkerder en weer helder worden */}
      <div
        className="absolute inset-0 grid gap-[2px]"
        style={{
          gridTemplateColumns: 'repeat(16, 1fr)',
          gridTemplateRows: 'repeat(14, 1fr)',
        }}
      >
        {Array.from({ length: 16 * 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-[3px] bg-primary/25"
            animate={{
              opacity: [0.08, 0.28, 0.08],
            }}
            transition={{
              duration: 4 + (i % 6) * 0.5,
              delay: (i % 11) * 0.4 + (Math.floor(i / 16) % 5) * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Rijlessen() {
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <AnimatePresence>
        {bookingItem && (
          <BookingModal item={bookingItem} onClose={() => setBookingItem(null)} />
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="pt-28 pb-12 md:pb-16 bg-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              Terug naar home
            </Link>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
              <Car size={28} className="text-secondary" />
            </div>
            <h1 className="text-blue-400 font-bold tracking-wider uppercase text-xs mb-2">
              Lespakketten
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3">
              Rijlessen die bij jou passen
            </h2>
            <p className="text-blue-100 text-base md:text-lg mb-4">
              Kies een pakket dat past bij jouw tempo. Alle prijzen zijn totaalprijzen.
            </p>
            <p className="text-secondary font-semibold text-sm mb-2">
              Proefles: € 50,00 (gratis bij afname van een lespakket)
            </p>
            <p className="text-amber-300 font-bold text-sm">
              € 4,- korting per rijles bij inschrijven vóór mei 2026!
            </p>
          </motion.div>
        </div>
        {/* Scroll indicator - links op mobile, gecentreerd op desktop */}
        <motion.div
          className="absolute bottom-6 left-8 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full p-2 bg-white/10 border border-white/20"
          >
            <ChevronDown size={24} className="text-white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* Tree: central trunk + branching packages (desktop) / timeline (mobile) */}
      <section className="relative py-8 md:py-16 flex-grow overflow-hidden">
        {/* Rustige achtergrondanimatie op het witte gedeelte */}
        <SubtleBackgroundPattern />
        {/* Central vertical trunk - desktop */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full hidden md:block"
          style={{
            background: 'linear-gradient(to bottom, rgb(30 58 138 / 0.15), rgb(30 58 138 / 0.4) 20%, rgb(30 58 138 / 0.4) 80%, rgb(30 58 138 / 0.15))',
          }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="container-custom relative">
          {/* Mobile: vertical timeline with line on left */}
          <div className="md:hidden space-y-0 pl-5 border-l-2 border-primary/30 ml-2">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className="relative py-6"
                initial={{ scale: 1.06, opacity: 0.96 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.03 }}
              >
                <div className="absolute left-0 top-1/2 -translate-x-[calc(0.5rem+3px)] -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
                <div className="ml-4">
                  <PackageCard pkg={pkg} index={index} side="left" onSelect={(pkg) => setBookingItem({ type: 'package', pkg })} />
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative py-6"
              initial={{ scale: 1.06, opacity: 0.96 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: smoothEase }}
            >
              <div className="absolute left-0 top-1/2 -translate-x-[calc(0.5rem+3px)] -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
              <div className="ml-4 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Losse rijles</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Geen pakket nodig? Boek een enkele les wanneer het jou uitkomt. Bij Rijschool Dynamiek kan je per maand en zelfs per rijles betalen.
                </p>
                <p className="text-primary font-bold text-sm mb-4">Vraag naar de prijs</p>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Neem contact op
                </a>
              </div>
            </motion.div>
          </div>
          {/* Desktop: tree with left/right branches */}
          <div className="hidden md:block">
            {packages.map((pkg, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={pkg.name}
                  className="relative flex items-center justify-center min-h-[280px] py-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg"
                    custom={index}
                    variants={nodeVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                  />
                  <div className="flex w-full max-w-5xl mx-auto items-center gap-0">
                    <div className="flex-1 flex items-center justify-end pr-4">
                      {isLeft ? (
                        <div className="flex items-center justify-end w-full">
                          <PackageCard pkg={pkg} index={index} side="left" onSelect={(pkg) => setBookingItem({ type: 'package', pkg })} />
                        </div>
                      ) : <div className="flex-1" />}
                    </div>
                    <div className="w-2 shrink-0" />
                    <div className="flex-1 flex items-center justify-start pl-4">
                      {!isLeft ? (
                        <div className="flex items-center justify-start w-full">
                          <PackageCard pkg={pkg} index={index} side="right" onSelect={(pkg) => setBookingItem({ type: 'package', pkg })} />
                        </div>
                      ) : <div className="flex-1" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {/* Losse rijles - zelfde vertakking als andere kaarten */}
            <motion.div
              className="relative flex items-center justify-center min-h-[260px] py-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg"
                custom={packages.length}
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              />
              <div className="flex w-full max-w-5xl mx-auto items-center gap-0">
                <div className="flex-1 flex items-center justify-end pr-4">
                  <div className="flex items-center justify-end w-full">
                    <motion.div
                      custom={{ index: packages.length, side: 'left' as const }}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white text-gray-900 flex flex-col shrink-0"
                    >
                      <div className="p-5 md:p-6 text-center">
                        <h3 className="text-lg md:text-xl font-bold mb-2">Losse rijles</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Geen pakket nodig? Boek een enkele les wanneer het jou uitkomt. Bij Rijschool Dynamiek kan je per maand en zelfs per rijles betalen.
                        </p>
                        <p className="text-primary font-bold text-sm mb-4">Vraag naar de prijs</p>
                        <a
                          href="/#contact"
                          className="inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary-dark transition-colors"
                        >
                          Neem contact op
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      className="h-0.5 w-12 md:w-20 bg-primary/50 rounded-full shrink-0"
                      style={{ transformOrigin: 'left center' }}
                      custom={packages.length}
                      variants={branchVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                    />
                  </div>
                </div>
                <div className="flex-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
