import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Briefcase, MessageSquare, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/5f44ecea-9c00-46a7-8ce4-962e78cb9ce7.png" alt="MockMate Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MockMate
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink icon={<FileText className="w-4 h-4" />} text="Resume Builder" />
            <NavLink icon={<BarChart3 className="w-4 h-4" />} text="ATS Analysis" />
            <NavLink icon={<Briefcase className="w-4 h-4" />} text="Job Matching" />
            <NavLink icon={<MessageSquare className="w-4 h-4" />} text="Interview Prep" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm" className="shadow-glow-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
      {icon}
      <span>{text}</span>
    </a>
  );
};