"use client"
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { 
  ChevronRight, 
  Search, 
  ExternalLink, 
  HelpCircle, 
  Zap, 
  Terminal,
  Activity,
  Layers
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
    if (parts.length === 0) return [{ label: 'Dashboard', href: '/' }];

    const breadcrumbs = [{ label: 'Dashboard', href: '/' }];
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      
      if (part === 'scans') label = 'Safety Scans';
      else if (part === 'targets') label = 'Targets';
      else if (part === 'findings') label = 'Findings';
      else if (part === 'reports') label = 'Reports';
      else if (part === 'settings') label = 'Settings';
      else if (part === 'new') label = 'New Configuration';
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
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 z-20">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight size={13} className="text-muted-foreground/60" />}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/40">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
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
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 animate-pulse hover:bg-emerald-500/20 transition-all cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold">Evaluation Running ({runningScan.name})</span>
            </Badge>
          </Link>
        )}

        {/* API Docs link */}
        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground border-border/70 hover:bg-accent">
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
            <Terminal size={13} />
            <span>API Docs</span>
            <ExternalLink size={11} className="opacity-60" />
          </a>
        </Button>

        {/* User / Team Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800 shadow-sm">
            VX
          </div>
        </div>
      </div>
    </header>
  );
}
