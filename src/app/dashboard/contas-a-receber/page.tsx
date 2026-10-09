"use client";
import React from "react";
import AccountsManager from "@/features/dashboard/components/AccountsManager";

export default function ReceivablesPage() {
  return (
    <AccountsManager 
      title={<>Contas a <span className="text-gradient">Receber</span></>} 
      fixedType="RECEIVABLE"
    />
  );
}
