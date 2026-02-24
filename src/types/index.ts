export interface CandidateResponse {
  uuid: string;
  candidateId: number;
  applicationId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Job {
  id: number;
  title: string;
  department?: string;
  description?: string;
  requirements?: string[];
  isActive?: boolean;
}

// ...

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
