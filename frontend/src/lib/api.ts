import { Target, Scan, ScanSummary, Finding, TestCaseDetail } from './types';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  targets: {
    list: () => fetchApi<Target[]>('/targets'),
    get: (id: string) => fetchApi<Target>(`/targets/${id}`),
    create: (data: Record<string, unknown>) => fetchApi<Target>('/targets', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/targets/${id}`, { method: 'DELETE' }),
    verify: (id: string) => fetchApi<{ success: boolean; message: string; latency_ms?: number }>(`/targets/${id}/verify`, { method: 'POST' }),
  },
  scans: {
    list: () => fetchApi<Scan[]>('/scans'),
    get: (id: string) => fetchApi<Scan>(`/scans/${id}`),
    getSummary: (id: string) => fetchApi<ScanSummary>(`/scans/${id}/summary`),
    create: (data: Record<string, unknown>) => fetchApi<Scan>('/scans', { method: 'POST', body: JSON.stringify(data) }),
    getTestCases: (id: string) => fetchApi<TestCaseDetail[]>(`/scans/${id}/test-cases`),
  },
  findings: {
    listByScan: (scanId: string, params?: { severity?: string; language?: string; category?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return fetchApi<Finding[]>(`/scans/${scanId}/findings${q ? '?' + q : ''}`);
    },
    get: (findingId: string) => fetchApi<Finding>(`/findings/${findingId}`),
  },
  reports: {
    generate: (scanId: string) => fetchApi<{ id: string; pdf_path: string }>(`/reports/scans/${scanId}`, { method: 'POST' }),
    download: (reportId: string) => `${BASE_URL}/reports/${reportId}/download`,
  },
  demo: {
    seed: () => fetchApi<{ success: boolean; message?: string; scan_id?: string; project_id?: string; target_id?: string }>('/demo/seed', { method: 'POST' }),
    status: () => fetchApi<{ seeded: boolean; scan_id?: string; project_id?: string; target_id?: string }>('/demo/status'),
  },
};
