import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

import heroVideo from '../../747eacd9-e251-4c7f-985a-6a96eb404fcd.mp4';

export default function Hero() {
  const trustPoints = [
    'CBR Gecertificeerd',
    'Ervaren Instructeurs',
    'Flexibel Betalen',
    'Hoog Slagingspercentage',
  ];

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-label="Hero achtergrond"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40"></div>
      </div>

      <div className="container-custom relative z-10 pt-28 lg:pt-32 h-full flex items-center justify-center lg:justify-center">
        <div className="max-w-3xl w-full lg:flex lg:justify-center lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Alleen titel in blur-container (op desktop), breedte volgt titel */}
            <div className="lg:backdrop-blur-xl lg:bg-white/10 lg:rounded-2xl lg:border lg:border-white/20 lg:px-10 lg:py-8 lg:shadow-2xl lg:mb-8 lg:w-fit lg:-translate-x-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Snel en veilig je <span className="text-secondary">rijbewijs</span> halen
              </h1>
            </div>

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
    </section>
  );
}
