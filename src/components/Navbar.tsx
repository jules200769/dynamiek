import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Mail, Phone, Instagram } from 'lucide-react';
import { WhatsAppIcon } from './FloatingActions';
import LogoDynamiek from '@/src/assets/logo-dynamiek.png';

const EMAIL = 'info@rijschooldynamiek.nl';
const PHONE = '06 - 4859 2704';
const PHONE_LINK = '+31648592704';
const WHATSAPP_LINK = 'https://wa.me/31648592704';
const INSTAGRAM_LINK = 'https://www.instagram.com/rijschooldynamiek/';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Tarieven', to: '/rijlessen' },
  { label: 'Veel gestelde vragen', to: '/veel-gestelde-vragen' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const location = useLocation();
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024; // Tailwind lg breakpoint
    const delta = 6; // ignore tiny scroll jitter

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        if (!isMobile() || hideBar || menuOpen || contactModalOpen) {
          setHiddenByScroll(false);
          lastScrollYRef.current = window.scrollY;
          return;
        }

        const y = window.scrollY;
        const last = lastScrollYRef.current;

        // Always show near the top
        if (y <= 12) setHiddenByScroll(false);
        else if (y > last + delta) setHiddenByScroll(true); // scroll down -> hide
        else if (y < last - delta) setHiddenByScroll(false); // scroll up -> show

        lastScrollYRef.current = y;
      });
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ open?: boolean }>;
      setHideBar(Boolean(ev.detail?.open));
    };
    window.addEventListener('trialForm:toggle', handler as EventListener);
    return () => window.removeEventListener('trialForm:toggle', handler as EventListener);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transform-gpu will-change-transform transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        hideBar ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        hiddenByScroll ? '-translate-y-[110%] pointer-events-none lg:translate-y-0 lg:pointer-events-auto' : 'translate-y-0'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/40 bg-white/95 px-4 py-3 backdrop-blur transition-all duration-300 md:px-6 ${
          scrolled ? 'shadow-xl shadow-slate-900/10' : 'shadow-md shadow-slate-900/5'
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img src={LogoDynamiek} alt="Rijschool Dynamiek" className="h-11 w-auto" />
          <div className="leading-none">
            <p className="text-base font-black tracking-tight text-gray-900">Rijschool Dynamiek</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Dynamisch leren rijden
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex ml-auto">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.label} className="flex items-center gap-3">
                {link.to === '/' && (
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
                    title="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                <Link
                  to={link.to}
                  className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
          >
            Contact
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center rounded-xl border border-gray-200 p-2.5 text-gray-800 lg:hidden"
          aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-slate-900/10 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="flex items-center justify-between rounded-lg hover:bg-gray-50">
                {link.to === '/' && (
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="ml-2 inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:text-primary"
                    title="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                <Link
                  to={link.to}
                  className="flex-1 px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => { setContactModalOpen(true); setMenuOpen(false); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Contact
            </button>
          </div>
        </div>
      )}

      <ContactModal open={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </header>
  );
}

const contactOptions = [
  {
    href: `mailto:${EMAIL}`,
    icon: <Mail size={22} />,
    label: 'E-mail',
    detail: EMAIL,
    iconBg: 'bg-primary/10 text-primary',
    borderColor: 'border-gray-200 hover:border-primary/30',
    hoverBg: 'hover:bg-primary/5',
  },
  {
    href: `tel:${PHONE_LINK}`,
    icon: <Phone size={22} />,
    label: 'Bellen',
    detail: PHONE,
    iconBg: 'bg-primary/10 text-primary',
    borderColor: 'border-gray-200 hover:border-primary/30',
    hoverBg: 'hover:bg-primary/5',
  },
  {
    href: WHATSAPP_LINK,
    icon: <WhatsAppIcon size={22} />,
    label: 'WhatsApp',
    detail: 'Stuur een bericht',
    iconBg: 'bg-[#25D366] text-white shadow-sm shadow-[#25D366]/30',
    borderColor: 'border-[#25D366]/30 hover:border-[#25D366]',
    hoverBg: 'hover:bg-[#25D366]/10',
    external: true,
  },
  {
    href: INSTAGRAM_LINK,
    icon: <Instagram size={22} />,
    label: 'Instagram',
    detail: '@rijschooldynamiek',
    iconBg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm shadow-[#DD2A7B]/30',
    borderColor: 'border-[#DD2A7B]/20 hover:border-[#DD2A7B]/50',
    hoverBg: 'hover:bg-[#DD2A7B]/5',
    external: true,
  },
];

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 id="contact-modal-title" className="text-lg font-bold text-gray-900">
                Neem contact op
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-1 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Sluiten"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {contactOptions.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  {...(opt.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors ${opt.borderColor} ${opt.hoverBg}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${opt.iconBg}`}>
                    {opt.icon}
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500 truncate">{opt.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
