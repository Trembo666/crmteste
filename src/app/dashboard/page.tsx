"use client";

import React from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { Card, Badge, Button } from "@/components/ui";
import { 
  Users, 
  MessageSquare, 
  PhoneCall, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const stats = [
  { label: "Novas Conversas", value: "1,284", change: "+12.5%", trend: "up", icon: MessageSquare, color: "bg-blue-500" },
  { label: "Total de Interações", value: "48,291", change: "+18.2%", trend: "up", icon: TrendingUp, color: "bg-purple-500" },
  { label: "Conversas em Aberto", value: "45", change: "-5.4%", trend: "down", icon: Clock, color: "bg-green-500" },
  { label: "Tempo Médio de Resposta", value: "2m 45s", change: "-0.5%", trend: "down", icon: AlertCircle, color: "bg-orange-500" },
];

export default function DashboardPage() {
  return (
    <Shell>
      <Header title="Dashboard" subtitle="Visão geral e métricas do cliente">
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded-md shadow-sm ring-1 ring-slate-200 uppercase">Geral</button>
           <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground hover:text-slate-700 uppercase transition-colors">CRM</button>
           <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground hover:text-slate-700 uppercase transition-colors">Contatos</button>
        </div>
      </Header>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="p-6 border-none ring-1 ring-slate-200 group hover:ring-primary/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                      <Icon size={24} />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                      stat.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
             {/* Recent Activity */}
             <Card className="lg:col-span-2 p-0 border-none ring-1 ring-slate-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-slate-900 border-l-4 border-primary pl-3">Atividade de Mensagens</h3>
                   <Badge variant="info">Últimas 24h</Badge>
                </div>
                <div className="p-6 h-[300px] flex items-center justify-center text-muted-foreground bg-slate-50/30">
                   {/* Placeholder for a chart */}
                   <div className="flex flex-col items-center gap-2">
                      <TrendingUp size={48} className="text-slate-200" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gráfico de Volume</span>
                   </div>
                </div>
             </Card>

             {/* System Health */}
             <Card className="p-0 border-none ring-1 ring-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                   <h3 className="font-bold text-slate-900 border-l-4 border-primary pl-3">Status dos Sistemas</h3>
                </div>
                <div className="p-6 space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100 border-solid">
                               <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Supabase DB</span>
                         </div>
                         <Badge variant="success">Online</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100 border-solid">
                               <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Uazapi Service</span>
                         </div>
                         <Badge variant="success">Online</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-100 border-solid">
                               <Clock size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Webhook Listener</span>
                         </div>
                         <Badge variant="warning">Instável</Badge>
                      </div>
                   </div>

                   <Button className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                      Abrir Relatório Completo
                   </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}

import { cn } from "@/lib/utils";
