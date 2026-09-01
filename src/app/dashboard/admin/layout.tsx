import React from "react";
import { AdminGate } from "@/features/admin/components/AdminGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      {children}
    </AdminGate>
  );
}
