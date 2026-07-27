import type { JobDetail, JobSummary } from '../types/job';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body: unknown = await response.json();
      if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        body.message !== undefined
      ) {
        const raw = (body as { message: unknown }).message;
        message = Array.isArray(raw) ? raw.join(', ') : String(raw);
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function createJob(urls: string[]): Promise<{ jobId: string }> {
  return request<{ jobId: string }>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify({ urls }),
  });
}

export function fetchJobs(): Promise<JobSummary[]> {
  return request<JobSummary[]>('/api/jobs');
}

export function fetchJob(id: string): Promise<JobDetail> {
  return request<JobDetail>(`/api/jobs/${id}`);
}

export function cancelJob(id: string): Promise<JobDetail> {
  return request<JobDetail>(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
}

export function clearJobs(): Promise<void> {
  return request<void>('/api/jobs', {
    method: 'DELETE',
  });
}
