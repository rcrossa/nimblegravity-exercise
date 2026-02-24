import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EmailLogin from './EmailLogin';
import { apiClient } from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    getCandidateByEmail: vi.fn(),
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

describe('EmailLogin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<BrowserRouter><EmailLogin /></BrowserRouter>);
    expect(screen.getByText('Candidate Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('handles successful API login and redirects', async () => {
    const mockReponse = { uuid: '123-abc', candidateId: 999, email: 'test@test.com', firstName: 'Test', lastName: 'User', applicationId: '456' };
    (apiClient.getCandidateByEmail as any).mockResolvedValue(mockReponse);

    render(<BrowserRouter><EmailLogin /></BrowserRouter>);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Continue to Jobs/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(submitBtn);

    expect(apiClient.getCandidateByEmail).toHaveBeenCalledWith('test@test.com');

    await waitFor(() => {
      expect(sessionStorage.getItem('candidateId')).toBe('999');
      expect(sessionStorage.getItem('uuid')).toBe('123-abc');
      expect(mockNavigate).toHaveBeenCalledWith('/jobs');
    });
  });

  it('displays error on failed fetch', async () => {
    (apiClient.getCandidateByEmail as any).mockRejectedValue(new Error('Candidate not found'));

    render(<BrowserRouter><EmailLogin /></BrowserRouter>);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Continue to Jobs/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/Candidate not found/i)).toBeInTheDocument();
    });
  });
});
