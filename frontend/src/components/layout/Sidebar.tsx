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
          badge: 'NEW'
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
    <aside className="flex h-screen w-64 flex-col bg-chalk border-r-1.5 border-ink select-none font-mono text-ink transition-all duration-200">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b-1.5 border-ink bg-white font-mono">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-auto flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/vectorized.svg" alt="VERIDIX Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tighter text-ink font-sans">VERIDIX</span>
              <span className="bg-acid text-ink font-mono font-bold text-[9px] px-1 py-0.2 border border-ink uppercase">
                VOL. II
              </span>
            </div>
            <p className="text-[9px] font-mono text-ink/70 leading-none">INDIC SAFETY ENGINE</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 bg-grid-blueprint">
        {/* Quick Action Button */}
        <div className="px-0.5">
          <Link
            href="/scans/new"
            className="w-full flex items-center justify-center gap-2 bg-safety-teal hover:bg-teal-800 text-white text-xs font-mono font-bold py-2.5 px-3 border-1.5 border-ink shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>LAUNCH INDIC SCAN</span>
          </Link>
        </div>

        {/* Grouped Nav Items */}
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
              {section.title}
            </h3>
            <nav className="space-y-1 pt-1">
              {section.items.map((item) => {
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard' 
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between px-3 py-2 text-xs font-mono font-bold border-1.5 transition-all",
                      isActive 
                        ? "bg-acid text-ink border-ink shadow-brutal" 
                        : (item as any).highlight
                          ? "bg-white text-ink border-ink/40 hover:border-ink hover:bg-chalk shadow-xs"
                          : "bg-white text-ink/80 border-transparent hover:border-ink hover:bg-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon 
                        size={15} 
                        className={cn(
                          "transition-colors",
                          isActive 
                            ? "text-ink" 
                            : (item as any).highlight
                              ? "text-safety-teal"
                              : "text-ink/60 group-hover:text-ink"
                        )} 
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.2 border font-mono font-bold uppercase",
                          item.badge === 'NEW'
                            ? "bg-hazard-red text-white border-ink"
                            : isActive 
                              ? "bg-ink text-acid border-ink" 
                              : "bg-chalk border-ink text-ink/80"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-ink" />
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
      <div className="p-3 border-t-1.5 border-ink bg-white space-y-2">
        {/* Copilot shortcut */}
        <Link href="/copilot"
          className="flex items-center gap-2.5 px-2.5 py-2 border-1.5 border-ink bg-chalk hover:bg-acid/30 transition-colors group">
          <div className="h-6 w-6 bg-ink text-acid border border-ink flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <div className="flex-1 min-w-0 font-mono">
            <div className="text-[11px] font-bold text-ink uppercase">AI Security Copilot</div>
            <div className="text-[9px] text-ink/60">Ask scan telemetry</div>
          </div>
          <ChevronRight size={14} className="text-ink/60 group-hover:text-ink transition-colors" />
        </Link>

        {/* Judge status */}
        <div className="flex items-center justify-between bg-chalk p-2 border-1.5 border-ink text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-safety-teal"></span>
            </div>
            <div className="text-[10px] leading-tight">
              <p className="font-bold text-ink uppercase">Judge LLM: Active</p>
              <p className="text-[9px] text-ink/60">Groq (GPT-OSS-120B)</p>
            </div>
          </div>
          <Link href="/settings" className="text-ink/60 hover:text-ink transition-colors p-1">
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
