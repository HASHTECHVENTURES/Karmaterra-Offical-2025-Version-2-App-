import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Droplets, Sun, Wind, Snowflake } from "lucide-react";

const KnowYourSkinPage = () => {
  const navigate = useNavigate();

  const skinTypes = [
    {
      type: "Oily",
      icon: Droplets,
      description: "Shiny appearance, enlarged pores, prone to acne",
      characteristics: ["Excessive sebum production", "Visible pores", "Acne-prone", "Shiny T-zone"]
    },
    {
      type: "Dry",
      icon: Wind,
      description: "Tight feeling, flaky patches, rough texture",
      characteristics: ["Lack of moisture", "Rough texture", "Flaky patches", "Tight feeling"]
    },
    {
      type: "Combination",
      icon: Sun,
      description: "Oily T-zone with dry cheeks",
      characteristics: ["Oily forehead, nose, chin", "Dry or normal cheeks", "Mixed concerns", "Uneven texture"]
    },
    {
      type: "Sensitive",
      icon: Snowflake,
      description: "Easily irritated, reactive to products",
      characteristics: ["Easily irritated", "Redness prone", "Reactive to products", "Burning sensation"]
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
          <h1 className="text-xl font-bold">Know Your Skin</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Understanding Skin Types</CardTitle>
            <p className="text-center text-muted-foreground">
              Learn about different skin types and their characteristics
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {skinTypes.map((skin, index) => (
            <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center">
                    <skin.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{skin.type} Skin</h3>
                    <p className="text-muted-foreground mb-4">{skin.description}</p>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Key Characteristics:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {skin.characteristics.map((char, idx) => (
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
            <h3 className="text-xl font-semibold mb-2">Need Help Identifying Your Skin Type?</h3>
            <p className="text-muted-foreground mb-4">
              Try our skin analyzer for a personalized assessment
            </p>
            <Button 
              onClick={() => navigate("/skin-analyzer")}
              className="bg-gradient-to-r from-karma-gold to-accent"
            >
              Analyze My Skin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowYourSkinPage;