import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setConnectionStatus('error');
          return;
        }
        setConnectionStatus('connected');
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setConnectionStatus('error');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const redirectUrl = `${window.location.origin}/`;
        console.log('Attempting sign up with:', { email, username });
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username,
            }
          }
        });

        console.log('Sign up response:', { data, error });

        if (error) {
          console.error('Sign up error:', error);
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account already exists",
              description: "Please sign in instead or use a different email.",
              variant: "destructive",
            });
          } else if (error.message.includes("fetch") || error.message.includes("network")) {
            toast({
              title: "Connection Error",
              description: "Unable to connect to the server. Please check your internet connection.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Account created!",
            description: data.user ? "You can now sign in." : "Please check your email to verify your account.",
          });
          setIsSignUp(false);
        }
      } else {
        // Sign in
        console.log('Attempting sign in with:', { email });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Sign in response:', { data, error });

        if (error) {
          console.error('Sign in error:', error);
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch")) {
            toast({
              title: "Connection Error",
              description: "Unable to connect to the server. Please check your internet connection and try again.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to MockMate</span>
          </Link>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border/80 transition-all duration-300">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/lovable-uploads/5f44ecea-9c00-46a7-8ce4-962e78cb9ce7.png" alt="MockMate Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MockMate
              </span>
            </div>
            {connectionStatus === 'error' && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Connection Error: Unable to connect to the server. Please check your internet connection.
                </p>
              </div>
            )}
            <CardTitle className="text-2xl">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Sign up to start building your perfect resume" 
                : "Sign in to your MockMate account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="hero"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail("");
                  setPassword("");
                  setUsername("");
                  setPhoneNumber("");
                }}
                disabled={isLoading}
                className="mt-2"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}