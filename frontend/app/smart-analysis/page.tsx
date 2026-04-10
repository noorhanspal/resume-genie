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
      <nav className="glass sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-3 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-sans font-normal tracking-tight text-foreground cursor-pointer">
              Resume Genie
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/smart-analysis" className="text-button-label text-foreground hover:text-destructive transition-colors">Smart Analysis</Link>
              <Link href="/jobs" className="text-button-label text-foreground/60 hover:text-destructive transition-colors">Find Jobs</Link>
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

      <div className="max-w-4xl mx-auto py-32 px-6">
        <div className="text-center mb-24 animate-pop-in">
          <h1 className="text-section-heading text-foreground mb-6">
            Smart Analysis
          </h1>
          <p className="text-body-serif text-foreground/50 max-w-2xl mx-auto">
            Upload your existing resume to get instant, deep-learning feedback. 
            We detect gaps, extract skills, and help you improve instantly.
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card p-12 mb-16 animate-slide-up">
          <label className="text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 mb-4 block">
            Upload Existing Resume (PDF / DOCX)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-6 items-center">
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              className="block w-full text-sm text-foreground/60
                file:mr-6 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-[13px] file:font-sans
                file:bg-surface-300 file:text-foreground
                hover:file:text-destructive
                bg-surface-100 border border-border p-3 rounded-lg"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className="cursor-button-primary !py-4 !px-10 !h-auto text-base"
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-8 text-center">{error}</p>}
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Roles */}
            <div className="glass-card p-10">
              <h2 className="text-title-small text-foreground mb-8 flex items-center gap-3">
                <span className="opacity-50">🎯</span> Best Fit Roles
              </h2>
              <div className="flex flex-wrap gap-3">
                {results.best_roles?.map((role: string, idx: number) => (
                  <span key={idx} className="cursor-pill text-xs uppercase tracking-wider">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="glass-card p-10">
              <h2 className="text-title-small text-foreground mb-8 flex items-center gap-3">
                <span className="opacity-50">⚡</span> Skills Extracted
              </h2>
              <div className="flex flex-wrap gap-3">
                {results.skills_extracted?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-surface-100 border border-border text-foreground/80 px-4 py-2 rounded-lg text-xs font-sans">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Weak Points */}
              <div className="glass-card p-10 border-destructive/20 bg-destructive/5">
                <h2 className="text-title-small text-destructive mb-8 flex items-center gap-3">
                  <span className="text-base opacity-70">⚠️</span> Weak Points
                </h2>
                <ul className="space-y-5">
                  {results.weak_points?.map((point: string, idx: number) => (
                    <li key={idx} className="flex gap-4 text-body-serif-sm text-destructive/80">
                      <span className="mt-2 w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="glass-card p-10 border-accent/20 bg-accent/5">
                <h2 className="text-title-small text-accent mb-8 flex items-center gap-3">
                  <span className="text-base opacity-70">💡</span> Fixes
                </h2>
                <ul className="space-y-5">
                  {results.improvement_suggestions?.map((suggestion: string, idx: number) => (
                    <li key={idx} className="flex gap-4 text-body-serif-sm text-accent/80">
                      <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
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
