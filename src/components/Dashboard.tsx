import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Download,
  Share,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface JobRecommendationData {
  id: string;
  job_title: string;
  company: string;
  match_score: number;
  required_skills: string[];
}

interface UserProfile {
  ats_score: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendationData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile - use maybeSingle() to handle missing profiles gracefully
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ats_score")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setUserProfile(profile);
      }

      // Fetch job recommendations
      const { data: jobs, error: jobsError } = await supabase
        .from("job_recommendations")
        .select("*")
        .eq("user_id", user!.id)
        .order("match_score", { ascending: false })
        .limit(5);

      if (jobsError) {
        console.error("Error fetching job recommendations:", jobsError);
      } else {
        setJobRecommendations(jobs || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Your Resume Analytics Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive analysis and insights for your career advancement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ATS Score Card */}
          <Card className="lg:col-span-2 bg-gradient-glass backdrop-blur-glass border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">ATS Compatibility Score</h3>
                  <p className="text-muted-foreground">Applicant Tracking System Analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {userProfile?.ats_score || 0}%
                </div>
                <Badge variant="secondary" className="mt-1">
                  {(userProfile?.ats_score || 0) >= 90 ? "Excellent" : 
                   (userProfile?.ats_score || 0) >= 70 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Keyword Optimization</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Format Compatibility</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Content Structure</span>
                  <span>74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="hero" size="sm">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Button variant="glass" size="sm">
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-glass backdrop-blur-glass border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors">
                <Edit className="w-4 h-4 mr-2" />
                Edit Resume
              </Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Try New Template
              </Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors">
                <Target className="w-4 h-4 mr-2" />
                View Job Matches
              </Button>
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors">
                <TrendingUp className="w-4 h-4 mr-2" />
                Skill Analysis
              </Button>
            </div>
          </Card>

          {/* Job Recommendations */}
          <Card className="lg:col-span-2 bg-gradient-glass backdrop-blur-glass border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Recommended Positions</h3>
                <p className="text-muted-foreground">Based on your profile analysis</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Loading recommendations...</p>
                </div>
              ) : jobRecommendations.length > 0 ? (
                jobRecommendations.map((job) => (
                  <JobRecommendation 
                    key={job.id}
                    title={job.job_title}
                    company={job.company}
                    match={`${job.match_score}%`}
                    location="Remote / On-site"
                    salary="Competitive"
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <Target className="w-12 h-12 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-medium">No recommendations yet</p>
                    <p className="text-sm text-muted-foreground/70">Upload your resume to get personalized job matches</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Skill Gaps */}
          <Card className="bg-gradient-glass backdrop-blur-glass border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Skill Gaps</h3>
                <p className="text-muted-foreground text-sm">Areas for improvement</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <SkillGap skill="Cloud Computing" priority="High" />
              <SkillGap skill="DevOps" priority="Medium" />
              <SkillGap skill="Machine Learning" priority="Low" />
            </div>

            <Button variant="neon" size="sm" className="w-full mt-4">
              Start Learning Path
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

const JobRecommendation = ({ title, company, match, location, salary }: {
  title: string;
  company: string;
  match: string;
  location: string;
  salary: string;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-white/5">
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{company} • {location}</p>
        <p className="text-sm text-primary">{salary}</p>
      </div>
      <div className="text-right">
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {match} Match
        </Badge>
      </div>
    </div>
  );
};

const SkillGap = ({ skill, priority }: { skill: string; priority: string }) => {
  const priorityColors = {
    High: "text-destructive",
    Medium: "text-secondary",
    Low: "text-muted-foreground"
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
      <span className="text-sm font-medium">{skill}</span>
      <Badge variant="outline" className={`text-xs ${priorityColors[priority as keyof typeof priorityColors]}`}>
        {priority}
      </Badge>
    </div>
  );
};