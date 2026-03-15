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
    answer: 'Tijdens de proefles maak je kennis met de instructeur en de auto. We kijken naar je huidige vaardigheden en aan het eind krijg je een eerlijk advies over welk pakket het beste bij je past. De les is geheel vrijblijvend.'
  },
  {
    question: 'Kan ik mijn pakket in termijnen betalen?',
    answer: 'Ja, bij De Expert is het mogelijk om je lespakket in 2, 3 of zelfs 4 termijnen te betalen. Zo blijft het behalen van je rijbewijs voor iedereen betaalbaar.'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Veelgestelde Vragen</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Alles wat je moet weten
            </h3>
            <p className="text-gray-600 mb-8">
              Heb je een andere vraag? Neem gerust contact met ons op via telefoon of e-mail. 
              We helpen je graag verder.
            </p>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <p className="font-bold text-primary mb-2">Nog steeds vragen?</p>
              <p className="text-sm text-gray-600 mb-4">Onze klantenservice staat voor je klaar.</p>
              <a href="tel:0851234567" className="text-primary font-bold flex items-center">
                Bel ons: 085 - 123 45 67
              </a>
            </div>
          </div>

          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
