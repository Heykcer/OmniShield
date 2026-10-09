"use client";

import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Database, Zap, FileJson } from 'lucide-react';

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
    <div className="bg-[#F8FAFC] text-slate-900 font-sans pb-24 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">ML Evaluation Analytics</h1>
          <p className="text-slate-500 font-medium">Cross-dataset validation and performance metrics for the URL Phishing models.</p>
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-pulse">
            <Activity className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="font-bold">Fetching latest ML metrics...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium mb-6">
            <ShieldCheck className="w-5 h-5" /> <p>{error}</p>
          </div>
        )}

        {metrics && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.keys(metrics).map((modelName) => {
              const modelData = metrics[modelName];
              return (
                <div key={modelName} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800">{modelName}</h2>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
                        <p className="text-2xl font-black text-slate-900">{(modelData.Accuracy * 100).toFixed(2)}%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">F1 Score</p>
                        <p className="text-2xl font-black text-slate-900">{(modelData["F1 Score"] * 100).toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100/50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Precision</p>
                        <p className="text-xl font-bold text-emerald-800">{(modelData.Precision * 100).toFixed(2)}%</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100/50">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Recall</p>
                        <p className="text-xl font-bold text-indigo-800">{(modelData.Recall * 100).toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> Advanced Metrics</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Specificity</span>
                          <span className="font-bold text-slate-700">{(modelData.Specificity * 100).toFixed(2)}%</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">False Positive Rate</span>
                          <span className="font-bold text-slate-700">{(modelData["False Positive Rate"] * 100).toFixed(2)}%</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">ROC-AUC</span>
                          <span className="font-bold text-slate-700">{(modelData["ROC-AUC"] * 100).toFixed(2)}%</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Inference Time</span>
                          <span className="font-bold text-slate-700 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500"/> {modelData["Inference Time (ms/sample)"]} ms</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Model Size</span>
                          <span className="font-bold text-slate-700 flex items-center gap-1"><FileJson className="w-3 h-3 text-slate-400"/> {modelData["Model Size (MB)"]} MB</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confusion Matrix</p>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                         <div className="bg-emerald-100 text-emerald-800 p-2 rounded-lg border border-emerald-200">TN: {modelData["Confusion Matrix"].TN}</div>
                         <div className="bg-red-100 text-red-800 p-2 rounded-lg border border-red-200">FP: {modelData["Confusion Matrix"].FP}</div>
                         <div className="bg-amber-100 text-amber-800 p-2 rounded-lg border border-amber-200">FN: {modelData["Confusion Matrix"].FN}</div>
                         <div className="bg-blue-100 text-blue-800 p-2 rounded-lg border border-blue-200">TP: {modelData["Confusion Matrix"].TP}</div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
