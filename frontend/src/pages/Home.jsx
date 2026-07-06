import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-surface">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pb-2">
          Bridge Your Skill Gap. Land Your Dream Job.
        </h1>
        <p className="text-xl text-textMuted max-w-2xl mx-auto">
          CareerPilot AI analyzes your resume against your target role, identifies missing skills, and creates a personalized 3-month roadmap to get you interview-ready.
        </p>
        
        <div className="pt-8">
          <Link to="/upload" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30">
            Get Started Now <Rocket className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Target className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Identify Gaps</h3>
            <p className="text-textMuted">We compare your current skills with industry requirements.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Zap className="h-12 w-12 text-secondary mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">AI Roadmap</h3>
            <p className="text-textMuted">Get a customized step-by-step plan to learn missing skills.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Rocket className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Interview Prep</h3>
            <p className="text-textMuted">Practice with AI-generated questions tailored to your profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
