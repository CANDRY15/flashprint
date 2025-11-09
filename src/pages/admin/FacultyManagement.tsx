import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { z } from "zod";

const facultySchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom est trop long (max 100 caractères)")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides"),
  slug: z.string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(100, "Le slug est trop long (max 100 caractères)")
    .regex(/^[a-z0-9-]+$/, "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"),
  icon: z.string()
    .max(50, "Le nom de l'icône est trop long")
    .optional()
    .or(z.literal("")),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Code couleur invalide (format: #RRGGBB)")
    .optional()
    .or(z.literal("")),
});

interface Faculty {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    fetchFaculties();
  }, []);

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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingFaculty) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input
      const validation = facultySchema.safeParse({
        name: name.trim(),
        slug: slug || generateSlug(name),
        icon: icon || "",
        color: color || "",
      });

      if (!validation.success) {
        toast({
          title: "Erreur de validation",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (editingFaculty) {
        const { error } = await supabase
          .from('faculties')
          .update({
            name: name.trim(),
            slug: slug || generateSlug(name),
            icon: icon || null,
            color: color || null,
          })
          .eq('id', editingFaculty.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Faculté mise à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('faculties')
          .insert({
            name: name.trim(),
            slug: slug || generateSlug(name),
            icon: icon || null,
            color: color || null,
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Faculté ajoutée avec succès",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchFaculties();
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

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setName(faculty.name);
    setSlug(faculty.slug);
    setIcon(faculty.icon || "");
    setColor(faculty.color || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, facultyName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la faculté "${facultyName}" ?`)) return;

    try {
      const { error } = await supabase
        .from('faculties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Faculté supprimée avec succès",
      });

      fetchFaculties();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setIcon("");
    setColor("");
    setEditingFaculty(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsDialogOpen(open);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-poppins">Gestion des Facultés</h1>
          <p className="text-muted-foreground">Gérez les facultés de votre institution</p>
        </div>
      </div>

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une faculté
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFaculty ? "Modifier la faculté" : "Nouvelle faculté"}
              </DialogTitle>
              <DialogDescription>
                {editingFaculty 
                  ? "Modifiez les informations de la faculté" 
                  : "Ajoutez une nouvelle faculté à votre système"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la faculté *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Faculté de Médecine"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="faculte-medecine"
                />
                <p className="text-xs text-muted-foreground">
                  Généré automatiquement à partir du nom
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icône (optionnel)</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Ex: graduation-cap"
                />
                <p className="text-xs text-muted-foreground">
                  Nom de l'icône Lucide React
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur (optionnel)</Label>
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingFaculty ? "Mise à jour..." : "Ajout en cours..."}
                  </>
                ) : (
                  editingFaculty ? "Mettre à jour" : "Ajouter"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <Card key={faculty.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {faculty.color && (
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: faculty.color }}
                  />
                )}
                {faculty.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Slug: {faculty.slug}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(faculty)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(faculty.id, faculty.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {faculties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Aucune faculté trouvée</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première faculté
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
