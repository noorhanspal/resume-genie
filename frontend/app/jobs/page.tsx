"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Briefcase, Percent, CheckCircle2, XCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface JobMatch {
  job_title: string;
  company: string;
  location: string;
  apply_link: string;
  match_percentage: number;
  missing_skills: string[];
  why_it_fits: string;
}

interface JobsResponse {
  keyword: string;
  jobs: JobMatch[];
}

export default function JobsFinder() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobsResponse | null>(null);
  const [error, setError] = useState("");

  // Try to load default from saved resume
  useEffect(() => {
    if (!isLoaded || !user) return;
    const saved = localStorage.getItem(`resumes_${user.id}`);
    if (saved) {
      try {
        const resumes = JSON.parse(saved);
        if (resumes.length > 0) {
          const latest = resumes[0].resume_data;
          if (latest.job_title) setRole(latest.job_title);
          if (latest.skills && Array.isArray(latest.skills)) {
            setSkills(latest.skills.join(", "));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isLoaded, user]);

  const handleSearch = async () => {
    if (!role.trim() || !skills.trim()) {
      setError("Please fill in both Role and Skills.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch("http://localhost:8000/api/jobs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role,
          skills: skillsArray
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error("API returned failure");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while finding jobs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-transparent pb-20 text-foreground transition-colors duration-500 antialiased">
      <nav className="border-b border-white/20 dark:border-white/10 glass bg-white/40 dark:bg-slate-900/40 sticky top-0 w-full z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 dark:from-orange-400 dark:via-orange-300 dark:to-amber-300 tracking-tighter">
            Resume Genie
          </Link>
          <div className="flex items-center gap-3">
             <ThemeToggle />
             <Link href="/dashboard">
               <Button variant="ghost" className="glass-button rounded-full px-6 font-black text-slate-700 dark:text-slate-100">Dashboard</Button>
             </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="text-center mb-16 animate-pop-in">
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
            Find Your <span className="text-orange-600 dark:text-orange-400">Perfect Match</span> 🎯
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We use AI to find jobs that fit your profile instantly. 
            No more manual searching — just magic results.
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card bg-white/60 dark:bg-slate-900/60 p-10 mb-16 border-white/40 dark:border-white/10 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Target Role</label>
              <input
                type="text"
                className="w-full glass-card bg-white/20 dark:bg-slate-950/20 border-white/40 dark:border-white/10 h-14 rounded-2xl px-6 outline-none focus:ring-4 ring-orange-500/10 font-bold text-slate-800 dark:text-slate-100 tracking-tight"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Your Top Skills</label>
              <input
                type="text"
                className="w-full glass-card bg-white/20 dark:bg-slate-950/20 border-white/40 dark:border-white/10 h-14 rounded-2xl px-6 outline-none focus:ring-4 ring-orange-500/10 font-bold text-slate-800 dark:text-slate-100 tracking-tight"
                placeholder="e.g. React, JavaScript, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm mb-6 text-center font-bold tracking-tight">{error}</p>}

          <div className="text-center">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="glass-button bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-600/80 dark:to-amber-500/80 hover:from-orange-700 hover:to-amber-700 text-white px-12 h-16 text-xl rounded-2xl font-black shadow-2xl shadow-orange-500/20 transition-all active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Analyzing Match...
                </span>
              ) : (
                "Magic Search Jobs ✨"
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🔥 Hot Jobs For You
              </h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                Searched for: "{result.keyword}"
              </span>
            </div>

            {result.jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500">No matching jobs found today. Try refining your skills or role!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {result.jobs.map((job, idx) => (
                  <div key={idx} className="glass-card bg-white/60 dark:bg-slate-900/60 transition-all duration-500 overflow-hidden animate-pop-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="p-8 md:flex justify-between items-start gap-8 border-b border-white/20 dark:border-white/10">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                          {job.job_title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-base font-bold mb-6">
                          <Briefcase className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                          {job.company} • <span className="opacity-80 font-medium">{job.location}</span>
                        </p>

                        <div className="glass bg-blue-500/5 dark:bg-blue-400/5 rounded-3xl p-6 border-blue-500/10 dark:border-blue-400/10">
                          <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            <span className="text-blue-600 dark:text-blue-400 font-black tracking-tight mr-2 uppercase text-xs">AI INSIGHT</span>
                            {job.why_it_fits}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 md:mt-0 flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center animate-float" style={{ animationDelay: `${idx * -2}s` }}>
                           <div className="absolute inset-0 rounded-full border-[6px] border-slate-200 dark:border-slate-800" />
                           <div 
                             className={`absolute inset-0 rounded-full border-[6px] transition-all duration-1000 ${job.match_percentage >= 80 ? 'border-green-500' : job.match_percentage >= 60 ? 'border-orange-500' : 'border-red-500'}`}
                             style={{ clipPath: `conic-gradient(black ${job.match_percentage}%, transparent 0)` }}
                           />
                           <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                             {job.match_percentage}%
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-3">Match Accuracy</p>
                      </div>
                    </div>

                    <div className="px-8 py-5 bg-white/40 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex-1">
                        {job.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2">Focus on:</span>
                            {job.missing_skills.map(skill => (
                              <span key={skill} className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-black tracking-tight">
                            <CheckCircle2 className="w-5 h-5" /> PERFECT SKILL MATCH
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => window.open(job.apply_link, "_blank")}
                        className="glass-button bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full px-10 h-12 font-black tracking-tight shadow-xl"
                      >
                        Apply Now →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
