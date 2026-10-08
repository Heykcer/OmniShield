import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="bg-white text-slate-900 font-sans pb-24">
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Transparent Pricing</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">Enterprise-grade security without the enterprise-grade complexity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-2">Developer</h3>
            <p className="text-4xl font-black text-slate-900 mb-6">$0<span className="text-lg text-slate-400 font-medium">/mo</span></p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> 1,000 Scans / month</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> XGBoost & LightGBM Models</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> Community Support</li>
            </ul>
            <Link href="/dashboard" className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-center font-bold rounded-xl transition-colors">Start Free</Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-blue-600 border border-blue-500 rounded-3xl p-8 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-200">Most Popular</div>
            <h3 className="text-lg font-bold text-blue-200 uppercase tracking-wider mb-2">Professional</h3>
            <p className="text-4xl font-black text-white mb-6">$49<span className="text-lg text-blue-200 font-medium">/mo</span></p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white font-medium"><Check className="w-5 h-5 text-emerald-300" /> 50,000 Scans / month</li>
              <li className="flex items-center gap-3 text-white font-medium"><Check className="w-5 h-5 text-emerald-300" /> API Access</li>
              <li className="flex items-center gap-3 text-white font-medium"><Check className="w-5 h-5 text-emerald-300" /> Explainable AI (Gemini)</li>
            </ul>
            <button className="block w-full py-3 px-4 bg-white hover:bg-blue-50 text-blue-700 text-center font-bold rounded-xl transition-colors shadow-sm">Upgrade Now</button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-2">Enterprise</h3>
            <p className="text-4xl font-black text-slate-900 mb-6">Custom</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> Unlimited Scans</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> On-Premise Deployment</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><Check className="w-5 h-5 text-emerald-500" /> 24/7 SLA Support</li>
            </ul>
            <button className="block w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-center font-bold rounded-xl transition-colors shadow-sm">Contact Sales</button>
          </div>
        </div>
      </main>
    </div>
  );
}
