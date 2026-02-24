import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import JobListing from './JobListing';
import { apiClient } from '../api/client';

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

  it('displays error if jobs fetch fails', async () => {
    sessionStorage.setItem('candidateId', '123');
    (apiClient.getJobs as any).mockRejectedValue(new Error('Network error'));

    render(<BrowserRouter><JobListing /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Jobs')).toBeInTheDocument();
    });
  });
});
