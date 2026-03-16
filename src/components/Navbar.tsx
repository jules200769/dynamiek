import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from './FloatingActions';
import LogoDynamiek from '@/src/assets/logo-dynamiek.png';

const EMAIL = 'info@rijschooldynamiek.nl';
const PHONE = '06 - 4859 2704';
const PHONE_LINK = '+31648592704';
const WHATSAPP_LINK = 'https://wa.me/31648592704';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Tarievenn', to: '/rijlessen' },
  { label: 'Veel gestelde vragen', to: '/veel-gestelde-vragen' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-opacity duration-200 ${hideBar ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
          >
            Contacten
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
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => { setContactModalOpen(true); setMenuOpen(false); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Contacten
            </button>
            <Link
              to="/#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white"
            >
              Vraag proefles aan
            </Link>
          </div>
        </div>
      )}

      {/* Contact-modal: e-mail, bellen, WhatsApp */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setContactModalOpen(false)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="contact-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 id="contact-modal-title" className="text-lg font-bold text-gray-900">
                Contact
              </h2>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 text-gray-800 hover:bg-primary/5 hover:border-primary/20 transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail size={24} />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-gray-900">E-mail</p>
                  <p className="text-sm text-gray-600 truncate">{EMAIL}</p>
                </div>
              </a>
              <a
                href={`tel:${PHONE_LINK}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 text-gray-800 hover:bg-primary/5 hover:border-primary/20 transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone size={24} />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-gray-900">Bellen</p>
                  <p className="text-sm text-gray-600">{PHONE}</p>
                </div>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[#25D366]/40 p-4 text-gray-800 hover:bg-[#25D366]/15 hover:border-[#25D366] transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md shadow-[#25D366]/30">
                  <WhatsAppIcon size={24} />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Stuur een bericht</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
