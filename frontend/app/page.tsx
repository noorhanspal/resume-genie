"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

const FEATURES = [
  {
    icon: "✨",
    title: "AI-Enhanced Content",
    description:
      "GPT-4o-mini rewrites your raw bullet points into professional, impactful statements with strong action verbs and measurable results.",
  },
  {
    icon: "🎯",
    title: "ATS Match Checker",
    description:
      "Paste any job description and instantly see your match score, missing keywords, and exactly what to fix to beat the ATS filter.",
  },
  {
    icon: "🎨",
    title: "3 Professional Templates",
    description:
      "Choose from Classic, Modern, or Minimal designs. Switch templates live on the preview page before downloading.",
  },
  {
    icon: "📥",
    title: "One-Click PDF Download",
    description:
      "Download a clean, properly formatted PDF resume ready to send to recruiters — no formatting issues, no watermarks.",
  },
  {
    icon: "⚡",
    title: "Ready in 2 Minutes",
    description:
      "Fill in 5 simple steps — personal info, experience, education, skills, and projects. AI handles the rest instantly.",
  },
  {
    icon: "🔒",
    title: "Your Data Stays Private",
    description:
      "No account required. Your resume data is only used to generate your resume and is never stored on our servers.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Fill in Your Details",
    description:
      "Enter your work experience, education, skills, and projects in our clean 5-step form. Write in plain language — no need to polish.",
  },
  {
    number: "02",
    title: "AI Enhances Your Resume",
    description:
      "Our AI rewrites your content into professional bullet points, generates a strong summary, and optimizes everything for ATS systems.",
  },
  {
    number: "03",
    title: "Pick a Template",
    description:
      "Preview your resume in Classic, Modern, or Minimal design. Switch between templates instantly and see the live result.",
  },
  {
    number: "04",
    title: "Download Your PDF",
    description:
      "Download a print-ready PDF resume. Optionally run an ATS match check against any job description before you apply.",
  },
];

const TEMPLATES = [
  {
    name: "Classic",
    description: "Blue accents, centered header, traditional serif layout.",
    accent: "bg-blue-600",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    name: "Modern",
    description: "Dark navy header band with emerald highlights.",
    accent: "bg-gray-900",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
  },
  {
    name: "Minimal",
    description: "Clean black & white, Times New Roman, no distractions.",
    accent: "bg-gray-400",
    border: "border-gray-200",
    badge: "bg-gray-50 text-gray-600",
  },
];

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Navbar */}
      <nav className="border-b border-white/20 dark:border-white/10 glass bg-white/40 dark:bg-black/40 sticky top-0 z-50 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            Resume Genie
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isLoaded ? null : user ? (
              <>
                <Link href="/smart-analysis">
                  <Button variant="ghost" className="text-sm px-4 text-blue-600 font-medium">Smart Analysis</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="ghost" className="text-sm px-4 text-orange-600 font-medium">Find Jobs ✨</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="text-sm px-4">My Resumes</Button>
                </Link>
                <Link href="/builder">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5">
                    + New Resume
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-sm text-foreground hover:text-red-500"
                  onClick={() => signOut({ redirectUrl: "/" })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600/90 hover:bg-blue-700/90 text-white text-sm px-5 border-none shadow-sm backdrop-blur-md transition-all active:scale-95">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 relative flex flex-col justify-center min-h-[70vh]">
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel rounded-3xl p-10 md:p-14">
          <span className="inline-block glass bg-blue-100/50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 shadow-sm">
            AI-Powered Resume Builder
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
            A professional resume
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">in under 2 minutes.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Fill in your details in plain language. Our AI turns them into a polished,
            ATS-optimized resume with strong bullet points, a professional summary,
            and your choice of design template.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoaded ? null : user ? (
              <Link href="/builder">
                <Button size="lg" className="bg-blue-600/90 dark:bg-blue-600/80 hover:bg-blue-700/90 dark:hover:bg-blue-500/80 text-white px-10 py-7 text-lg rounded-xl border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] backdrop-blur-md transition-all active:scale-95">
                  Build My Resume →
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="bg-blue-600/90 dark:bg-blue-600/80 hover:bg-blue-700/90 dark:hover:bg-blue-500/80 text-white px-10 py-7 text-lg rounded-xl border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] backdrop-blur-md transition-all active:scale-95">
                  Build My Resume — It's Free →
                </Button>
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-6 font-medium">Free account required. No watermarks. No credit card.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-bold text-foreground">
              Everything you need to land the interview
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Not just a resume builder — a complete tool to help you apply smarter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card p-8 group border border-white/20 dark:border-white/10"
              >
                <div className="text-4xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="font-bold text-xl text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-10 md:p-14">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground mt-3">Four simple steps from blank form to downloaded PDF.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5 glass-card p-6 border border-white/20 dark:border-white/10">
                <div className="flex-shrink-0 w-12 h-12 rounded-full glass bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">3 templates to choose from</h2>
            <p className="text-muted-foreground mt-3">
              Switch between designs instantly on the preview page — no need to regenerate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className={`glass-card border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
              >
                {/* Template mock preview */}
                <div className={`${t.accent} h-16 w-full opacity-80`} />
                <div className="p-5 space-y-2 dark:opacity-70">
                  <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-px bg-gray-300 dark:bg-gray-600 my-3 opacity-50" />
                  <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="px-5 pb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.badge} drop-shadow-sm`}>
                    Free
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center glass-panel rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/90 dark:bg-blue-600/80 -z-10 mix-blend-multiply dark:mix-blend-color"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build your resume?
          </h2>
          <p className="text-blue-100 mb-8 text-base">
            Create a free account and build your AI-powered resume in minutes.
          </p>
          <Link href={user ? "/builder" : "/login"}>
            <Button size="lg" className="glass bg-white/20 hover:bg-white/30 text-white px-10 py-7 text-lg font-semibold border border-white/40 shadow-xl transition-all">
              Get Started for Free →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-white/10 glass bg-white/40 dark:bg-black/40 py-8 px-6 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>
            <span className="font-bold text-foreground">Resume Genie</span> — AI-powered resume builder
          </span>
          <span>Built with Next.js & Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
