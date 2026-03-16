import { motion } from 'motion/react';
import { CreditCard, Calendar, User, Users, Shield, Clock } from 'lucide-react';

const benefits = [
  {
    title: 'Betalen in termijnen',
    description: 'Geen grote uitgave in één keer. Betaal je pakket gemakkelijk in maandelijkse termijnen.',
    icon: <CreditCard className="text-secondary" size={24} />
  },
  {
    title: 'Snelle examenplanning',
    description: 'Wij hebben korte wachttijden en plannen je examen direct zodra je er klaar voor bent.',
    icon: <Calendar className="text-secondary" size={24} />
  },
  {
    title: 'Vaste instructeur',
    description: 'Je krijgt een vaste instructeur die jouw voortgang precies kent en je optimaal begeleidt.',
    icon: <User className="text-secondary" size={24} />
  },
  {
    title: 'Ervaren instructeurs',
    description: 'Onze instructeurs zijn gediplomeerd en hebben ruime ervaring in het geven van rijlessen.',
    icon: <Users className="text-secondary" size={24} />
  },
  {
    title: 'Moderne lesvoertuigen',
    description: 'Lessen in een moderne lesauto, voorzien van alle gemakken voor een optimale leerervaring.',
    icon: <Shield className="text-secondary" size={24} />
  },
  {
    title: 'Flexibele lestijden',
    description: 'Lessen wanneer het jou uitkomt: overdag, ’s avonds of in het weekend.',
    icon: <Clock className="text-secondary" size={24} />
  }
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Waarom Rijschool Dynamiek?</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
              De beste begeleiding voor jouw rijbewijs
            </h3>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              Met onze methode Dynamisch Leren Rijden in stappen passen we de lessen aan op jouw persoonlijke leerstijl. 
              Wij streven ernaar je beter voor te bereiden op het examen, dit in een zo kort mogelijke periode te realiseren, 
              en je veiliger, bewuster en zelfstandiger te laten rijden.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col space-y-3"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop"
                alt="Happy student with instructor"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-3xl -z-10 hidden sm:block"></div>
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/10 rounded-full -z-10 blur-2xl"></div>
            
            {/* Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 hidden sm:block border border-gray-100"
            >
              <div className="text-center">
                <span className="block text-3xl font-black text-primary">Hoog</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slagingspercentage</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
