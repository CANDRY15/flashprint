import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  adSlot: string;
  autoCloseDelay?: number; // Delay in seconds before showing close button
}

const InterstitialAd = ({ 
  isOpen, 
  onClose, 
  adSlot,
  autoCloseDelay = 5 
}: InterstitialAdProps) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(autoCloseDelay);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setCountdown(autoCloseDelay);
      
      // Countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Load AdSense ad
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }

      return () => clearInterval(interval);
    }
  }, [isOpen, autoCloseDelay]);

  return (
    <Dialog open={isOpen} onOpenChange={canClose ? onClose : undefined}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 gap-0">
        <div className="relative h-full flex flex-col">
          {/* Close button - only show after countdown */}
          {canClose && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Countdown display */}
          {!canClose && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/90 px-4 py-2 rounded-full text-sm font-medium">
              Fermeture dans {countdown}s
            </div>
          )}

          {/* AdSense Ad Container */}
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
            <ins
              className="adsbygoogle"
              style={{ 
                display: "block",
                minWidth: "300px",
                minHeight: "250px"
              }}
              data-ad-client="ca-pub-1111957053618310"
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Continue button - show after countdown */}
          {canClose && (
            <div className="p-4 border-t bg-background">
              <Button 
                onClick={onClose} 
                className="w-full"
                size="lg"
              >
                Continuer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterstitialAd;
