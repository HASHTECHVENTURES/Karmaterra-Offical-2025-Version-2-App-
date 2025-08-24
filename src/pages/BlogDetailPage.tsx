import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock blog data
  const blogPosts = {
    "1": {
      title: "Natural Skincare Secrets",
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&h=400&fit=crop",
      content: "Discover the ancient wisdom of natural ingredients for radiant skin. For centuries, women have turned to nature's bounty to maintain healthy, glowing skin. From turmeric's anti-inflammatory properties to the moisturizing benefits of coconut oil, natural ingredients offer gentle yet effective solutions for all skin types.",
      author: "Dr. Priya Sharma",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Natural Care"
    },
    "2": {
      title: "The Science of Glowing Skin",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=400&fit=crop",
      content: "Understanding how your skin regenerates and repairs itself is key to maintaining a healthy complexion. Your skin follows a 28-day cycle of renewal, constantly shedding old cells and creating new ones. This process can be optimized through proper nutrition, hydration, and targeted skincare ingredients.",
      author: "Dr. Anjali Mehta",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Science"
    },
    "3": {
      title: "Building Your Self-Care Ritual",
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&h=400&fit=crop",
      content: "Create a mindful skincare routine that nurtures your skin and soul. Self-care is more than just applying products; it's about creating moments of peace and connection with yourself. A well-crafted routine can become a daily meditation that benefits both your skin and mental wellbeing.",
      author: "Kavya Patel",
      date: "Dec 10, 2024",
      readTime: "4 min read",
      category: "Wellness"
    },
    "4": {
      title: "Seasonal Skincare Guide",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=400&fit=crop",
      content: "Adapt your routine to changing weather and environmental factors. Just as you change your wardrobe with the seasons, your skin needs different care throughout the year. Winter calls for richer moisturizers, while summer requires lighter formulations and increased sun protection.",
      author: "Dr. Ravi Kumar",
      date: "Dec 8, 2024",
      readTime: "6 min read",
      category: "Tips"
    }
  };

  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-karma-cream to-karma-light-gold">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-primary-foreground shadow-soft">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Blog</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <Card className="shadow-luxury border-0 bg-card">
          <CardContent className="p-0">
            {/* Hero Image */}
            <div className="aspect-[16/9] rounded-t-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-karma-light-gold text-karma-brown px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-4 leading-tight">{post.title}</h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed mb-6">
                  {post.content}
                </p>

                <h2 className="text-xl font-semibold mb-4 text-foreground">Key Benefits</h2>
                <ul className="list-disc list-inside mb-6 text-foreground space-y-2">
                  <li>Improved skin texture and appearance</li>
                  <li>Enhanced natural glow and radiance</li>
                  <li>Better protection against environmental damage</li>
                  <li>Increased confidence and self-care awareness</li>
                </ul>

                <h2 className="text-xl font-semibold mb-4 text-foreground">Getting Started</h2>
                <p className="text-foreground leading-relaxed mb-6">
                  Begin with small changes to your routine. Consistency is more important than perfection. 
                  Listen to your skin's needs and adjust accordingly. Remember, everyone's skin is unique, 
                  so what works for others may need to be modified for you.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 p-4 bg-karma-light-gold rounded-lg">
                <h3 className="font-semibold mb-2">Ready to transform your skincare routine?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore our personalized skincare solutions and discover what works best for your unique skin type.
                </p>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => navigate('/skin-analyzer')}
                >
                  Analyze Your Skin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;