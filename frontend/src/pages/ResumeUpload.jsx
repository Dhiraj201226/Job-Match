import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function ResumeUpload() {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('role', role);
    formData.append('resume', file);

    try {
      // Pointing to local backend
      const res = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/report', { state: { data: res.data } });
    } catch (err) {
      console.error(err);
      alert('Error analyzing resume. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-surface p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Upload Your Resume
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Target Role</label>
            <input 
              type="text" 
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Scientist, Frontend Developer" 
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Resume (PDF)</label>
            <div className="relative border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
              <input 
                type="file" 
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="text-sm text-textMuted">
                {file ? file.name : "Click or drag to upload"}
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" /> Analyzing (AI is thinking...)</> : 'Generate Career Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}
