import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const faqs = [
  {
    question: 'Hoe schrijf ik me in voor rijlessen?',
    answer: 'Je kunt je eenvoudig inschrijven via onze website door een proefles aan te vragen, of door ons te bellen of te mailen. Na je aanmelding plannen we samen een proefles in. Daarna kies je een lespakket of losse lessen en kun je direct starten.',
  },
  {
    question: 'Wat is een proefles en is die gratis?',
    answer: 'Tijdens een proefles maak je kennis met je instructeur en de lesauto. We kijken naar je huidige niveau en geven een eerlijk advies over het aantal lessen dat je waarschijnlijk nodig hebt. De proefles is gratis in combinatie met een lespakket. Vraag hem aan via de knop op de homepage.',
  },
  {
    question: 'Hoeveel rijlessen heb ik gemiddeld nodig?',
    answer: 'Het gemiddelde aantal rijlessen in Nederland ligt rond de 35–40 lessen. Dit verschilt per persoon: ervaring, leertempo en beschikbaarheid spelen een rol. Na je proefles geven we een inschatting op maat.',
  },
  {
    question: 'Wanneer moet ik het theorie-examen doen?',
    answer: 'Je mag het theorie-examen doen zodra je 16 jaar bent. Het is verstandig om dit ruim vóór je praktijkexamen te halen, zodat je de regels kent tijdens je lessen. Het theoriecertificaat is 1,5 jaar geldig.',
  },
  {
    question: 'Hoe werkt het praktijkexamen?',
    answer: 'Vanaf 17 jaar mag je het praktijkexamen doen. Het examen duurt ongeveer 55 minuten en wordt afgenomen door het CBR. Je instructeur kan mee rijden. Na het examen hoor je direct of je geslaagd bent. Wij helpen je met de planning en voorbereiding.',
  },
  {
    question: 'Hoe kan ik betalen voor mijn rijlessen?',
    answer: 'Bij Rijschool Dynamiek kun je flexibel betalen: per maand of zelfs per rijles. Bij de meeste pakketten is betaling in termijnen mogelijk. Zo hoef je niet alles in één keer te betalen en blijft het voor iedereen betaalbaar.',
  },
  {
    question: 'Kan ik losse lessen nemen of moet ik een pakket kiezen?',
    answer: 'Beide kan. Je kunt losse lessen boeken als je flexibel wilt blijven, of een pakket nemen voor een voordeligere prijs en meer zekerheid. Op de Tarieven-pagina vind je alle pakketten en de prijs voor een losse les.',
  },
  {
    question: 'Hoe lang is de wachttijd voor een examen?',
    answer: 'De wachttijd voor een praktijkexamen verschilt per regio en seizoen, vaak tussen de paar weken en enkele maanden. We plannen je examen in overleg met je lesplan, zodat je op tijd aan de beurt bent.',
  },
  {
    question: 'Wat als ik niet slaag voor mijn praktijkexamen (herexamen)?',
    answer: 'Geen zorgen: je kunt gewoon opnieuw examen doen. Sommige pakketten bevatten al een herexamen. Anders boeken we een nieuw examen in. We kijken samen wat er misging en oefenen gericht tot je klaar bent voor een volgende poging.',
  },
  {
    question: 'Hoe snel kan ik beginnen met rijlessen?',
    answer: 'Vaak kun je binnen een paar dagen al je eerste (proef)les inplannen. We kijken naar jouw agenda en die van de instructeur. Wil je snel starten? Vraag een proefles aan of bel ons direct voor de eerste beschikbare datum.',
  },
];

export default function VeelGesteldeVragen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Header: donkerblauw met titel + intro, zachte overgang naar wit */}
      <div className="relative bg-primary text-white overflow-hidden">
        <div className="container-custom py-12 md:py-16 max-w-3xl mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Terug naar home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Veel gestelde vragen
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Hier vind je antwoorden op de meest gestelde vragen over rijlessen, examens en het starten met je rijopleiding.
          </p>
        </div>
        {/* Zachte overgang: donkerblauw loopt nog iets verder door, daarna pas fade naar wit */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 md:h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgb(241 245 249) 0%, rgba(241, 245, 249, 0.9) 20%, transparent 45%, transparent 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        />
      </div>

      {/* Lichte sectie met subtiel bewegend lijnenpatroon */}
      <div className="relative bg-lines-pattern">
      <div className="container-custom py-10 md:py-14 max-w-3xl mx-auto relative z-10">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px', amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.34, 1.15, 0.64, 1],
              }}
              className={`rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg ${
                openIndex === index
                  ? 'bg-white border-2 border-primary/20 ring-2 ring-secondary/30'
                  : 'bg-white border border-primary/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-5 text-left transition-colors duration-200 ${
                  openIndex === index ? 'bg-primary/5' : 'hover:bg-primary/5'
                }`}
              >
                <span className={`font-semibold text-base md:text-lg pr-2 ${openIndex === index ? 'text-primary' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openIndex === index
                      ? 'bg-secondary text-white rotate-180'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <ChevronDown size={20} />
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 border-l-4 border-secondary bg-amber-50/50">
                      <p className="text-gray-700 leading-relaxed text-base pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA: donkerblauw blok met oranje knop */}
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-primary text-white text-center shadow-xl">
          <p className="text-blue-100 mb-5">
            Staat je vraag er niet bij?
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
          >
            Neem contact op
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
