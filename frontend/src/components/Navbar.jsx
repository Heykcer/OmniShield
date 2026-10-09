"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('omnishield_token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  if (mounted && pathname === '/login') {
    return (
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white font-mono">OmniShield</span>
        </Link>
      </header>
    );
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'B2B Telemetry', path: '/b2b-analytics' },
    { name: 'Model Metrics', path: '/analytics' },
    { name: 'Compliance Reports', path: '/reports' },
    { name: 'API Docs', path: '/developers' },
    { name: 'Pricing', path: '/pricing' }
  ];

  return (
    <header className="bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-8 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] ring-1 ring-white/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-mono">OmniShield</span>
              <span className="text-[10px] font-bold font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">SOC v2</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side telemetry & profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Operational Status Pill */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-medium text-slate-300">Models Online</span>
          </div>

          {isLoggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all hover:border-slate-700"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                A
              </div>
              <span>SecAdmin</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1 pb-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
            {isLoggedIn ? (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-400" /> My Profile
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
