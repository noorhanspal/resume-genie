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
    <div className="min-h-screen bg-black pb-32 text-white font-sans antialiased">
      <nav className="fixed top-0 w-full z-50 bg-transparent px-6 py-6 transition-all duration-500">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center gap-8 justify-start">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-6 h-[2px] bg-white group-hover:bg-[#FFC000] transition-colors relative before:absolute before:w-6 before:h-[2px] before:bg-inherit before:-top-2 after:absolute after:w-6 after:h-[2px] after:bg-inherit after:top-2" />
              <span className="text-[14px] uppercase tracking-[0.2px] ml-4 font-normal hover:text-[#FFC000] transition-colors hidden md:block">Menu</span>
            </Link>
          </div>
          
          <div className="flex justify-center items-center">
            <Link href="/" className="text-[24px] uppercase tracking-wider font-normal text-white">
              Resume Genie
            </Link>
          </div>

          <div className="flex items-center gap-6 justify-end">
            <Link href="/smart-analysis" className="text-[12px] uppercase tracking-[0.96px] text-[#FFFFFF] hover:text-[#FFC000] transition-colors hidden md:block">Smart Analysis</Link>
            <Link href="/jobs" className="text-[12px] uppercase tracking-[0.96px] text-[#FFFFFF] hover:text-[#FFC000] transition-colors hidden md:block">Find Jobs</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-[#202020]">
               <div className="w-8 h-8 rounded-none bg-[#202020] flex items-center justify-center text-[11px] font-sans font-medium text-white border border-[#494949]">
                 {initials}
               </div>
               <button
                 onClick={() => signOut({ redirectUrl: "/" })}
                 className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#7D7D7D] hover:text-[#FFC000] transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-32 mt-16">
        <header className="mb-20 animate-pop-in">
          <h1 className="text-[80px] uppercase text-white mb-4 leading-[1.13]">
            HELLO, {displayName}
          </h1>
          <p className="text-[18px] text-[#7D7D7D] uppercase leading-[1.56]">
            WELCOME BACK. WHAT WOULD YOU LIKE TO BUILD TODAY?
          </p>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {/* Create Resume */}
          <Link href="/builder" className="group">
            <div className="bg-[#202020] p-10 h-full border-b border-[#000000] hover:bg-[#181818] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#181818] flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-[24px] uppercase text-white mb-3">CREATE</h3>
              <p className="text-[16px] text-[#7D7D7D] mb-8 uppercase leading-[1.50]">
                BUILD A PROFESSIONAL RESUME WITH OUR GUIDED BUILDER.
              </p>
              <span className="text-[14.4px] uppercase tracking-[0.2px] text-white group-hover:text-[#FFC000] transition-colors">
                START BUILDING →
              </span>
            </div>
          </Link>

          {/* AI Enhancer (New) */}
          <button 
            onClick={() => setIsEnhancerOpen(true)}
            className="group text-left w-full h-full"
          >
            <div className="bg-[#202020] p-10 h-full border-b border-[#000000] hover:bg-[#181818] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#181818] flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🪄
              </div>
              <h3 className="text-[24px] uppercase text-white mb-3">AI ENHANCER</h3>
              <p className="text-[16px] text-[#7D7D7D] mb-8 uppercase leading-[1.50]">
                UPLOAD EXISTING RESUME AND TELL AI HOW TO IMPROVE IT.
              </p>
              <span className="text-[14.4px] uppercase tracking-[0.2px] text-white group-hover:text-[#FFC000] transition-colors">
                ENHANCE NOW →
              </span>
            </div>
          </button>

          {/* Smart Analysis */}
          <Link href="/smart-analysis" className="group">
            <div className="bg-[#202020] p-10 h-full border-b border-[#000000] hover:bg-[#181818] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#181818] flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-[24px] uppercase text-white mb-3">ANALYZE</h3>
              <p className="text-[16px] text-[#7D7D7D] mb-8 uppercase leading-[1.50]">
                DETECT SKILLS GAPS AND GET IMPROVEMENT SCORES.
              </p>
              <span className="text-[14.4px] uppercase tracking-[0.2px] text-white group-hover:text-[#FFC000] transition-colors">
                ANALYZE NOW →
              </span>
            </div>
          </Link>

          {/* Find Jobs */}
          <Link href="/jobs" className="group">
            <div className="bg-[#202020] p-10 h-full border-b border-[#000000] hover:bg-[#181818] transition-colors duration-300">
              <div className="w-12 h-12 bg-[#181818] flex items-center justify-center text-xl mb-8 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-[24px] uppercase text-white mb-3">JOB MATCH</h3>
              <p className="text-[16px] text-[#7D7D7D] mb-8 uppercase leading-[1.50]">
                FIND JOBS THAT PERFECTLY FIT YOUR SPECIFIC SKILLS.
              </p>
              <span className="text-[14.4px] uppercase tracking-[0.2px] text-white group-hover:text-[#FFC000] transition-colors">
                MAGIC MATCH →
              </span>
            </div>
          </Link>
        </div>

        {/* Saved Resumes */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[27px] uppercase text-white tracking-[0.2px]">
              SAVED RESUMES
            </h2>
            <div className="h-[1px] flex-1 bg-[#202020] mx-8" />
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-24 bg-[#181818] border border-[#202020]">
              <p className="text-[16px] text-[#7D7D7D] uppercase">NO RESUMES SAVED YET. START BY CREATING ONE ABOVE.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumes.map((resume) => {
                const rd = resume.resume_data as { personal_info?: { full_name?: string }; job_title?: string };
                const name = rd.personal_info?.full_name ?? "Untitled";
                const jobTitle = rd.job_title ?? "";
                return (
                  <div key={resume.id} className="bg-[#202020] p-8 group hover:bg-[#181818] transition-colors border-b border-[#000000]">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-12 h-12 bg-[#181818] flex items-center justify-center text-[14px] uppercase text-white font-normal">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="cursor-pill text-[10px] uppercase tracking-tighter">
                        {resume.template}
                      </span>
                    </div>
                    <div className="mb-10">
                      <h4 className="text-[16px] text-white uppercase mb-1">{name}</h4>
                      {jobTitle && <p className="text-[14px] uppercase text-[#7D7D7D]">{jobTitle}</p>}
                      <p className="text-[10px] uppercase tracking-widest text-[#494949] mt-4">
                        SAVED {timeAgo(resume.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-[#181818]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="cursor-button-primary !py-2 !px-0 bg-transparent hover:bg-[#181818] text-white flex-1 text-[13px] border border-white/20 hover:border-white" 
                        onClick={() => handleOpen(resume)}
                      >
                        OPEN
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="cursor-button-primary !py-2 !px-0 bg-transparent hover:bg-[#181818] text-white flex-1 text-[13px] border border-white/20 hover:border-white" 
                        onClick={() => handleDownload(resume)}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="cursor-button-primary !py-2 !px-0 bg-transparent text-[#cf2d56] flex-1 text-[13px] border border-[#cf2d56]/20 hover:border-[#cf2d56] hover:bg-[#cf2d56]/10"
                        onClick={() => handleDelete(resume.id)}
                        disabled={deletingId === resume.id}
                      >
                        {deletingId === resume.id ? "..." : "DELETE"}
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
            className="absolute inset-0 bg-black/80"
            onClick={() => !isEnhancing && setIsEnhancerOpen(false)}
          />
          <div className="bg-[#202020] relative w-full max-w-xl p-10 animate-pop-in overflow-hidden border border-[#494949]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[27px] uppercase text-white font-sans">AI RESUME ENHANCER</h2>
              <button 
                onClick={() => setIsEnhancerOpen(false)}
                disabled={isEnhancing}
                className="text-[#7D7D7D] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEnhance} className="space-y-8">
              <div>
                <label className="block text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] mb-3">
                  UPLOAD RESUME (PDF/DOCX)
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
                    className="flex flex-col items-center justify-center p-12 border border-dashed border-[#494949] group-hover:border-white cursor-pointer transition-all bg-[#181818]"
                  >
                    <span className="text-2xl mb-4 opacity-50 grayscale">{enhanceFile ? "📄" : "📤"}</span>
                    <span className="text-[16px] text-[#7D7D7D] uppercase">
                      {enhanceFile ? enhanceFile.name : "SELECT YOUR RESUME FILE"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] mb-3">
                  WHAT SHOULD AI IMPROVE?
                </label>
                <textarea
                  value={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.value)}
                  placeholder="EXAMPLE: TAILOR THIS FOR A SENIOR FRONTEND ROLE AT GOOGLE, OR MAKE IT MORE PROFESSIONAL AND DATA-DRIVEN."
                  className="w-full h-32 bg-[#181818] border border-[#494949] p-4 text-[16px] focus:outline-none focus:border-white transition-colors resize-none text-white placeholder:text-[#494949] uppercase"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEnhancerOpen(false)}
                  disabled={isEnhancing}
                  className="flex-1 cursor-button-primary bg-transparent text-white border border-white/20 hover:border-white hover:bg-[#181818] !py-4 text-[14.4px]"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  disabled={isEnhancing || !enhanceFile || !enhancePrompt}
                  className="flex-1 cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] border-none !py-4 text-[14.4px]"
                >
                  {isEnhancing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-lg">⏳</span> MAGIC IN PROGRESS...
                    </span>
                  ) : (
                    "ENHANCE WITH AI"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}
