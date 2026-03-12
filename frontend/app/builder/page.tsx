"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeData, WorkExperience, Education, Project } from "@/lib/types";

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Projects"];

const defaultResumeData: ResumeData = {
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  work_experience: [
    { company: "", role: "", start_date: "", end_date: "", responsibilities: "" },
  ],
  education: [
    { institution: "", degree: "", field: "", graduation_year: "", gpa: "" },
  ],
  skills: [],
  projects: [{ name: "", description: "", technologies: "", link: "" }],
  job_title: "",
};

export default function BuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const updatePersonal = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value },
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setData((prev) => {
      const updated = [...prev.work_experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, work_experience: updated };
    });
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        { company: "", role: "", start_date: "", end_date: "", responsibilities: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", field: "", graduation_year: "", gpa: "" },
      ],
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", technologies: "", link: "" }],
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }
      const result = await res.json();
      sessionStorage.setItem("resumeData", JSON.stringify(data));
      sessionStorage.setItem("enhancedData", JSON.stringify(result.data));
      router.push("/preview");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Resume <span className="text-blue-600">Genie</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Step: Personal Info */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Full Name *</Label>
                  <Input
                    value={data.personal_info.full_name}
                    onChange={(e) => updatePersonal("full_name", e.target.value)}
                    placeholder="Ali Ahmed"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Target Job Title</Label>
                  <Input
                    value={data.job_title}
                    onChange={(e) => setData((prev) => ({ ...prev, job_title: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={data.personal_info.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    placeholder="ali@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone *</Label>
                  <Input
                    value={data.personal_info.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Location *</Label>
                <Input
                  value={data.personal_info.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  placeholder="Lahore, Pakistan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>LinkedIn (optional)</Label>
                  <Input
                    value={data.personal_info.linkedin}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/aliahmed"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Website/Portfolio (optional)</Label>
                  <Input
                    value={data.personal_info.website}
                    onChange={(e) => updatePersonal("website", e.target.value)}
                    placeholder="aliahmed.dev"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Brief Summary (optional — AI will enhance it)</Label>
                <Textarea
                  value={data.personal_info.summary}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                  placeholder="3+ years of experience in web development..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Work Experience */}
        {step === 1 && (
          <div className="space-y-4">
            {data.work_experience.map((exp, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Experience {i + 1}</CardTitle>
                  {data.work_experience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeExperience(i)}
                    >
                      Remove
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(i, "company", e.target.value)}
                        placeholder="Google"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Job Title *</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(i, "role", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Start Date *</Label>
                      <Input
                        value={exp.start_date}
                        onChange={(e) => updateExperience(i, "start_date", e.target.value)}
                        placeholder="Jan 2022"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>End Date *</Label>
                      <Input
                        value={exp.end_date}
                        onChange={(e) => updateExperience(i, "end_date", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Responsibilities *</Label>
                    <Textarea
                      value={exp.responsibilities}
                      onChange={(e) => updateExperience(i, "responsibilities", e.target.value)}
                      placeholder="Built REST APIs, developed frontend features, led a team of 3..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-400">
                      Write anything you did — AI will convert it into professional bullet points
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full">
              + Add Another Experience
            </Button>
          </div>
        )}

        {/* Step: Education */}
        {step === 2 && (
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">Education {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>University / College *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(i, "institution", e.target.value)}
                      placeholder="MIT, Stanford, IIT..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, "degree", e.target.value)}
                        placeholder="BS, MS, BE..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Field of Study *</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(i, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Graduation Year *</Label>
                      <Input
                        value={edu.graduation_year}
                        onChange={(e) => updateEducation(i, "graduation_year", e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(i, "gpa", e.target.value)}
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full">
              + Add Another Education
            </Button>
          </div>
        )}

        {/* Step: Skills */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="React, Python, Docker..."
                />
                <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Press Enter or click Add
              </p>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-gray-50">
                {data.skills.length === 0 && (
                  <p className="text-gray-400 text-sm">No skills added yet...</p>
                )}
                {data.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-red-100 hover:text-red-800 transition-colors"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-400">Click a skill to remove it</p>
            </CardContent>
          </Card>
        )}

        {/* Step: Projects */}
        {step === 4 && (
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">Project {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Project Name *</Label>
                    <Input
                      value={proj.name}
                      onChange={(e) => updateProject(i, "name", e.target.value)}
                      placeholder="E-Commerce App"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description *</Label>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(i, "description", e.target.value)}
                      placeholder="An online store where users can browse and purchase products..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Technologies *</Label>
                      <Input
                        value={proj.technologies}
                        onChange={(e) => updateProject(i, "technologies", e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Link (optional)</Label>
                      <Input
                        value={proj.link}
                        onChange={(e) => updateProject(i, "link", e.target.value)}
                        placeholder="github.com/ali/project"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addProject} className="w-full">
              + Add Another Project
            </Button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            ← Previous
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating your resume..." : "✨ Generate Resume"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
