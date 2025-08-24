import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Layers, Shield, Zap, Heart } from "lucide-react";

const UnderstandSkinPage = () => {
  const navigate = useNavigate();

  const skinLayers = [
    {
      name: "Epidermis",
      icon: Layers,
      description: "The outermost protective layer",
      functions: ["Protects from UV damage", "Prevents water loss", "Barrier against bacteria", "Contains melanocytes"]
    },
    {
      name: "Dermis", 
      icon: Shield,
      description: "The middle layer containing collagen",
      functions: ["Provides strength", "Contains blood vessels", "Houses hair follicles", "Produces collagen"]
    },
    {
      name: "Hypodermis",
      icon: Heart,
      description: "The deepest fat layer",
      functions: ["Insulation", "Energy storage", "Cushioning", "Temperature regulation"]
    }
  ];

  const skinFunctions = [
    {
      title: "Protection",
      description: "Acts as a barrier against environmental damage, UV rays, and harmful bacteria"
    },
    {
      title: "Temperature Regulation",
      description: "Helps maintain body temperature through sweating and blood vessel dilation"
    },
    {
      title: "Sensation",
      description: "Contains nerve endings that detect touch, pressure, temperature, and pain"
    },
    {
      title: "Vitamin D Synthesis",
      description: "Produces vitamin D when exposed to sunlight, essential for bone health"
    },
    {
      title: "Immune Defense",
      description: "First line of defense against pathogens and foreign substances"
    },
    {
      title: "Hydration Balance",
      description: "Regulates water loss and maintains skin moisture levels"
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
          <h1 className="text-xl font-bold">Understand Skin</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Skin Science</CardTitle>
            <p className="text-center text-muted-foreground">
              Learn about your skin's structure and how it works
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-karma-gold" />
              Skin Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skinLayers.map((layer, index) => (
              <div key={index} className="border-l-4 border-karma-gold pl-4 space-y-2">
                <div className="flex items-center gap-2">
                  <layer.icon className="w-5 h-5 text-karma-gold" />
                  <h3 className="text-lg font-semibold">{layer.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{layer.description}</p>
                <ul className="text-sm space-y-1">
                  {layer.functions.map((func, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-karma-gold rounded-full"></div>
                      {func}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-karma-gold" />
              Skin Functions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {skinFunctions.map((func, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-karma-brown">{func.title}</h4>
                  <p className="text-sm text-muted-foreground">{func.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-karma-light-gold to-karma-cream">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Want to Learn More?</h3>
            <p className="text-muted-foreground mb-4">
              Discover how different ingredients work with your skin
            </p>
            <Button 
              onClick={() => navigate("/ingredients")}
              className="bg-gradient-to-r from-karma-gold to-accent"
            >
              Explore Ingredients
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnderstandSkinPage;