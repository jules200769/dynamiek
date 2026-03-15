import { useState, useEffect } from 'react';
import { Menu, X, Phone, Star, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Rijlessen', href: '#services' },
    { name: 'Tarieven', href: '#pricing' },
    { name: 'Regio', href: '#regions' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed w-full z-50 px-4 pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Top Trust Bar - aligned with island */}
        <div className={`bg-primary-dark text-white/90 py-2 transition-all duration-500 ease-in-out overflow-hidden rounded-2xl ${scrolled ? 'max-h-0 opacity-0 mb-0' : 'max-h-14 opacity-100 mb-2'}`}>
          <div className="px-6 flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-secondary" />
                <span>CBR-erkend</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Clock size={14} className="text-secondary" />
                <span>10+ jaar ervaring</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Google logo for reviews */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <span>4.9/5 Rating</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={14} className="text-secondary" />
              <a href="tel:0851234567" className="hover:text-secondary transition-colors">085 - 123 45 67</a>
            </div>
          </div>
        </div>

        {/* Main Navbar Island */}
        <nav 
          className={`transition-all duration-500 ease-in-out border ${
            scrolled 
              ? 'bg-white/90 backdrop-blur-xl shadow-2xl py-2 border-gray-100 rounded-2xl mt-2' 
              : isOpen 
                ? 'bg-white py-5 border-transparent shadow-lg rounded-t-2xl'
                : 'bg-white/10 backdrop-blur-xl py-5 border-white/20 rounded-2xl'
          }`}
          style={{ 
            borderRadius: scrolled ? '1rem' : isOpen ? '1rem 1rem 0 0' : '1rem'
          }}
        >
          <div className="px-6">
            <div className="flex justify-between items-center">
            {/* Logo Area */}
            <div className="flex items-center">
              <a href="#" className="flex items-center group">
                <motion.div 
                  animate={{ 
                    scale: scrolled ? 0.85 : 1,
                    rotate: scrolled ? 5 : 0
                  }}
                  className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500"
                >
                  <span className="text-white font-black text-2xl">E</span>
                </motion.div>
                <div className="ml-3 flex flex-col">
                  <span className={`text-xl font-black tracking-tighter leading-none transition-colors duration-300 ${scrolled || isOpen ? 'text-gray-900' : 'text-white'}`}>
                    DE EXPERT
                  </span>
                  <span className={`text-[9px] font-bold tracking-[0.1em] uppercase leading-none mt-1 transition-colors duration-300 ${scrolled || isOpen ? 'text-primary/70' : 'text-white/70'}`}>
                    CBR-erkende rijschool
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-7">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] font-bold uppercase tracking-widest transition-all duration-300 relative group ${scrolled || isOpen ? 'text-gray-600 hover:text-primary' : 'text-white/90 hover:text-white'}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${scrolled || isOpen ? 'bg-primary' : 'bg-white'}`}></span>
                  </a>
                ))}
              </div>
              
              <div className={`h-8 w-px mx-2 transition-colors duration-300 ${scrolled || isOpen ? 'bg-gray-100' : 'bg-white/20'}`}></div>

              <a 
                href="#contact" 
                className="bg-secondary hover:bg-secondary-dark text-white py-3.5 px-8 rounded-xl font-extrabold text-[13px] uppercase tracking-widest transition-all duration-300 shadow-lg shadow-secondary/30 transform hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center"
              >
                Gratis Proefles
                <motion.span 
                  animate={{ x: [0, 4, 0] }} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <a 
                href="#contact" 
                className="bg-secondary text-white py-2.5 px-5 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md"
              >
                Proefles
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-gray-900 bg-gray-50 border border-gray-100 transition-all duration-300"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden rounded-b-2xl shadow-2xl"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-6 px-4">
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full btn-primary py-4 text-sm tracking-[0.2em]"
                  >
                    GRATIS PROEFLES AANVRAGEN
                  </a>
                </div>
                <div className="pt-8 flex flex-col items-center space-y-4 text-gray-500">
                  <div className="flex items-center space-x-2 font-bold text-primary">
                    <Phone size={18} />
                    <span>085 - 123 45 67</span>
                  </div>
                  <div className="flex items-center space-x-4 text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center"><CheckCircle2 size={12} className="mr-1 text-secondary" /> CBR-ERKEND</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1 text-secondary" /> 10+ JAAR</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  </header>
  );
}
