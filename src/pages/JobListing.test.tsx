import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import JobListing from './JobListing';
import { apiClient, ApiError } from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    getJobs: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(msg: string) { super(msg); this.name = 'ApiError'; }
  }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('JobListing Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('redirects to root if no candidateId in session', () => {
    render(<BrowserRouter><JobListing /></BrowserRouter>);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders loading initially and fetches active jobs', async () => {
    sessionStorage.setItem('candidateId', '123');
    sessionStorage.setItem('email', 'test@test.com');
    
    (apiClient.getJobs as any).mockResolvedValue([
      { id: 1, title: 'Job 1', isActive: true },
      { id: 2, title: 'Job 2', isActive: false }
    ]);

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    // While loading, jobs aren't rendered
    expect(screen.getByText(/Hello, test@test.com!/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      // Job 2 is inactive, shouldn't be here
      expect(screen.queryByText('Job 2')).not.toBeInTheDocument();
    });
  });

  it('displays error if jobs fetch fails with ApiError', async () => {
    sessionStorage.setItem('candidateId', '123');
    (apiClient.getJobs as any).mockRejectedValue(new ApiError('API Rate Limit', 429));

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('API Rate Limit')).toBeInTheDocument();
    });
  });

  it('displays generic error if jobs fetch fails with unknown error', async () => {
    sessionStorage.setItem('candidateId', '123');
    (apiClient.getJobs as any).mockRejectedValue('Strange error payload');

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred while fetching jobs')).toBeInTheDocument();
    });
  });

  it('displays empty state if jobs arrive empty', async () => {
    sessionStorage.setItem('candidateId', '123');
    (apiClient.getJobs as any).mockResolvedValue([]);

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('No active positions available at the moment.')).toBeInTheDocument();
    });
  });

  it('handles sign out button click', async () => {
    sessionStorage.setItem('candidateId', '123');
    (apiClient.getJobs as any).mockResolvedValue([]);

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    const signOutBtn = screen.getByText('Sign Out');
    signOutBtn.click();

    expect(sessionStorage.getItem('candidateId')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
