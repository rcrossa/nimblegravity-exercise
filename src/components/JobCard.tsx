import { useState } from 'react';
import type { Job } from '../types';
import { apiClient, ApiError } from '../api/client';

interface JobCardProps {
  job: Job;
  candidateId: number;
}

export default function JobCard({ job, candidateId }: JobCardProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setFeedback(null);

    try {
      const resp = await apiClient.applyToJob({
        candidateId,
        jobId: job.id,
        repoUrl
      });
      
      if (resp.ok) {
        setFeedback({ type: 'success', message: 'Application submitted successfully!' });
        setRepoUrl(''); // Clear form on success
      } else {
        setFeedback({ type: 'error', message: resp.message || 'Submission failed' });
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFeedback({ type: 'error', message: err.message });
      } else if (err instanceof Error) {
        setFeedback({ type: 'error', message: err.message });
      } else {
        setFeedback({ type: 'error', message: 'Connection error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
          {job.department}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">{job.description}</p>
      
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Requirements</h4>
        <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
          {job.requirements.slice(0, 3).map((req, i) => (
            <li key={i} className="truncate">{req}</li>
          ))}
          {job.requirements.length > 3 && <li className="text-slate-400">+{job.requirements.length - 3} more</li>}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        {feedback && (
          <div className={`p-3 rounded-lg text-sm mb-4 border flex items-start ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            <span className="font-semibold mr-2">{feedback.type === 'success' ? '✓' : '✖'}</span>
            <p className="flex-1">{feedback.message}</p>
          </div>
        )}

        {(!feedback || feedback.type === 'error') && (
          <form onSubmit={handleApply} className="flex flex-col gap-3">
            <div>
              <label htmlFor={`repo-${job.id}`} className="sr-only">GitHub Repository URL</label>
              <input 
                id={`repo-${job.id}`}
                type="url" 
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 bg-white disabled:opacity-50"
                required
                pattern="https?://github\.com/.*"
                title="Must be a valid GitHub URL"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center text-sm"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Submitting...' : 'Apply to this Job'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
