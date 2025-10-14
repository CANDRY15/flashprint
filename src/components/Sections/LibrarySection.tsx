import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, QrCode, Search, Beaker, Eye } from "lucide-react";
import libraryImage from "@/assets/digital-library.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Syllabus {
  id: string;
  title: string;
  professor: string;
  year: string;
  file_size: string | null;
  qr_code: string;
  popular: boolean;
  file_url: string | null;
}

const LibrarySection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineSyllabi, setMedicineSyllabi] = useState<Syllabus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const promotions = [
    { id: "Bac1", name: "Bac1" },
    { id: "Bac2", name: "Bac2" },
    { id: "Bac3", name: "Bac3" },
    { id: "Master1", name: "Master1" },
    { id: "Master2", name: "Master2" },
    { id: "Master3", name: "Master3" },
    { id: "Master4", name: "Master4" },
  ];

  useEffect(() => {
    fetchMedicineSyllabi();
  }, []);

  const fetchMedicineSyllabi = async () => {
    setIsLoading(true);
    try {
      // First get the Medicine faculty ID
      const { data: faculty } = await supabase
        .from('faculties')
        .select('id')
        .eq('slug', 'medecine')
        .single();

      if (faculty) {
        // Fetch all syllabi for Medicine faculty
        const { data, error } = await supabase
          .from('syllabus')
          .select('*')
          .eq('faculty_id', faculty.id)
          .order('year', { ascending: true })
          .order('title', { ascending: true });

        if (error) throw error;
        setMedicineSyllabi(data || []);
      }
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSyllabiByPromotion = (promotion: string) => {
    return medicineSyllabi.filter(
      (item) =>
        item.year === promotion &&
        (searchTerm === "" ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.professor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleDownloadPDF = (fileUrl: string | null, title: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
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

        {/* Medicine Faculty Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20">
            <Beaker className="h-5 w-5 text-green-700 dark:text-green-400" />
            <h3 className="font-semibold text-green-700 dark:text-green-400">Faculté de Médecine</h3>
          </div>
        </div>

        {/* Promotion Tabs */}
        <Tabs defaultValue="Bac1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-8">
            {promotions.map((promotion) => (
              <TabsTrigger key={promotion.id} value={promotion.id}>
                {promotion.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {promotions.map((promotion) => (
            <TabsContent key={promotion.id} value={promotion.id}>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getSyllabiByPromotion(promotion.id).length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">Aucun syllabus disponible pour cette promotion</p>
                    </div>
                  ) : (
                    getSyllabiByPromotion(promotion.id).map((item) => (
                      <Card key={item.id} className="transition-smooth hover:shadow-brand">
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
                              {item.file_size || 'N/A'}
                            </span>
                            <span className="flex items-center">
                              <QrCode className="h-4 w-4 mr-1" />
                              Code disponible
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => navigate(`/syllabus/${item.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(item.file_url, item.title)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => navigate(`/syllabus/${item.id}`)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
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
