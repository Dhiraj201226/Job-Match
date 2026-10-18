import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ResumeUpload from './pages/ResumeUpload';
import CareerReport from './pages/CareerReport';
import SavedJobs from './pages/SavedJobs';
import Pricing from './pages/Pricing';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f8fafc]">
        <Navbar />
        <main className="flex-grow flex flex-col pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<ResumeUpload />} />
            <Route path="/report" element={<CareerReport />} />
            <Route path="/saved" element={<SavedJobs />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
