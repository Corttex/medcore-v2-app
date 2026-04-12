import React from "react";
import { EnterpriseSidebar } from "@/modules/enterprise/components/EnterpriseSidebar";
import { EnterpriseHeader } from "@/modules/enterprise/components/EnterpriseHeader";

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <EnterpriseSidebar />
      <div className="pl-16 lg:pl-64 transition-all duration-300">
        <EnterpriseHeader />
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
