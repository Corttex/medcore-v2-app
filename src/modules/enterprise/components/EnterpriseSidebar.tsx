"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Building2, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Settings, 
  LogOut,
  ChevronRight,
  Target,
  Globe,
  Database,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Executive Hub", icon: Target, href: "/enterprise" },
  { label: "Unidades", icon: Building2, href: "/enterprise/units" },
  { label: "Performance", icon: BarChart3, href: "/enterprise/performance" },
  { label: "Governança", icon: ShieldCheck, href: "/enterprise/governance" },
  { label: "Financeiro", icon: TrendingUp, href: "/enterprise/finance" },
  { label: "Global Ops", icon: Globe, href: "/enterprise/ops" },
  { label: "Data Intelligence", icon: Database, href: "/enterprise/data" },
];

export function EnterpriseSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 lg:w-64 bg-surface border-r border-outline-variant/10 z-50 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Brand/Logo */}
        <div className="h-16 flex items-center px-4 lg:px-6 border-b border-outline-variant/10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Briefcase size={18} className="text-on-primary" />
          </div>
          <div className="ml-3 hidden lg:block overflow-hidden">
            <p className="font-heading font-black text-on-surface leading-none tracking-tighter italic">HUB <span className="text-primary">MEDCORE</span></p>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Enterprise System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-zinc-500 hover:bg-surface-container-highest hover:text-on-surface"
                )}
              >
                <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary" : "group-hover:text-on-surface")} />
                <span className="hidden lg:block text-xs font-black tracking-tight uppercase italic">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full lg:hidden" />
                )}
                <ChevronRight size={14} className={cn("ml-auto hidden lg:block opacity-0 lg:group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-outline-variant/10 space-y-1">
          <Link 
            href="/enterprise/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-surface-container-highest hover:text-on-surface transition-all group"
          >
            <Settings size={20} />
            <span className="hidden lg:block text-xs font-bold uppercase tracking-widest italic">Configurações</span>
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-error/10 hover:text-error transition-all group"
          >
            <LogOut size={20} />
            <span className="hidden lg:block text-xs font-bold uppercase tracking-widest italic">Sair do Hub</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
