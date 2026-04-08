"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Briefcase, Percent, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Resume <span className="text-blue-600">Genie</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm">Back to Dashboard</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-orange-500">Perfect Match</span> 🎯
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            We use AI to instantly find jobs that fit your profile, analyze your match percentage, and tell you exactly why you're a good fit.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Top Skills</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. React, JavaScript, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="text-center">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Match & Searching Jobs...
                </>
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
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6 md:flex justify-between items-start gap-4 border-b border-gray-50">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                          {job.job_title}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-2 text-sm mb-3">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          {job.company} • {job.location}
                        </p>

                        <div className="bg-blue-50/50 rounded-xl p-4 mt-4 border border-blue-100/50">
                          <p className="text-sm text-blue-900 leading-relaxed font-medium">
                            <span className="text-blue-700 font-bold mr-1">Why it fits you:</span>
                            {job.why_it_fits}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 md:mt-0 md:min-w-[180px] bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className={`text-4xl font-black ${job.match_percentage >= 80 ? 'text-green-600' : job.match_percentage >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                            {job.match_percentage}%
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Match</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        {job.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs text-gray-500 font-medium">Missing:</span>
                            {job.missing_skills.map(skill => (
                              <span key={skill} className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> All key skills matched!
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => window.open(job.apply_link, "_blank")}
                        className="bg-gray-900 hover:bg-black text-white shrink-0"
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
