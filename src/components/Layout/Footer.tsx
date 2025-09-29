import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Facebook,
  Instagram,
  Zap
} from "lucide-react";
import flashprintLogo from "@/assets/flashprint-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Services", href: "#services" },
    { label: "Bibliothèque", href: "#bibliotheque" },
    { label: "À propos", href: "#apropos" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    "Impression N&B",
    "Impression Couleur", 
    "Reliure Spirale",
    "Reliure Thermique",
    "QR Code Digital",
    "Bibliothèque PDF"
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={flashprintLogo} 
                alt="FlashPrint" 
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold font-poppins">FlashPrint</h3>
                <p className="text-sm text-gray-400">Lubumbashi</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La solution d'impression moderne pour les étudiants. 
              Impression rapide, qualité professionnelle et accès numérique via QR Code.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-white/10" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-white/10" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-white/10" asChild>
                <a href="https://wa.me/243000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-smooth flex items-center space-x-2"
                  >
                    <Zap className="h-3 w-3 text-accent" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-6">Nos Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-brand flex-shrink-0"></div>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Avenue Kassongo</p>
                  <p className="text-gray-300 text-sm">Quartier Kenya, Lubumbashi</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+243000000000" className="text-gray-300 hover:text-white transition-smooth text-sm">
                  +243 000 000 000
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:contact@flashprint.cd" className="text-gray-300 hover:text-white transition-smooth text-sm">
                  contact@flashprint.cd
                </a>
              </div>
              
              <Button 
                variant="hero" 
                size="sm" 
                className="mt-4"
                asChild
              >
                <a 
                  href="https://wa.me/243000000000?text=Bonjour FlashPrint, je souhaite en savoir plus sur vos services."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} FlashPrint. Tous droits réservés.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-smooth">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-smooth">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;