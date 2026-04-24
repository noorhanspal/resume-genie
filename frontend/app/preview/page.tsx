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
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  { id: "professional", label: "Professional", description: "Top Academic format", color: "border-gray-900 bg-gray-100 text-gray-900" },
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
    <div className="min-h-screen bg-black text-white transition-colors duration-500 py-10 px-4 antialiased font-sans">
      {/* Action Bar */}
      <div className="max-w-[1200px] mx-auto mb-10 flex flex-col sm:flex-row gap-6 justify-between items-center bg-[#202020] p-6 border border-[#494949] animate-pop-in transition-all duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="cursor-button-primary bg-transparent text-white hover:bg-[#181818] border border-white/20 hover:border-white rounded-none px-6" onClick={() => router.push("/builder")}>
            ← EDIT
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className={`cursor-button-primary transition-all rounded-none px-6 ${isEditing ? 'bg-white text-black hover:bg-[#e6e6e6]' : 'bg-transparent text-white border border-white/20 hover:border-white hover:bg-[#181818]'}`}
          >
            {isEditing ? "✏️ SUBMIT EDITS" : "✏️ MANUAL EDIT"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowAts((v) => !v)}
            className={`cursor-button-primary transition-all rounded-none px-6 ${showAts ? 'bg-[#FFC000] text-black hover:bg-[#917300]' : 'bg-transparent text-white border border-white/20 hover:border-white hover:bg-[#181818]'}`}
          >
            {showAts ? "HIDE CHECK" : "🎯 ATS MATCH"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleSave}
            disabled={saving}
            className="cursor-button-primary bg-transparent text-white border border-white/20 hover:border-white hover:bg-[#181818] rounded-none px-6"
          >
            {saving ? "SAVING..." : saveStatus === "saved" ? "✓ SAVED" : "💾 SAVE"}
          </Button>
          <Button
            className="cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] rounded-none px-6 border-none"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "GENERATING..." : "📥 DOWNLOAD PDF"}
          </Button>
        </div>
      </div>


      {/* ATS Panel */}
      {showAts && (
        <div className="max-w-[1200px] mx-auto mb-6 bg-[#202020] border border-[#494949] rounded-none overflow-hidden">
          <div className="bg-[#181818] border-b border-[#494949] px-6 py-4">
            <h2 className="text-[16px] uppercase font-normal text-white tracking-[0.2px]">ATS MATCH CHECKER</h2>
            <p className="text-[12px] text-[#7D7D7D] uppercase tracking-[0.96px] mt-1">
              PASTE THE JOB DESCRIPTION TO SEE HOW WELL YOUR RESUME MATCHES IT.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="PASTE THE FULL JOB DESCRIPTION HERE..."
              rows={6}
              className="text-[16px] bg-[#181818] border-[#494949] text-white focus:border-white resize-none rounded-none placeholder:text-[#494949] uppercase"
            />
            <Button
              onClick={handleATSCheck}
              disabled={atsLoading || !jobDescription.trim()}
              className="cursor-button-primary bg-[#FFC000] hover:bg-[#917300] text-black rounded-none px-6"
            >
              {atsLoading ? "ANALYZING..." : "ANALYZE MATCH"}
            </Button>

            {atsError && (
              <p className="text-[14px] text-[#cf2d56] uppercase">{atsError}</p>
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
      <div className="max-w-[1200px] mx-auto mb-12 bg-[#202020] border border-[#494949] p-10 rounded-none animate-pop-in">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-[27px] text-white uppercase tracking-wider">CHOOSE TEMPLATE</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex flex-col border p-5 text-left transition-all duration-300 rounded-none ${
                selectedTemplate === t.id
                  ? "border-[#FFC000] bg-[#181818]"
                  : "border-[#494949] hover:border-white hover:bg-[#181818]"
              }`}
            >
              <p className="text-[16px] text-white uppercase mb-1">{t.label}</p>
              <p className="text-[10px] font-sans font-medium uppercase tracking-[0.96px] text-[#7D7D7D]">{t.id}</p>
              <div className={`h-[2px] w-8 mt-4 transition-all duration-500 ${selectedTemplate === t.id ? "bg-[#FFC000] w-12" : "bg-[#494949]"}`} />
            </button>
          ))}
        </div>
      </div>


      {/* Resume Preview */}
      <div className={`max-w-[1200px] mx-auto bg-white p-10 relative z-10 transition-all duration-700 animate-slide-up print:shadow-none print:bg-transparent ${isEditing ? 'ring-[4px] ring-[#FFC000]/50 border-2 border-[#FFC000]' : 'border border-[#494949]'}`}>
        <div key={selectedTemplate} className="animate-pop-in">
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
          {selectedTemplate === "professional" && (
            <ProfessionalTemplate 
              resumeData={previewData} 
              enhancedData={enhancedData} 
              isEditing={isEditing} 
              onUpdateResume={setResumeData} 
              onUpdateEnhanced={setEnhancedData} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
