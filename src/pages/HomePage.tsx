import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Star, Scissors, Leaf, Users, Home, ShoppingBag, User, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/App";
import { supabase } from "@/lib/supabase";
import { Browser } from "@capacitor/browser";

const HomePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product data with images and links
  const products = [
    {
      id: 1,
      name: "Hair Treatment Oil",
      image: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp",
      link: "https://www.karmaterra.in/collections/hair-care/products/karma-terra-hair-treatment-oil-100ml-copy"
    },
    {
      id: 2,
      name: "Kumkumadi Oil",
      image: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/KumkumadiOil01_1512x.webp",
      link: "https://www.karmaterra.in/collections/skin-care/products/karma-terra-kumkumadi-oil"
    },
    {
      id: 3,
      name: "Age Redefine Serum",
      image: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-15at19.52.02_1296x.webp",
      link: "https://www.karmaterra.in/collections/derma-care/products/age-redefine"
    },
    {
      id: 4,
      name: "Neem Basil Soap",
      image: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/public/Product%20image/WhatsAppImage2025-04-15at20.11.34_2_1296x.webp",
      link: "https://www.karmaterra.in/collections/soaps/products/neem-basil-soaps"
    }
  ];

  // Fetch blogs from Supabase
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
        } else {
          setBlogs(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-move product carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  // Auto-move blog carousel every 4 seconds
  useEffect(() => {
    if (blogs.length > 1) {
      const interval = setInterval(() => {
        setCurrentBlogIndex((prevIndex) => 
          prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [blogs.length]);

  const handleProductClick = async (product: any) => {
    try {
      await Browser.open({ url: product.link });
    } catch (e) {
      console.warn('Browser.open failed, falling back to in-app view', e);
      setSelectedProduct(product);
    }
  };

  const handleProductBackClick = () => {
    setSelectedProduct(null);
  };

  const goToProduct = (index: number) => {
    setCurrentProductIndex(index);
  };

  const goToBlog = (index: number) => {
    setCurrentBlogIndex(index);
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  // Touch/swipe functionality for products
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Touch/swipe functionality for blogs
  const [blogTouchStart, setBlogTouchStart] = useState<number | null>(null);
  const [blogTouchEnd, setBlogTouchEnd] = useState<number | null>(null);
  // Drawer swipe handling
  const [drawerTouchStartX, setDrawerTouchStartX] = useState<number | null>(null);
  const [drawerTouchEndX, setDrawerTouchEndX] = useState<number | null>(null);
  const [edgeTouchStartX, setEdgeTouchStartX] = useState<number | null>(null);
  const [edgeTouchEndX, setEdgeTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next product
      setCurrentProductIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    } else if (isRightSwipe) {
      // Swipe right - previous product
      setCurrentProductIndex((prevIndex) => 
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    }
  };

  // Blog swipe functionality
  const onBlogTouchStart = (e: React.TouchEvent) => {
    setBlogTouchEnd(null);
    setBlogTouchStart(e.targetTouches[0].clientX);
  };

  const onBlogTouchMove = (e: React.TouchEvent) => {
    setBlogTouchEnd(e.targetTouches[0].clientX);
  };

  const onBlogTouchEnd = () => {
    if (!blogTouchStart || !blogTouchEnd) return;
    
    const distance = blogTouchStart - blogTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && blogs.length > 1) {
      // Swipe left - next blog
      setCurrentBlogIndex((prevIndex) => 
        prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
      );
    } else if (isRightSwipe && blogs.length > 1) {
      // Swipe right - previous blog
      setCurrentBlogIndex((prevIndex) => 
        prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
      );
    }
  };

  // Drawer swipe handlers (close on left swipe)
  const onDrawerTouchStart = (e: React.TouchEvent) => {
    setDrawerTouchEndX(null);
    setDrawerTouchStartX(e.targetTouches[0].clientX);
  };

  const onDrawerTouchMove = (e: React.TouchEvent) => {
    setDrawerTouchEndX(e.targetTouches[0].clientX);
  };

  const onDrawerTouchEnd = () => {
    if (!drawerTouchStartX || drawerTouchEndX === null) return;
    const distance = drawerTouchEndX - drawerTouchStartX; // negative = left swipe
    if (distance < -minSwipeDistance) {
      setIsMenuOpen(false);
    }
  };

  // Edge swipe to open drawer (right swipe from left edge)
  const onEdgeTouchStart = (e: React.TouchEvent) => {
    setEdgeTouchEndX(null);
    setEdgeTouchStartX(e.targetTouches[0].clientX);
  };

  const onEdgeTouchMove = (e: React.TouchEvent) => {
    setEdgeTouchEndX(e.targetTouches[0].clientX);
  };

  const onEdgeTouchEnd = () => {
    if (!edgeTouchStartX || edgeTouchEndX === null) return;
    const distance = edgeTouchEndX - edgeTouchStartX; // positive = right swipe
    if (distance > minSwipeDistance) {
      setIsMenuOpen(true);
    }
  };

  const services = [
        {
          title: "Know Your Skin",
          icon: <img src="https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/sign/karmaterra%20images/ec8d32dd-cf00-4a0d-93bd-64307bab4bef-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmYwODA2Zi1lZjNiLTRjNjUtODc5ZC1kNzMyOWM4MmM2Y2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYXJtYXRlcnJhIGltYWdlcy9lYzhkMzJkZC1jZjAwLTRhMGQtOTNiZC02NDMwN2JhYjRiZWYtcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NjE4MTc5NDMsImV4cCI6NjYyNTI5Mzc5NDN9.-tl5ce8D_UakU395AaLe0omfi5oXOZQkk3lKIcuFH5A" alt="Know Your Skin" className="w-8 h-8 object-contain filter invert brightness-150" />,
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
      iconBg: "bg-orange-500",
      textColor: "text-orange-700",
      onClick: () => navigate("/know-your-skin")
    },
        {
          title: "Know Your Hair",
          icon: <img src="https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/sign/karmaterra%20images/1dec4eca-3cf7-4ae8-92e6-baf368a43342-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmYwODA2Zi1lZjNiLTRjNjUtODc5ZC1kNzMyOWM4MmM2Y2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYXJtYXRlcnJhIGltYWdlcy8xZGVjNGVjYS0zY2Y3LTRhZTgtOTJlNi1iYWYzNjhhNDMzNDItcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NjE4MTgxMjUsImV4cCI6NjY0MTA2MTgxMjV9.1TWqdqbHTJSOkyIw8EMQLpn2EPgYvXwSzHRP7odhTEw" alt="Know Your Hair" className="w-8 h-8 object-contain filter invert brightness-150" />,
      bgColor: "bg-gradient-to-br from-indigo-100 to-indigo-200",
      iconBg: "bg-indigo-500",
      textColor: "text-indigo-700",
      onClick: () => navigate("/hair-analysis")
    },
    {
      title: "Ask Karma",
      icon: <Leaf className="w-6 h-6" />,
          bgColor: "bg-gradient-to-br from-green-100 to-green-200",
          iconBg: "bg-green-500",
          textColor: "text-green-700",
      onClick: () => navigate("/ask-karma")
    },
        {
          title: "Community",
          icon: <img src="https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/sign/karmaterra%20images/1538a485-a313-4adb-9e57-a0a25659c63c-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmYwODA2Zi1lZjNiLTRjNjUtODc5ZC1kNzMyOWM4MmM2Y2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYXJtYXRlcnJhIGltYWdlcy8xNTM4YTQ4NS1hMzEzLTRhZGItOWU1Ny1hMGEyNTY1OWM2M2MtcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NjE4MTgyNzksImV4cCI6NjYwOTUyNTgyNzl9.RDscj4vxpoPKgeidh7Edefftv7Bib4ptdGbAfY_zubs" alt="Community" className="w-8 h-8 object-contain filter invert brightness-150" />,
      bgColor: "bg-gradient-to-br from-teal-100 to-teal-200",
      iconBg: "bg-teal-500",
      textColor: "text-teal-700",
      onClick: () => navigate("/community")
    }
  ];

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40 header-safe-area">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleProductBackClick}
                aria-label="Go back to home"
                title="Go back to home"
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
            src={selectedProduct.link}
            className="w-full h-full border-0"
            title={selectedProduct.name}
            allow="payment; camera; microphone; geolocation"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 header-safe-area">
        <button 
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
            <div className="flex-1 flex justify-center items-center">
          <img 
            src="/app-icon.png" 
            alt="KarmaTerra App Icon"
                className="h-16 w-auto object-contain"
          />
        </div>
        <div className="w-6"></div> {/* Spacer to balance the hamburger menu */}
      </div>

      {/* Greeting */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, {user?.name || "Riya"} 👋
        </h1>
      </div>

      {/* Product Carousel */}
      <div className="px-4 mb-8">
        <div 
          className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Product Image */}
          <button
            onClick={() => handleProductClick(products[currentProductIndex])}
            className="w-full h-64 mb-4"
          >
            <img
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23374151' font-family='Arial' font-size='16'%3EProduct Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </button>
          
          {/* Product Name */}
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              {products[currentProductIndex].name}
            </h3>
          </div>
          
          {/* Carousel Dots */}
          <div className="flex justify-center space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProduct(index)}
                aria-label={`Go to product ${index + 1}`}
                title={`Go to product ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentProductIndex ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={service.onClick}
              className={`${service.bgColor} rounded-2xl p-6 text-center`}
            >
              <div className={`${service.iconBg} ${service.title === "Ask Karma" ? "w-12 h-12" : "w-16 h-16"} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <div className="text-white brightness-150">
                  {service.icon}
                </div>
              </div>
              <div className={`${service.textColor} font-semibold text-sm`}>
                {service.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Blog Posts - Click to View All */}
      {!loading && blogs.length > 0 && (
        <div className="px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Blog Posts</h2>
          <div 
            onClick={() => navigate('/blogs')}
            className="rounded-2xl p-6 relative overflow-hidden min-h-[200px] bg-gradient-to-br from-purple-600 to-purple-800 cursor-pointer group hover:shadow-xl transition-all duration-300"
            style={{
              backgroundImage: `url(${blogs[0].featured_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-all duration-300 rounded-2xl"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">
                Explore Our Blog
              </h3>
              <p className="text-white text-sm opacity-90 mb-4 max-w-md">
                Discover expert tips, skincare advice, and wellness insights
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-2 rounded-full font-medium text-sm group-hover:bg-opacity-100 bg-opacity-90 transition-all">
                <span>View All Posts</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Blog count badge */}
              <div className="absolute top-4 right-4 bg-white text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                {blogs.length} Posts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Menu */}
      {/* Edge swipe zone to open drawer */}
      {!isMenuOpen && (
        <div
          className="fixed left-0 top-0 h-full w-3 z-40"
          onTouchStart={onEdgeTouchStart}
          onTouchMove={onEdgeTouchMove}
          onTouchEnd={onEdgeTouchEnd}
        />
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl safe-area-top"
            onTouchStart={onDrawerTouchStart}
            onTouchMove={onDrawerTouchMove}
            onTouchEnd={onDrawerTouchEnd}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  title="Close menu"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
              
              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  Home
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/market');
                  }}
                  className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                      Shop
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Profile
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <LogOut className="w-4 h-4 text-white" />
                  </div>
                  Sign Out
                </button>
                    <div className="pt-3 mt-3 border-t border-gray-200 text-xs text-gray-600">
                      <p>
                        Read our <button onClick={() => { setIsMenuOpen(false); navigate('/terms'); }} className="underline">Terms & Conditions</button> and <button onClick={() => { setIsMenuOpen(false); navigate('/privacy'); }} className="underline">Data Privacy Policy</button>.
                      </p>
                    </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;