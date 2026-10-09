"use client";
import React from "react";
import AccountsManager from "@/features/dashboard/components/AccountsManager";

export default function PayablesPage() {
  return (
    <AccountsManager 
      title={<>Contas a <span className="text-gradient">Pagar</span></>} 
      fixedType="PAYABLE"
    />
  );
}
