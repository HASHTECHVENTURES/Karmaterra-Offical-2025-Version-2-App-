import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, User } from "lucide-react";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleMarketplace = () => {
    navigate("/market");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="grid grid-cols-3 gap-0 px-4 py-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-1 p-3 h-auto ${
            isActive("/") 
              ? "text-karma-gold bg-karma-gold/10" 
              : "text-muted-foreground hover:text-karma-gold"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Button>

        <Button
          variant="ghost"
          onClick={handleMarketplace}
          className={`flex flex-col items-center gap-1 p-3 h-auto ${
            isActive("/market") 
              ? "text-karma-gold bg-karma-gold/10" 
              : "text-muted-foreground hover:text-karma-gold"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs font-medium">Market</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center gap-1 p-3 h-auto ${
            isActive("/profile") 
              ? "text-karma-gold bg-karma-gold/10" 
              : "text-muted-foreground hover:text-karma-gold"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </Button>
      </div>
    </div>
  );
};