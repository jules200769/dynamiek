import { motion } from 'motion/react';
import { Car } from 'lucide-react';

const services = [
  {
    title: 'Auto Rijbewijs (B)',
    description: 'De rijopleiding bij Rijschool Dynamiek leidt op voor het rijbewijs B. Met onze methode Dynamisch Leren Rijden in stappen bereiden we je optimaal voor op het praktijkexamen.',
    icon: <Car size={32} />,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop',
    link: '/rijlessen'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Onze Opleiding</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Rijbewijs B – Dynamisch in stappen leren rijden
          </p>
          <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 max-w-2xl mx-auto gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary">
                  {service.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <a 
                  href={service.link}
                  className="text-primary font-bold text-sm flex items-center group-hover:text-secondary transition-colors"
                >
                  Lees meer
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
