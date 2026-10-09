"use client";

import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Eye, X, Activity, Sparkles, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReports(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const generateReport = async () => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) return;
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReports(); // Refresh the list
      }
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const normalizedText = text.replace(/\\n/g, '\n');
    return normalizedText.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4 mb-1 list-disc text-slate-300 marker:text-blue-400">
            {formattedLine.slice(1)}
          </li>
        );
      }

      if (line.trim() === '') return <div key={i} className="h-2"></div>;

      return (
        <p key={i} className="mb-2 leading-relaxed text-slate-300">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-[#090d16] text-slate-100 font-sans min-h-[calc(100vh-80px)] pb-24 relative selection:bg-blue-600/30 selection:text-blue-200">
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px] font-mono">
                SOC 2 & ISO 27001
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Forensic Auditing</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Forensic & Compliance Intelligence Reports
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Download cryptographic audit logs, Gemini XAI briefs, and executive compliance documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={generateReport}
              disabled={generating}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs gap-1.5 shadow-md"
            >
              {generating ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{generating ? 'Consolidating Audit Data...' : 'Generate New Report'}</span>
            </Button>
          </div>
        </div>

        <Card className="border-slate-800/80 bg-slate-900/70 shadow-2xl backdrop-blur-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-900/90">
                <TableHead>Report Name & ID</TableHead>
                <TableHead>Generated Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-slate-800/60 hover:bg-slate-800/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-white">{report.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">{report.id}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-slate-400">
                    {report.date}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={report.status === 'Ready' ? 'success' : 'secondary'}
                      className="text-[10px] font-mono uppercase"
                    >
                      {report.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-slate-400">{report.size}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        title="View Report Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert('Mock: Downloading Cryptographic PDF Report...')}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm tracking-tight">{selectedReport.name}</h2>
                  <p className="text-[10px] font-mono text-slate-400">
                    {selectedReport.id} • {selectedReport.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="text-xs">{renderMarkdown(selectedReport.content)}</div>
            </div>

            <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px] font-mono uppercase">
                  {selectedReport.status}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400">{selectedReport.size}</span>
              </div>
              <Button
                size="sm"
                onClick={() => alert('Mock: Downloading PDF...')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
