"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        alert("Conta criada! Verifique seu e-mail para confirmar.");
      }
    } catch (error: any) {
      alert(error.message || "Erro na autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Logo Area */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 ring-1 ring-slate-100">
          <span className="text-primary font-bold text-3xl">D</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent italic">
          Datafy <span className="text-primary not-italic">Chats</span>
        </h1>
      </div>

      <Card className="w-full max-w-md p-0 overflow-hidden border-none shadow-xl ring-1 ring-slate-200">
        {/* Tabs */}
        <div className="flex bg-slate-100/50 p-1.5 gap-2">
          <button
            onClick={() => setActiveTab("login")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all",
              activeTab === "login" 
                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                : "text-muted-foreground hover:bg-white/50"
            )}
          >
            <LogIn size={16} /> Entrar
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all",
              activeTab === "signup" 
                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                : "text-muted-foreground hover:bg-white/50"
            )}
          >
            <UserPlus size={16} /> Criar Conta
          </button>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {activeTab === "signup" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Nome Completo</label>
                <Input 
                  placeholder="Digite seu nome" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<UserPlus size={18} />} 
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 font-sans">E-mail</label>
              <Input 
                type="email" 
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
                {activeTab === "login" && (
                  <button type="button" className="text-xs text-primary font-medium hover:underline">
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20" 
              loading={isLoading}
              type="submit"
            >
              {activeTab === "login" ? "Entrar" : "Criar Minha Conta"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

