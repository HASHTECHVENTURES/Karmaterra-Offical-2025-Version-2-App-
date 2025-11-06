import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Report } from '@/types';
import { SKIN_PARAMETERS } from '@/lib/constants';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AndroidPageHeader } from '@/components/AndroidBackButton';

const getSeverityColor = (severity: 'Mild' | 'Medium' | 'Severe' | 'N/A') => {
  switch (severity) {
    case 'Mild': return 'bg-yellow-400 text-yellow-800';
    case 'Medium': return 'bg-orange-400 text-orange-800';
    case 'Severe': return 'bg-red-500 text-red-100';
    default: return 'bg-green-400 text-green-800';
  }
};

const getRatingColor = (rating: number) => {
  if (rating <= 3) return 'bg-green-500';
  if (rating <= 6) return 'bg-yellow-500';
  if (rating <= 8) return 'bg-orange-500';
  return 'bg-red-500';
};

const EnhancedSkinAnalysisResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isDownloading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (location.state && location.state.report) {
      const reportData = location.state.report;
      console.log('📸 Report loaded:', {
        hasFaceImages: !!reportData.faceImages,
        faceImagesLength: reportData.faceImages?.length,
        faceImages: reportData.faceImages
      });
      setReport(reportData);
    } else {
      // Handle case where there is no report in state (e.g., direct navigation)
      // Maybe navigate back or show an error message
      navigate('/know-your-skin');
    }
  }, [location.state, navigate]);

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading report...</p>
      </div>
    );
  }

  const { result, userData, date, faceImages } = report;
  
  // Debug: Log faceImages
  console.log('📸 Displaying images:', {
    faceImages,
    length: faceImages?.length,
    isArray: Array.isArray(faceImages)
  });

  const handleStartNew = () => {
    navigate('/know-your-skin');
  };

  // PDF download removed per request

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Android Material Design Header */}
      <AndroidPageHeader
        title="Skin Analysis Report"
        subtitle={`For: ${userData.name} | ${date}`}
        onBack={() => navigate(-1)}
      />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">

        {/* Overall Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Overall Summary</h2>
          <div className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-4 ${getSeverityColor(result.overallSeverity)}`}>
            Overall Concern: {result.overallSeverity}
          </div>
          <p className="text-slate-600 leading-relaxed">{result.summary}</p>
        </div>

        {/* Captured Images */}
        {faceImages && faceImages.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Images Used for Analysis</h2>
              <div className={`grid grid-cols-1 ${faceImages.length === 1 ? 'sm:grid-cols-1 max-w-md mx-auto' : faceImages.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-4`}>
                {faceImages.map((image, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={image} 
                      alt={['Front Face', 'Right Side', 'Left Side'][index] || `Image ${index + 1}`} 
                      className="rounded-lg shadow-md border border-slate-200 aspect-square object-cover w-full" 
                      onError={(e) => {
                        console.error('Image failed to load:', image);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <p className="text-sm font-semibold text-slate-600 mt-2">
                      {['Front Face', 'Right Side', 'Left Side'][index] || `Image ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* Detailed Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Detailed Analysis</h2>
          <div className="space-y-5">
            {SKIN_PARAMETERS.map(paramName => {
              const paramData = result.parameters.find(p => p.category === paramName);
              if (!paramData) return null;
              return (
                <div key={paramData.category}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-slate-700">{paramData.category}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getSeverityColor(paramData.severity)}`}>
                      {paramData.severity}
                    </span>
                  </div>
                  {paramData.category === 'Skin Type' ? (
                    <div className="mt-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {paramData.description?.match(/dry|oily|normal|combination/i)?.[0]?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || '—'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${getRatingColor(paramData.rating)}`} style={{ width: `${paramData.rating * 10}%` }}></div>
                        </div>
                        <span className="font-bold text-slate-800 w-8 text-right">{paramData.rating}/10</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{paramData.description}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recommended Routine */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Recommended Routine</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-600 mb-2">☀️ Morning Routine</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {result.routine.morning.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-teal-600 mb-2">🌙 Evening Routine</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {result.routine.evening.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Product */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-lg border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-800">Recommended Product for You</h2>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src="https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp" 
                  alt="KARMA TERRA Kumkumadi Oil"
                  className="w-full h-64 md:h-full object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Product Details */}
              <div className="md:w-2/3 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800">KARMA TERRA Kumkumadi Oil</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      Perfect Match
                    </span>
                  </div>
                  
                  <p className="text-sm text-amber-700 font-medium mb-3">For Hydrated and Revitalized Skin</p>
                  
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    Introducing our luxurious Karma Terra Kumkumadi Facial Oil, a meticulously crafted Ayurvedic blend designed to deeply hydrate and revitalize your skin. Particularly beneficial for dry to normal skin types, this facial oil is rooted in ancient Ayurvedic wisdom.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-slate-800 text-sm">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Profound hydration & moisturization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Powerful anti-aging treatment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Reduces fine lines & repairs damage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Brightens & evens complexion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Minimizes dark spots & pigmentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>100% cruelty-free & Made in India</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold">Special Formulation:</span> This luxurious blend combines natural oils and revered herbs like saffron and Orange extracts, embodying Ayurvedic goodness for remarkably bright and spotless skin.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href="https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center font-bold py-3 px-6 rounded-full shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105"
                  >
                    Shop Now
                  </a>
                  <a 
                    href="https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-amber-500 text-amber-700 font-semibold py-3 px-6 rounded-full hover:bg-amber-50 transition-all"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 space-y-4">
          <button 
            onClick={handleStartNew} 
            className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-600 transition-all transform hover:scale-105"
          >
            Start New Analysis
          </button>
        </div>

        {/* Collapsible AI Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="w-full p-4 flex items-center justify-between hover:bg-amber-100 transition-colors min-h-[48px] text-left"
            aria-label={showDisclaimer ? "Hide disclaimer" : "Show disclaimer"}
            aria-expanded={showDisclaimer}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <h3 className="font-semibold text-amber-900">AI Analysis Disclaimer</h3>
            </div>
            {showDisclaimer ? (
              <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600 flex-shrink-0" />
            )}
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDisclaimer ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-amber-900 leading-relaxed">
                This AI-powered skin analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. The analysis is based on images and questionnaire responses and may not be 100% accurate. Always consult with a qualified dermatologist or healthcare provider for skin concerns or before making significant changes to your skincare routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSkinAnalysisResultsPage;
