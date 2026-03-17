import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ArrowLeft,
  CarFront,
  Euro,
  GraduationCap,
  Search,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  imageAlt: string;
  faqs: FaqItem[];
}

const faqGroups: FaqGroup[] = [
  {
    title: 'Inschrijven & starten',
    description:
      'Alles over aanmelden, je proefles en hoe snel je kunt beginnen.',
    icon: <CarFront className="w-6 h-6" />,
    image: '/faq-geslaagd-2.png',
    imageAlt: 'Geslaagde leerling bij de lesauto van Rijschool Dynamiek',
    faqs: [
      {
        question: 'Hoe schrijf ik me in voor rijlessen?',
        answer:
          'Je kunt je eenvoudig inschrijven via onze website door een proefles aan te vragen, of door ons te bellen of te mailen. Na je aanmelding plannen we samen een proefles in. Daarna kies je een lespakket of losse lessen en kun je direct starten.',
      },
      {
        question: 'Wat is een proefles en is die gratis?',
        answer:
          'Tijdens een proefles maak je kennis met je instructeur en de lesauto. We kijken naar je huidige niveau en geven een eerlijk advies over het aantal lessen dat je waarschijnlijk nodig hebt. De proefles is gratis in combinatie met een lespakket. Vraag hem aan via de knop op de homepage.',
      },
      {
        question: 'Hoe snel kan ik beginnen met rijlessen?',
        answer:
          'Vaak kun je binnen een paar dagen al je eerste (proef)les inplannen. We kijken naar jouw agenda en die van de instructeur. Wil je snel starten? Vraag een proefles aan of bel ons direct voor de eerste beschikbare datum.',
      },
    ],
  },
  {
    title: 'Lessen & kosten',
    description: 'Informatie over lespakketten, losse lessen en betaling.',
    icon: <Euro className="w-6 h-6" />,
    image: '/faq-geslaagd-3.png',
    imageAlt: 'Blije leerling geslaagd voor rijexamen',
    faqs: [
      {
        question: 'Hoeveel rijlessen heb ik gemiddeld nodig?',
        answer:
          'Het gemiddelde aantal rijlessen in Nederland ligt rond de 35–40 lessen. Dit verschilt per persoon: ervaring, leertempo en beschikbaarheid spelen een rol. Na je proefles geven we een inschatting op maat.',
      },
      {
        question: 'Hoe kan ik betalen voor mijn rijlessen?',
        answer:
          'Bij Rijschool Dynamiek kun je flexibel betalen: per maand of zelfs per rijles. Bij de meeste pakketten is betaling in termijnen mogelijk. Zo hoef je niet alles in één keer te betalen en blijft het voor iedereen betaalbaar.',
      },
      {
        question: 'Kan ik losse lessen nemen of moet ik een pakket kiezen?',
        answer:
          'Beide kan. Je kunt losse lessen boeken als je flexibel wilt blijven, of een pakket nemen voor een voordeligere prijs en meer zekerheid. Op de Tarieven-pagina vind je alle pakketten en de prijs voor een losse les.',
      },
    ],
  },
  {
    title: 'Examens',
    description:
      'Van theorie tot praktijk: alles over je examen en wat je kunt verwachten.',
    icon: <GraduationCap className="w-6 h-6" />,
    image: '/faq-geslaagd-4.png',
    imageAlt: 'Leerling toont trots zijn geslaagd-bord',
    faqs: [
      {
        question: 'Wanneer moet ik het theorie-examen doen?',
        answer:
          'Je mag het theorie-examen doen zodra je 16 jaar bent. Het is verstandig om dit ruim vóór je praktijkexamen te halen, zodat je de regels kent tijdens je lessen. Het theoriecertificaat is 1,5 jaar geldig.',
      },
      {
        question: 'Hoe werkt het praktijkexamen?',
        answer:
          'Vanaf 17 jaar mag je het praktijkexamen doen. Het examen duurt ongeveer 55 minuten en wordt afgenomen door het CBR. Je instructeur kan mee rijden. Na het examen hoor je direct of je geslaagd bent. Wij helpen je met de planning en voorbereiding.',
      },
      {
        question: 'Hoe lang is de wachttijd voor een examen?',
        answer:
          'De wachttijd voor een praktijkexamen verschilt per regio en seizoen, vaak tussen de paar weken en enkele maanden. We plannen je examen in overleg met je lesplan, zodat je op tijd aan de beurt bent.',
      },
      {
        question:
          'Wat als ik niet slaag voor mijn praktijkexamen (herexamen)?',
        answer:
          'Geen zorgen: je kunt gewoon opnieuw examen doen. Sommige pakketten bevatten al een herexamen. Anders boeken we een nieuw examen in. We kijken samen wat er misging en oefenen gericht tot je klaar bent voor een volgende poging.',
      },
    ],
  },
];

function FaqAccordionItem({
  faq,
  index,
  globalIndex,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  index: number;
  globalIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px', amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.34, 1.15, 0.64, 1],
      }}
      className={`rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${
        isOpen
          ? 'bg-white border-2 border-primary/15 ring-2 ring-secondary/20'
          : 'bg-white border border-primary/8'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-5 py-4 md:px-6 md:py-5 text-left transition-colors duration-200 ${
          isOpen ? 'bg-primary/5' : 'hover:bg-primary/5'
        }`}
      >
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
            isOpen
              ? 'bg-secondary text-white'
              : 'bg-secondary/10 text-secondary-dark'
          }`}
        >
          {globalIndex}
        </span>
        <span
          className={`flex-1 font-semibold text-base md:text-lg ${
            isOpen ? 'text-primary' : 'text-gray-900'
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? 'bg-secondary text-white rotate-180'
              : 'bg-primary/10 text-primary'
          }`}
        >
          <ChevronDown size={20} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 ml-12 md:ml-14 border-l-4 border-secondary bg-amber-50/40">
              <p className="text-gray-700 leading-relaxed text-base pt-4">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VeelGesteldeVragen() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  let globalCounter = 0;

  return (
    <div className="min-h-screen">
      {/* Hero: split layout with heading + image placeholder */}
      <div className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="container-custom py-12 md:py-20 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm mb-10 transition-colors"
          >
            <ArrowLeft size={18} />
            Terug naar home
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm tracking-wide uppercase mb-4">
                  <Search size={16} />
                  Veelgestelde vragen
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
                  Alles wat je wilt weten over{' '}
                  <span className="text-secondary">rijlessen</span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Van inschrijven tot je rijbewijs: vind hier antwoorden op de
                  meest gestelde vragen over onze rijlessen, pakketten en
                  examens.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-shrink-0 w-full max-w-sm lg:max-w-md"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="/faq-geslaagd-1.png"
                  alt="Geslaagde leerling met bord bij Rijschool Dynamiek"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 md:h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgb(241 245 249) 0%, rgba(241, 245, 249, 0.9) 20%, transparent 45%, transparent 100%)',
          }}
        />
      </div>

      {/* Intro strip */}
      <div className="relative bg-lines-pattern">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 py-6 md:py-8 border-b border-primary/8"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Search size={20} />
            </div>
            <p className="text-gray-600 text-base md:text-lg">
              We hebben de vragen voor je opgedeeld in{' '}
              <span className="font-semibold text-primary">3 categorieën</span>{' '}
              — scroll naar beneden of klik op een vraag.
            </p>
          </motion.div>
        </div>

        {/* FAQ groups */}
        <div className="container-custom py-10 md:py-16 relative z-10">
          <div className="space-y-20 md:space-y-28">
            {faqGroups.map((group, groupIndex) => {
              const isReversed = groupIndex % 2 !== 0;
              const startIndex = globalCounter;
              globalCounter += group.faqs.length;

              return (
                <motion.section
                  key={group.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {group.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {group.title}
                      </h2>
                      <p className="text-gray-500 text-sm md:text-base mt-0.5">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Content: image + faqs, alternating sides */}
                  <div
                    className={`flex flex-col ${
                      isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } gap-8 lg:gap-12 items-start`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 lg:sticky lg:top-28"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-1 ring-primary/10"
                      >
                        <img
                          src={group.image}
                          alt={group.imageAlt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                      </motion.div>
                    </motion.div>

                    {/* FAQ items */}
                    <div className="flex-1 space-y-3 min-w-0">
                      {group.faqs.map((faq, faqIndex) => {
                        const num = startIndex + faqIndex + 1;
                        const key = `${groupIndex}-${faqIndex}`;
                        return (
                          <FaqAccordionItem
                            key={key}
                            faq={faq}
                            index={faqIndex}
                            globalIndex={num}
                            isOpen={openKey === key}
                            onToggle={() =>
                              setOpenKey(openKey === key ? null : key)
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>

          {/* CTA block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="mt-20 md:mt-28 relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(245,158,11,0.12),transparent_60%)]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Staat je vraag er niet bij?
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
                  Geen probleem! Neem gerust contact met ons op. We helpen je
                  graag verder en beantwoorden al je vragen persoonlijk.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    to="/#contact"
                    className="inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg text-base"
                  >
                    Neem contact op
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center border-2 border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base"
                  >
                    Terug naar home
                  </Link>
                </div>
              </div>

              <div className="flex-shrink-0 w-full max-w-[260px] md:max-w-[280px]">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
                  <img
                    src="/faq-geslaagd-1.png"
                    alt="Geslaagde leerling Rijschool Dynamiek"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
