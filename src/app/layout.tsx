import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LyticsScript } from "@/components/analytics/LyticsScript";
// Initialize Contentstack - side-effect import ensures module executes
import '../lib/contentstack';
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "FitFlow - Your Personal Fitness Companion",
  description: "A modern fitness planner with personalized workouts, meal plans, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <LyticsScript />
        <AuthProvider>
          <ThemeProvider>
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
            </div>
            
            <Navbar />
            <main className="min-h-screen pt-24 pb-32 md:pb-8">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

