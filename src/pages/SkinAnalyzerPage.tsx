import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Camera, Sparkles, CheckCircle } from "lucide-react";

const SkinAnalyzerPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        skinType: "Combination",
        concerns: ["Fine Lines", "Dark Spots", "Dryness"],
        score: 85,
        recommendations: [
          "Use a gentle cleanser twice daily",
          "Apply vitamin C serum in the morning",
          "Don't forget SPF 30+ sunscreen",
          "Use a hydrating night cream"
        ]
      });
      setStep(3);
    }, 3000);
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
          <h1 className="text-xl font-bold">Skin Analyzer</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Take Your Selfie</CardTitle>
              <p className="text-muted-foreground">
                We'll analyze your skin to provide personalized recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-8 text-center">
                <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Camera will open here</p>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-karma-green" />
                  <span>Ensure good lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-karma-green" />
                  <span>Remove makeup if possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-karma-green" />
                  <span>Face the camera directly</span>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-karma-gold to-accent"
                size="lg"
              >
                Take Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Analyzing Your Skin</CardTitle>
              <p className="text-muted-foreground">
                Our AI is examining your skin characteristics
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!analyzing ? (
                <>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-karma-light-gold to-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Your Photo</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-karma-gold to-accent"
                    size="lg"
                  >
                    Start Analysis
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="animate-spin mx-auto w-12 h-12 border-4 border-karma-gold border-t-transparent rounded-full"></div>
                  <p className="text-muted-foreground">Analyzing skin texture, tone, and concerns...</p>
                  <Progress value={75} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && results && (
          <div className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Your Skin Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-karma-gold mb-2">{results.score}/100</div>
                  <p className="text-muted-foreground">Skin Health Score</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="font-semibold">Skin Type</p>
                    <p className="text-karma-gold">{results.skinType}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="font-semibold">Main Concerns</p>
                    <p className="text-sm text-muted-foreground">{results.concerns.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recommended Routine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-karma-gold rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-karma-gold to-accent"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalyzerPage;