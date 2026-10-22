import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Scan, Target, TrendingUp } from "lucide-react";
import { ResumeCreator } from "./ResumeCreator";
import { PdfUploader } from "./PdfUploader";
import { AnalysisResults } from "./AnalysisResults";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ATSAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  targetJobs: string[];
  recommendations: string[];
  keywordMatch: number;
  sections: {
    contact: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
}

export const Hero = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showResumeCreator, setShowResumeCreator] = useState(false);
  const [showPdfUploader, setShowPdfUploader] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ATSAnalysis | null>(null);

  const handleUploadResume = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload your resume",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    setShowPdfUploader(true);
  };

  const handleCreateResume = () => {
    if (!user) {
      toast({
        title: "Sign in required", 
        description: "Please sign in to create a resume",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    setShowResumeCreator(true);
  };

  const handleAnalysisComplete = (analysis: ATSAnalysis) => {
    setShowPdfUploader(false);
    setAnalysisResults(analysis);
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MockMate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              AI-Powered Resume Optimization & ATS Scoring Platform
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create stunning resumes, analyze ATS compatibility, get job recommendations, 
              and practice interviews with our futuristic career platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6 group relative overflow-hidden" 
              onClick={handleUploadResume}
            >
              <span className="relative z-10 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Resume
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
            <Button 
              variant="neon" 
              size="lg" 
              className="text-lg px-8 py-6 group relative overflow-hidden" 
              onClick={handleCreateResume}
            >
              <span className="relative z-10 flex items-center">
                <Scan className="w-5 h-5 mr-2" />
                Create New Resume
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              icon={<Scan className="w-8 h-8" />}
              title="AI Resume Analysis"
              description="Advanced keyword extraction and ATS compatibility scoring"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Smart Job Matching"
              description="Get personalized job recommendations based on your profile"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Skill Gap Analysis"
              description="Identify weaknesses and improve your competitive edge"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showResumeCreator && (
        <ResumeCreator onClose={() => setShowResumeCreator(false)} />
      )}
      
      {showPdfUploader && (
        <PdfUploader 
          onClose={() => setShowPdfUploader(false)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      
      {analysisResults && (
        <AnalysisResults 
          analysis={analysisResults}
          onClose={() => setAnalysisResults(null)}
        />
      )}
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-primary opacity-0 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="relative bg-gradient-glass backdrop-blur-glass border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 shadow-glass hover:shadow-glass-lg hover:-translate-y-1">
        <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};