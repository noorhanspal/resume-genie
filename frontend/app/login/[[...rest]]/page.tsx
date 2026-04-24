import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center">
          <h1 className="text-[27px] text-white uppercase tracking-wider">
            RESUME GENIE
          </h1>
          <p className="text-[14.4px] text-[#7D7D7D] uppercase mt-2">SIGN IN TO YOUR ACCOUNT</p>
        </div>
        <div className="bg-[#202020] border border-[#494949] p-4 rounded-none">
          <SignIn fallbackRedirectUrl="/" signUpUrl="/signup" />
        </div>
      </div>
    </div>

  );
}
