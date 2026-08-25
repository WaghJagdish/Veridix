"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Activity, AlertTriangle, FileText, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Targets', href: '/targets', icon: Server },
    { name: 'Scans', href: '/scans', icon: Activity },
    { name: 'Findings', href: '/findings', icon: AlertTriangle }, // For overall findings, but usually scoped to scans
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar-bg text-sidebar-text border-r border-slate-800">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="text-brand-indigo" size={24} />
          <span className="text-white font-bold text-xl tracking-tight">VERIDIX</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-brand-indigo/10 text-brand-indigo" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-brand-indigo" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>System Online • MVP v0.1</span>
        </div>
      </div>
    </div>
  );
}
