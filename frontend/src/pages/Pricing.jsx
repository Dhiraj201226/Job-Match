import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Shield, Zap, HelpCircle } from 'lucide-react';
import { getUsageCount, MAX_FREE_MATCHES } from '../utils/storage';

export default function Pricing() {
  const usageCount = getUsageCount();
  const remaining = Math.max(0, MAX_FREE_MATCHES - usageCount);

  return (
    <div className="flex-grow p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Side Hustle Economics</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Start Free. Scale As You Win Gigs.
        </h1>
        <p className="text-base text-textMuted">
          Built around Google Gemma 4. Run locally for 100% free private matches, or use our high-speed Cloud 31B cluster.
        </p>

        {/* Free Tier Usage Tracker */}
        <div className="p-4 rounded-xl bg-surface border border-white/10 max-w-md mx-auto text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-textMuted">Free Tier Allocation:</span>
            <span className="font-bold text-white">
              {usageCount} of {MAX_FREE_MATCHES} matches used
            </span>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                remaining === 0 ? 'bg-amber-400' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, (usageCount / MAX_FREE_MATCHES) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-textMuted block mt-2">
            {remaining > 0
              ? `You have ${remaining} free match${remaining === 1 ? '' : 'es'} remaining this month.`
              : 'Free matches exhausted. Local Gemma 4 mode remains unlimited!'}
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Tier 1: Free Starter */}
        <div className="p-6 sm:p-8 bg-surface rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
              Starter
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-textMuted text-sm">/ month</span>
            </div>
            <p className="text-sm text-textMuted">
              Ideal for students and job seekers trying out the tool or running on a personal laptop.
            </p>

            <ul className="space-y-3 pt-4 border-t border-white/10 text-sm text-textMuted">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>3 free matches / month</strong> on Gemma 4 Cloud</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Unlimited</strong> Local Gemma 4 matches</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Match score (0-100) + score reasoning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Matched & missing skills breakdown</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 concrete things to fix per gig</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tailored proposal generator</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              to="/"
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-center block transition text-sm"
            >
              Start Free (No Card)
            </Link>
          </div>
        </div>

        {/* Tier 2: Pro Freelancer (Featured) */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#1a1f36] to-surface rounded-2xl border-2 border-blue-500/50 flex flex-col justify-between hover:border-blue-400 transition-all shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-bold uppercase tracking-wider">
              Pro Freelancer
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-white">$12</span>
              <span className="text-textMuted text-sm">/ month</span>
            </div>
            <p className="text-sm text-textMuted">
              For active freelancers applying to multiple Upwork, Fiverr, or remote jobs weekly.
            </p>

            <ul className="space-y-3 pt-4 border-t border-white/10 text-sm text-textMuted">
              <li className="flex items-center space-x-2 text-white">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong>Unlimited</strong> Gemma 4 31B Cloud matches</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Priority inference speed & queue</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong>Save & compare unlimited jobs</strong> in ranked table</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>5 custom proposal tones & persona modes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>1-Click proposal clipboard export</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Zero model retraining on user inputs</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => alert("Hackathon Demo: Payment placeholder! All features are currently free during judging.")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-center block transition hover:opacity-90 shadow-lg shadow-blue-500/20 text-sm cursor-pointer"
            >
              Upgrade to Pro (Demo)
            </button>
          </div>
        </div>

        {/* Tier 3: Agency / Studio */}
        <div className="p-6 sm:p-8 bg-surface rounded-2xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
              Agency & Studio
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-textMuted text-sm">/ month</span>
            </div>
            <p className="text-sm text-textMuted">
              For boutique agencies or recruiters managing multiple candidate profiles.
            </p>

            <ul className="space-y-3 pt-4 border-t border-white/10 text-sm text-textMuted">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Everything in Pro Freelancer</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Multiple profile switcher (Up to 10 talent profiles)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Batch job post evaluation</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Custom proposal templates & branding</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Dedicated Ollama private cluster endpoint</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => alert("Hackathon Demo: Agency tier placeholder. Try out the tool free for judging!")}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-center block transition text-sm cursor-pointer"
            >
              Contact Sales (Demo)
            </button>
          </div>
        </div>

      </div>

      {/* Trust & FAQ */}
      <div className="pt-8 border-t border-white/10 max-w-3xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">What happens after my 3 free matches?</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              You can upgrade to Pro for unlimited cloud matches, OR switch to <strong>Local mode</strong> by running Ollama on your computer. Local mode is 100% free forever with no limits!
            </p>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Is my resume data private?</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              In <strong>Local mode</strong> (<code className="text-blue-300">http://localhost:11434</code>), your data never leaves your laptop. In <strong>Cloud mode</strong>, inference is sent via encrypted HTTPS to Ollama's cloud inference API without any storage or retention for training.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Why Gemma 4 31B?</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              Google DeepMind’s Gemma 4 31B is an open-weight frontier model offering state-of-the-art instruction adherence and structured JSON reasoning without the expensive per-token markups of proprietary closed APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
