import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { DemoBanner } from "@/components/layout/DemoBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-chalk font-mono text-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoBanner />
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-chalk bg-grid-blueprint p-6 font-mono text-ink">
          {children}
        </main>
      </div>
    </div>
  );
}
