import { useState } from "react";
import { useAuth } from "@/App";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Camera, User, Lock, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [pin, setPin] = useState("");

  const handleSave = () => {
    if (name.trim() && (pin.length === 4 || pin.length === 0)) {
      updateProfile({ 
        name: name.trim(),
        ...(pin.length === 4 && { pin })
      });
      setIsEditing(false);
      setPin("");
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
    } else {
      toast({
        title: "Invalid Input",
        description: "Please check your name and PIN (4 digits)",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "See you soon on your skincare journey!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-cream via-background to-karma-light-gold">
      {/* Header */}
      <div className="bg-gradient-to-r from-karma-gold to-accent p-4 text-primary-foreground shadow-lg">
        <h1 className="text-xl font-bold text-center">Profile</h1>
      </div>

      {/* Content */}
      <div className="pb-20 p-4 space-y-6">
        {/* Profile Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto border-4 border-karma-gold shadow-lg">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-karma-gold to-accent text-primary-foreground text-2xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-karma-gold hover:bg-accent"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Photo upload will be available soon" })}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isEditing ? (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                  <p className="text-muted-foreground">Skincare Enthusiast</p>
                </div>
                
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-karma-gold to-accent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">New PIN (optional)</label>
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="text-center tracking-widest"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-karma-gold to-accent"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || "");
                      setPin("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Privacy settings will be available soon" })}
            >
              <Lock className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;