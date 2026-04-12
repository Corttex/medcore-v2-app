import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Fixed Header */}
        <DashboardHeader />
        
        {/* Scrollable Page Content */}
        <main className="ml-72 pt-20 flex-1 h-screen overflow-y-auto custom-scrollbar">
          <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
