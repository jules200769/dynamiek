const PHONE = '31648592704';

/** Officieel WhatsApp-logo: tekstballon omlijnd (stroke), telefoon gevuld wit */
export function WhatsAppIcon({ size = 28 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
      {/* Tekstballon – alleen omlijning (zoals officieel logo) */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.87L1 22l5.39-.71A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
      />
      {/* Telefoon – gevuld wit (niet omlijnd) */}
      <path
        fill="currentColor"
        stroke="none"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        transform="translate(6, 6) scale(0.5)"
      />
    </svg>
  );
}

export default function FloatingActions() {
  return (
    <div className="fixed bottom-12 right-6 z-40">
      <a
        href={`https://wa.me/${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform whatsapp-pulse-glow"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
