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
    <div className="min-h-screen bg-transparent pb-32 text-foreground transition-colors duration-500 antialiased">
      <nav className="glass sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-3 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-sans font-normal tracking-tight text-foreground cursor-pointer">
              Resume Genie
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/smart-analysis" className="text-button-label text-foreground/60 hover:text-destructive transition-colors">Smart Analysis</Link>
              <Link href="/jobs" className="text-button-label text-foreground hover:text-destructive transition-colors">Find Jobs</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLoaded ? null : user ? (
              <div className="flex items-center gap-4">
                <Link href="/builder">
                  <Button className="cursor-button-primary">
                    + New Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button className="cursor-button-primary">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-32">
        <div className="text-center mb-20 animate-pop-in">
          <h1 className="text-section-heading text-foreground mb-6">
            Find Your Match
          </h1>
          <p className="text-body-serif text-foreground/50 max-w-2xl mx-auto">
            We use AI to find jobs that fit your profile instantly. 
            No more manual searching — just magic results.
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-12 mb-16 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 ml-1">Target Role</label>
              <input
                type="text"
                className="w-full bg-surface-100 border border-border h-14 rounded-lg px-6 outline-none focus:border-foreground/30 font-sans text-foreground transition-all"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 ml-1">Your Top Skills</label>
              <input
                type="text"
                className="w-full bg-surface-100 border border-border h-14 rounded-lg px-6 outline-none focus:border-foreground/30 font-sans text-foreground transition-all"
                placeholder="e.g. React, JavaScript, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-destructive text-sm mb-8 text-center">{error}</p>}

          <div className="text-center">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="cursor-button-primary !py-5 !px-12 !h-auto text-lg !bg-foreground !text-background hover:!text-destructive"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Match...
                </span>
              ) : (
                "Search Jobs ✨"
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-10">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-title-small text-foreground uppercase tracking-wider">
                Recommended Jobs
              </h2>
              <span className="cursor-pill text-[10px] uppercase">
                {result.keyword}
              </span>
            </div>

            {result.jobs.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <p className="text-body-serif-sm text-foreground/40">No matching jobs found. Try refining your profile.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {result.jobs.map((job, idx) => (
                  <div key={idx} className="glass-card animate-pop-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="p-10 flex flex-col md:flex-row justify-between items-start gap-10">
                      <div className="flex-1">
                        <h3 className="text-title-small text-foreground mb-3">
                          {job.job_title}
                        </h3>
                        <p className="flex items-center gap-3 text-body-serif-sm text-foreground/40 mb-8">
                          <Briefcase className="w-4 h-4 opacity-40" />
                          {job.company} • {job.location}
                        </p>

                        <div className="bg-surface-100 p-8 rounded-lg border border-border">
                          <p className="text-body-serif-sm text-foreground/70 leading-relaxed italic">
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent mb-3 block">AI Insight</span>
                            "{job.why_it_fits}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                           <svg width="96" height="96" className="-rotate-90">
                             <circle cx="48" cy="48" r="40" fill="none" stroke="var(--border)" strokeWidth="4" />
                             <circle
                               cx="48" cy="48" r="40" fill="none"
                               stroke={job.match_percentage >= 80 ? 'var(--color-success)' : job.match_percentage >= 60 ? 'var(--accent)' : 'var(--destructive)'}
                               strokeWidth="4"
                               strokeDasharray={251.3}
                               strokeDashoffset={251.3 - (job.match_percentage / 100) * 251.3}
                               strokeLinecap="round"
                               className="transition-all duration-1000"
                             />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-xl font-sans font-normal text-foreground">{job.match_percentage}%</span>
                           </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-foreground/30 mt-4">Match</p>
                      </div>
                    </div>

                    <div className="px-10 py-6 bg-surface-100 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                      <div className="flex-1">
                        {job.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-3 items-center">
                            <span className="text-[10px] uppercase tracking-widest text-foreground/30 mr-2">Focus area:</span>
                            {job.missing_skills.map(skill => (
                              <span key={skill} className="bg-destructive/5 text-destructive border border-destructive/10 text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-tighter">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-success text-[11px] font-medium uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> Perfect skill match
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => window.open(job.apply_link, "_blank")}
                        className="cursor-button-primary !px-10 h-11"
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
