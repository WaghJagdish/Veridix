"use client"
import { useState } from "react";
import { AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function DemoBanner() {
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [seededNotice, setSeededNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ['demo-status'],
    queryFn: () => api.demo.status().catch(() => ({ seeded: true })),
  });

  if (dismissed || (data && !data.seeded)) return null;

  const handleReseed = async () => {
    setSeeding(true);
    setSeededNotice(false);
    try {
      await api.demo.seed();
      await queryClient.invalidateQueries();
      setSeededNotice(true);
      setTimeout(() => setSeededNotice(false), 4000);
    } catch (e) {
      console.error("Failed to seed demo data", e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-amber-50/90 text-amber-950 border-b border-amber-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-2.5 font-medium">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/60 text-amber-800">
          <AlertTriangle size={13} />
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold tracking-wide uppercase text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
            DEMO MODE
          </span>
          <span>Showing <strong>FinSeva Indic Safety Audit</strong> (Pre-recorded evaluations across English, Hindi & Hinglish).</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {seededNotice && (
          <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
            <CheckCircle2 size={13} /> Demo data reloaded!
          </span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleReseed}
          disabled={seeding}
          className="h-7 text-[11px] px-2.5 border-amber-300 bg-amber-100/60 hover:bg-amber-200/70 text-amber-950 shadow-xs"
        >
          <RefreshCw size={11} className={`mr-1.5 ${seeding ? "animate-spin" : ""}`} />
          {seeding ? "Reloading..." : "Reload Demo Data"}
        </Button>

        <Link
          href="/targets/new"
          className="inline-flex items-center gap-1 font-semibold hover:underline text-amber-900 hover:text-amber-950 px-2 py-1"
        >
          <span>Connect Real Model</span>
          <ArrowRight size={12} />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:opacity-75 text-xs px-1"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
