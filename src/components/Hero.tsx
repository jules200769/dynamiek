import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';

import heroVideo from '../../747eacd9-e251-4c7f-985a-6a96eb404fcd.mp4';

export default function Hero() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trustPoints = [
    'Betalen in termijnen',
    'Examengerichte rijlessen',
    'CBR erkende rijschool',
    '10+ jaar ervaring',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30"></div>
      </div>

      <div className="container-custom relative z-10 pt-44 lg:pt-48 pb-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-white"
          >
            {/* Lange witte container rond de reviews boven de titel */}
            <div className="w-full max-w-[680px] mb-4 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-4 shadow-lg border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white text-base">G</span>
                <span className="text-white/80 text-sm">(4,8/5) Google | 600+ reviews</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-secondary text-secondary" />
                ))}
                <a
                  href="#reviews"
                  className="ml-2 text-sm font-semibold text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors"
                >
                  Bekijk hier &rsaquo;
                </a>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-[605px]">
              Rijschool <span className="text-secondary">De Expert</span>
            </h1>

            <p className="text-base md:text-lg text-gray-200 mb-8 max-w-lg leading-relaxed">
              Als CBR-erkende rijschool zorgen wij ervoor dat je optimaal bent voorbereid op het
              CBR-praktijkexamen. Onze examengerichte aanpak garandeert dat je snel en effectief
              je rijbewijs haalt. Bij Rijschool De Expert volg je rijles in een moderne lesauto,
              onder begeleiding van ervaren instructeurs.
            </p>

            <ul className="space-y-3 mb-10">
              {trustPoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/90 font-medium"
                >
                  <ChevronRight size={18} className="text-secondary flex-shrink-0" />
                  {point}
                </motion.li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-8 rounded-xl transition-colors text-base"
            >
              Neem contact op &rsaquo;
            </a>
          </motion.div>

          {/* Right: Lead form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full lg:w-[450px] flex-shrink-0"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-7 md:p-8 border border-white/20">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-white/20 text-green-300 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Star size={28} className="fill-green-400 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bedankt voor je aanvraag!</h3>
                  <p className="text-white/80 text-sm mb-6">We nemen zo snel mogelijk contact met je op.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-white font-semibold hover:underline text-sm"
                  >
                    Nog een aanvraag doen
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-white text-center mb-1">
                    Vraag onze gratis proefles aan!
                  </h2>
                  <p className="text-secondary font-semibold text-center text-sm mb-5">
                    Proefles is gratis i.c.m. een lespakket.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none [color-scheme:dark]"
                    >
                      <option value="" disabled className="text-gray-900">Selecteer je opleiding</option>
                      <option className="text-gray-900">Auto (B)</option>
                      <option className="text-gray-900">Motor (A)</option>
                      <option className="text-gray-900">Scooter (AM)</option>
                      <option className="text-gray-900">Aanhanger (BE)</option>
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="Naam en Achternaam"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white/90 text-sm focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 [color-scheme:dark]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="email"
                        placeholder="E-mail adres"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Telefoonnummer"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Woonplaats"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                      <input
                        type="text"
                        placeholder="Postcode"
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Adres"
                      className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />

                    <select
                      defaultValue=""
                      className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white/80 text-sm focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none [color-scheme:dark]"
                    >
                      <option value="" disabled className="text-gray-900">Hoe heb je ons gevonden?</option>
                      <option className="text-gray-900">Google</option>
                      <option className="text-gray-900">Social media</option>
                      <option className="text-gray-900">Via via</option>
                      <option className="text-gray-900">Anders</option>
                    </select>

                    <textarea
                      rows={3}
                      placeholder="Eventueel bericht (niet verplicht)"
                      className="w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                    ></textarea>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-secondary flex-shrink-0"
                      />
                      <span className="text-xs text-white/80 leading-relaxed">
                        Ik ga akkoord met de{' '}
                        <a href="#" className="text-secondary underline hover:text-secondary/80">
                          algemene voorwaarden
                        </a>{' '}
                        en het{' '}
                        <a href="#" className="text-secondary underline hover:text-secondary/80">
                          privacybeleid
                        </a>.
                        {!agreed && <span className="text-amber-300 ml-1">(Vereist)</span>}
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-xl transition-colors text-base"
                    >
                      Aanvragen
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
