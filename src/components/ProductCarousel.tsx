import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const ProductCarousel = () => {
  const products = [
    {
      name: "Kumkumadi Facial Oil",
      description: "30ML Natural facial oil with saffron",
      image: "/lovable-uploads/3521e395-a6a4-4833-b581-67d17d2a86d4.png",
      link: "https://www.karmaterra.in/"
    },
    {
      name: "Age Redefine Serum",
      description: "Skin brightening & pigmentation formula",
      image: "/lovable-uploads/d3945ba6-da97-4ccb-b1c1-35755fdd6600.png",
      link: "https://www.karmaterra.in/"
    },
    {
      name: "Ultra Sunscreen",
      description: "Water resistant & luminance SPF 50",
      image: "/lovable-uploads/c2abb3d0-3b71-46a7-843a-8313d05342bb.png",
      link: "https://www.karmaterra.in/"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground px-2">Featured Products</h2>
      <div className="px-2">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2">
            {products.map((product, index) => (
              <CarouselItem key={index} className="pl-2 basis-2/3 md:basis-1/2">
                <Card className="shadow-soft border-0 bg-card hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-3">
                    <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-luxury">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 leading-tight">{product.name}</h3>
                    <p className="text-muted-foreground text-xs mb-3 leading-tight">{product.description}</p>
                    <Button
                      onClick={() => window.open(product.link, "_blank")}
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Product
                    </Button>
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