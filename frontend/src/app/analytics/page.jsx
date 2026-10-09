"use client";

import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Database, Zap, FileJson, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('http://localhost:8000/api/metrics');
        if (!res.ok) throw new Error('Failed to fetch ML metrics from backend');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="bg-[#090d16] text-slate-100 font-sans pb-24 min-h-screen selection:bg-blue-600/30 selection:text-blue-200">
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px] font-mono">
                Cross-Dataset Validated
              </Badge>
              <span className="text-xs text-slate-400 font-mono">10,000+ Samples</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ML Model Benchmark & Evaluation Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cross-dataset generalization metrics across our Master Hybrid Ensemble, XGBoost, and LightGBM engines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-xs font-mono py-1 px-3">
              ● All Models Validated
            </Badge>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-pulse">
            <Activity className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider">Aggregating Cross-Validation Matrix...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-medium mb-6">
            <ShieldCheck className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {metrics && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.keys(metrics).map((modelName) => {
              const modelData = metrics[modelName];
              const isMaster = modelName.toLowerCase().includes('master');
              
              return (
                <Card
                  key={modelName}
                  className={`border-slate-800/80 bg-slate-900/70 shadow-xl backdrop-blur-md transition-all hover:border-slate-700 ${
                    isMaster ? 'ring-1 ring-blue-500/30 bg-slate-900/90' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-white font-bold">{modelName}</CardTitle>
                          {isMaster && (
                            <Badge className="bg-blue-600 text-white text-[10px] uppercase font-mono">
                              Master
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs font-mono mt-1">
                          {modelData["Model Size (MB)"]} MB • {modelData["Inference Time (ms/sample)"]} ms / sample
                        </CardDescription>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Database className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Primary KPI Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                          Accuracy
                        </span>
                        <div className="text-2xl font-bold font-mono text-white">
                          {(modelData.Accuracy * 100).toFixed(1)}%
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                          F1-Score
                        </span>
                        <div className="text-2xl font-bold font-mono text-white">
                          {(modelData["F1 Score"] * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Precision & Recall */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider font-mono block mb-0.5">
                          Precision
                        </span>
                        <span className="text-base font-bold font-mono text-emerald-300">
                          {(modelData.Precision * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/20">
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider font-mono block mb-0.5">
                          Recall
                        </span>
                        <span className="text-base font-bold font-mono text-indigo-300">
                          {(modelData.Recall * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Detailed Spec Metrics */}
                    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>ROC-AUC Metric</span>
                        <span className="font-mono font-bold text-slate-200">
                          {(modelData["ROC-AUC"] * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Specificity</span>
                        <span className="font-mono font-bold text-slate-200">
                          {(modelData.Specificity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>False Positive Rate (FPR)</span>
                        <span className="font-mono font-bold text-rose-400">
                          {(modelData["False Positive Rate"] * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Confusion Matrix Display */}
                    <div className="pt-3 border-t border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                        Confusion Matrix
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                        <div className="bg-emerald-500/10 text-emerald-300 p-2 rounded-lg border border-emerald-500/20">
                          <span className="block text-[10px] text-emerald-500">True Neg (Safe)</span>
                          <strong className="text-sm font-bold">{modelData["Confusion Matrix"].TN}</strong>
                        </div>
                        <div className="bg-rose-500/10 text-rose-300 p-2 rounded-lg border border-rose-500/20">
                          <span className="block text-[10px] text-rose-500">False Pos</span>
                          <strong className="text-sm font-bold">{modelData["Confusion Matrix"].FP}</strong>
                        </div>
                        <div className="bg-amber-500/10 text-amber-300 p-2 rounded-lg border border-amber-500/20">
                          <span className="block text-[10px] text-amber-500">False Neg</span>
                          <strong className="text-sm font-bold">{modelData["Confusion Matrix"].FN}</strong>
                        </div>
                        <div className="bg-blue-500/10 text-blue-300 p-2 rounded-lg border border-blue-500/20">
                          <span className="block text-[10px] text-blue-500">True Pos (Threat)</span>
                          <strong className="text-sm font-bold">{modelData["Confusion Matrix"].TP}</strong>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
