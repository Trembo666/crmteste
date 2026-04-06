"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui";
import { Plus, RefreshCw } from "lucide-react";
import { ChannelCard, AddChannelCard } from "@/components/canais/ChannelCard";
import { supabase } from "@/lib/supabase";
import { uazapi } from "@/lib/uazapi";

export default function CanaisPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChannels();

    // Real-time listener
    const channel = supabase
      .channel("public:channels")
      .on("postgres_changes", { event: "*", schema: "public", table: "channels" }, () => {
        fetchChannels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChannel = async () => {
    const name = prompt("Nome do canal:");
    if (!name) return;

    try {
      // 1. Create in UazAPI (Requires Admin Token - handle securely)
      // For this demo, we'll assume the admin token is available or handled by an edge function
      // const result = await uazapi.createInstance(name, "YOUR_ADMIN_TOKEN");
      
      // 2. For now, we'll insert into Supabase directly to demonstrate the UI
      const { error } = await supabase.from("channels").insert([
        { 
          name, 
          status: "connecting", 
          uazapi_subdomain: "app"
        }
      ]);

      if (error) throw error;
      fetchChannels();
    } catch (error) {
      alert("Erro ao adicionar canal");
    }
  };

  return (
    <Shell>
      <Header title="Canais" subtitle="Gerencie os canais de comunicação do cliente">
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="hidden md:flex items-center gap-2"
            onClick={fetchChannels}
            loading={isLoading}
          >
            <RefreshCw size={16} /> Atualizar
          </Button>
          <Button size="sm" className="flex items-center gap-2" onClick={handleAddChannel}>
            <Plus size={18} /> Adicionar Canal
          </Button>
        </div>
      </Header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AddChannelCard onClick={handleAddChannel} />
            
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                name={channel.name}
                id={channel.id.slice(0, 4)}
                status={channel.status}
                type={channel.uazapi_subdomain ? "WhatsApp QRCode" : "Manual"}
                plan="Trial"
              />
            ))}

            {isLoading && channels.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground font-medium animate-pulse">
                Carregando canais...
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

