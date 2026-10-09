import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OmniShield",
  description: "AI-Powered Threat Detection",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
        <Navbar />
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
