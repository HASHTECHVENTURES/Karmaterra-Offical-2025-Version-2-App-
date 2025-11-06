// User and Authentication Types
export interface User {
  id: string;
  pin: string;
  name?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  gender?: string;
  birthdate?: string;
  country?: string;
  state?: string;
  city?: string;
  avatar?: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (pin: string, phone_number: string, name?: string, email?: string, gender?: string, birthdate?: string, country?: string, state?: string, city?: string, isSignUpMode?: boolean) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  image: string;
  link: string;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  author?: string;
}

// Analysis Types
export interface AnalysisResult {
  skinType?: string;
  concerns?: string[];
  recommendations?: string[];
  confidence?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Skin Analysis Specific Types from original-skin-analyzer/types.ts

export interface UserData {
  name: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  workingTime: string; // Renamed from workingHours for consistency
  workStress?: string;
  acUsage: string;
  smoking: string;
  waterQuality: string;
}

export interface AnalysisParameter {
  category: string;
  rating: number;
  severity: 'Mild' | 'Medium' | 'Severe' | 'N/A';
  description: string;
}

export interface AnalysisResult {
  summary: string;
  overallSeverity: 'Mild' | 'Medium' | 'Severe';
  parameters: AnalysisParameter[];
  routine: {
    morning: string[];
    evening: string[];
  };
}

export interface Report {
  id: string;
  date: string;
  result: AnalysisResult;
  userData: UserData;
  faceImages: string[];
}
