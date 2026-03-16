import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Jules Roelen',
    text: 'Een van de beste Rij ervaring die ik heb gehad. Tofe en gezellige leerar, goeie en gefocuste lessen en helpt je graag je rijbeweis te halen.',
    rating: 5,
    date: '23 uur geleden'
  },
  {
    name: 'jules roelen',
    text: 'echt een toffe gast, in 1 keer geslaagd',
    rating: 5,
    date: '48 minuten geleden'
  },
  {
    name: 'Nick Van Dullemen',
    text: 'heel erg tevreden. echt een goede rij instructeur. Ik zou rijschool Dynamiek 100% aanraden',
    rating: 5,
    date: '50 minuten geleden'
  },
  {
    name: 'Nina de Koning',
    text: 'Top rijschool! In één keer geslaagd. De instructeur legt alles duidelijk uit en zorgt voor een fijne sfeer tijdens de lessen. Er is ruimte voor een grapje en een goed gesprek, maar wanneer het nodig is wordt er ook serieus gewerkt aan het rijden. Daardoor leer je op een prettige en effectieve manier. Zeker een aanrader!',
    rating: 5,
    date: '3 dagen geleden'
  },
  {
    name: 'Kylian',
    text: 'Een van de beste Rij ervaring die ik heb gehad. Tofe en gezellige leerar, goeie en gefocuste lessen en helpt je graag je rijbeweis te halen.',
    rating: 5,
    date: '2 weken geleden'
  },
  {
    name: 'Jinte Kipping',
    text: 'Doordat ik snel mijn rijbewijs wilde halen ben ik bij Rijschool dynamiek te recht gekomen! Na de eerste les mijn praktijk in geplant en de lessen eromheen! Dankzij Erhan heb ik in een keer mijn rijbewijs gehaald en veel lol gehad in de auto! Ik wil hem 1000x bedanken!! Echt een aanrader!',
    rating: 5,
    date: 'een maand geleden'
  },
  {
    name: 'Elchapo_YT',
    text: 'Vandaag in één keer geslaagd dankzij Dynamiek Rijschool! De rijlessen waren altijd duidelijk, rustig en prettig. Mijn instructeur had veel geduld en gaf fijne tips, waardoor ik met vertrouwen het examen in ging. Echt een aanrader!',
    rating: 5,
    date: '2 maanden geleden'
  },
  {
    name: 'Amy Bouwmeester',
    text: 'Ik heb altijd heel fijn gelest bij de rijschool, veel geleerd in een korte periode waardoor ik geslaagd ben! Hele fijne lessen en een duidelijke uitleg, helpt je met alles! Kreeg er altijd motivatie door! Super goede ervaring!!',
    rating: 5,
    date: '2 maanden geleden'
  },
  {
    name: 'Omar Sosa',
    text: 'Heel lieve instructuur van eerste keer geslaagd, Erhan houd je gerust en op je gemak en geeft duidelijke instructies. We hebben heel veel plezier gehad maar ben nu gelukkig geslaagd maar hoop hem nog wel in het verkeer te zien.',
    rating: 5,
    date: '3 maanden geleden'
  },
  {
    name: 'Marciano Henraath',
    text: 'k ben in één keer geslaagd dankzij rijschool dynamiek! Echt een top gozer super geduldig, duidelijk in zijn uitleg en altijd in voor een grapje waardoor de lessen relaxed maar toch leerzaam waren. Hij gaf me echt het vertrouwen achter het stuur. Zeker een aanrader voor iedereen die goed en met plezier wil leren rijden!',
    rating: 5,
    date: '4 maanden geleden'
  }
];

export default function Reviews() {
  const loopedReviews = useMemo(() => {
    const base = [...reviews];

    // Fisher-Yates shuffle
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }

    // voorkom dat dezelfde naam direct naast elkaar staat
    for (let i = 0; i < base.length - 1; i++) {
      if (base[i].name === base[i + 1].name) {
        const swapIndex = base.findIndex(
          (item, idx) => idx !== i + 1 && item.name !== base[i].name
        );
        if (swapIndex !== -1) {
          [base[i + 1], base[swapIndex]] = [base[swapIndex], base[i + 1]];
        }
      }
    }

    return [...base, ...base];
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-300 to-gray-500">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Reviews
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90">
            <span className="inline-flex h-7 w-7 items-center justify-center">
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
            </span>
            <span>(5,0/5) Google</span>
            <div className="flex text-orange-400 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="ml-2 text-white/80">30 Google reviews</span>
          </div>
        </motion.div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6 pb-4 w-full"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 40,
              ease: 'linear',
              repeat: Infinity
            }}
          >
            {loopedReviews.map((review, index) => (
              <motion.div
                key={`${review.name}-${index}`}
                data-review-card
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="min-w-[260px] sm:min-w-[320px] md:min-w-[340px] lg:min-w-[360px] bg-white px-6 py-5 rounded-3xl shadow-md flex flex-col snap-center"
              >
                <div className="mb-2">
                  <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {review.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          className={i < review.rating ? 'text-secondary' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="inline-flex h-5 w-5 items-center justify-center">
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
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
