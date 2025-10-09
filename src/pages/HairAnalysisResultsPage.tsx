import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Share2, RotateCcw, ExternalLink } from "lucide-react";

const HairAnalysisResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [capturedImages, setCapturedImages] = useState<{[key: string]: string}>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (location.state?.analysisResult) {
      setAnalysisData(location.state.analysisResult);
      setCapturedImages(location.state.capturedImages || {});
    } else {
      // Fallback: try to get from localStorage
      const history = JSON.parse(localStorage.getItem('hairAnalysisHistory') || '[]');
      if (history.length > 0) {
        setAnalysisData(history[0].analysisResult);
        setCapturedImages(history[0].capturedImages || {});
      } else {
        navigate('/hair-analysis');
      }
    }
  }, [location.state, navigate]);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Go back to results"
                title="Go back to results"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800">Product Details</h1>
                <p className="text-sm text-gray-500">{selectedProduct.name}</p>
              </div>
              <div className="w-10" />
            </div>
          </div>
        </div>

        {/* Product Web View */}
        <div className="h-screen">
          <iframe
            src={selectedProduct.website_url}
            className="w-full h-full border-0"
            title={selectedProduct.name}
            allow="payment; camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const hairParameters = [
    { id: 'density', name: 'Density', description: 'Hair density and thickness', color: '#FF6B6B' },
    { id: 'scalp', name: 'Scalp Health', description: 'Scalp condition and health', color: '#4ECDC4' },
    { id: 'texture', name: 'Texture', description: 'Hair texture and quality', color: '#45B7D1' },
    { id: 'damage', name: 'Damage', description: 'Hair damage and split ends', color: '#96CEB4' },
    { id: 'growth', name: 'Growth', description: 'Hair growth patterns', color: '#FFEAA7' },
    { id: 'hydration', name: 'Hydration', description: 'Hair moisture levels', color: '#DDA0DD' },
    { id: 'recommendations', name: 'Recommendations', description: 'Care recommendations', color: '#98D8C8' }
  ];

  const getParameterColor = (type: string) => {
    const colors = {
      density: '#FF6B6B',
      scalp: '#4ECDC4',
      texture: '#45B7D1',
      damage: '#96CEB4',
      growth: '#FFEAA7',
      hydration: '#DDA0DD',
      recommendations: '#98D8C8'
    };
    return colors[type as keyof typeof colors] || '#96CEB4';
  };

  const renderImageWithMarkings = (view: string, imageData: string, parameters: any[]) => {
    // Show all parameters since we removed the parameter selection
    console.log(`Rendering ${view} with ${parameters.length} parameters:`, parameters);

    return (
      <div className="relative inline-block w-full">
        <img
          src={imageData}
          alt={`${view} analysis`}
          className="w-full h-48 object-cover rounded-lg"
          style={{ transform: 'scaleX(-1)' }}
        />
        {parameters.map((param, index) => {
          // Convert coordinates to percentage for responsive positioning
          const xPercent = (param.coordinates.x / 300) * 100; // 300 is the original image size
          const yPercent = (param.coordinates.y / 300) * 100;
          
          console.log(`Marking ${param.type} at ${xPercent}%, ${yPercent}%`);
          
          return (
            <div
              key={`${param.type}-${index}`}
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                backgroundColor: getParameterColor(param.type),
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
              title={`${param.label} - ${param.severity} (${param.type})`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/hair-analysis')}
              aria-label="Go back to hair analysis"
              title="Go back to hair analysis"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Hair Analysis Results</h1>
              <p className="text-sm text-gray-500">Your personalized hair health report</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full ${getScoreBgColor(analysisData.overall_score || 75)} flex items-center justify-center mx-auto mb-4`}>
              <span className={`text-3xl font-bold ${getScoreColor(analysisData.overall_score || 75)}`}>
                {analysisData.overall_score || 75}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall Hair Health Score</h2>
            <p className={`text-lg font-semibold ${getScoreColor(analysisData.overall_score || 75)}`}>
              {analysisData.overall_score >= 80 && "Excellent hair health"}
              {analysisData.overall_score >= 60 && analysisData.overall_score < 80 && "Good hair health"}
              {analysisData.overall_score < 60 && "Your hair needs attention"}
            </p>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Hair Analysis</h3>
          
          {/* Comprehensive Hair Description */}
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-800 mb-2">Hair Health Overview</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                {analysisData.overall_analysis || "Your hair analysis reveals a comprehensive assessment of your hair's current condition. Based on the detailed examination of your front, top, and side views, we've identified key areas of strength and opportunities for improvement."}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-2">Hair Structure & Quality</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                Your hair demonstrates {analysisData.overall_score >= 80 ? "excellent structural integrity" : analysisData.overall_score >= 60 ? "good structural foundation" : "areas requiring structural attention"}. 
                The analysis shows your hair's density, texture, and growth patterns, providing insights into your unique hair characteristics and care needs.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-gray-800 mb-2">Scalp & Root Health</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                Your scalp health analysis indicates {analysisData.overall_score >= 80 ? "optimal conditions for hair growth" : analysisData.overall_score >= 60 ? "good scalp health with minor areas for improvement" : "scalp conditions that benefit from targeted care"}. 
                This foundation is crucial for maintaining healthy hair growth and preventing future issues.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-2">Care Recommendations</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                Based on your analysis, we recommend focusing on {analysisData.overall_score >= 80 ? "maintaining your excellent hair health through consistent care" : analysisData.overall_score >= 60 ? "addressing specific areas while maintaining your current routine" : "implementing a comprehensive hair care regimen to address identified concerns"}. 
                The detailed findings below will guide your personalized hair care journey.
              </p>
            </div>
          </div>
          
          {/* Parameter Summary */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Detected Issues Summary:</h4>
            <div className="flex flex-wrap gap-2">
              {hairParameters.map((param) => {
                const count = Object.values(analysisData.images || {}).reduce((total: number, viewData: any) => {
                  return total + (viewData.parameters?.filter((p: any) => p.type === param.id).length || 0);
                }, 0);
                
                if (count > 0) {
                  return (
                    <div key={param.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: param.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{param.name}</span>
                      <span className="text-xs text-gray-500">({count})</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>


        {/* Detailed Results by View */}
        <div className="space-y-4 mb-6">
          {Object.entries(analysisData.images || {}).map(([view, data]: [string, any]) => {
            const viewNames = {
              front: 'Front View',
              top: 'Top View',
              side: 'Side View'
            };
            
            return (
              <div key={view} className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-800 mb-4">{viewNames[view as keyof typeof viewNames]}</h4>
                
                {/* Image with markings */}
                {capturedImages[view] && (
                  <div className="mb-4">
                    {renderImageWithMarkings(view, capturedImages[view], data.parameters || [])}
                    
                    {/* Debug info - show all detected parameters */}
                    <div className="mt-2 text-xs text-gray-500">
                      Detected: {data.parameters?.length || 0} issues
                      {data.parameters?.map((p: any, idx: number) => (
                        <span key={idx} className="ml-2">
                          <span 
                            className="inline-block w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: getParameterColor(p.type) }}
                          />
                          {p.type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(() => {
                  const allParams = data.parameters || [];

                  if (allParams.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <p>No issues detected for this view</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {allParams.map((param: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-4 h-4 rounded-full mt-1"
                              style={{ backgroundColor: getParameterColor(param.type) }}
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">{param.label}</h5>
                              <p className="text-sm text-gray-600 mb-2">{param.location}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  param.severity === 'mild' ? 'bg-yellow-100 text-yellow-800' :
                                  param.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {param.severity}
                                </span>
                                <span className="text-gray-500">
                                  Confidence: {Math.round(param.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {/* Product Recommendations */}
        {(() => {
          const products = analysisData.recommended_products || [
            {
              name: "Karma Terra Hair Treatment Oil 100ML",
              description: "Get Rid of dandruff and itchiness With new Hair Growth",
              image_url: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/61PGBlrh_vL._SX466_1296x.jpg",
              website_url: "https://www.karmaterra.in/collections/hair-care/products/karma-terra-hair-treatment-oil-100ml-copy",
              reason: "Powerful fusion of 5X Ayurvedic herb extracts and pure coconut oil for holistic hair care"
            }
          ];
          
          return products.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Products</h3>
            <div className="space-y-4">
              {products.map((product: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Product';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-xs text-gray-500 mb-3">{product.reason}</p>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}


        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/hair-analysis')}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
            aria-label="Start new hair analysis"
            title="Start new hair analysis"
          >
            <RotateCcw className="w-4 h-4" />
            New Analysis
          </button>
          <button
            onClick={() => navigate('/ingredients')}
            className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            aria-label="View hair care products"
            title="View hair care products"
          >
            <ExternalLink className="w-4 h-4" />
            Shop Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default HairAnalysisResultsPage;