import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Loader2, FileText, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { extractResumeFile } from '../utils/pdfParser';

export default function ResumeUpload() {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [useTextMode, setUseTextMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setExtracting(true);
    setError(null);

    try {
      const result = await extractResumeFile(selected);
      setResumeText(result.text);
      setExtractedInfo({
        name: selected.name,
        pages: result.pages || 1,
        words: result.text.split(/\s+/).filter(Boolean).length
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to extract text from PDF.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please provide a target role or gig title.');
      return;
    }

    if (!resumeText.trim()) {
      setError('Please upload a resume file (PDF/TXT) or paste your resume text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/analyze', {
        resumeText,
        jobDescription: `Target Role: ${role}\nEvaluate candidate fit for this role and determine key strengths and gaps.`,
        tone: 'Professional, confident, and direct'
      });
      navigate('/report', { state: { data: { ...res.data, role } } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Error analyzing resume with Gemma 4.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-xl w-full bg-surface p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link to="/" className="text-xs text-textMuted hover:text-white flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemma 4 Matcher</span>
          </span>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Upload Your Resume PDF
          </h2>
          <p className="text-xs text-textMuted">
            Extracts text locally in your browser (100% private) and analyzes fit with Gemma 4.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-1.5">
              Target Role or Gig Name
            </label>
            <input 
              type="text" 
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, AI Systems Architect" 
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">
              Resume Input Format
            </label>
            <button
              type="button"
              onClick={() => setUseTextMode(!useTextMode)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              {useTextMode ? 'Switch to PDF Upload' : 'Switch to Paste Text'}
            </button>
          </div>

          {useTextMode ? (
            <div>
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume or profile text here..."
                className="w-full bg-background border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.txt,.md"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">
                  {file ? file.name : "Click or drag to upload resume (.pdf, .txt)"}
                </p>
                <p className="text-xs text-textMuted mt-1">
                  100% on-device PDF extraction • Never leaves your laptop
                </p>
              </div>

              {extracting && (
                <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center space-x-2 text-xs text-blue-200 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Extracting text from PDF locally...</span>
                </div>
              )}

              {extractedInfo && !extracting && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate">{extractedInfo.name}</span>
                    <span className="text-textMuted shrink-0">
                      ({extractedInfo.pages} {extractedInfo.pages === 1 ? 'page' : 'pages'} • {extractedInfo.words} words)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || extracting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center text-sm shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                <span>Evaluating with Gemma 4...</span>
              </>
            ) : (
              'Generate Career & Match Plan'
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-xs text-textMuted hover:text-blue-400">
            Or try the full 2-column Job & Gig Matcher on the homepage →
          </Link>
        </div>

      </div>
    </div>
  );
}
