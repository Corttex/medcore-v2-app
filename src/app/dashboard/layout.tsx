import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { DashboardProvider } from "@/modules/dashboard/context/DashboardContext";
import { PlanProvider } from "@/modules/shared/context/PlanContext";
import { ModuleProvider } from "@/modules/shared/context/ModuleContext";
import { UnitGate } from "@/modules/dashboard/components/UnitGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModuleProvider>
      <PlanProvider>
        <DashboardProvider>
          <div className="flex h-screen bg-background text-on-surface overflow-hidden selection:bg-primary/20">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64 relative">
              <DashboardHeader />
              <main className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 scrollbar-hide">
                <div className="max-w-[1600px] mx-auto h-full">
                  <UnitGate>
                    {children}
                  </UnitGate>
                </div>
              </main>
            </div>
          </div>
        </DashboardProvider>
      </PlanProvider>
    </ModuleProvider>
  );
}
