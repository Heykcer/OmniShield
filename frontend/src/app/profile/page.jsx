"use client";

import { useState, useEffect } from 'react';
import { User, Key, Plus, Trash2 } from 'lucide-react';

export default function Profile() {
  const [username, setUsername] = useState('Security Admin');
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Fetch user info
    fetch('http://localhost:8000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.username) setUsername(data.username);
    })
    .catch(() => {});

    // Fetch API keys
    fetchApiKeys(token);
  }, []);

  const fetchApiKeys = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/api-keys', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch API keys");
    }
  };

  const generateApiKey = async () => {
    setLoading(true);
    const token = localStorage.getItem('omnishield_token');
    try {
      const res = await fetch('http://localhost:8000/api/auth/api-keys', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchApiKeys(token);
      }
    } catch (err) {
      console.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  const revokeApiKey = async (key) => {
    if (!confirm("Are you sure you want to revoke this API key? This will instantly break any external integrations using it.")) return;
    
    const token = localStorage.getItem('omnishield_token');
    try {
      const res = await fetch(`http://localhost:8000/api/auth/api-keys/${key}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchApiKeys(token);
      }
    } catch (err) {
      console.error("Failed to revoke API key");
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans pb-24 min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Account Settings</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-200">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{username}</h2>
              <p className="text-slate-500 font-medium">{username.toLowerCase()}@omnishield.dev</p>
              <div className="mt-2 inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Professional Plan Active
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Key className="w-5 h-5 text-slate-400" /> B2B API Access</h3>
                <button 
                    onClick={generateApiKey}
                    disabled={loading}
                    className="flex items-center gap-1 text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Generate Key
                </button>
            </div>
            
            {apiKeys.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">
                    No active API keys found. Generate one to integrate OmniShield into your own platform.
                </div>
            ) : (
                <div className="space-y-3">
                    {apiKeys.map((k, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="font-mono text-sm text-slate-700 tracking-widest break-all bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                    {k.api_key}
                                </div>
                                <div className="text-xs text-slate-400 mt-2 font-medium">
                                    Created: {new Date(k.created_at).toLocaleString()}
                                </div>
                            </div>
                            <button 
                                onClick={() => revokeApiKey(k.api_key)}
                                className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors self-start md:self-auto"
                            >
                                <Trash2 className="w-4 h-4" /> Revoke
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600">
                <strong>Documentation:</strong> Pass this key in the <code>X-API-Key</code> header to authenticate requests to <code>/api/external/v1/scan</code>.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
