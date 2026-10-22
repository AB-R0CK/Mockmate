import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

export const PdfUploader = ({ onClose, onAnalysisComplete }: { 
  onClose: () => void;
  onAnalysisComplete: (analysis: ATSAnalysis) => void;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: "PDF file ready for analysis"
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const analyzeResume = async () => {
    if (!uploadedFile || !user) return;

    setIsAnalyzing(true);
    setProgress(10);

    try {
      // Simulate reading PDF content (in real app, use pdf-parse)
      setProgress(30);
      
      // Mock analysis - in production, this would be an AI service
      const mockAnalysis: ATSAnalysis = await performMockAnalysis(uploadedFile.name);
      setProgress(70);

      // Save analysis to database
      await saveAnalysisToDatabase(mockAnalysis);
      setProgress(90);

      // Generate job recommendations
      await generateJobRecommendations(mockAnalysis);
      setProgress(100);

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully"
      });

      onAnalysisComplete(mockAnalysis);
      
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const performMockAnalysis = async (fileName: string): Promise<ATSAnalysis> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      strengths: [
        "Strong technical skills section",
        "Quantified achievements",
        "Relevant work experience",
        "Clear formatting"
      ],
      weaknesses: [
        "Missing keywords for target roles",
        "No professional summary",
        "Limited soft skills mentions",
        "Could improve action verbs"
      ],
      targetJobs: [
        "Software Engineer",
        "Frontend Developer", 
        "Full Stack Developer",
        "React Developer"
      ],
      recommendations: [
        "Add more industry-specific keywords",
        "Include a professional summary",
        "Quantify more achievements with numbers",
        "Add relevant certifications"
      ],
      keywordMatch: Math.floor(Math.random() * 40) + 60, // 60-100
      sections: {
        contact: true,
        summary: Math.random() > 0.5,
        experience: true,
        education: true,
        skills: true
      }
    };
  };

  const saveAnalysisToDatabase = async (analysis: ATSAnalysis) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ats_score: analysis.score })
        .eq("user_id", user!.id);

      if (error) {
        console.error('Error saving analysis:', error);
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new Error('Network connection error. Please check your internet connection.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Database error in saveAnalysisToDatabase:', error);
      throw error;
    }
  };

  const generateJobRecommendations = async (analysis: ATSAnalysis) => {
    const realCompanies = [
      { name: "Google", type: "Tech Giant" },
      { name: "Microsoft", type: "Tech Giant" },
      { name: "Apple", type: "Tech Giant" },
      { name: "Meta", type: "Social Media" },
      { name: "Amazon", type: "E-commerce/Cloud" },
      { name: "Netflix", type: "Entertainment" },
      { name: "Spotify", type: "Music Streaming" },
      { name: "Uber", type: "Transportation" },
      { name: "Airbnb", type: "Travel" },
      { name: "Stripe", type: "Fintech" }
    ];

    const recommendations = analysis.targetJobs.slice(0, 3).map((job, index) => {
      const company = realCompanies[Math.floor(Math.random() * realCompanies.length)];
      return {
        user_id: user!.id,
        job_title: job,
        company: company.name,
        match_score: Math.floor(Math.random() * 20) + 80, // 80-100
        required_skills: analysis.strengths.slice(0, 3)
      };
    });

    try {
      for (const rec of recommendations) {
        const { error } = await supabase
          .from("job_recommendations")
          .insert(rec);
        
        if (error) {
          console.error('Error inserting job recommendation:', error);
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error('Network connection error. Please check your internet connection.');
          }
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Database error in generateJobRecommendations:', error);
      throw error;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Upload Resume for ATS Analysis
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your PDF here' : 'Upload your resume'}
              </p>
              <p className="text-muted-foreground mb-4">
                Drag and drop your PDF file here, or click to browse
              </p>
              <Button variant="outline">
                Choose PDF File
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing resume...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    {progress < 30 && "Reading PDF content..."}
                    {progress >= 30 && progress < 70 && "Analyzing ATS compatibility..."}
                    {progress >= 70 && progress < 90 && "Saving results..."}
                    {progress >= 90 && "Generating recommendations..."}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedFile(null)}
                  disabled={isAnalyzing}
                >
                  Upload Different File
                </Button>
                <Button 
                  onClick={analyzeResume}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};