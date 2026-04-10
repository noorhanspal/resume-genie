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
    title: "Secure Cloud Save",
    description:
      "Your resumes are securely stored in your account, allowing you to edit and download them from any device at any time.",
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
      <nav className="glass sticky top-0 z-50 transition-all duration-500 backdrop-blur-2xl px-6 py-3 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-sans font-normal tracking-tight text-foreground">
              Resume Genie
            </span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/smart-analysis" className="text-button-label text-foreground/60 hover:text-destructive transition-colors">Smart Analysis</Link>
              <Link href="/jobs" className="text-button-label text-foreground/60 hover:text-destructive transition-colors">Find Jobs</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLoaded ? null : user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-button-label text-foreground hover:text-destructive transition-colors">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="cursor-button-primary">
                    Create Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/dashboard">
                <Button className="cursor-button-primary">
                  Login
                </Button>
              </Link>
            )}
          </div>

        </div>
      </nav>


      {/* Hero */}
      <section className="py-32 px-6 relative flex flex-col justify-center min-h-[90vh] overflow-hidden bg-background">
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-pop-in">
          <div className="inline-block cursor-pill mb-12">
            AI-Powered Intelligence
          </div>
          <h1 className="text-display-hero text-foreground mb-8">
            Build your future
            <br />
            <span className="text-foreground/80">in 2 minutes.</span>
          </h1>
          <p className="text-body-serif text-foreground/60 max-w-2xl mx-auto mb-16 px-4">
            Turn your raw experience into a high-impact, ATS-optimized resume. 
            Powered by intelligence to land you more interviews, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="cursor-button-primary !text-lg !px-12 !py-8 bg-surface-300">
                Create My Resume — It's Free →
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-10 mt-16 opacity-30">
            <div className="text-[11px] font-sans font-medium uppercase tracking-widest">No Credit Card</div>
            <div className="text-[11px] font-sans font-medium uppercase tracking-widest">ATS Optimized</div>
            <div className="text-[11px] font-sans font-medium uppercase tracking-widest">PDF Ready</div>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="py-24 px-6 relative bg-surface-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-section-heading text-foreground mb-4">
              Designed for success.
            </h2>
            <p className="text-body-serif text-foreground/50 max-w-xl mx-auto">
              Not just a builder — a complete intelligence platform for your career.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className="glass-card p-10 group animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-title-small text-foreground mb-4">{f.title}</h3>
                <p className="text-body-serif-sm text-foreground/60 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-section-heading text-foreground mb-4">How it works</h2>
            <p className="text-body-serif text-foreground/50">Four simple steps from blank form to downloaded PDF.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-8 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-300 text-foreground flex items-center justify-center text-[11px] font-sans font-bold tracking-tighter">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-title-small text-foreground mb-2">{step.title}</h3>
                  <p className="text-body-serif-sm text-foreground/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Templates */}
      <section className="py-24 px-6 relative bg-surface-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-section-heading text-foreground mb-4">3 templates to choose from</h2>
            <p className="text-body-serif text-foreground/50">
              Switch between designs instantly on the preview page — no need to regenerate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className="glass-card hover:shadow-2xl transition-all"
              >
                <div className={`${t.accent} h-20 w-full opacity-10`} />
                <div className="p-8 space-y-4">
                  <div className="h-2 bg-foreground/20 rounded w-3/4" />
                  <div className="h-2 bg-foreground/10 rounded w-1/2" />
                  <div className="h-px bg-border my-4" />
                  <p className="text-title-small text-foreground">{t.name}</p>
                  <p className="text-body-serif-sm text-foreground/50">{t.description}</p>
                  <span className="inline-block cursor-pill">
                    Free
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center glass-card p-20 relative overflow-hidden bg-surface-300">
          <h2 className="text-section-heading text-foreground mb-6">
            Ready to build your resume?
          </h2>
          <p className="text-body-serif text-foreground/50 mb-12 max-w-lg mx-auto">
            Create a free account and build your AI-powered resume in minutes.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="cursor-button-primary !text-lg !px-12 !py-8">
              Get Started for Free →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-title-small text-foreground">Resume Genie</span>
            <p className="text-body-serif-sm text-foreground/40">AI-powered resume builder for the modern job seeker.</p>
          </div>
          <div className="flex items-center gap-8 text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40">
            <span>Built with Next.js</span>
            <span>Tailwind CSS</span>
            <span>Clerk Auth</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
