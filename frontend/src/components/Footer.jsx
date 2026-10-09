import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-850 pt-14 pb-8 px-6 lg:px-8 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white font-mono">OmniShield</span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            Enterprise threat detection platform. Cross-dataset validated XGBoost, LightGBM, and Deepfake Forensic CNNs with Explainable AI.
          </p>
        </div>
        
        <div>
          <h4 className="text-slate-200 font-bold mb-4 uppercase text-xs tracking-widest font-mono">Telemetry & Engines</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">SOC Dashboard</Link></li>
            <li><Link href="/analytics" className="text-slate-400 hover:text-white transition-colors">ML Cross-Dataset Metrics</Link></li>
            <li><Link href="/b2b-analytics" className="text-slate-400 hover:text-white transition-colors">B2B Telemetry Hub</Link></li>
            <li><Link href="/developers" className="text-slate-400 hover:text-white transition-colors">REST API & SDK Docs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-4 uppercase text-xs tracking-widest font-mono">Governance & Compliance</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/reports" className="text-slate-400 hover:text-white transition-colors">Automated Forensic Reports</Link></li>
            <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Enterprise SLA & Tiers</Link></li>
            <li><span className="text-slate-500">ISO 27001 & SOC 2 Ready</span></li>
            <li><span className="text-slate-500">Zero Retention Logging</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-4 uppercase text-xs tracking-widest font-mono">Security Operations</h4>
          <div className="space-y-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-medium">Inference Engine</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Master Hybrid Ensemble v2.0</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-medium">CNN Biometrics</span>
                <span className="text-purple-400 font-mono font-bold">READY</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Frame Extraction / ResNet-50</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 OmniShield Cyber Intelligence. Built with shadcn/ui design standards.</p>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-300">All Security Engines Active</span>
        </div>
      </div>
    </footer>
  );
}
