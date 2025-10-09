import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MarketPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
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
              <h1 className="text-xl font-bold text-gray-800">Karma Terra Store</h1>
              <p className="text-sm text-gray-500">Official Website</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Web View */}
      <div className="h-screen">
        <iframe
          src="https://www.karmaterra.in/"
          className="w-full h-full border-0"
          title="Karma Terra Store"
          allow="payment; camera; microphone; geolocation"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
};

export default MarketPage;
