"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";

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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar - Simplified for this page */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">
              Resume <span className="text-blue-600">Genie</span>
            </span>
          </Link>
          {!isLoaded ? null : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="text-sm px-4">My Resumes</Button>
              </Link>
              <Link href="/builder">
                <Button variant="outline" className="text-sm px-4">New Resume</Button>
              </Link>
              <Button
                variant="ghost"
                className="text-sm text-gray-500 hover:text-red-600"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-2">Smart Resume Analysis</h1>
          <p className="text-gray-500">
            Upload your existing resume (PDF or DOCX) to get instant AI feedback. 
            We'll extract your skills, suggest the best job roles for your profile, 
            detect weak points, and give you actionable improvement tips.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF / DOCX)
          </label>
          <div className="flex gap-4 items-center">
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 border border-gray-300 rounded-md bg-white p-1"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Roles */}
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🎯 Best Fit Roles
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.best_roles?.map((role: string, idx: number) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                ⚡ Skills Extracted
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.skills_extracted?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weak Points */}
              <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
                <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                  ⚠️ Weak Points Detected
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-red-900/80">
                  {results.weak_points?.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                  💡 Improvement Suggestions
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-green-900/80">
                  {results.improvement_suggestions?.map((suggestion: string, idx: number) => (
                    <li key={idx}>{suggestion}</li>
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
