import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sun, Moon, Droplets, CheckCircle, Clock } from "lucide-react";

const SkinRitualPage = () => {
  const navigate = useNavigate();
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);

  const morningRoutine = [
    { id: "morning-cleanse", step: "Gentle Cleanser", description: "Remove overnight impurities", duration: "1 min" },
    { id: "morning-toner", step: "Hydrating Toner", description: "Balance and prep skin", duration: "30 sec" },
    { id: "morning-serum", step: "Vitamin C Serum", description: "Antioxidant protection", duration: "1 min" },
    { id: "morning-moisturizer", step: "Day Moisturizer", description: "Hydrate and protect", duration: "1 min" },
    { id: "morning-spf", step: "SPF 30+ Sunscreen", description: "UV protection (essential!)", duration: "1 min" }
  ];

  const eveningRoutine = [
    { id: "evening-cleanse1", step: "Oil Cleanser", description: "Remove makeup and sunscreen", duration: "2 min" },
    { id: "evening-cleanse2", step: "Water-based Cleanser", description: "Deep clean pores", duration: "1 min" },
    { id: "evening-treatment", step: "Treatment (Retinol/AHA)", description: "Repair and renew", duration: "1 min" },
    { id: "evening-moisturizer", step: "Night Moisturizer", description: "Rich overnight hydration", duration: "1 min" },
    { id: "evening-oil", step: "Facial Oil (optional)", description: "Lock in moisture", duration: "30 sec" }
  ];

  const weeklyTreatments = [
    { id: "exfoliate", step: "Exfoliation", description: "2-3 times per week", frequency: "2-3x/week" },
    { id: "mask", step: "Face Mask", description: "Deep treatment", frequency: "1-2x/week" },
    { id: "massage", step: "Facial Massage", description: "Boost circulation", frequency: "2-3x/week" }
  ];

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getCompletionPercentage = (routine: any[]) => {
    const completed = routine.filter(step => selectedSteps.includes(step.id)).length;
    return Math.round((completed / routine.length) * 100);
  };

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
          <h1 className="text-xl font-bold">Your Skin Ritual</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Daily Skincare Routine</CardTitle>
            <p className="text-center text-muted-foreground">
              Build healthy habits with our recommended routine
            </p>
          </CardHeader>
        </Card>

        {/* Morning Routine */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              Morning Routine
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {getCompletionPercentage(morningRoutine)}% complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {morningRoutine.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={item.id}
                  checked={selectedSteps.includes(item.id)}
                  onCheckedChange={() => toggleStep(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{index + 1}. {item.step}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {selectedSteps.includes(item.id) && (
                  <CheckCircle className="w-5 h-5 text-karma-green" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evening Routine */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-500" />
              Evening Routine
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {getCompletionPercentage(eveningRoutine)}% complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eveningRoutine.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={item.id}
                  checked={selectedSteps.includes(item.id)}
                  onCheckedChange={() => toggleStep(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{index + 1}. {item.step}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {selectedSteps.includes(item.id) && (
                  <CheckCircle className="w-5 h-5 text-karma-green" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Treatments */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-karma-gold" />
              Weekly Treatments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyTreatments.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={item.id}
                  checked={selectedSteps.includes(item.id)}
                  onCheckedChange={() => toggleStep(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.step}</span>
                    <span className="text-xs bg-karma-light-gold px-2 py-1 rounded-full">
                      {item.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {selectedSteps.includes(item.id) && (
                  <CheckCircle className="w-5 h-5 text-karma-green" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-karma-light-gold to-karma-cream">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Need Product Recommendations?</h3>
            <p className="text-muted-foreground mb-4">
              Talk to our AI coach for personalized product suggestions
            </p>
            <Button 
              onClick={() => navigate("/talk-to-us")}
              className="bg-gradient-to-r from-karma-gold to-accent"
            >
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkinRitualPage;