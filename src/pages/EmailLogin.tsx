import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, ApiError } from '../api/client';

export default function EmailLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const resp = await apiClient.getCandidateByEmail(email);
      // Challenge requirement: Ensure we have the user
      if (resp.ok && resp.user) {
        // Store candidate identifiers in session storage 
        sessionStorage.setItem('candidateId', String(resp.user.candidateId));
        sessionStorage.setItem('uuid', resp.user.uuid);
        sessionStorage.setItem('email', resp.user.email);
        
        navigate('/jobs');
      } else {
        setErrorMsg('Invalid response from server');
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Connection error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-slate-800 text-center">Candidate Login</h2>
        <p className="text-slate-500 mb-6 text-center text-sm">Enter your email to view open positions</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="yours@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white transition-shadow disabled:opacity-50"
              required
            />
          </div>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-2 border border-red-100 flex items-start">
              <span className="font-semibold mr-2">Error:</span>
              <p>{errorMsg}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Authenticating...' : 'Continue to Jobs'}
          </button>
        </form>
      </div>
    </div>
  );
}
