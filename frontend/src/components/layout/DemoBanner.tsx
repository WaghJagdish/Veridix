"use client"
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function DemoBanner() {
  // Try to determine demo status, hide if not demo
  const { data } = useQuery({
    queryKey: ['demo-status'],
    queryFn: () => api.demo.status().catch(() => ({ seeded: true })), // Default true if API fails for UI preview
  });

  if (data && !data.seeded) return null;

  return (
    <div className="bg-amber-100 text-amber-900 border-b border-amber-200 px-4 py-2 text-sm flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle size={16} className="text-amber-600" />
        <span>⚠ DEMO EVALUATION — Data shown is pre-recorded and does not represent live model output.</span>
      </div>
      <Link href="/targets/new" className="flex items-center gap-1 font-semibold hover:underline text-amber-800">
        Connect Target <ArrowRight size={14} />
      </Link>
    </div>
  );
}
