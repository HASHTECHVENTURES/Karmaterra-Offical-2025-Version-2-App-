import { useState } from "react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const result = await login(pin, isSignUp ? name.trim() : undefined);

      if (result.success) {
        toast({
          title: isSignUp ? "Account Created!" : "Welcome Back!",
          description: "Your personalized skincare journey begins now"
        });
      } else {
        toast({
          title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
          description: result.error || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-4 safe-area-all">
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white border-2 border-green-200 rounded-xl flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/223eca30-a4ce-4252-8a09-b59de0313219.png" 
              alt="Karma Terra Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-sm">
            {isSignUp ? "Sign up for your KarmaTerra account" : "Sign in to your KarmaTerra account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Name *
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
              />
            </div>
          )}

          {/* PIN Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              4-Digit PIN *
            </label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                placeholder="1234"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg text-center text-lg tracking-widest focus:border-green-500 focus:ring-green-500"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PIN must be exactly 4 digits (numbers only). This will be your secure login method.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </div>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span className="font-medium">{isSignUp ? "Sign in" : "Sign up"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;