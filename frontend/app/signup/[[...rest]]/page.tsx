import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Resume <span className="text-blue-600">Genie</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create your free account</p>
        </div>
        <SignUp fallbackRedirectUrl="/dashboard" signInUrl="/login" />
      </div>
    </div>
  );
}
