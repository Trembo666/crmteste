"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Rss, 
  Users, 
  Bot, 
  Send, 
  PhoneCall, 
  Database, 
  UserCircle, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Bate-papo", href: "/bate-papo" },
  { icon: Rss, label: "Canais", href: "/canais" },
  { icon: Bot, label: "IA", href: "/ia" },
  { icon: Send, label: "Campanhas", href: "/campanhas" },
  { icon: Users, label: "Contatos", href: "/contatos" },
  { icon: Database, label: "Integrações", href: "/integracoes" },
];

const bottomItems = [
  { icon: UserCircle, label: "Perfil", href: "/perfil" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-active/30 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-active/30">
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <span className="text-sidebar font-bold text-lg">D</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 py-4 flex flex-col items-center gap-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all relative group",
                isActive 
                  ? "bg-white/15 text-white" 
                  : "hover:bg-white/5 hover:text-white"
              )}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-[-12px] w-1 h-6 bg-primary rounded-r-full" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip (Simple) */}
              <div className="absolute left-14 bg-sidebar-active text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-medium border border-white/10">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="py-4 flex flex-col items-center gap-2 border-t border-sidebar-active/30">
        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all relative group",
                isActive 
                  ? "bg-white/15 text-white" 
                  : "hover:bg-white/5 hover:text-white"
              )}
              title={item.label}
            >
              <Icon size={20} />
              <div className="absolute left-14 bg-sidebar-active text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-medium border border-white/10">
                {item.label}
              </div>
            </Link>
          );
        })}
        
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-lg transition-all hover:bg-red-500/20 hover:text-red-400 group relative"
          title="Sair"
        >
          <LogOut size={20} />
          <div className="absolute left-14 bg-sidebar-active text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-medium border border-white/10">
            Sair
          </div>
        </button>
      </div>
    </aside>
  );
}
