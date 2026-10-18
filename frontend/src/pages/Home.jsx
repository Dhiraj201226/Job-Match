import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Copy, 
  Check, 
  Bookmark, 
  RotateCcw, 
  Layers, 
  Upload, 
  ShieldCheck, 
  Cloud, 
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { SAMPLE_JOBS } from '../data/sampleData';
import { saveJobMatch, getUsageCount, incrementUsageCount, MAX_FREE_MATCHES } from '../utils/storage';
import { extractResumeFile } from '../utils/pdfParser';

export default function Home() {
  const [jobTitle, setJobTitle] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional, confident, and direct');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null);
  const [usageCount, setUsageCount] = useState(0);

  // PDF upload & Drag-and-drop state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  // Load provider status and usage on mount
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setProviderStatus(data))
      .catch(() => {});

    setUsageCount(getUsageCount());

    // Restore any previously entered resume from localStorage if available
    const cachedResume = localStorage.getItem('jobmatch_cached_resume');
    if (cachedResume && !resumeText) {
      setResumeText(cachedResume);
    }
  }, []);

  // Save resume draft to localStorage
  const handleResumeChange = (e) => {
    const val = e.target.value;
    setResumeText(val);
    localStorage.setItem('jobmatch_cached_resume', val);
  };

  // Load sample job helper
  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_JOBS.find(s => s.id === sampleId) || SAMPLE_JOBS[0];
    setJobTitle(sample.title);
    setResumeText(sample.resume);
    setJobDescription(sample.job);
    setTone(sample.tone);
    setUploadedFile(null);
    setError(null);
    setResult(null);
  };

  // Process uploaded resume file (.pdf, .txt, .md)
  const processUploadedFile = async (file) => {
    if (!file) return;
    setIsExtractingPdf(true);
    setError(null);

    try {
      const result = await extractResumeFile(file);
      setResumeText(result.text);
      localStorage.setItem('jobmatch_cached_resume', result.text);
      setUploadedFile({
        name: file.name,
        pages: result.pages || 1,
        wordCount: result.text.split(/\s+/).filter(Boolean).length
      });
    } catch (err) {
      console.error('File extraction error:', err);
      setError(err.message || 'Could not parse resume. Please ensure file is not password protected, or paste text directly.');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  // Handle file input event
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
    e.target.value = '';
  };

  // Execute Analysis
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste or upload your resume/profile before analyzing.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job post or gig listing to compare against.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSavedSuccess(false);

    // Simulate animated step indicators while Gemma 4 processes
    setLoadingStep(1);
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 1200);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 2400);

    try {
      const res = await axios.post('/api/analyze', {
        resumeText,
        jobDescription,
        tone
      });

      setResult(res.data);
      const nextUsage = incrementUsageCount();
      setUsageCount(nextUsage);

      // Auto scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (err) {
      console.error('Analysis error:', err);
      const msg = err.response?.data?.error || err.message || 'Analysis failed. Please check backend connection.';
      setError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  // Save current result to comparison list
  const handleSaveToCompare = () => {
    if (!result) return;
    const title = jobTitle.trim() || 'Custom Gig Match';
    saveJobMatch({
      title,
      match_score: result.match_score,
      score_reason: result.score_reason,
      matched_skills: result.matched_skills,
      missing_skills: result.missing_skills,
      fixes: result.fixes,
      cover_letter: result.cover_letter
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Copy proposal
  const handleCopyProposal = () => {
    if (!result?.cover_letter) return;
    navigator.clipboard.writeText(result.cover_letter);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  const isLocal = providerStatus?.mode === 'local' || providerStatus?.badgeType === 'local';

  return (
    <div className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-5 pt-4">
        {/* Model badge pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 shadow-sm">
          <span className={`w-2 h-2 rounded-full pulse-dot ${isLocal ? 'bg-emerald-400' : 'bg-purple-400'}`} />
          {isLocal ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Cloud className="w-3.5 h-3.5 text-purple-400" />}
          <span className="text-white font-medium">
            {providerStatus?.badgeText || 'Running: Gemma 4 31B (cloud)'}
          </span>
          <span className="text-textMuted">• DEV Hacktoberfest "Side Hustle"</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Match Any Job. Bridge Gaps.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Win The Proposal.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-textMuted leading-relaxed">
          Powered by Google’s open-weight <strong className="text-white">Gemma 4 31B</strong>. Paste your resume and any gig listing to calculate your match score, uncover missing skills, get 3 concrete fixes, and write an tailored proposal.
        </p>

        {/* 10-Second Judge Quick Try Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 shadow-xl space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>10-Second Judge Quick Try (1-Click Demo)</span>
          </div>
          <p className="text-xs text-textMuted">
            Click below to instantly populate real candidate profiles and gig listings:
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleLoadSample('freelance-mvp')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Full-Stack React & Node MVP ($4,500 Gig)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('ai-engineer')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-300" />
              <span>Senior AI Application Engineer ($150k Role)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Matching Workstation */}
      <section className="bg-surface rounded-2xl border border-white/10 p-5 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Match & Proposal Generator</h2>
              <span className="text-xs text-textMuted">Compare candidate profile against job requirements</span>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center space-x-3">
            <label className="text-xs text-textMuted font-medium">Proposal Tone:</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="bg-background border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Professional, confident, and direct">Professional & Confident</option>
              <option value="Persuasive Freelancer">Persuasive Freelancer (Pitch-ready)</option>
              <option value="Direct, technical, and concise">Technical & Concise</option>
              <option value="Warm, consultative, and empathetic">Consultative & Warm</option>
            </select>
          </div>
        </div>

        {/* 2-Column Grid for Resume & Job */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Candidate Resume / Profile */}
          <div 
            className={`space-y-3 p-1 rounded-2xl transition-all ${
              isDragging ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={async (e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                await processUploadedFile(file);
              }
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-bold text-white flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>1. Candidate Profile or Resume</span>
              </label>

              <div className="flex items-center space-x-2 text-xs">
                <label className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold cursor-pointer flex items-center space-x-1.5 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {resumeText && (
                  <button
                    type="button"
                    onClick={() => {
                      setResumeText('');
                      setUploadedFile(null);
                      localStorage.removeItem('jobmatch_cached_resume');
                    }}
                    className="text-textMuted hover:text-rose-400 px-1 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* PDF extraction in-progress state */}
            {isExtractingPdf && (
              <div className="p-3 bg-blue-950/50 border border-blue-500/30 rounded-xl flex items-center space-x-2.5 text-xs text-blue-200 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                <span>Extracting resume text from PDF locally (100% private)...</span>
              </div>
            )}

            {/* Extracted File Badge */}
            {uploadedFile && !isExtractingPdf && (
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-semibold truncate text-white">{uploadedFile.name}</span>
                  <span className="text-textMuted shrink-0">
                    ({uploadedFile.pages} {uploadedFile.pages === 1 ? 'page' : 'pages'} • {uploadedFile.wordCount} words)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setResumeText('');
                    localStorage.removeItem('jobmatch_cached_resume');
                  }}
                  className="text-textMuted hover:text-rose-400 text-xs ml-2 font-bold"
                  title="Remove uploaded resume"
                >
                  ✕
                </button>
              </div>
            )}

            <textarea
              rows={12}
              value={resumeText}
              onChange={handleResumeChange}
              placeholder="Paste your resume or drag & drop a PDF file here...
Example:
- 4 years experience with React, TypeScript, and Node.js
- Built and scaled REST APIs using PostgreSQL and Docker
- Passionate about open-weight AI models and low-latency systems..."
              className="w-full bg-[#090d16] border border-white/15 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-textMuted/50 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono resize-y"
            />
            <div className="flex justify-between items-center text-[11px] text-textMuted">
              <span>Drag & drop .pdf or .txt anywhere onto this box</span>
              <span>{resumeText ? `${resumeText.split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
            </div>
          </div>

          {/* Column 2: Job Post or Gig Listing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>2. Target Job Post or Gig Listing</span>
              </label>

              <div className="flex items-center space-x-2 text-xs">
                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => {
                      setJobDescription('');
                      setJobTitle('');
                    }}
                    className="text-textMuted hover:text-rose-400"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job or Gig Title (e.g. Full-Stack Developer Upwork Gig)"
                className="w-full bg-[#090d16] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description, client requirements, or RFP here...
Example:
Looking for a Full-Stack developer to build a responsive React app.
Requirements:
- 3+ years in React & TypeScript
- Backend Node.js or Python API experience
- Knowledge of Redis and Docker containerization..."
                className="w-full bg-[#090d16] border border-white/15 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-textMuted/50 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed font-mono resize-y"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-textMuted">
              <span>Supports raw job listings, client emails, or Upwork/Fiverr scopes</span>
              <span>{jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
            </div>
          </div>

        </div>

        {/* Action Button & Usage Banner */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-textMuted">
            Free usage: <strong className="text-white">{usageCount} of {MAX_FREE_MATCHES}</strong> cloud evaluations used.
            {usageCount >= MAX_FREE_MATCHES && (
              <span className="text-amber-400 ml-1">
                (Free tier limit reached for cloud; local mode remains unlimited!)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={loading}
              onClick={handleAnalyze}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  <span>Analyzing with Gemma 4...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Match & Write Proposal</span>
                </>
              )}
            </button>
          </div>
        </div>

      </section>

      {/* Loading State Feedback */}
      {loading && (
        <div className="p-8 bg-surface rounded-2xl border border-blue-500/30 text-center space-y-4 animate-fadeIn shadow-2xl">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {providerStatus?.mode === 'local' ? `${providerStatus?.model || 'Gemma 4 (Local)'} is Reasoning...` : 'Google Gemma 4 31B is Reasoning...'}
            </h3>
            <p className="text-xs text-textMuted mt-1">Executing structured extraction and proposal synthesis</p>
            {providerStatus?.mode === 'local' && (
              <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-center justify-center gap-1 font-medium">
                <span>⚡ Running on your local machine ({providerStatus?.model || 'local'}) — processing on CPU</span>
              </p>
            )}
          </div>

          <div className="max-w-md mx-auto space-y-2 pt-2 text-xs">
            <div className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
              loadingStep >= 1 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-white/5 border-white/5 text-textMuted'
            }`}>
              <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Deconstructing candidate skills and gig deliverables...</span>
            </div>

            <div className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
              loadingStep >= 2 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-white/5 border-white/5 text-textMuted'
            }`}>
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Evaluating match score & identifying missing skills gap...</span>
            </div>

            <div className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
              loadingStep >= 3 ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-white/5 border-white/5 text-textMuted'
            }`}>
              <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Formulating 3 concrete fixes & drafting personalized proposal...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2 text-rose-300 font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Analysis Request Encountered An Issue</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200 leading-relaxed">
            {error}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition"
            >
              Retry Analysis
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('freelance-mvp')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition"
            >
              Reset to Sample Data
            </button>
          </div>
        </div>
      )}

      {/* Match Results Section */}
      {result && !loading && (
        <section id="analysis-results" className="space-y-8 animate-fadeIn pt-4">
          
          {/* Header Card with Match Score */}
          <div className="p-6 sm:p-8 bg-surface rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Score Display */}
              <div className="flex items-center space-x-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-[#090d16] border-4 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.25)] shrink-0">
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      {result.match_score}%
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                      Match Fit
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${
                      result.match_score >= 80
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : result.match_score >= 60
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}>
                      {result.match_score >= 80 ? 'High Win Probability' : result.match_score >= 60 ? 'Competitive Match' : 'Stretch Opportunity'}
                    </span>
                    {result.meta?.retried && (
                      <span className="text-[10px] text-textMuted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Self-corrected
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {jobTitle.trim() || 'Evaluated Job Opportunity'}
                  </h3>
                  <p className="text-xs sm:text-sm text-textMuted leading-relaxed max-w-2xl">
                    <strong className="text-white">Gemma 4 Assessment:</strong> {result.score_reason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveToCompare}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved to Comparison!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save & Compare List</span>
                    </>
                  )}
                </button>

                <Link
                  to="/saved"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center space-x-1.5 transition text-center"
                >
                  <Layers className="w-4 h-4" />
                  <span>View Ranked Table</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matched Skills */}
            <div className="p-6 bg-surface rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">
                  Matched Skills ({result.matched_skills?.length || 0})
                </h4>
              </div>
              <p className="text-xs text-textMuted">
                Skills found in your profile that directly satisfy key job deliverables.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {result.matched_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </span>
                ))}
                {(!result.matched_skills || result.matched_skills.length === 0) && (
                  <span className="text-xs text-textMuted">No direct skill matches identified.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 bg-surface rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h4 className="text-base font-bold text-white">
                  Missing Skills & Requirements ({result.missing_skills?.length || 0})
                </h4>
              </div>
              <p className="text-xs text-textMuted">
                Explicit requirements from the job posting not evident in your resume.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {result.missing_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <span>✗</span>
                    <span>{skill}</span>
                  </span>
                ))}
                {(!result.missing_skills || result.missing_skills.length === 0) && (
                  <span className="text-xs text-emerald-400">Awesome! No missing required skills detected.</span>
                )}
              </div>
            </div>

          </div>

          {/* 3 Concrete Things to Fix */}
          <div className="p-6 bg-surface rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              <h4 className="text-base font-bold text-white">
                3 Concrete Things To Fix (Immediate Action Items)
              </h4>
            </div>
            <p className="text-xs text-textMuted">
              Tactical adjustments to your resume, portfolio, or proposal to bridge gaps and win this contract.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {result.fixes?.map((fix, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-background rounded-xl border border-white/5 space-y-2 hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-textMuted leading-relaxed">
                    {fix}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tailored Cover Letter / Proposal */}
          <div className="p-6 sm:p-8 bg-surface rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Tailored Cover Letter / Upwork Proposal</span>
                </h4>
                <p className="text-xs text-textMuted mt-0.5">
                  Crafted in your tone by Gemma 4 31B, proactively positioning your strengths.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyProposal}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  copiedProposal
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-md shadow-blue-500/20'
                }`}
              >
                {copiedProposal ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied To Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Proposal Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 bg-[#090d16] rounded-xl border border-white/10">
              <pre className="text-xs sm:text-sm text-textMuted whitespace-pre-wrap font-sans leading-relaxed">
                {result.cover_letter}
              </pre>
            </div>
          </div>

        </section>
      )}

    </div>
  );
}
