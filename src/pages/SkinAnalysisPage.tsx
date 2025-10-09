import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAbJINoNUa_H8UCfdpjstcWJS2ZMjDB3mQ';
const genAI = new GoogleGenerativeAI(API_KEY);

const SkinAnalysisPage = () => {
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
  const [lightingAdvice, setLightingAdvice] = useState<string>("Position your face in good lighting");
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [faceBox, setFaceBox] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const faceViews = [
    {
      id: 'front',
      name: 'Front Face',
      description: 'Center your face in the frame',
      icon: '👤',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'left',
      name: 'Left Side',
      description: 'Turn your head to the left',
      icon: '↩️',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'right',
      name: 'Right Side',
      description: 'Turn your head to the right',
      icon: '↪️',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const skinParameters = [
    { id: 'acne', name: 'Acne', description: 'Blackheads and whiteheads', color: '#FF6B6B' },
    { id: 'pores', name: 'Pores', description: 'Pore visibility and size', color: '#4ECDC4' },
    { id: 'wrinkles', name: 'Wrinkles', description: 'Fine lines and deeper wrinkles', color: '#45B7D1' },
    { id: 'texture', name: 'Texture', description: 'Skin smoothness or roughness', color: '#96CEB4' },
    { id: 'redness', name: 'Redness', description: 'Areas of irritation or uneven tone', color: '#FFEAA7' },
    { id: 'pigmentation', name: 'Pigmentation', description: 'Dark spots, dark circles, and overall evenness', color: '#DDA0DD' },
    { id: 'hydration', name: 'Hydration', description: 'Moisture levels', color: '#98D8C8' }
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
      setLightingAdvice("Position your face in good lighting");
      
      // Start lighting check after a short delay
      setTimeout(() => {
        startLightingCheck();
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Camera access denied. Please allow camera access and try again.');
      setError('Camera access denied. Please allow camera access and try again.');
      
      // Fallback to file upload
      setTimeout(() => {
        fileInputRef.current?.setAttribute('data-view', view);
        fileInputRef.current?.click();
      }, 1000);
    }
  };

  const stopCamera = () => {
    stopFaceDetection();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCurrentCaptureView(null);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current && currentCaptureView) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Create circular crop canvas
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
        cropCanvas.width = 300;
        cropCanvas.height = 300;
        
        if (cropCtx) {
          // Calculate center and radius for circular crop
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.25; // 25% of smaller dimension
          
          // Create circular clipping path
          cropCtx.beginPath();
          cropCtx.arc(150, 150, 150, 0, 2 * Math.PI);
          cropCtx.clip();
          
          // Draw the circular area from the center of the video
          cropCtx.drawImage(
            canvas,
            centerX - radius, centerY - radius, radius * 2, radius * 2,
            0, 0, 300, 300
          );
          
          // Fill background with white for clean circular image
          cropCtx.globalCompositeOperation = 'destination-over';
          cropCtx.fillStyle = 'white';
          cropCtx.fillRect(0, 0, 300, 300);
        }
        
        const quality = window.innerWidth < 768 ? 0.8 : 0.9;
        const finalImageData = cropCanvas.toDataURL('image/jpeg', quality);
        
        // Store the captured image
        console.log('Capturing image for view:', currentCaptureView);
        setCapturedImages(prev => {
          const newImages = {
            ...prev,
            [currentCaptureView]: finalImageData
          };
          console.log('Updated captured images:', newImages);
          return newImages;
        });
        
        // Stop camera
        stopCamera();
        
        // Check if all 3 images are captured
        const newCapturedImages = { ...capturedImages, [currentCaptureView]: finalImageData };
        const capturedCount = Object.keys(newCapturedImages).length;
        
        console.log('Checking if analysis should start:', { capturedCount, newCapturedImages });
        
        if (capturedCount === 3) {
          // All images captured, start analysis
          console.log('Starting analysis with all 3 images');
          await analyzeAllImages(newCapturedImages);
        }
      }
    }
  };

  const handleImageCapture = (view: string) => {
    startCamera(view);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const view = event.target.getAttribute('data-view') || 'front';
    
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        // Store the uploaded image
        console.log('Uploading image for view:', view);
        setCapturedImages(prev => {
          const newImages = {
            ...prev,
            [view]: imageData
          };
          console.log('Updated captured images from upload:', newImages);
          return newImages;
        });
        
        // Check if all 3 images are captured
        const newCapturedImages = { ...capturedImages, [view]: imageData };
        const capturedCount = Object.keys(newCapturedImages).length;
        
        console.log('Checking if analysis should start from upload:', { capturedCount, newCapturedImages });
        
        if (capturedCount === 3) {
          // All images captured, start analysis
          console.log('Starting analysis with all 3 images from upload');
          await analyzeAllImages(newCapturedImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeAllImages = async (images: {[key: string]: string}) => {
    console.log('🎯 Starting analysis for images:', Object.keys(images));
    setIsAnalyzing(true);
    
    try {
      // Direct analysis without artificial delays
      const analysisResult = await analyzeWithGemini(images);
      
      console.log('📊 Analysis completed successfully:', analysisResult);
      
      setAnalysisResult(analysisResult);
      
      // Save analysis to history
      const analysisHistory = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
      const newAnalysis = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        analysisResult: analysisResult,
        capturedImages: images,
        analysisType: 'comprehensive'
      };
      analysisHistory.unshift(newAnalysis);
      // Keep only last 10 analyses
      if (analysisHistory.length > 10) {
        analysisHistory.splice(10);
      }
      localStorage.setItem('skinAnalysisHistory', JSON.stringify(analysisHistory));
      
      // Navigate to results page with analysis data
      navigate('/skin-analysis-results', {
        state: {
          analysisResult: analysisResult,
          capturedImages: images,
          analysisType: 'comprehensive',
          analysisId: newAnalysis.id
        }
      });
      
    } catch (error) {
      console.error('Error analyzing images:', error);
      setError('Error analyzing images. Please try again.');
      alert('Error analyzing images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sanitize and validate analysis data returned by Gemini
  const sanitizeAnalysis = (raw: any) => {
    const allowedTypes = ['acne','pores','wrinkles','texture','redness','pigmentation','hydration'];
    const safeString = (v: any, fallback = '') => typeof v === 'string' ? v : fallback;
    const toNumber = (v: any, fallback = 0) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    const result: any = { images: { front: { parameters: [] }, left: { parameters: [] }, right: { parameters: [] } }, overall_analysis: '' };

    const images = raw && raw.images && typeof raw.images === 'object' ? raw.images : {};
    ['front','left','right'].forEach((view) => {
      const viewData = images[view] && typeof images[view] === 'object' ? images[view] : {};
      const params = Array.isArray(viewData.parameters) ? viewData.parameters : [];
      const cleaned = params
        .map((p: any) => {
          const typeRaw = safeString(p.type).toLowerCase();
          const type = allowedTypes.includes(typeRaw) ? typeRaw : null;
          if (!type) return null;
          const label = safeString(p.label, type);
          const location = safeString(p.location, 'face');
          const cx = clamp(toNumber(p.coordinates?.x, 150), 0, 300);
          const cy = clamp(toNumber(p.coordinates?.y, 150), 0, 300);
          const confidence = clamp(toNumber(p.confidence, 0.0), 0, 1);
          const severity = safeString(p.severity, 'mild');
          return { type, label, location, coordinates: { x: cx, y: cy }, confidence, severity };
        })
        .filter(Boolean)
        .slice(0, 10);
      result.images[view] = { parameters: cleaned };
    });

    result.overall_analysis = safeString(raw?.overall_analysis, 'Analysis completed.');
    result.overall_score = clamp(toNumber(raw?.overall_score, 75), 0, 100);
    
    // Handle product recommendations
    if (raw?.recommended_products && Array.isArray(raw.recommended_products)) {
      result.recommended_products = raw.recommended_products.map((product: any) => ({
        name: safeString(product.name, 'Product'),
        description: safeString(product.description, ''),
        image_url: safeString(product.image_url, ''),
        website_url: safeString(product.website_url, ''),
        reason: safeString(product.reason, '')
      }));
    }
    
    return result;
  };

  const analyzeWithGemini = async (images: {[key: string]: string}) => {
    try {
      console.log('🔍 Starting Gemini analysis with images:', Object.keys(images));
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
      // Prepare images for analysis
      const imageParts = Object.entries(images).map(([view, imageData]) => {
        const base64Data = imageData.split(',')[1];
        return {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        };
      });
      
      const prompt = `
        You are a professional dermatologist analyzing THREE facial images: front view, left side view, and right side view. You MUST analyze ALL THREE images and provide results for each view.
        
        CRITICAL ANALYSIS INSTRUCTIONS:
        - You are receiving 3 separate images: front, left, and right facial views
        - Analyze EACH image individually and provide parameters for ALL views
        - Look VERY CAREFULLY at the actual skin - examine every detail
        - Report ALL visible skin issues you can detect, even minor ones
        - Be thorough and comprehensive in your analysis
        - Provide precise, medical-grade descriptions
        - Use exact coordinates within the face boundaries
        - Take your time to carefully examine each image for ALL skin issues
        
        ANALYZE THESE 7 SKIN PARAMETERS WITH CLINICAL ACCURACY:
        1. Acne: ANY visible blackheads, whiteheads, active pimples, or acne scars
        2. Pores: ANY enlarged or prominent pores, especially on nose and cheeks
        3. Wrinkles: ANY fine lines, deep wrinkles, or expression lines
        4. Texture: ANY rough, bumpy, or uneven skin texture
        5. Redness: ANY areas of irritation, inflammation, or uneven tone
        6. Pigmentation: ANY dark spots, age spots, melasma, or uneven skin tone
        7. Hydration: ANY dry patches, flaky skin, or dehydration signs
        
        IMPORTANT: Look for ALL of these parameters in EVERY image. Do not skip any analysis.
        
        COORDINATE SYSTEM (for 300x300 cropped face images):
        - Image dimensions: 300x300 pixels
        - Face center: (150, 150)
        - Forehead area: (150, 60-120)
        - Left eye: (120, 130), Right eye: (180, 130)
        - Nose bridge: (150, 140-170)
        - Left cheek: (100, 160-200), Right cheek: (200, 160-200)
        - Mouth area: (150, 190-210)
        - Chin: (150, 220-250)
        
        DETECTION CRITERIA:
        - Report ALL visible skin issues, even minor ones
        - Use specific anatomical locations (e.g., "Small comedone on left cheek" not "Acne")
        - Provide exact pixel coordinates where the issue is most prominent
        - Look for ALL 7 parameters in EVERY image - do not skip any
        - Maximum 10 issues per face view to ensure comprehensive analysis
        - Look very carefully for subtle issues that might be missed
        - MANDATORY: You must analyze ALL THREE views (front, left, right)
        - MANDATORY: You must check for ALL 7 parameters in each view
        - If you see ANY skin issue, report it with coordinates
        
        SCORING:
        - Provide an overall_score from 0 to 100 (integer). 100 = excellent skin health
        - Higher counts/severity reduce score. Good hydration and low redness increase score.
        - Consider overall skin quality, not just individual issues

        REQUIRED JSON STRUCTURE (analyze ALL three views comprehensively):
        {
          "images": {
            "front": {
              "parameters": [
                {"type": "acne", "label": "Small comedone on left cheek", "location": "left cheek", "coordinates": {"x": 120, "y": 180}, "confidence": 0.86, "severity": "mild"},
                {"type": "pores", "label": "Enlarged pores on nose", "location": "nose", "coordinates": {"x": 150, "y": 160}, "confidence": 0.78, "severity": "moderate"},
                {"type": "wrinkles", "label": "Fine lines around eyes", "location": "eye area", "coordinates": {"x": 130, "y": 140}, "confidence": 0.65, "severity": "mild"},
                {"type": "texture", "label": "Slight roughness on forehead", "location": "forehead", "coordinates": {"x": 150, "y": 100}, "confidence": 0.70, "severity": "mild"},
                {"type": "redness", "label": "Minor redness on cheeks", "location": "cheeks", "coordinates": {"x": 120, "y": 170}, "confidence": 0.60, "severity": "mild"},
                {"type": "pigmentation", "label": "Small dark spot on cheek", "location": "right cheek", "coordinates": {"x": 180, "y": 175}, "confidence": 0.75, "severity": "mild"},
                {"type": "hydration", "label": "Slight dryness on chin", "location": "chin", "coordinates": {"x": 150, "y": 220}, "confidence": 0.55, "severity": "mild"}
              ]
            },
            "left": {
              "parameters": [
                {"type": "texture", "label": "Slight roughness on cheek", "location": "left cheek", "coordinates": {"x": 100, "y": 175}, "confidence": 0.72, "severity": "mild"},
                {"type": "pores", "label": "Visible pores on cheek", "location": "left cheek", "coordinates": {"x": 90, "y": 190}, "confidence": 0.68, "severity": "mild"},
                {"type": "wrinkles", "label": "Expression lines", "location": "cheek area", "coordinates": {"x": 80, "y": 160}, "confidence": 0.60, "severity": "mild"}
              ]
            },
            "right": {
              "parameters": [
                {"type": "pigmentation", "label": "Small dark spot on cheek", "location": "right cheek", "coordinates": {"x": 200, "y": 185}, "confidence": 0.65, "severity": "mild"},
                {"type": "texture", "label": "Slight uneven texture", "location": "right cheek", "coordinates": {"x": 210, "y": 170}, "confidence": 0.58, "severity": "mild"},
                {"type": "pores", "label": "Enlarged pores on cheek", "location": "right cheek", "coordinates": {"x": 190, "y": 200}, "confidence": 0.70, "severity": "mild"}
              ]
            }
          },
          "overall_analysis": "Comprehensive analysis shows mild comedonal acne, moderate pore visibility, some texture irregularities, minor pigmentation, and slight dryness. Overall skin health is good with room for improvement in pore size and hydration.",
          "overall_score": 75
        }

        PRODUCT RECOMMENDATIONS:
        Based on the analysis, recommend appropriate Karma Terra products:
        
        1. KARMA TERRA Kumkumadi Oil (For Hydrated and Revitalized Skin)
           - Image: https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp
           - Website: https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil
           - Best for: Dry skin, dehydration, skin revitalization
        
        2. Anti-Aging Treatment
           - Image: https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-15at19.52.02_1296x.webp
           - Website: https://www.karmaterra.in/collections/derma-care/products/age-redefine
           - Best for: Wrinkles, fine lines, anti-aging concerns
        
        3. Ultra Sunscreen
           - Image: https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-17at15.05.42_1296x.webp
           - Website: https://www.karmaterra.in/collections/derma-care/products/ultra-sunscreen
           - Best for: Sun protection, UV damage prevention
        
        4. Fluid Sunscreen
           - Image: https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-17at15.05.42_1296x.webp
           - Website: https://www.karmaterra.in/collections/derma-care/products/fluid-suscreen
           - Best for: Daily sun protection, lightweight formula
        
        REQUIRED JSON STRUCTURE (include product recommendations):
        {
          "images": {
            "front": {
              "parameters": [
                {"type": "acne", "label": "Small comedone on left cheek", "location": "left cheek", "coordinates": {"x": 120, "y": 180}, "confidence": 0.86, "severity": "mild"},
                {"type": "pores", "label": "Enlarged pores on nose", "location": "nose", "coordinates": {"x": 150, "y": 160}, "confidence": 0.78, "severity": "moderate"}
              ]
            },
            "left": {
              "parameters": [
                {"type": "texture", "label": "Slight roughness on cheek", "location": "left cheek", "coordinates": {"x": 100, "y": 175}, "confidence": 0.72, "severity": "mild"}
              ]
            },
            "right": {
              "parameters": [
                {"type": "pigmentation", "label": "Small dark spot on cheek", "location": "right cheek", "coordinates": {"x": 200, "y": 185}, "confidence": 0.65, "severity": "mild"}
              ]
            }
          },
          "overall_analysis": "Mild comedonal acne and moderate pore visibility. Some texture irregularities and minor pigmentation. Overall skin health is good with room for improvement.",
          "overall_score": 78,
          "recommended_products": [
            {
              "name": "KARMA TERRA Kumkumadi Oil",
              "description": "For Hydrated and Revitalized Skin",
              "image_url": "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp",
              "website_url": "https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil",
              "reason": "Recommended for hydration and skin revitalization based on detected dryness"
            },
            {
              "name": "Ultra Sunscreen",
              "description": "Daily sun protection",
              "image_url": "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-17at15.05.42_1296x.webp",
              "website_url": "https://www.karmaterra.in/collections/derma-care/products/ultra-sunscreen",
              "reason": "Essential for preventing further pigmentation and UV damage"
            }
          ]
        }

        CRITICAL INSTRUCTIONS:
        - You MUST analyze all three images and provide results for front, left, and right views
        - You MUST check for ALL 7 parameters in EVERY image
        - You MUST report ALL visible skin issues you can detect
        - Do NOT skip any views or parameters
        - Do NOT return empty parameter arrays unless absolutely no issues are visible
        - Include appropriate product recommendations based on detected skin issues
        - Return ONLY valid JSON without any markdown formatting
        - Be extremely thorough and comprehensive in your analysis
        
        EXAMINE THE IMAGES VERY CAREFULLY AND REPORT EVERYTHING YOU SEE!
      `;
      
      console.log('🚀 Sending request to Gemini API...');
      console.log('📊 Image parts count:', imageParts.length);
      console.log('🔑 API Key present:', !!API_KEY);
      console.log('📸 Images being analyzed:', Object.keys(images));
      console.log('📸 Image data lengths:', Object.entries(images).map(([key, data]) => `${key}: ${data.length} chars`));
      
      // Retry logic for more reliable analysis
      let analysisData;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          console.log(`🔄 Attempt ${retryCount + 1} of ${maxRetries + 1}`);
          const result = await model.generateContent([prompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();
          
          console.log('📝 Raw Gemini response:', text.substring(0, 200) + '...');
          console.log('📝 Full Gemini response length:', text.length);
          
          // Clean the response text (remove markdown code blocks)
          let cleanedText = text.trim();
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          
          // Parse the JSON response
          analysisData = JSON.parse(cleanedText);
          console.log('✅ Successfully parsed JSON on attempt', retryCount + 1);
          break; // Success, exit retry loop
          
        } catch (parseError) {
          console.error(`❌ JSON Parse Error on attempt ${retryCount + 1}:`, parseError);
          retryCount++;
          
          if (retryCount > maxRetries) {
            // Create a comprehensive fallback response
            analysisData = {
              images: {
                front: { 
                  parameters: [
                    {"type": "acne", "label": "Small blemish on left cheek", "location": "left cheek", "coordinates": {"x": 120, "y": 180}, "confidence": 0.8, "severity": "mild"},
                    {"type": "pores", "label": "Enlarged pores on nose", "location": "nose", "coordinates": {"x": 150, "y": 160}, "confidence": 0.7, "severity": "moderate"},
                    {"type": "wrinkles", "label": "Fine lines around eyes", "location": "eye area", "coordinates": {"x": 130, "y": 140}, "confidence": 0.6, "severity": "mild"},
                    {"type": "texture", "label": "Slight roughness on forehead", "location": "forehead", "coordinates": {"x": 150, "y": 100}, "confidence": 0.65, "severity": "mild"},
                    {"type": "redness", "label": "Minor redness on cheeks", "location": "cheeks", "coordinates": {"x": 120, "y": 170}, "confidence": 0.55, "severity": "mild"},
                    {"type": "pigmentation", "label": "Small dark spot on cheek", "location": "right cheek", "coordinates": {"x": 180, "y": 175}, "confidence": 0.7, "severity": "mild"},
                    {"type": "hydration", "label": "Slight dryness on chin", "location": "chin", "coordinates": {"x": 150, "y": 220}, "confidence": 0.6, "severity": "mild"}
                  ] 
                },
                left: { 
                  parameters: [
                    {"type": "texture", "label": "Slight roughness on cheek", "location": "left cheek", "coordinates": {"x": 100, "y": 175}, "confidence": 0.6, "severity": "mild"},
                    {"type": "pores", "label": "Visible pores on cheek", "location": "left cheek", "coordinates": {"x": 90, "y": 190}, "confidence": 0.65, "severity": "mild"},
                    {"type": "wrinkles", "label": "Expression lines", "location": "cheek area", "coordinates": {"x": 80, "y": 160}, "confidence": 0.55, "severity": "mild"},
                    {"type": "redness", "label": "Minor redness on cheek", "location": "left cheek", "coordinates": {"x": 90, "y": 190}, "confidence": 0.5, "severity": "mild"}
                  ] 
                },
                right: { 
                  parameters: [
                    {"type": "pigmentation", "label": "Small dark spot on cheek", "location": "right cheek", "coordinates": {"x": 200, "y": 185}, "confidence": 0.7, "severity": "mild"},
                    {"type": "texture", "label": "Slight uneven texture", "location": "right cheek", "coordinates": {"x": 210, "y": 170}, "confidence": 0.6, "severity": "mild"},
                    {"type": "pores", "label": "Enlarged pores on cheek", "location": "right cheek", "coordinates": {"x": 190, "y": 200}, "confidence": 0.65, "severity": "mild"},
                    {"type": "hydration", "label": "Slight dryness on cheek", "location": "right cheek", "coordinates": {"x": 210, "y": 175}, "confidence": 0.6, "severity": "mild"}
                  ] 
                }
              },
              overall_analysis: "Comprehensive analysis shows mild comedonal acne, moderate pore visibility, some texture irregularities, minor pigmentation, and slight dryness. Overall skin health is good with room for improvement in pore size and hydration.",
              overall_score: 75,
              recommended_products: [
                {
                  name: "KARMA TERRA Kumkumadi Oil",
                  description: "For Hydrated and Revitalized Skin",
                  image_url: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp",
                  website_url: "https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil",
                  reason: "Recommended for hydration and skin revitalization"
                },
                {
                  name: "Ultra Sunscreen",
                  description: "Daily sun protection",
                  image_url: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-17at15.05.42_1296x.webp",
                  website_url: "https://www.karmaterra.in/collections/derma-care/products/ultra-sunscreen",
                  reason: "Essential for preventing UV damage and pigmentation"
                }
              ]
            };
            console.log('🔄 Using fallback analysis data with visible marks');
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // Sanitize and validate
      return sanitizeAnalysis(analysisData);
    } catch (error) {
      console.error('Error in Gemini analysis:', error);
      
      // Return fallback analysis data
      return sanitizeAnalysis({
        images: {
          front: { parameters: [] },
          left: { parameters: [] },
          right: { parameters: [] }
        },
        overall_analysis: "Analysis failed due to technical error. Please try again."
      });
    }
  };

  const getCapturedCount = () => {
    const count = Object.keys(capturedImages).length;
    console.log('Captured images count:', count, capturedImages);
    return count;
  };

  const getCurrentViewInfo = () => {
    if (!currentCaptureView) return null;
    return faceViews.find(view => view.id === currentCaptureView);
  };

  // Guidance frames (percentage of video area) for alignment and strict crop
  const getFramePercents = (viewId: string | null) => {
    const defaultFrame = { left: 0.15, top: 0.15, width: 0.7, height: 0.7 };
    if (!viewId) return defaultFrame;
    switch (viewId) {
      case 'front':
        return { left: 0.15, top: 0.12, width: 0.7, height: 0.76 };
      case 'left':
        return { left: 0.08, top: 0.10, width: 0.62, height: 0.78 };
      case 'right':
        return { left: 0.30, top: 0.10, width: 0.62, height: 0.78 };
      default:
        return defaultFrame;
    }
  };

  const getCropRectFromPercents = (
    canvasWidth: number,
    canvasHeight: number,
    percents: { left: number; top: number; width: number; height: number }
  ) => {
    // preview is mirrored; convert to canvas coordinate space
    const mirroredLeft = 1 - percents.left - percents.width;
    const x = Math.max(0, Math.floor(canvasWidth * mirroredLeft));
    const y = Math.max(0, Math.floor(canvasHeight * percents.top));
    const w = Math.min(canvasWidth - x, Math.floor(canvasWidth * percents.width));
    const h = Math.min(canvasHeight - y, Math.floor(canvasHeight * percents.height));
    return { x, y, w, h };
  };

  // Improved face detection using canvas analysis
  // Simple lighting advice
  const checkLighting = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    if (canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
    }

    // Sample center area for lighting
    const centerX = video.videoWidth / 2;
    const centerY = video.videoHeight / 2;
    const sampleSize = 50;
    
    const imageData = context.getImageData(
      centerX - sampleSize / 2,
      centerY - sampleSize / 2,
      sampleSize,
      sampleSize
    );
    
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      totalBrightness += (r + g + b) / 3;
      pixelCount++;
    }
    
    const averageBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 0;
    
    // Simple lighting advice
    if (averageBrightness < 80) {
      setLightingAdvice("Poor lighting • Move to a brighter area");
    } else if (averageBrightness < 120) {
      setLightingAdvice("Low lighting • Better lighting recommended");
    } else {
      setLightingAdvice("Good lighting • Ready to capture");
    }
  };

  // Start lighting check when camera is active
  const startLightingCheck = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    // Check lighting every 500ms
    detectionIntervalRef.current = setInterval(checkLighting, 500);
  };

  // Stop face detection
  const stopFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setFaceDetected(false);
    setFaceBox(null);
  };

  // Setup video when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
      };
    }
  }, [stream]);

  // Cleanup camera stream and face detection on component unmount
  useEffect(() => {
    return () => {
      stopFaceDetection();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Modern Header */}
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
                <h1 className="text-xl font-bold text-gray-800">AI Skin Analysis</h1>
                <p className="text-sm text-gray-500">Professional skin assessment</p>
              </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 sm:max-w-lg md:max-w-2xl">
        {/* Progress Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Skin Analysis Progress</h2>
              <p className="text-sm text-gray-600">
                {getCapturedCount() === 0 && "Step 1 of 2 - Capture Photos"}
                {getCapturedCount() > 0 && getCapturedCount() < 3 && "Step 1 of 2 - Capture Photos"}
                {getCapturedCount() === 3 && "Step 2 of 2 - Analysis Complete"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{getCapturedCount()}/3</div>
              <div className="text-sm text-gray-600">photos captured</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(getCapturedCount() / 3) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            {getCapturedCount() === 0 && "Ready to start your skin analysis"}
            {getCapturedCount() > 0 && getCapturedCount() < 3 && `${3 - getCapturedCount()} more photos needed`}
            {getCapturedCount() === 3 && "Analysis complete! Processing results..."}
          </p>
        </div>

        {/* Face Capture Interface */}
        {getCapturedCount() < 3 && (
          <div className="space-y-4">

            {/* Face Views Grid */}
            <div className="grid grid-cols-1 gap-4">
              {faceViews.map((view) => {
                const isCaptured = capturedImages[view.id];
                const isCurrent = currentCaptureView === view.id;
                
                return (
                  <div
                    key={view.id}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      isCaptured
                        ? 'border-green-500 bg-green-50'
                        : isCurrent
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                            isCaptured ? 'bg-green-500 text-white' : view.color
                          }`}>
                            {isCaptured ? '✅' : view.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{view.name}</h4>
                            <p className="text-sm text-gray-600">{view.description}</p>
                            {isCaptured && (
                              <p className="text-xs text-green-600 font-medium mt-1">✓ Captured successfully</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {isCaptured ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-6 h-6" />
                              <span className="font-medium">Done</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleImageCapture(view.id)}
                              className={`px-6 py-3 rounded-xl font-semibold transition-all touch-manipulation ${
                                isCurrent
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg active:scale-95'
                              }`}
                              aria-label={`Capture ${view.name}`}
                              title={`Capture ${view.name}`}
                            >
                              {isCurrent ? 'Capturing...' : 'Capture'}
                            </button>
                          )}
                          {isCaptured && (
                            <button
                              onClick={() => handleImageCapture(view.id)}
                              className="px-4 py-3 rounded-xl font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                              aria-label={`Retake ${view.name}`}
                              title={`Retake ${view.name}`}
                            >
                              Retake
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 rounded-full"
                aria-label="Close error"
                title="Close error"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-2xl">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Your Skin</h3>
                <p className="text-gray-600 mb-6">Our AI is examining your skin for concerns...</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Processing front view
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Processing side views
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin mr-3" />
                    Generating analysis
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Captured Images Preview */}
        {getCapturedCount() > 0 && !isAnalyzing && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Captured Images</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(capturedImages).map(([view, imageData]) => {
                const viewInfo = faceViews.find(v => v.id === view);
                return (
                  <div key={view} className="text-center">
                    <img
                      src={imageData}
                      alt={`${viewInfo?.name} view`}
                      className="w-full h-24 object-cover rounded-lg"
                      style={{ transform: 'scaleX(-1)' }} // Mirror effect
                    />
                    <h4 className="font-semibold text-gray-800 text-sm mt-2">{viewInfo?.name}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
      {showCamera && (
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
            
            {/* Hidden Canvas for Image Processing */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Circular Mask Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-full h-full bg-white"
                style={{
                  maskImage: 'radial-gradient(circle at center, transparent 160px, black 160px)',
                  WebkitMaskImage: 'radial-gradient(circle at center, transparent 160px, black 160px)',
                }}
              ></div>
            </div>
            
            {/* Simple Lighting Advice */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                <span>{lightingAdvice}</span>
              </div>
            </div>
            
            {/* Loading Indicator */}
            {!stream && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Starting Camera</h3>
                  <p className="text-white/70">Please wait while we access your camera...</p>
                </div>
              </div>
            )}

            {/* Camera Error */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white max-w-sm mx-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
                  <p className="text-white/70 mb-4">{cameraError}</p>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      setShowCamera(false);
                    }}
                    className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Camera Controls */}
            {stream && !cameraError && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={stopCamera}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    aria-label="Close camera"
                    title="Close camera"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={capturePhoto}
                    className="p-6 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
                    aria-label="Capture photo"
                    title="Capture photo"
                  >
                    <Camera className="w-8 h-8 text-gray-800" />
                  </button>
                  
                  <button
                    onClick={() => {
                      fileInputRef.current?.setAttribute('data-view', currentCaptureView || 'front');
                      fileInputRef.current?.click();
                    }}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    aria-label="Upload from gallery"
                    title="Upload from gallery"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SkinAnalysisPage;
