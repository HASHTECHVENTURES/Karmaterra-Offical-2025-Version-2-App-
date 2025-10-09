import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Share2, RotateCcw, ExternalLink } from "lucide-react";

const SkinAnalysisResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [capturedImages, setCapturedImages] = useState<{[key: string]: string}>({});
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    if (location.state?.analysisResult) {
      setAnalysisData(location.state.analysisResult);
      setCapturedImages(location.state.capturedImages || {});
    } else {
      // Fallback: try to get from localStorage
      const history = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
      if (history.length > 0) {
        setAnalysisData(history[0].analysisResult);
        setCapturedImages(history[0].capturedImages || {});
      } else {
        navigate('/skin-analysis');
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

  const skinParameters = [
    { id: 'acne', name: 'Acne', description: 'Blackheads and whiteheads', color: '#FF6B6B' },
    { id: 'pores', name: 'Pores', description: 'Pore visibility and size', color: '#4ECDC4' },
    { id: 'wrinkles', name: 'Wrinkles', description: 'Fine lines and deeper wrinkles', color: '#45B7D1' },
    { id: 'texture', name: 'Texture', description: 'Skin smoothness or roughness', color: '#96CEB4' },
    { id: 'redness', name: 'Redness', description: 'Areas of irritation or uneven tone', color: '#FFEAA7' },
    { id: 'pigmentation', name: 'Pigmentation', description: 'Dark spots, dark circles, and overall evenness', color: '#DDA0DD' },
    { id: 'hydration', name: 'Hydration', description: 'Moisture levels', color: '#98D8C8' }
  ];

  const getParameterColor = (type: string) => {
    const colors = {
      acne: '#FF6B6B',
      pores: '#4ECDC4',
      wrinkles: '#45B7D1',
      texture: '#96CEB4',
      redness: '#FFEAA7',
      pigmentation: '#DDA0DD',
      hydration: '#98D8C8'
    };
    return colors[type as keyof typeof colors] || '#96CEB4';
  };

  const renderImageWithMarkings = (view: string, imageData: string, parameters: any[]) => {
    // Filter parameters based on selected parameter
    const filteredParameters = selectedParameter 
      ? parameters.filter(param => param.type === selectedParameter)
      : parameters;

    console.log(`Rendering ${view} with ${filteredParameters.length} parameters:`, filteredParameters);

    return (
      <div className="relative inline-block w-full">
        <img
          src={imageData}
          alt={`${view} analysis`}
          className="w-full h-48 object-cover rounded-lg"
          style={{ transform: 'scaleX(-1)' }}
        />
        {filteredParameters.map((param, index) => {
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
              onClick={() => navigate('/skin-analysis')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Analysis Results</h1>
              <p className="text-sm text-gray-500">Your skin assessment</p>
          </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full ${getScoreBgColor(analysisData.overall_score)} flex items-center justify-center mx-auto mb-4`}>
              <span className={`text-3xl font-bold ${getScoreColor(analysisData.overall_score)}`}>
                {analysisData.overall_score}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall Skin Score</h2>
            <p className="text-gray-600 text-sm">
              {analysisData.overall_score >= 80 && "Excellent skin health!"}
              {analysisData.overall_score >= 60 && analysisData.overall_score < 80 && "Good skin with room for improvement"}
              {analysisData.overall_score < 60 && "Your skin needs attention"}
            </p>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Summary</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {analysisData.overall_analysis}
          </p>
          
          {/* Parameter Summary */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Detected Issues Summary:</h4>
            <div className="flex flex-wrap gap-2">
              {skinParameters.map((param) => {
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

        {/* Parameter Selection Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Select Parameter to View</h3>
          <div className="grid grid-cols-2 gap-3">
            {skinParameters.map((param) => {
              const isSelected = selectedParameter === param.id;
              const hasData = analysisData.images && Object.values(analysisData.images).some((viewData: any) => 
                viewData.parameters && viewData.parameters.some((p: any) => p.type === param.id)
              );
              
              return (
                  <button
                  key={param.id}
                    onClick={() => setSelectedParameter(isSelected ? null : param.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : hasData 
                          ? 'border-gray-200 bg-white hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50 opacity-50'
                    }`}
                    disabled={!hasData}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${param.name} parameter`}
                    title={`${isSelected ? 'Deselect' : 'Select'} ${param.name} parameter`}
                  >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: param.color }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{param.name}</h4>
                      <p className="text-xs text-gray-600">{param.description}</p>
                  </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            {selectedParameter ? (
              <div className="flex-1 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Showing only <strong>{skinParameters.find(p => p.id === selectedParameter)?.name}</strong> markers on images
                </p>
              </div>
            ) : (
              <div className="flex-1 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Showing <strong>all detected issues</strong> on images
                </p>
              </div>
            )}
            <button
              onClick={() => setSelectedParameter(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Show All
            </button>
          </div>
        </div>

        {/* Detailed Results by View */}
        <div className="space-y-4 mb-6">
          {Object.entries(analysisData.images || {}).map(([view, data]: [string, any]) => {
            const viewNames = {
              front: 'Front View',
              left: 'Left Side',
              right: 'Right Side'
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
                  const filteredParams = selectedParameter 
                    ? data.parameters?.filter((param: any) => param.type === selectedParameter) || []
                    : data.parameters || [];
                  
                  return filteredParams.length > 0 ? (
                      <div className="space-y-3">
                      {filteredParams.map((param: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div 
                            className="w-3 h-3 rounded-full mt-1.5"
                            style={{ backgroundColor: getParameterColor(param.type) }}
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 capitalize">{param.label}</h5>
                            <p className="text-sm text-gray-600">
                              Location: {param.location} • Confidence: {Math.round(param.confidence * 100)}% • Severity: {param.severity}
                            </p>
                          </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      {selectedParameter 
                        ? `No ${skinParameters.find(p => p.id === selectedParameter)?.name.toLowerCase()} detected in this view`
                        : 'No significant concerns detected in this view'
                      }
                    </p>
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
              name: "KARMA TERRA Kumkumadi Oil",
              description: "For Hydrated and Revitalized Skin",
              image_url: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp",
              website_url: "https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil",
              reason: "Recommended for overall skin health and hydration"
            },
            {
              name: "Ultra Sunscreen",
              description: "Daily sun protection",
              image_url: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-17at15.05.42_1296x.webp",
              website_url: "https://www.karmaterra.in/collections/derma-care/products/ultra-sunscreen",
              reason: "Essential for preventing UV damage and maintaining healthy skin"
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
        <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate('/skin-analysis')}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              aria-label="Start new skin analysis"
              title="Start new skin analysis"
            >
            <RotateCcw className="w-5 h-5" />
            New Analysis
          </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              aria-label="Go back to home page"
              title="Go back to home page"
            >
              Back to Home
            </button>
          </div>
      </div>
    </div>
  );
};

export default SkinAnalysisResultsPage;
