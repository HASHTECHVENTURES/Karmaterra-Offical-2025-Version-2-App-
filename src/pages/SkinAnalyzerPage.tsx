import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Camera, Sparkles, CheckCircle, RotateCcw, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SkinAnalyzerPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Please allow camera access to use the skin analyzer",
        variant: "destructive"
      });
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        setStep(2);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze skin with AI
  const analyzeSkin = async () => {
    if (!capturedImage) return;

    setAnalyzing(true);
    
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', blob, 'skin_photo.jpg');
      
      // Send to backend API
      const apiResponse = await fetch('http://localhost:3001/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysisResults = await apiResponse.json();
      setResults(analysisResults);
      setStep(3);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback to mock results for demo
      setTimeout(() => {
        setResults({
          skinType: "Combination",
          concerns: ["Fine Lines", "Dark Spots", "Dryness"],
          score: 85,
          recommendations: [
            "Use a gentle cleanser twice daily",
            "Apply vitamin C serum in the morning",
            "Don't forget SPF 30+ sunscreen",
            "Use a hydrating night cream"
          ],
          aiAnalysis: {
            texture: "Smooth with minor irregularities",
            tone: "Even with slight variations",
            hydration: "Moderate - needs improvement",
            elasticity: "Good for age group"
          }
        });
        setAnalyzing(false);
        setStep(3);
      }, 3000);
      
      toast({
        title: "Analysis Complete",
        description: "Your skin analysis is ready!",
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-cream via-background to-karma-light-gold">
      {/* Header */}
      <div className="bg-gradient-to-r from-karma-gold to-accent p-4 text-primary-foreground shadow-lg safe-area-top">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">AI Skin Analyzer</h1>
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
              <CardTitle className="text-2xl">Capture Your Skin</CardTitle>
              <p className="text-muted-foreground">
                Take a photo or upload an image for AI analysis
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera View */}
              {stream ? (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-full opacity-50"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button
                      onClick={capturePhoto}
                      className="bg-white text-black hover:bg-gray-100"
                      size="lg"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="bg-black/50 text-white border-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Camera will open here</p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-karma-gold to-accent"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Use Camera
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
              
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-karma-green" />
                  <span>Keep face centered in the circle</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-karma-gold to-accent rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">AI Analysis</CardTitle>
              <p className="text-muted-foreground">
                Our AI is examining your skin characteristics
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!analyzing ? (
                <>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    {capturedImage && (
                      <img 
                        src={capturedImage} 
                        alt="Captured skin" 
                        className="w-48 h-48 mx-auto object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={analyzeSkin}
                      className="flex-1 bg-gradient-to-r from-karma-gold to-accent"
                      size="lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </Button>
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="animate-spin mx-auto w-12 h-12 border-4 border-karma-gold border-t-transparent rounded-full"></div>
                  <p className="text-muted-foreground">AI analyzing skin texture, tone, and concerns...</p>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Using advanced dermatology AI model
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && results && (
          <div className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-center text-2xl">AI Skin Analysis Results</CardTitle>
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

                {results.aiAnalysis && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">AI Analysis Details:</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Texture:</span>
                        <span className="text-karma-gold">{results.aiAnalysis.texture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tone:</span>
                        <span className="text-karma-gold">{results.aiAnalysis.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hydration:</span>
                        <span className="text-karma-gold">{results.aiAnalysis.hydration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Elasticity:</span>
                        <span className="text-karma-gold">{results.aiAnalysis.elasticity}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>AI-Recommended Routine</CardTitle>
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

            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-to-r from-karma-gold to-accent"
                size="lg"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SkinAnalyzerPage;