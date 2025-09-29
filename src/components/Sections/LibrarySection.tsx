import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, QrCode, Search, GraduationCap, Calculator, Beaker, Scale } from "lucide-react";
import libraryImage from "@/assets/digital-library.jpg";

const LibrarySection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faculties = [
    { id: "ingenieurs", name: "Ingénieurs", icon: Calculator, color: "bg-blue-100 text-blue-800" },
    { id: "medecine", name: "Médecine", icon: Beaker, color: "bg-green-100 text-green-800" },
    { id: "droit", name: "Droit", icon: Scale, color: "bg-purple-100 text-purple-800" },
    { id: "sciences", name: "Sciences", icon: GraduationCap, color: "bg-orange-100 text-orange-800" },
  ];

  const syllabus = {
    ingenieurs: [
      { 
        title: "Mathématiques Appliquées I", 
        professor: "Prof. Mukendi", 
        year: "L1", 
        size: "2.4 MB",
        qrCode: "FP-ING-MA1-2024",
        popular: true 
      },
      { 
        title: "Programmation C++", 
        professor: "Prof. Kabongo", 
        year: "L2", 
        size: "3.1 MB",
        qrCode: "FP-ING-CPP-2024",
        popular: false 
      },
      { 
        title: "Résistance des Matériaux", 
        professor: "Prof. Mwamba", 
        year: "L3", 
        size: "4.2 MB",
        qrCode: "FP-ING-RDM-2024",
        popular: false 
      },
    ],
    medecine: [
      { 
        title: "Anatomie Générale", 
        professor: "Dr. Kasongo", 
        year: "L1", 
        size: "5.8 MB",
        qrCode: "FP-MED-ANAT-2024",
        popular: true 
      },
      { 
        title: "Physiologie Humaine", 
        professor: "Dr. Mulamba", 
        year: "L2", 
        size: "4.1 MB",
        qrCode: "FP-MED-PHYS-2024",
        popular: false 
      },
    ],
    droit: [
      { 
        title: "Droit Civil I", 
        professor: "Me. Tshiswaka", 
        year: "L1", 
        size: "2.9 MB",
        qrCode: "FP-DRT-CIV1-2024",
        popular: true 
      },
      { 
        title: "Droit Constitutionnel", 
        professor: "Me. Kazadi", 
        year: "L2", 
        size: "3.5 MB",
        qrCode: "FP-DRT-CONST-2024",
        popular: false 
      },
    ],
    sciences: [
      { 
        title: "Chimie Organique", 
        professor: "Prof. Mputu", 
        year: "L2", 
        size: "3.7 MB",
        qrCode: "FP-SCI-CHIM-2024",
        popular: false 
      },
      { 
        title: "Physique Quantique", 
        professor: "Prof. Nkulu", 
        year: "L3", 
        size: "4.8 MB",
        qrCode: "FP-SCI-PHYS-2024",
        popular: true 
      },
    ],
  };

  const handleDownload = (title: string, qrCode: string) => {
    // Simulation du téléchargement
    const whatsappMessage = `Bonjour FlashPrint, je souhaite télécharger le syllabus "${title}" (Code: ${qrCode})`;
    window.open(`https://wa.me/2430815050397?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <section id="bibliotheque" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Bibliothèque Numérique
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            Accédez à vos <span className="bg-gradient-brand bg-clip-text text-transparent">syllabus</span> partout
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Téléchargez vos cours en format PDF ou scannez le QR code sur vos documents imprimés pour un accès instantané.
          </p>
        </div>

        {/* Visual Introduction */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold font-poppins mb-6">
              Comment ça marche ?
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Imprimez avec QR Code</h4>
                  <p className="text-muted-foreground">Nous ajoutons un QR code unique sur chaque document imprimé</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Scannez le code</h4>
                  <p className="text-muted-foreground">Utilisez votre smartphone pour scanner le QR code</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-flashprint-orange to-flashprint-yellow text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Accédez instantanément</h4>
                  <p className="text-muted-foreground">Téléchargez ou consultez le document en ligne</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={libraryImage} 
              alt="Bibliothèque numérique FlashPrint"
              className="rounded-2xl shadow-brand w-full h-auto"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10"></div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un syllabus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Faculty Tabs */}
        <Tabs defaultValue="ingenieurs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {faculties.map((faculty) => {
              const Icon = faculty.icon;
              return (
                <TabsTrigger key={faculty.id} value={faculty.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{faculty.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {faculties.map((faculty) => (
            <TabsContent key={faculty.id} value={faculty.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {syllabus[faculty.id as keyof typeof syllabus]
                  .filter(item => 
                    searchTerm === "" || 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.professor.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <Card key={index} className="transition-smooth hover:shadow-brand">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-poppins line-clamp-2">{item.title}</CardTitle>
                            <CardDescription className="mt-1">{item.professor} • {item.year}</CardDescription>
                          </div>
                          {item.popular && (
                            <Badge variant="secondary" className="ml-2">Populaire</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {item.size}
                          </span>
                          <span className="flex items-center">
                            <QrCode className="h-4 w-4 mr-1" />
                            {item.qrCode}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownload(item.title, item.qrCode)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleDownload(item.title, item.qrCode)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Votre syllabus n'est pas disponible ?
          </p>
          <Button variant="outline" size="lg" asChild>
            <a 
              href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaiterais ajouter un syllabus à votre bibliothèque numérique."
              target="_blank"
              rel="noopener noreferrer"
            >
              Demander l'ajout
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LibrarySection;