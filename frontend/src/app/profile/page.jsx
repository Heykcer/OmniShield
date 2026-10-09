"use client";

import { useState, useEffect } from 'react';
import { User, Key, Plus, Trash2, Shield, Activity, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const [username, setUsername] = useState('Security Admin');
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Fetch user info
    fetch('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
      })
      .catch(() => {});

    // Fetch API keys
    fetchApiKeys(token);
  }, []);

  const fetchApiKeys = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/api-keys', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error('Failed to fetch API keys');
    }
  };

  const generateApiKey = async () => {
    setLoading(true);
    const token = localStorage.getItem('omnishield_token');
    try {
      const res = await fetch('http://localhost:8000/api/auth/api-keys', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchApiKeys(token);
      }
    } catch (err) {
      console.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const revokeApiKey = async (key) => {
    if (
      !confirm(
        'Are you sure you want to revoke this API key? This will instantly break any external integrations using it.'
      )
    )
      return;

    const token = localStorage.getItem('omnishield_token');
    try {
      const res = await fetch(`http://localhost:8000/api/auth/api-keys/${key}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchApiKeys(token);
      }
    } catch (err) {
      console.error('Failed to revoke API key');
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="bg-[#090d16] text-slate-100 font-sans pb-24 min-h-screen selection:bg-blue-600/30 selection:text-blue-200">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SOC Analyst Profile & Access Keys
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authentication identity, role permissions, and B2B telemetry API credentials.
          </p>
        </div>

        <Card className="border-slate-800/80 bg-slate-900/70 shadow-2xl backdrop-blur-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border border-white/20 shadow-lg">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{username}</h2>
                  <Badge variant="success" className="text-[10px] font-mono uppercase">
                    Operator Active
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {username.toLowerCase()}@omnishield.internal
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px] font-mono">
                    Tier: Enterprise SOC
                  </Badge>
                  <span className="text-xs text-slate-500">• 10,000 RPM Allocation</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-400" /> B2B Telemetry & Scan API Keys
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    API keys allow external microservices to authenticate against <code>/api/external/v1/scan</code>.
                  </p>
                </div>

                <Button
                  onClick={generateApiKey}
                  disabled={loading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs gap-1.5"
                >
                  {loading ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Generate Key</span>
                </Button>
              </div>

              {apiKeys.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                  No active B2B API keys generated yet. Click "Generate Key" to create a secret token.
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {apiKeys.map((k, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-200 tracking-wider truncate bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                            {k.api_key}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyKey(k.api_key)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Copy API Key"
                          >
                            {copiedKey === k.api_key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Created on {new Date(k.created_at).toLocaleString()} • Scope: Full Telemetry
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeApiKey(k.api_key)}
                        className="text-xs gap-1.5 self-start md:self-auto h-8 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-blue-400 font-semibold">Usage Header:</span> Pass in HTTP request as{' '}
                <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">X-API-Key: &lt;YOUR_KEY&gt;</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
