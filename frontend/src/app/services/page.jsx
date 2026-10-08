import { Cpu, Globe, Lock } from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Our Services</h1>
        <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-16">Comprehensive AI-driven cybersecurity modules designed to protect modern enterprises.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <Globe className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Phishing URL Detection</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Our flagship service. Analyzes URLs by extracting structural features and validating them across XGBoost, LightGBM, and Random Forest models.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
              <Cpu className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Explainable AI</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Not just a black box. Our system uses Gemini LLMs to provide plain-English forensic reports on why exactly a threat was flagged.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm opacity-60">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
              <Lock className="w-7 h-7 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Deepfake Forensics</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Coming soon. Advanced neural network models capable of detecting manipulated audio and video artifacts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
