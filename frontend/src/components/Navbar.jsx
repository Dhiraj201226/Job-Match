import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition">
            <Briefcase className="h-8 w-8 text-secondary" />
            <span className="font-bold text-xl tracking-tight text-white">CareerPilot AI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/upload" className="text-sm font-medium text-textMain hover:text-secondary transition">
              Upload Resume
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
