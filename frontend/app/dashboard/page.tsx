"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";


interface SavedResume {
  id: string;
  title: string;
  template: string;
  created_at: string;
  resume_data: Record<string, unknown>;
  enhanced_data: Record<string, unknown>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

const TEMPLATE_COLORS: Record<string, string> = {
  classic: "bg-blue-100 text-blue-700",
  modern: "bg-gray-800 text-white",
  minimal: "bg-gray-100 text-gray-700",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [enhanceFile, setEnhanceFile] = useState<File | null>(null);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const saved = localStorage.getItem(`resumes_${user.id}`);
    if (saved) setResumes(JSON.parse(saved));
  }, [isLoaded, user, router]);

  const handleOpen = (resume: SavedResume) => {
    sessionStorage.setItem("resumeData", JSON.stringify(resume.resume_data));
    sessionStorage.setItem("enhancedData", JSON.stringify(resume.enhanced_data));
    router.push("/preview");
  };

  const handleDownload = async (resume: SavedResume) => {
    try {
      const res = await fetch("http://localhost:8000/api/resume/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume.resume_data),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const rd = resume.resume_data as { personal_info?: { full_name?: string } };
      a.download = `${rd.personal_info?.full_name?.replace(/ /g, "_") ?? "resume"}_Resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this resume?")) return;
    setDeletingId(id);
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    if (user) localStorage.setItem(`resumes_${user.id}`, JSON.stringify(updated));
    setDeletingId(null);
  };

  const handleEnhance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enhanceFile || !enhancePrompt) {
      alert("Please upload a file and enter a prompt.");
      return;
    }

    setIsEnhancing(true);
    const formData = new FormData();
    formData.append("file", enhanceFile);
    formData.append("prompt", enhancePrompt);

    try {
      const response = await fetch("http://localhost:8000/api/resume/upload-enhance", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Enhancement failed");
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Store in sessionStorage to preview
        sessionStorage.setItem("resumeData", JSON.stringify(result.data.resume_data));
        sessionStorage.setItem("enhancedData", JSON.stringify(result.data.enhanced_data));
        router.push("/preview");
      }
    } catch (error: any) {
      console.error("Enhancement error:", error);
      alert(error.message || "Failed to enhance resume. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const displayName = user?.username || user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-transparent pb-32 text-foreground transition-colors duration-500 antialiased">
      <nav className="glass sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-3 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-sans font-normal tracking-tight text-foreground cursor-pointer">
              Resume Genie
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/smart-analysis" className="text-button-label text-foreground/60 hover:text-foreground transition-colors">Smart Analysis</Link>
              <Link href="/jobs" className="text-button-label text-foreground/60 hover:text-foreground transition-colors">Find Jobs</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-4 pl-4 border-l border-border">
               <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-[11px] font-sans font-medium text-foreground/60 border border-border">
                 {initials}
               </div>
               <button
                 onClick={() => signOut({ redirectUrl: "/" })}
                 className="text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/30 hover:text-destructive transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24">
        <header className="mb-20 animate-pop-in">
          <h1 className="text-section-heading text-foreground mb-4">
            Hello, {displayName}
          </h1>
          <p className="text-body-serif text-foreground/50">
            Welcome back. What would you like to build today?
          </p>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {/* Create Resume */}
          <Link href="/builder" className="group">
            <div className="glass-card p-10 h-full border-border hover:border-foreground/20">
              <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-title-small text-foreground mb-3 font-sans">Create</h3>
              <p className="text-body-serif-sm text-foreground/40 mb-8">
                Build a professional resume with our guided builder.
              </p>
              <span className="text-button-label text-foreground group-hover:text-destructive transition-colors">
                Start Building →
              </span>
            </div>
          </Link>

          {/* AI Enhancer (New) */}
          <button 
            onClick={() => setIsEnhancerOpen(true)}
            className="group text-left w-full h-full"
          >
            <div className="glass-card p-10 h-full border-border hover:border-foreground/20 bg-surface-50/10">
              <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🪄
              </div>
              <h3 className="text-title-small text-foreground mb-3 font-sans">AI Enhancer</h3>
              <p className="text-body-serif-sm text-foreground/40 mb-8">
                Upload existing resume and tell AI how to improve it.
              </p>
              <span className="text-button-label text-foreground group-hover:text-destructive transition-colors">
                Enhance now →
              </span>
            </div>
          </button>

          {/* Smart Analysis */}
          <Link href="/smart-analysis" className="group">
            <div className="glass-card p-10 h-full border-border hover:border-foreground/20">
              <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-title-small text-foreground mb-3 font-sans">Analyze</h3>
              <p className="text-body-serif-sm text-foreground/40 mb-8">
                Detect skills gaps and get improvement scores.
              </p>
              <span className="text-button-label text-foreground group-hover:text-destructive transition-colors">
                Analyze Now →
              </span>
            </div>
          </Link>

          {/* Find Jobs */}
          <Link href="/jobs" className="group">
            <div className="glass-card p-10 h-full border-border hover:border-foreground/20">
              <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-title-small text-foreground mb-3 font-sans">Job Match</h3>
              <p className="text-body-serif-sm text-foreground/40 mb-8">
                Find jobs that perfectly fit your specific skills.
              </p>
              <span className="text-button-label text-foreground group-hover:text-destructive transition-colors">
                Magic Match →
              </span>
            </div>
          </Link>
        </div>

        {/* Saved Resumes */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-title-small text-foreground uppercase tracking-widest text-xs opacity-40">
              Saved Resumes
            </h2>
            <div className="h-[1px] flex-1 bg-border mx-8" />
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-24 glass-card border-dashed">
              <p className="text-body-serif-sm text-foreground/40">No resumes saved yet. Start by creating one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumes.map((resume) => {
                const rd = resume.resume_data as { personal_info?: { full_name?: string }; job_title?: string };
                const name = rd.personal_info?.full_name ?? "Untitled";
                const jobTitle = rd.job_title ?? "";
                return (
                  <div key={resume.id} className="glass-card p-8 group">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-[10px] font-sans font-bold text-foreground">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="cursor-pill text-[9px] uppercase tracking-tighter">
                        {resume.template}
                      </span>
                    </div>
                    <div className="mb-10">
                      <h4 className="text-button-label text-foreground mb-1">{name}</h4>
                      {jobTitle && <p className="text-[12px] font-serif italic text-foreground/40">{jobTitle}</p>}
                      <p className="text-[10px] font-sans font-medium uppercase tracking-widest text-foreground/20 mt-4">
                        Saved {timeAgo(resume.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-border">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="cursor-button-primary !py-2 !h-auto flex-1 text-[11px]" 
                        onClick={() => handleOpen(resume)}
                      >
                        Open
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="cursor-button-primary !py-2 !h-auto flex-1 text-[11px]" 
                        onClick={() => handleDownload(resume)}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="cursor-button-primary !py-2 !h-auto text-destructive hover:!bg-destructive/5 text-[11px]"
                        onClick={() => handleDelete(resume.id)}
                        disabled={deletingId === resume.id}
                      >
                        {deletingId === resume.id ? "..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Enhancer Modal */}
      {isEnhancerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
            onClick={() => !isEnhancing && setIsEnhancerOpen(false)}
          />
          <div className="glass-card relative w-full max-w-xl p-10 animate-pop-in overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-title-small text-foreground font-sans">AI Resume Enhancer</h2>
              <button 
                onClick={() => setIsEnhancerOpen(false)}
                disabled={isEnhancing}
                className="text-foreground/30 hover:text-destructive transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEnhance} className="space-y-8">
              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 mb-3">
                  Upload Resume (PDF/DOCX)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setEnhanceFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="enhance-upload"
                  />
                  <label
                    htmlFor="enhance-upload"
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border group-hover:border-foreground/20 rounded-xl cursor-pointer transition-all bg-surface-100/30"
                  >
                    <span className="text-2xl mb-4">{enhanceFile ? "📄" : "📤"}</span>
                    <span className="text-body-serif-sm text-foreground/60">
                      {enhanceFile ? enhanceFile.name : "Select your resume file"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 mb-3">
                  What should AI improve?
                </label>
                <textarea
                  value={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.value)}
                  placeholder="Example: Tailor this for a Senior Frontend Role at Google, or make it more professional and data-driven."
                  className="w-full h-32 bg-surface-100/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-foreground/20 transition-colors resize-none text-foreground placeholder:text-foreground/20 font-serif"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEnhancerOpen(false)}
                  disabled={isEnhancing}
                  className="flex-1 cursor-button-primary !py-4 !h-auto text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isEnhancing || !enhanceFile || !enhancePrompt}
                  className="flex-1 cursor-button-primary border-border bg-foreground text-background hover:bg-foreground/90 !py-4 !h-auto text-[13px]"
                >
                  {isEnhancing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-lg">⏳</span> Magic in progress...
                    </span>
                  ) : (
                    "Enhance with AI"
                  )}
                </Button>
              </div>
            </form>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        </div>
      )}
    </div>

  );
}
