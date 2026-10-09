import Link from 'next/link';
import { ChevronRight, ShieldCheck, Cpu, Database, Activity, Lock, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200 pb-24">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-medium text-xs mb-8 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-mono">OmniShield SOC v2.4 • Cross-Dataset Validated</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Enterprise Cyber Defense, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Powered by ML Ensembles.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-normal mb-10 leading-relaxed">
          Defend against zero-day phishing attacks and deepfake biometrics with our 90.7% cross-dataset validated XGBoost, LightGBM, and Random Forest ensemble engines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] gap-2">
              Launch SOC Console <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" size="lg" className="h-12 px-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> View Model Metrics
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <Card className="border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <Globe className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Hybrid Master Ensemble</CardTitle>
              <CardDescription className="text-xs">
                Stacking classifier combining XGBoost, LightGBM, and Random Forest trained on 10,000+ zero-day samples with cross-dataset validation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">Deepfake Forensics</CardTitle>
              <CardDescription className="text-xs">
                Spatial-temporal convolutional neural networks slicing video and audio frames to isolate facial warping and GAN frequency artifacts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle className="text-base text-white">B2B Telemetry & REST API</CardTitle>
              <CardDescription className="text-xs">
                Sub-50ms inference latency for automated edge integration, proxy middleware, and enterprise SIEM pipelines with zero logging leakage.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>

      </main>
    </div>
  );
}
