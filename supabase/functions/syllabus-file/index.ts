import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slugOrId = url.pathname.split('/').pop();

    if (!slugOrId) {
      return new Response(
        JSON.stringify({ error: 'Slug ou ID manquant' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to find syllabus by slug first, then by ID
    let query = supabase
      .from('syllabus')
      .select('file_url, title')
      .eq('slug', slugOrId)
      .maybeSingle();

    let { data: syllabus } = await query;

    // If not found by slug, try by ID
    if (!syllabus) {
      const { data } = await supabase
        .from('syllabus')
        .select('file_url, title')
        .eq('id', slugOrId)
        .maybeSingle();
      syllabus = data;
    }

    if (!syllabus || !syllabus.file_url) {
      return new Response(
        JSON.stringify({ error: 'Fichier non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the file from Supabase Storage
    const fileResponse = await fetch(syllabus.file_url);
    
    if (!fileResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération du fichier' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the file blob
    const fileBlob = await fileResponse.blob();
    
    // Determine content type from the original URL
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

    // Return the file with proper headers
    return new Response(fileBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${syllabus.title}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
