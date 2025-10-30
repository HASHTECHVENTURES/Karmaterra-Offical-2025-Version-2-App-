import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, FlaskConical } from "lucide-react";

export const ServiceGrid = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/sign/karmaterra%20images/ec8d32dd-cf00-4a0d-93bd-64307bab4bef-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmYwODA2Zi1lZjNiLTRjNjUtODc5ZC1kNzMyOWM4MmM2Y2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYXJtYXRlcnJhIGltYWdlcy9lYzhkMzJkZC1jZjAwLTRhMGQtOTNiZC02NDMwN2JhYjRiZWYtcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NjE4MTc5NDMsImV4cCI6NjYyNTI5Mzc5NDN9.-tl5ce8D_UakU395AaLe0omfi5oXOZQkk3lKIcuFH5A",
      title: "Know Your Skin",
      description: "Analyze your skin type",
      path: "/know-your-skin",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "https://aagehceioskhyxvtolfz.supabase.co/storage/v1/object/sign/karmaterra%20images/1dec4eca-3cf7-4ae8-92e6-baf368a43342-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmYwODA2Zi1lZjNiLTRjNjUtODc5ZC1kNzMyOWM4MmM2Y2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYXJtYXRlcnJhIGltYWdlcy8xZGVjNGVjYS0zY2Y3LTRhZTgtOTJlNi1iYWYzNjhhNDMzNDItcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NjE4MTgxMjUsImV4cCI6NjY0MTA2MTgxMjV9.1TWqdqbHTJSOkyIw8EMQLpn2EPgYvXwSzHRP7odhTEw",
      title: "Know Your Hair",
      description: "Discover your hair type and needs",
      path: "/know-your-hair",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FlaskConical,
      title: "Ingredients",
      description: "Learn about skincare ingredients",
      path: "/ingredients",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground px-2">Services</h2>
      <div className="px-2">
        <div className="grid grid-cols-3 gap-2">
          {services.map((service, index) => (
            <Card
              key={index}
              className="shadow-soft border-0 bg-card hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate(service.path)}
            >
              <CardContent className="p-2 text-center space-y-1">
                <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center shadow-soft`}>
                  {typeof service.icon === 'string' ? (
                    <img src={service.icon} alt={service.title} className="w-4 h-4 object-contain" />
                  ) : (
                    <service.icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[10px] mb-0.5 leading-tight">{service.title}</h3>
                  <p className="text-[9px] text-muted-foreground leading-tight">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};