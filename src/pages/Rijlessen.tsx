import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, Car, ChevronDown, Star } from 'lucide-react';

const packages = [
  {
    name: 'Instap Pakket',
    tagline: 'Ideaal om te starten',
    blocks: '5 bloklessen van 100 minuten',
    lessons: '10 rijlessen van 50 minuten',
    features: ['Snel beginnen'],
    price: '570,00',
    highlight: false,
  },
  {
    name: 'Standaard Pakket',
    tagline: 'Meer lessen, meer zekerheid',
    blocks: '10 bloklessen van 100 minuten',
    lessons: '20 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
    price: '1.533,50',
    highlight: false,
  },
  {
    name: 'Compact Pakket',
    tagline: 'Populair bij onze leerlingen',
    blocks: '13 bloklessen van 100 minuten',
    lessons: '26 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
    price: '1.875,00',
    highlight: true,
  },
  {
    name: 'Uitgebreid Pakket',
    tagline: 'Ruim voldoende oefening',
    blocks: '15 bloklessen van 100 minuten',
    lessons: '30 rijlessen van 50 minuten',
    features: ['Snel beginnen', 'Een gratis herhalingsles (50 minuten)', 'Praktijkexamen'],
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
      'Een gratis herhalingsles (50 minuten)',
      'Één gratis Praktijk (Her)Examen',
    ],
    price: '1.077,50',
    highlight: false,
  },
];

/* Duidelijke bounce-in: meer overshoot, grotere beweging */
const smoothBounceEase = [0.34, 1.75, 0.64, 1];

const cardVariants = {
  hidden: ({ side }: { index: number; side: 'left' | 'right' }) => ({
    opacity: 0,
    scale: 0.88,
    y: 44,
    x: side === 'left' ? -36 : 36,
  }),
  visible: ({ index }: { index: number; side: 'left' | 'right' }) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: {
      delay: 0.06 + index * 0.04,
      duration: 0.58,
      ease: smoothBounceEase,
    },
  }),
};

const branchVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      delay: 0.08 + i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,

    transition: {
      delay: 0.02 + i * 0.08,
      type: 'spring',
      stiffness: 400,
      damping: 18,
    },
  }),
};

function MeestGekozenBadge() {
  return (
    <motion.div
      className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-secondary/40 whitespace-nowrap"
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
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
}: {
  pkg: (typeof packages)[0];
  index: number;
  side: 'left' | 'right';
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
            <Link
              to="/#contact"
              className={`mt-3 inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                pkg.highlight
                  ? 'bg-secondary text-white hover:bg-secondary-dark shadow-lg'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Aanmelden
            </Link>
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
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
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
            <p className="text-blue-100 text-base md:text-lg">
              Kies een pakket dat past bij jouw tempo. Alle prijzen zijn totaalprijzen.
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
                initial={{ opacity: 0, scale: 0.88, y: 36 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.34, 1.75, 0.64, 1], delay: index * 0.04 }}
              >
                <div className="absolute left-0 top-1/2 -translate-x-[calc(0.5rem+3px)] -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
                <div className="ml-4">
                  <PackageCard pkg={pkg} index={index} side="left" />
                </div>
              </motion.div>
            ))}
            <motion.div
              className="relative py-6"
              initial={{ opacity: 0, scale: 0.88, y: 36 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease: [0.34, 1.75, 0.64, 1] }}
            >
              <div className="absolute left-0 top-1/2 -translate-x-[calc(0.5rem+3px)] -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
              <div className="ml-4 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Losse rijles</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Geen pakket nodig? Boek een enkele les wanneer het jou uitkomt.
                </p>
                <p className="text-2xl font-black text-primary mb-1">€ 55,00 per les</p>
                <p className="text-xs text-gray-500 mb-4">per les van 50 minuten</p>
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Les boeken
                </Link>
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
                          <PackageCard pkg={pkg} index={index} side="left" />
                        </div>
                      ) : <div className="flex-1" />}
                    </div>
                    <div className="w-2 shrink-0" />
                    <div className="flex-1 flex items-center justify-start pl-4">
                      {!isLeft ? (
                        <div className="flex items-center justify-start w-full">
                          <PackageCard pkg={pkg} index={index} side="right" />
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
                          Geen pakket nodig? Boek een enkele les wanneer het jou uitkomt.
                        </p>
                        <p className="text-xl md:text-2xl font-black text-primary mb-1">€ 55,00 per les</p>
                        <p className="text-xs text-gray-500 mb-4">per les van 50 minuten</p>
                        <Link
                          to="/#contact"
                          className="inline-flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary-dark transition-colors"
                        >
                          Les boeken
                        </Link>
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
