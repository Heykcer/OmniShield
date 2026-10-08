import { FileText, Download, Filter } from 'lucide-react';

export default function Reports() {
  const reports = [
    { id: 'REP-001', name: 'Weekly Threat Summary', date: 'Oct 08, 2026', status: 'Ready', size: '2.4 MB' },
    { id: 'REP-002', name: 'Phishing Campaign Analysis', date: 'Oct 07, 2026', status: 'Ready', size: '5.1 MB' },
    { id: 'REP-003', name: 'Monthly Executive Brief', date: 'Oct 01, 2026', status: 'Archived', size: '1.2 MB' },
    { id: 'REP-004', name: 'Zero-Day Vulnerability Scan', date: 'Sep 28, 2026', status: 'Ready', size: '8.4 MB' },
  ];

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Compliance Reports</h1>
            <p className="text-slate-500 font-medium">Download auto-generated forensic and compliance reports.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50">
               <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:bg-blue-700">
               Generate New
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
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
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
