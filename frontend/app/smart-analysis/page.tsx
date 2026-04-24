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
    <div className="min-h-screen bg-black text-white transition-colors duration-500 antialiased font-sans">
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

      <div className="max-w-[1200px] mx-auto py-32 px-6 mt-16">
        <div className="text-center mb-24 animate-pop-in">
          <h1 className="text-[80px] uppercase text-white mb-6 leading-[1.13]">
            SMART ANALYSIS
          </h1>
          <p className="text-[18px] text-[#7D7D7D] max-w-2xl mx-auto uppercase leading-[1.56]">
            UPLOAD YOUR EXISTING RESUME TO GET INSTANT, DEEP-LEARNING FEEDBACK. 
            WE DETECT GAPS, EXTRACT SKILLS, AND HELP YOU IMPROVE INSTANTLY.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-[#202020] border border-[#494949] p-12 mb-16 animate-slide-up rounded-none">
          <label className="text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D] mb-4 block">
            UPLOAD EXISTING RESUME (PDF / DOCX)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-6 items-center">
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              className="block w-full text-[16px] text-[#7D7D7D] uppercase
                file:mr-6 file:py-3 file:px-6
                file:rounded-none file:border-none
                file:text-[14.4px] file:uppercase file:tracking-[0.2px]
                file:bg-[#181818] file:text-white
                hover:file:text-[#FFC000]
                bg-[#181818] border border-[#494949] p-3 rounded-none focus:border-white transition-colors"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className="cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] !py-5 !px-12 !h-auto text-[16px] rounded-none border-none"
            >
              {loading ? "ANALYZING..." : "ANALYZE →"}
            </Button>
          </div>
          {error && <p className="text-[#cf2d56] text-[16px] uppercase mt-8 text-center">{error}</p>}
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Roles */}
            <div className="bg-[#202020] border border-[#494949] p-10 rounded-none">
              <h2 className="text-[27px] text-white uppercase mb-8 flex items-center gap-3">
                <span className="opacity-50 grayscale">🎯</span> BEST FIT ROLES
              </h2>
              <div className="flex flex-wrap gap-3">
                {results.best_roles?.map((role: string, idx: number) => (
                  <span key={idx} className="cursor-pill border border-white/30 text-white uppercase tracking-[0.2px] rounded-none px-4 py-2 hover:border-white hover:bg-[#181818] transition-colors">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="bg-[#202020] border border-[#494949] p-10 rounded-none">
              <h2 className="text-[27px] text-white uppercase mb-8 flex items-center gap-3">
                <span className="opacity-50 grayscale">⚡</span> SKILLS EXTRACTED
              </h2>
              <div className="flex flex-wrap gap-3">
                {results.skills_extracted?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-[#181818] border border-[#494949] text-[#F5F5F5] uppercase px-4 py-2 rounded-none text-[14.4px] tracking-[0.2px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Weak Points */}
              <div className="bg-[#202020] border-l-4 border-[#cf2d56] p-10 rounded-none">
                <h2 className="text-[27px] text-[#cf2d56] uppercase mb-8 flex items-center gap-3">
                  <span className="text-[24px] opacity-70 grayscale">⚠️</span> WEAK POINTS
                </h2>
                <ul className="space-y-5">
                  {results.weak_points?.map((point: string, idx: number) => (
                    <li key={idx} className="flex gap-4 text-[16px] uppercase text-[#F5F5F5] leading-relaxed">
                      <span className="mt-2 w-2 h-2 rounded-none bg-[#cf2d56] shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-[#202020] border-l-4 border-[#29ABE2] p-10 rounded-none">
                <h2 className="text-[27px] text-[#29ABE2] uppercase mb-8 flex items-center gap-3">
                  <span className="text-[24px] opacity-70 grayscale">💡</span> FIXES
                </h2>
                <ul className="space-y-5">
                  {results.improvement_suggestions?.map((suggestion: string, idx: number) => (
                    <li key={idx} className="flex gap-4 text-[16px] uppercase text-[#F5F5F5] leading-relaxed">
                      <span className="mt-2 w-2 h-2 rounded-none bg-[#29ABE2] shrink-0" />
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
