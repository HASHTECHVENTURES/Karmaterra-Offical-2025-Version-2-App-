import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Waves, Zap, Sun, Wind } from "lucide-react";

const KnowYourHairPage = () => {
  const navigate = useNavigate();

  const hairTypes = [
    {
      type: "Straight",
      icon: Zap,
      description: "Smooth, silky texture with natural shine",
      characteristics: ["Smooth texture", "Natural shine", "Easy to manage", "Less volume"]
    },
    {
      type: "Wavy",
      icon: Waves,
      description: "S-shaped waves with natural body",
      characteristics: ["S-shaped waves", "Natural body", "Medium volume", "Versatile styling"]
    },
    {
      type: "Curly",
      icon: Sun,
      description: "Spiral curls with lots of volume",
      characteristics: ["Spiral curls", "High volume", "Needs moisture", "Frizz-prone"]
    },
    {
      type: "Coily/Kinky",
      icon: Wind,
      description: "Tight coils with maximum volume",
      characteristics: ["Tight coils", "Maximum volume", "Very dry", "Needs extra care"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-cream via-background to-karma-light-gold">
      {/* Header */}
      <div className="bg-gradient-to-r from-karma-gold to-accent p-4 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Know Your Hair</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Understanding Hair Types</CardTitle>
            <p className="text-center text-muted-foreground">
              Learn about different hair types and their characteristics
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {hairTypes.map((hair, index) => (
            <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center">
                    <hair.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{hair.type} Hair</h3>
                    <p className="text-muted-foreground mb-4">{hair.description}</p>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Key Characteristics:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {hair.characteristics.map((char, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-karma-gold rounded-full"></div>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-karma-light-gold to-karma-cream">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Need Help Identifying Your Hair Type?</h3>
            <p className="text-muted-foreground mb-4">
              Learn more about hair care and styling tips
            </p>
            <Button 
              onClick={() => navigate("/ingredients")}
              className="bg-gradient-to-r from-karma-gold to-accent"
            >
              Learn About Hair Care
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowYourHairPage;
