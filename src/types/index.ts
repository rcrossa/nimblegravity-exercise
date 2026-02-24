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

// Jobs response es simplemente un Array de Job, por lo que podemos usar Job[]


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
