import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
  content_type: string;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContents, setEditedContents] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section')
      .order('key');
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contenus",
        variant: "destructive",
      });
      return;
    }
    
    setContents(data || []);
    setIsLoading(false);
  };

  const handleChange = (id: string, value: string) => {
    setEditedContents(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async (item: ContentItem) => {
    setIsSaving(true);
    const newValue = editedContents[item.id] !== undefined ? editedContents[item.id] : item.value;
    
    const { error } = await supabase
      .from('site_content')
      .update({ value: newValue })
      .eq('id', item.id);
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }
    
    toast({
      title: "Succès",
      description: "Contenu mis à jour",
    });
    
    // Remove from edited list
    const newEdited = { ...editedContents };
    delete newEdited[item.id];
    setEditedContents(newEdited);
    
    // Refresh contents
    await fetchContents();
    setIsSaving(false);
  };

  const getContentsBySection = (section: string) => {
    return contents.filter(c => c.section === section);
  };

  const renderContentField = (item: ContentItem) => {
    const currentValue = editedContents[item.id] !== undefined ? editedContents[item.id] : item.value;
    const hasChanges = editedContents[item.id] !== undefined;
    
    return (
      <Card key={item.id} className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex justify-between items-center">
            <span>{item.key}</span>
            {hasChanges && (
              <Button
                size="sm"
                onClick={() => handleSave(item)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {item.value.length > 100 ? (
            <Textarea
              value={currentValue}
              onChange={(e) => handleChange(item.id, e.target.value)}
              rows={4}
              className="w-full"
            />
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => handleChange(item.id, e.target.value)}
              className="w-full"
            />
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-poppins">Gestion des Contenus</h1>
        <p className="text-muted-foreground">Modifiez les textes du site web</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">À Propos</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Personnalisez la section d'accueil de votre site
          </div>
          {getContentsBySection('hero').map(renderContentField)}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Personnalisez la section "À propos"
          </div>
          {getContentsBySection('about').map(renderContentField)}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Personnalisez la section "Services"
          </div>
          {getContentsBySection('services').map(renderContentField)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
