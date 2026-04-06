"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="flex h-screen bg-background transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-16 min-h-screen relative overflow-hidden bg-slate-50/50">
        <div className="h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
