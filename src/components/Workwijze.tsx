import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const modules = [
  'Module 1: Voertuigbediening en beheersing',
  'Module 2: Beheersing eenvoudige verkeerssituaties',
  'Module 3: Beheersing complexe verkeerssituaties',
  'Module 4: Verantwoord rijgedrag',
];

export default function Workwijze() {
  return (
    <section id="werkwijze" className="py-24 bg-[linear-gradient(to_bottom,#0b2648_0%,#0b2648_50%,white_100%)] overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch gap-10">

        {/* Left — aligned with container */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 flex flex-col gap-6
                     mx-4 sm:mx-6 lg:ml-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:mr-0"
        >
          {/* Blue card */}
          <div className="bg-blue-50 rounded-3xl p-10">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Werkwijze</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Dynamisch Leren Rijden in stappen
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Met onze methode zetten we in op een gestructureerde en stapsgewijze aanpak. Wij begrijpen dat iedereen op zijn of haar eigen tempo leert en passen onze lessen aan op jouw persoonlijke leerstijl. We maken gebruik van een instructievorderingskaart om het leerproces te optimaliseren.
            </p>

            <ul className="space-y-3">
              {modules.map((mod, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {mod}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons below the card */}
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary gap-2">
              Gratis Proefles <ArrowRight size={18} />
            </a>
            <a href="#tarieven" className="btn-outline border-white text-white hover:bg-white hover:text-[#0b2648] gap-2">
              Tarieven <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>

        {/* Right image — touches right viewport edge */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:w-1/2 rounded-l-3xl overflow-hidden min-h-[420px] mx-4 sm:mx-6 lg:mx-0 lg:rounded-r-none"
        >
          <img
            src="/waarom-achtergrond.jpg"
            alt="Interieur lesvoertuig Rijschool Dynamiek"
            className="w-full h-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}
