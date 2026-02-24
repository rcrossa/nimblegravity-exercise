import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../types';
import { apiClient, ApiError } from '../api/client';
import JobCard from '../components/JobCard';

export default function JobListing() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const candidateId = sessionStorage.getItem('candidateId');
  const userEmail = sessionStorage.getItem('email');

  useEffect(() => {
    if (!candidateId) {
      navigate('/');
      return;
    }

    const fetchJobs = async () => {
      try {
        const resp = await apiClient.getJobs();
        if (Array.isArray(resp)) {
          setJobs(resp.filter(j => j.isActive !== false));
        } else {
          setErrorMsg('Failed to load job listings from server');
        }
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('An error occurred while fetching jobs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [candidateId, navigate]);

  if (!candidateId) return null;

  let content = null;

  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  } else if (errorMsg) {
    content = (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-2">Error Loading Jobs</h3>
        <p>{errorMsg}</p>
        <button 
          onClick={() => globalThis.location.reload()}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  } else if (jobs.length === 0) {
    content = (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-slate-500 text-lg">No active positions available at the moment.</p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            candidateId={Number.parseInt(candidateId, 10)} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Open Positions</h2>
          <p className="text-slate-500 mt-1">Hello, {userEmail}! Select a role to apply.</p>
        </div>
        <button 
          onClick={() => {
            sessionStorage.clear();
            navigate('/');
          }}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1 bg-slate-100 rounded-md hover:bg-slate-200"
        >
          Sign Out
        </button>
      </div>

      {content}
    </div>
  );
}
