// User and Authentication Types
export interface User {
  id: string;
  pin: string;
  name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  avatar?: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (pin: string, name?: string) => Promise<LoginResult>;
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
