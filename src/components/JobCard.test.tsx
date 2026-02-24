import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import JobCard from './JobCard';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: {
    applyToJob: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(msg: string) { super(msg); this.name = 'ApiError'; }
  }
}));

describe('JobCard Component', () => {
  const mockJob = {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    description: 'Great job!',
    requirements: ['React', 'TypeScript']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job details correctly', () => {
    render(<JobCard job={mockJob} candidateId={123} />);
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('submits application successfully', async () => {
    (apiClient.applyToJob as any).mockResolvedValue({ ok: true });

    render(<JobCard job={mockJob} candidateId={123} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/github.com\//i);
    const submitBtn = screen.getByRole('button', { name: /Apply to this Job/i });

    fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
    fireEvent.click(submitBtn);

    expect(apiClient.applyToJob).toHaveBeenCalledWith({
      candidateId: 123,
      jobId: 1,
      repoUrl: 'https://github.com/user/repo'
    });

    await waitFor(() => {
      expect(screen.getByText(/Application submitted successfully!/i)).toBeInTheDocument();
    });
  });

  it('shows error on failed application', async () => {
    (apiClient.applyToJob as any).mockResolvedValue({ ok: false, message: 'repo missing' });

    render(<JobCard job={mockJob} candidateId={123} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/github.com\//i);
    const submitBtn = screen.getByRole('button', { name: /Apply to this Job/i });

    fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/repo missing/i)).toBeInTheDocument();
      // Ensure loading state is reset
      const submitBtnAfter = screen.getByRole('button', { name: /Apply to this Job/i });
      expect(submitBtnAfter).not.toBeDisabled();
    });
  });

  it('shows generic Connection error on non-ApiError failures', async () => {
    (apiClient.applyToJob as any).mockRejectedValue(new Error('Network Down'));

    render(<JobCard job={mockJob} candidateId={123} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/github.com\//i);
    const submitBtn = screen.getByRole('button', { name: /Apply to this Job/i });

    fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Network Down/i)).toBeInTheDocument();
    });
  });

  it('shows fallback Connection error on unknown throw', async () => {
    (apiClient.applyToJob as any).mockRejectedValue('String Error');

    render(<JobCard job={mockJob} candidateId={123} />);
    
    const input = screen.getByPlaceholderText(/https:\/\/github.com\//i);
    const submitBtn = screen.getByRole('button', { name: /Apply to this Job/i });

    fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Connection error/i)).toBeInTheDocument();
    });
  });
});
