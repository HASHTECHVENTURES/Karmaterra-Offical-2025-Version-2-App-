import { useState } from "react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getCountries, getStatesByCountry, getCitiesByState } from "@/lib/locationData";

const AuthPage = () => {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Get location data
  const countries = getCountries();
  const states = country ? getStatesByCountry(country) : [];
  const cities = country && state ? getCitiesByState(country, state) : [];

  // Handle country change
  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setState(""); // Reset state when country changes
    setCity(""); // Reset city when country changes
  };

  // Handle state change
  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    setCity(""); // Reset city when state changes
  };

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

    if (isSignUp && !email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !gender.trim()) {
      toast({
        title: "Gender Required",
        description: "Please select your gender for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !birthdate.trim()) {
      toast({
        title: "Birthdate Required",
        description: "Please enter your birthdate for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !country.trim()) {
      toast({
        title: "Country Required",
        description: "Please select your country for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !state.trim()) {
      toast({
        title: "State Required",
        description: "Please select your state for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !city.trim()) {
      toast({
        title: "City Required",
        description: "Please select your city for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !countryCode.trim()) {
      toast({
        title: "Country Code Required",
        description: "Please select your country code for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp && !phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for sign up",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const result = await login(
        pin, 
        isSignUp ? name.trim() : undefined,
        isSignUp ? email.trim() : undefined,
        isSignUp ? gender.trim() : undefined,
        isSignUp ? birthdate.trim() : undefined,
        isSignUp ? country.trim() : undefined,
        isSignUp ? state.trim() : undefined,
        isSignUp ? city.trim() : undefined,
        isSignUp ? countryCode.trim() : undefined,
        isSignUp ? phoneNumber.trim() : undefined
      );

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

          {/* Email Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
              />
            </div>
          )}

          {/* Gender Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 px-3"
              >
                <option key="gender-empty" value="">Select your gender</option>
                <option key="Male" value="Male">Male</option>
                <option key="Female" value="Female">Female</option>
                <option key="Other" value="Other">Other</option>
                <option key="Prefer not to say" value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          )}

          {/* Birthdate Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Birthdate *
              </label>
              <Input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
              />
            </div>
          )}

          {/* Country Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Country *
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 px-3"
              >
                <option key="country-empty" value="">Select your country</option>
                {countries.map((countryOption) => (
                  <option key={countryOption.code} value={countryOption.name}>
                    {countryOption.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* State Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                State *
              </label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={!country}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option key="state-empty" value="">{country ? "Select your state" : "Select country first"}</option>
                {states.map((stateOption) => (
                  <option key={stateOption.code} value={stateOption.name}>
                    {stateOption.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City Input - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option key="city-empty" value="">{state ? "Select your city" : "Select state first"}</option>
                {cities.map((cityOption) => (
                  <option key={cityOption.id} value={cityOption.name}>
                    {cityOption.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Country Code and Phone Number - Only for Sign Up */}
          {isSignUp && (
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Country Code *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 px-3"
                >
                  <option value="">Code</option>
                  <option key="+1" value="+1">🇺🇸 +1</option>
                  <option key="+91" value="+91">🇮🇳 +91</option>
                  <option key="+44" value="+44">🇬🇧 +44</option>
                  <option key="+86" value="+86">🇨🇳 +86</option>
                  <option key="+81" value="+81">🇯🇵 +81</option>
                  <option key="+49" value="+49">🇩🇪 +49</option>
                  <option key="+33" value="+33">🇫🇷 +33</option>
                  <option key="+39-IT" value="+39">🇮🇹 +39</option>
                  <option key="+34" value="+34">🇪🇸 +34</option>
                  <option key="+7" value="+7">🇷🇺 +7</option>
                  <option key="+55" value="+55">🇧🇷 +55</option>
                  <option key="+52" value="+52">🇲🇽 +52</option>
                  <option key="+61" value="+61">🇦🇺 +61</option>
                  <option key="+82" value="+82">🇰🇷 +82</option>
                  <option key="+66" value="+66">🇹🇭 +66</option>
                  <option key="+60" value="+60">🇲🇾 +60</option>
                  <option key="+65" value="+65">🇸🇬 +65</option>
                  <option key="+971" value="+971">🇦🇪 +971</option>
                  <option key="+966" value="+966">🇸🇦 +966</option>
                  <option key="+20" value="+20">🇪🇬 +20</option>
                  <option key="+27" value="+27">🇿🇦 +27</option>
                  <option key="+234" value="+234">🇳🇬 +234</option>
                  <option key="+254" value="+254">🇰🇪 +254</option>
                  <option key="+880" value="+880">🇧🇩 +880</option>
                  <option key="+92" value="+92">🇵🇰 +92</option>
                  <option key="+93" value="+93">🇦🇫 +93</option>
                  <option key="+98" value="+98">🇮🇷 +98</option>
                  <option key="+90" value="+90">🇹🇷 +90</option>
                  <option key="+84" value="+84">🇻🇳 +84</option>
                  <option key="+63" value="+63">🇵🇭 +63</option>
                  <option key="+62" value="+62">🇮🇩 +62</option>
                  <option key="+64" value="+64">🇳🇿 +64</option>
                  <option key="+31" value="+31">🇳🇱 +31</option>
                  <option key="+32" value="+32">🇧🇪 +32</option>
                  <option key="+41" value="+41">🇨🇭 +41</option>
                  <option key="+43" value="+43">🇦🇹 +43</option>
                  <option key="+45" value="+45">🇩🇰 +45</option>
                  <option key="+46" value="+46">🇸🇪 +46</option>
                  <option key="+47" value="+47">🇳🇴 +47</option>
                  <option key="+358" value="+358">🇫🇮 +358</option>
                  <option key="+48" value="+48">🇵🇱 +48</option>
                  <option key="+420" value="+420">🇨🇿 +420</option>
                  <option key="+421" value="+421">🇸🇰 +421</option>
                  <option key="+36" value="+36">🇭🇺 +36</option>
                  <option key="+40" value="+40">🇷🇴 +40</option>
                  <option key="+359" value="+359">🇧🇬 +359</option>
                  <option key="+385" value="+385">🇭🇷 +385</option>
                  <option key="+386" value="+386">🇸🇮 +386</option>
                  <option key="+372" value="+372">🇪🇪 +372</option>
                  <option key="+371" value="+371">🇱🇻 +371</option>
                  <option key="+370" value="+370">🇱🇹 +370</option>
                  <option key="+353" value="+353">🇮🇪 +353</option>
                  <option key="+351" value="+351">🇵🇹 +351</option>
                  <option key="+30" value="+30">🇬🇷 +30</option>
                  <option key="+357" value="+357">🇨🇾 +357</option>
                  <option key="+356" value="+356">🇲🇹 +356</option>
                  <option key="+352" value="+352">🇱🇺 +352</option>
                  <option key="+377" value="+377">🇲🇨 +377</option>
                  <option key="+378" value="+378">🇸🇲 +378</option>
                  <option key="+39-VA" value="+39">🇻🇦 +39</option>
                  <option key="+376" value="+376">🇦🇩 +376</option>
                  <option key="+423" value="+423">🇱🇮 +423</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500"
                />
              </div>
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