import Link from 'next/link';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  return (
    <div className="bg-[#090d16] text-slate-100 font-sans pb-24 min-h-screen selection:bg-blue-600/30 selection:text-blue-200">
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs font-mono mb-3">
            Predictable Enterprise Licensing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Transparent Cyber Intelligence Tiers
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            From single-analyst research to high-volume multi-tenant edge SIEM gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl flex flex-col">
            <CardHeader>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Developer / Community
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400 font-mono">/month</span>
              </div>
              <CardDescription className="text-xs mt-1">
                For security researchers and personal domain triage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>1,000 Live URL Scans / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Master Hybrid Ensemble Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Community Discord & Docs</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-700 bg-slate-800/60 hover:bg-slate-700">
                  Deploy Free Tier
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Tier (Featured) */}
          <Card className="border-blue-500/50 bg-gradient-to-b from-slate-900/90 to-blue-950/30 shadow-[0_0_35px_rgba(59,130,246,0.2)] flex flex-col relative md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[10px] uppercase font-mono tracking-wider px-3 shadow-md">
                ★ Recommended for SOCs
              </Badge>
            </div>
            <CardHeader className="pt-8">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-mono">
                SOC Professional
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs text-slate-400 font-mono">/month</span>
              </div>
              <CardDescription className="text-xs mt-1 text-slate-300">
                Full-spectrum automated phishing defense with Explainable AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>50,000 Live URL Scans / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Deepfake Forensics Video Frame CNN</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Gemini Explainable AI (XAI) Forensics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>High-speed B2B REST API Key</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-lg text-white">
                  Upgrade to Professional
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl flex flex-col">
            <CardHeader>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Dedicated Enterprise
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <CardDescription className="text-xs mt-1">
                Air-gapped on-premise Kubernetes deployment with custom retraining.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Unlimited Telemetry Ingestion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>On-Premise Docker / K8s Deployment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>24/7 SLA & Dedicated Cyber Engineer</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold border-slate-700 bg-slate-800/60 hover:bg-slate-700">
                  Contact Cyber Sales
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </div>
      </main>
    </div>
  );
}
