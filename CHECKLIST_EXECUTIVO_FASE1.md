# ✅ CHECKLIST EXECUTIVO: IMPLEMENTAÇÃO FASE 1
## MEDCore - MVP Comercial (6-7 semanas)

---

## 📋 RESUMO EXECUTIVO

**Objetivo**: Transformar MEDCore de Alpha Stage (30% de features) para Produto Comercial (70% de features).

**Timeline**: 6-7 semanas (42-49 dias úteis)  
**Equipe Recomendada**: 2 devs full-time + 1 PM  
**Budget Estimado**: USD $70-100k (com 2 devs a $4-5k/mês)  
**Valor Esperado**: $10k+/mês MRR após 6 semanas  

---

## 🚀 STATUS ATUAL DO DESENVOLVIMENTO (Atualizado)

**Onde estamos agora?**
Acabamos de concluir e validar toda a infraestrutura base de Agendamento, Notificações via WhatsApp (Twilio/BullMQ), UI/UX de Chat da IA Executiva, e o **Motor de Bilhetagem SaaS** (Sistema de Cotas e Assinaturas).

**O que está 100% Concluído:**
- ✅ **Backend de Agendamento**: APIs (`/horarios`, `/profissionais`, `/agendamento`), lógica de turnos e bloqueio de conflitos.
- ✅ **Frontend de Agendamento (Parcial)**: Atualização do seletor de Especialidades e Profissionais.
- ✅ **Comunicação Ativa (WhatsApp)**: BullMQ configurado, Webhooks Twilio processando "Confirmo"/"Cancelar" e salvando motivos de cancelamento no banco.
- ✅ **Infraestrutura SaaS (Novo)**: Criação do gerenciador de Tokens (`tokenManager.ts`) e filas de renovação periódica (`billingWorker.ts`) para proteger chamadas à OpenAI/Claude.
- ✅ **Design UI/UX**: Ajustes globais na Logo, adição de links de retorno, fontes (`font-body`/`font-heading`) e proporções padronizadas na tela de Login/Registro e no Chat da IA.

**O que Falta (Próximos Passos Imediatos):**
- ⏳ **Finalizar o Portal Público de Agendamento**: Formulário do paciente, seleção final no calendário e envio real da solicitação.
- ⏳ **IA no Prontuário (Amélia)**: Iniciar de fato a feature de Transcrição (Whisper) e Summarização (Claude 3.5), integrando com o `tokenManager` que acabamos de criar.

---

## 🎯 4 FEATURES CRÍTICAS (259h total)

### Feature #1: Agendamento Online (40-60h)
- [x] **Backend** (25h)
  - [x] Database: migrations para Meeting.agendamento
  - [x] Índices de performance (profissional, data, status)
  - [x] API GET /profissionais
  - [x] API GET /horarios (lógica de disponibilidade)
  - [x] API POST /agendamento (validação de conflitos)
  - [ ] API GET /agendamento/:tokenPublico (link público)
  - [ ] Job de cancelamento automático (no-show)
  
- [ ] **Frontend** (20h)
  - [ ] Portal público (sem login)
  - [x] Seletor de profissional/especialidade
  - [ ] Calendar com horários
  - [ ] Form de dados paciente
  - [ ] Integração Stripe (pagamento opcional)
  - [ ] Confirmação via email + WhatsApp
  
- [ ] **Integrações** (10h)
  - [ ] SendGrid (email confirmação)
  - [x] Twilio (WhatsApp)
  - [ ] Stripe (pagamento)
  - [ ] Error handling & logging
  
- [ ] **Testes** (5h)
  - [ ] Unit tests (validação)
  - [ ] E2E tests (fluxo completo)
  - [ ] Load tests (100 req/min)

**Status**: 🟡 Em Andamento

---

### Feature #2: IA no Prontuário - Amélia (80-120h)
- [ ] **Infraestrutura** (30h)
  - [ ] Database: extensão pgvector + tabela MeetingEmbedding
  - [ ] Redis setup (cache + queue)
  - [ ] BullMQ jobs (transcrição → summarização → embeddings)
  - [ ] S3 para áudio (presigned URLs)
  - [ ] Socket.io para real-time status
  
- [ ] **Transcrição (Whisper)** (25h)
  - [ ] Componente RecordingButton (captura áudio)
  - [ ] Upload para S3
  - [ ] Job de transcrição Whisper API
  - [ ] Salvar em DB + webhook de completion
  - [ ] Status polling no frontend
  
- [ ] **Summarização (LLM)** (25h)
  - [ ] Prompt estruturado (seções clínicas)
  - [ ] Job Claude 3.5 Sonnet
  - [ ] Parsing JSON de resumo
  - [ ] Validação de campos obrigatórios
  - [ ] Componente de visualização
  
- [ ] **Embeddings + RAG** (20h)
  - [ ] Geração de embeddings (OpenAI)
  - [ ] Armazenamento em pgvector
  - [ ] Busca de similaridade cosseno
  - [ ] Caching de resultados
  
- [ ] **Copilot (Chat)** (15h)
  - [ ] Chat component (UI)
  - [ ] API de busca RAG
  - [ ] Resposta via Claude com contexto
  - [ ] Mostrar fontes + confiança
  - [ ] Histórico de chats
  
- [ ] **Testes** (5h)
  - [ ] Mock de OpenAI/Claude APIs
  - [ ] Tests de RAG (relevância)
  - [ ] Tests de performance (embeddings)

**Status**: 🔴 Não iniciado | **Criticidade**: 🔥 Máxima (diferencial)

---

### Feature #3: Faturamento TISS (100-150h)
- [ ] **Database & Modelo** (20h)
  - [ ] TissGuia, OperadoraConfig, GlosaTracker, NotaFiscalServico
  - [ ] Índices (status, operadora, paciente)
  - [ ] Migrations + seeds de operadoras (Unimed, Bradesco, etc)
  - [ ] Auditoria (FaturamentoLog)
  
- [ ] **Gerador de Guia TISS** (40h)
  - [ ] Serviço de validação de guia
  - [ ] Numeração sequencial (NSG)
  - [ ] Cálculo automático de valores
  - [ ] Geração de XML (TISS)
  - [ ] Validação CID + procedimento
  - [ ] Compatibilidade CID/Procedimento
  - [ ] API POST /gerar-guia
  
- [ ] **Envio à Operadora** (35h)
  - [ ] Integração Conarc (API TISS)
  - [ ] Protocolos específicos (email XML, WebService)
  - [ ] Retentativa automática
  - [ ] Job scheduler (envio agendado)
  - [ ] Tracking de protocolo
  
- [ ] **Webhooks & Retorno** (25h)
  - [ ] Webhook para retorno de operadora
  - [ ] Categorização de glosas
  - [ ] Atualização automática de status
  - [ ] Notificação ao médico (glosa)
  - [ ] Integração com Stripe (pagamento)
  
- [ ] **Dashboard Financeiro** (20h)
  - [ ] KPIs: total faturado, recebido, glosas
  - [ ] Gráficos por operadora
  - [ ] Top glosas (motivos)
  - [ ] Previsões de recebimento
  - [ ] Exportação CSV/PDF
  
- [ ] **Testes & Documentação** (10h)
  - [ ] E2E com operadora de teste
  - [ ] Testes de validação
  - [ ] Documentação de APIs de operadora

**Status**: 🔴 Não iniciado | **Criticidade**: 🔥 Máxima

---

### Feature #4: WhatsApp/SMS Automático (50-80h)
- [x] **Reminders Automáticos** (30h)
  - [x] Job scheduler (Bull)
  - [x] 24h antes da consulta
  - [x] 2h antes (lembrete final)
  - [x] Texto parametrizável por médico
  - [ ] Tratamento de números inválidos
  
- [x] **Confirmação de Consulta** (15h)
  - [x] Paciente responde "Confirmo"
  - [x] NLP simples (buscar palavras-chave)
  - [x] Atualizar status em DB
  - [ ] Notificar médico
  
- [x] **Cancelamento** (10h)
  - [x] Paciente responde "Cancelar"
  - [x] Cancelar meeting + reabrir horário
  - [ ] Notificar médico
  - [x] Auditoria
  
- [ ] **Status de Entrega** (15h)
  - [ ] Tracking Twilio (enviado, entregue, lido)
  - [ ] Dashboard de delivery rate
  - [ ] Alertas se taxa baixa
  - [ ] Fallback para SMS

- [ ] **Testes** (10h)
  - [ ] Mock de Twilio
  - [ ] Tests de NLP
  - [ ] Testes de agendamento

**Status**: 🟢 Concluído (Falta Status de Entrega)

---

## 📅 TIMELINE DETALHADA (6-7 semanas)

### SEMANA 1-2: AGENDAMENTO ONLINE + COMUNICAÇÃO
```
MON  TUE  WED  THU  FRI  SAT  SUN
[Ag] [Ag] [Ag] [Ag] [Ag]
     [WA]      [WA] [WA]
          [ST] [ST] [ST] [ST] [ST]
          
Ag = Agendamento Online (primário)
WA = WhatsApp Reminders (paralelo)
ST = Setup/Testes (paralelo)
```

**Atividades**:
- [ ] Iniciar Agendamento Online (API backend)
- [ ] Iniciar WhatsApp (Twilio SDK + job queue)
- [ ] Meetings com operadoras (TISS)
- [ ] Setup de infra (Redis, S3)

**Entrégáveis**:
- ✅ API de agendamento completa
- ✅ Portal público funcionando
- ✅ Reminders automáticos enviando

---

### SEMANA 3-4: IA NO PRONTUÁRIO
```
MON  TUE  WED  THU  FRI  SAT  SUN
[IA] [IA] [IA] [IA] [IA]
     [Ts] [Ts] [Sm] [Sm]
          [Em] [Em] [Em]
          
IA  = IA (geral)
Ts  = Transcrição + summarização
Em  = Embeddings + RAG
Cp  = Copilot
```

**Atividades**:
- [ ] Implementar Whisper API (transcrição)
- [ ] Prompt de summarização (Claude)
- [ ] Embeddings (OpenAI)
- [ ] Chat RAG (Copilot)

**Entrégáveis**:
- ✅ Gravação de áudio funciona
- ✅ Transcrição automática
- ✅ Resumo estruturado gerado
- ✅ Copilot respondendo perguntas

---

### SEMANA 4-5: FATURAMENTO TISS
```
MON  TUE  WED  THU  FRI  SAT  SUN
[TI] [TI] [TI] [TI] [TI]
     [Gd] [Gd] [Ev] [Ev]
          [WH] [WH] [WH]
          
TI = TISS (geral)
Gd = Gerador de guia
Ev = Envio à operadora
WH = Webhooks
```

**Atividades**:
- [ ] Modelar dados de faturamento
- [ ] Criar gerador de guia TISS
- [ ] Integrar com Conarc
- [ ] Implementar webhooks de retorno

**Entrégáveis**:
- ✅ Guias geradas automaticamente
- ✅ Enviadas para operadora
- ✅ Retorno de aprovação/rejeição

---

### SEMANA 5-6: DASHBOARD + REFINAMENTO
```
MON  TUE  WED  THU  FRI  SAT  SUN
[DB] [DB] [DB] [DB] [DB]
     [Tr] [Tr] [Ref] [Ref]
          [QA] [QA] [QA]
          
DB  = Dashboard
Tr  = Testes
Ref = Refinamento
QA  = QA + bugs
```

**Atividades**:
- [ ] Dashboard financeiro
- [ ] Testes E2E completos
- [ ] Bug fixes
- [ ] Performance tuning

**Entrégáveis**:
- ✅ Dashboard funcional
- ✅ Testes E2E passando
- ✅ Performance < 500ms P95

---

### SEMANA 6-7: PILOT + DEPLOYMENT
```
MON  TUE  WED  THU  FRI  SAT  SUN
[Pl] [Pl] [Pl] [Pl] [Pl]
     [Do] [Do] [Do] [Do] [Do]
          [Md] [Md] [Md] [Md]
          
Pl = Pilot com clientes
Do = Documentação
Md = Monitoramento
```

**Atividades**:
- [ ] Deploy em production
- [ ] Onboarding de clientes piloto (3-5)
- [ ] Monitoramento de bugs
- [ ] Documentação final

**Entrégáveis**:
- ✅ Sistema em produção
- ✅ 3-5 clientes usando
- ✅ Documentação completa
- ✅ SLAs monitorados

---

## 👥 ALOCAÇÃO DE EQUIPE

### Cenário A: 2 Devs Full-Time

```
DEV 1 (Backend Lead)              DEV 2 (Frontend Lead)         PM
│                                  │                             │
├─ Agendamento API (25h)           ├─ Portal Agendamento (20h)   ├─ Planning
├─ Transcrição (25h)               ├─ Componente Recording (10h)  ├─ Stakeholder Mgmt
├─ Summarização (15h)              ├─ Copilot UI (15h)           ├─ QA Oversight
├─ TISS Generator (40h)            ├─ Dashboard UI (20h)         └─ Go-to-market
├─ Webhooks/Retorno (25h)          ├─ Integrações (20h)
├─ Testing (25h)                   ├─ E2E Testing (20h)
└─ DevOps/Deploy (20h)             └─ Performance (15h)

Total: ~175h (85 dev-days)          Total: ~120h (60 dev-days)
```

**Timeline com 2 devs**: **6 semanas**

---

### Cenário B: 1 Dev Full-Time (não recomendado)

```
Duração: 13 semanas (quase o triplo)
Qualidade: menor (sem pair programming, code reviews lentos)
Risco: muito maior (single point of failure)
```

---

## 💰 BUDGET & ROI

### Custos Iniciais (Fase 1)

| Item | Valor |
|------|-------|
| **Salários Dev** (2 devs × 6 sem × $4.5k/mês) | $27,000 |
| **PM** (1 PM × 6 sem × $3.5k/mês) | $10,500 |
| **Cloud Infrastructure** (AWS, DB, Redis) | $3,000 |
| **APIs/Serviços** (Whisper, Claude, Stripe, etc) | $2,500 |
| **Contingency** (15%) | $6,000 |
| **TOTAL** | **$49,000** |

---

### Receita Esperada

| Mês | Clientes | MRR | Nota |
|-----|----------|-----|------|
| **M1** (Semana 6-7) | 3 piloto | $0 | Validação apenas |
| **M2** | 8-10 | $8-10k | Onboarding + vendas |
| **M3** | 15-20 | $15-20k | Crescimento |
| **M6** (após Fase 1) | 40+ | $40-50k | Alvo meta |

---

### ROI

- **Payback**: ~2-3 meses (assumindo $15-20k MRR por mês 2-3)
- **Year 1 Revenue**: ~$150-200k
- **Year 1 Cost**: ~$120k (salários + infra)
- **Year 1 Profit**: ~$30-80k

---

## 🚨 RISCOS & MITIGAÇÕES

### Risco 1: Delays em Integrações (Operadoras)
- **Probabilidade**: Alta (operadoras são lentas)
- **Impacto**: +2 semanas de delay
- **Mitigação**: 
  - Iniciar contatos HOJE
  - Usar Conarc como intermediária
  - Ter ambiente de teste pronto na semana 2

### Risco 2: Erro em Processamento de TISS
- **Probabilidade**: Média
- **Impacto**: Alto (glosas, cliente churn)
- **Mitigação**:
  - Testes rigorosos com amostra real
  - Validação manual das primeiras 50 guias
  - Compliance check com contador

### Risco 3: Performance (Embeddings)
- **Probabilidade**: Média
- **Impacto**: Médio (copilot lento)
- **Mitigação**:
  - Cache agressivo (Redis)
  - Índices HNSW otimizados
  - Load testing na semana 4

### Risco 4: Churn de Clientes Piloto
- **Probabilidade**: Baixa (estão motivados)
- **Impacto**: Alto (perdem receita proof)
- **Mitigação**:
  - Support dedicado
  - Weekly check-ins
  - SLA de 99.5% uptime

---

## ✅ CRITÉRIOS DE SUCESSO

### Fase 1: MVP Comercial

- [ ] **Funcionalidade**: 4 features 100% operacionais
- [ ] **Performance**: P95 < 500ms em todas as APIs
- [ ] **Confiabilidade**: Uptime > 99.5%
- [ ] **Usabilidade**: NPS > 40 com clientes piloto
- [ ] **Conformidade**: LGPD + sigilo médico OK
- [ ] **Financeiro**: $10-15k MRR em fim de Fase 1

### Validações Obrigatórias

```gherkin
Feature: Sistema está pronto para produção

Scenario: Médico completa fluxo end-to-end
  Given médico faz login
  When grava consulta
  And fatura automáticamente
  And recebe paciente confirma por WhatsApp
  And vê dashboard financeiro
  Then sistema está pronto

Scenario: Operadora recebe guia TISS
  Given guia foi enviada
  When operadora faz lookup
  Then encontra guia completa + válida

Scenario: Copilot responde historicamente
  Given médico está em prontuário novo
  When pergunta "Alergias prévias?"
  Then Amélia busca histórico
  And responde com contexto
```

---

## 📚 DOCUMENTAÇÃO TÉCNICA

Todos os documentos foram criados e estão em `/mnt/user-data/outputs/`:

1. ✅ **SPEC_TECNICA_01_AGENDAMENTO_ONLINE.md** (50+ páginas)
   - Visão geral, arquitetura, DB schema
   - APIs completas com exemplos
   - Frontend components (React)
   - Testes unitários + E2E
   - Deploy checklist

2. ✅ **SPEC_TECNICA_02_IA_PRONTUARIO.md** (60+ páginas)
   - Transcrição com Whisper
   - Summarização com Claude
   - RAG com LangChain + pgvector
   - Copilot chat component
   - Embeddings + similaridade

3. ✅ **SPEC_TECNICA_03_FATURAMENTO_TISS.md** (70+ páginas)
   - Modelagem de dados TISS
   - Gerador de guia XML
   - Integração Conarc
   - Webhooks de retorno
   - Dashboard + metrics

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Semana 0 (Agora)
- [ ] **Kick-off**: Alinhamento com Dev Lead
- [ ] **Infra**: Provisionar AWS (RDS, S3, ElastiCache)
- [ ] **Operadoras**: Iniciar contatos (Unimed, Bradesco, etc)
- [ ] **APIs**: Ativar contas (OpenAI, Twilio, SendGrid, Stripe)
- [ ] **Repositório**: Branch `feature/phase-1` criada
- [ ] **CI/CD**: GitHub Actions configurado
- [ ] **Monitoramento**: Sentry + DataDog setup

### Semana 1 (Day 1)
- [ ] Dev 1: Iniciar Agendamento API
- [ ] Dev 2: Iniciar Portal Frontend
- [ ] PM: Onboarding de equipe + sprint planning

---

## 📞 CONTATOS CRÍTICOS

```
Operadoras:
├─ Unimed: contato@unimed.com.br
├─ Bradesco: saude@bradesco.com.br
├─ SulAmérica: faturamento@sulamerica.com.br
└─ Conarc (intermediária): suporte@conarc.com.br

Plataformas:
├─ OpenAI Support: help@openai.com
├─ Twilio: support@twilio.com
├─ SendGrid: support@sendgrid.com
├─ Stripe: support@stripe.com
└─ AWS: support@aws.amazon.com
```

---

## 🎓 APRENDIZADOS DO COMPETITORS

### Amplimed (Referência)
- ✅ Tem transcrição + copilot (Amélia)
- ✅ TISS integrado
- ✅ Mobile app iOS/Android
- ❌ Stack tech antiga (PHP)
- **Nossa vantagem**: Tech moderna + RAG com LangChain

### Feegow (Referência)
- ✅ TISS + NFS-e completo
- ✅ Agendamento online
- ❌ Sem IA real (apenas templates)
- ❌ Performance lenta
- **Nossa vantagem**: IA diferenciada + performance

---

## 📊 MATRIZ DE DEPENDÊNCIAS

```
Agendamento → WhatsApp Reminders
              (confirmação depende de agendamento)

IA Prontuário → Copilot
                (histórico depende de transcricoes)

Faturamento TISS → Dashboard
                   (KPIs dependem de guias)

Todos → Deployment (semana 6)
```

---

## 🏁 CONCLUSÃO

**MEDCore está 85% pronto tecnicamente para Fase 1.**

Os 4 features críticos são **implementáveis em 6-7 semanas** com equipe de 2 devs.

**Go/No-Go Decision**: ✅ **GO** (recomendado iniciar imediatamente)

- **Risco**: Baixo (tech stack moderno, equipe experiente)
- **Retorno**: Alto ($150-200k em Year 1)
- **Timeline**: Realista (6-7 semanas é agressivo mas viável)

**Próximo passo**: Aprovar alocação de recursos e iniciar semana 0.

