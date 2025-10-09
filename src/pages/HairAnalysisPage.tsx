import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAbJINoNUa_H8UCfdpjstcWJS2ZMjDB3mQ';
const genAI = new GoogleGenerativeAI(API_KEY);

const HairAnalysisPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImages, setCapturedImages] = useState<{[key: string]: string}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [currentCaptureView, setCurrentCaptureView] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lightingAdvice, setLightingAdvice] = useState<string>("Position your hair in good lighting");
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [faceBox, setFaceBox] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const hairViews = [
    {
      id: 'front',
      name: 'Front View',
      description: 'Capture your hairline and forehead',
      icon: '👤',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'top',
      name: 'Top View',
      description: 'Capture the crown and top of head',
      icon: '👑',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'side',
      name: 'Side View',
      description: 'Capture temple and side areas',
      icon: '👂',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const hairParameters = [
    { id: 'density', name: 'Density', description: 'Hair density and thickness', color: '#FF6B6B' },
    { id: 'scalp', name: 'Scalp Health', description: 'Scalp condition and health', color: '#4ECDC4' },
    { id: 'texture', name: 'Texture', description: 'Hair texture and quality', color: '#45B7D1' },
    { id: 'damage', name: 'Damage', description: 'Hair damage and split ends', color: '#96CEB4' },
    { id: 'growth', name: 'Growth', description: 'Hair growth patterns', color: '#FFEAA7' },
    { id: 'hydration', name: 'Hydration', description: 'Hair moisture levels', color: '#DDA0DD' },
    { id: 'recommendations', name: 'Recommendations', description: 'Care recommendations', color: '#98D8C8' }
  ];

  const startCamera = async (view: string) => {
    try {
      console.log('Starting camera for view:', view);
      
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }
      
      console.log('Requesting camera permission...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // Front camera
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 30, min: 15 }
        }
      });
      
      console.log('Camera stream obtained:', mediaStream);
      setStream(mediaStream);
      setCurrentCaptureView(view);
      setShowCamera(true);
      
      // Set simple lighting advice
      setLightingAdvice("Position your hair in good lighting");
      
      // Start lighting check after a short delay
      setTimeout(() => {
        startLightingCheck();
      }, 1000);
      
    } catch (error: any) {
      console.error('Camera error:', error);
      setCameraError(`Camera access failed: ${error.message}`);
      setError(`Camera access failed: ${error.message}`);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCurrentCaptureView(null);
    setFaceDetected(false);
    setFaceBox(null);
    setCameraError(null);
    setError(null);
    stopFaceDetection();
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !currentCaptureView) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Update captured images
    const newCapturedImages = {
      ...capturedImages,
      [currentCaptureView]: imageData
    };
    setCapturedImages(newCapturedImages);

    // Stop camera
    stopCamera();

    // Auto-analyze when all 3 images are captured
    if (Object.keys(newCapturedImages).length === 3) {
      analyzeHair(newCapturedImages);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentCaptureView) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      const newCapturedImages = {
        ...capturedImages,
        [currentCaptureView]: imageData
      };
      setCapturedImages(newCapturedImages);

      // Auto-analyze when all 3 images are captured
      if (Object.keys(newCapturedImages).length === 3) {
        analyzeHair(newCapturedImages);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeHair = async (images?: {[key: string]: string}) => {
    const imagesToAnalyze = images || capturedImages;
    
    if (Object.keys(imagesToAnalyze).length < 3) {
      setError('Please capture all three views before analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
        You are a professional trichologist analyzing THREE hair images: front view, top view, and side view. You MUST analyze ALL THREE images and provide results for each view.
        
        CRITICAL ANALYSIS INSTRUCTIONS:
        - You are receiving 3 separate images: front, top, and side hair views
        - Analyze EACH image individually and provide parameters for ALL views
        - Look VERY CAREFULLY at the actual hair - examine every detail
        - Report ALL visible hair issues you can detect, even minor ones
        - Be thorough and comprehensive in your analysis
        - Provide precise, medical-grade descriptions
        - Use exact coordinates within the hair boundaries
        - Take your time to carefully examine each image for ALL hair issues
        
        ANALYZE THESE 7 HAIR PARAMETERS WITH CLINICAL ACCURACY:
        1. Hair Density and Thickness: Hair density, thickness of individual strands
        2. Scalp Health and Condition: Scalp visibility, redness, irritation, dryness
        3. Hair Texture and Quality: Texture, quality, shine, frizz
        4. Potential Issues: Dandruff, dryness, damage, hair loss
        5. Hair Growth Patterns: Receding hairline, general growth patterns
        6. Recommendations for Improvement: Hydration, styling, scalp care, trimming, diet, general health
        
        IMPORTANT: Look for ALL of these parameters in EVERY image. Do not skip any analysis.
        
        COORDINATE SYSTEM (for 300x300 cropped images):
        - Image dimensions: 300x300 pixels
        - Hair center: (150, 150)
        - Forehead area: (150, 60-120)
        - Crown area: (150, 80-140)
        - Side areas: (100-200, 120-200)
        - Temple areas: (80-120, 140-180) and (180-220, 140-180)
        
        DETECTION CRITERIA:
        - Report ALL visible hair issues, even minor ones
        - Use specific anatomical locations (e.g., "Thinning at temples" not "Hair loss")
        - Provide exact pixel coordinates where the issue is most prominent
        - Look for ALL 6 parameters in EVERY image - do not skip any
        - Maximum 10 issues per hair view to ensure comprehensive analysis
        - Look very carefully for subtle issues that might be missed
        - MANDATORY: You must analyze ALL THREE views (front, top, side)
        - MANDATORY: You must check for ALL 6 parameters in each view
        - If you see ANY hair issue, report it with coordinates
        
        SCORING:
        - Provide an overall_score from 0 to 100 (integer). 100 = excellent hair health
        - Higher counts/severity reduce score. Good hydration and low damage increase score.
        - Consider overall hair quality, not just individual issues

        REQUIRED JSON STRUCTURE (analyze ALL three views comprehensively):
        {
          "hair_analysis": {
            "1. Hair Density and Thickness": {
              "density": "Appears to be medium density overall.",
              "thickness": "Hair strands appear to be of medium thickness. It's difficult to fully assess without closer inspection, but they don't appear particularly fine or coarse.",
              "notes": "Density might be slightly lower at the temples. Further inspection would be needed to confirm. The density seems consistent on top."
            },
            "2. Scalp Health and Condition": {
              "condition": "Scalp is not clearly visible in these images. Without closer, clearer images, it is difficult to definitively assess the scalp health.",
              "redness_or_irritation": "No obvious signs of significant redness or irritation are visible in the photos provided.",
              "dryness_or_oiliness": "Difficult to assess dryness or oiliness from these images. Further inspection required.",
              "notes": "It is important to examine the scalp directly for a more accurate assessment."
            },
            "3. Hair Texture and Quality": {
              "texture": "Appears to be wavy/slightly curly. The hair has some natural waves present.",
              "quality": "The hair seems to be in relatively good condition. No significant visible signs of excessive damage. Some frizz is present, which may indicate dryness.",
              "shine": "Shine is moderate, indicating reasonable health but could be improved with proper hydration.",
              "notes": "A product used for styling is noted that maintains the hair texture."
            },
            "4. Potential Issues": {
              "dandruff": "No visible signs of dandruff in the provided images.",
              "dryness": "Possible dryness indicated by some frizz. Requires closer inspection and possibly testing moisture levels.",
              "damage": "No significant visible damage like split ends is apparent in the photos. However, minor damage may not be easily visible in the images.",
              "hair_loss": "It's hard to assess hair loss with the given images. Temples should be examined more closely in the future. It is best to compare to previous photos.",
              "notes": "Routine trimming can help prevent split ends and maintain overall hair health. The temples will require more consistent checkup to spot a thinning."
            },
            "5. Hair Growth Patterns": {
              "receding_hairline": "Hard to detect from images. The hairline appears to be straight and normal from the images, yet there are no images of the back of the hairline to see growth patterns.",
              "general_growth": "Hair is growing upwards which indicates recent cutting of hair. Without a specific time for hair trimming, hair growth is hard to determine.",
              "notes": "Observe and compare to previous photos for changes in hairline or thinning over time."
            },
            "6. Recommendations for Improvement": {
              "hydration": "Use a moisturizing shampoo and conditioner to combat potential dryness and reduce frizz.",
              "styling": "Use hydrating styling products to define curls and reduce frizz, such as leave-in conditioners or hair oils.",
              "scalp_care": "Consider incorporating a scalp massage into your routine to improve circulation and scalp health. Use a scalp brush for exfoliation.",
              "trimming": "Regular trimming every 6-8 weeks can help remove split ends and maintain hair health.",
              "diet": "Ensure a balanced diet rich in vitamins and minerals, particularly those known to support hair health (biotin, iron, zinc).",
              "general_health": "Get professional health advice for any underlying health concerns that may affect hair growth and condition. Stress affects hair condition as well.",
              "notes": "It's crucial to consult a dermatologist or trichologist for a thorough scalp and hair assessment, especially if concerns like hair loss or persistent scalp issues arise."
            }
          }
        }

        CRITICAL INSTRUCTIONS:
        - You MUST analyze all three images and provide results for front, top, and side views
        - You MUST check for ALL 6 parameters in EVERY image
        - You MUST report ALL visible hair issues you can detect
        - Do NOT skip any views or parameters
        - Do NOT return empty parameter arrays unless absolutely no issues are visible
        - Return ONLY valid JSON without any markdown formatting
        - Be extremely thorough and comprehensive in your analysis
        
        EXAMINE THE IMAGES VERY CAREFULLY AND REPORT EVERYTHING YOU SEE!
      `;

      const imageParts = Object.entries(imagesToAnalyze).map(([view, imageData]) => ({
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const analysisText = response.text();

      console.log('Raw analysis response:', analysisText);

      // Try to parse the response
      let parsedAnalysis;
      try {
        // Remove any markdown formatting
        const cleanText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedAnalysis = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('Failed to parse analysis:', parseError);
        // Use the raw text as fallback
        parsedAnalysis = { raw_analysis: analysisText };
      }

      setAnalysisResult(parsedAnalysis);

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('hairAnalysisHistory') || '[]');
      history.unshift({
        analysisResult: parsedAnalysis,
        capturedImages: imagesToAnalyze,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('hairAnalysisHistory', JSON.stringify(history.slice(0, 10)));

      // Auto-navigate to results page after 2 seconds
      setTimeout(() => {
        navigate('/hair-analysis-results', {
          state: {
            analysisResult: parsedAnalysis,
            capturedImages: imagesToAnalyze
          }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCapturedCount = () => {
    return Object.keys(capturedImages).length;
  };

  const getCurrentViewInfo = () => {
    const currentView = hairViews.find(view => !capturedImages[view.id]);
    return currentView || hairViews[0];
  };

  const getFramePercents = (box: any) => {
    if (!videoRef.current) return { x: 0, y: 0, width: 0, height: 0 };
    
    const video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    return {
      x: (box.x / videoWidth) * 100,
      y: (box.y / videoHeight) * 100,
      width: (box.width / videoWidth) * 100,
      height: (box.height / videoHeight) * 100
    };
  };

  const getCropRectFromPercents = (percents: any) => {
    if (!videoRef.current) return { x: 0, y: 0, width: 0, height: 0 };
    
    const video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    return {
      x: (percents.x / 100) * videoWidth,
      y: (percents.y / 100) * videoHeight,
      width: (percents.width / 100) * videoWidth,
      height: (percents.height / 100) * videoHeight
    };
  };

  const checkLighting = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      pixelCount++;
    }
    
    const averageBrightness = totalBrightness / pixelCount;
    
    if (averageBrightness < 80) {
      setLightingAdvice("Lighting is too dark. Move to a brighter area.");
    } else if (averageBrightness > 200) {
      setLightingAdvice("Lighting is too bright. Move to a more shaded area.");
    } else {
      setLightingAdvice("Lighting looks good!");
    }
  };

  const startLightingCheck = () => {
    const interval = setInterval(checkLighting, 1000);
    detectionIntervalRef.current = interval;
  };

  const stopFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Update video stream when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              aria-label="Go back to home"
              title="Go back to home"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Hair Analysis</h1>
              <p className="text-sm text-gray-500">AI-powered hair health assessment</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Progress Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Hair Analysis</h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {getCapturedCount() === 3 ? 'Analysis in progress...' : 'Ready to start'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{getCapturedCount()}/3</div>
              <div className="text-sm text-gray-600">photos</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(getCapturedCount() / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {getCapturedCount() === 3 
              ? 'All photos captured! Analysis in progress...' 
              : `Capture photos of all three areas for complete analysis (${getCapturedCount()}/3).`
            }
          </p>
        </div>

        {/* Hair Capture Views */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {hairViews.map((view) => (
            <div key={view.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${view.color} flex items-center justify-center text-2xl`}>
                  {view.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{view.name}</h3>
                  <p className="text-sm text-gray-600">{view.description}</p>
                </div>
                {capturedImages[view.id] && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              {capturedImages[view.id] ? (
                <div className="relative">
                  <img
                    src={capturedImages[view.id]}
                    alt={`${view.name} captured`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startCamera(view.id)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Capture {view.name}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Analyzing Your Hair</h3>
              <p className="text-gray-600">Please wait while we analyze your hair photos...</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tips for Best Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tips for Best Results</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">1</span>
              </div>
              <span className="text-sm text-gray-700">Clean, dry hair</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">2</span>
              </div>
              <span className="text-sm text-gray-700">Remove hair accessories</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">3</span>
              </div>
              <span className="text-sm text-gray-700">Good lighting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">4</span>
              </div>
              <span className="text-sm text-gray-700">Stable camera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        aria-label="Upload image file"
        title="Upload image file"
        className="hidden"
      />

      {/* Camera Modal */}
      {showCamera && currentCaptureView && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative w-full h-full">
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror effect
            />
            
            {/* Loading Indicator */}
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            )}
            
            {/* Camera Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
              {/* Close Button */}
              <button
                onClick={stopCamera}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors"
                aria-label="Close camera"
                title="Close camera"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                className="bg-white hover:bg-gray-100 text-gray-800 p-4 rounded-full transition-colors"
                aria-label="Capture photo"
                title="Capture photo"
              >
                <Camera className="w-8 h-8" />
              </button>
              
              {/* Upload Button */}
              <button
                onClick={() => {
                  stopCamera();
                  fileInputRef.current?.setAttribute('data-view', currentCaptureView);
                  fileInputRef.current?.click();
                }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors"
                aria-label="Upload from gallery"
                title="Upload from gallery"
              >
                <Upload className="w-6 h-6" />
              </button>
            </div>
            
            {/* Instructions */}
            <div className="absolute top-8 left-0 right-0 text-center">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg inline-block">
                <p className="text-sm">
                  Capture {hairViews.find(view => view.id === currentCaptureView)?.name}
                </p>
                <p className="text-xs opacity-80 mt-1">
                  {hairViews.find(view => view.id === currentCaptureView)?.description}
                </p>
              </div>
            </div>

            {/* Lighting Advice */}
            <div className="absolute top-20 left-0 right-0 text-center">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg inline-block">
                <p className="text-xs">{lightingAdvice}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default HairAnalysisPage;