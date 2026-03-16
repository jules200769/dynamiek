import { useMemo } from 'react';

const uspItems = [
  'Hoog slagingspercentage',
  'Moderne lesauto',
  'Persoonlijke aanpak',
  'Overdag, in de avond of weekend',
  'Vriendelijke & geduldige instructeur',
  'CBR erkende rijschool',
  'Eerlijke tarieven',
  'Flexibele lestijden',
];

export default function USPScroller() {
  const loopItems = useMemo(() => [...uspItems, ...uspItems], []);

  return (
    <section className="bg-[#0b2648] text-white py-3 border-y border-yellow-400 overflow-hidden">
      <div className="relative">
        <div className="flex whitespace-nowrap animate-[usp-marquee_35s_linear_infinite]">
          {loopItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="px-6 text-xs sm:text-sm md:text-base font-medium flex items-center gap-3"
            >
              <span>{item}</span>
              <span className="text-white/40">||</span>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
        @keyframes usp-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}
      </style>
    </section>
  );
}

