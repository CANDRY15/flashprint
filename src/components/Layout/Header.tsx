import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import flashprintLogo from "@/assets/flashprint-logo.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "Services", href: "#services" },
    { label: "Bibliothèque", href: "#bibliotheque" },
    { label: "À propos", href: "#apropos" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={flashprintLogo} 
              alt="FlashPrint" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-poppins">FlashPrint</h1>
              <p className="text-xs text-muted-foreground">Imprimez malin, accédez partout</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-smooth font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+2430815050397" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Appeler</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite en savoir plus sur vos services d'impression."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <span>WhatsApp</span>
              </a>
            </Button>
            {user ? (
              isAdmin ? (
                <Button onClick={() => navigate('/admin')} variant="default" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Compte
                </Button>
              )
            ) : (
              <Button onClick={() => navigate('/auth')} variant="default" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-4 p-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-foreground hover:text-primary transition-smooth font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+2430815050397" className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Appeler</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite en savoir plus sur vos services d'impression."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>WhatsApp</span>
                  </a>
                </Button>
                {user ? (
                  isAdmin ? (
                    <Button onClick={() => { navigate('/admin'); setIsMenuOpen(false); }} variant="default" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  ) : (
                    <Button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Compte
                    </Button>
                  )
                ) : (
                  <Button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} variant="default" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;