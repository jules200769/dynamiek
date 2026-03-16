import { motion } from 'motion/react';
import { Layers, BookOpen } from 'lucide-react';

const modules = [
  'Module 1: Voertuigbediening en beheersing',
  'Module 2: Beheersing eenvoudige verkeerssituaties',
  'Module 3: Beheersing complexe verkeerssituaties',
  'Module 4: Verantwoorde (rij)gedrag',
];

export default function Workwijze() {
  return (
    <section id="werkwijze" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Werkwijze</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Dynamisch Leren Rijden in stappen
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Met onze methode zetten we in op een gestructureerde en stapsgewijze aanpak. Wij begrijpen dat iedereen op zijn of haar eigen tempo leert en passen onze lessen aan op jouw persoonlijke leerstijl. We maken gebruik van een instructievorderingskaart om het leerproces te optimaliseren.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">De vier modules</h4>
              <ul className="space-y-2 text-gray-600">
                {modules.map((mod, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary flex-shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Instructievorderingskaart</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                De instructievorderingskaart biedt overzicht van je voortgang en behaalde resultaten. Hierop worden belangrijke leerthema&apos;s en punten van aandacht genoteerd, zodat doelen helder zijn en je gerichter kunt oefenen.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
