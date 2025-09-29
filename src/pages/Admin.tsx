import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from 'qrcode.react';

interface Faculty {
  id: string;
  name: string;
  slug: string;
}

interface Syllabus {
  id: string;
  title: string;
  professor: string;
  year: string;
  file_url: string | null;
  file_size: string | null;
  qr_code: string;
  popular: boolean;
  faculty_id: string;
  faculties: { name: string };
}

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [professor, setProfessor] = useState("");
  const [year, setYear] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [popular, setPopular] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchFaculties();
      fetchSyllabus();
    }
  }, [user, isAdmin]);

  const fetchFaculties = async () => {
    const { data, error } = await supabase
      .from('faculties')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les facultés",
        variant: "destructive",
      });
      return;
    }
    
    setFaculties(data || []);
  };

  const fetchSyllabus = async () => {
    const { data, error } = await supabase
      .from('syllabus')
      .select('*, faculties(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les syllabus",
        variant: "destructive",
      });
      return;
    }
    
    setSyllabusList(data || []);
  };

  const generateQrCode = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7).toUpperCase();
    return `FP-${random}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fileUrl = null;
      let fileSize = null;

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('syllabus')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('syllabus')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
        fileSize = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
      }

      const qrCode = generateQrCode();
      
      const { error } = await supabase
        .from('syllabus')
        .insert({
          title,
          professor,
          year,
          faculty_id: facultyId,
          file_url: fileUrl,
          file_size: fileSize,
          qr_code: qrCode,
          popular,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Syllabus ajouté avec succès",
      });

      // Reset form
      setTitle("");
      setProfessor("");
      setYear("");
      setFacultyId("");
      setPopular(false);
      setFile(null);
      setIsDialogOpen(false);
      
      fetchSyllabus();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce syllabus ?")) return;

    try {
      const { error } = await supabase
        .from('syllabus')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Syllabus supprimé",
      });

      fetchSyllabus();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShareQr = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
    setIsQrDialogOpen(true);
  };

  const downloadQr = () => {
    if (!selectedSyllabus) return;
    
    const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = `qr-${selectedSyllabus.qr_code}.png`;
      link.href = url;
      link.click();
    }
  };

  const shareViaWhatsApp = () => {
    if (!selectedSyllabus) return;
    
    const message = `Syllabus: ${selectedSyllabus.title}\nProfesseur: ${selectedSyllabus.professor}\nCode QR: ${selectedSyllabus.qr_code}\n\nScannez le QR code ou contactez FlashPrint pour obtenir ce syllabus.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins">Administration FlashPrint</h1>
            <p className="text-muted-foreground">Gestion des syllabus</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un syllabus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nouveau syllabus</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau syllabus à la bibliothèque
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professor">Professeur</Label>
                  <Input
                    id="professor"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Select value={year} onValueChange={setYear} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">L1</SelectItem>
                      <SelectItem value="L2">L2</SelectItem>
                      <SelectItem value="L3">L3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculté</Label>
                  <Select value={facultyId} onValueChange={setFacultyId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Fichier PDF (optionnel)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={popular}
                    onCheckedChange={(checked) => setPopular(checked as boolean)}
                  />
                  <Label htmlFor="popular">Marquer comme populaire</Label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {syllabusList.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.professor} • {item.year} • {item.faculties.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Code QR:</span> {item.qr_code}
                  </p>
                  {item.file_size && (
                    <p className="text-sm">
                      <span className="font-semibold">Taille:</span> {item.file_size}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareQr(item)}
                      className="flex-1"
                    >
                      Partager QR
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code - {selectedSyllabus?.title}</DialogTitle>
              <DialogDescription>
                Partagez ce QR code avec vos étudiants
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div id="qr-code-canvas" className="p-4 bg-white rounded-lg">
                {selectedSyllabus && (
                  <QRCodeSVG
                    value={`https://wa.me/2430815050397?text=${encodeURIComponent(`Bonjour FlashPrint, je souhaite télécharger le syllabus "${selectedSyllabus.title}" (Code: ${selectedSyllabus.qr_code})`)}`}
                    size={256}
                    level="H"
                    includeMargin
                  />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold">{selectedSyllabus?.qr_code}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedSyllabus?.professor} • {selectedSyllabus?.year}
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button onClick={downloadQr} variant="outline" className="flex-1">
                  Télécharger
                </Button>
                <Button onClick={shareViaWhatsApp} className="flex-1">
                  WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
