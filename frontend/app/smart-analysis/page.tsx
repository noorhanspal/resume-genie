"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SmartAnalysis() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/resume/smart-analyze", {
        method: "POST",
        body: formData,
      });
      
      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.detail || "Something went wrong.");
      }
      
      setResults(resData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground transition-colors duration-500 antialiased">
      {/* Navbar */}
      <nav className="border-b border-white/20 dark:border-white/10 glass bg-white/40 dark:bg-slate-900/40 sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
             <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-300 tracking-tighter cursor-pointer">
              Resume Genie
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isLoaded ? null : user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" className="glass-button rounded-full px-5 font-black text-slate-700 dark:text-slate-100">Dashboard</Button>
                </Link>
                <Link href="/builder">
                  <Button className="glass-button bg-purple-600 dark:bg-purple-600/80 text-white text-sm px-6 rounded-full font-bold shadow-purple-500/20 shadow-lg">
                    + New Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button className="glass-button bg-purple-600 dark:bg-purple-600/80 text-white text-sm px-8 rounded-full font-bold shadow-purple-500/20 shadow-lg">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-16 animate-pop-in">
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
            Smart <span className="text-purple-600 dark:text-purple-400">Analysis</span> 🧠
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Upload your existing resume to get instant, deep-learning feedback. 
            We detect gaps, extract skills, and help you improve instantly.
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card bg-white/60 dark:bg-slate-900/60 p-10 mb-16 border-white/40 dark:border-white/10 animate-slide-up">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 mb-3 block">
            Upload Existing Resume (PDF / DOCX)
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-6 file:py-3 file:px-6
                file:rounded-xl file:border-0
                file:text-sm file:font-black
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-700
                glass-card bg-white/20 dark:bg-slate-950/20 border-white/40 dark:border-white/10 p-2 rounded-2xl"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className="glass-button bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 h-14 text-lg rounded-2xl font-black shadow-xl"
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </Button>
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm mt-6 font-bold text-center">{error}</p>}
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Roles */}
            <div className="glass-card bg-white/60 dark:bg-slate-900/60 p-8 border-white/40 dark:border-white/10">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                <span className="p-2 bg-blue-500/10 rounded-xl">🎯</span> Best Fit Roles
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.best_roles?.map((role: string, idx: number) => (
                  <span key={idx} className="bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-tight shadow-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="glass-card bg-white/60 dark:bg-slate-900/60 p-8 border-white/40 dark:border-white/10">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                <span className="p-2 bg-purple-500/10 rounded-xl">⚡</span> Skills Extracted
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.skills_extracted?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-slate-100 dark:bg-slate-800 border border-white/40 dark:border-white/10 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weak Points */}
              <div className="glass-card bg-red-500/5 dark:bg-red-500/10 p-8 border-red-500/20">
                <h2 className="text-lg font-black text-red-600 dark:text-red-400 mb-6 flex items-center gap-3 tracking-tight">
                  <span className="p-2 bg-red-500/10 rounded-xl text-base">⚠️</span> Weak Points
                </h2>
                <ul className="space-y-4">
                  {results.weak_points?.map((point: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-red-900/80 dark:text-red-200/80 font-medium leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="glass-card bg-emerald-500/5 dark:bg-emerald-500/10 p-8 border-emerald-500/20">
                <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-3 tracking-tight">
                  <span className="p-2 bg-emerald-500/10 rounded-xl text-base">💡</span> Fixes
                </h2>
                <ul className="space-y-4">
                  {results.improvement_suggestions?.map((suggestion: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-emerald-900/80 dark:text-emerald-200/80 font-medium leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
