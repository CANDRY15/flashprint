import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const { toast } = useToast();
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => openShare("facebook")}
        className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30"
        title="Partager sur Facebook"
      >
        <Facebook className="h-4 w-4 text-[#1877F2]" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => openShare("twitter")}
        className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30"
        title="Partager sur Twitter"
      >
        <Twitter className="h-4 w-4 text-[#1DA1F2]" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => openShare("linkedin")}
        className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/30"
        title="Partager sur LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => openShare("whatsapp")}
        className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30"
        title="Partager sur WhatsApp"
      >
        <MessageCircle className="h-4 w-4 text-[#25D366]" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        title="Copier le lien"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShare;