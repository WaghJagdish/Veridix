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

    const breadcrumbs = [{ label: 'VERIDIX', href: '/dashboard' }];
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
    <header className="flex h-14 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 z-20 sticky top-0">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={12} className="text-muted-foreground/50" />}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/40 text-xs">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Active Scan Pulse */}
        {runningScan && (
          <Link href={`/scans/${runningScan.id}`}>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 animate-pulse hover:bg-emerald-500/20 transition-all cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold">Scan Running</span>
            </Badge>
          </Link>
        )}

        {/* AI Copilot quick access */}
        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300">
          <Link href="/copilot">
            <Sparkles size={12} />
            <span>Copilot</span>
          </Link>
        </Button>

        {/* API Docs link */}
        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground border-border/70 hover:bg-accent">
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
            <Terminal size={12} />
            <span>API</span>
            <ExternalLink size={10} className="opacity-60" />
          </a>
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-7 w-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[10px] font-bold text-emerald-800 shadow-sm cursor-pointer hover:bg-emerald-200 transition-colors">
            VX
          </div>
        </div>
      </div>
    </header>
  );
}
