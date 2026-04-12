import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { DashboardProvider } from "@/modules/dashboard/context/DashboardContext";
import { PlanProvider } from "@/modules/shared/context/PlanContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlanProvider>
      <DashboardProvider>
        <div className="flex h-screen bg-[#020617] text-white overflow-hidden selection:bg-primary/30">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72 relative">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
              <div className="max-w-[1600px] mx-auto h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DashboardProvider>
    </PlanProvider>
  );
}
