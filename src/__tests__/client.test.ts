import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { apiClient, ApiError } from '../api/client';


describe('API Client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('should format URL and headers correctly for GET calls', async () => {
    const mockResponse = { candidateId: 123, email: 'test@test.com' };
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.getCandidateByEmail('test@test.com');
    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/candidate/get-by-email?email=test%40test.com'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should format payload correctly for POST calls', async () => {
    const mockResponse = { ok: true };
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const payload = { candidateId: 1, jobId: 2, repoUrl: 'http://test.com' };
    const result = await apiClient.applyToJob(payload);
    
    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/candidate/apply-to-job'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload)
      })
    );
  });

  it('should fetch jobs correctly', async () => {
    const mockResponse = [{ id: 1, title: 'Job 1' }];
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.getJobs();
    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jobs/get-list'),
      expect.any(Object)
    );
  });

  it('should throw ApiError when response is not ok', async () => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    });

    await expect(apiClient.getJobs()).rejects.toThrow(ApiError);
    await expect(apiClient.getJobs()).rejects.toThrow('Not found');
  });

  it('should throw ApiError when ok is false in payload despite 200 status', async () => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: false, details: 'Payload error' }),
    });

    await expect(apiClient.getJobs()).rejects.toThrow(ApiError);
    await expect(apiClient.getJobs()).rejects.toThrow('Payload error');
  });

  it('should throw generic ApiError when JSON fails to parse on bad response', async () => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(apiClient.getJobs()).rejects.toThrow('An unknown API error occurred');
  });
});
