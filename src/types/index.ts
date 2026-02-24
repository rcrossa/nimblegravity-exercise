export interface CandidateResponse {
  ok: boolean;
  user: {
    uuid: string;
    candidateId: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  isActive: boolean;
}

export interface JobsResponse {
  ok: boolean;
  jobs: Job[];
}

export interface ApplyResponse {
  ok: boolean;
  message?: string;
  details?: string;
}

export interface JobApplicationPayload {
  candidateId: number;
  jobId: number;
  repoUrl: string;
}
