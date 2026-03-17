import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-black text-xl">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Rijschool Dynamiek</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Dynamisch in stappen leren rijden. Transparante tarieven, gratis proefles bij pakket, 
              en betalen per maand of per rijles mogelijk.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Snel naar</h4>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/rijlessen" className="hover:text-secondary transition-colors">Rijlessen</Link></li>
              <li><Link to="/#werkwijze" className="hover:text-secondary transition-colors">Werkwijze</Link></li>
              <li><Link to="/#pricing" className="hover:text-secondary transition-colors">Tarieven</Link></li>
              <li><Link to="/#regions" className="hover:text-secondary transition-colors">Regio's</Link></li>
              <li><Link to="/veel-gestelde-vragen" className="hover:text-secondary transition-colors">Veel gestelde vragen</Link></li>
              <li><Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
              <li><Link to="/#contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Contact</h4>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary" />
                <a href="tel:0648592704" className="hover:text-white transition-colors">06 - 4859 2704</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary" />
                <a href="mailto:info@rijschooldynamiek.nl" className="hover:text-white transition-colors">info@rijschooldynamiek.nl</a>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-blue-200">KVK: 96330139</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Openingstijden</h4>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li className="flex justify-between">
                <span>Maandag - Vrijdag:</span>
                <span className="font-bold">08:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span>Zaterdag:</span>
                <span className="font-bold">09:00 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Zondag:</span>
                <span className="font-bold">Gesloten</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-blue-200 italic">
                Lessen zijn mogelijk buiten kantooruren in overleg met je instructeur.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
          <p>© {currentYear} Rijschool Dynamiek. Alle rechten voorbehouden.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacybeleid</a>
            <a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <p>Ontwikkeld door Julez Roelen</p>
        </div>
      </div>
    </footer>
  );
}
