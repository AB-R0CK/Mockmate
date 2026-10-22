import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { X, Plus } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
}

export const ResumeCreator = ({ onClose, onResumeCreated }: { onClose: () => void; onResumeCreated?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    education: [{ id: "1", degree: "", institution: "", year: "" }],
    experience: [{ id: "1", title: "", company: "", duration: "", description: "" }],
    skills: [""]
  });

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), degree: "", institution: "", year: "" }]
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), title: "", company: "", duration: "", description: "" }]
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to create a resume",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving resume for user:', user.id);
      const { error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${resumeData.personal.fullName || 'Untitled'}'s Resume`,
          content: resumeData as any,
          template_name: "Modern"
        });

      if (error) {
        console.error('Error creating resume:', error);
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new Error('Network connection error. Please check your internet connection.');
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Resume created successfully!"
      });
      onClose();
      onResumeCreated?.();
    } catch (error: any) {
      console.error("Error creating resume:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create New Resume
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resumeData.personal.fullName}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, fullName: e.target.value }
                    }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personal.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, email: e.target.value }
                    }))}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personal.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personal.location}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, location: e.target.value }
                    }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={resumeData.personal.summary}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, summary: e.target.value }
                  }))}
                  placeholder="Brief summary of your professional background and goals"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button onClick={addEducation} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="border border-border rounded-lg p-4 relative">
                  {resumeData.education.length > 1 && (
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor's in Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                        placeholder="2020-2024"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button onClick={addExperience} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="border border-border rounded-lg p-4 relative">
                  {resumeData.experience.length > 1 && (
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={exp.duration}
                          onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                          placeholder="Jan 2022 - Present"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button onClick={addSkill} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder="e.g., JavaScript, React, Python"
                    />
                    {resumeData.skills.length > 1 && (
                      <Button
                        onClick={() => removeSkill(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Resume"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};