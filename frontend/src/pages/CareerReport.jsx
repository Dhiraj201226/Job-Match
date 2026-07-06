import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, BookOpen, MessageSquare } from 'lucide-react';

export default function CareerReport() {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No report data found.</h2>
          <Link to="/upload" className="text-primary hover:underline">Go back to upload</Link>
        </div>
      </div>
    );
  }

  const { match_score, resume_analysis, skill_gap, roadmap, interview_questions } = data;

  return (
    <div className="flex-grow p-8 max-w-6xl mx-auto w-full space-y-12">
      
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Your Career Match Report
        </h1>
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/50 bg-surface shadow-[0_0_30px_rgba(29,78,216,0.3)]">
          <span className="text-4xl font-extrabold text-white">{match_score}%</span>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-surface p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold mb-4 flex items-center"><CheckCircle className="text-green-400 mr-2" /> Current Skills</h3>
          <ul className="space-y-2">
            {resume_analysis?.skills?.map((skill, i) => (
              <li key={i} className="flex items-center text-textMuted">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface p-6 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold mb-4 flex items-center"><XCircle className="text-red-400 mr-2" /> Missing Skills</h3>
          <ul className="space-y-2">
            {skill_gap?.missing_skills?.map((skill, i) => (
              <li key={i} className="flex items-center text-textMuted">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-surface p-6 rounded-2xl border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center"><Calendar className="text-primary mr-2" /> 3-Month Roadmap</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {roadmap?.map((month, i) => (
            <div key={i} className="bg-background p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-xl mb-2 text-secondary">{month.month}</h4>
              <p className="text-sm font-medium text-white mb-4">{month.focus}</p>
              
              <div className="mb-4">
                <strong className="text-xs uppercase text-textMuted block mb-1">Projects</strong>
                <ul className="list-disc pl-4 text-sm text-textMuted">
                  {month.projects?.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>

              <div>
                <strong className="text-xs uppercase text-textMuted block mb-1 flex items-center"><BookOpen className="h-3 w-3 mr-1"/> Resources</strong>
                <ul className="list-disc pl-4 text-sm text-textMuted">
                  {month.resources?.map((r, j) => <li key={j}>{r}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface p-6 rounded-2xl border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center"><MessageSquare className="text-primary mr-2" /> Interview Prep</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-2 text-white">Technical Questions</h4>
            <ul className="list-decimal pl-6 text-textMuted space-y-1">
              {interview_questions?.technical_questions?.slice(0, 5).map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2 text-white">HR Questions</h4>
            <ul className="list-decimal pl-6 text-textMuted space-y-1">
              {interview_questions?.hr_questions?.slice(0, 3).map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
