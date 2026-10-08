import { User, Key } from 'lucide-react';

export default function Profile() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Account Settings</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-200">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Security Admin</h2>
              <p className="text-slate-500 font-medium">admin@omnishield.dev</p>
              <div className="mt-2 inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Professional Plan Active
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Key className="w-5 h-5 text-slate-400" /> API Access</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
               <div className="font-mono text-sm text-slate-600 tracking-widest">
                  sk_live_**********************82a
               </div>
               <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Reveal Key</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
