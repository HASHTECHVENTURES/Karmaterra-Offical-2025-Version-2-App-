import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Report } from '../types';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { HairAnalysisResult } from '../services/geminiService';
import { AndroidPageHeader } from '../components/AndroidBackButton';

const getSeverityColor = (severity: 'Mild' | 'Medium' | 'Severe' | 'N/A') => {
  switch (severity) {
    case 'Mild': return 'bg-green-100 text-green-700 border-green-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'Severe': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getRatingColor = (rating: number) => {
  if (rating <= 3) return 'bg-green-500';
  if (rating <= 6) return 'bg-yellow-500';
  if (rating <= 8) return 'bg-orange-500';
  return 'bg-red-500';
};

const HairAnalysisResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [fullHairResult, setFullHairResult] = useState<HairAnalysisResult | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (location.state && location.state.report) {
      setReport(location.state.report);
      if (location.state.fullHairResult) {
        setFullHairResult(location.state.fullHairResult);
      }
    } else {
      navigate('/hair-analysis');
    }
  }, [location.state, navigate]);

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading report...</p>
      </div>
    );
  }

  const { result, userData, date } = report;

  const handleStartNew = () => {
    navigate('/hair-analysis');
  };

  // Hair analysis categories
  const hairCategories = [
    'Hair Density and Thickness',
    'Scalp Health',
    'Hair Texture',
    'Potential Issues',
    'Growth Patterns',
    'Recommendations'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Android Material Design Header */}
      <AndroidPageHeader
        title="Hair Analysis Report"
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

        {/* Detailed Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Detailed Analysis</h2>
          <div className="space-y-5">
            {result.parameters.map(paramData => {
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Recommended Hair Care Routine</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">☀️ Morning Routine</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {result.routine.morning.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">🌙 Evening Routine</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {result.routine.evening.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Product */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-800">Recommended Product for You</h2>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src="https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/61PGBlrh_vL._SX466_1296x.jpg" 
                  alt="KARMA TERRA Hair Treatment Oil"
                  className="w-full h-64 md:h-full object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Product Details */}
              <div className="md:w-2/3 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800">KARMA TERRA Hair Treatment Oil 100ML</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      Perfect Match
                    </span>
                  </div>
                  
                  <p className="text-sm text-purple-700 font-medium mb-3">Get Rid of Dandruff and Itchiness With New Hair Growth</p>
                  
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    Powerful fusion of 5X Ayurvedic herb extracts and pure coconut oil for holistic hair care. This treatment oil helps combat dandruff, reduce itchiness, and promote healthy hair growth.
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-slate-800 text-sm">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Reduces dandruff & itchiness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Promotes hair growth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Nourishes scalp & roots</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>5X Ayurvedic herb extracts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Pure coconut oil base</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>100% natural ingredients</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold">Special Formulation:</span> This powerful blend combines natural oils and revered herbs like amla, bhringraj, and neem extracts, embodying Ayurvedic goodness for healthy, strong hair.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href="https://www.karmaterra.in/collections/hair-care/products/karma-terra-hair-treatment-oil-100ml-copy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center font-bold py-3 px-6 rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
                  >
                    Shop Now
                  </a>
                  <a 
                    href="https://www.karmaterra.in/collections/hair-care/products/karma-terra-hair-treatment-oil-100ml-copy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-purple-500 text-purple-700 font-semibold py-3 px-6 rounded-full hover:bg-purple-50 transition-all"
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
            className="bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-600 transition-all transform hover:scale-105"
          >
            Start New Analysis
          </button>
        </div>

        {/* Collapsible AI Disclaimer */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="w-full p-4 flex items-center justify-between hover:bg-purple-100 transition-colors min-h-[48px] text-left"
            aria-label={showDisclaimer ? "Hide disclaimer" : "Show disclaimer"}
            aria-expanded={showDisclaimer}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <h3 className="font-semibold text-purple-900">AI Analysis Disclaimer</h3>
            </div>
            {showDisclaimer ? (
              <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
            )}
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDisclaimer ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-purple-900 leading-relaxed">
                This AI-powered hair analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. The analysis is based on images and questionnaire responses and may not be 100% accurate. Always consult with a qualified dermatologist or healthcare provider for hair concerns or before making significant changes to your haircare routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairAnalysisResultsPage;
