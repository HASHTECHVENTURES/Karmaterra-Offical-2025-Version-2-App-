import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useContext } from "react";

// Pages
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import KnowYourSkinPage from "./pages/services/KnowYourSkinPage";
import KnowYourHairPage from "./pages/services/KnowYourHairPage";
import IngredientsPage from "./pages/services/IngredientsPage";
import SkinAnalyzerPage from "./pages/SkinAnalyzerPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  name: string;
  pin: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (pin: string, name?: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = (pin: string, name?: string) => {
    // Simple demo login - any 4-digit PIN works
    if (pin.length === 4) {
      setUser({ 
        name: name || "Skincare Enthusiast", 
        pin,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
              <Route path="/know-your-skin" element={user ? <KnowYourSkinPage /> : <AuthPage />} />
              <Route path="/know-your-hair" element={user ? <KnowYourHairPage /> : <AuthPage />} />
              <Route path="/ingredients" element={user ? <IngredientsPage /> : <AuthPage />} />
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