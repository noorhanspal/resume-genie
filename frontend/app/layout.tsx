import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Resume Genie — AI-Powered Resume Builder",
  description: "Build a professional, ATS-optimized resume in under 2 minutes with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#FFC000",
          colorBackground: "#202020",
          colorInputBackground: "#181818",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#7D7D7D",
          borderRadius: "0px",
        },
        elements: {
          card: "border border-[#494949] rounded-none shadow-none",
          formButtonPrimary: "bg-[#FFC000] text-black hover:bg-[#917300] uppercase font-bold tracking-wider",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-500 bg-black text-white`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
