import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

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
                <span className="text-primary font-black text-xl">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight">De Expert</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Rijschool De Expert is al meer dan 15 jaar dé specialist in rijopleidingen. 
              Wij helpen je snel, veilig en met plezier aan je rijbewijs.
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
              <li><a href="#" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-secondary transition-colors">Rijlessen</a></li>
              <li><a href="#pricing" className="hover:text-secondary transition-colors">Tarieven</a></li>
              <li><a href="#regions" className="hover:text-secondary transition-colors">Regio's</a></li>
              <li><a href="#faq" className="hover:text-secondary transition-colors">Veelgestelde vragen</a></li>
              <li><a href="#contact" className="hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Contact</h4>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-secondary mt-0.5" />
                <span>Hoofdstraat 123, 1011 AB Amsterdam</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary" />
                <span>085 - 123 45 67</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary" />
                <span>info@rijschoolexpert.nl</span>
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
          <p>© {currentYear} Rijschool De Expert. Alle rechten voorbehouden.</p>
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
