import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">OmniShield</span>
          </Link>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Enterprise-grade cybersecurity powered by Explainable AI and high-performance ML engines.
          </p>
        </div>
        
        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-widest">Platform</h4>
          <ul className="space-y-3">
            <li><Link href="/services" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Phishing Detection</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Deepfake Forensics</Link></li>
            <li><Link href="/developers" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">API Docs</Link></li>
            <li><Link href="/analytics" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Model Analytic</Link></li>
            <li><Link href="/pricing" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-widest">Company</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">About Us</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Careers</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Blog</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-widest">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-400 text-sm font-medium">© 2026 OmniShield Security. All rights reserved.</p>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
