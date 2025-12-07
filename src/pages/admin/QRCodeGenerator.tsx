import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Download, ArrowLeft } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface Faculty {
  id: string;
  name: string;
  slug: string;
}

const syllabusSchema = z.object({
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caractères").max(200),
  professor: z.string().trim().min(2, "Le nom du professeur doit contenir au moins 2 caractères").max(100),
  year: z.enum(["Bac1", "Bac2", "Bac3", "Master1", "Master2", "Master3", "Master4"], { errorMap: () => ({ message: "Année invalide" }) }),
  facultyId: z.string().uuid("Veuillez sélectionner une faculté valide"),
  description: z.string().trim().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
  companyName: z.string().trim().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_FILE_TYPES = ['application/pdf'];

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [professor, setProfessor] = useState("");
  const [year, setYear] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("FlashPrint");
  const [website, setWebsite] = useState("");
  const [popular, setPopular] = useState(false);
  
  // QR Code customization
  const [primaryColor, setPrimaryColor] = useState("#6594FF");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  
  // Preview URL
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    const { data } = await supabase
      .from('faculties')
      .select('*')
      .order('name');
    
    if (data) setFaculties(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast({
        title: "Type de fichier invalide",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 20 MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Fichier manquant",
        description: "Veuillez uploader un fichier PDF",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form data
      const validationResult = syllabusSchema.safeParse({
        title,
        professor,
        year,
        facultyId,
        description,
        companyName,
        website: website || undefined,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation échouée",
          description: firstError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload file
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('syllabus')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('syllabus')
        .getPublicUrl(fileName);

      const fileSize = `${(file.size / 1024 / 1024).toFixed(1)} MB`;

      // Insert syllabus
      const { data: insertedData, error: insertError } = await supabase
        .from('syllabus')
        .insert({
          title: validationResult.data.title,
          professor: validationResult.data.professor,
          year: validationResult.data.year,
          faculty_id: validationResult.data.facultyId,
          file_url: publicUrl,
          file_size: fileSize,
          qr_code: 'temporary',
          popular,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate slug using the database function
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_slug', { title: validationResult.data.title });

      if (slugError) throw slugError;

      // Generate QR code URL pointing to the PDF view page (hides Supabase URL)
      const baseUrl = window.location.origin;
      const qrCode = `${baseUrl}/pdf/${slugData || insertedData.id}`;
      
      // Update with slug and QR code
      const { error: updateError } = await supabase
        .from('syllabus')
        .update({ 
          slug: slugData,
          qr_code: qrCode 
        })
        .eq('id', insertedData.id);

      if (updateError) throw updateError;

      setQrCodeUrl(qrCode);

      // Log admin action
      await supabase.rpc('log_admin_action', {
        _action: 'create_syllabus',
        _details: { 
          title: validationResult.data.title,
          qr_code: qrCode 
        }
      });

      toast({
        title: "Succès",
        description: "QR Code généré avec succès",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadQrCode = () => {
    const svg = document.querySelector('#qr-preview svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 200;
      canvas.height = 200;
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qr-${title.replace(/\s+/g, '-')}.png`;
        link.href = url;
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const colorSchemes = [
    { primary: "#6594FF", secondary: "#FFFFFF" },
    { primary: "#000000", secondary: "#FFFFFF" },
    { primary: "#FFFFFF", secondary: "#6594FF" },
    { primary: "#6594FF", secondary: "#000000" },
    { primary: "#A78BFA", secondary: "#FFFFFF" },
    { primary: "#10B981", secondary: "#000000" },
    { primary: "#F59E0B", secondary: "#FFFFFF" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/syllabus')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-poppins mb-2">
                Générateur de QR Code
              </h1>
              <p className="text-muted-foreground">
                Créez un QR code personnalisé pour votre syllabus
              </p>
            </div>

            {/* PDF Upload */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <Label className="text-lg font-semibold">Fichier PDF *</Label>
                  </div>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      {file ? (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 mx-auto text-primary" />
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="font-medium">Uploader votre fichier PDF</p>
                          <p className="text-sm text-muted-foreground">
                            Taille maximale: 20 MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Customization */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Design et personnalisation</Label>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Choisir un schéma de couleurs</p>
                    <div className="grid grid-cols-4 gap-2">
                      {colorSchemes.map((scheme, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setPrimaryColor(scheme.primary);
                            setSecondaryColor(scheme.secondary);
                          }}
                          className="h-12 rounded-lg border-2 border-border hover:border-primary transition-colors flex overflow-hidden"
                        >
                          <div className="flex-1" style={{ backgroundColor: scheme.primary }} />
                          <div className="flex-1" style={{ backgroundColor: scheme.secondary }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Couleur primaire</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Couleur secondaire</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Informations sur le document</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Cours de Mathématiques"
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professor">Professeur *</Label>
                    <Input
                      id="professor"
                      value={professor}
                      onChange={(e) => setProfessor(e.target.value)}
                      placeholder="Ex: Dr. Dupont"
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Année *</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bac1">Bac1</SelectItem>
                          <SelectItem value="Bac2">Bac2</SelectItem>
                          <SelectItem value="Bac3">Bac3</SelectItem>
                          <SelectItem value="Master1">Master1</SelectItem>
                          <SelectItem value="Master2">Master2</SelectItem>
                          <SelectItem value="Master3">Master3</SelectItem>
                          <SelectItem value="Master4">Master4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculté *</Label>
                      <Select value={facultyId} onValueChange={setFacultyId}>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description du syllabus..."
                      maxLength={500}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Nom de l'entreprise</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="FlashPrint"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
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
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !file}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                "Générer le QR Code"
              )}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Aperçu</h3>
                    <p className="text-sm text-muted-foreground">
                      Votre QR code apparaîtra ici
                    </p>
                  </div>

                  {/* Phone Mockup */}
                  <div className="relative mx-auto" style={{ width: '280px' }}>
                    <div 
                      className="rounded-[2.5rem] p-4 shadow-2xl border-8 border-foreground"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                      }}
                    >
                      <div className="bg-background rounded-3xl p-6 space-y-4">
                        {companyName && (
                          <p className="text-sm text-muted-foreground text-center">
                            {companyName}
                          </p>
                        )}
                        
                        {title && (
                          <h4 className="font-bold text-lg text-center">
                            {title}
                          </h4>
                        )}

                        {description && (
                          <p className="text-xs text-muted-foreground text-center">
                            {description}
                          </p>
                        )}

                        {file && (
                          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                            <iframe
                              src={URL.createObjectURL(file)}
                              className="w-full h-full border-0"
                              title="Aperçu du PDF"
                            />
                          </div>
                        )}

                        <Button 
                          className="w-full"
                          style={{ 
                            backgroundColor: primaryColor,
                            color: secondaryColor 
                          }}
                        >
                          Voir le PDF
                        </Button>

                        {website && (
                          <p className="text-xs text-center text-muted-foreground">
                            {website}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {qrCodeUrl && (
                    <div className="space-y-4">
                      <div 
                        id="qr-preview" 
                        className="p-6 rounded-lg flex justify-center"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        <QRCodeSVG
                          value={qrCodeUrl}
                          size={200}
                          level="H"
                          includeMargin
                          fgColor={primaryColor}
                          bgColor={secondaryColor}
                        />
                      </div>

                      <Button
                        onClick={downloadQrCode}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Télécharger le QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
