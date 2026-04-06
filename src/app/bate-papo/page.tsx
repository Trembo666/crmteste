"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { ChatSidebar, ChatWindow } from "@/components/chat";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <Shell>
      <div className="flex h-full overflow-hidden bg-white shadow-sm ring-1 ring-slate-100">
        <ChatSidebar onSelect={setSelectedChat} />
        <ChatWindow chatId={selectedChat} />
        
        {/* Right Info Sidebar (Optional, but seen in some CRMs) */}
        <div className="w-[320px] h-full border-l border-border bg-slate-50/20 hidden xl:flex flex-col animate-in slide-in-from-right-4 duration-300">
          <div className="p-6 border-b border-border bg-white">
            <h4 className="font-bold text-slate-900 border-l-4 border-primary pl-3">Informações do Contato</h4>
          </div>
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
             {/* Contact Profile */}
             <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-300 ring-1 ring-slate-100 relative group">
                   <span className="text-4xl font-bold text-slate-200">A</span>
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-primary font-bold text-xs uppercase tracking-widest">Ver Foto</span>
                   </div>
                </div>
                <div className="text-center">
                   <h3 className="font-bold text-slate-900 text-lg">Ana Silva</h3>
                   <p className="text-xs text-muted-foreground font-medium">+55 11 98765-4321</p>
                </div>
             </div>

             {/* Tags */}
             <div className="space-y-3">
                <h5 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Tags do Sistema</h5>
                <div className="flex flex-wrap gap-2">
                   <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full border border-primary/10 border-solid">LEAD QUALIFICADO</span>
                   <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 border-solid">WHATSAPP</span>
                </div>
             </div>

             {/* Details List */}
             <div className="space-y-4">
                <h5 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Detalhes Adicionais</h5>
                <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400">Canal de Origem</span>
                      <span className="text-xs font-semibold text-slate-700">Suporte 01</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400">Primeiro Contato</span>
                      <span className="text-xs font-semibold text-slate-700">06 Abr, 2026</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="p-4 border-t border-border bg-white/50">
             <button className="w-full py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                Bloquear Contato
             </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
