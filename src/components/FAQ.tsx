import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Vanaf welke leeftijd mag ik beginnen met rijlessen?',
    answer: 'Je mag vanaf 16,5 jaar beginnen met rijlessen. Vanaf je 17e verjaardag mag je het praktijkexamen doen. Als je slaagt, mag je tot je 18e autorijden onder begeleiding van een coach.'
  },
  {
    question: 'Hoeveel rijlessen heb ik gemiddeld nodig?',
    answer: 'Het gemiddelde aantal lessen voor een leerling in Nederland ligt rond de 35-40 lessen. Dit verschilt echter per persoon. Tijdens de proefles kunnen we een goede inschatting maken van wat jij nodig hebt.'
  },
  {
    question: 'Kan ik ook lessen in een automaat?',
    answer: 'Zeker! Wij hebben moderne lesauto’s met zowel handgeschakelde als automatische versnellingsbakken. Let wel op: als je slaagt in een automaat, krijg je een aantekening op je rijbewijs en mag je alleen in automaten rijden.'
  },
  {
    question: 'Wat houdt een gratis proefles precies in?',
    answer: 'De proefles kost € 50,00 en is gratis bij afname van een lespakket. Tijdens de proefles maak je kennis met de instructeur en de auto. We kijken naar je huidige vaardigheden en geven een eerlijk advies over welk pakket het beste bij je past. Mail of bel voor een vrijblijvende proefles.'
  },
  {
    question: 'Kan ik mijn pakket in termijnen betalen?',
    answer: 'Ja! Bij Rijschool Dynamiek kan je per maand en zelfs per rijles betalen. Bij de meeste rijscholen moet je alles in één keer betalen, bij ons niet. Zo blijft het behalen van je rijbewijs voor iedereen betaalbaar.'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3 rounded-3xl overflow-hidden min-h-[420px]"
          >
            <img
              src="/faq-geslaagd.png"
              alt="Geslaagde leerling Rijschool Dynamiek Den Bosch"
              className="w-full h-full object-cover min-h-[420px]"
            />
          </motion.div>

          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border rounded-2xl transition-all duration-300 ${
                  activeIndex === index ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-lg ${activeIndex === index ? 'text-primary' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 p-1 rounded-full ${activeIndex === index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-primary/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
