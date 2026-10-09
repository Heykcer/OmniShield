import { Cpu, Globe, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Services() {
  return (
    <div className="bg-[#090d16] text-slate-100 font-sans pb-24 min-h-screen selection:bg-blue-600/30 selection:text-blue-200">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs font-mono mb-3">
            Core Security Capabilities
          </Badge>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Comprehensive Cyber Defense Modules
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Multi-layered AI protection engineered to neutralize deceptive links, biometric manipulation, and API exploitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Globe className="w-6 h-6" />
              </div>
              <CardTitle className="text-base font-bold text-white">URL Phishing Detection</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2 text-slate-400">
                Extracts 30+ lexical, domain, and structural features. Inferred via a cross-dataset validated ensemble of XGBoost, LightGBM, and Random Forest models with 90.7% accuracy.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Cpu className="w-6 h-6" />
              </div>
              <CardTitle className="text-base font-bold text-white">Gemini Explainable AI</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2 text-slate-400">
                Transparent decision-making. Generates plain-English forensic intelligence summaries explaining the exact heuristic anomalies and DNS flags that prompted the block.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <CardTitle className="text-base font-bold text-white">Deepfake Forensics</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-2 text-slate-400">
                Convolutional neural networks slicing audio and video frames to isolate spatial-temporal boundary artifacts, face morphing, and synthetic voice jitter.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </main>
    </div>
  );
}
