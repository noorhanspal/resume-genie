"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";

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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">
            Resume <span className="text-blue-600">Genie</span>
          </span>
          {!isLoaded ? null : user ? (
            <div className="flex items-center gap-3">
              <Link href="/smart-analysis">
                <Button variant="ghost" className="text-sm px-4 text-blue-600 font-medium">Smart Analysis</Button>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            AI-Powered Resume Builder
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            A professional resume
            <br />
            <span className="text-blue-600">in under 2 minutes.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Fill in your details in plain language. Our AI turns them into a polished,
            ATS-optimized resume with strong bullet points, a professional summary,
            and your choice of design template.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isLoaded ? null : user ? (
              <Link href="/builder">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base w-full sm:w-auto">
                  Build My Resume →
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base w-full sm:w-auto">
                  Build My Resume — It's Free →
                </Button>
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-4">Free account required. No watermarks. No credit card.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to land the interview
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Not just a resume builder — a complete tool to help you apply smarter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3">Four simple steps from blank form to downloaded PDF.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">3 templates to choose from</h2>
            <p className="text-gray-500 mt-3">
              Switch between designs instantly on the preview page — no need to regenerate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className={`border-2 ${t.border} rounded-2xl overflow-hidden hover:shadow-lg transition-shadow`}
              >
                {/* Template mock preview */}
                <div className={`${t.accent} h-16 w-full`} />
                <div className="p-5 space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-5/6" />
                  <div className="h-2 bg-gray-100 rounded w-4/6" />
                </div>
                <div className="px-5 pb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.badge}`}>
                    Free
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build your resume?
          </h2>
          <p className="text-blue-100 mb-8 text-base">
            Create a free account and build your AI-powered resume in minutes.
          </p>
          <Link href={user ? "/builder" : "/login"}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-base font-semibold">
              Get Started for Free →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <span>
            <span className="font-semibold text-gray-700">Resume Genie</span> — AI-powered resume builder
          </span>
          <span>Built with Next.js, FastAPI, and GPT-4o-mini</span>
        </div>
      </footer>
    </div>
  );
}
