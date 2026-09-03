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
    <div className="bg-acid text-ink border-b-1.5 border-ink px-4 py-2 text-xs font-mono font-bold flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-2.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-hazard-red text-white border border-ink text-[10px]">
          <AlertTriangle size={12} />
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-ink text-acid px-1.5 py-0.5 border border-ink text-[10px] uppercase font-bold">
            DEMO DISPATCH
          </span>
          <span>FinSeva Indic Safety Audit (Pre-recorded evaluations across EN, HI & Hinglish).</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {seededNotice && (
          <span className="text-safety-teal flex items-center gap-1 font-bold text-[11px]">
            <CheckCircle2 size={13} /> Demo data reloaded!
          </span>
        )}

        <button
          onClick={handleReseed}
          disabled={seeding}
          className="h-7 text-[11px] px-2.5 border-1.5 border-ink bg-white hover:bg-chalk text-ink font-bold shadow-brutal active:translate-x-0.5 active:translate-y-0.5 flex items-center"
        >
          <RefreshCw size={11} className={`mr-1.5 ${seeding ? "animate-spin" : ""}`} />
          {seeding ? "RELOADING..." : "RELOAD DEMO DATA"}
        </button>

        <Link
          href="/targets/new"
          className="inline-flex items-center gap-1 font-bold hover:underline text-ink px-1"
        >
          <span>CONNECT REAL MODEL</span>
          <ArrowRight size={12} />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="text-ink hover:opacity-75 text-xs px-1 font-bold"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
