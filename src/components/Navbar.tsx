import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, CheckCircle2, Clock } from 'lucide-react';
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
    { name: 'Home', href: '/' },
    { name: 'Rijlessen', href: '/rijlessen' },
    { name: 'Werkwijze', href: '/#werkwijze' },
    { name: 'Tarieven', href: '/#pricing' },
    { name: 'Regio', href: '/#regions' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="fixed w-full z-50 px-4 pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Main Navbar */}
        <nav 
          className={`bg-white border border-gray-100 shadow-lg shadow-gray-900/5 transition-all duration-500 ease-in-out overflow-hidden ${
            scrolled ? 'py-1.5 rounded-2xl mt-0' : isOpen ? 'py-3.5 rounded-t-2xl' : 'py-3.5 rounded-2xl'
          }`}
          style={{ 
            borderRadius: scrolled ? '1rem' : isOpen ? '1rem 1rem 0 0' : '1rem',
          }}
        >
          <div
            className="px-6 w-full flex flex-col items-stretch"
            style={{ minHeight: scrolled ? 48 : 60 }}
          >
            <div className="flex justify-between items-center">
            {/* Logo Area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-black text-xl">D</span>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-lg font-black tracking-tighter leading-none text-gray-900">
                    DYNAMIEK
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.1em] uppercase leading-none mt-1 text-gray-500">
                    Dynamisch in stappen leren rijden
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-[13px] font-bold uppercase tracking-widest transition-all duration-300 relative group text-gray-600 hover:text-primary"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-primary"></span>
                  </Link>
                ))}
              </div>
              
              <div className="h-8 w-px mx-2 bg-gray-200"></div>

              <Link 
                to="/#contact" 
                className="bg-secondary hover:bg-secondary-dark text-white py-3 px-7 rounded-xl font-extrabold text-[13px] uppercase tracking-widest transition-all duration-300 shadow-lg shadow-secondary/30 flex items-center"
              >
                Gratis Proefles
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <Link 
                to="/#contact" 
                className="bg-secondary text-white py-2.5 px-5 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md"
              >
                Proefles
              </Link>
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
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 px-4">
                  <Link
                    to="/#contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full btn-primary py-4 text-sm tracking-[0.2em]"
                  >
                    GRATIS PROEFLES AANVRAGEN
                  </Link>
                </div>
                <div className="pt-8 flex flex-col items-center space-y-4 text-gray-500">
                  <div className="flex items-center space-x-2 font-bold text-primary">
                    <Phone size={18} />
                    <span>06 - 4859 2704</span>
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
