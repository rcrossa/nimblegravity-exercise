import type { CandidateResponse, Job, ApplyResponse, JobApplicationPayload } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic fetch wrapper to handle errors consistently
 */
async function fetchClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || (data && data.ok === false)) {
    throw new ApiError(data?.message || data?.details || 'An unknown API error occurred', response.status);
  }

  return data as T;
}

export const apiClient = {
  getCandidateByEmail: (email: string) => 
    fetchClient<CandidateResponse>(`/api/candidate/get-by-email?email=${encodeURIComponent(email)}`),
    
  getJobs: () => 
    fetchClient<Job[]>(`/api/jobs/get-list`),
    
  applyToJob: (payload: JobApplicationPayload) => 
    fetchClient<ApplyResponse>(`/api/candidate/apply-to-job`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
