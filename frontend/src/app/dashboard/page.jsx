"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Search, Info, Lock, Activity, Globe, UploadCloud, Link as LinkIcon, FileVideo, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('phishing');
  
  // Phishing State
  const [url, setUrl] = useState('');
  const [model, setModel] = useState('xgboost');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Dashboard Stats
  const [stats, setStats] = useState({
    threats_blocked: 0,
    pending_review: 0,
    ml_accuracy: '-'
  });

  // Deepfake State
  const [dfLoading, setDfLoading] = useState(false);

  const [username, setUsername] = useState('');

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    // Verify token is valid
    fetch('http://localhost:8000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Invalid token');
      return res.json();
    })
    .then(data => {
      setUsername(data.username);
      fetchThreatLogs(token);
      fetchStats(token);
    })
    .catch(() => {
      localStorage.removeItem('omnishield_token');
      window.location.href = '/login';
    });
  }, []);

  const fetchThreatLogs = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/threats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setThreatLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch threat logs', err);
    }
  };

  const fetchStats = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const analyzeUrl = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    const token = localStorage.getItem('omnishield_token');

    try {
      const res = await fetch('http://localhost:8000/api/phishing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url, model })
      });
      
      if (!res.ok) throw new Error('Failed to connect to AI Inference Engine');
      
      const data = await res.json();
      setResult(data);
      
      // Refresh the threat logs and stats after a scan
      fetchThreatLogs(token);
      fetchStats(token);
    } catch (err) {
      setError(err.message || 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const [dfFile, setDfFile] = useState(null);
  const [dfResult, setDfResult] = useState(null);
  const [dfError, setDfError] = useState('');

  const handleDfUpload = async (e) => {
    e.preventDefault();
    if (!dfFile) {
        setDfError("Please select a file to analyze.");
        return;
    }
    
    setDfLoading(true);
    setDfError('');
    setDfResult(null);

    const token = localStorage.getItem('omnishield_token');
    const formData = new FormData();
    formData.append('file', dfFile);

    try {
      const res = await fetch('http://localhost:8000/api/deepfake', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to connect to Deepfake Inference Engine');
      
      const data = await res.json();
      setDfResult(data);
      
      // Refresh the threat logs and stats after a scan
      fetchThreatLogs(token);
      fetchStats(token);
    } catch (err) {
      setDfError(err.message || 'Unknown error occurred.');
    } finally {
      setDfLoading(false);
    }
  };

  const [threatLogs, setThreatLogs] = useState([]); // Fetch from backend later

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-24">
      <main className="max-w-6xl mx-auto px-6 py-10 md:py-16">
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-xl"><Database className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cross-Dataset</p>
              <p className="text-2xl font-black text-slate-900">Validated</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-red-50 p-4 rounded-xl"><ShieldAlert className="w-6 h-6 text-red-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Threats Blocked</p>
              <p className="text-2xl font-black text-slate-900">{stats.threats_blocked}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-4 rounded-xl"><AlertTriangle className="w-6 h-6 text-amber-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pending Review</p>
              <p className="text-2xl font-black text-slate-900">{stats.pending_review}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl"><Globe className="w-6 h-6 text-emerald-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">ML Accuracy</p>
              <p className="text-2xl font-black text-slate-900">{stats.ml_accuracy}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden mb-12">
           <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50">
             <button 
               onClick={() => setActiveTab('phishing')}
               className={`flex-1 py-5 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'phishing' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <LinkIcon className="w-5 h-5" /> Phishing URLs
             </button>
             <button 
               onClick={() => setActiveTab('deepfake')}
               className={`flex-1 py-5 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'deepfake' ? 'bg-white border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <FileVideo className="w-5 h-5" /> Deepfake Forensics
             </button>
             <button 
               onClick={() => setActiveTab('logs')}
               className={`flex-1 py-5 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'logs' ? 'bg-white border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <Activity className="w-5 h-5" /> Live Threat Logs
             </button>
           </div>

           {/* Tab Content */}
           <div className="p-8 md:p-12 min-h-[400px]">
             
             {/* 1. Phishing Tab */}
             {activeTab === 'phishing' && (
                <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">URL Phishing Analyzer</h2>
                    <p className="text-slate-500 font-medium">Extract URL features and evaluate using XGBoost, LightGBM, or Random Forest models.</p>
                  </div>
                  
                  <form onSubmit={analyzeUrl} className="relative shadow-sm rounded-2xl bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all duration-300 mb-10 flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center flex-1 border-b md:border-b-0 md:border-r border-slate-200">
                      <div className="pl-6 text-slate-400"><Search className="w-6 h-6" /></div>
                      <input 
                        type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste a suspicious link (e.g., https://secure-login.com)"
                        className="w-full px-4 py-5 md:py-6 text-lg bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-slate-50 md:bg-transparent md:p-0 md:px-4">
                      <select 
                        value={model} onChange={(e) => setModel(e.target.value)}
                        className="bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="xgboost">XGBoost (Primary)</option>
                        <option value="lightgbm">LightGBM</option>
                        <option value="rf">Random Forest</option>
                      </select>
                      
                      <button type="submit" disabled={loading} className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-70 flex items-center gap-2 shadow-sm whitespace-nowrap">
                        {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Scan URL'}
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium mb-6">
                      <ShieldAlert className="w-5 h-5" /> <p>{error}</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 animate-pulse">
                      <Activity className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                      <p className="text-lg font-bold text-slate-600">Extracting URL Features & Running Inference...</p>
                    </div>
                  )}

                  {result && !loading && (
                    <div className="bg-[#F8FAFC] rounded-3xl p-6 md:p-10 border border-slate-200">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl shadow-sm border ${result.is_phishing ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {result.is_phishing ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                          </div>
                          <div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{result.model_used || 'Analysis'} Status</h2>
                            <p className={`text-2xl font-extrabold tracking-tight ${result.is_phishing ? 'text-red-600' : 'text-emerald-600'}`}>
                              {result.is_phishing ? 'PHISHING THREAT' : 'LEGITIMATE URL'}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white px-6 py-5 rounded-2xl flex flex-col justify-center border border-slate-200 min-w-[200px] w-full md:w-auto shadow-sm">
                          <div className="flex items-end justify-between mb-2">
                            <p className="text-sm font-bold text-slate-500">Risk Score</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-slate-800">{(result.risk_score * 100).toFixed(1)}</span>
                              <span className="text-sm font-bold text-slate-400">%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full transition-all duration-1000 ease-out ${result.is_phishing ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.max(5, result.risk_score * 100)}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100"><Activity className="w-5 h-5 text-indigo-600" /></div>
                          <h3 className="text-xl font-extrabold text-slate-800">Extracted Threat Vectors</h3>
                        </div>
                        
                        {result.risk_factors && result.risk_factors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.risk_factors.map((factor, index) => (
                              <div key={index} className={`flex items-start gap-3 p-4 rounded-2xl border ${result.is_phishing ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`mt-0.5 ${result.is_phishing ? 'text-red-500' : 'text-slate-400'}`}>
                                  {result.is_phishing ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                </div>
                                <p className={`text-sm font-bold ${result.is_phishing ? 'text-red-900' : 'text-slate-700'}`}>{factor}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800">
                             <ShieldCheck className="w-5 h-5" />
                             <p className="font-bold text-sm">No structural risk factors were detected in this URL.</p>
                          </div>
                        )}
                        
                        {result.explanation && !result.explanation.includes("**Prediction:**") && (
                          <div className="mt-8 pt-6 border-t border-slate-100">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Gemini XAI Summary</p>
                             <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{result.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
             )}

              {/* 2. Deepfake Tab */}
             {activeTab === 'deepfake' && (
               <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                 <div className="text-center mb-10">
                   <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Media Authenticity Check</h2>
                   <p className="text-slate-500 font-medium mb-10">Upload audio or video files. Our PyTorch CNN will slice frames and analyze them for manipulation artifacts.</p>
                 </div>
                 
                 <form onSubmit={handleDfUpload} className="mb-8">
                   <label className="border-2 border-dashed border-slate-300 rounded-3xl p-12 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-8 flex flex-col items-center justify-center">
                     <input 
                       type="file" 
                       className="hidden" 
                       accept="video/mp4,video/avi,audio/wav,audio/mpeg"
                       onChange={(e) => setDfFile(e.target.files[0])}
                     />
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                       <UploadCloud className="w-10 h-10 text-purple-600" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-800 mb-2">
                       {dfFile ? dfFile.name : "Click to Select Media File"}
                     </h3>
                     <p className="text-sm text-slate-500 font-medium">Supports MP4, AVI, WAV (Max 50MB)</p>
                   </label>

                   <div className="text-center">
                     <button 
                       type="submit"
                       disabled={dfLoading || !dfFile}
                       className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-70 shadow-sm inline-flex items-center gap-2"
                     >
                       {dfLoading ? <Activity className="w-5 h-5 animate-spin" /> : <FileVideo className="w-5 h-5" />}
                       {dfLoading ? 'Processing Frames via CNN...' : 'Analyze Media file'}
                     </button>
                   </div>
                 </form>

                  {dfError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium mb-6">
                      <ShieldAlert className="w-5 h-5" /> <p>{dfError}</p>
                    </div>
                  )}

                  {dfResult && !dfLoading && (
                    <div className="bg-[#F8FAFC] rounded-3xl p-6 md:p-10 border border-slate-200 mt-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl shadow-sm border ${dfResult.is_deepfake ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {dfResult.is_deepfake ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                          </div>
                          <div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Deepfake Forensics Status</h2>
                            <p className={`text-2xl font-extrabold tracking-tight ${dfResult.is_deepfake ? 'text-red-600' : 'text-emerald-600'}`}>
                              {dfResult.is_deepfake ? 'AI MANIPULATION DETECTED' : 'AUTHENTIC MEDIA'}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white px-6 py-5 rounded-2xl flex flex-col justify-center border border-slate-200 min-w-[200px] w-full md:w-auto shadow-sm">
                          <div className="flex items-end justify-between mb-2">
                            <p className="text-sm font-bold text-slate-500">Manipulation Risk</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-slate-800">{(dfResult.risk_score * 100).toFixed(1)}</span>
                              <span className="text-sm font-bold text-slate-400">%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full transition-all duration-1000 ease-out ${dfResult.is_deepfake ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.max(5, dfResult.risk_score * 100)}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100"><Activity className="w-5 h-5 text-purple-600" /></div>
                          <h3 className="text-xl font-extrabold text-slate-800">Forensic Artifacts Detected</h3>
                        </div>
                        
                        {dfResult.artifacts_detected && dfResult.artifacts_detected.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dfResult.artifacts_detected.map((artifact, index) => (
                              <div key={index} className={`flex items-start gap-3 p-4 rounded-2xl border ${dfResult.is_deepfake ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`mt-0.5 ${dfResult.is_deepfake ? 'text-red-500' : 'text-slate-400'}`}>
                                  {dfResult.is_deepfake ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                </div>
                                <p className={`text-sm font-bold ${dfResult.is_deepfake ? 'text-red-900' : 'text-slate-700'}`}>{artifact}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800">
                             <ShieldCheck className="w-5 h-5" />
                             <p className="font-bold text-sm">No forensic artifacts detected.</p>
                          </div>
                        )}
                        
                        {dfResult.explanation && (
                          <div className="mt-8 pt-6 border-t border-slate-100">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Expert Analysis Summary</p>
                             <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{dfResult.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
               </div>
             )}

             {/* 3. Threat Logs Tab */}
             {activeTab === 'logs' && (
               <div className="animate-in fade-in duration-500">
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Threat Logs</h2>
                   <button 
                     onClick={() => fetchThreatLogs(localStorage.getItem('omnishield_token'))}
                     className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2"
                   >
                     <Activity className="w-4 h-4" /> Refresh Logs
                   </button>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-4 font-bold">Target / File</th>
                          <th className="px-5 py-4 font-bold">Detection Tool</th>
                          <th className="px-5 py-4 font-bold">Risk Score</th>
                          <th className="px-5 py-4 font-bold">Status</th>
                          <th className="px-5 py-4 font-bold">Time</th>
                          <th className="px-5 py-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threatLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-800 truncate max-w-[200px]">{log.target}</td>
                            <td className="px-5 py-4 font-medium text-slate-500">{log.tool}</td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-slate-700">{log.risk}%</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                                log.status === 'Safe' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                                log.status === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                'bg-red-50 text-red-700 ring-red-600/20'
                              }`}>
                               {log.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-500 font-medium">
                              {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                              <span className="text-xs ml-2 text-slate-400">{new Date(log.time).toLocaleDateString()}</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {log.status !== 'Safe' ? (
                                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                  Release / False Positive
                                </button>
                              ) : (
                                <button className="text-xs font-bold text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg" disabled>
                                  Verified Safe
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
             )}

           </div>
        </div>

      </main>
    </div>
  );
}
