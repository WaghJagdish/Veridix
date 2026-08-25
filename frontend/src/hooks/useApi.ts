import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useTargets() {
  return useQuery({
    queryKey: ['targets'],
    queryFn: () => api.targets.list(),
  });
}

export function useTarget(id: string) {
  return useQuery({
    queryKey: ['targets', id],
    queryFn: () => api.targets.get(id),
    enabled: !!id,
  });
}

export function useScans() {
  return useQuery({
    queryKey: ['scans'],
    queryFn: () => api.scans.list(),
  });
}

export function useScan(id: string) {
  return useQuery({
    queryKey: ['scans', id],
    queryFn: () => api.scans.get(id),
    enabled: !!id,
  });
}

export function useScanSummary(id: string) {
  return useQuery({
    queryKey: ['scans', id, 'summary'],
    queryFn: () => api.scans.getSummary(id),
    enabled: !!id,
  });
}

export function useFindings(scanId: string) {
  return useQuery({
    queryKey: ['findings', scanId],
    queryFn: () => api.findings.listByScan(scanId),
    enabled: !!scanId,
  });
}

export function useFinding(scanId: string, findingId: string) {
  return useQuery({
    queryKey: ['findings', scanId, findingId],
    queryFn: () => api.findings.get(findingId),
    enabled: !!scanId && !!findingId,
  });
}
