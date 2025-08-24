import { Card, CardContent } from "@/components/ui/card";

export const ImageCarousel = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=300&fit=crop",
      title: "Natural Skincare",
      description: "Embrace the power of nature"
    },
    {
      url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
      title: "Glowing Skin",
      description: "Achieve your natural glow"
    },
    {
      url: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop",
      title: "Self Care",
      description: "Take time for yourself"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground px-2">Inspiration</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 px-2">
        {images.map((image, index) => (
          <Card key={index} className="min-w-[260px] shadow-lg border-0 bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{image.title}</h3>
                <p className="text-muted-foreground text-sm">{image.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};