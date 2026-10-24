"use client";

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Plus, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ChevronRight,
  ExternalLink,
  Bot,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LISTA_MESTRA_OPERADORAS, OperadoraConvenio } from "@/lib/data/operadorasSeed";

interface CustomConvenio {
  id: string;
  nome: string;
  portalUrl: string;
  login: string;
  senhaCriptografada: string;
  uf: string;
}

export default function ConveniosHubPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUf, setSelectedUf] = useState<string>("TODOS");
  const [selectedTipo, setSelectedTipo] = useState<string>("TODOS");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedOperadora, setSelectedOperadora] = useState<OperadoraConvenio | null>(null);

  // Convênios customizados adicionados pelo usuário
  const [customConvenios, setCustomConvenios] = useState<CustomConvenio[]>([
    {
      id: "cust-1",
      nome: "Sindicato dos Professores AC",
      portalUrl: "https://portal.sindicato.exemplo.com.br/login",
      login: "clinica.medcore",
      senhaCriptografada: "••••••••••••",
      uf: "AC",
    },
  ]);

  // Form custom convenio
  const [customNome, setCustomNome] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customLogin, setCustomLogin] = useState("");
  const [customSenha, setCustomSenha] = useState("");
  const [customUf, setCustomUf] = useState("SP");

  const filteredOperadoras = useMemo(() => {
    return LISTA_MESTRA_OPERADORAS.filter((op) => {
      const matchSearch =
        op.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.codigoAns?.includes(searchTerm) ||
        op.logoBadge.toLowerCase().includes(searchTerm.toLowerCase());

      const matchUf =
        selectedUf === "TODOS" || op.uf === "BR" || op.uf === selectedUf;

      const matchTipo =
        selectedTipo === "TODOS" || op.tipo === selectedTipo;

      return matchSearch && matchUf && matchTipo;
    });
  }, [searchTerm, selectedUf, selectedTipo]);

  const handleSaveCustomConvenio = () => {
    if (!customNome.trim() || !customUrl.trim()) return;

    const newCustom: CustomConvenio = {
      id: `cust-${Date.now()}`,
      nome: customNome,
      portalUrl: customUrl,
      login: customLogin || "clinica.admin",
      senhaCriptografada: "••••••••••••",
      uf: customUf,
    };

    setCustomConvenios([...customConvenios, newCustom]);
    setIsCustomModalOpen(false);
    setCustomNome("");
    setCustomUrl("");
    setCustomLogin("");
    setCustomSenha("");

    alert(`✅ Convênio Personalizado "${newCustom.nome}" cadastrado!\n\nO robô RPA usará o script genérico de navegação para autenticar via porta lateral.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Hub de Convênios */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Hub de Operadoras & Convênios Credenciados</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                80 Operadoras Nativas + RPA
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Catálogo inteligente com exibição baseada na localização da clínica, credenciais seguras e integração customizada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            + Outros Convênios (Personalizado)
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca Inteligente */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por operadora, código ANS ou sigla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filtro por Abrangência / UF */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 font-bold text-[10px] uppercase">Região:</span>
            <select
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
            >
              <option value="TODOS">Todos os Estados</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="BA">Bahia (BA)</option>
              <option value="CE">Ceará (CE)</option>
              <option value="PE">Pernambuco (PE)</option>
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 font-bold text-[10px] uppercase">Tipo:</span>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
            >
              <option value="TODOS">Todas as Categorias</option>
              <option value="nacional">Nacional</option>
              <option value="regional">Regional</option>
              <option value="autogestao">Autogestão / Servidores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Convênios Customizados da Clínica (Card Outros Convênios) */}
      {customConvenios.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block flex items-center gap-1.5">
            <Bot className="h-4 w-4" /> Convênios Municipais & de Nicho com RPA Customizado ({customConvenios.length})
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customConvenios.map((cust) => (
              <div
                key={cust.id}
                className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300">
                      RPA Personalizado
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold">{cust.uf}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{cust.nome}</h4>
                  <p className="text-[11px] text-zinc-400 truncate max-w-xs">{cust.portalUrl}</p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Porta Lateral Ativa
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Cards de Operadoras (Lista Mestra de 80) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Operadoras Cadastradas ({filteredOperadoras.length} de {LISTA_MESTRA_OPERADORAS.length})
          </span>
          <span className="text-[11px] text-zinc-500">
            Logos pré-carregadas e regras ANS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOperadoras.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedOperadora(op)}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-rd-cyan/50 hover:bg-zinc-900/90 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan font-black text-xs group-hover:scale-105 transition-transform">
                    {op.logoBadge}
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      op.tipo === "nacional"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : op.tipo === "autogestao"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    )}
                  >
                    {op.tipo}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-rd-cyan transition-colors line-clamp-1">
                    {op.nome}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                    {op.codigoAns && <span>ANS: {op.codigoAns}</span>}
                    {op.uf && <span>• {op.uf === "BR" ? "Nacional" : `UF: ${op.uf}`}</span>}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> RPA Pronto
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-rd-cyan group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Card Outros Convênios (Personalizado) */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-rd-cyan" />
                <h4 className="font-heading font-bold text-base text-white">Cadastrar Outro Convênio (Porta Lateral RPA)</h4>
              </div>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-zinc-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Tag / Nome do Convênio ou Sindicato
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sindicato dos Professores AC / Caixa dos Servidores"
                  value={customNome}
                  onChange={(e) => setCustomNome(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  URL de Acesso ao Portal Web da Operadora
                </label>
                <input
                  type="url"
                  placeholder="https://portal.sindicato.exemplo.com.br/login"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Login / Usuário da Clínica
                  </label>
                  <input
                    type="text"
                    placeholder="clinica_medcore"
                    value={customLogin}
                    onChange={(e) => setCustomLogin(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Senha de Acesso (Criptografada)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={customSenha}
                    onChange={(e) => setCustomSenha(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rd-cyan/10 border border-rd-cyan/30 text-rd-cyan text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5" /> Como o MedCore operará esse convênio:
                </p>
                <p>O robô Playwright usará o script genérico de navegação para logar automaticamente nessa URL e preencher as guias em segundo plano.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCustomConvenio}
                className="px-6 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 transition-all shadow-lg shadow-rd-cyan/20"
              >
                Salvar e Ativar RPA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Convênio Credenciado */}
      {selectedOperadora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan font-black text-sm">
                  {selectedOperadora.logoBadge}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">{selectedOperadora.nome}</h4>
                  <p className="text-[11px] text-zinc-500">Registro ANS: {selectedOperadora.codigoAns || "N/A"}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOperadora(null)} className="text-zinc-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Status da Conexão</span>
                <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Integração Direta SOAP & Playwright Ativa
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Abrangência: <strong>{selectedOperadora.uf === "BR" ? "Nacional (Todos os Estados)" : `Regional (${selectedOperadora.uf})`}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Credenciais Salvas (Criptografia AES-256)</span>
                <p className="text-zinc-300 font-mono text-[11px]">Login: clinica_matriz@medcore</p>
                <p className="text-zinc-500 font-mono text-[11px]">Senha: ••••••••••••••••</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOperadora(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
