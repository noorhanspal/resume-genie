"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Resume <span className="text-blue-600">Genie</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs">
              <Button variant="ghost" className="text-sm px-4 text-orange-600 font-medium">Find Jobs ✨</Button>
            </Link>
            <Link href="/builder">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4">
                + New Resume
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{displayName}</span>
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="text-sm text-gray-400 hover:text-red-600 transition-colors ml-1"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {resumes.length === 0 ? "No resumes saved yet." : `${resumes.length} resume${resumes.length > 1 ? "s" : ""} saved`}
          </p>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
            <div className="text-5xl mb-4">📄</div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">No resumes yet</p>
            <p className="text-sm text-gray-400 mb-6">
              Build your first resume and save it from the preview page.
            </p>
            <Link href="/builder">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Build My Resume →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const rd = resume.resume_data as { personal_info?: { full_name?: string }; job_title?: string };
              const name = rd.personal_info?.full_name ?? "Untitled";
              const jobTitle = rd.job_title ?? "";
              return (
                <div key={resume.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${TEMPLATE_COLORS[resume.template] ?? TEMPLATE_COLORS.classic}`}>
                      {resume.template}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                    {jobTitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{jobTitle}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Saved {timeAgo(resume.created_at)}</p>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={() => handleOpen(resume)}>
                      Open
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleDownload(resume)}>
                      PDF
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs px-2"
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
      </main>
    </div>
  );
}
