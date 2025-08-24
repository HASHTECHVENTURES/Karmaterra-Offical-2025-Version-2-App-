import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

export const BlogCarousel = () => {
  const navigate = useNavigate();
  
  const blogPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=300&fit=crop",
      title: "Natural Skincare Secrets",
      description: "Discover the ancient wisdom of natural ingredients for radiant skin",
      readTime: "5 min read",
      category: "Natural Care"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
      title: "The Science of Glowing Skin",
      description: "Understanding how your skin regenerates and repairs itself",
      readTime: "7 min read",
      category: "Science"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop",
      title: "Building Your Self-Care Ritual",
      description: "Create a mindful skincare routine that nurtures your skin and soul",
      readTime: "4 min read",
      category: "Wellness"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
      title: "Seasonal Skincare Guide",
      description: "Adapt your routine to changing weather and environmental factors",
      readTime: "6 min read",
      category: "Tips"
    }
  ];

  const handleBlogClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground px-2">Blog</h2>
      <div className="px-2">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2">
            {blogPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-2 basis-2/3 md:basis-1/2">
                <Card 
                  className="shadow-soft border-0 bg-card hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleBlogClick(post.id)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] rounded-t-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] bg-karma-light-gold text-karma-brown px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 leading-tight">{post.title}</h3>
                      <p className="text-muted-foreground text-xs leading-tight">{post.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};