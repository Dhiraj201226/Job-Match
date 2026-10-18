import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Cloud, ShieldCheck, Sparkles, Layers, CreditCard, Menu, X, Info } from 'lucide-react';

export default function Navbar() {
  const [providerStatus, setProviderStatus] = useState({
    mode: 'cloud',
    model: 'gemma4:31b-cloud',
    badgeText: 'Running: Gemma 4 31B (cloud)',
    badgeType: 'cloud'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Fetch provider status from serverless endpoint
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setProviderStatus(data);
        }
      } catch (err) {
        console.warn('Could not fetch status, using default:', err);
      }
    };
    fetchStatus();

    // Listen to saved jobs count updates from localStorage
    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('jobmatch_saved_jobs') || '[]');
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setSavedCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('savedJobsUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('savedJobsUpdated', updateCount);
    };
  }, []);

  const isLocal = providerStatus.badgeType === 'local' || providerStatus.mode === 'local';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                      JobMatch<span className="text-blue-500">.ai</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Gemma 4
                    </span>
                  </div>
                  <span className="text-xs text-textMuted hidden sm:block">Side Hustle & Freelance Gig Matcher</span>
                </div>
              </Link>
            </div>

            {/* Provider Status Badge (Center on desktop) */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isLocal
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                    : 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/50'
                }`}
                title="Click for model runtime and privacy details"
              >
                <span className={`w-2 h-2 rounded-full pulse-dot ${isLocal ? 'bg-emerald-400' : 'bg-purple-400'}`} />
                {isLocal ? <ShieldCheck className="w-3.5 h-3.5" /> : <Cloud className="w-3.5 h-3.5" />}
                <span>{providerStatus.badgeText || (isLocal ? 'Running: local (private)' : 'Running: Gemma 4 31B (cloud)')}</span>
                <Info className="w-3 h-3 text-textMuted hover:text-white ml-0.5" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition ${
                  location.pathname === '/' ? 'text-blue-400 font-semibold' : 'text-textMuted hover:text-white'
                }`}
              >
                Match & Propose
              </Link>

              <Link
                to="/saved"
                className={`text-sm font-medium flex items-center space-x-1.5 transition ${
                  location.pathname === '/saved' ? 'text-blue-400 font-semibold' : 'text-textMuted hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Compare & Rank</span>
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>

              <Link
                to="/pricing"
                className={`text-sm font-medium flex items-center space-x-1.5 transition ${
                  location.pathname === '/pricing' ? 'text-blue-400 font-semibold' : 'text-textMuted hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Pricing</span>
              </Link>

              <Link
                to="/"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition shadow-md shadow-blue-500/20"
              >
                Try Matcher
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-textMuted hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e1626] border-b border-white/10 px-4 pt-3 pb-5 space-y-3">
            {/* Status Badge in mobile */}
            <div className="pb-2 border-b border-white/5">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isLocal
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full pulse-dot ${isLocal ? 'bg-emerald-400' : 'bg-purple-400'}`} />
                {isLocal ? <ShieldCheck className="w-3.5 h-3.5" /> : <Cloud className="w-3.5 h-3.5" />}
                <span>{providerStatus.badgeText}</span>
              </div>
            </div>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-white hover:text-blue-400 py-1"
            >
              Match & Propose
            </Link>
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-medium text-white hover:text-blue-400 py-1"
            >
              <span>Compare & Rank</span>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-white hover:text-blue-400 py-1"
            >
              Pricing (Plans)
            </Link>
          </div>
        )}
      </nav>

      {/* Model & Privacy Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111827] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white">AI Layer & Privacy Architecture</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="text-textMuted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-textMuted leading-relaxed">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="font-semibold text-white mb-1 flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isLocal ? 'bg-emerald-400' : 'bg-purple-400'}`} />
                  <span>Current Runtime: {providerStatus.badgeText}</span>
                </div>
                <p className="text-xs text-textMuted">
                  {providerStatus.privacyNotice}
                </p>
              </div>

              <div>
                <strong className="text-white block mb-1">Two Open-Weight Execution Modes:</strong>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  <li>
                    <span className="text-purple-300 font-medium">Cloud Mode:</span> Runs Google’s heavy frontier-grade <code className="text-white bg-black/40 px-1 py-0.5 rounded">gemma4:31b-cloud</code> via the Ollama Cloud API. Serverless backend protects your API key.
                  </li>
                  <li>
                    <span className="text-emerald-300 font-medium">Local Mode:</span> Connects directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">http://localhost:11434</code> running local Gemma 4. Zero data leaves your laptop.
                  </li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                💡 Built for the DEV Hacktoberfest Week 2 "Side Hustle" Open-Source AI Challenge.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
