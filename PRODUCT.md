# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Clínicas médicas de médio porte (foco inicial de vendas), expansível para grandes redes hospitalares. Os usuários primários são médicos (durante o atendimento), faturistas/recepcionistas (operações de backoffice) e administradores da clínica.

## Product Purpose
O MEDCore é um sistema moderno de gestão de clínicas ponta-a-ponta. Seu propósito é eliminar o atrito administrativo e clínico através da Inteligência Artificial, permitindo que a clínica opere de maneira fluida do agendamento até a emissão da fatura.

## Positioning
Diferente de sistemas legados de mercado, o MEDCore possui IA integrada nativamente ao núcleo (A assistente "Dra. Conte"). Ele não apenas guarda dados, mas ativamente ouve consultas, extrai informações estruturadas (RAG) e automatiza a geração das pesadas guias TISS.

## Operating Context
Médicos utilizam durante a consulta com pouco tempo de tela (dependem do áudio). Recepcionistas o utilizam em ritmo acelerado para confirmar agendas via WhatsApp. O faturamento atua em picos no fechamento do mês, precisando de clareza em tabelas de alto volume.

## Capabilities and Constraints
- Agendamento Online com lembretes via WhatsApp (Twilio/NLP).
- Transcrição ultrarrápida (Whisper + Groq) e estruturação RAG (Claude 3.5 Sonnet).
- Motor de exportação XML para o rígido padrão TISS 4.01 da ANS.
- Interface web corporativa rodando em Next.js 15 (Turbopack) e Prisma.

## Brand Commitments
O tom deve ser mantido extremamente profissional, confiável e limpo. A estética visual é cravada na paleta "Medical Navy" (Azul Marinho corporativo, com realces em Cyan e Coral), transmitindo segurança sem ser lúdica ou luxuosa demais.

## Evidence on Hand
O sistema possui 4 features centrais de backend já implementadas e operacionais (Agendamento, Prontuário IA, Faturamento TISS, WhatsApp) e checklists de MVP indicando transição para a fase de Piloto.

## Product Principles
1. **A IA como Operadora Silenciosa**: O médico fala, o sistema estrutura. Menos cliques, mais contexto.
2. **Robustez Financeira Imediata**: Geração de guias TISS e Dashboards não são opcionais, são o coração do negócio da clínica.
3. **Clareza de Aviação**: Interfaces limpas, densidade de dados equilibrada e ações destrutivas bem protegidas, mantendo sempre o tom corporativo confiável.
