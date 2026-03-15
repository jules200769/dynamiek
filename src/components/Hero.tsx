import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function Hero() {
  const trustPoints = [
    'CBR Gecertificeerd',
    'Ervaren Instructeurs',
    'Flexibel Betalen',
    'Hoog Slagingspercentage',
  ];

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          alt="Driving lesson"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40"></div>
      </div>

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 text-secondary font-bold text-sm mb-6 border border-secondary/30">
              #1 Rijschool in de regio
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Snel en veilig je <span className="text-secondary">rijbewijs</span> halen
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
              Bij Rijschool De Expert leer je autorijden op een manier die bij jou past. 
              Met onze ervaren instructeurs en persoonlijke aanpak ben je optimaal voorbereid op je examen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#contact" className="btn-primary text-lg group">
                Gratis Proefles Aanvragen
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a href="#pricing" className="btn-outline border-white text-white hover:bg-white hover:text-primary text-lg">
                Bekijk Tarieven
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 text-white/90"
                >
                  <CheckCircle className="text-secondary" size={20} />
                  <span className="font-medium">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
