import { useState } from "react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive"
      });
      return;
    }

    if (isSignUp && !name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    const success = login(pin, isSignUp ? name : undefined);
    if (success) {
      toast({
        title: "Welcome to Karma Terra!",
        description: "Your personalized skincare journey begins now"
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please check your PIN and try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-cream via-karma-light-gold to-karma-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
            <img 
              src="/lovable-uploads/223eca30-a4ce-4252-8a09-b59de0313219.png" 
              alt="Karma Terra Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-karma-gold to-accent bg-clip-text text-transparent">
              Karma Terra
            </h1>
            <p className="text-muted-foreground mt-2">Your Personalized Skincare Companion</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-lg border-karma-gold/30 focus:border-karma-gold"
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                4-Digit PIN
              </label>
              <Input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                className="text-center text-2xl tracking-widest border-karma-gold/30 focus:border-karma-gold"
                maxLength={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-karma-gold to-accent hover:from-accent hover:to-karma-gold shadow-lg"
              size="lg"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-karma-brown hover:text-karma-gold"
            >
              {isSignUp ? "Already have an account? Sign In" : "New to Karma Terra? Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;