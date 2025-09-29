import { Button } from "@/components/ui/button";
import { ArrowRight, Download, QrCode, Zap } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Étudiants utilisant les services FlashPrint"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-20 h-20 rounded-full bg-gradient-brand opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 rounded-full bg-gradient-accent opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-flashprint-yellow opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="h-8 w-8 text-accent animate-pulse" />
            <span className="text-accent font-semibold tracking-wide">FLASHPRINT LUBUMBASHI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6 text-white leading-tight">
            Imprimez <span className="bg-gradient-brand bg-clip-text text-transparent">malin</span>,<br />
            accédez <span className="bg-gradient-accent bg-clip-text text-transparent">partout</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            La solution d'impression moderne pour les étudiants de Lubumbashi. 
            Impression rapide, reliure professionnelle et accès numérique à vos syllabus via QR Code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="shadow-glow animate-glow text-lg px-8 py-6" asChild>
              <a 
                href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite commander des services d'impression."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <span>Commander maintenant</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
              <QrCode className="h-5 w-5 mr-2" />
              Découvrir la bibliothèque
            </Button>
          </div>

          {/* Features highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Accès numérique</h3>
                <p className="text-sm text-gray-300">QR codes pour vos syllabus</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Impression rapide</h3>
                <p className="text-sm text-gray-300">Service express disponible</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-flashprint-orange to-flashprint-yellow flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Reliure pro</h3>
                <p className="text-sm text-gray-300">Finition professionnelle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;