import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera } from "lucide-react";

export const SkinAnalyzerBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-karma-gold to-accent text-primary-foreground overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Skin Analyzer
            </h3>
            <p className="text-primary-foreground/90 text-sm mb-4">
              Get AI-powered skin analysis and personalized recommendations
            </p>
            <Button
              onClick={() => navigate("/skin-analyzer")}
              variant="secondary"
              className="bg-primary-foreground text-karma-brown hover:bg-primary-foreground/90"
            >
              Analyze My Skin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};