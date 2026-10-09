"use client";

import { useState } from 'react';
import { Code, Terminal, Server, FileJson, Copy, CheckCircle2 } from 'lucide-react';

export default function Developers() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('nodejs');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    nodejs: `// Node.js (Express Middleware Example)
const fetch = require('node-fetch');

app.use(async (req, res, next) => {
  try {
    const response = await fetch('https://api.omnishield.com/v1/telemetry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.OMNISHIELD_API_KEY
      },
      body: JSON.stringify({
        event_type: "api_request",
        ip_address: req.ip,
        user_id: req.user ? req.user.id : "anonymous",
        endpoint: req.originalUrl,
        request_rate: req.rateLimit ? req.rateLimit.current : 1,
        payload_size: req.headers['content-length'] || 0,
        user_agent: req.headers['user-agent']
      })
    });

    const intel = await response.json();
    
    if (intel.action === "BLOCK") {
      return res.status(403).json({ 
        error: "Access Denied by OmniShield", 
        threats: intel.threats_detected 
      });
    }
    
    next();
  } catch(err) {
    next(); // Fail open if OmniShield is unreachable
  }
});`,
    python: `# Python (FastAPI / Flask Example)
import requests
import os
from fastapi import Request, HTTPException

def verify_with_omnishield(request: Request):
    payload = {
        "event_type": "api_request",
        "ip_address": request.client.host,
        "endpoint": request.url.path,
        "payload_size": int(request.headers.get('content-length', 0)),
        "user_agent": request.headers.get('user-agent', '')
    }
    
    headers = {
        "X-API-Key": os.getenv("OMNISHIELD_API_KEY")
    }
    
    response = requests.post(
        "https://api.omnishield.com/v1/telemetry", 
        json=payload, 
        headers=headers
    )
    
    intel = response.json()
    if intel.get("action") == "BLOCK":
        raise HTTPException(status_code=403, detail="Threat blocked by OmniShield")
`,
    curl: `# cURL / Bash
curl -X POST https://api.omnishield.com/v1/telemetry \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY_HERE" \\
  -d '{
    "event_type": "api_request",
    "ip_address": "192.168.1.55",
    "endpoint": "/api/database/dump",
    "payload_size": 60000000,
    "user_agent": "sqlmap/1.5.2"
  }'`
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 font-sans pb-24 min-h-screen selection:bg-blue-500/30">
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-b border-white/10 pb-20 pt-16 px-6 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <main className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/30">
                    <Code className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Developer API Integration</h1>
                    <p className="text-slate-400 font-medium mt-1">Embed OmniShield's ML threat detection engine directly into your own infrastructure.</p>
                </div>
            </div>
        </main>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="bg-slate-800/80 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-indigo-400" /> Endpoint: Intelligent Telemetry
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">
                        Send network metadata to our models. We evaluate API abuse, data exfiltration, insider threats, and malware patterns in under 50ms.
                    </p>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5 font-mono text-sm text-emerald-400 flex items-center gap-3 shadow-inner">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold text-xs uppercase tracking-wider">POST</span>
                    api.omnishield.com/v1/telemetry
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Request Schema */}
                <div className="p-8 border-r border-white/5 bg-slate-800/30">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-slate-400" /> JSON Payload Schema
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between border-b border-white/5 pb-4">
                            <div>
                                <span className="font-mono text-blue-300 text-sm">event_type</span>
                                <span className="ml-3 text-xs font-bold text-red-400">Required</span>
                            </div>
                            <span className="text-sm text-slate-400">string (e.g. "api_request")</span>
                        </div>
                        <div className="flex items-start justify-between border-b border-white/5 pb-4">
                            <div>
                                <span className="font-mono text-blue-300 text-sm">ip_address</span>
                                <span className="ml-3 text-xs font-bold text-red-400">Required</span>
                            </div>
                            <span className="text-sm text-slate-400">string (IPv4 or IPv6)</span>
                        </div>
                        <div className="flex items-start justify-between border-b border-white/5 pb-4">
                            <div>
                                <span className="font-mono text-slate-300 text-sm">request_rate</span>
                                <span className="ml-3 text-xs font-medium text-slate-500">Optional</span>
                            </div>
                            <span className="text-sm text-slate-400">int (requests per min)</span>
                        </div>
                        <div className="flex items-start justify-between border-b border-white/5 pb-4">
                            <div>
                                <span className="font-mono text-slate-300 text-sm">payload_size</span>
                                <span className="ml-3 text-xs font-medium text-slate-500">Optional</span>
                            </div>
                            <span className="text-sm text-slate-400">int (bytes downloaded)</span>
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="font-mono text-slate-300 text-sm">user_agent</span>
                                <span className="ml-3 text-xs font-medium text-slate-500">Optional</span>
                            </div>
                            <span className="text-sm text-slate-400">string (browser/tool)</span>
                        </div>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="bg-[#0b1120]">
                    <div className="flex items-center gap-1 p-3 border-b border-white/5 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('nodejs')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'nodejs' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Node.js
                        </button>
                        <button 
                            onClick={() => setActiveTab('python')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'python' ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Python
                        </button>
                        <button 
                            onClick={() => setActiveTab('curl')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'curl' ? 'bg-emerald-600/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            cURL
                        </button>
                    </div>
                    
                    <div className="p-6 relative group">
                        <button 
                            onClick={() => handleCopy(codeSnippets[activeTab])}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                        >
                            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <pre className="text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                            <code>{codeSnippets[activeTab]}</code>
                        </pre>
                    </div>
                </div>
            </div>

            {/* Authentication warning */}
            <div className="bg-amber-900/20 border-t border-amber-500/20 p-5 px-8 flex items-center gap-4">
                <Server className="w-6 h-6 text-amber-500" />
                <p className="text-sm text-amber-200/80 font-medium">
                    All requests must include the <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/20 mx-1">X-API-Key</code> header. You can generate a free API key in your Profile dashboard.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
