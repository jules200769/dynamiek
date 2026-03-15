import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';

const packages = [
  {
    name: 'Basis Pakket',
    price: '1.499',
    lessons: '20 lessen',
    features: [
      '20 rijlessen van 60 min',
      'Praktijkexamen CBR',
      'Online theoriecursus',
      'Tussentijdse toets',
      'Vaste instructeur'
    ],
    popular: false,
    color: 'bg-white'
  },
  {
    name: 'Zekerheid Pakket',
    price: '2.199',
    lessons: '35 lessen',
    features: [
      '35 rijlessen van 60 min',
      'Praktijkexamen CBR',
      'Gratis herexamen',
      'Online theoriecursus',
      'Tussentijdse toets',
      'Vaste instructeur'
    ],
    popular: true,
    color: 'bg-primary'
  },
  {
    name: 'Snelcursus',
    price: '1.899',
    lessons: '25 lessen',
    features: [
      '25 rijlessen van 60 min',
      'Binnen 2-4 weken examen',
      'Praktijkexamen CBR',
      'Online theoriecursus',
      'Intensieve begeleiding',
      'Vaste instructeur'
    ],
    popular: false,
    color: 'bg-white'
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Tarieven & Pakketten</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Transparante prijzen zonder verrassingen
          </h3>
          <p className="text-gray-600">
            Kies het pakket dat het beste bij jouw ervaring en budget past. 
            Niet zeker? Start met een gratis proefles voor een persoonlijk advies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col ${
                pkg.popular ? 'bg-primary text-white scale-105 z-10' : 'bg-white text-gray-900'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-secondary text-white py-1 px-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                  <Star size={12} fill="currentColor" />
                  <span>Meest Gekozen</span>
                </div>
              )}

              <div className="mb-8">
                <h4 className={`text-xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-sm font-bold">€</span>
                  <span className="text-5xl font-black">{pkg.price}</span>
                  <span className={`text-sm font-medium ${pkg.popular ? 'text-blue-200' : 'text-gray-500'}`}>
                    / pakket
                  </span>
                </div>
                <p className={`mt-2 font-semibold ${pkg.popular ? 'text-blue-100' : 'text-primary'}`}>
                  {pkg.lessons}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3">
                    <div className={`mt-1 rounded-full p-0.5 ${pkg.popular ? 'bg-blue-400' : 'bg-blue-100'}`}>
                      <Check size={14} className={pkg.popular ? 'text-white' : 'text-primary'} />
                    </div>
                    <span className={`text-sm ${pkg.popular ? 'text-blue-50' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Nu Aanmelden
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            * Losse lessen zijn ook mogelijk voor € 58,- per 60 minuten. 
            Alle prijzen zijn inclusief BTW.
          </p>
        </div>
      </div>
    </section>
  );
}
