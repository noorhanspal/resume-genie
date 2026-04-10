import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center">
          <h1 className="text-title-small text-foreground uppercase tracking-widest">
            Resume Genie
          </h1>
          <p className="text-body-serif-sm text-foreground/40 mt-2">Create your free account</p>
        </div>
        <div className="glass-card p-2 rounded-lg">
          <SignUp fallbackRedirectUrl="/" signInUrl="/login" />
        </div>
      </div>
    </div>

  );
}
