import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PdfView = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDisplayPdf = async () => {
      if (!slugOrId) {
        setError("Identifiant manquant");
        setIsLoading(false);
        return;
      }

      try {
        // Try to fetch by slug first
        let { data } = await supabase
          .from('syllabus')
          .select('id, slug, file_url, title')
          .eq('slug', slugOrId)
          .maybeSingle();

        // If not found by slug, try by ID
        if (!data) {
          const result = await supabase
            .from('syllabus')
            .select('id, slug, file_url, title')
            .eq('id', slugOrId)
            .maybeSingle();
          data = result.data;
        }

        if (!data || !data.file_url) {
          setError("Document introuvable");
          setIsLoading(false);
          return;
        }

        // Track QR scan event
        await supabase.from('syllabus_analytics').insert({
          syllabus_id: data.id,
          event_type: 'qr_scan',
          user_agent: navigator.userAgent,
        });

        // Fetch PDF through the edge function proxy
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const proxyUrl = `${supabaseUrl}/functions/v1/syllabus-file/${data.slug || data.id}`;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error('Impossible de charger le document');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Set document title
        document.title = data.title || "FlashPrint - Document";
        
        setPdfUrl(blobUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError("Erreur lors du chargement du document");
        setIsLoading(false);
      }
    };

    fetchAndDisplayPdf();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [slugOrId]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold">{error}</h1>
          <p className="text-muted-foreground text-sm">
            Ce document n'existe pas ou a été supprimé.
          </p>
          <a 
            href="/" 
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={pdfUrl || ''}
      className="h-screen w-screen border-0"
      title="Document PDF"
    />
  );
};

export default PdfView;
