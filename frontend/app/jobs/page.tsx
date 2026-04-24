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
    <div className="min-h-screen bg-black pb-32 text-white transition-colors duration-500 antialiased font-sans">
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
            {!isLoaded ? null : user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link href="/builder">
                  <Button className="cursor-button-primary bg-[#FFC000] hover:bg-[#917300] text-black uppercase tracking-[0.2px] rounded-none border-none">
                    + NEW RESUME
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login" className="ml-4">
                <Button className="cursor-button-primary bg-[#FFC000] hover:bg-[#917300] text-black uppercase tracking-[0.2px] rounded-none border-none">
                  LOGIN
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-32 mt-16">
        <div className="text-center mb-20 animate-pop-in">
          <h1 className="text-[80px] uppercase text-white mb-6 leading-[1.13]">
            FIND YOUR MATCH
          </h1>
          <p className="text-[18px] text-[#7D7D7D] max-w-2xl mx-auto uppercase leading-[1.56]">
            WE USE AI TO FIND JOBS THAT FIT YOUR PROFILE INSTANTLY. 
            NO MORE MANUAL SEARCHING — JUST MAGIC RESULTS.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-[#202020] border border-[#494949] p-12 mb-16 animate-slide-up rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] ml-1">TARGET ROLE</label>
              <input
                type="text"
                className="w-full bg-[#181818] border border-[#494949] h-14 px-6 outline-none focus:border-white text-[16px] text-white uppercase placeholder:text-[#494949] transition-all rounded-none"
                placeholder="E.G. FRONTEND DEVELOPER"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] ml-1">YOUR TOP SKILLS</label>
              <input
                type="text"
                className="w-full bg-[#181818] border border-[#494949] h-14 px-6 outline-none focus:border-white text-[16px] text-white uppercase placeholder:text-[#494949] transition-all rounded-none"
                placeholder="E.G. REACT, JAVASCRIPT, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-[#cf2d56] text-[16px] uppercase mb-8 text-center">{error}</p>}

          <div className="text-center">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] !py-5 !px-12 !h-auto text-[16px] uppercase rounded-none border-none"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  ANALYZING MATCH...
                </span>
              ) : (
                "SEARCH JOBS ✨"
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-10">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-[27px] text-white uppercase tracking-wider">
                RECOMMENDED JOBS
              </h2>
              <span className="cursor-pill border border-white/30 text-[10px] text-white uppercase px-4 py-2 hover:bg-[#181818] rounded-none">
                {result.keyword}
              </span>
            </div>

            {result.jobs.length === 0 ? (
              <div className="text-center py-20 bg-[#202020] border border-[#494949] rounded-none">
                <p className="text-[16px] text-[#7D7D7D] uppercase">NO MATCHING JOBS FOUND. TRY REFINING YOUR PROFILE.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {result.jobs.map((job, idx) => (
                  <div key={idx} className="bg-[#202020] border border-[#494949] rounded-none animate-pop-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="p-10 flex flex-col md:flex-row justify-between items-start gap-10">
                      <div className="flex-1">
                        <h3 className="text-[27px] text-white uppercase mb-3">
                          {job.job_title}
                        </h3>
                        <p className="flex items-center gap-3 text-[14.4px] text-[#7D7D7D] uppercase mb-8">
                          <Briefcase className="w-4 h-4 opacity-40 grayscale" />
                          {job.company} • {job.location}
                        </p>

                        <div className="bg-[#181818] p-8 rounded-none border-l-2 border-[#29ABE2]">
                          <p className="text-[16px] text-white uppercase leading-relaxed italic">
                            <span className="text-[12px] font-sans font-bold uppercase tracking-[0.96px] text-[#29ABE2] mb-3 block">AI INSIGHT</span>
                            "{job.why_it_fits}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                           <svg width="96" height="96" className="-rotate-90">
                             <circle cx="48" cy="48" r="40" fill="none" stroke="#494949" strokeWidth="4" />
                             <circle
                               cx="48" cy="48" r="40" fill="none"
                               stroke={job.match_percentage >= 80 ? '#22c55e' : job.match_percentage >= 60 ? '#FFC000' : '#cf2d56'}
                               strokeWidth="4"
                               strokeDasharray={251.3}
                               strokeDashoffset={251.3 - (job.match_percentage / 100) * 251.3}
                               strokeLinecap="round"
                               className="transition-all duration-1000"
                             />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-[24px] font-sans font-normal text-white">{job.match_percentage}%</span>
                           </div>
                        </div>
                        <p className="text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] mt-4">MATCH</p>
                      </div>
                    </div>

                    <div className="px-10 py-6 bg-[#181818] border-t border-[#494949] flex flex-col sm:flex-row sm:items-center justify-between gap-8 rounded-none">
                      <div className="flex-1">
                        {job.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-3 items-center">
                            <span className="text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] mr-2">FOCUS AREA:</span>
                            {job.missing_skills.map(skill => (
                              <span key={skill} className="bg-[#cf2d56]/10 text-[#cf2d56] border border-[#cf2d56]/20 text-[12px] uppercase px-3 py-1 rounded-none tracking-[0.96px]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-[#22c55e] text-[12px] uppercase tracking-[0.96px]">
                            <CheckCircle2 className="w-4 h-4 grayscale" /> PERFECT SKILL MATCH
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => window.open(job.apply_link, "_blank")}
                        className="cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] uppercase rounded-none !px-10 h-11 border-none"
                      >
                        APPLY NOW →
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
