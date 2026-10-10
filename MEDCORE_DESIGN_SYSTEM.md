# 🏥 MedCore Design System & Visual Guidelines
> **Guia Oficial de Padronização Visual, Componentes e Uniformidade de Interface**  
> *Versão:* 2.0 (Fase de Consolidação)  
> *Objetivo:* Garantir 100% de consistência estética e funcional em todos os módulos da plataforma MedCore, eliminando discrepâncias visuais, bordas apagadas e cabeçalhos duplicados.

---

## 📑 Sumário
1. [Diretrizes Inegociáveis de Consistência](#1-diretrizes-inegociáveis-de-consistência)
2. [Paleta Cromática & Design Tokens](#2-paleta-cromática--design-tokens)
3. [Padrão dos Cards: Liquid Glass de Alto Contraste](#3-padrão-dos-cards-liquid-glass-de-alto-contraste)
4. [Padrão de Cabeçalho dos Módulos (Sem Duplicação)](#4-padrão-de-cabeçalho-dos-módulos-sem-duplicação)
5. [Análise dos 4 Primeiros Módulos + Dashboard Base](#5-análise-dos-4-primeiros-módulos--dashboard-base)
   - [Módulo 0: Dashboard Principal](#módulo-0-dashboard-principal-dashboard)
   - [Módulo 1: Pacientes](#módulo-1-pacientes-dashboardpacientes)
   - [Módulo 2: Demandas & Reuniões](#módulo-2-demandas--reuniões-dashboarddemandas)
   - [Módulo 3: Kanban Operacional](#módulo-3-kanban-operacional-dashboardkanban)
   - [Módulo 4: Lembretes & Notificações](#módulo-4-lembretes--notificações-dashboardlembretes)
6. [Componentes Prontos (Copy & Paste Reference)](#6-componentes-prontos-copy--paste-reference)
7. [Nota de Desenvolvimento: Onboarding e Bypass Temporário](#7-nota-de-desenvolvimento-onboarding-e-bypass-temporário)

---

## 1. Diretrizes Inegociáveis de Consistência

Ao criar ou refatorar qualquer módulo no MedCore, siga rigorosamente estas **4 regras fundamentais**:

### 🚫 Regra 1: Zero Títulos Duplicados
- **Nunca** coloque um `<h1>` ou título gigante no corpo da página com o nome do módulo (ex: "Pacientes", "Demandas", "Kanban").
- **Motivo:** O topo da tela (`DashboardHeader.tsx`) **já exibe dinamicamente** o nome do módulo ativo através do mapeamento de rotas.
- **O que colocar no topo da página:** Uma **Action Bar compacta** contendo um resumo descritivo/contadores à esquerda e os botões de ação/busca à direita.

### 💎 Regra 2: Cards "Liquid Glass" de Alto Contraste
- Os cards não podem se misturar com o fundo escuro (`#061224` ou `#09090b`).
- Todo card deve ter **bordas evidentes** (`border border-zinc-700/70` ou `border-2 border-zinc-700` no dark mode), fundo translúcido com profundidade (`bg-zinc-900/80` + `backdrop-blur-xl`) e efeito hover com brilho ciano (`hover:border-rd-cyan/50`).

### 📐 Regra 3: Economia de Espaço Vertical
- Priorize densidade de informação médica profissional.
- Use `gap-4` a `gap-6` e evite margens excessivas (`my-12`).
- As barras de filtros e busca devem ser horizontais e responsivas (`flex flex-col sm:flex-row items-center justify-between`).

### 🛡️ Regra 4: Máscaras Obrigatórias em Inputs Clínicos
- **CNPJ:** Formato `00.000.000/0000-00` (18 caracteres).
- **Telefone:** Dinâmico: Fixo `(00) 0000-0000` (10 dígitos) e Celular `(00) 00000-0000` (11 dígitos).
- **E-mail:** Forçar sempre em caixa baixa (`toLowerCase()`) e remoção automática de espaços acidentais.

---

## 2. Paleta Cromática & Design Tokens

### Cores Principais
| Token | Hex / HSL | Finalidade |
|---|---|---|
| `--color-rd-cyan` | `#00A9FF` | **Ação Principal & Tecnologia** (botões ativos, bordas com glow, links, badges de destaque) |
| `--color-rd-navy` | `#0F2C59` | **Base Médica** (profundidade, fundos de cabeçalho, contraste corporativo) |
| `--color-background` | `#061224` / `#09090b` | **Fundo Geral Dark** (quase preto clínico, imersivo) |
| `--color-surface` | `#18181b` (`zinc-900`) | **Fundo Base dos Cards** (superfície elevada) |
| `border-zinc-700` | `#3f3f46` | **Bordas dos Cards** (garante separação nítida contra o fundo) |

### Cores Semânticas de Status
- **Sucesso / Concluído:** `text-emerald-400 bg-emerald-500/10 border-emerald-500/20`
- **Atenção / Pendente:** `text-amber-400 bg-amber-500/10 border-amber-500/20`
- **Crítico / Urgente:** `text-rose-400 bg-rose-500/10 border-rose-500/20`
- **Informativo / Neutro:** `text-sky-400 bg-sky-500/10 border-sky-500/20`

---

## 3. Padrão dos Cards: Liquid Glass de Alto Contraste

Para resolver o problema de cards com linhas finas que se perdem no fundo, a especificação padrão de card é:

```tsx
<div className="
  relative overflow-hidden
  bg-white dark:bg-zinc-900/85 
  backdrop-blur-xl 
  border-2 border-zinc-200 dark:border-zinc-700/80
  rounded-2xl p-5 
  shadow-md hover:shadow-xl hover:shadow-rd-cyan/5 
  hover:border-rd-cyan/50 
  transition-all duration-300 group
">
  {/* Gradiente sutil interno para profundidade Liquid Glass */}
  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
  
  {/* Conteúdo do Card */}
  <div className="relative z-10">
    {children}
  </div>
</div>
```

### Características Obrigatórias:
1. `border-2 border-zinc-200 dark:border-zinc-700/80`: Garante espessura e contraste mesmo em monitores com calibração escura.
2. `bg-zinc-900/85` + `backdrop-blur-xl`: Sensação premium de vidro clínico fosco.
3. `hover:border-rd-cyan/50`: Feedback visual imediato ao passar o mouse.
4. `rounded-2xl`: Arredondamento suave e moderno alinhado ao sistema.

---

## 4. Padrão de Cabeçalho dos Módulos (Sem Duplicação)

Todo módulo deve começar com esta **Action Bar compacta** que substitui cabeçalhos redundantes:

```tsx
{/* Action Bar Superior do Módulo */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-2xl shadow-sm backdrop-blur-md">
  {/* Lado Esquerdo: Resumo ou Contadores em tempo real */}
  <div className="flex items-center gap-3">
    <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span className="text-rd-cyan font-bold">{totalAtivos}</span> itens ativos em processamento
      </p>
    </div>
  </div>

  {/* Lado Direito: Filtros, Busca e Botão de Ação Primária */}
  <div className="flex flex-wrap items-center gap-3">
    {/* Campo de Busca Opcional */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
      <input 
        type="text" 
        placeholder="Buscar..."
        className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan w-48 sm:w-60 font-medium transition-all"
      />
    </div>

    {/* Botão de Criação Principal */}
    <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
      <Plus size={16} /> Novo Registro
    </button>
  </div>
</div>
```

---

## 5. Análise dos 4 Primeiros Módulos + Dashboard Base

### Módulo 0: Dashboard Principal (`/dashboard`)
- **Destaque Visual:** StatCards métricos com Sparklines SVG dinâmicas (`text-rd-cyan` e `text-emerald-500`).
- **Arquitetura:** Grid responsivo de 4 colunas em telas grandes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- **Widgets:** Sistema drag-and-drop com `DashboardWidget` com bordas definidas e cantos `rounded-2xl`.

### Módulo 1: Pacientes (`/dashboard/pacientes`)
- **Destaque Visual:** Tabela de listagem com avatares em gradiente (`bg-gradient-to-br from-blue-600 to-indigo-600`).
- **Linhas da Tabela:** `hover:bg-zinc-800/50 transition-colors` com divisores sutis `divide-zinc-800`.
- **Modais:** Efeito de overlay escurecido `bg-black/60 backdrop-blur-md` com caixa de diálogo `bg-zinc-900 border border-zinc-800 rounded-3xl`.

### Módulo 2: Demandas & Reuniões (`/dashboard/demandas`)
- **Destaque Visual:** Bloco destacado "📅 Escala de Hoje" com borda sutil ciano (`bg-primary/5 border border-primary/20`).
- **Cards de Reunião:** Painel de detalhes com participantes agrupados em badges ovais (`rounded-full bg-zinc-800 px-3 py-1`).
- **Ações:** Botões utilitários com download de PDF e planilha Excel integrados.

### Módulo 3: Kanban Operacional (`/dashboard/kanban`)
- **Destaque Visual:** Colunas com topo colorido de 4px (`border-t-4`) para diferenciar o ciclo de trabalho (A Fazer, Em Andamento, Concluído, Arquivado).
- **Cards Arrastáveis:** Estrutura reforçada:
  - `border-2 border-zinc-700`: Não se confunde com o fundo da coluna.
  - Hover glow: `hover:border-rd-cyan/50 hover:shadow-lg`.
  - Tags operacionais com ícone de etiqueta: `bg-rd-cyan/5 text-rd-cyan border border-rd-cyan/10`.
  - Bandeiras de prioridade semântica (Baixa, Média, Alta, Crítica).
- **Alternador de Visualização:** Toggle de botões para alternar entre "Board Kanban" e "Tabela Lista".

### Módulo 4: Lembretes & Notificações (`/dashboard/lembretes`)
- **Destaque Visual:** Abas tipo pílula ("Todos", "Fixos 📌", "Avulsos") com fundo `bg-zinc-900 p-1.5 rounded-2xl`.
- **Cartões de Tarefa:**
  - Checkbox interativo com ícone `CheckCircle2` que risca o título ao concluir.
  - Alerta de atraso visual em vermelho suave (`border-error/40 bg-red-500/10 text-rose-400`).
  - Botão de envio rápido com 1 clique para API do WhatsApp com ícone verde `bg-emerald-500/10 text-emerald-400`.

---

## 6. Componentes Prontos (Copy & Paste Reference)

Copie e use estes componentes prontos ao implementar ou atualizar qualquer tela no MedCore:

### 1. Card com Efeito Liquid Glass
```tsx
import React from "react";

export function LiquidCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`
      relative overflow-hidden
      bg-zinc-900/85 backdrop-blur-xl 
      border-2 border-zinc-700/80 
      rounded-2xl p-5 
      shadow-md hover:shadow-xl hover:shadow-rd-cyan/5 hover:border-rd-cyan/50 
      transition-all duration-300 group
      ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
```

### 2. Badge de Status Padronizada
```tsx
export function StatusBadge({ status, type = "info" }: { status: string, type?: "success" | "warning" | "danger" | "info" }) {
  const styles = {
    success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    danger:  "text-rose-400 bg-rose-500/10 border-rose-500/20",
    info:    "text-rd-cyan bg-rd-cyan/10 border-rd-cyan/20",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[type]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}
```

### 3. Funções de Máscara de Entrada
```typescript
export const maskCnpj = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

export const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  
  if (v.length <= 10) {
    // Fixo: (XX) XXXX-XXXX
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (XX) XXXXX-XXXX
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
  }
  return v;
};
```

---

## 7. Nota de Desenvolvimento: Onboarding e Bypass Temporário

> [!IMPORTANT]
> **Modo Temporário de Desenvolvimento Ativado:**  
> Durante esta fase de finalização da plataforma e testes de UI/UX no `localhost`, foi adicionado no componente [`UnitGate.tsx`](src/features/dashboard/components/UnitGate.tsx) a opção:
> **`Registrar hospital depois (Modo Teste)`**
> 
> - **Finalidade:** Permitir navegação livre e testes de todos os módulos sem travar na tela de cadastro caso a porta remota do banco esteja inacessível.
> - **Deploy Final para VPS:** Quando o projeto for publicado em versão final para a VPS de produção com o PostgreSQL conectado via rede interna do Coolify, essa opção de pular será desativada para que todo usuário seja obrigado a cadastrar seu hospital/ambiente de trabalho oficial.

---
*MedCore v2 — Ecossistema Clínico & Hospitalar Inteligente.*
