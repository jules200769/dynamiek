import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send the data to a server here
  };

  const regions = [
    'Amsterdam', 'Amstelveen', 'Haarlem', 'Hoofddorp', 
    'Zaandam', 'Purmerend', 'Uithoorn', 'Aalsmeer'
  ];

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Info & Regions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Contact & Regio</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
              Klaar om te starten?
            </h3>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Ons Kantoor</h4>
                  <p className="text-gray-600">Hoofdstraat 123, 1011 AB Amsterdam</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Telefoon</h4>
                  <p className="text-gray-600">085 - 123 45 67</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">E-mail</h4>
                  <p className="text-gray-600">info@rijschoolexpert.nl</p>
                </div>
              </div>
            </div>

            <div id="regions">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 text-primary" size={20} />
                Wij lessen in:
              </h4>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <span 
                    key={region} 
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-100 shadow-sm"
                  >
                    {region}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                Staat jouw woonplaats er niet bij? Neem contact op voor de mogelijkheden.
              </p>
            </div>
          </motion.div>

          {/* Lead Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Bedankt voor je aanvraag!</h4>
                  <p className="text-gray-600 mb-8">
                    We hebben je bericht ontvangen en nemen binnen 24 uur contact met je op om je proefles in te plannen.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Nog een bericht sturen
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Gratis Proefles Aanvragen</h4>
                    <p className="text-gray-600 mb-8">Vul je gegevens in en we bellen je zo snel mogelijk terug.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Naam</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Je volledige naam"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Telefoon</label>
                          <input 
                            required
                            type="tel" 
                            placeholder="06 - 123 456 78"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-mail</label>
                        <input 
                          required
                          type="email" 
                          placeholder="jouw@email.nl"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Type Rijbewijs</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none">
                          <option>Auto (B)</option>
                          <option>Motor (A)</option>
                          <option>Scooter (AM)</option>
                          <option>Aanhanger (BE)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bericht (optioneel)</label>
                        <textarea 
                          rows={3}
                          placeholder="Heb je al ervaring of specifieke wensen?"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                        ></textarea>
                      </div>
                      
                      <div className="pt-4">
                        <button type="submit" className="w-full btn-primary py-4 text-lg group">
                          Aanvraag Versturen
                          <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
                        <Clock size={14} />
                        <span>We reageren meestal binnen 24 uur</span>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
