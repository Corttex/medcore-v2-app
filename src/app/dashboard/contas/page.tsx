"use client";
import React from "react";
import AccountsManager from "@/features/dashboard/components/AccountsManager";

export default function AccountsPage() {
  return (
    <AccountsManager 
      title={<>Gestor de <span className="text-gradient">Contas</span></>} 
    />
  );
}
