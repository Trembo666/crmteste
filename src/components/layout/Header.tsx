"use client";

import React from "react";
import { User, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-border sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {children}
        
        <div className="h-8 w-px bg-border mx-2" />
        
        <button className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-full">
          <Bell size={20} />
        </button>

        <button className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <User size={18} />
          </div>
          <div className="flex flex-col items-start mr-1">
            <span className="text-xs font-semibold text-slate-800">Jackson</span>
            <span className="text-[10px] text-muted-foreground">Admin</span>
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
