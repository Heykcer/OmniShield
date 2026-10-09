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
    // Check if user is logged in by looking for the JWT
    const token = localStorage.getItem('omnishield_token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  // Keep the navbar ultra-minimal on the login page
  if (mounted && pathname === '/login') {
    return (
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-center sticky top-0 z-50">
         <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">OmniShield</span>
         </Link>
      </nav>
    );
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analytics', path: '/b2b-analytics' },
    { name: 'Reports', path: '/reports' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 lg:px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">OmniShield</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path} 
              className={`transition-colors ${pathname === link.path ? 'text-blue-600' : 'hover:text-slate-900'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Sign In</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600 p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path} 
              onClick={() => setIsOpen(false)} 
              className={`text-base font-semibold ${pathname === link.path ? 'text-blue-600' : 'text-slate-700'}`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-100" />
          {isLoggedIn ? (
            <Link href="/profile" onClick={() => setIsOpen(false)} className="text-base font-bold text-slate-700 flex items-center gap-2">
              <User className="w-5 h-5" /> Profile
            </Link>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-base font-bold text-slate-700">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
