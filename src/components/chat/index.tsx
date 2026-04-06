"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Bot, 
  User, 
  ChevronDown, 
  Paperclip, 
  Send, 
  Smile, 
  Settings,
  RefreshCw,
  Smartphone
} from "lucide-react";
import { Input, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { uazapi } from "@/lib/uazapi";

/**
 * Empty Chat State
 */
export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 select-none pointer-events-none">
      <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 ring-4 ring-primary/5 animate-pulse">
        <MessageSquare size={48} className="text-primary/40" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Selecione uma conversa</h3>
      <p className="text-sm text-muted-foreground max-w-[320px]">Escolha uma conversa da lista ao lado para começar a visualizar as mensagens</p>
    </div>
  );
}

/**
 * Conversation List Sidebar
 */
export function ChatSidebar({ onSelect, selectedId }: { onSelect?: (contact: any) => void, selectedId?: string }) {
  const [activeTab, setActiveTab] = useState("Todas");
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const tabs = ["Todas", "IA", "Minhas", "Outras"];
  
  useEffect(() => {
    fetchContacts();

    const channel = supabase
      .channel("public:contacts")
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, () => {
        fetchContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*, messages(body, created_at, from_me)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[380px] h-full flex flex-col border-r border-border bg-white flex-shrink-0 animate-in slide-in-from-left-4 duration-300 shadow-sm">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white ring-4 ring-green-500/10">
                <Smartphone size={20} />
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-900 leading-none">Canal Ativo</h4>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] uppercase tracking-wider font-bold text-green-600">Conectado</span>
                </div>
             </div>
          </div>
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400" onClick={fetchContacts}>
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Input placeholder="Pesquisar conversas..." icon={<Search size={16} />} />
          <button className="p-2 border border-border rounded-lg hover:bg-slate-50 transition-colors text-muted-foreground">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-primary text-white shadow-sm ring-2 ring-primary/20" 
                  : "text-muted-foreground hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => onSelect?.(contact)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors group relative",
                selectedId === contact.id && "bg-slate-50"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:border-primary/30 transition-colors overflow-hidden">
                  {contact.profile_picture ? (
                    <img src={contact.profile_picture} alt={contact.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{contact.name || contact.jid.split("@")[0]}</h5>
                  <span className="text-[10px] font-bold text-slate-400">14:00</span>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">Sem mensagens recentes</p>
              </div>
              
              {selectedId === contact.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-100 transition-transform origin-center" />
              )}
            </button>
          ))}

          {contacts.length === 0 && !isLoading && (
            <div className="p-8 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-50">
               Nenhum contato encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Chat Window
 */
export function ChatWindow({ contact }: { contact: any | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (contact) {
      fetchMessages();

      const channel = supabase
        .channel(`public:messages:contact:${contact.id}`)
        .on("postgres_changes", { 
          event: "INSERT", 
          schema: "public", 
          table: "messages",
          filter: `contact_id=eq.${contact.id}`
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [contact]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("contact_id", contact.id)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || !contact) return;

    setIsSending(true);
    try {
      // 1. Inserir no Supabase primeiro (otimista)
      const { data: msgData, error: msgError } = await supabase.from("messages").insert([
        {
          contact_id: contact.id,
          channel_id: contact.channel_id,
          body: inputText,
          from_me: true,
          status: "sent"
        }
      ]).select();

      if (msgError) throw msgError;

      // 2. Enviar via UazAPI
      // uazapi.sendText(CHANNEL_TOKEN, contact.jid, inputText)
      
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!contact) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative animate-in fade-in duration-300">
      <div className="flex border-b border-border bg-slate-50/50">
        <button className="px-6 py-4 text-xs font-bold text-primary border-b-2 border-primary border-b-[3px] flex items-center gap-2">
           <MessageSquare size={16} /> Bate papo
        </button>
        <button className="px-6 py-4 text-xs font-bold text-muted-foreground hover:bg-slate-100/50 flex items-center gap-2 transition-colors">
           <Settings size={16} /> Configurações
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col gap-1 max-w-[80%]",
            msg.from_me ? "self-end items-end" : "items-start"
          )}>
            <div className={cn(
              "px-4 py-2.5 text-sm leading-relaxed shadow-sm",
              msg.from_me 
                ? "bg-primary text-white rounded-2xl rounded-tr-none shadow-primary/10" 
                : "bg-white border border-border text-slate-800 rounded-2xl rounded-tl-none"
            )}>
              {msg.body}
            </div>
            <span className="text-[9px] font-bold text-slate-400 px-1 uppercase tracking-wider">
               {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-white">
        <form className="flex items-center gap-3 bg-slate-50/80 p-1.5 rounded-xl ring-1 ring-slate-100" onSubmit={handleSendMessage}>
          <div className="flex items-center">
             <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg">
               <Smile size={20} />
             </button>
             <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg">
               <Paperclip size={20} />
             </button>
          </div>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 placeholder:text-muted-foreground"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}


