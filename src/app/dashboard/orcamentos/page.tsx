"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Unlock, 
  DollarSign, 
  FileText, 
  Send, 
  Clock, 
  CreditCard,
  User,
  ShieldAlert,
  Sparkles,
  Building,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetItem {
  id: string;
  category: "honorarios" | "taxa_sala" | "materiais" | "anestesia" | "diaria";
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function OrcamentosPage() {
  const [patientName, setPatientName] = useState("Mariana Silva");
  const [patientCpf, setPatientCpf] = useState("123.456.789-00");
  const [procedureTitle, setProcedureTitle] = useState("Rinoplastia Estruturada + Septoplastia Funcional");
  const [paymentStatus, setPaymentStatus] = useState<"pendente" | "aprovado" | "parcial">("pendente");

  const [items, setItems] = useState<BudgetItem[]>([
    { id: "1", category: "honorarios", description: "Honorários Cirúrgicos (Cirurgião Principal)", quantity: 1, unitPrice: 12000 },
    { id: "2", category: "anestesia", description: "Honorários da Equipe de Anestesiologia", quantity: 1, unitPrice: 3500 },
    { id: "3", category: "taxa_sala", description: "Taxa de Uso do Centro Cirúrgico (3 Horas)", quantity: 3, unitPrice: 850 },
    { id: "4", category: "materiais", description: "Kit de Ósteotomia Ultrassônica + Fios Monofilamentares", quantity: 1, unitPrice: 2200 },
    { id: "5", category: "diaria", description: "Diária de Internação em Day Hospital com Enfermagem", quantity: 1, unitPrice: 1500 },
  ]);

  // Novo item formulário
  const [newCategory, setNewCategory] = useState<BudgetItem["category"]>("materiais");
  const [newDesc, setNewDesc] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState(0);

  const totalValue = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  const handleAddItem = () => {
    if (!newDesc.trim() || newPrice <= 0) return;
    const item: BudgetItem = {
      id: Date.now().toString(),
      category: newCategory,
      description: newDesc,
      quantity: newQty,
      unitPrice: newPrice,
    };
    setItems([...items, item]);
    setNewDesc("");
    setNewPrice(0);
    setNewQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleApproveCredit = () => {
    setPaymentStatus("aprovado");
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${patientName}! Seu orçamento detalhado para *${procedureTitle}* no MedCore foi gerado:\n\n` +
      `*Valor Total:* ${totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n` +
      `*Status de Liberação:* ${paymentStatus === "aprovado" ? "LIBERADO PARA AGENDAMENTO CIRÚRGICO" : "AGUARDANDO PAGAMENTO/CRÉDITO"}\n\n` +
      `Para aprovar via PIX ou Cartão em até 12x, responda a esta mensagem.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Módulo de Orçamentos */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <Calculator className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Construtor de Orçamentos Cirúrgicos & Ambulatoriais</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                Conta Corrente Paciente
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Composição de taxas hospitalares, honorários médicos, insumos e trava financeira de agendamento.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Send className="h-4 w-4" />
            Enviar WhatsApp
          </button>
        </div>
      </div>

      {/* Trava Financeira de Agendamento (Critério de Aceite) */}
      <div className={cn(
        "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-lg",
        paymentStatus === "aprovado"
          ? "bg-emerald-950/30 border-emerald-500/40"
          : "bg-amber-950/30 border-amber-500/40"
      )}>
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center font-bold",
            paymentStatus === "aprovado" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
          )}>
            {paymentStatus === "aprovado" ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Status do Procedimento:{" "}
              <span className={paymentStatus === "aprovado" ? "text-emerald-400" : "text-amber-400"}>
                {paymentStatus === "aprovado" ? "LIBERADO PARA O CENTRO CIRÚRGICO" : "BLOQUEADO NO AGENDAMENTO (TRAVA FINANCEIRA)"}
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              {paymentStatus === "aprovado"
                ? "Pagamento/crédito validado. O paciente já pode ter seu horário reservado na escala cirúrgica."
                : "Regra operacional: o paciente só entra na escala após sinal de 30% ou aprovação de crédito na conta corrente."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {paymentStatus !== "aprovado" ? (
            <button
              onClick={handleApproveCredit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <Check className="h-4 w-4" />
              Aprovar Crédito / Baixa
            </button>
          ) : (
            <button
              onClick={() => setPaymentStatus("pendente")}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all"
            >
              Reabrir Orçamento
            </button>
          )}
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adicionar Insumo / Taxa */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Compor Item de Custo</h4>
              <p className="text-xs text-zinc-400">Honorários, sala, materiais e anestesia</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Categoria de Custo
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan cursor-pointer font-medium"
              >
                <option value="honorarios">Honorários Médicos</option>
                <option value="anestesia">Equipe de Anestesiologia</option>
                <option value="taxa_sala">Taxa de Centro Cirúrgico / Sala</option>
                <option value="materiais">Materiais Especiais & OPME</option>
                <option value="diaria">Diária de Leito / Hospitalar</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Descrição do Item
              </label>
              <input
                type="text"
                placeholder="Ex: Prótese de Silicone 320ml, Fio de Sutura..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Quantidade / Horas
                </label>
                <input
                  type="number"
                  min={1}
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Valor Unitário (R$)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>
            </div>

            <button
              onClick={handleAddItem}
              className="w-full py-2.5 rounded-xl bg-rd-cyan/20 border border-rd-cyan/40 text-rd-cyan hover:bg-rd-cyan hover:text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              + Inserir no Orçamento
            </button>
          </div>
        </div>

        {/* Tabela de Itens e Resumo Financeiro */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="font-bold text-base text-white">{procedureTitle}</h4>
                <p className="text-xs text-zinc-400">Paciente: {patientName} • CPF: {patientCpf}</p>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {items.length} itens listados
              </span>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                        {item.category}
                      </span>
                      <span className="font-bold text-white text-sm">{item.description}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      {item.quantity}x de {item.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-rd-cyan">
                      {(item.quantity * item.unitPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1.5 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totalizadores */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950/40 p-4 rounded-2xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">
                  Valor Total do Pacote
                </span>
                <span className="text-3xl font-black text-white">
                  {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Ou até 10x de {(totalValue / 10).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sem juros
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Imprimindo proposta contratual oficial em PDF...")}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700"
                >
                  Imprimir Proposta
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
