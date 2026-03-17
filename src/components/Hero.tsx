import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Star, X } from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import Magnet from '@/components/Magnet';
import LogoDynamiek from '@/src/assets/logo-dynamiek.png';

import heroVideo from '../../747eacd9-e251-4c7f-985a-6a96eb404fcd.mp4';
import heroVideoMobile from '../../Generated Video March 15, 2026 - 11_21PM.mp4';

export default function Hero() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTrialForm, setShowTrialForm] = useState(false);

  const trustPoints = [
    'Betalen per maand of per rijles',
    'Examengerichte rijlessen',
    'CBR erkende rijschool',
    'Flexibele lestijden',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('trialForm:toggle', { detail: { open: showTrialForm } }),
    );
  }, [showTrialForm]);

  useEffect(() => {
    if (!showTrialForm) return;

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;

    // Lock background scroll while the modal is open (prevents scroll + bounce on mobile).
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTrialForm(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [showTrialForm]);

  return (
    <section className="relative min-h-[100svh] min-h-screen flex items-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Mobile-only hero video */}
        <video
          src={heroVideoMobile}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:hidden scale-[1.16] origin-center"
          aria-label="Hero achtergrond (mobiel)"
        />
        {/* Desktop hero video */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          aria-label="Hero achtergrond"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30"></div>
      </div>

      <div className="container-custom relative z-10 pt-44 lg:pt-48 pb-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text content — op mobile: h1 → button → GlassSurface (order) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-white flex flex-col"
          >
            {/* Mobile: h1 eerst (order-1), dan button (order-2), dan GlassSurface (order-3). LG: GlassSurface eerst (lg:order-1), h1 (lg:order-2). */}
            <h1 className="order-1 lg:order-2 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-[605px]">
              Rijschool <span className="text-secondary">Dynamiek</span>
            </h1>

            {/* Knop alleen op mobile, tussen h1 en GlassSurface; geen Magnet op mobile */}
            <div className="order-2 lg:hidden w-full max-w-sm mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowTrialForm(true);
                  setSubmitted(false);
                }}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-extrabold text-lg py-4 md:py-5 rounded-2xl shadow-2xl shadow-secondary/40 transition-transform duration-200 active:scale-95"
              >
                Gratis proefles aanvragen
              </button>
            </div>

            {/* Lange witte container rond de reviews – GlassSurface effect */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={12}
              className="order-3 lg:order-1 w-full max-w-[680px] mb-4 shadow-lg"
              style={{ minHeight: 72 }}
            >
              <div className="w-full px-5 py-4 flex items-center justify-between text-left">
                <div className="flex items-center gap-4 overflow-visible">
                  <div className="h-10 flex items-center overflow-visible">
                    <img
                      src={LogoDynamiek}
                      alt="Rijschool Dynamiek"
                      className="h-24 w-auto -ml-4 drop-shadow-md"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-white/80 text-sm whitespace-nowrap">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          fill="#EA4335"
                          d="M12 10.2v3.7h5.2c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4c1.8-1.7 2.8-4.1 2.8-6.9 0-.7-.1-1.3-.2-1.9H12z"
                        />
                        <path
                          fill="#34A853"
                          d="M6.6 14.3l-.8.6-2.5 1.9C4.6 19.9 8 22 12 22c2.4 0 4.5-.8 6-2.1l-3.1-2.4c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.6z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M4.1 8.8 1.6 6.9C.9 8.1.5 9.5.5 11c0 1.5.4 2.9 1.1 4.1l3.5-2.7c-.2-.7-.3-1.3-.3-2 0-.6.1-1.2.3-1.6z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M12 5.4c1.3 0 2.5.4 3.4 1.3l2.5-2.5C16.5 2.6 14.4 1.8 12 1.8 8 1.8 4.6 3.9 3 6.9l3.5 2.7C7.2 7.7 9.1 5.4 12 5.4z"
                        />
                      </svg>
                      <span>(5/5) Google</span>
                      <span className="hidden sm:inline">| 30+ reviews</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  href="https://www.google.com/search?sca_esv=608d6234066b0d5b&biw=1536&bih=730&sxsrf=ANbL-n4_c_piSyPQaey0dUQSxav8hN1pJg:1773661338619&q=Rijschool+Dynamiek&sa=X&ved=2ahUKEwiqnaiwq6STAxXD3wIHHQfODrcQkc0JKAB6BAgMEAE&ictx=0"
                  className="ml-4 text-sm font-semibold text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors whitespace-nowrap"
                >
                  Bekijk hier &rsaquo;
                </a>
              </div>
            </GlassSurface>

            <p className="order-4 lg:order-3 text-base md:text-lg text-gray-200 mb-8 max-w-lg leading-relaxed">
              Welkom bij Rijschool Dynamiek! Met onze methode Dynamisch Leren Rijden in stappen bereiden we je optimaal voor op het rijbewijs B. Wij streven ernaar je beter voor te bereiden op het examen, dit in een zo kort mogelijke periode te realiseren, en je veiliger, bewuster en zelfstandiger te laten rijden.
            </p>

            <ul className="order-4 lg:order-3 space-y-3 mb-10">
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

            {/*
              Removed per request: secondary "Neem contact op" CTA in hero.
              Primary CTA is the "Gratis proefles aanvragen" button.
            */}
          </motion.div>

          {/* Right: CTA knop (alleen desktop; op mobile staat de knop tussen h1 en GlassSurface zonder Magnet) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:flex w-full lg:w-[450px] flex-shrink-0 justify-center"
          >
            <Magnet
              padding={130}
              magnetStrength={5}
              wrapperClassName="w-full max-w-sm"
              innerClassName="w-full"
            >
              <button
                type="button"
                onClick={() => {
                  setShowTrialForm(true);
                  setSubmitted(false);
                }}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-extrabold text-lg py-4 md:py-5 rounded-2xl shadow-2xl shadow-secondary/40 transition-transform duration-200 active:scale-95"
              >
                Gratis proefles aanvragen
              </button>
            </Magnet>
          </motion.div>

          <AnimatePresence>
            {showTrialForm && (
              <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTrialForm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: [0.9, 1.02, 1] }}
                  exit={{ opacity: 0, y: 24, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 md:p-8 border border-gray-200 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setShowTrialForm(false)}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    aria-label="Sluit proeflesformulier"
                  >
                    <X size={18} />
                  </button>

                  {submitted ? (
                    <div className="text-center py-6 mt-2">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Star size={28} className="fill-green-500 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Bedankt voor je aanvraag!</h3>
                      <p className="text-gray-600 text-sm mb-6">We nemen zo snel mogelijk contact met je op.</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary font-semibold hover:underline text-sm"
                      >
                        Nog een aanvraag doen
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-extrabold text-gray-900 text-center mb-1">
                        Vraag onze gratis proefles aan!
                      </h2>
                      <p className="text-secondary font-semibold text-center text-sm mb-5">
                        Proefles is gratis i.c.m. een lespakket.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <select
                          required
                          defaultValue=""
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        >
                          <option value="" disabled className="text-gray-500">Selecteer je opleiding</option>
                          <option className="text-gray-900">Auto (B)</option>
                        </select>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            type="text"
                            placeholder="Naam en Achternaam"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                          <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            type="email"
                            placeholder="E-mail adres"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                          <input
                            required
                            type="tel"
                            placeholder="Telefoonnummer"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Woonplaats"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                          <input
                            type="text"
                            placeholder="Postcode"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Adres"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />

                        <select
                          defaultValue=""
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        >
                          <option value="" disabled className="text-gray-500">Hoe heb je ons gevonden?</option>
                          <option className="text-gray-900">Google</option>
                          <option className="text-gray-900">Social media</option>
                          <option className="text-gray-900">Via via</option>
                          <option className="text-gray-900">Anders</option>
                        </select>

                        <textarea
                          rows={3}
                          placeholder="Eventueel bericht (niet verplicht)"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        ></textarea>

                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-0.5 accent-secondary flex-shrink-0"
                          />
                          <span className="text-xs text-gray-600 leading-relaxed">
                            Ik ga akkoord met de{' '}
                            <a href="#" className="text-secondary underline hover:text-secondary/80">
                              algemene voorwaarden
                            </a>{' '}
                            en het{' '}
                            <a href="#" className="text-secondary underline hover:text-secondary/80">
                              privacybeleid
                            </a>.
                            {!agreed && <span className="text-amber-600 ml-1">(Vereist)</span>}
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
