import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, LoginResult, AuthContextType } from "@/types";

// Pages
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import HairAnalysisPage from "./pages/HairAnalysisPage";
import HairAnalysisResultsPage from "./pages/HairAnalysisResultsPage";
import AskKarmaPage from "./pages/AskKarmaPage";
import IngredientsPage from "./pages/services/IngredientsPage";
import KnowYourSkinPage from "./pages/services/KnowYourSkinPage";
import KnowYourHairPage from "./pages/services/KnowYourHairPage";
import MarketPage from "./pages/MarketPage";
import SkinAnalyzerPage from "./pages/SkinAnalyzerPage";
import SkinAnalysisPage from "./pages/SkinAnalysisPage";
import SkinAnalysisResultsPage from "./pages/SkinAnalysisResultsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('karma-terra-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('karma-terra-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (pin: string, name?: string): Promise<LoginResult> => {
    try {
      // PIN validation
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return { success: false, error: 'PIN must be exactly 4 digits' };
      }

      // Check if PIN exists in Supabase profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('pin', pin)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: 'Database connection error. Please try again.' };
      }

      if (!profile) {
        return { success: false, error: 'Invalid PIN. Please check your PIN and try again.' };
      }

      // Extract first name from full_name
      const firstName = profile.full_name ? profile.full_name.split(' ')[0] : "Skincare Enthusiast";
      
      // Create user object from Supabase data
      const userData: User = {
        id: profile.id,
        pin: profile.pin,
        name: firstName,
        email: profile.email,
        phone_number: profile.phone_number,
        gender: profile.gender,
        avatar: profile.avatar_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      };

      // Store user in localStorage
      localStorage.setItem('karma-terra-user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('karma-terra-user');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      console.warn('Cannot update profile: no user logged in');
      return;
    }

    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('karma-terra-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={{ user, login, signOut, updateProfile }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
              <Route path="/community" element={user ? <CommunityPage /> : <AuthPage />} />
              <Route path="/skin-analysis" element={user ? <SkinAnalysisPage /> : <AuthPage />} />
              <Route path="/skin-analysis-results" element={user ? <SkinAnalysisResultsPage /> : <AuthPage />} />
              <Route path="/hair-analysis" element={user ? <HairAnalysisPage /> : <AuthPage />} />
              <Route path="/hair-analysis-results" element={user ? <HairAnalysisResultsPage /> : <AuthPage />} />
              <Route path="/ask-karma" element={user ? <AskKarmaPage /> : <AuthPage />} />
              <Route path="/ingredients" element={user ? <IngredientsPage /> : <AuthPage />} />
              <Route path="/know-your-skin" element={user ? <KnowYourSkinPage /> : <AuthPage />} />
              <Route path="/know-your-hair" element={user ? <KnowYourHairPage /> : <AuthPage />} />
              <Route path="/market" element={user ? <MarketPage /> : <AuthPage />} />
              <Route path="/skin-analyzer" element={user ? <SkinAnalyzerPage /> : <AuthPage />} />
              <Route path="/blog/:id" element={user ? <BlogDetailPage /> : <AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;