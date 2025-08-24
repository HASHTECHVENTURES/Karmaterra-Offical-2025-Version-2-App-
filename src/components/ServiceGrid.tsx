import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, FlaskConical } from "lucide-react";

export const ServiceGrid = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Brain,
      title: "Know Your Skin",
      description: "Learn about different skin types",
      path: "/know-your-skin",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
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
                  <service.icon className="w-4 h-4 text-white" />
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