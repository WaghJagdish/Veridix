"use client"
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  ExternalLink, 
  Terminal,
  Sparkles,
  Bell,
  Search
} from 'lucide-react';
import { useScans } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const pathname = usePathname();
  const { data: scans } = useScans();

  // Find if any scan is running or pending
  const runningScan = scans?.find(s => s.status === 'running' || s.status === 'pending');

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Dashboard', href: '/dashboard' }];

    const breadcrumbs = [{ label: 'VERIDIX', href: '/' }];
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      
      if (part === 'dashboard') label = 'Dashboard';
      else if (part === 'scans') label = 'Safety Scans';
      else if (part === 'targets') label = 'Targets';
      else if (part === 'findings') label = 'Findings';
      else if (part === 'reports') label = 'Reports';
      else if (part === 'settings') label = 'Settings';
      else if (part === 'copilot') label = 'AI Copilot';
      else if (part === 'get-started') label = 'Get Started';
      else if (part === 'new') label = 'New';
      else if (part === 'report') label = 'Audit Report';
      else if (part.length > 20) label = `${part.slice(0, 8)}...`;

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 items-center justify-between border-b-1.5 border-ink bg-chalk/90 backdrop-blur-md px-6 z-20 sticky top-0 font-mono text-ink">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight size={13} className="text-ink/40" />}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-bold text-ink bg-white px-2 py-0.5 border border-ink text-xs shadow-xs">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="text-ink/70 hover:text-ink transition-colors font-bold text-xs"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Active Scan Pulse */}
        {runningScan && (
          <Link href={`/scans/${runningScan.id}`}>
            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 border-1.5 border-ink bg-acid text-ink font-mono font-bold text-xs shadow-brutal active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-hazard-red animate-ping"></span>
              <span className="uppercase text-[11px]">Scan Running...</span>
            </span>
          </Link>
        )}

        {/* AI Copilot quick access */}
        <Link
          href="/copilot"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-chalk text-ink border-1.5 border-ink font-mono font-bold text-xs uppercase shadow-brutal transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Sparkles size={13} className="text-safety-teal" />
          <span>Copilot</span>
        </Link>

        {/* API Docs link */}
        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-chalk hover:bg-white text-ink border-1.5 border-ink font-mono font-bold text-xs uppercase shadow-brutal transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Terminal size={13} />
          <span>API</span>
          <ExternalLink size={10} className="opacity-70" />
        </a>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l-1.5 border-ink/20">
          <div className="h-7 w-7 bg-ink border border-ink flex items-center justify-center p-0.5 shadow-brutal overflow-hidden">
            <img src="/vectorized.svg" alt="VERIDIX" className="w-full h-full object-contain filter invert" />
          </div>
        </div>
      </div>
    </header>
  );
}
