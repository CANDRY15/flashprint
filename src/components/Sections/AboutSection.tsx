import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, Heart, Award, MapPin } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "Révolutionner l'accès aux documents académiques en combinant impression traditionnelle et technologie numérique pour les étudiants de Lubumbashi."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pionnier de l'intégration QR Code dans l'impression académique en RDC, nous rendons l'éducation plus accessible et moderne."
    },
    {
      icon: Heart,
      title: "Engagement",
      description: "Créé par un étudiant, pour les étudiants. Nous comprenons vos défis et nous engageons à vous offrir les meilleures solutions."
    }
  ];

  const achievements = [
    { number: "500+", label: "Étudiants servis" },
    { number: "2000+", label: "Documents imprimés" },
    { number: "50+", label: "Syllabus numérisés" },
    { number: "99%", label: "Satisfaction client" },
  ];

  return (
    <section id="apropos" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            À Propos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            L'histoire de <span className="bg-gradient-brand bg-clip-text text-transparent">FlashPrint</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Né de la passion d'un étudiant pour l'innovation, FlashPrint transforme l'expérience éducative 
            en rendant l'information accessible partout et à tout moment.
          </p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-brand bg-white/50 backdrop-blur">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-poppins mb-4">Notre Histoire</h3>
                  <div className="prose prose-lg text-muted-foreground space-y-4">
                    <p>
                      Tout a commencé en 2023, quand notre fondateur, étudiant à l'Université de Lubumbashi, 
                      a réalisé les défis quotidiens auxquels font face ses camarades : accès limité aux syllabus, 
                      files d'attente interminables pour l'impression, et perte de documents importants.
                    </p>
                    <p>
                      L'idée révolutionnaire ? Intégrer la technologie QR Code aux services d'impression traditionnels. 
                      Ainsi est né FlashPrint : un service qui non seulement imprime vos documents avec une qualité 
                      exceptionnelle, mais vous donne aussi un accès numérique permanent à vos contenus.
                    </p>
                    <p>
                      Aujourd'hui, FlashPrint est devenu le partenaire de confiance de centaines d'étudiants 
                      à Lubumbashi, transformant leur façon d'accéder et de gérer leurs documents académiques.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-subtle bg-white/80 backdrop-blur transition-smooth hover:shadow-brand">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-poppins mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-brand p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold font-poppins mb-4">
              Nos <span className="bg-gradient-brand bg-clip-text text-transparent">Réalisations</span>
            </h3>
            <p className="text-muted-foreground">
              Des chiffres qui témoignent de notre engagement envers l'excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
                  {achievement.number}
                </div>
                <div className="text-muted-foreground font-medium">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team CTA */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Basé à Lubumbashi, RD Congo</span>
          </div>
          <h3 className="text-2xl font-bold font-poppins mb-4">
            Rejoignez la révolution éducative
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Découvrez comment FlashPrint peut transformer votre expérience d'apprentissage. 
            Contactez-nous pour en savoir plus sur nos services innovants.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a 
              href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite en savoir plus sur votre mission et vos services."
              target="_blank"
              rel="noopener noreferrer"
            >
              Nous Contacter
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;