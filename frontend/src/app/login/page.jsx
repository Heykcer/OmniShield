"use client";

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, ShieldCheck, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Endpoint flips depending on if they are in "Register" or "Login" mode
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Success! Save the JWT securely
      localStorage.setItem('omnishield_token', data.access_token);
      
      // Redirect to the protected dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#090d16] flex flex-col justify-center min-h-[calc(100vh-80px)] py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-600/30 selection:text-blue-200">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-1 ring-white/20 mb-4">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          {isRegister ? "Create SOC Analyst Account" : "Authenticate to SOC Console"}
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          {isRegister ? "Already configured credentials?" : "Authorized personnel only. Need access?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer transition-colors"
          >
            {isRegister ? "Sign in instead" : "Create local account"}
          </button>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-800/80 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2.5 text-xs font-medium">
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@omnishield.dev"
                    className="pl-9 h-11 text-xs bg-slate-950/80 border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 h-11 text-xs bg-slate-950/80 border-slate-700 font-mono"
                  />
                </div>
              </div>

              {!isRegister && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                    />
                    <span>Remember terminal</span>
                  </label>
                  <Link href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300">
                    Forgot key?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase font-mono shadow-md gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? "Register Account" : "Authenticate"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-0 border-t border-slate-800/60 pb-4 justify-center">
            <span className="text-[10px] text-slate-500 font-mono">
              FIPS 140-2 Compatible • 256-bit JWT Encryption
            </span>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
