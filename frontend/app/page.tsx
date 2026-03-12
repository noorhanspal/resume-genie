import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-6 text-6xl">📄</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Resume <span className="text-blue-600">Genie</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Build a professional, AI-enhanced resume in under 2 minutes.
          Just fill in your details — we handle the rest.
        </p>
        <Link href="/builder">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg cursor-pointer">
            Build My Resume →
          </Button>
        </Link>
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-800">AI Enhanced</h3>
            <p className="text-sm text-gray-500">GPT-4 powered professional content</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">📑</div>
            <h3 className="font-semibold text-gray-800">PDF Download</h3>
            <p className="text-sm text-gray-500">Clean, ATS-friendly format</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800">2 Minutes</h3>
            <p className="text-sm text-gray-500">Fast and easy process</p>
          </div>
        </div>
      </div>
    </main>
  );
}
