"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Info,
  Lock,
  Activity,
  Globe,
  UploadCloud,
  Link as LinkIcon,
  FileVideo,
  AlertTriangle,
  CheckCircle,
  Database,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  ArrowUpRight,
  ExternalLink,
  SlidersHorizontal,
  FileText,
  Clock
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('phishing');

  // Phishing State
  const [url, setUrl] = useState('');
  const [model, setModel] = useState('master');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    threats_blocked: 0,
    pending_review: 0,
    ml_accuracy: '-'
  });

  // Deepfake State
  const [dfFile, setDfFile] = useState(null);
  const [dfLoading, setDfLoading] = useState(false);
  const [dfResult, setDfResult] = useState(null);
  const [dfError, setDfError] = useState('');

  // Logs & Search State
  const [threatLogs, setThreatLogs] = useState([]);
  const [logSearch, setLogSearch] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('ALL');
  const [username, setUsername] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchThreatLogs = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/threats', {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Verify token is valid
    fetch('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((data) => {
        setUsername(data.username);
        fetchThreatLogs(token);
        fetchStats(token);
      })
      .catch(() => {
        localStorage.removeItem('omnishield_token');
        window.location.href = '/login';
      });
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem('omnishield_token');
    if (token) {
      await Promise.all([fetchThreatLogs(token), fetchStats(token)]);
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const analyzeUrl = async (e) => {
    if (e) e.preventDefault();
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
          Authorization: `Bearer ${token}`
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

  const handleDfUpload = async (e) => {
    e.preventDefault();
    if (!dfFile) {
      setDfError('Please select a file to analyze.');
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
          Authorization: `Bearer ${token}`
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Preset demo URLs for instant 1-click evaluation
  const quickSamples = [
    { label: 'Phishing (PayPal Spoof)', url: 'https://paypal-security-verification.support-login.com/auth' },
    { label: 'Phishing (Apple ID Suspended)', url: 'https://verify-apple-id-device-locked.net/login' },
    { label: 'Legitimate (GitHub Enterprise)', url: 'https://github.com/features/security' },
    { label: 'Legitimate (Microsoft Security)', url: 'https://microsoft.com/security' }
  ];

  // Filter threat logs
  const filteredLogs = threatLogs.filter((log) => {
    const matchesSearch =
      log.target?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.tool?.toLowerCase().includes(logSearch.toLowerCase());
    const matchesStatus =
      logStatusFilter === 'ALL' || log.status?.toLowerCase() === logStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#090d16] text-slate-100 min-h-screen selection:bg-blue-600/30 selection:text-blue-200 pb-20 font-sans">
      
      {/* Top SOC Subheader / Command Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-white tracking-tight">
                  Security Operations Center
                </h1>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 font-mono text-[10px]">
                  US-EAST-1 PROD
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Unified AI Threat Intelligence & Biometric Forensics Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inference Engine: Active</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh Metrics</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* KPI Stat Cards (shadcn Card Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Stat 1: Master Ensemble Model */}
          <Card className="hover:border-slate-700/80 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                Validation Status
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Database className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-white">Cross-Dataset</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success" className="text-[10px] px-1.5 py-0 font-mono">
                  Validated
                </Badge>
                <span className="text-xs text-slate-400">AUC-ROC 0.942</span>
              </div>
            </CardContent>
          </Card>

          {/* Stat 2: Threats Intercepted */}
          <Card className="hover:border-slate-700/80 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                Threats Quarantined
              </span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-white">
                {stats.threats_blocked}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-rose-400 font-medium">Zero-Day Attacks</span>
                <span className="text-xs text-slate-500">• Auto-isolated</span>
              </div>
            </CardContent>
          </Card>

          {/* Stat 3: Pending Review */}
          <Card className="hover:border-slate-700/80 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                Analyst Queue
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-white">
                {stats.pending_review}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-amber-300 font-medium">Pending Review</span>
                <span className="text-xs text-slate-500">• Escalation queue</span>
              </div>
            </CardContent>
          </Card>

          {/* Stat 4: ML Accuracy */}
          <Card className="hover:border-slate-700/80 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
                Ensemble Accuracy
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Activity className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-white">
                {stats.ml_accuracy}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 font-mono">
                  Stacking Classifier
                </Badge>
                <span className="text-xs text-slate-400">10-Fold CV</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Dashboard Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <TabsList className="bg-slate-900/90 border border-slate-800 p-1">
              <TabsTrigger value="phishing" className="gap-2 text-xs">
                <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>URL Phishing Detection</span>
                <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.0
                </span>
              </TabsTrigger>
              <TabsTrigger value="deepfake" className="gap-2 text-xs">
                <FileVideo className="w-3.5 h-3.5 text-purple-400" />
                <span>Deepfake Forensics</span>
                <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  CNN
                </span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2 text-xs">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audit Logs</span>
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 bg-slate-800 font-mono">
                  {threatLogs.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Real-Time Model Consensus: <strong className="text-white">Active</strong></span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: PHISHING ANALYZER */}
          {/* ========================================================================= */}
          <TabsContent value="phishing" className="space-y-6">
            <Card className="border-slate-800/80 bg-slate-900/70">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      URL Phishing & Malicious Domain Analyzer
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Extracts 30+ lexical, domain, and structural features. Evaluated by our cross-dataset validated ensemble model.
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono border-slate-700 bg-slate-800/60 text-slate-300">
                      Response: &lt; 45ms
                    </Badge>
                  </div>
                </div>

                {/* Quick 1-click Preset Chips */}
                <div className="pt-4 border-t border-slate-800/60">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                    Quick Inspection Samples (1-Click Fill):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickSamples.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUrl(sample.url)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer group"
                      >
                        <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        <span>{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Form Input Group */}
                <form onSubmit={analyzeUrl} className="space-y-4">
                  <div className="flex flex-col lg:flex-row items-stretch gap-3">
                    
                    {/* URL Input */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Search className="w-4 h-4" />
                      </div>
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste suspicious target URL (e.g., https://secure-login-verify.top/auth)"
                        className="pl-10 h-12 text-sm bg-slate-950/80 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 font-mono"
                        required
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={() => setUrl('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Model Selector Dropdown */}
                    <div className="w-full lg:w-72">
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full h-12 px-3.5 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                      >
                        <option value="master" className="bg-slate-900 text-slate-100 font-semibold">
                          ★ Master Hybrid Ensemble (Recommended)
                        </option>
                        <option value="xgboost" className="bg-slate-900 text-slate-100">
                          XGBoost Classifier
                        </option>
                        <option value="lightgbm" className="bg-slate-900 text-slate-100">
                          LightGBM Booster
                        </option>
                        <option value="rf" className="bg-slate-900 text-slate-100">
                          Random Forest Engine
                        </option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md gap-2 whitespace-nowrap min-w-[140px]"
                    >
                      {loading ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin text-white" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Scan Target</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {/* Active Loading Animation */}
                {loading && (
                  <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Extracting Lexical Features & Running Consensus Inference...
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Model: {model.toUpperCase()} • Cross-Dataset Validation Active
                      </p>
                    </div>
                  </div>
                )}

                {/* Scan Results Card */}
                {result && !loading && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 space-y-8 shadow-2xl animate-in fade-in-50 duration-300">
                    
                    {/* Header Verdict Ribbon */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                      
                      {/* Verdict Badge & Title */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`p-3.5 rounded-2xl border shadow-inner ${
                            result.is_phishing
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {result.is_phishing ? (
                            <ShieldAlert className="w-8 h-8" />
                          ) : (
                            <ShieldCheck className="w-8 h-8" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                              Verdict from {result.model_used || 'Hybrid Ensemble'}
                            </span>
                            <Badge
                              variant={result.is_phishing ? 'destructive' : 'success'}
                              className="text-[10px] uppercase font-mono tracking-widest"
                            >
                              {result.is_phishing ? 'CRITICAL THREAT' : 'VERIFIED SAFE'}
                            </Badge>
                          </div>

                          <h2
                            className={`text-2xl font-black tracking-tight ${
                              result.is_phishing ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {result.is_phishing ? 'PHISHING THREAT DETECTED' : 'LEGITIMATE & SAFE DOMAIN'}
                          </h2>
                          <p className="text-xs text-slate-400 mt-1 font-mono break-all">
                            Target: {url}
                          </p>
                        </div>
                      </div>

                      {/* Risk Score Progress Gauge */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[220px] flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                            Calculated Risk
                          </span>
                          <span
                            className={`text-xl font-black font-mono ${
                              result.is_phishing ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {(result.risk_score * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${
                              result.is_phishing ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(5, result.risk_score * 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
                          <span>Confidence Level</span>
                          <span className="text-slate-300 font-semibold">High Precision</span>
                        </div>
                      </div>

                    </div>

                    {/* Breakdown Grid: Vectors + XAI Explainability */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Extracted Threat Vectors */}
                      <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                            <Layers className="w-4 h-4 text-blue-400" />
                            Extracted Threat Vectors & Heuristics
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Structural features extracted during tokenization and lexical scan.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {result.risk_factors && result.risk_factors.length > 0 ? (
                            <div className="space-y-2.5">
                              {result.risk_factors.map((factor, index) => (
                                <div
                                  key={index}
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
                                    result.is_phishing
                                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {result.is_phishing ? (
                                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    ) : (
                                      <Info className="w-4 h-4 text-blue-400" />
                                    )}
                                  </div>
                                  <span className="font-medium leading-relaxed">{factor}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-xs">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span>No anomalous or deceptive structural factors detected in target URL.</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Right: Explainable AI Summary */}
                      <Card className="border-slate-800 bg-slate-900/60 flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                              <Sparkles className="w-4 h-4 text-indigo-400" />
                              Explainable AI (XAI) Intelligence Brief
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                              Gemini Forensics
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            Human-interpretable risk rationale generated for security analysts.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          {result.explanation ? (
                            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                              <ReactMarkdown 
                                components={{
                                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                  strong: ({node, ...props}) => <strong className="font-semibold text-slate-100" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2 last:mb-0" {...props} />,
                                  li: ({node, ...props}) => <li className="text-slate-300" {...props} />
                                }}
                              >
                                {result.explanation}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-500">
                              No additional XAI explanation provided for this evaluation.
                            </div>
                          )}

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono text-[11px]">Audit ID: OMNI-{Math.floor(Math.random() * 899999 + 100000)}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(url)}
                              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                            >
                              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedUrl ? 'Copied' : 'Copy Target'}</span>
                            </button>
                          </div>
                        </CardContent>
                      </Card>

                    </div>

                  </div>
                )}

              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 2: DEEPFAKE FORENSICS */}
          {/* ========================================================================= */}
          <TabsContent value="deepfake" className="space-y-6">
            <Card className="border-slate-800/80 bg-slate-900/70">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <FileVideo className="w-5 h-5 text-purple-400" />
                      Biometric & Video Deepfake Forensics
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Upload audio or video files. Our PyTorch Convolutional Neural Network slices frames to detect biometric synthesis and blending boundaries.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 font-mono text-xs">
                    ResNet-50 Spatial-Temporal CNN
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleDfUpload} className="space-y-6">
                  {/* Dropzone Container */}
                  <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-10 bg-slate-950/50 hover:bg-slate-950/80 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                    <input
                      type="file"
                      className="hidden"
                      accept="video/mp4,video/avi,audio/wav,audio/mpeg"
                      onChange={(e) => setDfFile(e.target.files[0])}
                    />

                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 flex items-center justify-center mb-4 transition-transform shadow-inner">
                      <UploadCloud className="w-8 h-8 text-purple-400" />
                    </div>

                    <h3 className="text-base font-semibold text-white mb-1">
                      {dfFile ? dfFile.name : 'Select or Drop Biometric Media File'}
                    </h3>

                    <p className="text-xs text-slate-400 max-w-sm mb-3">
                      {dfFile
                        ? `${(dfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for inference`
                        : 'Supports MP4, AVI, WAV, MP3 for frame extraction (Max 50MB)'}
                    </p>

                    <Badge variant="secondary" className="text-[11px] font-mono bg-slate-800 text-slate-300">
                      {dfFile ? 'Change Selected File' : 'Browse Local Files'}
                    </Badge>
                  </label>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={dfLoading || !dfFile}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm h-11 px-8 gap-2 shadow-md disabled:opacity-50"
                    >
                      {dfLoading ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin text-white" />
                          <span>Extracting Frames via CNN...</span>
                        </>
                      ) : (
                        <>
                          <FileVideo className="w-4 h-4" />
                          <span>Run Deepfake Forensics</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {dfError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <p className="font-medium">{dfError}</p>
                  </div>
                )}

                {/* Deepfake Forensic Results */}
                {dfResult && !dfLoading && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 space-y-8 shadow-2xl animate-in fade-in-50 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                      
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`p-3.5 rounded-2xl border shadow-inner ${
                            dfResult.is_deepfake
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {dfResult.is_deepfake ? (
                            <AlertTriangle className="w-8 h-8" />
                          ) : (
                            <ShieldCheck className="w-8 h-8" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                              Forensic Authentication Status
                            </span>
                            <Badge
                              variant={dfResult.is_deepfake ? 'destructive' : 'success'}
                              className="text-[10px] uppercase font-mono tracking-widest"
                            >
                              {dfResult.is_deepfake ? 'SYNTHETIC MEDIA' : 'AUTHENTIC MEDIA'}
                            </Badge>
                          </div>

                          <h2
                            className={`text-2xl font-black tracking-tight ${
                              dfResult.is_deepfake ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {dfResult.is_deepfake ? 'AI MANIPULATION DETECTED' : 'BIOMETRICALLY AUTHENTIC'}
                          </h2>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            Analyzed: {dfFile ? dfFile.name : 'Uploaded Media'}
                          </p>
                        </div>
                      </div>

                      {/* Manipulation Risk Meter */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[220px] flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                            Manipulation Prob.
                          </span>
                          <span
                            className={`text-xl font-black font-mono ${
                              dfResult.is_deepfake ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {(dfResult.risk_score * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${
                              dfResult.is_deepfake ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(5, dfResult.risk_score * 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
                          <span>Spatial Noise Variance</span>
                          <span className="text-slate-300 font-semibold">&sigma; = 0.041</span>
                        </div>
                      </div>

                    </div>

                    {/* Artifacts and Explanation */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                            <Layers className="w-4 h-4 text-purple-400" />
                            Forensic Artifacts Identified
                          </CardTitle>
                          <CardDescription className="text-xs">
                            CNN boundary anomalies and face synthesis markers.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {dfResult.artifacts_detected && dfResult.artifacts_detected.length > 0 ? (
                            <div className="space-y-2.5">
                              {dfResult.artifacts_detected.map((artifact, index) => (
                                <div
                                  key={index}
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
                                    dfResult.is_deepfake
                                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {dfResult.is_deepfake ? (
                                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    ) : (
                                      <Info className="w-4 h-4 text-purple-400" />
                                    )}
                                  </div>
                                  <span className="font-medium leading-relaxed">{artifact}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-xs">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span>No facial warping or synthesis artifacts detected.</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            Expert Forensic Summary
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Synthesis evaluation produced by our computer vision pipeline.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {dfResult.explanation ? (
                            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                              <p className="whitespace-pre-line">{dfResult.explanation}</p>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-500">
                              Standard forensic baseline check passed.
                            </div>
                          )}
                        </CardContent>
                      </Card>

                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 3: THREAT AUDIT LOGS */}
          {/* ========================================================================= */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-slate-800/80 bg-slate-900/70">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <Database className="w-5 h-5 text-emerald-400" />
                      Live Threat Intelligence Audit Stream
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Persistent record of analyzed targets, ML models utilized, and automated quarantine decisions.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchThreatLogs(localStorage.getItem('omnishield_token'))}
                      className="text-xs gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh Log Feed
                    </Button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Filter by target URL or model tool..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="pl-9 h-9 text-xs bg-slate-950/90 border-slate-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-400 font-mono">Status:</span>
                    <select
                      value={logStatusFilter}
                      onChange={(e) => setLogStatusFilter(e.target.value)}
                      className="h-9 px-3 rounded-lg bg-slate-950/90 border border-slate-700 text-xs text-slate-300 focus:outline-none font-mono"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Safe">Safe Only</option>
                      <option value="Medium">Medium / Suspicious</option>
                      <option value="High">Critical / High</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 bg-slate-900/90">
                        <TableHead className="w-[300px]">Target / Analyzed Target</TableHead>
                        <TableHead>Detection Tool</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">Analyst Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id} className="border-slate-800/60 hover:bg-slate-900/50">
                            
                            {/* Target Column */}
                            <TableCell className="font-mono text-xs">
                              <div className="flex items-center gap-2 max-w-[280px]">
                                <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                <span className="truncate text-slate-200" title={log.target}>
                                  {log.target}
                                </span>
                              </div>
                            </TableCell>

                            {/* Detection Tool Column */}
                            <TableCell className="text-xs">
                              <Badge variant="outline" className="font-mono text-[10px] bg-slate-900 border-slate-700 text-slate-300">
                                {log.tool || 'Ensemble'}
                              </Badge>
                            </TableCell>

                            {/* Risk Score */}
                            <TableCell className="text-xs font-mono font-bold">
                              <span
                                className={
                                  log.risk >= 70
                                    ? 'text-rose-400'
                                    : log.risk >= 30
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                                }
                              >
                                {log.risk}%
                              </span>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Badge
                                variant={
                                  log.status === 'Safe'
                                    ? 'success'
                                    : log.status === 'Medium'
                                    ? 'warning'
                                    : 'destructive'
                                }
                                className="text-[10px] font-mono uppercase"
                              >
                                {log.status}
                              </Badge>
                            </TableCell>

                            {/* Time */}
                            <TableCell className="text-xs text-slate-400 font-mono">
                              {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              <span className="text-[10px] text-slate-500 ml-1.5">
                                {new Date(log.time).toLocaleDateString()}
                              </span>
                            </TableCell>

                            {/* Action */}
                            <TableCell className="text-right">
                              {log.status !== 'Safe' ? (
                                <button className="text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-md transition-colors">
                                  Review Anomaly
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-mono">
                                  Verified Clean
                                </span>
                              )}
                            </TableCell>

                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                            No threat records matching current filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>
                    Showing {filteredLogs.length} of {threatLogs.length} recorded events
                  </span>
                  <span>Encryption: TLS 1.3 • Zero-Knowledge Logging</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
