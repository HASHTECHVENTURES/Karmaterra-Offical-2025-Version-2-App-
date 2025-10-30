import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Report } from '@/types';
import { SKIN_PARAMETERS } from '@/lib/constants';
import { TrendingUp, Home, Download, Loader2 } from 'lucide-react';
import { generatePDFReport } from '@/services/pdfService';

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
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.report) {
      setReport(location.state.report);
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

  const handleStartNew = () => {
    navigate('/know-your-skin');
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    
    setIsDownloading(true);
    try {
      await generatePDFReport(report);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-teal-600">Your Skin Analysis Report</h1>
                  <p className="text-slate-500 mt-1">For: {userData.name} | Generated on: {date}</p>
              </div>
              <button onClick={() => navigate('/')} className="text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-full hover:bg-slate-300 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
              </button>
          </div>
        </header>

        {/* Overall Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Overall Summary</h2>
          <div className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-4 ${getSeverityColor(result.overallSeverity)}`}>
            Overall Concern: {result.overallSeverity}
          </div>
          <p className="text-slate-600 leading-relaxed">{result.summary}</p>
        </div>

        {/* Captured Images */}
        {faceImages && faceImages.length === 3 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Images Used for Analysis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {faceImages.map((image, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={image} 
                      alt={['Front Face', 'Right Side', 'Left Side'][index]} 
                      className="rounded-lg shadow-md border border-slate-200 aspect-square object-cover w-full" 
                    />
                    <p className="text-sm font-semibold text-slate-600 mt-2">
                      {['Front Face', 'Right Side', 'Left Side'][index]}
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
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${getRatingColor(paramData.rating)}`} style={{ width: `${paramData.rating * 10}%` }}></div>
                    </div>
                    <span className="font-bold text-slate-800 w-8 text-right">{paramData.rating}/10</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{paramData.description}</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
            <button 
              onClick={() => navigate('/progress-tracking')} 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Track Progress
            </button>
            <button 
              onClick={handleStartNew} 
              className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-600 transition-all transform hover:scale-105"
            >
              Start New Analysis
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Download your report as PDF to share with doctors or track your skin improvements over time
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSkinAnalysisResultsPage;
