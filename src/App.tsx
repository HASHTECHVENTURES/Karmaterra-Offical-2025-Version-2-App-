import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/config";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { User, LoginResult, AuthContextType } from "@/types";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";

// Pages
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import HairAnalysisPage from "./pages/HairAnalysisPage";
import HairAnalysisResultsPage from "./pages/HairAnalysisResultsPage";
import AskKarmaPage from "./pages/AskKarmaPage";
import IngredientsPage from "./pages/services/IngredientsPage";
import KnowYourHairPage from "./pages/services/KnowYourHairPage";
import MarketPage from "./pages/MarketPage";
// Removed old Enhanced Skin Analysis pages
import ProgressTrackingPage from "./pages/ProgressTrackingPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";
import KnowYourSkinPage from "./pages/services/KnowYourSkinPage";
import EnhancedSkinAnalysisResultsPage from "./pages/EnhancedSkinAnalysisResultsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const queryClient = new QueryClient();

// Component to handle Android back button
const AndroidBackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only handle back button on Android
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    const handleBackButton = () => {
      // Pages that should navigate to home instead of exiting
      const servicePages = [
        '/know-your-skin',
        '/know-your-hair',
        '/hair-analysis',
        '/skin-analysis-results',
        '/hair-analysis-results',
        '/ingredients',
        '/ask-karma',
        '/progress-tracking',
        '/blogs',
        '/market',
        '/profile',
        '/community',
        '/terms',
        '/privacy'
      ];

      // Check if we're on a service page
      const isServicePage = servicePages.some(path => 
        location.pathname === path || location.pathname.startsWith(path + '/')
      );
      
      // Check if we're on home page or auth page
      const isHomePage = location.pathname === '/' || location.pathname === '/auth';
      
      // If we're on a service page, navigate back to home
      if (isServicePage) {
        navigate('/');
        return;
      }
      
      // If we're on home or auth page, exit the app
      if (isHomePage) {
        CapacitorApp.exitApp();
        return;
      }
      
      // For other pages (like blog detail), try to go back in history
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
      
      // If no history, go to home
      navigate('/');
    };

    // Register the back button listener
    // Note: Adding a listener automatically prevents default exit behavior
    // We handle navigation manually and explicitly exit on home page
    const listener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      // Cleanup listener on unmount
      listener.remove();
    };
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
};

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
    // Check for stored user session using safe storage wrapper
    const storedUser = storage.get('karma-terra-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        // Invalid JSON, clear it
        storage.remove('karma-terra-user');
      }
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    // Configure Android status bar to overlay the WebView and respect safe areas
    const configureStatusBar = async () => {
      try {
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.setBackgroundColor({ color: '#22c55e' });
          await StatusBar.setStyle({ style: Style.Light });
        }
      } catch (err) {
        // Non-fatal if plugin not available in web/dev
        console.warn('StatusBar configuration skipped:', err);
      }
    };
    configureStatusBar();
  }, []);

  const login = async (pin: string, phone_number: string, name?: string, email?: string, gender?: string, birthdate?: string, country?: string, state?: string, city?: string, isSignUpMode?: boolean): Promise<LoginResult> => {
    try {
      // Phone number validation
      if (!phone_number || !phone_number.trim()) {
        return { success: false, error: 'Phone number is required' };
      }

      // PIN validation
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return { success: false, error: 'PIN must be exactly 4 digits (numbers only)' };
      }

      // Check if phone number exists in Supabase profiles table
      const { data: profile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone_number.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Supabase check error:', checkError);
        return { success: false, error: 'Database connection error. Please try again.' };
      }

      // Check if this is a signup attempt (explicitly passed or has all required signup fields)
      const isSignupAttempt = isSignUpMode !== undefined ? isSignUpMode : (name && email && gender && birthdate && country && state && city);

      // If profile doesn't exist and we have signup data, create new user
      if (!profile && isSignupAttempt) {
        // Ensure PIN is a string and exactly 4 digits (no padding, must be exactly 4)
        const formattedPin = String(pin).trim();
        
        // Validate PIN again before insertion
        if (formattedPin.length !== 4 || !/^\d{4}$/.test(formattedPin)) {
          console.error('PIN validation failed before insertion:', { pin, formattedPin, length: formattedPin.length });
          return { success: false, error: 'Invalid PIN format. Please enter exactly 4 digits.' };
        }

        // Convert birthdate from DD/MM/YYYY to YYYY-MM-DD format for PostgreSQL
        let formattedBirthdate = birthdate?.trim() || '';
        if (formattedBirthdate && formattedBirthdate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          // Parse DD/MM/YYYY and convert to YYYY-MM-DD
          const [day, month, year] = formattedBirthdate.split('/');
          formattedBirthdate = `${year}-${month}-${day}`;
        }

        console.log('Attempting signup with:', { 
          phone_number: phone_number.trim(), 
          pin: formattedPin,
          hasName: !!name,
          hasEmail: !!email,
          birthdate: formattedBirthdate
        });

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            pin: formattedPin,
            full_name: name,
            email: email,
            gender: gender,
            birthdate: formattedBirthdate || birthdate,
            country: country,
            state: state,
            city: city,
            phone_number: phone_number.trim(),
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('Signup error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          
          // Provide specific error messages based on the error type
          if (insertError.code === '23505' || insertError.message?.includes('duplicate') || insertError.message?.includes('unique')) {
            // Unique constraint violation - check which field
            const errorText = (insertError.message || insertError.details || insertError.hint || '').toLowerCase();
            
            // Check for PIN unique constraint error (this should not exist - needs to be removed from database)
            if (errorText.includes('profiles_pin_key') || errorText.includes('pin') && errorText.includes('unique')) {
              console.error('ERROR: Database has unique constraint on PIN. This should be removed!', insertError);
              return { success: false, error: 'Database configuration error: PIN uniqueness is incorrectly enforced. Please contact support. Technical: profiles_pin_key constraint should be removed from database.' };
            }
            
            if (errorText.includes('phone_number') || insertError.details?.includes('phone_number') || insertError.hint?.includes('phone_number')) {
              return { success: false, error: 'This phone number is already registered. Please sign in or use a different phone number.' };
            }
            
            if (errorText.includes('email')) {
              return { success: false, error: 'This email address is already registered. Please use a different email or sign in instead.' };
            }
            
            // Log the full error for debugging
            console.warn('Unique constraint violation on unknown field:', {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint
            });
            
            // More specific error message
            return { success: false, error: `Phone number or email already exists. Please check your information or sign in instead. Error: ${insertError.message || insertError.details || 'Unknown constraint violation'}` };
          }
          
          if (insertError.code === '23503') {
            // Foreign key violation
            return { success: false, error: 'Invalid reference data. Please check your information.' };
          }
          
          if (insertError.code === '23502') {
            // Not null violation - identify which field
            const missingField = insertError.message?.match(/column "([^"]+)" violates not-null constraint/i)?.[1] || 'unknown';
            return { success: false, error: `Required field is missing: ${missingField}. Please fill in all fields.` };
          }

          // Check for check constraint violations
          if (insertError.code === '23514') {
            return { success: false, error: 'Invalid data provided. Please check your information.' };
          }

          // Check for date format errors (22008)
          if (insertError.code === '22008') {
            console.error('Date format error:', insertError);
            return { success: false, error: 'Invalid birthdate format. Please enter birthdate in DD/MM/YYYY format (e.g., 20/07/1999).' };
          }
          
          // Generic error with more details
          const errorMessage = insertError.message || insertError.details || insertError.hint || 'Failed to create account. Please try again.';
          return { success: false, error: errorMessage };
        }

        // Create user object from new profile
        const userData: User = {
          id: newProfile.id,
          pin: newProfile.pin,
          name: newProfile.full_name?.split(' ')[0] || name.split(' ')[0],
          email: newProfile.email,
          phone_number: newProfile.phone_number,
          country_code: newProfile.country_code,
          gender: newProfile.gender,
          birthdate: newProfile.birthdate,
          country: newProfile.country,
          state: newProfile.state,
          city: newProfile.city,
          avatar: newProfile.avatar_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        };

        // Store user using safe storage wrapper
        storage.set('karma-terra-user', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      // If profile exists and user is trying to sign up, return specific error
      if (profile && isSignupAttempt) {
        return { success: false, error: 'This phone number is already registered. Please sign in or use a different phone number.' };
      }

      // If profile doesn't exist and no signup data, return error
      if (!profile) {
        return { success: false, error: 'Account not found. Please sign up to create an account.' };
      }

      // Verify PIN matches the user's PIN (this is for sign-in only)
      if (profile.pin !== pin) {
        return { success: false, error: 'Incorrect PIN. Please try again.' };
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
        country_code: profile.country_code,
        gender: profile.gender,
        birthdate: profile.birthdate,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        avatar: profile.avatar_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      };

      // Store user using safe storage wrapper
      storage.set('karma-terra-user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    storage.remove('karma-terra-user');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      console.warn('Cannot update profile: no user logged in');
      return;
    }

    try {
      const updatedUser = { ...user, ...updates };
      
      // Update Supabase profiles table
      const supabaseUpdates: any = {};
      if (updates.name !== undefined) supabaseUpdates.full_name = updates.name;
      if (updates.email !== undefined) supabaseUpdates.email = updates.email;
      if (updates.gender !== undefined) supabaseUpdates.gender = updates.gender;
      if (updates.birthdate !== undefined) supabaseUpdates.birthdate = updates.birthdate;
      if (updates.country !== undefined) supabaseUpdates.country = updates.country;
      if (updates.state !== undefined) supabaseUpdates.state = updates.state;
      if (updates.city !== undefined) supabaseUpdates.city = updates.city;
      if (updates.avatar !== undefined) supabaseUpdates.avatar_url = updates.avatar;
      
      // Only update Supabase if there are actual changes
      if (Object.keys(supabaseUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(supabaseUpdates)
          .eq('id', user.id);
        
        if (error) {
          console.error('Failed to update profile in Supabase:', error);
          throw new Error(`Failed to update profile: ${error.message}`);
        }
      }
      
      // Update local storage using storage wrapper
      storage.set('karma-terra-user', JSON.stringify(updatedUser));
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthContext.Provider value={{ user, login, signOut, updateProfile }}>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AndroidBackButtonHandler />
              <div className="min-h-screen safe-area-top">
                <Routes>
                <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
                <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
                <Route path="/community" element={user ? <CommunityPage /> : <AuthPage />} />
                <Route path="/know-your-skin" element={<KnowYourSkinPage />} />
                <Route path="/skin-analysis-results" element={user ? <EnhancedSkinAnalysisResultsPage /> : <AuthPage />} />
                <Route path="/progress-tracking" element={user ? <ProgressTrackingPage /> : <AuthPage />} />
                <Route path="/hair-analysis" element={user ? <HairAnalysisPage /> : <AuthPage />} />
                <Route path="/hair-analysis-results" element={user ? <HairAnalysisResultsPage /> : <AuthPage />} />
                <Route path="/ask-karma" element={user ? <AskKarmaPage /> : <AuthPage />} />
                <Route path="/ingredients" element={user ? <IngredientsPage /> : <AuthPage />} />
                <Route path="/know-your-hair" element={user ? <KnowYourHairPage /> : <AuthPage />} />
                <Route path="/market" element={user ? <MarketPage /> : <AuthPage />} />
                <Route path="/blogs" element={user ? <BlogsPage /> : <AuthPage />} />
                <Route path="/blog/:id" element={user ? <BlogDetailPage /> : <AuthPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthContext.Provider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;