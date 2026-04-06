"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { ResumeData, TemplateId } from "@/lib/types";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";

interface EnhancedExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

interface EnhancedProject {
  name: string;
  description: string;
  technologies: string;
}

interface EnhancedData {
  professional_summary: string;
  enhanced_experience: EnhancedExperience[];
  enhanced_projects: EnhancedProject[];
}

interface ATSResult {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  summary: string;
}

const TEMPLATES: { id: TemplateId; label: string; description: string; color: string }[] = [
  { id: "classic", label: "Classic", description: "Blue accents, traditional layout", color: "border-blue-500 bg-blue-50 text-blue-700" },
  { id: "modern", label: "Modern", description: "Dark header, emerald highlights", color: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  { id: "minimal", label: "Minimal", description: "Clean, black & white, serif", color: "border-gray-800 bg-gray-50 text-gray-800" },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[100px] h-[100px]">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold" style={{ color }}>{score}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">ATS Score</p>
    </div>
  );
}

export default function PreviewPage() {
  const router = useRouter();
  const { user } = useUser();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [enhancedData, setEnhancedData] = useState<EnhancedData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saved" | "error">("");
  const [isEditing, setIsEditing] = useState(false);

  // ATS state
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState("");
  const [showAts, setShowAts] = useState(false);

  useEffect(() => {
    const rd = sessionStorage.getItem("resumeData");
    const ed = sessionStorage.getItem("enhancedData");
    if (!rd || !ed) {
      router.push("/builder");
      return;
    }
    const parsed: ResumeData = JSON.parse(rd);
    setSelectedTemplate(parsed.template || "classic");
    setResumeData(parsed);
    setEnhancedData(JSON.parse(ed));
  }, [router]);

  const handleDownload = async () => {
    if (!resumeData) return;
    setDownloading(true);
    try {
      const payload = { ...resumeData, template: selectedTemplate };
      const res = await fetch("http://localhost:8000/api/resume/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.personal_info.full_name.replace(/ /g, "_")}_Resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = () => {
    if (!resumeData || !enhancedData || !user) return;
    setSaving(true);
    setSaveStatus("");
    try {
      const key = `resumes_${user.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const newResume = {
        id: Date.now().toString(),
        title: resumeData.personal_info?.full_name || "Untitled",
        template: selectedTemplate,
        created_at: new Date().toISOString(),
        resume_data: { ...resumeData, template: selectedTemplate },
        enhanced_data: enhancedData,
      };
      localStorage.setItem(key, JSON.stringify([newResume, ...existing]));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
    setSaving(false);
  };

  const handleATSCheck = async () => {
    if (!resumeData || !jobDescription.trim()) return;
    setAtsLoading(true);
    setAtsError("");
    setAtsResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/resume/ats-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_data: resumeData, job_description: jobDescription }),
      });
      if (!res.ok) throw new Error("ATS analysis failed");
      const json = await res.json();
      setAtsResult(json.data);
    } catch {
      setAtsError("Failed to analyze. Please try again.");
    } finally {
      setAtsLoading(false);
    }
  };

  if (!resumeData || !enhancedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const previewData = { ...resumeData, template: selectedTemplate };
  const scoreColor = atsResult
    ? atsResult.score >= 75 ? "text-green-600" : atsResult.score >= 50 ? "text-amber-600" : "text-red-600"
    : "";
  const scoreLabel = atsResult
    ? atsResult.score >= 75 ? "Strong Match" : atsResult.score >= 50 ? "Moderate Match" : "Weak Match"
    : "";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/builder")}>
          ← Back to Edit
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={`border-blue-300 ${isEditing ? 'bg-blue-100 text-blue-800' : 'text-blue-700 hover:bg-blue-50'}`}
          >
            {isEditing ? "✏️ Done Editing" : "✏️ Manual Edit"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAts((v) => !v)}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {showAts ? "Hide ATS Check" : "🎯 ATS Match Check"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {saving ? "Saving..." : saveStatus === "saved" ? "✓ Saved" : "💾 Save Resume"}
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Generating PDF..." : "📥 Download PDF"}
          </Button>
        </div>
      </div>

      {/* ATS Panel */}
      {showAts && (
        <div className="max-w-4xl mx-auto mb-6 bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden">
          <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">ATS Match Checker</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste the job description to see how well your resume matches it.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={6}
              className="text-sm resize-none"
            />
            <Button
              onClick={handleATSCheck}
              disabled={atsLoading || !jobDescription.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {atsLoading ? "Analyzing..." : "Analyze Match"}
            </Button>

            {atsError && (
              <p className="text-sm text-red-600">{atsError}</p>
            )}

            {/* ATS Results */}
            {atsResult && (
              <div className="border-t pt-5 mt-2 space-y-5">
                {/* Score Row */}
                <div className="flex items-center gap-6">
                  <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                    <ScoreRing score={atsResult.score} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${scoreColor}`}>{scoreLabel}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{atsResult.summary}</p>
                  </div>
                </div>

                {/* Keywords Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Matched */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                      ✓ Matched Keywords ({atsResult.matched_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.matched_keywords.map((kw) => (
                        <Badge key={kw} className="bg-green-100 text-green-800 border border-green-200 text-xs font-normal">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">
                      ✗ Missing Keywords ({atsResult.missing_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missing_keywords.map((kw) => (
                        <Badge key={kw} className="bg-red-100 text-red-800 border border-red-200 text-xs font-normal">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">
                    💡 How to Improve
                  </p>
                  <ul className="space-y-2">
                    {atsResult.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-amber-500 font-bold flex-shrink-0">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Selector */}
      <div className="max-w-4xl mx-auto mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">
          Choose Template
        </p>
        <div className="flex gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex-1 border-2 rounded-lg px-4 py-3 text-left transition-all ${
                selectedTemplate === t.id
                  ? t.color + " border-2"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <p className="font-semibold text-sm">{t.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Preview */}
      <div className={`max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-10 overflow-hidden ${isEditing ? 'ring-2 ring-blue-400' : ''}`}>
        {selectedTemplate === "classic" && (
          <ClassicTemplate 
            resumeData={previewData} 
            enhancedData={enhancedData} 
            isEditing={isEditing} 
            onUpdateResume={setResumeData} 
            onUpdateEnhanced={setEnhancedData} 
          />
        )}
        {selectedTemplate === "modern" && (
          <ModernTemplate 
            resumeData={previewData} 
            enhancedData={enhancedData} 
            isEditing={isEditing} 
            onUpdateResume={setResumeData} 
            onUpdateEnhanced={setEnhancedData} 
          />
        )}
        {selectedTemplate === "minimal" && (
          <MinimalTemplate 
            resumeData={previewData} 
            enhancedData={enhancedData} 
            isEditing={isEditing} 
            onUpdateResume={setResumeData} 
            onUpdateEnhanced={setEnhancedData} 
          />
        )}
      </div>
    </div>
  );
}
