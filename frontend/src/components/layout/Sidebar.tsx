"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Settings, 
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Rocket,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScans, useTargets } from '@/hooks/useApi';

export function Sidebar() {
  const pathname = usePathname();
  const { data: scans } = useScans();
  const { data: targets } = useTargets();

  const sections = [
    {
      title: "Core Platform",
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { 
          name: 'Safety Scans', 
          href: '/scans', 
          icon: Activity, 
          badge: scans ? scans.length.toString() : undefined 
        },
        { name: 'Findings Explorer', href: '/findings', icon: AlertTriangle },
      ]
    },
    {
      title: "AI Features",
      items: [
        { 
          name: 'AI Copilot', 
          href: '/copilot', 
          icon: Sparkles, 
          highlight: true,
          badge: 'New'
        },
      ]
    },
    {
      title: "Assets & Outputs",
      items: [
        { 
          name: 'Target Models', 
          href: '/targets', 
          icon: Server, 
          badge: targets ? targets.length.toString() : undefined 
        },
        { name: 'Audit Reports', href: '/reports', icon: FileText },
      ]
    },
    {
      title: "Management",
      items: [
        { name: 'Get Started', href: '/get-started', icon: Rocket },
        { name: 'Platform Settings', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar-bg text-sidebar-text border-r border-border select-none transition-all duration-200">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border bg-sidebar-bg/90 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="text-white h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-bold text-lg tracking-tight">VERIDIX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                v0.1
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">Indic AI Safety Platform</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* Quick Action Button */}
        <div className="px-1">
          <Link
            href="/scans/new"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg shadow-sm shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Launch Indic Scan</span>
          </Link>
        </div>

        {/* Grouped Nav Items */}
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <nav className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard' 
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                      isActive 
                        ? "bg-emerald-100/80 text-emerald-900 font-semibold border border-emerald-200/80 shadow-xs" 
                        : (item as any).highlight
                          ? "text-purple-700 hover:bg-purple-50 hover:text-purple-800 border border-transparent hover:border-purple-200/60"
                          : "text-foreground/75 hover:bg-emerald-50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon 
                        size={17} 
                        className={cn(
                          "transition-colors",
                          isActive 
                            ? "text-emerald-700" 
                            : (item as any).highlight
                              ? "text-purple-600"
                              : "text-muted-foreground group-hover:text-foreground"
                        )} 
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                          item.badge === 'New'
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : isActive 
                              ? "bg-emerald-200/80 text-emerald-900" 
                              : "bg-emerald-100/60 text-muted-foreground group-hover:bg-emerald-100"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs shadow-emerald-500" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      {/* Footer / System Status */}
      <div className="p-3 border-t border-border bg-sidebar-bg space-y-2">
        {/* Copilot shortcut */}
        <Link href="/copilot"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-purple-200/60 bg-purple-50/50 hover:bg-purple-50 transition-colors group">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
            <Sparkles size={11} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-purple-800">AI Security Copilot</div>
            <div className="text-[9px] text-purple-600">Ask about your scan results</div>
          </div>
          <ChevronRight size={12} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
        </Link>

        {/* Judge status */}
        <div className="flex items-center justify-between rounded-lg bg-card p-2.5 border border-border shadow-xs">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </div>
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-foreground">Judge LLM Active</p>
              <p className="text-[10px] text-muted-foreground">gpt-4o-mini (OpenAI)</p>
            </div>
          </div>
          <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
