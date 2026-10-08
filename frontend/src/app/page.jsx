import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm mb-8 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          OmniShield v2.0 is now live
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
          Enterprise Security, <br/> Powered by AI.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
          Protect your organization from zero-day phishing attacks using our cross-dataset validated XGBoost and LightGBM Machine Learning engines.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center">
            Start Scanning URLs <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="/services" className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all w-full sm:w-auto justify-center shadow-sm">
            View All Services
          </Link>
        </div>
      </main>
    </div>
  );
}
