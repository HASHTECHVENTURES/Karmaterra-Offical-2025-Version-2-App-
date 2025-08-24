import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Search, BookOpen, FlaskConical, Calendar, MessageCircle } from "lucide-react";

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
      icon: Search,
      title: "How to Check That",
      description: "Skin assessment techniques",
      path: "/check-that",
      color: "from-green-500 to-green-600"
    },
    {
      icon: BookOpen,
      title: "Understand Skin",
      description: "Skin science and structure",
      path: "/understand-skin",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FlaskConical,
      title: "Knowledge Ingredients",
      description: "Learn about skincare ingredients",
      path: "/ingredients",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Calendar,
      title: "Your Skin Ritual",
      description: "Build your daily routine",
      path: "/skin-ritual",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: MessageCircle,
      title: "Talk to Us",
      description: "Chat with AI skincare coach",
      path: "/talk-to-us",
      color: "from-karma-gold to-accent"
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