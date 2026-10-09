"use client";

import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Globe, Server, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function B2BAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    async function fetchStats() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/b2b-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch B2B metrics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const simulateApiCall = async () => {
    // 1. Fetch user's active API keys to get a key to test with
    const token = localStorage.getItem('omnishield_token');
    try {
        const keyRes = await fetch('http://127.0.0.1:8000/api/auth/api-keys', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const keyData = await keyRes.json();
        
        if (!keyData.keys || keyData.keys.length === 0) {
            alert("Please generate an API Key in your Profile first before testing!");
            return;
        }
        
        const apiKey = keyData.keys[0].api_key;
        
        // 2. Simulate the external website sending a telemetry payload
        await fetch('http://127.0.0.1:8000/api/external/v1/telemetry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({
                event_type: "api_request",
                ip_address: "192.168.1.55",
                user_id: "anonymous_hacker",
                endpoint: "/api/database/dump",
                request_rate: 1500, // Massive API abuse / DDoS
                payload_size: 60000000, // 60MB data exfiltration
                user_agent: "sqlmap/1.5.2" // Malware indicator
            })
        });
        
        // 3. Refresh stats to show the new hit
        window.location.reload();
    } catch (e) {
        console.error("Test failed", e);
        alert("Failed to simulate API call. Make sure you generated a key in the Profile page!");
    }
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 font-sans pb-24 min-h-screen">
      {/* Premium dark header area */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-b border-white/10 pb-20 pt-16 px-6">
        <main className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
                    <Server className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">B2B API Analytics</h1>
                    <p className="text-slate-400 font-medium mt-1">Monitor telemetry, threat detection rates, and API usage across your integrated platforms.</p>
                </div>
            </div>
            
            {/* Simulation Button */}
            <button 
                onClick={simulateApiCall}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
            >
                <Activity className="w-5 h-5" /> Simulate API Hit
            </button>
        </main>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-800/50 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl animate-pulse">
            <Activity className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="font-bold tracking-widest uppercase text-xs">Aggregating telemetry...</p>
          </div>
        )}

        {error && (
          <div className="p-5 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold shadow-lg backdrop-blur-md">
            <ShieldAlert className="w-6 h-6" /> <p>{error}</p>
          </div>
        )}

        {stats && !loading && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/5 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total API Scans</p>
                    <p className="text-5xl font-black text-white">{stats.totalApiCalls}</p>
                    <p className="text-sm font-medium text-emerald-400 mt-2 flex items-center gap-1">+12% this week</p>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/5 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-red-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldAlert className="w-24 h-24 text-red-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Threats Blocked via API</p>
                    <p className="text-5xl font-black text-white">{stats.threatsBlocked}</p>
                    <p className="text-sm font-medium text-slate-400 mt-2 flex items-center gap-1">Malware, Phishing & Anomalies</p>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/5 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe className="w-24 h-24 text-indigo-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network & URL Attacks</p>
                    <p className="text-5xl font-black text-white">{stats.phishingBlocked}</p>
                    <p className="text-sm font-medium text-slate-400 mt-2 flex items-center gap-1">Zero-day phishing intercepted</p>
                </div>
            </div>

            {/* Recent API Logs Table */}
            <div className="bg-slate-800/50 rounded-3xl p-8 border border-white/5 shadow-2xl backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Server className="w-5 h-5 text-blue-400" /> Recent B2B Traffic Logs
                </h2>
                
                {stats.recentLogs && stats.recentLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Timestamp</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Target Analyzed</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Threat Intel Details</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Risk Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentLogs.map(log => (
                                    <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="py-4 px-4 text-sm font-medium text-slate-300">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-mono text-slate-400 truncate max-w-xs">
                                            {log.target}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold text-indigo-300">
                                            {log.details || "N/A"}
                                        </td>
                                        <td className="py-4 px-4">
                                            {log.status === 'Safe' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400 border border-red-500/20">
                                                    <AlertCircle className="w-3.5 h-3.5" /> Critical
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold text-slate-300">
                                            {log.risk}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No external API traffic detected yet.</p>
                        <p className="text-sm mt-1">Generate an API key in your Profile and start sending requests.</p>
                    </div>
                )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
