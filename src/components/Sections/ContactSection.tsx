import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Instagram,
  Facebook
} from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long (max 100 caractères)"),
  email: z.string()
    .email("Email invalide")
    .max(255, "L'email est trop long")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .regex(/^\+?[0-9\s-]{8,20}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message est trop long (max 2000 caractères)"),
});

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+243 815 050 397"],
      action: "Appeler maintenant",
      href: "tel:+2430815050397"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Business",
      details: ["Réponse rapide", "Service 24/7"],
      action: "Ouvrir WhatsApp",
      href: "https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite en savoir plus sur vos services."
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@flashprint.cd"],
      action: "Envoyer un email",
      href: "mailto:contact@flashprint.cd"
    },
    {
      icon: MapPin,
      title: "Localisation",
      details: ["Lubumbashi, Kasapa", "Campus, H4C320"],
      action: "Voir sur Maps",
      href: "#"
    },
  ];

  const schedule = [
    { day: "Lundi - Vendredi", hours: "7h00 - 18h00" },
    { day: "Samedi", hours: "8h00 - 16h00" },
    { day: "Dimanche", hours: "9h00 - 14h00" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Erreur de validation",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // Créer le message WhatsApp avec données validées
    const whatsappMessage = `Bonjour FlashPrint,

Nom: ${validation.data.name}
${validation.data.email ? `Email: ${validation.data.email}` : ''}
${validation.data.phone ? `Téléphone: ${validation.data.phone}` : ''}

Message: ${validation.data.message}`;

    // Rediriger vers WhatsApp
    window.open(`https://wa.me/2430815050397?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
    
    toast({
      title: "Message envoyé !",
      description: "Vous allez être redirigé vers WhatsApp pour finaliser l'envoi.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Contact
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            Parlons de votre <span className="bg-gradient-brand bg-clip-text text-transparent">projet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question ? Besoin d'un devis ? Notre équipe est là pour vous accompagner dans tous vos projets d'impression.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-2xl font-poppins">Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+243 000 000 000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre projet ou votre demande..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="transition-smooth hover:shadow-subtle">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-subtle flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                          ))}
                          <Button variant="outline" size="sm" className="mt-3" asChild>
                            <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined}>
                              {info.action}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Horaires d'ouverture</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="font-medium">{item.day}</span>
                      <span className="text-muted-foreground">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Suivez-nous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://wa.me/2430815050397" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;