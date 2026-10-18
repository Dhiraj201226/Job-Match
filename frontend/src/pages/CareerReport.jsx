import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Wrench, 
  Copy, 
  Check, 
  Bookmark, 
  Layers, 
  ArrowLeft 
} from 'lucide-react';
import { saveJobMatch } from '../utils/storage';

export default function CareerReport() {
  const location = useLocation();
  const data = location.state?.data;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!data) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center p-8 bg-surface rounded-2xl border border-white/10 max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-white">No Report Data Found</h2>
          <p className="text-sm text-textMuted">
            Run a match between your profile and a job post to view the full analysis.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-sm hover:opacity-90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Matcher</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { 
    match_score = 0, 
    score_reason, 
    matched_skills = [], 
    missing_skills = [], 
    fixes = [], 
    cover_letter,
    resume_analysis, 
    skill_gap, 
    roadmap, 
    interview_questions 
  } = data;

  // Normalized skill lists (supports both Gemma 4 schema and legacy 4-agent schema)
  const currentSkills = matched_skills.length > 0 
    ? matched_skills 
    : (resume_analysis?.skills || []);

  const gaps = missing_skills.length > 0 
    ? missing_skills 
    : (skill_gap?.missing_skills || []);

  const handleCopy = () => {
    if (cover_letter) {
      navigator.clipboard.writeText(cover_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    saveJobMatch({
      title: data.role || data.jobTitle || 'Career Match Report',
      match_score,
      score_reason: score_reason || 'Evaluated candidate strengths against role requirements.',
      matched_skills: currentSkills,
      missing_skills: gaps,
      fixes: fixes.length > 0 ? fixes : ['Review missing requirements', 'Update portfolio samples', 'Target specific keywords'],
      cover_letter: cover_letter || ''
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-grow p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-10 animate-fadeIn">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <Link
          to="/"
          className="text-xs text-textMuted hover:text-white flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matcher</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              saved ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved to Compare!' : 'Save & Compare'}</span>
          </button>

          <Link
            to="/saved"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center space-x-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ranked List</span>
          </Link>
        </div>
      </div>

      {/* Match Score Hero */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemma 4 Match Evaluation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          Match & Opportunity Breakdown
        </h1>

        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-blue-500/40 bg-surface shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <div className="text-center">
            <span className="text-4xl font-extrabold text-white">{match_score}%</span>
            <span className="block text-[10px] uppercase font-bold text-blue-400 tracking-wider">
              Score
            </span>
          </div>
        </div>

        {score_reason && (
          <p className="max-w-2xl mx-auto text-sm text-textMuted bg-surface p-4 rounded-xl border border-white/10 leading-relaxed">
            💡 <strong className="text-white">Reasoning:</strong> {score_reason}
          </p>
        )}
      </section>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-surface p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold flex items-center text-white">
            <CheckCircle className="text-emerald-400 mr-2 w-5 h-5" /> Matched Skills ({currentSkills.length})
          </h3>
          <ul className="space-y-2">
            {currentSkills.map((skill, i) => (
              <li key={i} className="flex items-center text-sm text-textMuted">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 shrink-0"></span>
                <span>{skill}</span>
              </li>
            ))}
            {currentSkills.length === 0 && (
              <li className="text-xs text-textMuted">No explicit matches listed.</li>
            )}
          </ul>
        </section>

        <section className="bg-surface p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold flex items-center text-white">
            <XCircle className="text-rose-400 mr-2 w-5 h-5" /> Missing Skills ({gaps.length})
          </h3>
          <ul className="space-y-2">
            {gaps.map((skill, i) => (
              <li key={i} className="flex items-center text-sm text-textMuted">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 shrink-0"></span>
                <span>{skill}</span>
              </li>
            ))}
            {gaps.length === 0 && (
              <li className="text-xs text-emerald-400">All required skills met!</li>
            )}
          </ul>
        </section>
      </div>

      {/* 3 Concrete Things to Fix */}
      {fixes.length > 0 && (
        <section className="bg-surface p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold flex items-center text-white">
            <Wrench className="text-blue-400 mr-2 w-5 h-5" /> 3 Concrete Things To Fix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fixes.map((fix, i) => (
              <div key={i} className="p-4 bg-background rounded-xl border border-white/5 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-xs text-textMuted leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tailored Cover Letter / Proposal */}
      {cover_letter && (
        <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Tailored Proposal / Cover Letter</span>
              </h3>
              <p className="text-xs text-textMuted mt-0.5">
                Generated in the candidate's tone for this target role.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Proposal</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#090d16] rounded-xl border border-white/5 text-xs text-textMuted whitespace-pre-wrap font-sans leading-relaxed">
            {cover_letter}
          </pre>
        </section>
      )}

      {/* Legacy 3-Month Roadmap (if present) */}
      {roadmap && roadmap.length > 0 && (
        <section className="bg-surface p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-6 flex items-center text-white">
            <Calendar className="text-blue-400 mr-2 w-5 h-5" /> 3-Month Learning Roadmap
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((month, i) => (
              <div key={i} className="bg-background p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-lg mb-1 text-purple-400">{month.month}</h4>
                <p className="text-xs font-medium text-white mb-3">{month.focus}</p>
                
                {month.projects?.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-[10px] uppercase text-textMuted block mb-1">Projects</strong>
                    <ul className="list-disc pl-4 text-xs text-textMuted">
                      {month.projects.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                )}

                {month.resources?.length > 0 && (
                  <div>
                    <strong className="text-[10px] uppercase text-textMuted block mb-1 flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" /> Resources
                    </strong>
                    <ul className="list-disc pl-4 text-xs text-textMuted">
                      {month.resources.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legacy Interview Prep (if present) */}
      {interview_questions && (
        <section className="bg-surface p-6 rounded-2xl border border-white/10 space-y-6">
          <h3 className="text-xl font-bold flex items-center text-white">
            <MessageSquare className="text-blue-400 mr-2 w-5 h-5" /> Interview Preparation
          </h3>
          <div className="space-y-4">
            {interview_questions.technical_questions?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 text-white">Technical Questions</h4>
                <ul className="list-decimal pl-6 text-xs text-textMuted space-y-1">
                  {interview_questions.technical_questions.slice(0, 5).map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
            {interview_questions.hr_questions?.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 text-white">HR & Culture Questions</h4>
                <ul className="list-decimal pl-6 text-xs text-textMuted space-y-1">
                  {interview_questions.hr_questions.slice(0, 3).map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
