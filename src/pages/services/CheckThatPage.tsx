import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Camera, Clock, CheckCircle } from "lucide-react";

const CheckThatPage = () => {
  const navigate = useNavigate();

  const checkSteps = [
    {
      icon: Clock,
      title: "Morning Check",
      description: "Examine your skin first thing in the morning after cleansing",
      tips: ["Look for overnight changes", "Check for new breakouts", "Notice texture differences"]
    },
    {
      icon: Search,
      title: "Close Inspection",
      description: "Use good lighting and possibly a magnifying mirror",
      tips: ["Check pore size", "Look for blackheads", "Examine skin texture", "Notice any discoloration"]
    },
    {
      icon: Camera,
      title: "Document Changes",
      description: "Take photos to track your skin's progress over time",
      tips: ["Same lighting conditions", "Same angles", "Weekly documentation", "Note product changes"]
    }
  ];

  const whatToCheck = [
    "Skin texture and smoothness",
    "Pore size and visibility",
    "Oil production levels",
    "Dry or flaky areas",
    "Redness or irritation",
    "Dark spots or hyperpigmentation",
    "Fine lines and wrinkles",
    "Overall skin tone evenness"
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
          <h1 className="text-xl font-bold">How to Check That</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Skin Assessment Guide</CardTitle>
            <p className="text-center text-muted-foreground">
              Learn how to properly examine and monitor your skin health
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {checkSteps.map((step, index) => (
            <Card key={index} className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Key Points:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-karma-green" />
                            {tip}
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

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>What to Look For</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {whatToCheck.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-karma-gold rounded-full"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-karma-light-gold to-karma-cream">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready for Professional Analysis?</h3>
            <p className="text-muted-foreground mb-4">
              Get an AI-powered skin assessment with personalized recommendations
            </p>
            <Button 
              onClick={() => navigate("/skin-analyzer")}
              className="bg-gradient-to-r from-karma-gold to-accent"
            >
              Start Skin Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckThatPage;