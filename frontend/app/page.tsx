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
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="fixed top-0 w-full z-50 bg-transparent px-6 py-6 transition-all duration-500">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center gap-8 justify-start">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-6 h-[2px] bg-white group-hover:bg-[#FFC000] transition-colors relative before:absolute before:w-6 before:h-[2px] before:bg-inherit before:-top-2 after:absolute after:w-6 after:h-[2px] after:bg-inherit after:top-2" />
              <span className="text-[14px] uppercase tracking-[0.2px] ml-4 font-normal hover:text-[#FFC000] transition-colors">Menu</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <span className="text-[24px] uppercase tracking-wider font-normal text-white">
              Resume Genie
            </span>
          </div>

          <div className="flex items-center gap-6 justify-end">
            <Link href="/smart-analysis" className="text-[12px] uppercase tracking-[0.96px] text-[#FFFFFF] hover:text-[#FFC000] transition-colors hidden md:block">Smart Analysis</Link>
            <Link href="/jobs" className="text-[12px] uppercase tracking-[0.96px] text-[#FFFFFF] hover:text-[#FFC000] transition-colors hidden md:block">Find Jobs</Link>
            {!isLoaded ? null : user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="uppercase text-[14.4px] tracking-[0.2px] text-white hover:text-[#FFC000] rounded-none border border-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="cursor-button-primary uppercase tracking-[0.2px]">
                    Create Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/dashboard" className="ml-4">
                <Button className="cursor-button-primary uppercase tracking-[0.2px]">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>


      {/* Hero */}
      <section className="py-32 px-6 relative flex flex-col justify-center min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none z-0" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10 animate-pop-in mt-16">
          <div className="inline-block cursor-pill mb-12 border border-white/50 text-[#FFFFFF]">
            AI-POWERED INTELLIGENCE
          </div>
          <h1 className="text-[120px] font-normal leading-[0.92] text-white mb-8 uppercase max-md:text-[80px] max-sm:text-[54px] tracking-tight">
            BUILD YOUR FUTURE
            <br />
            <span className="text-white/60">IN 2 MINUTES.</span>
          </h1>
          <p className="text-[18px] text-[#F5F5F5] max-w-2xl mx-auto mb-16 px-4 uppercase leading-[1.56]">
            TURN YOUR RAW EXPERIENCE INTO A HIGH-IMPACT, ATS-OPTIMIZED RESUME. 
            POWERED BY INTELLIGENCE TO LAND YOU MORE INTERVIEWS, FASTER.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="cursor-button-primary !text-[16px] !px-[24px] !py-[24px] bg-[#FFC000] text-black hover:bg-[#917300]">
                CREATE MY RESUME — IT'S FREE
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-10 mt-20 text-[#7D7D7D]">
            <div className="text-[10px] uppercase tracking-[0.225px]">NO CREDIT CARD</div>
            <div className="text-[10px] uppercase tracking-[0.225px]">ATS OPTIMIZED</div>
            <div className="text-[10px] uppercase tracking-[0.225px]">PDF READY</div>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="py-32 px-6 relative bg-[#181818]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[54px] uppercase text-white mb-4 leading-[1.19]">
              DESIGNED FOR SUCCESS.
            </h2>
            <p className="text-[18px] text-[#7D7D7D] uppercase max-w-xl mx-auto leading-[1.56]">
              NOT JUST A BUILDER — A COMPLETE INTELLIGENCE PLATFORM FOR YOUR CAREER.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className="bg-[#202020] p-10 group animate-slide-up hover:bg-[#202020] transition-colors border-b border-[#000000]"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all opacity-80">
                  {f.icon}
                </div>
                <h3 className="text-[27px] uppercase text-white mb-4 leading-[1.37]">{f.title}</h3>
                <p className="text-[16px] text-[#F5F5F5] leading-relaxed uppercase">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 relative bg-black">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[54px] text-white uppercase mb-4 leading-[1.19]">HOW IT WORKS</h2>
            <p className="text-[18px] text-[#7D7D7D] uppercase leading-[1.56]">FOUR SIMPLE STEPS FROM BLANK FORM TO DOWNLOADED PDF.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-8 group">
                <div className="flex-shrink-0 w-12 h-12 bg-transparent border border-white/30 text-[#FFC000] flex items-center justify-center text-[14px] font-sans font-bold tracking-[0.2px] rounded-none">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-[27px] text-white mb-2 uppercase leading-[1.37]">{step.title}</h3>
                  <p className="text-[16px] text-[#F5F5F5] leading-relaxed uppercase">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Templates */}
      <section className="py-32 px-6 relative bg-[#181818]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[54px] text-white uppercase mb-4 leading-[1.19]">3 TEMPLATES TO CHOOSE FROM</h2>
            <p className="text-[18px] text-[#7D7D7D] uppercase leading-[1.56]">
              SWITCH BETWEEN DESIGNS INSTANTLY ON THE PREVIEW PAGE — NO NEED TO REGENERATE.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className="bg-[#202020] hover:bg-[#000000] transition-colors duration-300 border-b border-[#000000] group"
              >
                <div className={`bg-[#494949] h-32 w-full opacity-20`} />
                <div className="p-8 space-y-4">
                  <div className="h-2 bg-white/20 w-3/4 rounded-none" />
                  <div className="h-2 bg-white/10 w-1/2 rounded-none" />
                  <div className="h-px bg-[#494949] my-6" />
                  <p className="text-[27px] text-white uppercase">{t.name}</p>
                  <p className="text-[16px] text-[#7D7D7D] uppercase leading-relaxed group-hover:text-white transition-colors">{t.description}</p>
                  <span className="inline-block px-2 py-1 bg-[#969696] text-black text-[10px] uppercase tracking-[0.225px] mt-4">
                    FREE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-40 px-6 relative bg-black">
        <div className="max-w-[1200px] mx-auto text-center bg-[#202020] p-20 relative overflow-hidden border-b border-black">
          <h2 className="text-[54px] text-white uppercase mb-6 leading-[1.19]">
            READY TO BUILD YOUR RESUME?
          </h2>
          <p className="text-[18px] text-[#7D7D7D] uppercase mb-12 max-w-lg mx-auto leading-[1.56]">
            CREATE A FREE ACCOUNT AND BUILD YOUR AI-POWERED RESUME IN MINUTES.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="cursor-button-primary bg-[#FFC000] text-black hover:bg-[#917300] px-[24px] py-[24px] text-[16px]">
              GET STARTED FOR FREE
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] py-16 px-6 border-t border-[#202020]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="text-[24px] text-white uppercase">RESUME GENIE</span>
            <p className="text-[14px] text-[#7D7D7D] uppercase tracking-[-0.42px]">AI-POWERED RESUME BUILDER FOR THE MODERN JOB SEEKER.</p>
          </div>
          <div className="flex items-center gap-8 text-[12px] uppercase tracking-[0.96px] text-[#7D7D7D]">
            <span>NEXT.JS</span>
            <span>TAILWIND CSS</span>
            <span>CLERK AUTH</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
