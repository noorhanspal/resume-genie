"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

const TEMPLATES: { id: TemplateId; label: string; description: string; color: string }[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Blue accents, traditional layout",
    color: "border-blue-500 bg-blue-50 text-blue-700",
  },
  {
    id: "modern",
    label: "Modern",
    description: "Dark header, emerald highlights",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean, black & white, serif",
    color: "border-gray-800 bg-gray-50 text-gray-800",
  },
];

export default function PreviewPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [enhancedData, setEnhancedData] = useState<EnhancedData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");

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

  if (!resumeData || !enhancedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const previewData = { ...resumeData, template: selectedTemplate };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/builder")}>
          ← Back to Edit
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Generating PDF..." : "📥 Download PDF"}
        </Button>
      </div>

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
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-10 overflow-hidden">
        {selectedTemplate === "classic" && (
          <ClassicTemplate resumeData={previewData} enhancedData={enhancedData} />
        )}
        {selectedTemplate === "modern" && (
          <ModernTemplate resumeData={previewData} enhancedData={enhancedData} />
        )}
        {selectedTemplate === "minimal" && (
          <MinimalTemplate resumeData={previewData} enhancedData={enhancedData} />
        )}
      </div>
    </div>
  );
}
