import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Sophie van Dam',
    text: 'In één keer geslaagd! Mijn instructeur was super geduldig en legde alles heel duidelijk uit. De proefles gaf me direct vertrouwen.',
    rating: 5,
    date: '2 weken geleden'
  },
  {
    name: 'Thomas de Boer',
    text: 'Fijne rijschool met moderne auto’s. De planning was altijd flexibel, wat perfect was naast mijn studie. Echt een aanrader!',
    rating: 5,
    date: '1 maand geleden'
  },
  {
    name: 'Lisa Meijer',
    text: 'Na een nare ervaring bij een andere rijschool hier terecht gekomen. Wat een verschil! Eindelijk met plezier de weg op.',
    rating: 4,
    date: '3 maanden geleden'
  },
  {
    name: 'Mark Janssen',
    text: 'Top begeleiding voor mijn motorrijbewijs. De instructeur rijdt zelf ook mee en geeft super handige tips via de porto.',
    rating: 5,
    date: '4 maanden geleden'
  }
];

export default function Reviews() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Klantervaringen</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Wat onze leerlingen zeggen
            </h3>
            <p className="text-gray-600">
              Wij zijn trots op onze leerlingen en hun resultaten. Met een gemiddelde score van 4.8/5 
              behoren we tot de top van de regio.
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex text-secondary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold text-gray-900">4.8 / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative"
            >
              <Quote className="absolute top-6 right-6 text-gray-100" size={40} />
              
              <div className="flex text-secondary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    className={i < review.rating ? "text-secondary" : "text-gray-200"}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 text-sm italic mb-8 leading-relaxed flex-grow">
                "{review.text}"
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                <span className="text-gray-400 text-xs">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="https://google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary font-bold hover:text-secondary transition-colors inline-flex items-center"
          >
            Bekijk alle 250+ reviews op Google
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="ml-2">
              →
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
}
