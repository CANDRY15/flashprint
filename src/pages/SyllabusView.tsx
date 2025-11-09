import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, BookOpen, Calendar, User, ArrowLeft, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AdSense from "@/components/AdSense";

interface SyllabusData {
  id: string;
  title: string;
  professor: string;
  year: string;
  file_url: string | null;
  file_size: string | null;
  qr_code: string;
  created_at: string;
  popular: boolean;
  faculties: {
    name: string;
  } | null;
}

const SyllabusView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [syllabus, setSyllabus] = useState<SyllabusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!id) {
        toast({
          title: "Erreur",
          description: "ID du syllabus manquant",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from('syllabus')
        .select('*, faculties(name)')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Syllabus introuvable",
          description: "Ce syllabus n'existe pas ou a été supprimé.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setSyllabus(data as SyllabusData);
      setIsLoading(false);
    };

    fetchSyllabus();
  }, [id, navigate, toast]);

  const handleDownload = async () => {
    if (!syllabus?.file_url) {
      toast({
        title: "Fichier non disponible",
        description: "Le fichier n'est pas encore disponible pour ce syllabus.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract file extension from URL
      const url = new URL(syllabus.file_url);
      const pathParts = url.pathname.split('.');
      const extension = pathParts.length > 1 ? pathParts[pathParts.length - 1] : '';
      
      // Fetch the file
      const response = await fetch(syllabus.file_url);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = extension ? `${syllabus.title}.${extension}` : `${syllabus.title}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "Téléchargement lancé",
        description: "Le fichier est en cours de téléchargement.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Helper function to check if file is PDF
  const isPdfFile = (fileUrl: string | null) => {
    if (!fileUrl) return false;
    const url = fileUrl.toLowerCase();
    return url.endsWith('.pdf') || url.includes('.pdf?');
  };

  // Helper function to get file type label
  const getFileTypeLabel = (fileUrl: string | null) => {
    if (!fileUrl) return "Document";
    const url = fileUrl.toLowerCase();
    if (url.endsWith('.pdf') || url.includes('.pdf?')) return "PDF";
    if (url.endsWith('.pptx') || url.includes('.pptx?')) return "PowerPoint";
    if (url.endsWith('.ppt') || url.includes('.ppt?')) return "PowerPoint";
    if (url.endsWith('.docx') || url.includes('.docx?')) return "Word";
    if (url.endsWith('.doc') || url.includes('.doc?')) return "Word";
    if (url.endsWith('.xlsx') || url.includes('.xlsx?')) return "Excel";
    if (url.endsWith('.xls') || url.includes('.xls?')) return "Excel";
    if (url.endsWith('.txt') || url.includes('.txt?')) return "Texte";
    return "Document";
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!syllabus) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la bibliothèque
          </Button>

          <Card className="shadow-brand">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl md:text-4xl font-bold font-poppins mb-2">
                    {syllabus.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {syllabus.faculties?.name || "Faculté non spécifiée"}
                  </CardDescription>
                </div>
                {syllabus.popular && (
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    Populaire
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Information Section */}
              <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Professeur</p>
                    <p className="font-semibold">{syllabus.professor}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Année</p>
                    <p className="font-semibold">{syllabus.year}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taille</p>
                    <p className="font-semibold">{syllabus.file_size || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* AdSense - Top Banner */}
              <div className="my-6">
                <AdSense slot="3456789012" format="horizontal" />
              </div>

              {/* Document Preview or Info */}
              {syllabus.file_url && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Aperçu du document</h3>
                  {isPdfFile(syllabus.file_url) ? (
                    <div className="w-full border rounded-lg overflow-hidden bg-muted/30">
                      <iframe
                        src={`${syllabus.file_url}#page=1&view=FitH`}
                        className="w-full h-[600px]"
                        title="Aperçu du document"
                      />
                    </div>
                  ) : (
                    <div className="w-full border rounded-lg p-8 bg-muted/30 text-center space-y-4">
                      <div className="flex-shrink-0 w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold mb-2">
                          Fichier {getFileTypeLabel(syllabus.file_url)} disponible
                        </p>
                        <p className="text-muted-foreground text-sm">
                          L'aperçu n'est pas disponible pour ce type de fichier. 
                          Téléchargez le fichier pour le consulter.
                        </p>
                      </div>
                      <Button onClick={handleDownload} size="lg">
                        <Download className="h-5 w-5 mr-2" />
                        Télécharger maintenant
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">À propos de ce syllabus</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ce syllabus a été scanné et mis en ligne sur FlashPrint pour vous permettre d'y accéder
                  à tout moment, même si vous perdez votre version papier. Vous pouvez le télécharger
                  gratuitement et le consulter sur tous vos appareils.
                </p>
              </div>

              {/* AdSense - Mid Content Rectangle */}
              <div className="my-6">
                <AdSense slot="4567890123" format="rectangle" />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleDownload}
                  disabled={!syllabus.file_url}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Télécharger le fichier
                </Button>

                {syllabus.file_url && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(syllabus.file_url!, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Voir
                  </Button>
                )}
              </div>


              {/* Call to Action */}
              <div className="mt-8 p-6 bg-muted/30 rounded-lg text-center space-y-3">
                <h4 className="font-semibold text-lg">Besoin d'une version imprimée ?</h4>
                <p className="text-muted-foreground text-sm">
                  Rendez-vous chez FlashPrint pour obtenir une impression professionnelle avec QR code intégré.
                </p>
                <Button variant="outline" asChild>
                  <a
                    href="https://wa.me/2430815050397?text=Bonjour FlashPrint, je souhaite imprimer un syllabus."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contacter FlashPrint
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SyllabusView;
