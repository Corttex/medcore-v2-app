"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  ClipboardCheck, 
  ChevronLeft, 
  ChevronRight,
  Stethoscope,
  Shield
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Equipes", href: "/dashboard/teams" },
  { icon: ClipboardCheck, label: "Processos", href: "/dashboard/processes" },
  { icon: CreditCard, label: "Faturamento", href: "/dashboard/billing" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  { icon: Shield, label: "Admin", href: "/dashboard/admin" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "flex flex-col bg-zinc-950 border-r border-zinc-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-6 h-20 border-b border-zinc-800">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
          <div className="p-2.5 bg-teal-500 text-black rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Stethoscope size={24} />
          </div>
          {!collapsed && (
            <span className="text-xl font-black font-heading tracking-tighter">
              MEDCORE <span className="text-zinc-600 font-bold">V2</span>
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors group"
          >
            <item.icon size={20} className="shrink-0 transition-colors group-hover:text-teal-400" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-4 flex items-center justify-center p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
}
