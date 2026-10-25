import React from "react";
import { AdminGate } from "@/features/admin/components/AdminGate";
import { AdminProvider } from "@/context/AdminContext";
import { AdminTopHeader } from "@/features/admin/components/AdminTopHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminGate>
        <div className="max-w-[1600px] mx-auto">
          <AdminTopHeader />
          {children}
        </div>
      </AdminGate>
    </AdminProvider>
  );
}
