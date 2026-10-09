"use client";

import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Eye, X, Activity } from 'lucide-react';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReports(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  const generateReport = async () => {
    const token = localStorage.getItem('omnishield_token');
    if (!token) return;
    setGenerating(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reports/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
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
      // Handle Headings
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
      }
      
      // Handle bold text inline
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Handle lists
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 list-disc marker:text-slate-400">{formattedLine.slice(1)}</li>; // slice to remove the "- "
      }

      // Empty lines or regular paragraphs
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      
      return <p key={i} className="mb-2 leading-relaxed">{formattedLine}</p>;
    });
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans min-h-[calc(100vh-80px)] pb-24 relative">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Compliance Reports</h1>
            <p className="text-slate-500 font-medium">Download auto-generated forensic and compliance reports.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
               <Filter className="w-4 h-4" /> Filter
             </button>
             <button 
               onClick={generateReport}
               disabled={generating}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
             >
               {generating ? <Activity className="w-4 h-4 animate-spin" /> : null}
               {generating ? 'Consolidating Data...' : 'Generate New'}
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative z-10">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-5">Report Name</th>
                <th className="px-6 py-5">Generated Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Size</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{report.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-600">{report.date}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${
                      report.status === 'Ready' 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                        : 'bg-slate-100 text-slate-600 ring-slate-500/20'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-500">{report.size}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View Report"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Download Report"
                        onClick={() => alert('Mock: Downloading PDF...')}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">{selectedReport.name}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedReport.id} • {selectedReport.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <div className="text-slate-700 font-medium">
                {renderMarkdown(selectedReport.content)}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${
                      selectedReport.status === 'Ready' 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                        : 'bg-slate-100 text-slate-600 ring-slate-500/20'
                    }`}>
                      {selectedReport.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{selectedReport.size}</span>
                </div>
                <button 
                  onClick={() => alert('Mock: Downloading PDF...')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
