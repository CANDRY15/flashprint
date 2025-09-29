import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, BookOpen, QrCode, Palette, Clock, Shield } from "lucide-react";
import servicesImage from "@/assets/services-printing.jpg";

const ServicesSection = () => {
  const services = [
    {
      icon: Printer,
      title: "Impression & Photocopie",
      description: "Impression haute qualité en noir/blanc et couleur, recto/verso disponible",
      features: ["Noir & Blanc: 50 FC", "Couleur: 200 FC", "A4, A3 disponibles", "Qualité HD"],
      popular: false,
    },
    {
      icon: BookOpen,
      title: "Reliure & Livrets",
      description: "Reliure professionnelle pour vos documents importants et mémoires",
      features: ["Reliure spirale: 500 FC", "Reliure thermique: 800 FC", "Couverture plastique", "Finition soignée"],
      popular: true,
    },
    {
      icon: QrCode,
      title: "QR Code + Numérique",
      description: "Intégration QR code pour accès numérique instantané à vos documents",
      features: ["QR code unique", "Accès cloud 24/7", "Téléchargement PDF", "Partage facile"],
      popular: false,
    },
  ];

  const advantages = [
    { icon: Clock, title: "Service Rapide", description: "Impression en moins de 30 minutes" },
    { icon: Shield, title: "Qualité Garantie", description: "Matériel professionnel de dernière génération" },
    { icon: Palette, title: "Impression Couleur", description: "Qualité photo pour vos présentations" },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Nos Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            Solutions d'impression <span className="bg-gradient-brand bg-clip-text text-transparent">modernes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des services complets adaptés aux besoins des étudiants, avec la technologie au service de votre réussite.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className={`relative overflow-hidden transition-smooth hover:shadow-brand ${service.popular ? 'ring-2 ring-primary shadow-brand' : ''}`}>
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-brand text-white px-3 py-1 text-sm font-semibold">
                    Populaire
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-subtle flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-poppins">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-gradient-brand mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={service.popular ? "default" : "outline"} 
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={`https://wa.me/2430815050397?text=Bonjour, je souhaite en savoir plus sur ${service.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Commander
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Visual Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold font-poppins mb-6">
              Pourquoi choisir <span className="bg-gradient-brand bg-clip-text text-transparent">FlashPrint</span> ?
            </h3>
            <div className="space-y-6">
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{advantage.title}</h4>
                      <p className="text-muted-foreground">{advantage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button size="lg" className="mt-8 shadow-brand" asChild>
              <a 
                href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaiterais un devis pour mes impressions."
                target="_blank"
                rel="noopener noreferrer"
              >
                Demander un devis
              </a>
            </Button>
          </div>
          <div className="relative">
            <img 
              src={servicesImage} 
              alt="Services d'impression FlashPrint"
              className="rounded-2xl shadow-brand w-full h-auto"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;