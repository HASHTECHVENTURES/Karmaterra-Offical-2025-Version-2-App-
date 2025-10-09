import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { User, LogOut, ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut } = useAuth();
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
    signOut();
    toast({
      title: "Logged Out",
      description: "See you soon on your skincare journey!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-cream via-background to-karma-light-gold">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              aria-label="Go back to home"
              title="Go back to home"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Profile</h1>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <Avatar className="w-24 h-24 mx-auto border-4 border-karma-gold shadow-lg">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-karma-gold to-accent text-primary-foreground text-2xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
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
    </div>
  );
};

export default ProfilePage;