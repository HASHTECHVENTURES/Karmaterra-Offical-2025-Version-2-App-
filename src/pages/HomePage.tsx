import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ServiceGrid } from "@/components/ServiceGrid";
import { BlogCarousel } from "@/components/BlogCarousel";
import { SkinAnalyzerBanner } from "@/components/SkinAnalyzerBanner";
import { useAuth } from "@/App";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-karma-cream to-karma-light-gold">
      {/* Header */}
      <div className="bg-gradient-to-r from-karma-gold to-accent p-4 text-primary-foreground shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back,</h1>
            <p className="text-primary-foreground/90">{user?.name || "Skincare Enthusiast"}</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
            <img 
              src="/lovable-uploads/223eca30-a4ce-4252-8a09-b59de0313219.png" 
              alt="Karma Terra Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-24 px-4 space-y-4 pt-4">
        {/* Product Carousel */}
        <ProductCarousel />
        
        {/* Service Grid */}
        <ServiceGrid />
        
        {/* Skin Analyzer Banner */}
        <SkinAnalyzerBanner />
        
        {/* Blog Carousel */}
        <BlogCarousel />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HomePage;