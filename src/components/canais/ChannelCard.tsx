"use client";

import React from "react";
import { Plus, MessageSquare, MoreVertical, Smartphone, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Add Channel Card
 */
export function AddChannelCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group dashed-card w-full h-[220px] p-6 flex flex-col items-center justify-center gap-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Plus size={24} />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-primary text-lg transition-colors">Adicionar Canal</h3>
        <p className="text-sm text-slate-500 max-w-[180px]">Conecte um novo número de WhatsApp para começar</p>
      </div>
    </button>
  );
}

/**
 * Channel Status Card
 */
interface ChannelCardProps {
  name: string;
  id: string;
  status: "connected" | "disconnected" | "connecting";
  type: string;
  plan: string;
}

export function ChannelCard({ name, id, status, type, plan }: ChannelCardProps) {
  const statusConfig = {
    connected: { 
      label: "Conectado", 
      variant: "success" as const, 
      icon: <CheckCircle2 size={12} className="mr-1" />,
      color: "bg-green-500"
    },
    disconnected: { 
      label: "Desconectado", 
      variant: "neutral" as const, 
      icon: <XCircle size={12} className="mr-1" />,
      color: "bg-slate-300"
    },
    connecting: { 
      label: "Conectando", 
      variant: "warning" as const, 
      icon: <Clock size={12} className="mr-1" />,
      color: "bg-yellow-500"
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className="p-0 border-none ring-1 ring-slate-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
              status === "connected" ? "bg-green-500 shadow-green-500/20" : "bg-slate-400"
            )}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{name || "Sem Nome"}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn("w-2 h-2 rounded-full", currentStatus.color)} />
                <span className="text-xs text-muted-foreground font-medium">{type}</span>
              </div>
            </div>
          </div>
          <button className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ID Curto</span>
            <span className="text-xs font-mono font-medium text-slate-600">#{id}</span>
          </div>
          <Badge variant={currentStatus.variant} className="flex items-center">
            {currentStatus.icon} {currentStatus.label}
          </Badge>
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-bold text-slate-600">{plan}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold">
          Gerenciar
        </Button>
      </div>
    </Card>
  );
}
