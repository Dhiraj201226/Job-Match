import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Trophy, ArrowRight, Trash2, Copy, Check, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { getSavedJobs, deleteSavedJob, clearAllSavedJobs, saveJobMatch } from '../utils/storage';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const loadJobs = () => {
    const list = getSavedJobs();
    setSavedJobs(list);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = (id) => {
    const updated = deleteSavedJob(id);
    setSavedJobs(updated);
  };

  const handleCopyProposal = (job) => {
    if (job.cover_letter) {
      navigator.clipboard.writeText(job.cover_letter);
      setCopiedId(job.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handlePopulateDemo = () => {
    // Demo 1
    saveJobMatch({
      id: 'demo_1',
      title: 'Full-Stack React & Node MVP ($4,500 Upwork)',
      company: 'NextWave Studio',
      match_score: 88,
      score_reason: 'Exceptional fit with React 19, TypeScript, and Node.js. Missing Redis caching experience is easily bridged.',
      matched_skills: ['React 19', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST APIs', 'Git'],
      missing_skills: ['Redis Caching', 'Docker'],
      fixes: [
        'Add a bullet in your project experience highlighting client-side caching strategies.',
        'Link a sample repo demonstrating containerized deployment.',
        'State your availability for immediate sprint kickoff in the first sentence.'
      ],
      cover_letter: `Hi NextWave Team,

I saw your posting for the full-stack AI MVP and was immediately drawn to the stack. Having built scalable React 19 dashboards and TypeScript microservices for high-velocity startups, this project is right in my sweet spot.

Key highlights I bring to this 3-week sprint:
- React 19 & Modern Tailwind: Clean, accessible, mobile-first design with sub-second responsiveness.
- Resilient Node.js Backend: Clean REST endpoints with JWT session auth and structured error handling.
- Pragmatic Caching: While my background is predominantly PostgreSQL query optimization, I am well-versed in in-memory caching patterns and can rapidly implement Redis for your LLM call optimization.

I have open bandwidth to start immediately and maintain daily proactive Slack updates. Looking forward to discussing your MVP roadmap!

Best regards,
Sarah Jenkins`
    });

    // Demo 2
    saveJobMatch({
      id: 'demo_2',
      title: 'Senior AI Application Engineer ($150k Remote)',
      company: 'SynthLabs AI (YC W24)',
      match_score: 94,
      score_reason: 'Outstanding alignment with open-weight model orchestration (Gemma 4), prompt engineering, and FastAPI microservices.',
      matched_skills: ['Google Gemma 4', 'FastAPI', 'Python', 'Prompt Engineering', 'Structured JSON', 'Docker'],
      missing_skills: ['Kubernetes'],
      fixes: [
        'Highlight experience deploying local Gemma 4 models on edge devices or workstations.',
        'Detail your automated retry and JSON schema evaluation harness.',
        'Mention familiarity with cloud container registries (ECR/GCR).'
      ],
      cover_letter: `Dear SynthLabs Hiring Team,

Your mission to give enterprises complete data ownership through open-weight models like Google Gemma 4 resonates deeply with my work. I have specialized in building robust inference pipelines and structured agentic architectures that avoid vendor lock-in.

At my previous role, I architected open-model inference routing using Gemma and FastAPI, reducing inference costs by 65% while enforcing strict JSON validation.

I would love to bring my hands-on Gemma 4 experience and passion for open-source AI to SynthLabs.

Warm regards,
Alex Rivera`
    });

    // Demo 3
    saveJobMatch({
      id: 'demo_3',
      title: 'Senior Mobile Flutter / iOS Contractor ($60/hr)',
      company: 'AppPulse Inc',
      match_score: 42,
      score_reason: 'Low alignment: Candidate profile is web-focused (React/Node) while this contract requires native Dart and Flutter architecture.',
      matched_skills: ['RESTful APIs', 'Git', 'Agile Delivery'],
      missing_skills: ['Flutter', 'Dart', 'iOS App Store Deployment', 'Bloc State Management'],
      fixes: [
        'If applying, emphasize cross-platform UI conceptual knowledge from React.',
        'Highlight fast ramp-up speed on mobile frameworks.',
        'Consider focusing applications on React Native gigs instead.'
      ],
      cover_letter: `Dear AppPulse Hiring Manager,

I am writing to inquire if you would consider a versatile full-stack engineer for your mobile application initiative. While my primary production experience is in React and TypeScript, the component architectures and reactive state management patterns closely mirror Flutter/Dart.

I look forward to learning if there are cross-functional opportunities available.

Sincerely,
Sarah Jenkins`
    });

    loadJobs();
  };

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        label: 'High Match'
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        label: 'Moderate Match'
      };
    }
    return {
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      label: 'Low Match'
    };
  };

  return (
    <div className="flex-grow p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs uppercase tracking-wider font-bold mb-1">
            <Trophy className="w-4 h-4" />
            <span>Opportunity Ranking System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Saved Jobs & Gig Comparisons
          </h1>
          <p className="text-sm text-textMuted mt-1">
            Ranked by Gemma 4 match score. Focus your proposal energy where your win rate is highest.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedJobs.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all saved comparisons?')) {
                  clearAllSavedJobs();
                  setSavedJobs([]);
                }
              }}
              className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePopulateDemo}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-md shadow-blue-500/20 flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 3 Demo Comparisons</span>
            </button>
          )}

          <Link
            to="/"
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition flex items-center space-x-1.5 shadow-md shadow-purple-500/20"
          >
            <span>+ New Match</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Bar */}
      {savedJobs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-white/10">
            <span className="text-xs text-textMuted uppercase block">Total Saved</span>
            <span className="text-2xl font-bold text-white">{savedJobs.length}</span>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-white/10">
            <span className="text-xs text-textMuted uppercase block">Top Match</span>
            <span className="text-2xl font-bold text-emerald-400">
              {Math.max(...savedJobs.map(j => j.match_score || 0))}%
            </span>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-white/10">
            <span className="text-xs text-textMuted uppercase block">Average Score</span>
            <span className="text-2xl font-bold text-blue-400">
              {Math.round(savedJobs.reduce((acc, j) => acc + (j.match_score || 0), 0) / savedJobs.length)}%
            </span>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-white/10">
            <span className="text-xs text-textMuted uppercase block">Top Rated Category</span>
            <span className="text-sm font-semibold text-purple-300 truncate block mt-1">
              {savedJobs[0]?.title?.slice(0, 24) || 'N/A'}...
            </span>
          </div>
        </div>
      )}

      {/* Ranked Job List */}
      {savedJobs.length === 0 ? (
        <div className="p-12 text-center bg-surface/50 rounded-2xl border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Comparisons Saved Yet</h3>
          <p className="text-sm text-textMuted max-w-md mx-auto">
            Analyze multiple jobs or freelance gig postings to rank them by match score, compare skill requirements, and copy tailored proposals.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <button
              type="button"
              onClick={handlePopulateDemo}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Ranked Jobs</span>
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition"
            >
              Paste Your Resume
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job, idx) => {
            const badge = getScoreBadge(job.match_score || 0);
            return (
              <div
                key={job.id || idx}
                className="p-5 bg-surface rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-lg space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Rank & Title */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-white shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {job.title || 'Untitled Job / Gig'}
                      </h3>
                      {job.company && (
                        <span className="text-xs text-textMuted">{job.company}</span>
                      )}
                    </div>
                  </div>

                  {/* Score Gauge */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-white">
                        {job.match_score}%
                      </div>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {job.cover_letter && (
                        <button
                          type="button"
                          onClick={() => handleCopyProposal(job)}
                          className="p-2 text-textMuted hover:text-white hover:bg-white/10 rounded-lg transition"
                          title="Copy tailored proposal"
                        >
                          {copiedId === job.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="p-2 text-textMuted hover:text-white hover:bg-white/10 rounded-lg transition"
                        title="View complete analysis modal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-textMuted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score Reason */}
                {job.score_reason && (
                  <p className="text-xs text-textMuted bg-background/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                    💡 <strong className="text-white">Gemma 4 Assessment:</strong> {job.score_reason}
                  </p>
                )}

                {/* Skills tags preview */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-textMuted font-medium mr-1">Matched:</span>
                  {job.matched_skills?.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-md">
                      ✓ {s}
                    </span>
                  ))}
                  {job.missing_skills?.length > 0 && (
                    <>
                      <span className="text-textMuted font-medium ml-2 mr-1">Gaps:</span>
                      {job.missing_skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-md">
                          ✗ {s}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for full saved breakdown */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111827] border border-white/15 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-blue-400 uppercase font-bold tracking-wider">Opportunity Detail</span>
                <h3 className="text-xl font-bold text-white">{selectedJob.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-textMuted hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-white/10">
                <div>
                  <span className="text-xs text-textMuted uppercase block">Match Score</span>
                  <span className="text-3xl font-extrabold text-white">{selectedJob.match_score}%</span>
                </div>
                <div className="text-right max-w-md">
                  <p className="text-xs text-textMuted leading-relaxed">{selectedJob.score_reason}</p>
                </div>
              </div>

              <div>
                <strong className="text-white block mb-2">3 Concrete Fixes to Win This Gig:</strong>
                <ul className="space-y-2">
                  {selectedJob.fixes?.map((fix, idx) => (
                    <li key={idx} className="p-3 bg-background rounded-lg border border-white/5 text-xs text-textMuted flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedJob.cover_letter && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-white">Tailored Proposal / Cover Letter:</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyProposal(selectedJob)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      {copiedId === selectedJob.id ? <span>✓ Copied!</span> : <span>Copy to clipboard</span>}
                    </button>
                  </div>
                  <pre className="p-4 bg-background rounded-xl border border-white/5 text-xs text-textMuted whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedJob.cover_letter}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
